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
    <Shell variant="centered" className="max-w-md">
      <ErrorCard title={error.name} description={error.message} reset={reset} />
    </Shell>
  );
}
