import { headers } from "next/headers";
import * as React from "react";

import { auth } from "@/lib/auth";

import { Lobby } from "@/features/apps/components/lobby";
import { LobbySkeleton } from "@/features/apps/components/lobby-skeleton";
import { getAllCategories } from "@/features/categories/queries/categories";
import { getFeaturedProducts } from "@/features/products/queries/products";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const productsPromise = getFeaturedProducts(session?.user?.id);
  const categoriesPromise = getAllCategories();

  return (
    <React.Suspense fallback={<LobbySkeleton />}>
      <Lobby
        productsPromise={productsPromise}
        categoriesPromise={categoriesPromise}
      />
    </React.Suspense>
  );
}
