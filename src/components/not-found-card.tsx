"use client";

import { IconArrowLeft, IconHome, IconPackage } from "@tabler/icons-react";
import type { Route } from "next";
import Link from "next/link";
import type * as React from "react";

import { ClientButton } from "./client-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface NotFoundCardProps
  extends React.ComponentPropsWithoutRef<typeof Card> {
  title?: string;
  description?: string;
  dashboardLink?: Route;
  dashboardLinkText?: string;
  homeLink?: Route;
  homeLinkText?: string;
}

export function NotFoundCard({
  title = "Page Not Found",
  description = "The page you're looking for doesn't exist or has been moved.",
  dashboardLink,
  dashboardLinkText = "Landing Page",
  homeLink = "/",
  homeLinkText = "Go Home",
}: NotFoundCardProps) {
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 text-6xl">404</div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row">
        <div className="flex w-full flex-col gap-4">
          {dashboardLink ? (
            <ClientButton asChild variant="default">
              <Link href={dashboardLink} className="flex items-center gap-2">
                <IconPackage className="h-4 w-4" />
                {dashboardLinkText}
              </Link>
            </ClientButton>
          ) : null}
          <div className="flex gap-4">
            <ClientButton asChild variant="outline" className="flex-1">
              <Link href={homeLink} className="flex items-center gap-2">
                <IconHome className="h-4 w-4" />
                {homeLinkText}
              </Link>
            </ClientButton>
            <ClientButton
              variant="outline"
              className="flex-1"
              onClick={() => window.history.back()}
            >
              <IconArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </ClientButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
