import { headers } from "next/headers";
import * as React from "react";

import { auth } from "@/lib/auth";

import { siteConfig } from "@/config/site";
import BannerCarousel from "@/features/apps/components/banner-carousel";
import { Lobby } from "@/features/apps/components/lobby";
import { LobbySkeleton } from "@/features/apps/components/lobby-skeleton";
import { getFeaturedCategories } from "@/features/categories/queries/categories";
import { getFeaturedProducts } from "@/features/products/queries/products";

export function HomeContent({ userId }: { userId?: string }) {
  const productsPromise = getFeaturedProducts(userId);
  const categoriesPromise = getFeaturedCategories();

  return (
    <Lobby
      productsPromise={productsPromise}
      categoriesPromise={categoriesPromise}
    />
  );
}

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex min-h-screen flex-col">
      <BannerCarousel items={siteConfig.bannerSlides} />
      <React.Suspense fallback={<LobbySkeleton />}>
        <HomeContent userId={session?.user?.id} />
      </React.Suspense>
    </div>
  );
}
