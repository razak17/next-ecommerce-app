import Link from "next/link";

import { cn, formatPrice } from "@/lib/utils";

import { CartLineItems } from "./cart-line-items";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getCart } from "@/features/cart/queries/cart";

export async function CheckoutCard() {
  const cartLineItems = await getCart();

  return (
    <>
      {cartLineItems?.length > 0 ? (
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4 py-4">
            <CardTitle className="line-clamp-1 flex-1">Items</CardTitle>
            <Link
              aria-label="Checkout"
              href="/checkout"
              className={cn(
                buttonVariants({
                  size: "sm",
                }),
              )}
            >
              Proceed To Checkout
            </Link>
          </CardHeader>
          <Separator className="mb-4" />
          <CardContent className="pr-0 pb-6 pl-6">
            <CartLineItems items={cartLineItems} className="max-h-[280px]" />
          </CardContent>
          <Separator className="mb-4" />
          <CardFooter className="space-x-4">
            <span className="flex-1">
              Total (
              {cartLineItems.reduce((acc, item) => acc + item.quantity, 0)})
            </span>
            <span>
              {formatPrice(
                cartLineItems.reduce(
                  (acc, item) => acc + Number(item.price) * item.quantity,
                  0,
                ),
              )}
            </span>
          </CardFooter>
        </Card>
      ) : (
        <section
          id="cart-page-empty-cart"
          aria-labelledby="cart-page-empty-cart-heading"
          className="flex h-full flex-col items-center justify-center space-y-1 pt-16"
        >
          <Icons.cart
            className="mb-4 size-16 text-muted-foreground"
            aria-hidden="true"
          />
          <div className="font-medium text-muted-foreground text-xl">
            Your cart is empty
          </div>
          <Link
            aria-label="Add items to your cart to checkout"
            href="/shop"
            className={cn(
              buttonVariants({
                variant: "link",
                size: "sm",
                className: "text-muted-foreground text-sm",
              }),
            )}
          >
            Add items to your cart to checkout
          </Link>
        </section>
      )}
    </>
  );
}
