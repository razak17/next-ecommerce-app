"use server";

import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { redirects } from "@/lib/constants";
import { getErrorMessage } from "@/lib/handle-error";

import { db } from "@/db/drizzle";
import { type Product, products } from "@/db/schema";
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

export async function updateProduct(
  id: Product["id"],
  input: Omit<CreateProductSchema, "images"> & {
    images: StoredFile[];
  },
) {
  try {
    const existingProduct = await db.query.products.findFirst({
      columns: {
        id: true,
      },
      where: eq(products.id, id),
    });

    if (!existingProduct) {
      throw new Error("Product not found.");
    }

    const programWithSameName = await db.query.products.findFirst({
      columns: {
        id: true,
      },
      where: and(eq(products.name, input.name), ne(products.id, id)),
    });

    if (programWithSameName) {
      throw new Error("Product name already taken.");
    }

    await db
      .update(products)
      .set({
        name: input.name,
        description: input.description,
        categoryId: input.categoryId,
        subcategoryId: input.subcategoryId || null,
        price: input.price,
        inventory: input.inventory,
        images: JSON.stringify(input.images) as unknown as StoredFile[],
        updatedAt: new Date(),
      })
      .where(eq(products.id, id));

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

export async function deleteProduct(id: Product["id"]) {
  try {
    await db.delete(products).where(eq(products.id, id));

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
