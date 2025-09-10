"use server";

import { eq } from "drizzle-orm";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import type { z } from "zod";

import { getErrorMessage } from "@/lib/handle-error";

import { db } from "@/db/drizzle";
import { carts, products } from "@/db/schema";
import {
  cartItemSchema,
  type deleteCartItemSchema,
  type deleteCartItemsSchema,
} from "@/features/cart/validations/cart";

export async function addToCart(rawInput: z.infer<typeof cartItemSchema>) {
  noStore();

  try {
    const input = cartItemSchema.parse(rawInput);

    const product = await db.query.products.findFirst({
      columns: {
        inventory: true,
      },
      where: eq(products.id, input.productId),
    });

    if (!product) {
      throw new Error("Product not found, please try again.");
    }

    if (product.inventory < input.quantity) {
      throw new Error("Product is out of stock, please try again later.");
    }

    const cookieStore = await cookies();
    const cartId = cookieStore.get("cartId")?.value;

    if (!cartId) {
      const cart = await db
        .insert(carts)
        .values({
          items: [input],
        })
        .returning({ insertedId: carts.id });

      // Note: .set() is only available in a Server Action or Route Handler
      cookieStore.set("cartId", String(cart[0]?.insertedId));

      revalidatePath("/");
      return {
        data: [input],
        error: null,
      };
    }

    const cart = await db.query.carts.findFirst({
      where: eq(carts.id, cartId),
    });

    // TODO: Find a better way to deal with expired carts
    if (!cart) {
      cookieStore.set({
        name: "cartId",
        value: "",
        expires: new Date(0),
      });

      await db.delete(carts).where(eq(carts.id, cartId));

      throw new Error("Cart not found, please try again.");
    }

    // If cart is closed, delete it and create a new one
    if (cart.closed) {
      await db.delete(carts).where(eq(carts.id, cartId));

      const newCart = await db
        .insert(carts)
        .values({
          items: [input],
        })
        .returning({ insertedId: carts.id });

      cookieStore.set("cartId", String(newCart[0]?.insertedId));

      revalidatePath("/");
      return {
        data: [input],
        error: null,
      };
    }

    const cartItem = cart.items?.find(
      (item) => item.productId === input.productId,
    );

    if (cartItem) {
      cartItem.quantity += input.quantity;
    } else {
      cart.items?.push(input);
    }

    await db
      .update(carts)
      .set({
        items: cart.items,
      })
      .where(eq(carts.id, cartId));

    revalidatePath("/");

    return {
      data: cart.items,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function updateCartItem(rawInput: z.infer<typeof cartItemSchema>) {
  noStore();

  try {
    const input = cartItemSchema.parse(rawInput);

    const cookieStore = await cookies();
    const cartId = cookieStore.get("cartId")?.value;

    if (!cartId) {
      throw new Error("cartId not found, please try again.");
    }

    const cart = await db.query.carts.findFirst({
      where: eq(carts.id, cartId),
    });

    if (!cart) {
      throw new Error("Cart not found, please try again.");
    }

    const cartItem = cart.items?.find(
      (item) => item.productId === input.productId,
    );

    if (!cartItem) {
      throw new Error("CartItem not found, please try again.");
    }

    if (input.quantity === 0) {
      cart.items =
        cart.items?.filter((item) => item.productId !== input.productId) ?? [];
    } else {
      cartItem.quantity = input.quantity;
    }

    await db
      .update(carts)
      .set({ items: cart.items })
      .where(eq(carts.id, cartId));

    revalidatePath("/");

    return {
      data: cart.items,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteCart() {
  noStore();

  try {
    const cookieStore = await cookies();
    const cartId = cookieStore.get("cartId")?.value;

    if (!cartId) {
      throw new Error("cartId not found, please try again.");
    }

    await db.delete(carts).where(eq(carts.id, cartId));

    revalidatePath("/");

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteCartItem(
  input: z.infer<typeof deleteCartItemSchema>,
) {
  noStore();

  try {
    const cookieStore = await cookies();
    const cartId = cookieStore.get("cartId")?.value;

    if (!cartId) {
      throw new Error("cartId not found, please try again.");
    }

    const cart = await db.query.carts.findFirst({
      where: eq(carts.id, cartId),
    });

    if (!cart) return;

    cart.items =
      cart.items?.filter((item) => item.productId !== input.productId) ?? [];

    await db
      .update(carts)
      .set({
        items: cart.items,
      })
      .where(eq(carts.id, cartId));

    revalidatePath("/");
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteCartItems(
  input: z.infer<typeof deleteCartItemsSchema>,
) {
  noStore();

  try {
    const cookieStore = await cookies();
    const cartId = cookieStore.get("cartId")?.value;

    if (!cartId) {
      throw new Error("cartId not found, please try again.");
    }

    const cart = await db.query.carts.findFirst({
      where: eq(carts.id, cartId),
    });

    if (!cart) return;

    cart.items =
      cart.items?.filter(
        (item) => !input.productIds.includes(item.productId),
      ) ?? [];

    await db
      .update(carts)
      .set({
        items: cart.items,
      })
      .where(eq(carts.id, cartId));

    revalidatePath("/");

    return {
      data: cart.items,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}
