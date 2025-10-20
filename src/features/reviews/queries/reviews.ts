import "server-only";

import { and, asc, count, desc, eq, sql } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";

import { db } from "@/db/drizzle";
import { products, reviews, user } from "@/db/schema";
import type { SearchParams } from "@/types";
import { getReviewsSchema } from "../validations/reviews";

export async function getProductReviews(
  productId: string,
  searchParams?: SearchParams,
) {
  noStore();

  const { page, per_page, sort } = getReviewsSchema.parse(searchParams);

  const offset = (page - 1) * per_page;
  const [column, order] = (sort?.split(".") ?? ["createdAt", "desc"]) as [
    keyof typeof reviews.$inferSelect | undefined,
    "asc" | "desc" | undefined,
  ];

  const data = await db
    .select({
      review: reviews,
      user: {
        id: user.id,
        name: user.name,
        image: user.image,
      },
    })
    .from(reviews)
    .leftJoin(user, eq(reviews.userId, user.id))
    .where(eq(reviews.productId, productId))
    .limit(per_page)
    .offset(offset)
    .orderBy(
      order === "asc"
        ? asc(reviews[column ?? "createdAt"])
        : desc(reviews[column ?? "createdAt"]),
    );

  const countResult = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(reviews)
    .where(eq(reviews.productId, productId));

  const totalCount = Number(countResult[0]?.count) ?? 0;

  const pageCount = Math.ceil(totalCount / per_page);

  return { data, pageCount };
}

export async function getUserReviews(
  userId: string,
  searchParams?: SearchParams,
) {
  noStore();

  const { page, per_page, sort } = getReviewsSchema.parse(searchParams);

  const offset = (page - 1) * per_page;
  const [column, order] = (sort?.split(".") ?? ["createdAt", "desc"]) as [
    keyof typeof reviews.$inferSelect | undefined,
    "asc" | "desc" | undefined,
  ];

  const data = await db
    .select({
      review: reviews,
      product: {
        id: products.id,
        name: products.name,
        images: products.images,
      },
    })
    .from(reviews)
    .leftJoin(products, eq(reviews.productId, products.id))
    .where(eq(reviews.userId, userId))
    .limit(per_page)
    .offset(offset)
    .orderBy(
      order === "asc"
        ? asc(reviews[column ?? "createdAt"])
        : desc(reviews[column ?? "createdAt"]),
    );

  const countResult = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(reviews)
    .where(eq(reviews.userId, userId));

  const totalCount = Number(countResult[0]?.count) ?? 0;

  const pageCount = Math.ceil(totalCount / per_page);

  return { data, pageCount };
}

export async function getReviewById(id: string) {
  noStore();

  return await db.query.reviews.findFirst({
    where: eq(reviews.id, id),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          image: true,
        },
      },
      product: {
        columns: {
          id: true,
          name: true,
          images: true,
        },
      },
    },
  });
}

export async function getUserReviewForProduct(
  userId: string,
  productId: string,
) {
  noStore();

  return await db.query.reviews.findFirst({
    where: and(eq(reviews.userId, userId), eq(reviews.productId, productId)),
  });
}
export async function getProductReviewStats(productId: string) {
  noStore();

  // Get total reviews and average rating
  const overallStats = await db
    .select({
      totalReviews: count(),
      averageRating: sql<number>`AVG(${reviews.rating})`,
    })
    .from(reviews)
    .where(eq(reviews.productId, productId));

  // Get rating distribution
  const ratingDistribution = await db
    .select({
      rating: reviews.rating,
      count: count(),
    })
    .from(reviews)
    .where(eq(reviews.productId, productId))
    .groupBy(reviews.rating)
    .orderBy(asc(reviews.rating));

  return {
    totalReviews: overallStats[0]?.totalReviews ?? 0,
    averageRating: Number(overallStats[0]?.averageRating) ?? 0,
    ratingDistribution: ratingDistribution.map((item) => ({
      rating: item.rating,
      count: item.count,
    })),
  };
}

export async function getAllReviews(searchParams?: SearchParams) {
  noStore();

  const { page, per_page, sort } = getReviewsSchema.parse(searchParams);

  const offset = (page - 1) * per_page;
  const [column, order] = (sort?.split(".") ?? ["createdAt", "desc"]) as [
    keyof typeof reviews.$inferSelect | undefined,
    "asc" | "desc" | undefined,
  ];

  const data = await db
    .select({
      review: reviews,
      user: {
        id: user.id,
        name: user.name,
        image: user.image,
      },
      product: {
        id: products.id,
        name: products.name,
        images: products.images,
      },
    })
    .from(reviews)
    .leftJoin(user, eq(reviews.userId, user.id))
    .leftJoin(products, eq(reviews.productId, products.id))
    .limit(per_page)
    .offset(offset)
    .orderBy(
      order === "asc"
        ? asc(reviews[column ?? "createdAt"])
        : desc(reviews[column ?? "createdAt"]),
    );

  const countResult = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(reviews);

  const totalCount = Number(countResult[0]?.count) ?? 0;

  const pageCount = Math.ceil(totalCount / per_page);

  return { data, pageCount };
}
