"use client";

import { MinusIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import * as React from "react";

import { showErrorToast } from "@/lib/handle-error";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteCartItem, updateCartItem } from "@/features/cart/actions/cart";
import type { CartLineItemSchema } from "@/features/cart/validations/cart";

interface UpdateCartProps {
  cartLineItem: CartLineItemSchema;
}

export function UpdateCart({ cartLineItem }: UpdateCartProps) {
  const id = React.useId();
  const [isPending, startTransition] = React.useTransition();

  return (
    <div className="flex w-full xs:w-auto items-center xs:justify-normal justify-between space-x-2">
      <div className="flex items-center">
        <Button
          id={`${id}-decrement`}
          variant="outline"
          size="icon"
          className="size-8 rounded-r-none"
          onClick={() => {
            startTransition(async () => {
              try {
                await updateCartItem({
                  productId: cartLineItem.id,
                  quantity: Number(cartLineItem.quantity) - 1,
                });
              } catch (err) {
                showErrorToast(err);
              }
            });
          }}
          disabled={isPending}
        >
          <MinusIcon className="size-3" aria-hidden="true" />
          <span className="sr-only">Remove one item</span>
        </Button>
        <Input
          id={`${id}-quantity`}
          min="0"
          className="h-8 w-14 rounded-none border-x-0 text-center"
          value={cartLineItem.quantity}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "" || /^\d+$/.test(value)) {
              startTransition(async () => {
                try {
                  await updateCartItem({
                    productId: cartLineItem.id,
                    quantity: Number(value) || 0,
                  });
                } catch (err) {
                  showErrorToast(err);
                }
              });
            }
          }}
          disabled={isPending}
        />
        <Button
          id={`${id}-increment`}
          variant="outline"
          size="icon"
          className="size-8 rounded-l-none"
          onClick={() => {
            startTransition(async () => {
              try {
                await updateCartItem({
                  productId: cartLineItem.id,
                  quantity: Number(cartLineItem.quantity) + 1,
                });
              } catch (err) {
                showErrorToast(err);
              }
            });
          }}
          disabled={isPending}
        >
          <PlusIcon className="size-3" aria-hidden="true" />
          <span className="sr-only">Add one item</span>
        </Button>
      </div>
      <Button
        id={`${id}-delete`}
        variant="outline"
        size="icon"
        className="size-8"
        onClick={() => {
          startTransition(async () => {
            try {
              await deleteCartItem({
                productId: cartLineItem.id,
              });
            } catch (err) {
              showErrorToast(err);
            }
          });
        }}
        disabled={isPending}
      >
        <TrashIcon className="size-3" aria-hidden="true" />
        <span className="sr-only">Delete item</span>
      </Button>
    </div>
  );
}
