"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { getErrorMessage } from "@/lib/handle-error";

import { db } from "@/db/drizzle";
import { products, reviews } from "@/db/schema";
import type {
  CreateReviewSchema,
  DeleteReviewSchema,
  UpdateReviewSchema,
} from "../validations/reviews";

export async function createReview(input: CreateReviewSchema) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("You must be signed in to leave a review.");
    }

    // Check if user already reviewed this product
    const existingReview = await db.query.reviews.findFirst({
      where: and(
        eq(reviews.productId, input.productId),
        eq(reviews.userId, session.user.id),
      ),
    });

    if (existingReview) {
      throw new Error("You have already reviewed this product.");
    }

    // Verify product exists
    const product = await db.query.products.findFirst({
      where: eq(products.id, input.productId),
    });

    if (!product) {
      throw new Error("Product not found.");
    }

    const [newReview] = await db
      .insert(reviews)
      .values({
        productId: input.productId,
        userId: session.user.id,
        rating: input.rating,
        title: input.title,
        content: input.content,
      })
      .returning();

    // Update product average rating
    await updateProductAverageRating(input.productId);

    revalidatePath(`/products/${input.productId}`);
    return { data: newReview, error: null };
  } catch (err) {
    return { data: null, error: getErrorMessage(err) };
  }
}

export async function updateReview(input: UpdateReviewSchema) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("You must be signed in to update a review.");
    }

    // Check if review exists and belongs to user
    const existingReview = await db.query.reviews.findFirst({
      where: eq(reviews.id, input.id),
    });

    if (!existingReview) {
      throw new Error("Review not found.");
    }

    if (existingReview.userId !== session.user.id) {
      throw new Error("You can only update your own reviews.");
    }

    const [updatedReview] = await db
      .update(reviews)
      .set({
        rating: input.rating,
        title: input.title,
        content: input.content,
        updatedAt: new Date(),
      })
      .where(eq(reviews.id, input.id))
      .returning();

    // Update product average rating
    await updateProductAverageRating(existingReview.productId);

    revalidatePath(`/products/${existingReview.productId}`);
    return { data: updatedReview, error: null };
  } catch (err) {
    return { data: null, error: getErrorMessage(err) };
  }
}

export async function deleteReview(input: DeleteReviewSchema) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("You must be signed in to delete a review.");
    }

    // Check if review exists and belongs to user (or user is admin)
    const existingReview = await db.query.reviews.findFirst({
      where: eq(reviews.id, input.id),
    });

    if (!existingReview) {
      throw new Error("Review not found.");
    }

    if (
      existingReview.userId !== session.user.id &&
      session.user.role !== "admin"
    ) {
      throw new Error("You can only delete your own reviews.");
    }

    await db.delete(reviews).where(eq(reviews.id, input.id));

    // Update product average rating
    await updateProductAverageRating(existingReview.productId);

    revalidatePath(`/products/${existingReview.productId}`);
    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: getErrorMessage(err) };
  }
}

async function updateProductAverageRating(productId: string) {
  const result = await db
    .select({
      avgRating: sql<number>`AVG(${reviews.rating})`,
    })
    .from(reviews)
    .where(eq(reviews.productId, productId));

  const avgRating = result[0]?.avgRating || 0;
  const roundedRating = Math.round(avgRating);

  await db
    .update(products)
    .set({ rating: roundedRating })
    .where(eq(products.id, productId));
}
