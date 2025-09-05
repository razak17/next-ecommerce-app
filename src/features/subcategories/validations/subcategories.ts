import { z } from "zod";

export const createSubcategorySchema = z.object({
  name: z.string().min(1, "Subcategory name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
});

export const updateSubcategorySchema = createSubcategorySchema;

export const getSubcategoriesSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional().default("createdAt.desc"),
  name: z.string().optional(),
  categoryId: z.string().optional(),
});

export type CreateSubcategorySchema = z.infer<typeof createSubcategorySchema>;
export type UpdateSubcategorySchema = z.infer<typeof updateSubcategorySchema>;
export type GetSubcategoriesSchema = z.infer<typeof getSubcategoriesSchema>;
