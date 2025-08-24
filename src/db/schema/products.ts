import { relations } from "drizzle-orm";
import {
  decimal,
  integer,
  json,
  pgEnum,
  pgTable,
  text,
  varchar,
} from "drizzle-orm/pg-core";

import { generateId } from "@/lib/id";

import { categories } from "./categories";
import { subcategories } from "./subcategories";
import { lifecycleDates } from "./utils";
import type { StoredFile } from "@/types";

export const productStatusEnum = pgEnum("product_status", [
  "active",
  "draft",
  "archived",
]);

export const products = pgTable("products", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(), // prefix_ + nanoid (12)
  name: text("name").notNull(),
  description: text("description"),
  images: json("images").$type<StoredFile[] | null>().default(null),
  categoryId: varchar("category_id", { length: 30 })
    .references(() => categories.id, { onDelete: "cascade" })
    .notNull(),
  subcategoryId: varchar("subcategory_id", { length: 30 }).references(
    () => subcategories.id,
    { onDelete: "cascade" },
  ),
  price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
  originalPrice: decimal("original_price", {
    precision: 10,
    scale: 2,
  }).default("0"),
  inventory: integer("inventory").notNull().default(0),
  rating: integer("rating").notNull().default(0),
  status: productStatusEnum("status").notNull().default("active"),
  ...lifecycleDates,
});
export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
