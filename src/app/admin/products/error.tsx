"use client";

import { IconPackage } from "@tabler/icons-react";
import { useEffect } from "react";

import { redirects } from "@/lib/constants";

import { ErrorCard } from "@/components/error-card";
import { Shell } from "@/components/shell";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProductsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Products error:", error);
  }, [error]);

  return (
    <Shell className="flex min-h-screen flex-col items-center justify-center">
      <div className="container mx-auto max-w-md py-10">
        <ErrorCard
          title="Products Error"
          description="An error occurred while loading products. This might be a database connection issue."
          retryLink={redirects.adminToDashboard}
          retryLinkText="Dashboard"
          dashboardLink={redirects.adminToProducts}
          dashboardLinkText="Products"
          dashboardIcon={IconPackage}
          reset={reset}
          error={error}
        />
      </div>
    </Shell>
  );
}
