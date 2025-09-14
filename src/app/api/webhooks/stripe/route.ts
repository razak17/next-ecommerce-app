import { eq } from "drizzle-orm";
import type Stripe from "stripe";
import { z } from "zod";

import { stripe } from "@/lib/stripe";

import { db } from "@/db/drizzle";
import { addresses, carts, orders, products } from "@/db/schema";
import { env } from "@/env.js";
import {
  type CheckoutItemSchema,
  checkoutItemSchema,
} from "@/features/cart/validations/cart";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return new Response(
      `Webhook Error: ${err instanceof Error ? err.message : "Unknown error."}`,
      { status: 400 },
    );
  }

  switch (event.type) {
    // Handling payment events
    case "payment_intent.payment_failed": {
      const paymentIntentPaymentFailed = event.data.object;
      console.log(
        `❌ Payment failed: ${paymentIntentPaymentFailed.last_payment_error?.message}`,
      );
      break;
    }
    case "payment_intent.processing": {
      const paymentIntentProcessing = event.data.object;
      console.log(`⏳ Payment processing: ${paymentIntentProcessing.id}`);
      break;
    }
    case "payment_intent.succeeded": {
      const paymentIntentSucceeded = event.data.object;

      const paymentIntentId = paymentIntentSucceeded?.id;
      const orderAmount = paymentIntentSucceeded?.amount;
      const checkoutItems = paymentIntentSucceeded?.metadata
        ?.items as unknown as CheckoutItemSchema[];

      // If there are items in metadata, then create order
      console.warn(
        "DEBUGPRINT[1217]: route.ts:57: checkoutItems=",
        checkoutItems,
      );
      if (checkoutItems) {
        try {
          // Parsing items from metadata
          // Didn't parse before because can pass the unparsed data directly to the order table items json column in the db
          const safeParsedItems = z
            .array(checkoutItemSchema)
            .safeParse(
              JSON.parse(paymentIntentSucceeded?.metadata?.items ?? "[]"),
            );

          if (!safeParsedItems.success) {
            throw new Error("Could not parse items.");
          }

          // Create new address in DB
          const stripeAddress = paymentIntentSucceeded?.shipping?.address;

          const newAddress = await db
            .insert(addresses)
            .values({
              line1: stripeAddress?.line1,
              line2: stripeAddress?.line2,
              city: stripeAddress?.city,
              state: stripeAddress?.state,
              country: stripeAddress?.country,
              postalCode: stripeAddress?.postal_code,
            })
            .returning({
              insertedId: addresses.id,
            });

          if (!newAddress[0]?.insertedId)
            throw new Error("No address created.");

          // Create new order in db
          await db.insert(orders).values({
            items: checkoutItems ?? [],
            quantity: safeParsedItems.data.reduce(
              (acc, item) => acc + item.quantity,
              0,
            ),
            amount: String(Number(orderAmount) / 100),
            stripePaymentIntentId: paymentIntentId,
            stripePaymentIntentStatus: paymentIntentSucceeded?.status,
            name: paymentIntentSucceeded?.shipping?.name ?? "",
            email: paymentIntentSucceeded?.receipt_email ?? "",
            addressId: newAddress[0]?.insertedId,
          });

          // Update product inventory in db
          for (const item of safeParsedItems.data) {
            const product = await db.query.products.findFirst({
              columns: {
                id: true,
                inventory: true,
              },
              where: eq(products.id, item.productId),
            });

            if (!product) {
              throw new Error("Product not found.");
            }

            const inventory = product.inventory - item.quantity;

            if (inventory < 0) {
              throw new Error("Product out of stock.");
            }

            await db
              .update(products)
              .set({
                inventory: product.inventory - item.quantity,
              })
              .where(eq(products.id, item.productId));
          }

          // Close cart and clear items
          await db
            .update(carts)
            .set({
              closed: true,
              items: [],
            })
            .where(eq(carts.paymentIntentId, paymentIntentId));
        } catch (err) {
          console.log("Error creating order.", err);
        }
      }
      break;
    }

    // Handling subscription events
    case "checkout.session.completed": {
      const checkoutSessionCompleted = event.data.object;
      console.log(`Checkout session completed: ${checkoutSessionCompleted.id}`);
      break;
    }
    case "invoice.payment_succeeded": {
      const invoicePaymentSucceeded = event.data.object;
      console.log(`Invoice payment succeeded: ${invoicePaymentSucceeded.id}`);
      break;
    }

    case "payment_intent.created": {
      const paymentIntent = event.data.object;
      console.log(`Payment intent id: ${paymentIntent.id}`);
      break;
    }
    case "application_fee.created": {
      const applicationFeeCreated = event.data.object;
      console.log(`Application fee id: ${applicationFeeCreated.id}`);
      break;
    }
    case "charge.succeeded": {
      const chargeSucceeded = event.data.object;
      console.log(`Charge id: ${chargeSucceeded.id}`);
      break;
    }
    default:
      console.warn(`Unhandled event type: ${event.type}`);
  }

  return new Response(null, { status: 200 });
}
