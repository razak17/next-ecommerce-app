import { sql } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  index,
  integer,
  json,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

export const orderStatus = pgEnum("order_status", [
  "pending",
  "shipped",
  "delivered",
  "canceled",
]);
export const productStatus = pgEnum("product_status", [
  "active",
  "draft",
  "archived",
]);
export const userGender = pgEnum("user_gender", ["male", "female", "other"]);
export const userRole = pgEnum("user_role", ["admin", "consumer"]);

export const categories = pgTable(
  "categories",
  {
    id: varchar({ length: 30 }).primaryKey().notNull(),
    name: text().notNull(),
    slug: text().notNull(),
    image: json().default(null),
    description: text(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
  },
  (table) => [
    unique("categories_name_unique").on(table.name),
    unique("categories_slug_unique").on(table.slug),
  ],
);

export const products = pgTable(
  "products",
  {
    id: varchar({ length: 30 }).primaryKey().notNull(),
    name: text().notNull(),
    description: text(),
    images: json().default(null),
    categoryId: varchar("category_id", { length: 30 }).notNull(),
    subcategoryId: varchar("subcategory_id", { length: 30 }),
    price: numeric({ precision: 10, scale: 2 }).default("0").notNull(),
    originalPrice: numeric("original_price", {
      precision: 10,
      scale: 2,
    }).default("0"),
    inventory: integer().default(0).notNull(),
    rating: integer().default(0).notNull(),
    status: productStatus().default("active").notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
  },
  (table) => [
    index("products_category_id_idx").using(
      "btree",
      table.categoryId.asc().nullsLast().op("text_ops"),
    ),
    index("products_subcategory_id_idx").using(
      "btree",
      table.subcategoryId.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.categoryId],
      foreignColumns: [categories.id],
      name: "products_category_id_categories_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.subcategoryId],
      foreignColumns: [subcategories.id],
      name: "products_subcategory_id_subcategories_id_fk",
    }).onDelete("cascade"),
  ],
);

export const subcategories = pgTable(
  "subcategories",
  {
    id: varchar({ length: 30 }).primaryKey().notNull(),
    name: text().notNull(),
    slug: text().notNull(),
    description: text(),
    categoryId: varchar("category_id", { length: 30 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
  },
  (table) => [
    index("subcategories_category_id_idx").using(
      "btree",
      table.categoryId.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.categoryId],
      foreignColumns: [categories.id],
      name: "subcategories_category_id_categories_id_fk",
    }).onDelete("cascade"),
    unique("subcategories_name_unique").on(table.name),
    unique("subcategories_slug_unique").on(table.slug),
  ],
);

export const carts = pgTable("carts", {
  id: varchar({ length: 30 }).primaryKey().notNull(),
  paymentIntentId: varchar("payment_intent_id", { length: 256 }),
  clientSecret: text("client_secret"),
  items: json().default(null),
  closed: boolean().default(false).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
});

export const productVariants = pgTable(
  "product_variants",
  {
    id: varchar({ length: 30 }).primaryKey().notNull(),
    productId: varchar("product_id", { length: 30 }).notNull(),
    variantId: varchar("variant_id", { length: 30 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
  },
  (table) => [
    index("product_variants_product_id_idx").using(
      "btree",
      table.productId.asc().nullsLast().op("text_ops"),
    ),
    index("product_variants_variant_id_idx").using(
      "btree",
      table.variantId.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.productId],
      foreignColumns: [products.id],
      name: "product_variants_product_id_products_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.variantId],
      foreignColumns: [variants.id],
      name: "product_variants_variant_id_variants_id_fk",
    }).onDelete("cascade"),
  ],
);

export const stocks = pgTable(
  "stocks",
  {
    id: varchar({ length: 30 }).primaryKey().notNull(),
    productVariantId: varchar("product_variant_id", { length: 30 }).notNull(),
    quantity: integer().default(0).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
  },
  (table) => [
    index("stocks_product_variant_id_idx").using(
      "btree",
      table.productVariantId.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.productVariantId],
      foreignColumns: [productVariants.id],
      name: "stocks_product_variant_id_product_variants_id_fk",
    }).onDelete("cascade"),
  ],
);

export const tags = pgTable("tags", {
  id: varchar({ length: 30 }).primaryKey().notNull(),
  name: text().notNull(),
  color: text().default("blue").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
});

