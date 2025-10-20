"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { formatDistanceToNow } from "date-fns";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { Rating } from "@/components/rating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Review } from "@/db/schema";
import { deleteReview } from "../actions/reviews";

interface ReviewCardProps {
  review: Review & {
    user: {
      id: string;
      name: string | null;
      image: string | null;
    } | null;
  };
  currentUserId?: string;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ReviewCard({
  review,
  currentUserId,
  isAdmin = false,
  onEdit,
  onDelete,
}: ReviewCardProps) {
  const canModify = currentUserId === review.userId || isAdmin;

  const handleDelete = async () => {
    const result = await deleteReview({ id: review.id });

    if (result.error) {
      return { success: false, error: result.error };
    }

    return { success: true, error: null };
  };

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <Avatar className="size-10">
            <AvatarImage src={review.user?.image || undefined} />
            <AvatarFallback>
              {review.user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h4 className="font-medium">
                {review.user?.name || "Anonymous"}
              </h4>
              <Rating rating={review.rating} />
            </div>
            <p className="text-muted-foreground text-sm">
              {formatDistanceToNow(new Date(review.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>

        {canModify && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <DotsHorizontalIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {currentUserId === review.userId && (
                <DropdownMenuItem onClick={onEdit}>
                  Edit Review
                </DropdownMenuItem>
              )}
              <ConfirmDialog
                title="Delete Review"
                description="Are you sure you want to delete this review? This action cannot be undone."
                successMessage="Review deleted successfully!"
                onConfirm={handleDelete}
                onSuccess={onDelete}
              >
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  Delete Review
                </DropdownMenuItem>
              </ConfirmDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="space-y-2">
        {review.title && <h5 className="font-medium">{review.title}</h5>}
        <p className="whitespace-pre-wrap text-muted-foreground text-sm">
          {review.content}
        </p>
      </div>
    </div>
  );
}
