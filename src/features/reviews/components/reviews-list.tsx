"use client";

import { useState } from "react";

import { ReviewCard } from "./review-card";
import { ReviewForm } from "./review-form";
import { PaginationButton } from "@/components/pagination-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Review } from "@/db/schema";
import type { getProductReviews } from "../queries/reviews";

interface ReviewsListProps {
  productId: string;
  initialReviews: Awaited<ReturnType<typeof getProductReviews>>;
  currentUserId?: string;
  userRole?: string;
  userExistingReview?: Review | null;
}

export function ReviewsList({
  productId,
  initialReviews,
  currentUserId,
  userRole,
  userExistingReview,
}: ReviewsListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleEditReview = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleSuccess = () => {
    handleDialogClose();
    // The page will revalidate automatically due to revalidatePath in actions
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">
          Customer Reviews ({initialReviews.data.length})
        </h3>

        {currentUserId && !userExistingReview && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Write a Review</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Write Your Review</DialogTitle>
              </DialogHeader>
              <ReviewForm productId={productId} onSuccess={handleSuccess} />
            </DialogContent>
          </Dialog>
        )}

        {userExistingReview && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Edit Your Review</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Your Review</DialogTitle>
              </DialogHeader>
              <ReviewForm
                productId={productId}
                existingReview={{
                  id: userExistingReview.id,
                  rating: userExistingReview.rating,
                  title: userExistingReview.title || "",
                  content: userExistingReview.content || "",
                }}
                onSuccess={handleSuccess}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {initialReviews.data.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">No reviews yet.</p>
          {currentUserId && (
            <p className="mt-2 text-muted-foreground text-sm">
              Be the first to share your experience!
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {initialReviews.data.map(({ review, user }) => (
            <ReviewCard
              key={review.id}
              review={{ ...review, user }}
              currentUserId={currentUserId}
              isAdmin={userRole === "admin"}
              onEdit={handleEditReview}
            />
          ))}

          {initialReviews.pageCount > 1 && (
            <div className="flex justify-center">
              <PaginationButton
                pageCount={initialReviews.pageCount}
                className="w-fit"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
