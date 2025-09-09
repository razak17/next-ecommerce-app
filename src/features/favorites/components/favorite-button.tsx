"use client";

import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons";
import * as React from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { checkIsFavorited, toggleFavorite } from "../actions/favorites";

interface FavoriteButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  productId: string;
  isFavorited?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
  variant?:
    | "default"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive"
    | "outline";
}

export function FavoriteButton({
  productId,
  isFavorited,
  size = "icon",
  variant = "ghost",
  className,
  ...props
}: FavoriteButtonProps) {
  const [isTransitioning, startTransition] = React.useTransition();
  const [favorited, setFavorited] = React.useState(isFavorited ?? false);
  const [isLoading, setIsLoading] = React.useState(isFavorited === undefined);

  React.useEffect(() => {
    if (isFavorited === undefined) {
      checkIsFavorited(productId).then(({ isFavorited: initialState }) => {
        setFavorited(initialState);
        setIsLoading(false);
      });
    }
  }, [productId, isFavorited]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      const {
        success,
        isFavorited: newFavoriteState,
        error,
      } = await toggleFavorite(productId);

      if (success) {
        setFavorited(newFavoriteState);
        toast.success(
          newFavoriteState ? "Added to favorites" : "Removed from favorites",
        );
      } else {
        toast.error(error || "Failed to update favorites");
      }
    });
  };

  if (isLoading) {
    return (
      <Button
        size={size}
        variant={variant}
        className={cn("shrink-0", className)}
        disabled
        {...props}
      >
        {/* <Icons.spinner className="size-4 animate-spin" aria-hidden="true" /> */}
        <HeartIcon className="size-4" aria-hidden="true" />
        <span className="sr-only">Loading...</span>
      </Button>
    );
  }

  return (
    <Button
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      size={size}
      variant={variant}
      className={cn("shrink-0", className)}
      onClick={handleToggleFavorite}
      disabled={isLoading || isTransitioning}
      {...props}
    >
      {isTransitioning ? (
        <Icons.spinner className="size-4 animate-spin" aria-hidden="true" />
      ) : favorited ? (
        <HeartFilledIcon className="size-4 text-red-500" aria-hidden="true" />
      ) : (
        <HeartIcon className="size-4" aria-hidden="true" />
      )}
      <span className="sr-only">
        {favorited ? "Remove from favorites" : "Add to favorites"}
      </span>
    </Button>
  );
}
