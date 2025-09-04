import { SiteFooter } from "@/components/layouts/site-footer";
import { SiteHeader } from "@/components/layouts/site-header";

interface MainLayoutProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
    role: string;
  } | null;
  children?: React.ReactNode;
}

export function MainLayout({ user, children }: MainLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader user={user} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
