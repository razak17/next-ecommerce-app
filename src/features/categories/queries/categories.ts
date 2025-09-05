import "server-only";

import { desc, eq } from "drizzle-orm";
import { unstable_cache as cache } from "next/cache";

import { db } from "@/db/drizzle";
import { categories } from "@/db/schema";

export async function getCategories() {
  return await cache(
    async () => {
      return db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
          image: categories.image,
          createdAt: categories.createdAt,
          updatedAt: categories.updatedAt,
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

export async function getCategoryById(id: string) {
  return await cache(
    async () => {
      const category = await db
        .select()
        .from(categories)
        .where(eq(categories.id, id))
        .limit(1);

      return category[0] || null;
    },
    [`category-${id}`],
    {
      revalidate: 3600, // every hour
      tags: [`category-${id}`],
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
