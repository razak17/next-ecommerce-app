import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { redirects } from "@/lib/constants";

import { SiteHeader } from "@/components/layouts/site-header";

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

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader
        user={
          session.user
            ? { name: session.user.name, image: session.user.image }
            : null
        }
      />
      <main className="flex-1">{children}</main>
    </div>
  );
}
