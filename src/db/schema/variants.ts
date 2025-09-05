import { relations } from "drizzle-orm";
import { decimal, index, pgTable, text, varchar } from "drizzle-orm/pg-core";

import { generateId } from "@/lib/id";

import { products } from "./products";
import { stocks } from "./stocks";
import { lifecycleDates } from "./utils";

// store variants
export const variants = pgTable("variants", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  name: text("name").notNull(),
  ...lifecycleDates,
});

export type Variant = typeof variants.$inferSelect;
export type NewVariant = typeof variants.$inferInsert;

export const productVariants = pgTable(
  "product_variants",
  {
    id: varchar("id", { length: 30 })
      .$defaultFn(() => generateId())
      .primaryKey(),
    productId: varchar("product_id", { length: 30 })
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    variantId: varchar("variant_id", { length: 30 })
      .references(() => variants.id, { onDelete: "cascade" })
      .notNull(),
    ...lifecycleDates,
  },
  (table) => [
    index("product_variants_product_id_idx").on(table.productId),
    index("product_variants_variant_id_idx").on(table.variantId),
  ],
);

export const productVariantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
      relationName: "productVariants",
    }),
    variant: one(variants, {
      fields: [productVariants.variantId],
      references: [variants.id],
    }),
    productVariantValues: many(productVariantValues),
  }),
);

export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = typeof productVariants.$inferInsert;

export const productVariantValues = pgTable("product_variant_values", {
  productVariantId: varchar("product_variant_id", { length: 30 })
    .references(() => productVariants.id, { onDelete: "cascade" })
    .notNull(),
  value: text("value").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stockId: varchar("stock_id", { length: 30 })
    .references(() => stocks.id, { onDelete: "cascade" })
    .notNull(),
  ...lifecycleDates,
});

export const productVariantValuesRelations = relations(
  productVariantValues,
  ({ one }) => ({
    productVariant: one(productVariants, {
      fields: [productVariantValues.productVariantId],
      references: [productVariants.id],
    }),
    stock: one(stocks, {
      fields: [productVariantValues.stockId],
      references: [stocks.id],
    }),
  }),
);

export type ProductVariantValue = typeof productVariantValues.$inferSelect;
export type NewProductVariantValue = typeof productVariantValues.$inferInsert;
