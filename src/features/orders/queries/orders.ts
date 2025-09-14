"use server";

import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import type Stripe from "stripe";
import { z } from "zod";

import { db } from "@/db/drizzle";
import { categories, orders, products, subcategories } from "@/db/schema";
import {
  type CartLineItemSchema,
  checkoutItemSchema,
} from "@/features/cart/validations/cart";
import type { getOrderLineItemsSchema } from "../validations/orders";

export async function getOrderLineItems(
  input: z.infer<typeof getOrderLineItemsSchema> & {
    paymentIntent?: Stripe.Response<Stripe.PaymentIntent> | null;
  },
): Promise<CartLineItemSchema[]> {
  try {
    const safeParsedItems = z
      .array(checkoutItemSchema)
      .safeParse(JSON.parse(input.items ?? "[]"));

    if (!safeParsedItems.success) {
      throw new Error("Could not parse items.");
    }

    const lineItems = await db
      .select({
        id: products.id,
        name: products.name,
        images: products.images,
        price: products.price,
        inventory: products.inventory,
        categoryId: products.categoryId,
        subcategoryId: products.subcategoryId,
      })
      .from(products)
      .leftJoin(subcategories, eq(products.subcategoryId, subcategories.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(
        inArray(
          products.id,
          safeParsedItems.data.map((item) => item.productId),
        ),
      )
      .groupBy(products.id)
      .orderBy(desc(products.createdAt))
      .execute()
      .then((items) => {
        return items.map((item) => {
          const quantity = safeParsedItems.data.find(
            (checkoutItem) => checkoutItem.productId === item.id,
          )?.quantity;

          return {
            ...item,
            quantity: quantity ?? 0,
          };
        });
      });

    return lineItems;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getOrderCount(input: { fromDay?: Date; toDay?: Date }) {
  noStore();
  try {
    const { fromDay, toDay } = input;

    return await db
      .select({
        count: sql`count(*)`.mapWith(Number),
      })
      .from(orders)
      .where(
        fromDay && toDay
          ? and(gte(orders.createdAt, fromDay), lte(orders.createdAt, toDay))
          : undefined,
      )
      .execute()
      .then((res) => res[0]?.count ?? 0);
  } catch (err) {
    console.error(err);
    return 0;
  }
}

export async function getSaleCount(input: { fromDay?: Date; toDay?: Date }) {
  noStore();
  try {
    const { fromDay, toDay } = input;

    const storeOrders = await db
      .select({
        amount: orders.amount,
      })
      .from(orders)
      .where(
        fromDay && toDay
          ? and(gte(orders.createdAt, fromDay), lte(orders.createdAt, toDay))
          : undefined,
      );

    const sales = storeOrders.reduce(
      (acc, order) => acc + Number(order.amount),
      0,
    );

    return sales;
  } catch (err) {
    console.error(err);
    return 0;
  }
}

export async function getSales(input: { fromDay?: Date; toDay?: Date }) {
  noStore();
  try {
    const { fromDay, toDay } = input;

    return await db
      .select({
        year: sql`EXTRACT(YEAR FROM ${orders.createdAt})`.mapWith(Number),
        month: sql`EXTRACT(MONTH FROM ${orders.createdAt})`.mapWith(Number),
        totalSales: sql`SUM(${orders.amount})`.mapWith(Number),
      })
      .from(orders)
      .where(
        fromDay && toDay
          ? and(gte(orders.createdAt, fromDay), lte(orders.createdAt, toDay))
          : undefined,
      )
      .groupBy(
        sql`EXTRACT(YEAR FROM ${orders.createdAt})`,
        sql`EXTRACT(MONTH FROM ${orders.createdAt})`,
      )
      .orderBy(
        sql`EXTRACT(YEAR FROM ${orders.createdAt})`,
        sql`EXTRACT(MONTH FROM ${orders.createdAt})`,
      )
      .execute();
  } catch (err) {
    console.error(err);
    return [];
  }
}
