import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import { UserRole } from "@/types";

export default async function CheckAuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (
    session &&
    session.user.role === UserRole.Admin &&
    !session.user.isAnonymous
  ) {
    redirect("/admin/dashboard");
  } else if (
    session &&
    session.user.role !== UserRole.Admin &&
    !session.user.isAnonymous
  ) {
    redirect("/");
  }

  return <>{children}</>;
}
