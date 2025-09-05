import "server-only";

import { asc, eq } from "drizzle-orm";
import { unstable_cache as cache } from "next/cache";

import { db } from "@/db/drizzle";
import { categories, subcategories } from "@/db/schema";

export async function getSubcategories() {
  return await cache(
    async () => {
      return db
        .selectDistinct({
          id: subcategories.id,
          name: subcategories.name,
          slug: subcategories.slug,
          description: subcategories.description,
          categoryId: subcategories.categoryId,
          categoryName: categories.name,
          createdAt: subcategories.createdAt,
          updatedAt: subcategories.updatedAt,
        })
        .from(subcategories)
        .leftJoin(categories, eq(subcategories.categoryId, categories.id));
    },
    ["subcategories"],
    {
      revalidate: 3600, // every hour
      tags: ["subcategories"],
    },
  )();
}

export async function getSubcategoryById(id: string) {
  return await cache(
    async () => {
      const subcategory = await db
        .select({
          id: subcategories.id,
          name: subcategories.name,
          slug: subcategories.slug,
          description: subcategories.description,
          categoryId: subcategories.categoryId,
          categoryName: categories.name,
          createdAt: subcategories.createdAt,
          updatedAt: subcategories.updatedAt,
        })
        .from(subcategories)
        .leftJoin(categories, eq(subcategories.categoryId, categories.id))
        .where(eq(subcategories.id, id))
        .limit(1);

      return subcategory[0] || null;
    },
    [`subcategory-${id}`],
    {
      revalidate: 3600,
      tags: [`subcategory-${id}`],
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

export async function getSubcategoriesByCategory(categoryId: string) {
  return await cache(
    async () => {
      return db
        .select({
          id: subcategories.id,
          name: subcategories.name,
          slug: subcategories.slug,
          description: subcategories.description,
          categoryId: subcategories.categoryId,
        })
        .from(subcategories)
        .where(eq(subcategories.categoryId, categoryId))
        .orderBy(asc(subcategories.name));
    },
    [`subcategories-category-${categoryId}`],
    {
      revalidate: 3600,
      tags: [`subcategories-category-${categoryId}`],
    },
  )();
}
