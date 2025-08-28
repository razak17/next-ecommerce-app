"use client";

import { Heart, Home, ShoppingBag, ShoppingCart } from "lucide-react";
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

const iconMap = {
  Home,
  ShoppingBag,
  ShoppingCart,
  Heart,
};

export function MainNav({ items }: MainNavProps) {
  const pathname = usePathname();

  return (
    <div className="hidden gap-6 lg:flex">
      <NavigationMenu>
        <NavigationMenuList>
          {items?.map((item) => {
            const IconComponent = item.icon
              ? iconMap[item.icon as keyof typeof iconMap]
              : null;

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
                  <Link href={item.url}>
                    <div className="flex items-center gap-2">
                      {IconComponent && (
                        <IconComponent className="size-4 text-foreground" />
                      )}
                      <span>{item.title}</span>
                    </div>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
