import type { Metadata } from "next";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { toTitleCase, unslugify } from "@/lib/utils";

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Shell } from "@/components/shell";
import { env } from "@/env.js";
import { getCategoryBySlug } from "@/features/categories/queries/categories";
import { Products } from "@/features/products/components/products";
import { getProducts } from "@/features/products/queries/products";
import { getSubcategoryBySlug } from "@/features/subcategories/queries/subcategories";

export async function generateMetadata({
  params,
}: PageProps<"/collections/[category]/[subcategory]">): Promise<Metadata> {
  const { subcategory } = await params;
  return {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: toTitleCase(subcategory),
    description: `Buy the best ${subcategory}`,
  };
}

export default async function SubcategoryPage({
  params,
  searchParams,
}: PageProps<"/collections/[category]/[subcategory]">) {
  const { category, subcategory } = await params;
  const q = await searchParams;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const categoryData = await getCategoryBySlug(category);
  const subcategoryData = await getSubcategoryBySlug(subcategory);

  const searchParamsWithFilters = {
    ...q,
    ...(categoryData && { categories: categoryData.id }),
    ...(subcategoryData && { subcategories: subcategoryData.id }),
  };

  const products = await getProducts(
    searchParamsWithFilters,
    session?.user?.id,
  );

  return (
    <Shell>
      <PageHeader>
        <PageHeaderHeading size="sm">
          {toTitleCase(unslugify(subcategory))}
        </PageHeaderHeading>
        <PageHeaderDescription size="sm">
          {`Buy the best ${unslugify(subcategory)} ${category}`}
        </PageHeaderDescription>
      </PageHeader>
      <Products products={products.data} pageCount={products.pageCount} />
    </Shell>
  );
}
