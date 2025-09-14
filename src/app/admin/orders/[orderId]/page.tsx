import { and, eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatId, formatPrice } from "@/lib/utils";

import { Shell } from "@/components/shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/db/drizzle";
import { orders } from "@/db/schema";
import { env } from "@/env.js";
import { getOrderLineItems } from "@/features/orders/queries/orders";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Order",
  description: "View order details",
};

export default async function AdminOrderPage({
  params,
}: PageProps<"/admin/orders/[orderId]">) {
  const { orderId: rawOrderId } = await params;
  const orderId = decodeURIComponent(rawOrderId);

  const order = await db.query.orders.findFirst({
    where: and(eq(orders.id, orderId)),
  });

  if (!order) {
    notFound();
  }

  const orderLineItems = await getOrderLineItems({
    items: order.items,
  });

  return (
    <Shell>
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Order {formatId(order.id)}</CardTitle>
          <CardDescription>View order details</CardDescription>
        </CardHeader>
        <CardContent className="flex w-full flex-col space-y-2.5">
          {orderLineItems.map((item) => (
            <Link
              aria-label={`View ${item.name}`}
              key={item.id}
              href={`/product/${item.id}`}
              className="rounded-md bg-muted px-4 py-2.5 hover:bg-muted/70"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col space-y-1 self-start">
                    <span className="line-clamp-1 font-medium text-sm">
                      {item.name}
                    </span>
                    <span className="line-clamp-1 text-muted-foreground text-xs">
                      Qty {item.quantity}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col space-y-1 font-medium">
                  <span className="ml-auto line-clamp-1 text-sm">
                    {formatPrice(
                      (Number(item.price) * item.quantity).toFixed(2),
                    )}
                  </span>
                  <span className="line-clamp-1 text-muted-foreground text-xs">
                    {formatPrice(item.price)} each
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </Shell>
  );
}
