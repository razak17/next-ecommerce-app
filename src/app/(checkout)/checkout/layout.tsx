import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import { UserRole } from "@/types";

export default async function CheckoutLayout({
  children,
}: React.PropsWithChildren) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  if (session.user.role !== UserRole.Admin) {
    redirect("/");
  }

  return <main>{children}</main>;
}
