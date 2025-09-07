"use client";

import { IconUser } from "@tabler/icons-react";
import { useEffect } from "react";

import { ErrorCard } from "@/components/error-card";
import { Shell } from "@/components/shell";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function UserError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("User error:", error);
  }, [error]);

  return (
    <Shell className="flex min-h-screen flex-col items-center justify-center">
      <div className="container mx-auto max-w-md py-10">
        <ErrorCard
          title="User Error"
          description="We couldn't load the user information. Please try again."
          retryLink="/admin/dashboard"
          retryLinkText="Dashboard"
          dashboardLink="/admin/users"
          dashboardLinkText="Back To Users"
          dashboardIcon={IconUser}
          reset={reset}
          error={error}
        />
      </div>
    </Shell>
  );
}
