"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { cn, toTitleCase } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { orderStatuses } from "@/db/schema";
import { updateOrderStatus } from "../actions/orders";

const updateOrderStatusSchema = z.object({
  status: z.enum(orderStatuses),
});

type UpdateOrderStatusFormData = z.infer<typeof updateOrderStatusSchema>;

interface UpdateOrderStatusProps {
  orderId: string;
  currentStatus: string;
  className?: string;
}

export function UpdateOrderStatus({
  orderId,
  currentStatus,
  className,
}: UpdateOrderStatusProps) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<UpdateOrderStatusFormData>({
    resolver: zodResolver(updateOrderStatusSchema),
    defaultValues: {
      status: currentStatus as UpdateOrderStatusFormData["status"],
    },
  });

  function onSubmit(data: UpdateOrderStatusFormData) {
    startTransition(async () => {
      const { error } = await updateOrderStatus({
        orderId,
        status: data.status,
      });

      if (error) {
        toast.error(error);
        return;
      }

      toast.success("Order status updated successfully.");
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-4", className)}
      >
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select order status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {orderStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {toTitleCase(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Updating..." : "Update Status"}
        </Button>
      </form>
    </Form>
  );
}
