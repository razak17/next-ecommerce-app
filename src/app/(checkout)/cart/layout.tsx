import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import { MainLayout } from "@/components/layouts/main-layout";

export default async function CartLayout({
  children,
}: React.PropsWithChildren) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

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
