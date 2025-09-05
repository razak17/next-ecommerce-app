"use client";

import {
  IconBug,
  IconHome,
  IconRefresh,
  IconSettings,
} from "@tabler/icons-react";
import Link from "next/link";
import type * as React from "react";

import { cn } from "@/lib/utils";

import { ClientButton } from "@/components/client-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ErrorCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  icon?: React.ComponentType<{ className?: string }>;
  dashboardIcon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  retryLink?: string;
  retryLinkText?: string;
  dashboardLink?: string;
  dashboardLinkText?: string;
  reset?: () => void;
  error?: Error & { digest?: string };
}

export function ErrorCard({
  icon: Icon = IconBug,
  dashboardIcon: DashboardIcon = IconSettings,
  title,
  description,
  retryLink,
  retryLinkText = "Go back",
  dashboardLink,
  dashboardLinkText = "Landing Page",
  reset,
  error,
  className,
  ...props
}: ErrorCardProps) {
  return (
    <Card
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={cn("overflow-hidden", className)}
      {...props}
    >
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 text-6xl text-destructive">
          <Icon className="size-10" aria-hidden="true" />
        </div>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="line-clamp-4">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {process.env.NEXT_PUBLIC_APP_ENV === "development" && error && (
          <div className="max-h-48 overflow-auto rounded-md bg-muted p-4">
            <h4 className="font-medium text-sm">Error Details:</h4>
            <p className="mt-1 text-muted-foreground text-sm">
              {error.message}
            </p>
            {error.digest && (
              <p className="mt-1 text-muted-foreground text-xs">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}
        <div className="flex flex-col gap-4">
          {reset ? (
            <ClientButton
              onClick={reset}
              variant="default"
              className="flex flex-1 items-center gap-2"
            >
              <IconRefresh className="size-4" />
              Try Again
            </ClientButton>
          ) : null}
          <div className="flex gap-4">
            {dashboardLink ? (
              <ClientButton asChild variant="outline" className="flex-1">
                <Link href={dashboardLink} className="flex items-center gap-2">
                  <DashboardIcon className="size-4" />
                  {dashboardLinkText}
                </Link>
              </ClientButton>
            ) : null}
            {retryLink ? (
              <ClientButton asChild variant="outline" className="flex-1">
                <Link href={retryLink} className="flex items-center gap-2">
                  <IconHome className="size-4" />
                  {retryLinkText}
                </Link>
              </ClientButton>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
