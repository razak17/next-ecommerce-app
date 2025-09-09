import { relations } from "drizzle-orm";
import { index, pgTable, text, varchar } from "drizzle-orm/pg-core";

import { generateId } from "@/lib/id";

import { products } from "./products";
import { user } from "./users";
import { lifecycleDates } from "./utils";

export const favorites = pgTable(
  "favorites",
  {
    id: varchar("id", { length: 30 })
      .$defaultFn(() => generateId())
      .primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    productId: varchar("product_id", { length: 30 })
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    ...lifecycleDates,
  },
  (table) => [
    index("favorites_user_id_idx").on(table.userId),
    index("favorites_product_id_idx").on(table.productId),
    index("favorites_user_product_idx").on(table.userId, table.productId),
  ],
);

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(user, {
    fields: [favorites.userId],
    references: [user.id],
  }),
  product: one(products, {
    fields: [favorites.productId],
    references: [products.id],
  }),
}));

export type Favorite = typeof favorites.$inferSelect;
export type NewFavorite = typeof favorites.$inferInsert;
