import { redirect } from "next/navigation";

import { Shell } from "@/components/shell";
import { getCart } from "@/features/cart/queries/cart";

export default async function CheckoutPage() {
  const cartItems = await getCart();

  if (!cartItems || cartItems.length === 0) {
    redirect("/cart");
  }

  return (
    <Shell>
      <section className="flex flex-col items-center text-center font-mono">
        <h1 className="font-bold text-4xl">Checkout Page</h1>
      </section>
    </Shell>
  );
}
