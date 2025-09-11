import { headers } from "next/headers";
import * as React from "react";

import { auth } from "@/lib/auth";

import { siteConfig } from "@/config/site";
import BannerCarousel from "@/features/apps/components/banner-carousel";
import { Lobby } from "@/features/apps/components/lobby";
import { LobbySkeleton } from "@/features/apps/components/lobby-skeleton";
import { getAllCategories } from "@/features/categories/queries/categories";
import { getFeaturedProducts } from "@/features/products/queries/products";

async function HomeContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const productsPromise = getFeaturedProducts(session?.user?.id);
  const categoriesPromise = getAllCategories();

  return (
    <Lobby
      productsPromise={productsPromise}
      categoriesPromise={categoriesPromise}
    />
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <BannerCarousel items={siteConfig.bannerSlides} />
      <React.Suspense fallback={<LobbySkeleton />}>
        <HomeContent />
      </React.Suspense>
    </div>
  );
}
