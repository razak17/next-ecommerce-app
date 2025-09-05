"use server";

import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { redirects } from "@/lib/constants";
import { getErrorMessage } from "@/lib/handle-error";

import { db } from "@/db/drizzle";
import {
  type Product,
  products,
  productVariants,
  productVariantValues,
  stocks,
  variants,
} from "@/db/schema";
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

    const [newProduct] = await db
      .insert(products)
      .values({
        name: input.name,
        description: input.description,
        categoryId: input.categoryId,
        subcategoryId: input.subcategoryId || null,
        price: input.price,
        inventory: input.inventory,
        images: JSON.stringify(input.images) as unknown as StoredFile[],
      })
      .returning();

    // Handle variants if provided
    if (input.variants && input.variants.length > 0) {
      for (const variant of input.variants) {
        // Check if variant exists or create new one
        let existingVariant = await db.query.variants.findFirst({
          where: eq(variants.name, variant.name),
        });

        if (!existingVariant) {
          [existingVariant] = await db
            .insert(variants)
            .values({
              name: variant.name,
            })
            .returning();
        }

        // Create product variant relationship
        const [productVariant] = await db
          .insert(productVariants)
          .values({
            productId: newProduct.id,
            variantId: existingVariant.id,
          })
          .returning();

        // Create variant values
        for (const value of variant.values) {
          // Create stock entry first
          const [stock] = await db
            .insert(stocks)
            .values({
              productVariantId: productVariant.id,
              quantity: value.inventory,
            })
            .returning();

          // Create variant value
          await db.insert(productVariantValues).values({
            productVariantId: productVariant.id,
            value: value.value,
            price: value.price,
            stockId: stock.id,
          });
        }
      }
    }

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

    // Handle variants update
    if (input.variants && input.variants.length > 0) {
      // Delete existing product variants and their values
      const existingProductVariants = await db.query.productVariants.findMany({
        where: eq(productVariants.productId, id),
      });

      for (const pv of existingProductVariants) {
        // Delete variant values and their stocks
        const variantValues = await db.query.productVariantValues.findMany({
          where: eq(productVariantValues.productVariantId, pv.id),
        });

        for (const vv of variantValues) {
          await db.delete(stocks).where(eq(stocks.id, vv.stockId));
        }

        await db
          .delete(productVariantValues)
          .where(eq(productVariantValues.productVariantId, pv.id));
        await db.delete(productVariants).where(eq(productVariants.id, pv.id));
      }

      // Create new variants
      for (const variant of input.variants) {
        // Check if variant exists or create new one
        let existingVariant = await db.query.variants.findFirst({
          where: eq(variants.name, variant.name),
        });

        if (!existingVariant) {
          [existingVariant] = await db
            .insert(variants)
            .values({
              name: variant.name,
            })
            .returning();
        }

        // Create product variant relationship
        const [productVariant] = await db
          .insert(productVariants)
          .values({
            productId: id,
            variantId: existingVariant.id,
          })
          .returning();

        // Create variant values
        for (const value of variant.values) {
          // Create stock entry first
          const [stock] = await db
            .insert(stocks)
            .values({
              productVariantId: productVariant.id,
              quantity: value.inventory,
            })
            .returning();

          // Create variant value
          await db.insert(productVariantValues).values({
            productVariantId: productVariant.id,
            value: value.value,
            price: value.price,
            stockId: stock.id,
          });
        }
      }
    }

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
