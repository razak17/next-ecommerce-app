import { headers } from "next/headers";

import { auth } from "@/lib/auth";

import { MainLayout } from "@/components/layouts/main-layout";

export default async function CartLayout({
  children,
}: React.PropsWithChildren) {
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
    </MainLayout>
  );
}
