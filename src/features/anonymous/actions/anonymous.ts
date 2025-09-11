"use server";

import { eq } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";

import { getErrorMessage } from "@/lib/handle-error";

import { db } from "@/db/drizzle";
import { favorites } from "@/db/schema";

export async function linkAnonymousFavoritesToUser(
  anonymousUserId: string,
  userId: string,
) {
  noStore();

  try {
    // Get all favorites from the anonymous user
    const anonymousFavorites = await db
      .select({ productId: favorites.productId })
      .from(favorites)
      .where(eq(favorites.userId, anonymousUserId));

    if (anonymousFavorites.length === 0) {
      return;
    }

    // Get existing favorites for the authenticated user
    const existingFavorites = await db
      .select({ productId: favorites.productId })
      .from(favorites)
      .where(eq(favorites.userId, userId));

    const existingProductIds = new Set(
      existingFavorites.map((f) => f.productId),
    );

    // Filter out products that are already in the user's favorites
    const newFavorites = anonymousFavorites.filter(
      (f) => !existingProductIds.has(f.productId),
    );

    if (newFavorites.length > 0) {
      // Insert new favorites for the authenticated user
      await db.insert(favorites).values(
        newFavorites.map((f) => ({
          userId,
          productId: f.productId,
        })),
      );
    }

    // Delete anonymous user's favorites
    await db.delete(favorites).where(eq(favorites.userId, anonymousUserId));
  } catch (error) {
    console.error("Error linking anonymous favorites to user:", error);
    throw new Error(getErrorMessage(error));
  }
}
