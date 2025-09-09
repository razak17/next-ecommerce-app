import "server-only";

import { count, desc, eq } from "drizzle-orm";
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from "next/cache";

import { db } from "@/db/drizzle";
import { categories, favorites, products, subcategories } from "@/db/schema";

export async function getUserFavorites(userId: string) {
  noStore();

  try {
    const userFavorites = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        images: products.images,
        category: categories.name,
        subcategory: subcategories.name,
        price: products.price,
        inventory: products.inventory,
        rating: products.rating,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        favoritedAt: favorites.createdAt,
      })
      .from(favorites)
      .innerJoin(products, eq(favorites.productId, products.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(subcategories, eq(products.subcategoryId, subcategories.id))
      .where(eq(favorites.userId, userId))
      .orderBy(desc(favorites.createdAt));

    return userFavorites;
  } catch (error) {
    console.error("Error fetching user favorites:", error);
    return [];
  }
}

export async function getUserFavoritesCount(userId: string) {
  return await cache(
    async () => {
      try {
        const result = await db
          .select({
            count: count(),
          })
          .from(favorites)
          .where(eq(favorites.userId, userId));

        return result[0]?.count ?? 0;
      } catch (error) {
        console.error("Error fetching favorites count:", error);
        return 0;
      }
    },
    [`favorites-count-${userId}`],
    {
      revalidate: 300,
      tags: [`favorites-count-${userId}`],
    },
  )();
}
