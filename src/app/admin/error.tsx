"use client";

import { useEffect } from "react";

import { ErrorCard } from "@/components/error-card";
import { Shell } from "@/components/shell";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Admin panel error:", error);
  }, [error]);

  return (
    <Shell className="flex min-h-screen flex-col items-center justify-center">
      <div className="container mx-auto max-w-md py-10">
        <ErrorCard
          title="Admin Panel Error"
          description="An error occurred in the admin panel. This might be a temporary issue."
          retryLink="/"
          retryLinkText="Go to Home"
          dashboardLink="/admin/dashboard"
          dashboardLinkText="Admin Dashboard"
          reset={reset}
          error={error}
        />
      </div>
    </Shell>
  );
}
