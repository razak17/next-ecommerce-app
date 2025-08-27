import type { Metadata } from "next";
import "./globals.css";

import { fontMono, fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";

import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Evershop",
  description:
    "An ecommerce app built with Next.js, TypeScript, and Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
