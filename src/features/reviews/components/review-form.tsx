"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { StarRatingInput } from "./star-rating-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createReview, updateReview } from "../actions/reviews";
import {
  type CreateReviewSchema,
  createReviewSchema,
  type UpdateReviewSchema,
  updateReviewSchema,
} from "../validations/reviews";

interface ReviewFormProps {
  productId: string;
  existingReview?: {
    id: string;
    rating: number;
    title: string;
    content: string;
  };
  onSuccess?: () => void;
}

export function ReviewForm({
  productId,
  existingReview,
  onSuccess,
}: ReviewFormProps) {
  const [isPending, startTransition] = useTransition();
  const isEditing = !!existingReview;

  const form = useForm<CreateReviewSchema | UpdateReviewSchema>({
    resolver: zodResolver(isEditing ? updateReviewSchema : createReviewSchema),
    defaultValues: {
      productId,
      rating: existingReview?.rating ?? 0,
      title: existingReview?.title ?? "",
      content: existingReview?.content ?? "",
      ...(isEditing && { id: existingReview.id }),
    },
  });

  function onSubmit(values: CreateReviewSchema | UpdateReviewSchema) {
    startTransition(async () => {
      const result = isEditing
        ? await updateReview(values as UpdateReviewSchema)
        : await createReview(values as CreateReviewSchema);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(
        isEditing
          ? "Review updated successfully!"
          : "Review submitted successfully!",
      );

      if (!isEditing) {
        form.reset();
      }

      onSuccess?.();
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <StarRatingInput
                  rating={field.value}
                  onRatingChange={field.onChange}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Summarize your review in a few words"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your experience with this product..."
                  className="min-h-[120px]"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending
            ? isEditing
              ? "Updating..."
              : "Submitting..."
            : isEditing
              ? "Update Review"
              : "Submit Review"}
        </Button>
      </form>
    </Form>
  );
}
