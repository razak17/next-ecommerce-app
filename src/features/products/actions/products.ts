"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { redirects } from "@/lib/constants";
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
    const programWithSameName = await db.query.products.findFirst({
      columns: {
        id: true,
      },
      where: eq(products.name, input.name),
    });

    if (programWithSameName) {
      throw new Error("Product name already taken.");
    }

    await db.insert(products).values({
      name: input.name,
      description: input.description,
      categoryId: input.categoryId,
      subcategoryId: input.subcategoryId || null,
      price: input.price,
      inventory: input.inventory,
      images: JSON.stringify(input.images) as unknown as StoredFile[],
    });

    revalidatePath(redirects.adminToProducts);

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
