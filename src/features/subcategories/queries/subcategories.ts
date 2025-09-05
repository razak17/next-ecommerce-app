import "server-only";

import { and, asc, count, desc, eq, ilike, inArray } from "drizzle-orm";
import { unstable_cache as cache } from "next/cache";

import { db } from "@/db/drizzle";
import { categories, type Subcategory, subcategories } from "@/db/schema";
import type { SearchParams } from "@/types";
import { getSubcategoriesSchema } from "../validations/subcategories";

export async function getSubcategories(input: SearchParams) {
  try {
    const search = getSubcategoriesSchema.parse(input);

    const limit = search.per_page;
    const offset = (search.page - 1) * limit;

    const [column, order] = (search.sort?.split(".") as [
      keyof Subcategory | undefined,
      "asc" | "desc" | undefined,
    ]) ?? ["createdAt", "desc"];
    const categoryIds = search.categoryId ? [search.categoryId] : [];

    const data = await db
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
      .limit(limit)
      .offset(offset)
      .leftJoin(categories, eq(subcategories.categoryId, categories.id))
      .where(
        and(
          search.name
            ? ilike(subcategories.name, `%${search.name}%`)
            : undefined,
          categoryIds.length > 0
            ? inArray(subcategories.categoryId, categoryIds)
            : undefined,
        ),
      )
      .orderBy(
        column && column in subcategories
          ? order === "asc"
            ? asc(subcategories[column])
            : desc(subcategories[column])
          : desc(subcategories.createdAt),
      );

    const totalResult = await db
      .select({ count: count() })
      .from(subcategories)
      .leftJoin(categories, eq(subcategories.categoryId, categories.id))
      .where(
        and(
          search.name
            ? ilike(subcategories.name, `%${search.name}%`)
            : undefined,
          categoryIds.length > 0
            ? inArray(subcategories.categoryId, categoryIds)
            : undefined,
        ),
      );

    const total = totalResult[0]?.count ?? 0;
    const pageCount = Math.ceil(total / limit);

    return {
      data,
      pageCount,
    };
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return {
      data: [],
      pageCount: 0,
    };
  }
}

export async function getAllSubcategories() {
  return await cache(
    async () => {
      return db
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
        .orderBy(asc(categories.name), asc(subcategories.name));
    },
    ["all-subcategories"],
    {
      revalidate: 3600,
      tags: ["all-subcategories"],
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
