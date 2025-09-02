"use client";

import { useEffect } from "react";

import { ErrorCard } from "@/components/error-card";
import { Shell } from "@/components/shell";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <Shell className="flex min-h-screen flex-col items-center justify-center">
      <div className="container mx-auto max-w-md py-10">
        <ErrorCard
          title="Something went wrong!"
          description="An unexpected error occurred. Please try again or contact support if the problem persists."
          retryLink="/"
          retryLinkText="Go to Home"
          reset={reset}
          error={error}
        />
      </div>
    </Shell>
  );
}
