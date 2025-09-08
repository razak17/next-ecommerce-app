import * as React from "react";

import { Lobby } from "@/features/apps/components/lobby";
import { LobbySkeleton } from "@/features/apps/components/lobby-skeleton";
import { getAllCategories } from "@/features/categories/queries/categories";
import { getFeaturedProducts } from "@/features/products/queries/products";

export default async function Home() {
  const productsPromise = getFeaturedProducts();
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
