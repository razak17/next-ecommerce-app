import { z } from "zod";

const variantValueSchema = z.object({
  value: z.string().min(1, "Variant value is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  inventory: z.number().int().min(0, "Inventory must be a non-negative number"),
});

const productVariantSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  values: z
    .array(variantValueSchema)
    .min(1, "At least one variant value is required"),
});

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
  variants: z.array(productVariantSchema).optional(),
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

export const updateProductRatingSchema = z.object({
  id: z.string(),
  rating: z.number(),
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;
export type UpdateProductSchema = z.infer<typeof updateProductSchema>;
export type GetProductsSchema = z.infer<typeof getProductsSchema>;
export type ProductVariantSchema = z.infer<typeof productVariantSchema>;
export type VariantValueSchema = z.infer<typeof variantValueSchema>;

export type UpdateProductRatingSchema = z.infer<
  typeof updateProductRatingSchema
>;
