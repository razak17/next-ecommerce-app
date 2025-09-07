"use client";

import { useEffect } from "react";

import { ErrorCard } from "@/components/error-card";
import { Shell } from "@/components/shell";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function UsersError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Users error:", error);
  }, [error]);

  return (
    <Shell className="flex min-h-screen flex-col items-center justify-center">
      <div className="container mx-auto max-w-md py-10">
        <ErrorCard
          title="Users Error"
          description="We couldn't load the users page. Please try again."
          retryLink="/admin/dashboard"
          retryLinkText="Dashboard"
          reset={reset}
          error={error}
        />
      </div>
    </Shell>
  );
}
