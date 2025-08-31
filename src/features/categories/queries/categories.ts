"use server";

import { desc, eq } from "drizzle-orm";
import { unstable_cache as cache } from "next/cache";

import { db } from "@/db/drizzle";
import { categories, subcategories } from "@/db/schema";

export async function getCategories() {
  return await cache(
    async () => {
      return db
        .selectDistinct({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
          image: categories.image,
        })
        .from(categories)
        .orderBy(desc(categories.name));
    },
    ["categories"],
    {
      revalidate: 3600, // every hour
      tags: ["categories"],
    },
  )();
}

export async function getCategorySlugFromId({ id }: { id: string }) {
  return await cache(
    async () => {
      return db
        .select({
          slug: categories.slug,
        })
        .from(categories)
        .where(eq(categories.id, id))
        .execute()
        .then((res) => res[0]?.slug);
    },
    [`category-slug-${id}`],
    {
      revalidate: 3600, // every hour
      tags: [`category-slug-${id}`],
    },
  )();
}

export async function getSubcategories() {
  return await cache(
    async () => {
      return db
        .selectDistinct({
          id: subcategories.id,
          name: subcategories.name,
          slug: subcategories.slug,
          description: subcategories.description,
        })
        .from(subcategories);
    },
    ["subcategories"],
    {
      revalidate: 3600, // every hour
      tags: ["subcategories"],
    },
  )();
}

export async function getSubcategorySlugFromId({ id }: { id: string }) {
  return await cache(
    async () => {
      return db
        .select({
          slug: subcategories.slug,
        })
        .from(subcategories)
        .where(eq(subcategories.id, id))
        .execute()
        .then((res) => res[0]?.slug);
    },
    [`subcategory-slug-${id}`],
    {
      revalidate: 3600, // every hour
      tags: [`subcategory-slug-${id}`],
    },
  )();
}

export async function getSubcategoriesByCategory({
  categoryId,
}: {
  categoryId: string;
}) {
  return await cache(
    async () => {
      return db
        .selectDistinct({
          id: subcategories.id,
          name: subcategories.name,
          slug: subcategories.slug,
          description: subcategories.description,
        })
        .from(subcategories)
        .where(eq(subcategories.id, categoryId));
    },
    [`subcategories-${categoryId}`],
    {
      revalidate: 3600, // every hour
      tags: [`subcategories-${categoryId}`],
    },
  )();
}
