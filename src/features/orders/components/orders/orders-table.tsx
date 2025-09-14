"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import type { Column, ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import * as React from "react";

import {
  getStripePaymentStatusColor,
  stripePaymentStatuses,
} from "@/lib/checkout";
import { cn, formatDate, formatId, formatPrice } from "@/lib/utils";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Order } from "@/db/schema";
import { useDataTable } from "@/hooks/use-data-table";
import type { StripePaymentStatus } from "@/types";

type AwaitedOrder = Pick<Order, "id" | "quantity" | "amount" | "createdAt"> & {
  customer: string | null;
  status: string;
  paymentIntentId: string;
};

interface OrdersTableProps {
  promise: Promise<{
    data: AwaitedOrder[];
    pageCount: number;
  }>;
  showCustomerFilter?: boolean;
  isAdmin?: boolean;
}

export function OrdersTable({
  promise,
  showCustomerFilter = true,
  isAdmin = false,
}: OrdersTableProps) {
  const { data, pageCount } = React.use(promise);

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo<ColumnDef<AwaitedOrder, unknown>[]>(
    () => [
      {
        accessorKey: "id",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Order ID" />
        ),
        cell: ({ cell }) => {
          return <span>{formatId(String(cell.getValue()))}</span>;
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Payment Status" />
        ),
        cell: ({ cell }) => {
          return (
            <Badge
              variant="outline"
              className={cn(
                "pointer-events-none text-sm text-white capitalize",
                getStripePaymentStatusColor({
                  status: cell.getValue() as StripePaymentStatus,
                  shade: 600,
                }),
              )}
            >
              {String(cell.getValue())}
            </Badge>
          );
        },
      },
      ...(showCustomerFilter
        ? [
            {
              accessorKey: "customer",
              header: ({
                column,
              }: {
                column: Column<AwaitedOrder, unknown>;
              }) => <DataTableColumnHeader column={column} title="Customer" />,
            },
          ]
        : []),
      {
        accessorKey: "quantity",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Quantity" />
        ),
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Amount" />
        ),
        cell: ({ cell }) => formatPrice(cell.getValue() as number),
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Created At" />
        ),
        cell: ({ cell }) => formatDate(cell.getValue() as Date),
        enableColumnFilter: false,
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="flex size-8 p-0 data-[state=open]:bg-muted"
              >
                <DotsHorizontalIcon className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem asChild>
                <Link
                  href={`${isAdmin ? "/admin" : ""}/orders/${row.original.id}`}
                >
                  View details
                </Link>
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem asChild>
                  <Link
                    href={`https://dashboard.stripe.com/test/payments/${row.original.paymentIntentId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Stripe
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [showCustomerFilter, isAdmin],
  );

  const filterFields = [
    ...(showCustomerFilter
      ? [
          {
            label: "Customer",
            value: "customer" as const,
            placeholder: "Search customers...",
          },
        ]
      : []),
    {
      label: "Order ID",
      value: "id" as const,
      placeholder: "Search order IDs...",
    },
    {
      label: "Status",
      value: "status" as const,
      options: stripePaymentStatuses,
    },
  ];

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} filterFields={filterFields} />
      <DataTable table={table} />
    </div>
  );
}
