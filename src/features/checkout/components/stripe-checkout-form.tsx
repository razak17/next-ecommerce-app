"use client";

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";

import { getStripe } from "@/lib/get-stripe";

import type { CartLineItemSchema } from "@/features/cart/validations/cart";
import { getClientSessionSecret } from "@/features/stripe/actions/stripe";

export function StripeCheckoutForm({
  cartLineItems,
  userEmail,
}: {
  cartLineItems: CartLineItemSchema[];
  userEmail: string;
}) {
  const stripePromise = getStripe();
  return (
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={{
        fetchClientSecret: getClientSessionSecret.bind(
          null,
          { items: cartLineItems },
          { email: userEmail },
        ),
      }}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}
