import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { redirects } from "@/lib/constants";

import { MainLayout } from "@/components/layouts/main-layout";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session && session.user.role === "admin") {
    redirect(redirects.adminToDashboard);
  } else if (session && session.user.role !== "admin") {
    redirect(redirects.toDashboard);
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
