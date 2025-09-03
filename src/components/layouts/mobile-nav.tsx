"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { cn, isActiveUrl } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { NavItem } from "@/types";
import { Icons } from "../icons";

interface MobileNavProps {
  items?: NavItem[];
}

export function MobileNav({ items }: MobileNavProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  if (isDesktop) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-5 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
        >
          <Icons.menu aria-hidden="true" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0">
        <ScrollArea className="h-full py-6 pr-6 pl-6">
          <div className="flex flex-col space-y-6">
            <Link
              href="/"
              className="flex items-center px-2"
              onClick={() => setOpen(false)}
            >
              <span className="font-bold font-mono text-xl">
                {siteConfig.name}
              </span>
              <span className="sr-only">Home</span>
            </Link>

            {items && items.length > 0 && (
              <nav className="flex flex-col space-y-1">
                {items.map((item, index) => {
                  return (
                    <Link
                      key={index}
                      href={item.url}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center rounded-md px-3 py-2 font-medium text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                        isActiveUrl(pathname, item.url)
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {item.title}
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
