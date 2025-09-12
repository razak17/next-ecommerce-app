import Link from "next/link";

import { AuthDropdown } from "./auth-dropdown";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";
import { siteConfig } from "@/config/site";
import type { SessionUser } from "@/types";

interface SiteHeaderProps {
  user: SessionUser | null;
  favoritesCount?: number;
  cartItemsCount?: number;
}

export function SiteHeader({
  user,
  cartItemsCount,
  favoritesCount,
}: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 w-full items-center justify-between">
        <Link
          href="/"
          className="z-20 flex hidden items-center font-bold text-foreground/80 text-lg tracking-tight transition-colors hover:text-foreground lg:flex"
        >
          <span className="font-mono text-xl">{siteConfig.name}</span>
        </Link>
        <MainNav
          items={siteConfig.mainNav}
          cartItemsCount={cartItemsCount}
          favoritesCount={favoritesCount}
        />
        <MobileNav items={siteConfig.mainNav} />
        <div className="flex items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <AuthDropdown user={user} />
          </nav>
        </div>
      </div>
    </header>
  );
}
