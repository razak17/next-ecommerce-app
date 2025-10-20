import { Suspense } from "react";

import { SiteFooter } from "@/components/layouts/site-footer";
import { SiteHeader } from "@/components/layouts/site-header";

interface ConsumerLayoutProps
  extends React.PropsWithChildren<{
    modal: React.ReactNode;
  }> {}

export default async function ConsumerLayout({
  children,
  modal,
}: ConsumerLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Suspense fallback={null}>
        <SiteHeader />
      </Suspense>
      <main className="flex-1">
        {children}
        {modal}
      </main>
      <SiteFooter />
    </div>
  );
}
