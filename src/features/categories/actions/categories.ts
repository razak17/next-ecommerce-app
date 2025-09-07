"use server";

import { and, eq, ne, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { getErrorMessage } from "@/lib/handle-error";

import { db } from "@/db/drizzle";
import { type Category, categories } from "@/db/schema";
import type { CreateCategorySchema } from "../validations/categories";

export async function addCategory(input: CreateCategorySchema) {
  try {
    const categoryWithSameNameOrSlug = await db.query.categories.findFirst({
      columns: {
        id: true,
      },
      where: eq(categories.name, input.name) || eq(categories.slug, input.slug),
    });

    if (categoryWithSameNameOrSlug) {
      throw new Error("Category name or slug already taken.");
    }

    await db.insert(categories).values({
      ...input,
    });

    revalidatePath("/admin/categories");

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function updateCategory(
  id: Category["id"],
  input: CreateCategorySchema,
) {
  try {
    const category = await db.query.categories.findFirst({
      where: eq(categories.id, categories.id),
    });

    if (!category) {
      throw new Error("Category not found.");
    }

    const categoryWithSameNameOrSlug = await db.query.categories.findFirst({
      columns: {
        id: true,
      },
      where: and(
        ne(categories.id, id),
        or(eq(categories.name, input.name), eq(categories.slug, input.slug)),
      ),
    });

    if (categoryWithSameNameOrSlug) {
      throw new Error("Category name or slug already taken.");
    }

    await db
      .update(categories)
      .set({
        ...input,
      })
      .where(eq(categories.id, id));

    revalidatePath("/admin/categories");

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function deleteCategory(id: Category["id"]) {
  try {
    const category = await db.query.categories.findFirst({
      where: eq(categories.id, categories.id),
    });

    if (!category) {
      throw new Error("Category not found.");
    }

    await db.delete(categories).where(eq(categories.id, id));

    revalidatePath("/admin/categories");

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}
