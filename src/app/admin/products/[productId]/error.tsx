"use client";

import { IconPackage } from "@tabler/icons-react";
import { useEffect } from "react";

import { ErrorCard } from "@/components/error-card";
import { Shell } from "@/components/shell";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProductError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Product error:", error);
  }, [error]);

  return (
    <Shell className="flex min-h-screen flex-col items-center justify-center">
      <div className="container mx-auto max-w-md py-10">
        <ErrorCard
          title="Product Error"
          description="An error occurred while loading this product. It might have been deleted or there's a connection issue."
          retryLink="/admin/dashboard"
          retryLinkText="Dashboard"
          dashboardLink="/admin/products"
          dashboardLinkText="Products"
          dashboardIcon={IconPackage}
          reset={reset}
          error={error}
        />
      </div>
    </Shell>
  );
}
