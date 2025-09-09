import { headers } from "next/headers";

import { auth } from "@/lib/auth";

import { MainLayout } from "@/components/layouts/main-layout";

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
  return (
    <MainLayout
      user={
        session?.user
          ? { ...session.user, role: session.user.role || "consumer" }
          : null
      }
    >
      {children}
      {modal}
    </MainLayout>
  );
}
