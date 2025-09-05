import "server-only";

import { and, asc, count, desc, eq, gte, inArray, lte } from "drizzle-orm";
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from "next/cache";

import { db } from "@/db/drizzle";
import { categories, type Product, products, subcategories } from "@/db/schema";
import type { SearchParams } from "@/types";
import { getProductsSchema } from "../validations/products";

// See the unstable_cache API docs: https://nextjs.org/docs/app/api-reference/functions/unstable_cache
export async function getFeaturedProducts() {
  return await cache(
    async () => {
      return db
        .select({
          id: products.id,
          name: products.name,
          images: products.images,
          category: categories.name,
          price: products.price,
          inventory: products.inventory,
        })
        .from(products)
        .limit(8)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .groupBy(products.id, categories.name)
        .orderBy(desc(count(products.images)), desc(products.createdAt));
    },
    ["featured-products"],
    {
      revalidate: 3600, // every hour
      tags: ["featured-products"],
    },
  )();
}

// See the unstable_noStore API docs: https://nextjs.org/docs/app/api-reference/functions/unstable_noStore
export async function getProducts(input: SearchParams) {
  noStore();

  try {
    const search = getProductsSchema.parse(input);

    const limit = search.per_page;
    const offset = (search.page - 1) * limit;

    const [column, order] = (search.sort?.split(".") as [
      keyof Product | undefined,
      "asc" | "desc" | undefined,
    ]) ?? ["createdAt", "desc"];
    const [minPrice, maxPrice] = search.price_range?.split("-") ?? [];
    const categoryIds = search.categories?.split(".") ?? [];
    const subcategoryIds = search.subcategories?.split(".") ?? [];

    const data = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        images: products.images,
        category: categories.name,
        subcategory: subcategories.name,
        price: products.price,
        inventory: products.inventory,
        rating: products.rating,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .limit(limit)
      .offset(offset)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(subcategories, eq(products.subcategoryId, subcategories.id))
      .where(
        and(
          categoryIds.length > 0
            ? inArray(products.categoryId, categoryIds)
            : undefined,
          subcategoryIds.length > 0
            ? inArray(products.subcategoryId, subcategoryIds)
            : undefined,
          minPrice ? gte(products.price, minPrice) : undefined,
          maxPrice ? lte(products.price, maxPrice) : undefined,
        ),
      )
      .groupBy(products.id)
      .orderBy(
        column && column in products
          ? order === "asc"
            ? asc(products[column])
            : desc(products[column])
          : desc(products.createdAt),
      );

    const total = await db
      .select({
        count: count(products.id),
      })
      .from(products)
      .where(
        and(
          categoryIds.length > 0
            ? inArray(products.categoryId, categoryIds)
            : undefined,
          subcategoryIds.length > 0
            ? inArray(products.subcategoryId, subcategoryIds)
            : undefined,
          minPrice ? gte(products.price, minPrice) : undefined,
          maxPrice ? lte(products.price, maxPrice) : undefined,
        ),
      )
      .then((res) => res[0]?.count ?? 0);

    const pageCount = Math.ceil(total / limit);

    return {
      data,
      pageCount,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      data: [],
      pageCount: 0,
    };
  }
}

export async function getProductCountByCategory({
  categoryId,
}: {
  categoryId: string;
}) {
  return await cache(
    async () => {
      return db
        .select({
          count: count(products.id),
        })
        .from(products)
        .where(eq(products.categoryId, categoryId))
        .execute()
        .then((res) => res[0]?.count ?? 0);
    },
    [`product-count-${categoryId}`],
    {
      revalidate: 3600, // every hour
      tags: [`product-count-${categoryId}`],
    },
  )();
}

export async function getProduct(id: string) {
  noStore();

  try {
    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        category: true,
        subcategory: true,
      },
    });

    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function getProductWithVariants(id: string) {
  noStore();

  try {
    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        category: true,
        subcategory: true,
        variants: {
          with: {
            variant: true,
            productVariantValues: {
              with: {
                productVariant: true,
              },
            },
          },
        },
      },
    });

    return product;
  } catch (error) {
    console.error("Error fetching product with variants:", error);
    return null;
  }
}

export async function getAllProducts() {
  return await cache(
    async () => {
      return db
        .select({
          id: products.id,
          name: products.name,
          description: products.description,
          images: products.images,
          category: categories.name,
          subcategory: subcategories.name,
          price: products.price,
          inventory: products.inventory,
          rating: products.rating,
          createdAt: products.createdAt,
          updatedAt: products.updatedAt,
        })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .leftJoin(subcategories, eq(products.subcategoryId, subcategories.id))
        .orderBy(desc(products.createdAt));
    },
    ["all-products"],
    {
      revalidate: 3600, // every hour
      tags: ["all-products"],
    },
  )();
}
