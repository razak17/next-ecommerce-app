import { Suspense } from "react";

import { ReviewsTable } from "./reviews-table";
import { Shell } from "@/components/shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllReviews } from "@/features/reviews/queries/reviews";
import type { SearchParams } from "@/types";

interface ReviewsPageProps {
  searchParams: SearchParams;
}

async function ReviewsContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { data: reviews } = await getAllReviews(searchParams);

  if (reviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-bold text-2xl">No reviews found</CardTitle>
          <CardDescription>
            No customer reviews have been submitted yet.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Reviews ({reviews.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <ReviewsTable reviews={reviews} />
      </CardContent>
    </Card>
  );
}

export default function ReviewsPage({ searchParams }: ReviewsPageProps) {
  return (
    <Shell className="flex flex-col">
      <div className="w-full">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <CardTitle className="font-bold text-2xl">Reviews</CardTitle>
                <CardDescription>
                  Manage customer reviews and feedback
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading reviews...</div>}>
              <ReviewsContent searchParams={searchParams} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
