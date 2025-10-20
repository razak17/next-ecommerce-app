import { Rating } from "@/components/rating";

interface ReviewStatsProps {
  totalReviews: number;
  averageRating: number;
  ratingDistribution?: { rating: number; count: number }[];
}

export function ReviewStats({
  totalReviews,
  averageRating,
  ratingDistribution,
}: ReviewStatsProps) {
  const roundedAverage = Math.round(averageRating * 10) / 10;

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="text-center">
        <div className="mb-2 flex items-center justify-center space-x-2">
          <span className="font-bold text-3xl">{roundedAverage}</span>
          <Rating rating={Math.round(averageRating)} />
        </div>
        <p className="text-muted-foreground text-sm">
          Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
        </p>
      </div>

      {ratingDistribution && ratingDistribution.length > 0 && (
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const distribution = ratingDistribution.find(
              (d) => d.rating === rating,
            );
            const count = distribution?.count || 0;
            const percentage =
              totalReviews > 0 ? (count / totalReviews) * 100 : 0;

            return (
              <div key={rating} className="flex items-center space-x-2 text-sm">
                <span>{rating}</span>
                <div className="h-2 flex-1 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="min-w-[2rem] text-right text-muted-foreground">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
