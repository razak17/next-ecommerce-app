import { format } from "date-fns";
import type { Metadata } from "next";

import { cn, formatNumber, formatPrice } from "@/lib/utils";

import { DateRangePicker } from "@/components/date-range-picker";
import { Shell } from "@/components/shell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { env } from "@/env.js";
import { OverviewCard } from "@/features/analytics/components/overview-card";
import { SalesChart } from "@/features/analytics/components/sales-chart";
import { searchParamsSchema } from "@/features/apps/validations/params";
import {
  getCustomers,
  getOrderCount,
  getSaleCount,
  getSales,
} from "@/features/orders/queries/orders";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Analytics",
  description: "Analytics for your store",
};

export default async function AnalyticsPage({
  searchParams,
}: PageProps<"/admin/analytics">) {
  const { page, from, to } = searchParamsSchema
    .omit({ per_page: true, sort: true })
    .parse(await searchParams);

  const fromDay = from ? new Date(from) : undefined;
  const toDay = to ? new Date(to) : undefined;
  const dayCount =
    fromDay && toDay
      ? Math.round(
          (toDay.getTime() - fromDay.getTime()) / (1000 * 60 * 60 * 24),
        )
      : undefined;

  const orderCountPromise = getOrderCount({
    fromDay: fromDay,
    toDay: toDay,
  });

  const saleCountPromise = getSaleCount({
    fromDay: fromDay,
    toDay: toDay,
  });

  const salesPromise = getSales({
    fromDay: fromDay,
    toDay: toDay,
  });

  const customersPromise = getCustomers({
    limit: 5,
    offset: (page - 1) * 5,
    fromDay: fromDay,
    toDay: toDay,
  });

  const [saleCount, orderCount, sales, { customers, customerCount }] =
    await Promise.all([
      saleCountPromise,
      orderCountPromise,
      salesPromise,
      customersPromise,
    ]);

  return (
    <Shell>
      <div className="space-y-6 p-1">
        <div className="flex xs:flex-row flex-col xs:items-center xs:justify-between gap-4">
          <h2 className="font-bold text-2xl tracking-tight">Analytics</h2>
          <DateRangePicker align="end" dayCount={30} />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <OverviewCard
            title="Total Revenue"
            value={formatPrice(saleCount, {
              notation: "standard",
            })}
            description="Total revenue for your store"
            icon="dollarSign"
          />
          <OverviewCard
            title="Sales"
            value={formatPrice(saleCount, {
              notation: "standard",
            })}
            description="Total sales for your store"
            icon="credit"
          />
          <OverviewCard
            title="Orders"
            value={formatNumber(orderCount)}
            description="Total orders for your store"
            icon="cart"
          />
          <OverviewCard
            title="Customers"
            value={formatNumber(customerCount)}
            description="Total customers for your store"
            icon="activity"
          />
        </div>
        <div className="flex flex-col gap-4 2xl:flex-row">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Sales</CardTitle>
              <CardDescription>
                Total sales in the last {dayCount} days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SalesChart
                data={sales.map((sale) => ({
                  name: format(new Date(sale.year, sale.month - 1), "MMM"),
                  Total: sale.totalSales,
                }))}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Customers</CardTitle>
              <CardDescription>
                Customers who have purchased in the last {dayCount} days
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {customers.map((customer, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 sm:flex-row sm:items-center"
                >
                  <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
                    <Avatar className="size-9">
                      <AvatarFallback>
                        {customer.name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="w-full space-y-1 text-sm">
                      <p className="font-medium leading-none">
                        {customer.name}
                      </p>
                      <p className="break-all text-muted-foreground leading-none">
                        {customer.email}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium text-sm leading-none">
                    {formatPrice(customer.totalSpent)}
                  </p>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href={`?page=${page - 1}&from=${from}&to=${to}`}
                      className={cn(
                        "transition-opacity",
                        page === 1 && "pointer-events-none opacity-50",
                      )}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      href={`?page=${page + 1}&from=${from}&to=${to}`}
                      className={cn(
                        "transition-opacity",
                        Math.ceil(customerCount / 5) === page &&
                          "pointer-events-none opacity-50",
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
