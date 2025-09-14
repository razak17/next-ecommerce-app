"use server";

import { eq } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import { cookies } from "next/headers";
import type Stripe from "stripe";
import type { z } from "zod";

import { calculateOrderAmount } from "@/lib/checkout";
import { getErrorMessage } from "@/lib/handle-error";
import { stripe } from "@/lib/stripe";

import { db } from "@/db/drizzle";
import { carts } from "@/db/schema";
import { env } from "@/env.js";
import type { CheckoutItemSchema } from "@/features/cart/validations/cart";
import type { createPaymentIntentSchema } from "../validations/stripe";

// Modified from: https://github.com/jackblatch/OneStopShop/blob/main/server-actions/stripe/payment.ts
// Creating a payment intent for a store
export async function createPaymentIntent(
  input: z.infer<typeof createPaymentIntentSchema>,
) {
  noStore();

  try {
    const cookieStore = await cookies();
    const cartId = cookieStore.get("cartId")?.value;

    if (!cartId) {
      throw new Error("Cart not found.");
    }

    const checkoutItems: CheckoutItemSchema[] = input.items.map((item) => ({
      productId: item.id,
      price: Number(item.price),
      quantity: item.quantity,
    }));

    const metadata: Stripe.MetadataParam = {
      cartId: cartId,
      // Stripe metadata values must be within 500 characters string
      items: JSON.stringify(checkoutItems),
    };

    const { total } = calculateOrderAmount(input.items);

    // Create a payment intent if it doesn't exist
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      // application_fee_amount: fee,
      currency: "usd",
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Update the cart with the payment intent id and client secret
    if (paymentIntent.status === "requires_payment_method") {
      await db
        .update(carts)
        .set({
          paymentIntentId: paymentIntent.id,
          clientSecret: paymentIntent.client_secret,
        })
        .where(eq(carts.id, cartId));
    }

    return {
      data: {
        clientSecret: paymentIntent.client_secret,
      },
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function getClientSessionSecret(
  input: z.infer<typeof createPaymentIntentSchema>,
  user: { email: string },
) {
  noStore();

  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;

  if (!cartId) {
    throw new Error("Cart not found.");
  }

  const checkoutItems: CheckoutItemSchema[] = input.items.map((item) => ({
    productId: item.id,
    price: Number(item.price),
    quantity: item.quantity,
  }));

  const metadata: Stripe.MetadataParam = {
    cartId: cartId,
    // Stripe metadata values must be within 500 characters string
    items: JSON.stringify(checkoutItems),
  };

  const session = await stripe.checkout.sessions.create({
    line_items: [
      ...input.items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            category: item.category || undefined,
          },
          unit_amount: Math.round(Number(item.price) * 100), // Stripe expects the amount in cents
        },
        quantity: item.quantity,
      })),
    ],
    ui_mode: "embedded",
    mode: "payment",
    metadata,
    payment_intent_data: {
      receipt_email: user.email,
    },
    customer_email: user.email,
    return_url: `${env.NEXT_PUBLIC_SERVER_URL}/api/webhooks/stripe?stripeSessionId={CHECKOUT_SESSION_ID}`,
  });

  if (session.client_secret == null) throw new Error("Client secret is null");

  return session.client_secret;
}
