import { relations } from "drizzle-orm/relations";

import {
  account,
  addresses,
  categories,
  favorites,
  orders,
  products,
  productTags,
  productVariants,
  productVariantValues,
  reviews,
  session,
  stocks,
  subcategories,
  tags,
  user,
  variants,
} from "./schema";

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  subcategory: one(subcategories, {
    fields: [products.subcategoryId],
    references: [subcategories.id],
  }),
  productVariants: many(productVariants),
  reviews: many(reviews),
  favorites: many(favorites),
  productTags: many(productTags),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
  subcategories: many(subcategories),
}));

export const subcategoriesRelations = relations(
  subcategories,
  ({ one, many }) => ({
    products: many(products),
    category: one(categories, {
      fields: [subcategories.categoryId],
      references: [categories.id],
    }),
  }),
);

export const productVariantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
    variant: one(variants, {
      fields: [productVariants.variantId],
      references: [variants.id],
    }),
    stocks: many(stocks),
    productVariantValues: many(productVariantValues),
  }),
);

export const variantsRelations = relations(variants, ({ many }) => ({
  productVariants: many(productVariants),
}));

export const stocksRelations = relations(stocks, ({ one, many }) => ({
  productVariant: one(productVariants, {
    fields: [stocks.productVariantId],
    references: [productVariants.id],
  }),
  productVariantValues: many(productVariantValues),
}));

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

export const ordersRelations = relations(orders, ({ one }) => ({
  address: one(addresses, {
    fields: [orders.addressId],
    references: [addresses.id],
  }),
}));

export const addressesRelations = relations(addresses, ({ many }) => ({
  orders: many(orders),
}));

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

export const userRelations = relations(user, ({ many }) => ({
  reviews: many(reviews),
  accounts: many(account),
  sessions: many(session),
  favorites: many(favorites),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

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

export const productTagsRelations = relations(productTags, ({ one }) => ({
  product: one(products, {
    fields: [productTags.productId],
    references: [products.id],
  }),
  tag: one(tags, {
    fields: [productTags.tagId],
    references: [tags.id],
  }),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  productTags: many(productTags),
}));
