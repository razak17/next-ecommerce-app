import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

import { auth } from "@/lib/auth";
import { fontMono, fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";

import { SiteFooter } from "@/components/layouts/site-footer";
import { SiteHeader } from "@/components/layouts/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/config/site";

interface RootLayoutProps
  extends React.PropsWithChildren<{
    modals: React.ReactNode;
  }> {}

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default async function RootLayout({
  children,
  // modals,
}: RootLayoutProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontMono.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader
              user={
                session?.user
                  ? { ...session.user, role: session.user.role || "consumer" }
                  : null
              }
            />
            <main className="flex-1">
              {children}
              {/* {modals} */}
            </main>
            <SiteFooter />
          </div>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
