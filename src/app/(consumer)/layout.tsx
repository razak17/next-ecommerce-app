import { headers } from "next/headers";

import { auth } from "@/lib/auth";

import { SiteFooter } from "@/components/layouts/site-footer";
import { SiteHeader } from "@/components/layouts/site-header";
import { getUserCartItemsCount } from "@/features/cart/queries/cart";
import { getUserFavoritesCount } from "@/features/favorites/queries/favorites";

interface ConsumerLayoutProps
  extends React.PropsWithChildren<{
    modal: React.ReactNode;
  }> {}

export default async function ConsumerLayout({
  children,
  modal,
}: ConsumerLayoutProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const [favoritesCount, cartItemsCount] = session?.user?.id
    ? await Promise.all([
        getUserFavoritesCount(session?.user?.id),
        getUserCartItemsCount(session?.user?.id),
      ])
    : [0, 0];

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader
        user={session?.user ?? null}
        cartItemsCount={cartItemsCount}
        favoritesCount={favoritesCount}
      />
      <main className="flex-1">
        {children}
        {modal}
      </main>
      <SiteFooter />
    </div>
  );
}
