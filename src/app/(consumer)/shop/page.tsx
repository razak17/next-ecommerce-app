import { headers } from "next/headers";
import { Suspense } from "react";

import { auth } from "@/lib/auth";

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { PaginationButton } from "@/components/pagination-button";
import { Shell } from "@/components/shell";
import { getAllCategories } from "@/features/categories/queries/categories";
import { ProductFilters } from "@/features/products/components/product-filters";
import { ProductsGrid } from "@/features/products/components/products-grid";
import { ShopSkeleton } from "@/features/products/components/shop-skeleton";
import { getProducts } from "@/features/products/queries/products";
import { getAllSubcategories } from "@/features/subcategories/queries/subcategories";
import type { SearchParams } from "@/types";

interface ShopPageProps {
  searchParams: Promise<SearchParams>;
}

async function ShopPageContent({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const [{ data: products, pageCount }, categories, subcategories] =
    await Promise.all([
      getProducts(params, session?.user?.id),
      getAllCategories(),
      getAllSubcategories(),
    ]);

  const page = Array.isArray(params.page)
    ? params.page[0]
    : (params.page ?? "1");
  const per_page = Array.isArray(params.per_page)
    ? params.per_page[0]
    : (params.per_page ?? "10");
  const sort = Array.isArray(params.sort)
    ? params.sort[0]
    : (params.sort ?? "createdAt.desc");

  return (
    <Shell className="min-h-screen">
      <PageHeader>
        <PageHeaderHeading>Shop</PageHeaderHeading>
        <PageHeaderDescription>
          Discover our collection of products
        </PageHeaderDescription>
      </PageHeader>

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <aside className="w-full lg:w-72 lg:shrink-0">
          <ProductFilters
            categories={categories}
            subcategories={subcategories}
          />
        </aside>

        <main className="flex-1 space-y-6">
          <ProductsGrid products={products} />
          {pageCount > 1 && (
            <div className="flex justify-center">
              <PaginationButton
                pageCount={pageCount}
                page={page}
                per_page={per_page}
                sort={sort}
              />
            </div>
          )}
        </main>
      </div>
    </Shell>
  );
}

export default function ShopPage({ searchParams }: PageProps<"/shop">) {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopPageContent searchParams={searchParams} />
    </Suspense>
  );
}
