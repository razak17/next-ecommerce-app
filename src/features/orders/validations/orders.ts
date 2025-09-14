import * as z from "zod";

export const getOrderLineItemsSchema = z.object({
  items: z.any().optional(),
  // items: z.union([z.string(), z.array(z.any()), z.null()]).optional(),
});

export const verifyOrderSchema = z.object({
  deliveryPostalCode: z.string().min(1, {
    message: "Please enter a valid postal code",
  }),
});
