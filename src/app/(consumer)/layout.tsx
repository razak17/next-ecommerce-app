import { headers } from "next/headers";

import { auth } from "@/lib/auth";

import { SiteHeader } from "@/components/layouts/site-header";

export default async function ConsumerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader
        user={
          session?.user
            ? { name: session.user.name, image: session.user.image }
            : null
        }
      />
      <main className="flex-1">{children}</main>
    </div>
  );
}
