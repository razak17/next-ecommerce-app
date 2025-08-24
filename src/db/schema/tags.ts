import { relations } from "drizzle-orm";
import { index, pgTable, primaryKey, text, varchar } from "drizzle-orm/pg-core";

import { generateId } from "@/lib/id";

import { products } from "./products";
import { lifecycleDates } from "./utils";

// store tags
export const tags = pgTable("tags", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull().default("blue"),
  ...lifecycleDates,
});

export const tagsRelations = relations(tags, ({ many }) => ({
  products: many(products, {
    relationName: "productTags",
  }),
}));

export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;

export const productTags = pgTable(
  "product_tags",
  {
    productId: varchar("product_id", { length: 30 })
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    tagId: varchar("tag_id", { length: 30 })
      .references(() => tags.id, { onDelete: "cascade" })
      .notNull(),
    ...lifecycleDates,
  },
  (table) => [
    primaryKey({
      name: "product_tags_pk",
      columns: [table.productId, table.tagId],
    }),
    index("product_tags_product_id_tag_id_idx").on(
      table.productId,
      table.tagId,
    ),
  ],
);

export const productTagsRelations = relations(productTags, ({ one }) => ({
  product: one(products, {
    fields: [productTags.productId],
    references: [products.id],
  }),
  tag: one(tags, { fields: [productTags.tagId], references: [tags.id] }),
}));

export type ProductTag = typeof productTags.$inferSelect;
export type NewProductTag = typeof productTags.$inferInsert;
