import type { Metadata } from "next";

import { toTitleCase } from "@/lib/utils";

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

export async function generateMetadata({
  params,
}: PageProps<"/collections/[category]">): Promise<Metadata> {
  const { category } = await params;
  return {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: toTitleCase(category),
    description: `Buy products from the ${category} category`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps<"/collections/[category]">) {
  const { category } = await params;
  const q = await searchParams;

  const categoryData = await getCategoryBySlug(category);

  const searchParamsWithCategory = categoryData
    ? { ...q, categories: categoryData.id }
    : q;

  const products = await getProducts(searchParamsWithCategory);

  return (
    <Shell>
      <PageHeader>
        <PageHeaderHeading size="sm">{toTitleCase(category)}</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          {`Buy ${category} from the best stores`}
        </PageHeaderDescription>
      </PageHeader>
      <Products products={products.data} pageCount={products.pageCount} />
    </Shell>
  );
}
