import {
  decimal,
  index,
  integer,
  json,
  pgTable,
  text,
  varchar,
} from "drizzle-orm/pg-core";

import { generateId } from "@/lib/id";

import { addresses } from "./addresses";
import { lifecycleDates } from "./utils";
import type { CheckoutItemSchema } from "@/features/cart/validations/cart";

// @see: https://github.com/jackblatch/OneStopShop/blob/main/db/schema.ts
export const orders = pgTable(
  "orders",
  {
    id: varchar("id", { length: 30 })
      .$defaultFn(() => generateId())
      .primaryKey(), // prefix_ + nanoid (12)
    items: json("items").$type<CheckoutItemSchema[] | null>().default(null),
    quantity: integer("quantity"),
    amount: decimal("amount", { precision: 10, scale: 2 })
      .notNull()
      .default("0"),
    stripePaymentIntentId: text("stripe_payment_intent_id").notNull(),
    stripePaymentIntentStatus: text("stripe_payment_intent_status").notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    addressId: varchar("address_id", { length: 30 })
      .references(() => addresses.id, { onDelete: "cascade" })
      .notNull(),
    ...lifecycleDates,
  },
  (table) => [index("orders_address_id_idx").on(table.addressId)],
);

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
