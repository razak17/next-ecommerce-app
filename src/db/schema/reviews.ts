import { relations } from "drizzle-orm";
import { index, integer, pgTable, text, varchar } from "drizzle-orm/pg-core";

import { generateId } from "@/lib/id";

import { products } from "./products";
import { user } from "./users";
import { lifecycleDates } from "./utils";

export const reviews = pgTable(
  "reviews",
  {
    id: varchar("id", { length: 30 })
      .$defaultFn(() => generateId())
      .primaryKey(),
    productId: varchar("product_id", { length: 30 })
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    rating: integer("rating").notNull(),
    title: text("title"),
    content: text("content"),
    ...lifecycleDates,
  },
  (table) => [
    index("reviews_product_id_idx").on(table.productId),
    index("reviews_user_id_idx").on(table.userId),
    index("reviews_rating_idx").on(table.rating),
  ],
);

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(user, {
    fields: [reviews.userId],
    references: [user.id],
  }),
}));

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
