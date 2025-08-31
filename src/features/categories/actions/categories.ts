"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { redirects } from "@/lib/constants";
import { getErrorMessage } from "@/lib/handle-error";

import { db } from "@/db/drizzle";
import { categories } from "@/db/schema";
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

    revalidatePath(redirects.adminToCategories);

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

export async function updateCategory(id: string, input: CreateCategorySchema) {
  try {
    const category = await db.query.categories.findFirst({
      where: eq(categories.id, categories.id),
    });

    if (!category) {
      throw new Error("Category not found.");
    }

    await db
      .update(categories)
      .set({
        ...input,
      })
      .where(eq(categories.id, id));

    revalidatePath(redirects.adminToCategories);

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

export async function deleteCategory(id: string) {
  try {
    const category = await db.query.categories.findFirst({
      where: eq(categories.id, categories.id),
    });

    if (!category) {
      throw new Error("Category not found.");
    }

    await db.delete(categories).where(eq(categories.id, id));

    revalidatePath(redirects.adminToCategories);

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