export const productVariantValues = pgTable(
  "product_variant_values",
  {
    productVariantId: varchar("product_variant_id", { length: 30 }).notNull(),
    value: text().notNull(),
    price: numeric({ precision: 10, scale: 2 }).notNull(),
    stockId: varchar("stock_id", { length: 30 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
  },
  (table) => [
    foreignKey({
      columns: [table.productVariantId],
      foreignColumns: [productVariants.id],
      name: "product_variant_values_product_variant_id_product_variants_id_f",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.stockId],
      foreignColumns: [stocks.id],
      name: "product_variant_values_stock_id_stocks_id_fk",
    }).onDelete("cascade"),
  ],
);

export const variants = pgTable("variants", {
  id: varchar({ length: 30 }).primaryKey().notNull(),
  name: text().notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
});

export const addresses = pgTable("addresses", {
  id: varchar({ length: 30 }).primaryKey().notNull(),
  line1: text(),
  line2: text(),
  city: text(),
  state: text(),
  postalCode: text("postal_code"),
  country: text(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
});

export const orders = pgTable(
  "orders",
  {
    id: varchar({ length: 30 }).primaryKey().notNull(),
    items: json().default(null),
    quantity: integer(),
    amount: numeric({ precision: 10, scale: 2 }).default("0").notNull(),
    stripePaymentIntentId: text("stripe_payment_intent_id").notNull(),
    stripePaymentIntentStatus: text("stripe_payment_intent_status").notNull(),
    name: text().notNull(),
    email: text().notNull(),
    addressId: varchar("address_id", { length: 30 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
    status: orderStatus().default("pending"),
  },
  (table) => [
    index("orders_address_id_idx").using(
      "btree",
      table.addressId.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.addressId],
      foreignColumns: [addresses.id],
      name: "orders_address_id_addresses_id_fk",
    }).onDelete("cascade"),
  ],
);

export const reviews = pgTable(
  "reviews",
  {
    id: varchar({ length: 30 }).primaryKey().notNull(),
    productId: varchar("product_id", { length: 30 }).notNull(),
    userId: text("user_id").notNull(),
    rating: integer().notNull(),
    title: text(),
    content: text(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
  },
  (table) => [
    index("reviews_product_id_idx").using(
      "btree",
      table.productId.asc().nullsLast().op("text_ops"),
    ),
    index("reviews_rating_idx").using(
      "btree",
      table.rating.asc().nullsLast().op("int4_ops"),
    ),
    index("reviews_user_id_idx").using(
      "btree",
      table.userId.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.productId],
      foreignColumns: [products.id],
      name: "reviews_product_id_products_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "reviews_user_id_user_id_fk",
    }).onDelete("cascade"),
  ],
);

export const verification = pgTable("verification", {
  id: text().primaryKey().notNull(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }),
  updatedAt: timestamp("updated_at", { mode: "string" }),
});

export const account = pgTable(
  "account",
  {
    id: text().primaryKey().notNull(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id").notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      mode: "string",
    }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      mode: "string",
    }),
    scope: text(),
    password: text(),
    createdAt: timestamp("created_at", { mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "account_user_id_user_id_fk",
    }).onDelete("cascade"),
  ],
);

export const session = pgTable(
  "session",
  {
    id: text().primaryKey().notNull(),
    expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),
    token: text().notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "session_user_id_user_id_fk",
    }).onDelete("cascade"),
    unique("session_token_unique").on(table.token),
  ],
);

export const favorites = pgTable(
  "favorites",
  {
    id: varchar({ length: 30 }).primaryKey().notNull(),
    userId: text("user_id").notNull(),
    productId: varchar("product_id", { length: 30 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
  },
  (table) => [
    index("favorites_product_id_idx").using(
      "btree",
      table.productId.asc().nullsLast().op("text_ops"),
    ),
    index("favorites_user_id_idx").using(
      "btree",
      table.userId.asc().nullsLast().op("text_ops"),
    ),
    index("favorites_user_product_idx").using(
      "btree",
      table.userId.asc().nullsLast().op("text_ops"),
      table.productId.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "favorites_user_id_user_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.productId],
      foreignColumns: [products.id],
      name: "favorites_product_id_products_id_fk",
    }).onDelete("cascade"),
  ],
);

export const user = pgTable(
  "user",
  {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    email: text().notNull(),
    emailVerified: boolean("email_verified").notNull(),
    image: text(),
    createdAt: timestamp("created_at", { mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
    gender: userGender(),
    phone: text(),
    firstName: text("first_name"),
    lastName: text("last_name"),
    role: userRole().default("consumer"),
    banned: boolean().default(false),
    banReason: text("ban_reason"),
    banExpires: timestamp("ban_expires", { mode: "string" }),
    isAnonymous: boolean("is_anonymous"),
  },
  (table) => [unique("user_email_unique").on(table.email)],
);

export const productTags = pgTable(
  "product_tags",
  {
    productId: varchar("product_id", { length: 30 }).notNull(),
    tagId: varchar("tag_id", { length: 30 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
  },
  (table) => [
    index("product_tags_product_id_tag_id_idx").using(
      "btree",
      table.productId.asc().nullsLast().op("text_ops"),
      table.tagId.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.productId],
      foreignColumns: [products.id],
      name: "product_tags_product_id_products_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.tagId],
      foreignColumns: [tags.id],
      name: "product_tags_tag_id_tags_id_fk",
    }).onDelete("cascade"),
    primaryKey({
      columns: [table.productId, table.tagId],
      name: "product_tags_pk",
    }),
  ],
);
