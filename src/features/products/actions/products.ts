"use server";

import { revalidatePath } from "next/cache";

import { getErrorMessage } from "@/lib/handle-error";

import { db } from "@/db/drizzle";
import { products } from "@/db/schema";
import type { StoredFile } from "@/types";
import type { CreateProductSchema } from "../validations/products";

export async function addProduct(
  input: Omit<CreateProductSchema, "images"> & {
    images: StoredFile[];
  },
) {
  try {
    await db.insert(products).values({
      ...input,
      images: JSON.stringify(input.images) as unknown as StoredFile[],
    });

    revalidatePath("/admin/products");

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
