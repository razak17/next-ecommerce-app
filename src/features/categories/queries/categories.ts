import "server-only";

import { and, asc, count, desc, eq, ilike } from "drizzle-orm";
import { unstable_cache as cache } from "next/cache";

import { db } from "@/db/drizzle";
import { type Category, categories } from "@/db/schema";
import type { SearchParams } from "@/types";
import { getCategoriesSchema } from "../validations/categories";

export async function getCategories(input: SearchParams) {
  try {
    const search = getCategoriesSchema.parse(input);

    const limit = search.per_page;
    const offset = (search.page - 1) * limit;

    const [column, order] = (search.sort?.split(".") as [
      keyof Category | undefined,
      "asc" | "desc" | undefined,
    ]) ?? ["createdAt", "desc"];

    const data = await db
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
      .limit(limit)
      .offset(offset)
      .where(
        and(
          search.name ? ilike(categories.name, `%${search.name}%`) : undefined,
        ),
      )
      .orderBy(
        column && column in categories
          ? order === "asc"
            ? asc(categories[column])
            : desc(categories[column])
          : desc(categories.createdAt),
      );

    const totalResult = await db
      .select({ count: count() })
      .from(categories)
      .where(
        and(
          search.name ? ilike(categories.name, `%${search.name}%`) : undefined,
        ),
      );

    const total = totalResult[0]?.count ?? 0;
    const pageCount = Math.ceil(total / limit);

    return {
      data,
      pageCount,
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      data: [],
      pageCount: 0,
    };
  }
}

export async function getAllCategories() {
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

export async function getCategoryBySlug(slug: string) {
  return await cache(
    async () => {
      const category = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, slug))
        .limit(1);

      return category[0] || null;
    },
    [`category-slug-${slug}`],
    {
      revalidate: 3600, // every hour
      tags: [`category-slug-${slug}`],
    },
  )();
}
