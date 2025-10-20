import { StarFilledIcon } from "@radix-ui/react-icons";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface StarRatingInputProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  disabled?: boolean;
}

export function StarRatingInput({
  rating,
  onRatingChange,
  disabled = false,
}: StarRatingInputProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const starValue = i + 1;
        const isActive = starValue <= (hoverRating || rating);

        return (
          <button
            key={i}
            type="button"
            onClick={() => onRatingChange(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(0)}
            disabled={disabled}
            className={cn(
              "size-6 transition-colors hover:scale-110 disabled:cursor-not-allowed disabled:hover:scale-100",
              isActive ? "text-yellow-500" : "text-muted-foreground",
              !disabled && "hover:text-yellow-400",
            )}
            aria-label={`Rate ${starValue} stars`}
          >
            <StarFilledIcon className="size-full" />
          </button>
        );
      })}
    </div>
  );
}
