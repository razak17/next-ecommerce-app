import "server-only";

import {
  and,
  asc,
  count,
  countDistinct,
  desc,
  eq,
  gte,
  inArray,
  like,
  lte,
  sql,
} from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import type { SearchParams } from "next/dist/server/request/search-params";
import type Stripe from "stripe";
import { z } from "zod";

import { db } from "@/db/drizzle";
import {
  categories,
  type Order,
  orders,
  products,
  subcategories,
} from "@/db/schema";
import { ordersSearchParamsSchema } from "@/features/apps/validations/params";
import {
  type CartLineItemSchema,
  checkoutItemSchema,
} from "@/features/cart/validations/cart";
import type { getOrderLineItemsSchema } from "../validations/orders";

export async function getUserOrders(input: SearchParams, userEmail: string) {
  noStore();
  try {
    const {
      page = 1,
      per_page = 10,
      sort = "createdAt.desc",
      id,
      status,
      order_status,
      from,
      to,
    } = ordersSearchParamsSchema.parse(input);

    // Fallback page for invalid page numbers
    const fallbackPage = Number.isNaN(page) || page < 1 ? 1 : page;
    // Number of items per page
    const limit = Number.isNaN(per_page) ? 10 : per_page;
    // Number of items to skip
    const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0;
    // Column and order to sort by
    const [column, order] = (sort.split(".") as [
      keyof Order | undefined,
      "asc" | "desc" | undefined,
    ]) ?? ["createdAt", "desc"];

    const statuses = status ? status.split(".") : [];
    const orderStatuses = order_status ? order_status.split(".") : [];
    const fromDay = from ? new Date(from) : undefined;
    const toDay = to ? new Date(to) : undefined;

    const whereConditions = and(
      eq(orders.email, userEmail),
      // Filter by order ID
      id ? like(orders.id, `%${id}%`) : undefined,
      // Filter by payment status
      statuses.length > 0
        ? inArray(orders.stripePaymentIntentStatus, statuses)
        : undefined,
      // Filter by order status
      orderStatuses.length > 0
        ? inArray(orders.status, orderStatuses)
        : undefined,
      // Filter by createdAt
      fromDay && toDay
        ? and(gte(orders.createdAt, fromDay), lte(orders.createdAt, toDay))
        : undefined,
    );

    const data = await db
      .select({
        id: orders.id,
        quantity: orders.quantity,
        amount: orders.amount,
        paymentIntentId: orders.stripePaymentIntentId,
        status: orders.stripePaymentIntentStatus,
        orderStatus: orders.status,
        customer: orders.email,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .limit(limit)
      .offset(offset)
      .where(whereConditions)
      .orderBy(
        column && column in orders
          ? order === "asc"
            ? asc(orders[column])
            : desc(orders[column])
          : desc(orders.createdAt),
      );

    const count = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(orders)
      .where(whereConditions)
      .execute()
      .then((res) => res[0]?.count ?? 0);

    const pageCount = Math.ceil(count / limit);

    return {
      data,
      pageCount,
    };
  } catch (err) {
    console.error(err);
    return {
      data: [],
      pageCount: 0,
    };
  }
}

export async function getOrderLineItems(
  input: z.infer<typeof getOrderLineItemsSchema> & {
    paymentIntent?: Stripe.Response<Stripe.PaymentIntent> | null;
  },
): Promise<CartLineItemSchema[]> {
  try {
    const safeParsedItems = z
      .array(checkoutItemSchema)
      .safeParse(input.items ?? "[]");

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

export async function getCustomers(input: {
  limit: number;
  offset: number;
  fromDay?: Date;
  toDay?: Date;
}) {
  noStore();
  try {
    const { limit, offset, fromDay, toDay } = input;

    const customers = await db
      .select({
        email: orders.email,
        name: orders.name,
        totalSpent: sql<number>`sum(${orders.amount})`,
      })
      .from(orders)
      .limit(limit)
      .offset(offset)
      .where(
        fromDay && toDay
          ? and(gte(orders.createdAt, fromDay), lte(orders.createdAt, toDay))
          : undefined,
      )
      .groupBy(orders.email, orders.name, orders.createdAt)
      .orderBy(desc(orders.createdAt));

    const customerCount = await db
      .select({
        count: countDistinct(orders.email),
      })
      .from(orders)
      .where(
        fromDay && toDay
          ? and(gte(orders.createdAt, fromDay), lte(orders.createdAt, toDay))
          : undefined,
      )
      .execute()
      .then((res) => res[0]?.count ?? 0);

    return {
      customers,
      customerCount,
    };
  } catch (err) {
    console.error(err);
    return {
      customers: [],
      customerCount: 0,
    };
  }
}

export async function getDashboardStats() {
  noStore();
  try {
    const [
      totalProductsResult,
      totalOrdersResult,
      totalRevenueResult,
      totalCustomersResult,
      lowInventoryResult,
      recentOrdersResult,
    ] = await Promise.all([
      // Total products
      db
        .select({ count: count(products.id) })
        .from(products)
        .where(eq(products.status, "active")),

      // Total orders
      db
        .select({ count: count(orders.id) })
        .from(orders),

      // Total revenue
      db
        .select({ total: sql<number>`COALESCE(SUM(${orders.amount}), 0)` })
        .from(orders),

      // Total customers
      db
        .select({ count: countDistinct(orders.email) })
        .from(orders),

      // Low inventory products
      db
        .select({
          id: products.id,
          name: products.name,
          inventory: products.inventory,
          category: categories.name,
        })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(and(eq(products.status, "active"), lte(products.inventory, 10)))
        .orderBy(asc(products.inventory))
        .limit(5),

      // Recent orders
      db
        .select({
          id: orders.id,
          email: orders.email,
          name: orders.name,
          amount: orders.amount,
          status: orders.stripePaymentIntentStatus,
          orderStatus: orders.status,
          createdAt: orders.createdAt,
        })
        .from(orders)
        .orderBy(desc(orders.createdAt))
        .limit(5),
    ]);

    return {
      totalProducts: totalProductsResult[0]?.count ?? 0,
      totalOrders: totalOrdersResult[0]?.count ?? 0,
      totalRevenue: totalRevenueResult[0]?.total ?? 0,
      totalCustomers: totalCustomersResult[0]?.count ?? 0,
      lowInventoryProducts: lowInventoryResult,
      recentOrders: recentOrdersResult,
    };
  } catch (err) {
    console.error(err);
    return {
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
      totalCustomers: 0,
      lowInventoryProducts: [],
      recentOrders: [],
    };
  }
}
