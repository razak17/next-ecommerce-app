import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { redirects } from "@/lib/constants";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(redirects.toLogin);
  }

  if (session.user.role !== "admin") {
    redirect(redirects.toLanding);
  }

  return <div>{children}</div>;
}
