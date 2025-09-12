import { SiteFooter } from "@/components/layouts/site-footer";
import { SiteHeader } from "@/components/layouts/site-header";
import type { SessionUser } from "@/types";

interface MainLayoutProps {
  user: SessionUser | null;
  favoritesCount?: number;
  children?: React.ReactNode;
}

export function MainLayout({
  user,
  favoritesCount,
  children,
}: MainLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader user={user} favoritesCount={favoritesCount} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
