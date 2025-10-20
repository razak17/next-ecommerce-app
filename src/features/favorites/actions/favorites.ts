"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { getErrorMessage } from "@/lib/handle-error";

import { db } from "@/db/drizzle";
import { favorites, type Product } from "@/db/schema";

export async function toggleFavorite(productId: Product["id"]) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      throw new Error("You must be logged in to favorite products");
    }

    const existingFavorite = await db.query.favorites.findFirst({
      where: and(
        eq(favorites.userId, session.user.id),
        eq(favorites.productId, productId),
      ),
    });

    if (existingFavorite) {
      await db
        .delete(favorites)
        .where(
          and(
            eq(favorites.userId, session.user.id),
            eq(favorites.productId, productId),
          ),
        );
    } else {
      await db.insert(favorites).values({
        userId: session.user.id,
        productId,
      });
    }

    revalidatePath("/favorites");
    revalidatePath("/shop");
    revalidatePath("/cart");
    revalidatePath("/");

    return {
      success: true,
      isFavorited: !existingFavorite,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      isFavorited: false,
      error: getErrorMessage(error),
    };
  }
}
