"use client";

import { Heart, Home, ShoppingBag, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn, isActiveUrl } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
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
  cartItemsCount?: number;
  favoritesCount?: number;
}

const iconMap = {
  Home,
  ShoppingBag,
  ShoppingCart,
  Heart,
};

export function MainNav({
  items,
  cartItemsCount = 0,
  favoritesCount = 0,
}: MainNavProps) {
  const pathname = usePathname();

  return (
    <div className="hidden gap-6 lg:flex">
      <NavigationMenu>
        <NavigationMenuList className="gap-4">
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
                    {item.title === "Cart" && (
                      <Badge className="-right-4 -top-1.5 absolute z-10 rounded-full px-1.5 py-0.5">
                        {cartItemsCount}
                      </Badge>
                    )}
                    {item.title === "Favorites" && (
                      <Badge className="-right-4 -top-1.5 absolute z-10 rounded-full px-1.5 py-0.5">
                        {favoritesCount}
                      </Badge>
                    )}
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
