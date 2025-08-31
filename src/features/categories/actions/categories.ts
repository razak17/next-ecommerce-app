"use server";

import { revalidatePath } from "next/cache";

import { getErrorMessage } from "@/lib/handle-error";

import { db } from "@/db/drizzle";
import { categories } from "@/db/schema";
import type { StoredFile } from "@/types";
import type { CreateCategorySchema } from "../validations/categories";

export async function addCategory(
  input: Omit<CreateCategorySchema, "image"> & {
    image: StoredFile | null;
  },
) {
  try {
    await db.insert(categories).values({
      ...input,
      image: input.image?.url ?? null,
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
