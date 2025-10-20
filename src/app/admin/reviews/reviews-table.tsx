"use client";

import { IconTrash } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { PlaceholderImage } from "@/components/placeholder-image";
import { Rating } from "@/components/rating";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteReview } from "@/features/reviews/actions/reviews";
import type { StoredFile } from "@/types";

interface ReviewWithRelations {
  review: {
    id: string;
    productId: string;
    userId: string;
    rating: number;
    title: string | null;
    content: string | null;
    createdAt: Date;
    updatedAt: Date | null;
  };
  user: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
  product: {
    id: string;
    name: string;
    images: StoredFile[] | null;
  } | null;
}

interface ReviewsTableProps {
  reviews: ReviewWithRelations[];
}

export function ReviewsTable({ reviews }: ReviewsTableProps) {
  if (reviews.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">No reviews found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Review</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map(({ review, user, product }: ReviewWithRelations) => (
            <TableRow key={review.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative size-12 overflow-hidden rounded-md">
                    {product?.images?.length ? (
                      <Image
                        src={
                          product.images[0].url ??
                          "/images/product-placeholder.webp"
                        }
                        alt={product.images[0].name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 48px) 100vw, 48px"
                      />
                    ) : (
                      <PlaceholderImage className="rounded-none" asChild />
                    )}
                  </div>
                  <div>
                    <Link
                      href={`/product/${product?.id}`}
                      className="font-medium hover:underline"
                    >
                      {product?.name ?? "Unknown Product"}
                    </Link>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {user?.image && (
                    <div className="relative size-8 overflow-hidden rounded-full">
                      <Image
                        src={user.image}
                        alt={user.name ?? "User"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 32px) 100vw, 32px"
                      />
                    </div>
                  )}
                  <span className="font-medium">
                    {user?.name ?? "Anonymous"}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Rating rating={review.rating} />
                  <span className="text-muted-foreground text-sm">
                    {review.rating}/5
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-[300px]">
                  <div className="truncate font-medium">
                    {review.title ?? "No title"}
                  </div>
                  {review.content && (
                    <div className="truncate text-muted-foreground text-sm">
                      {review.content}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {new Date(review.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <ConfirmDialog
                  title="Delete Review"
                  description={`Are you sure you want to delete this review? This action cannot be undone.`}
                  successMessage="Review deleted successfully"
                  onConfirm={async () => {
                    const result = await deleteReview({ id: review.id });
                    return {
                      success: result.error === null,
                      error: result.error,
                    };
                  }}
                >
                  <Button variant="ghost" size="sm">
                    <IconTrash className="size-4" />
                    <span className="sr-only">Delete review</span>
                  </Button>
                </ConfirmDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
