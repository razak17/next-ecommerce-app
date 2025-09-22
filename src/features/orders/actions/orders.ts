"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getErrorMessage } from "@/lib/handle-error";

import { db } from "@/db/drizzle";
import { orderStatuses, orders } from "@/db/schema";

const updateOrderStatusSchema = z.object({
  orderId: z.string(),
  status: z.enum(orderStatuses),
});

export async function updateOrderStatus(
  input: z.infer<typeof updateOrderStatusSchema>,
) {
  try {
    const { orderId, status } = updateOrderStatusSchema.parse(input);

    await db.update(orders).set({ status }).where(eq(orders.id, orderId));

    revalidatePath("/admin/orders");
    revalidatePath("/orders");

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

export async function getOrder(orderId: string) {
  try {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        address: true,
      },
    });

    return {
      data: order,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}
