import Link from "next/link";

import { AuthDropdown } from "./auth-dropdown";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";
import { siteConfig } from "@/config/site";

interface SiteHeaderProps {
  user: {
    name: string;
    image?: string | null;
  } | null;
}

export function SiteHeader({ user }: SiteHeaderProps) {
  console.log({ user });
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 w-full items-center justify-between">
        <Link href="/" className="hidden lg:flex">
          <span className="font-bold font-mono text-xl">{siteConfig.name}</span>
        </Link>
        <MainNav items={siteConfig.mainNav} />
        <MobileNav items={siteConfig.mainNav} user={user} />
        <div className="flex items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <AuthDropdown user={user} />
          </nav>
        </div>
      </div>
    </header>
  );
}
