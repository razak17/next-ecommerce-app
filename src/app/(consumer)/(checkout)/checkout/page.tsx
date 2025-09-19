import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getCart } from "@/features/cart/queries/cart";
import { CartLineItems } from "@/features/checkout/components/cart-line-items";
import { CheckoutForm } from "@/features/checkout/components/checkout-form";
import { CheckoutShell } from "@/features/checkout/components/checkout-shell";
import { createPaymentIntent } from "@/features/stripe/actions/stripe";

export default async function CheckoutPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user?.isAnonymous) {
    redirect("/login");
  }

  const cartLineItems = await getCart();

  if (!cartLineItems || cartLineItems.length === 0) {
    redirect("/cart");
  }

  const paymentIntentPromise = createPaymentIntent({
    items: cartLineItems,
  });

  const total = cartLineItems.reduce(
    (total, item) => total + Number(item.quantity) * Number(item.price),
    0,
  );

  return (
    <section className="relative flex h-full min-h-dvh flex-col items-start justify-center lg:h-dvh lg:flex-row lg:overflow-hidden">
      <div className="w-full space-y-12 pt-8 lg:pt-16">
        <div className="fixed top-0 z-40 h-16 w-full bg-[#09090b] py-4 lg:static lg:top-auto lg:z-0 lg:h-0 lg:py-0">
          <div className="container flex max-w-xl items-center justify-between space-x-2 lg:mr-0 lg:ml-auto lg:pr-[4.5rem]">
            <Link
              aria-label="Back to cart"
              href="/cart"
              className="group flex w-28 items-center space-x-2 lg:flex-auto"
            >
              <ArrowLeftIcon
                className="size-5 text-muted-foreground transition-colors group-hover:text-primary"
                aria-hidden="true"
              />
              <div className="block font-medium transition group-hover:hidden">
                Evershop
              </div>
              <div className="hidden font-medium transition group-hover:block">
                Back
              </div>
            </Link>
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" size="sm">
                  Details
                </Button>
              </DrawerTrigger>
              <DrawerContent className="mx-auto flex h-[82%] w-full max-w-4xl flex-col space-y-6 border pt-8 pb-6">
                <DrawerTitle className="mx-auto">Cart Items</DrawerTitle>
                <CartLineItems
                  items={cartLineItems}
                  // variant="minimal"
                  isEditable={false}
                  className="container h-full flex-1 pr-8"
                />
                <div className="container space-y-4 pr-8">
                  <Separator />
                  <div className="flex font-medium">
                    <div className="flex-1">
                      Total (
                      {cartLineItems.reduce(
                        (acc, item) => acc + Number(item.quantity),
                        0,
                      )}
                      )
                    </div>
                    <div>{formatPrice(total)}</div>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
        <div className="container flex max-w-xl flex-col items-center space-y-1 lg:mr-0 lg:ml-auto lg:items-start lg:pr-[4.5rem]">
          <div className="line-clamp-1 font-semibold text-muted-foreground">
            Pay Now
          </div>
          <div className="font-bold text-3xl">{formatPrice(total)}</div>
        </div>
        <CartLineItems
          items={cartLineItems}
          isEditable={false}
          className="container hidden w-full max-w-xl lg:mr-0 lg:ml-auto lg:flex lg:max-h-[580px] lg:pr-[4.5rem]"
        />
      </div>
      <CheckoutShell
        paymentIntentPromise={paymentIntentPromise}
        className="size-full flex-1 bg-white pt-10 pb-12 lg:flex-initial lg:pt-16 lg:pl-12"
      >
        <ScrollArea className="h-full">
          <CheckoutForm className="container max-w-xl pr-6 lg:mr-auto lg:ml-0" />
        </ScrollArea>
      </CheckoutShell>
    </section>
  );
}
