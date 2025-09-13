"use server";

import { asc, eq, inArray } from "drizzle-orm";
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from "next/cache";
import { cookies } from "next/headers";

import { db } from "@/db/drizzle";
import { carts, categories, products, subcategories } from "@/db/schema";
import type { CartLineItemSchema } from "@/features/cart/validations/cart";

export async function getCart(): Promise<CartLineItemSchema[]> {
  noStore();

  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;

  if (!cartId) return [];

  try {
    const cart = await db.query.carts.findFirst({
      columns: {
        items: true,
      },
      where: eq(carts.id, cartId),
    });

    const productIds = cart?.items?.map((item) => item.productId) ?? [];

    if (productIds.length === 0) return [];

    const uniqueProductIds = [...new Set(productIds)];

    const cartLineItems = await db
      .select({
        id: products.id,
        name: products.name,
        images: products.images,
        category: categories.name,
        subcategory: subcategories.name,
        price: products.price,
        inventory: products.inventory,
      })
      .from(products)
      .leftJoin(categories, eq(categories.id, products.categoryId))
      .leftJoin(subcategories, eq(subcategories.id, products.subcategoryId))
      .where(inArray(products.id, uniqueProductIds))
      .groupBy(products.id, categories.name, subcategories.name)
      .orderBy(asc(products.createdAt))
      .execute()
      .then((items) => {
        return items.map((item) => {
          const quantity = cart?.items?.find(
            (cartItem) => cartItem.productId === item.id,
          )?.quantity;

          return {
            ...item,
            quantity: quantity ?? 0,
          };
        });
      });

    return cartLineItems;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getCartItems(input: { cartId?: string }) {
  noStore();

  if (!input.cartId) return [];

  try {
    const cart = await db.query.carts.findFirst({
      where: eq(carts.id, input.cartId),
    });

    return cart?.items;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getUserCartItemsCount() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;

  return await cache(
    async () => {
      try {
        if (!cartId) return 0;

        const result = await db
          .select()
          .from(carts)
          .where(eq(carts.id, cartId));
        return result ? result[0]?.items?.length : 0;
      } catch (error) {
        console.error("Error fetching favorites count:", error);
        return 0;
      }
    },
    ["cart-items-count"],
    {
      revalidate: 3,
      tags: ["cart-items-count"],
    },
  )();
}
