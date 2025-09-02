import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z
    .string()
    .min(1, "Price is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  // originalPrice: z
  //   .string()
  //   .optional()
  //   .refine(
  //     (val) => !val || /^\d+(\.\d{1,2})?$/.test(val),
  //     "Invalid original price format",
  //   ),
  inventory: z.number().int().min(0, "Inventory must be a non-negative number"),
  categoryId: z.string().min(1, "Category is required"),
  subcategoryId: z.string().optional(),
  images: z.custom<File[] | undefined | null>().optional().nullable(),
  // status: z.enum(["active", "draft", "archived"]).default("active"),
});

export const updateProductSchema = createProductSchema;

export const getProductsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional().default("createdAt.desc"),
  categories: z.string().optional(),
  subcategory: z.string().optional(),
  subcategories: z.string().optional(),
  price_range: z.string().optional(),
  active: z.string().optional().default("true"),
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;
export type UpdateProductSchema = z.infer<typeof updateProductSchema>;
export type GetProductsSchema = z.infer<typeof getProductsSchema>;
