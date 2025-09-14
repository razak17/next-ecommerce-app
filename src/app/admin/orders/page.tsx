import { and, asc, desc, gte, inArray, like, lte, sql } from "drizzle-orm";
import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import * as React from "react";

import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { DateRangePicker } from "@/components/date-range-picker";
import { Shell } from "@/components/shell";
import { db } from "@/db/drizzle";
import { type Order, orders } from "@/db/schema";
import { env } from "@/env.js";
import { ordersSearchParamsSchema } from "@/features/apps/validations/params";
import { OrdersTable } from "@/features/orders/components/orders/orders-table";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Orders",
  description: "Manage your orders",
};

export default async function AdminOrdersPage({
  searchParams,
}: PageProps<"/admin/orders">) {
  const { page, per_page, sort, id, customer, status, from, to } =
    ordersSearchParamsSchema.parse(await searchParams);

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

  const fromDay = from ? new Date(from) : undefined;
  const toDay = to ? new Date(to) : undefined;

  noStore();
  const ordersPromise = (async () => {
    try {
      const whereConditions = and(
        // Filter by email
        id ? like(orders.id, `%${id}%`) : undefined,
        // Filter by email
        customer ? like(orders.email, `%${customer}%`) : undefined,
        // Filter by status
        statuses.length > 0
          ? inArray(orders.stripePaymentIntentStatus, statuses)
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
  })();

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex xs:flex-row flex-col xs:items-center xs:justify-between gap-4">
          <h2 className="font-bold text-2xl tracking-tight">Orders</h2>
          <DateRangePicker align="end" />
        </div>
        <React.Suspense fallback={<DataTableSkeleton columnCount={6} />}>
          <OrdersTable promise={ordersPromise} />
        </React.Suspense>
      </div>
    </Shell>
  );
}
