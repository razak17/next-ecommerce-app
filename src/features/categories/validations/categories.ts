import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens",
    ),
  description: z.string().optional(),
  image: z.custom<File[] | undefined | null>().optional().nullable(),
});

export type CreateCategorySchema = z.infer<typeof createCategorySchema>;
