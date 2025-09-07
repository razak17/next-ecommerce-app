"use server";

import { and, eq, ne, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { getErrorMessage } from "@/lib/handle-error";

import { db } from "@/db/drizzle";
import { type Subcategory, subcategories } from "@/db/schema";
import type { CreateSubcategorySchema } from "../validations/subcategories";

export async function addSubcategory(input: CreateSubcategorySchema) {
  try {
    const subcategoryWithSameNameOrSlug =
      await db.query.subcategories.findFirst({
        columns: {
          id: true,
        },
        where: or(
          eq(subcategories.name, input.name),
          eq(subcategories.slug, input.slug),
        ),
      });

    if (subcategoryWithSameNameOrSlug) {
      throw new Error("Subcategory name or slug already taken.");
    }

    await db.insert(subcategories).values({
      ...input,
    });

    revalidatePath("/admin/subcategories");

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

export async function updateSubcategory(
  id: Subcategory["id"],
  input: CreateSubcategorySchema,
) {
  try {
    const subcategory = await db.query.subcategories.findFirst({
      where: eq(subcategories.id, id),
    });

    if (!subcategory) {
      throw new Error("Subcategory not found.");
    }

    const subcategoryWithSameNameOrSlug =
      await db.query.subcategories.findFirst({
        columns: {
          id: true,
        },
        where: and(
          ne(subcategories.id, id),
          or(
            eq(subcategories.name, input.name),
            eq(subcategories.slug, input.slug),
          ),
        ),
      });

    if (subcategoryWithSameNameOrSlug) {
      throw new Error("Subcategory name or slug already taken.");
    }

    await db
      .update(subcategories)
      .set({
        ...input,
      })
      .where(eq(subcategories.id, id));

    revalidatePath("/admin/subcategories");

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

export async function deleteSubcategory(id: Subcategory["id"]) {
  try {
    const subcategory = await db.query.subcategories.findFirst({
      where: eq(subcategories.id, id),
    });

    if (!subcategory) {
      throw new Error("Subcategory not found.");
    }

    await db.delete(subcategories).where(eq(subcategories.id, id));

    revalidatePath("/admin/subcategories");

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
