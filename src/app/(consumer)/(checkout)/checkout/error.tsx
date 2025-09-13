"use client";

import * as React from "react";

import { ErrorCard } from "@/components/error-card";
import { Shell } from "@/components/shell";

export default function StoreCheckoutError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Shell className="flex min-h-screen flex-col items-center justify-center">
      <div className="container mx-auto max-w-md py-10">
        <ErrorCard
          title="Checkout Error"
          description="An error occurred while checking out."
          retryLink="/cart"
          retryLinkText="Go To Cart"
          reset={reset}
          error={error}
        />
      </div>
    </Shell>
  );
}
