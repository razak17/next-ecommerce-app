"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn, isActiveUrl } from "@/lib/utils";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import type { NavItem } from "@/types";

interface MainNavProps {
  items?: NavItem[];
}

export function MainNav({ items }: MainNavProps) {
  const pathname = usePathname();

  return (
    <div className="hidden gap-6 lg:flex">
      <NavigationMenu>
        <NavigationMenuList>
          {items?.map((item) => {
            return (
              <NavigationMenuItem key={item.title}>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "h-auto",
                    isActiveUrl(pathname, item.url) &&
                      "bg-accent text-accent-foreground",
                  )}
                >
                  <Link href={item.url}>{item.title}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
