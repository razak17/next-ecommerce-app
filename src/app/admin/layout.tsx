import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { redirects } from "@/lib/constants";

import { DashboardHeader } from "@/components/layouts/dashboard-header";
import { DashboardSidebar } from "@/components/layouts/dashboard-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

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
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <DashboardSidebar />
      <SidebarInset>
        <DashboardHeader
          user={
            session?.user
              ? { ...session.user, role: session.user.role || "consumer" }
              : null
          }
        />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
