import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import * as React from "react";

import { auth } from "@/lib/auth";

import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { DateRangePicker } from "@/components/date-range-picker";
import { Shell } from "@/components/shell";
import { env } from "@/env.js";
import { OrdersTable } from "@/features/orders/components/orders/orders-table";
import { getUserOrders } from "@/features/orders/queries/orders";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "My Orders",
  description: "View your order history",
};

export default async function OrdersPage({
  searchParams,
}: PageProps<"/orders">) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) {
    redirect("/login");
  }

  const params = await searchParams;

  const ordersPromise = getUserOrders(params, session.user.email);

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex xs:flex-row flex-col xs:items-center xs:justify-between gap-4">
          <h2 className="font-bold text-2xl tracking-tight">My Orders</h2>
          <DateRangePicker align="end" />
        </div>
        <React.Suspense fallback={<DataTableSkeleton columnCount={5} />}>
          <OrdersTable promise={ordersPromise} showCustomerFilter={false} />
        </React.Suspense>
      </div>
    </Shell>
  );
}
