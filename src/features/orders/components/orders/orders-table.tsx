"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import type { Column, ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";

import { stripePaymentStatuses } from "@/lib/checkout";
import { formatDate, formatId, formatPrice, toTitleCase } from "@/lib/utils";

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
import { type Order, orderStatuses } from "@/db/schema";
import { updateOrderStatus } from "@/features/orders/actions/orders";
import { useDataTable } from "@/hooks/use-data-table";

type AwaitedOrder = Pick<Order, "id" | "quantity" | "amount" | "createdAt"> & {
  customer: string | null;
  status: string;
  orderStatus: string | null;
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
        cell: ({ cell, row }) => {
          const { status } = row.original;
          return (
            <Badge
              variant={
                status === "succeeded"
                  ? "success"
                  : status === "canceled"
                    ? "destructive"
                    : "outline"
              }
              className="pointer-events-none text-sm capitalize"
            >
              {String(cell.getValue())}
            </Badge>
          );
        },
      },
      {
        accessorKey: "orderStatus",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Order Status" />
        ),
        cell: ({ cell, row }) => {
          const { orderStatus: status } = row.original;
          return (
            <Badge
              variant={
                status === "delivered"
                  ? "success"
                  : status === "canceled"
                    ? "destructive"
                    : "outline"
              }
              className="pointer-events-none text-sm capitalize"
            >
              {String(cell.getValue() || "pending")}
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
        cell: ({ row }) => {
          const handleMarkAsDelivered = async () => {
            try {
              const result = await updateOrderStatus({
                orderId: row.original.id,
                status: "delivered",
              });

              if (result.error) {
                toast.error(result.error);
              } else {
                toast.success("Order marked as delivered");
              }
            } catch (error) {
              console.error(error);
              toast.error("Failed to update order status");
            }
          };

          return (
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
                  <>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`https://dashboard.stripe.com/test/payments/${row.original.paymentIntentId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View on Stripe
                      </Link>
                    </DropdownMenuItem>
                    {row.original.orderStatus !== "delivered" && (
                      <DropdownMenuItem onClick={handleMarkAsDelivered}>
                        Mark as delivered
                      </DropdownMenuItem>
                    )}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
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
      label: "Payment Status",
      value: "status" as const,
      options: stripePaymentStatuses,
    },
    {
      label: "Order Status",
      value: "orderStatus" as const,
      options: orderStatuses.map((status) => ({
        label: toTitleCase(status),
        value: status,
      })),
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
