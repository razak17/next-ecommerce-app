"use client";

import { HeartIcon } from "@radix-ui/react-icons";
import * as React from "react";
import { toast } from "sonner";

import { showErrorToast } from "@/lib/handle-error";
import { cn } from "@/lib/utils";

import { Icons } from "@/components/icons";
import { Button, type ButtonProps } from "@/components/ui/button";
import { updateProductRating } from "../actions/products";

interface UpdateProductRatingButtonProps extends ButtonProps {
  productId: string;
  rating: number;
}

export function UpdateProductRatingButton({
  productId,
  rating,
  className,
  ...props
}: UpdateProductRatingButtonProps) {
  const [loading, setLoading] = React.useState(false);

  return (
    <Button
      title="Favorite"
      variant="secondary"
      size="icon"
      className={cn("size-8 shrink-0", className)}
      onClick={async () => {
        setLoading(true);

        const { error } = await updateProductRating({
          id: productId,
          rating: rating + 1,
        });

        if (error) {
          showErrorToast(error);
          return;
        }

        toast.success("Product rating updated");
        setLoading(false);
      }}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <Icons.spinner className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <HeartIcon className="size-4" aria-hidden="true" />
      )}
      <span className="sr-only">Ratingg</span>
    </Button>
  );
}
