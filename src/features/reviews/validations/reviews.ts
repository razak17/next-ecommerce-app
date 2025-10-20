import { z } from "zod";

export const createReviewSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot be more than 5"),
  title: z
    .string()
    .min(1, "Review title is required")
    .max(100, "Title must be less than 100 characters"),
  content: z
    .string()
    .min(10, "Review content must be at least 10 characters")
    .max(1000, "Review content must be less than 1000 characters"),
});

export const updateReviewSchema = z.object({
  id: z.string().min(1, "Review ID is required"),
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot be more than 5"),
  title: z
    .string()
    .min(1, "Review title is required")
    .max(100, "Title must be less than 100 characters"),
  content: z
    .string()
    .min(10, "Review content must be at least 10 characters")
    .max(1000, "Review content must be less than 1000 characters"),
});

export const deleteReviewSchema = z.object({
  id: z.string().min(1, "Review ID is required"),
});

export const getReviewsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional().default("createdAt.desc"),
  productId: z.string().optional(),
  userId: z.string().optional(),
  rating: z.coerce.number().optional(),
});

export type CreateReviewSchema = z.infer<typeof createReviewSchema>;
export type UpdateReviewSchema = z.infer<typeof updateReviewSchema>;
export type DeleteReviewSchema = z.infer<typeof deleteReviewSchema>;
export type GetReviewsSchema = z.infer<typeof getReviewsSchema>;
