"use client";

import { GraduationCap, LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

import { authClient } from "@/lib/auth/client";
import { redirects } from "@/lib/constants";
import { cn, isActiveUrl } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { NavItem } from "@/types";
import { Icons } from "../icons";

interface MobileNavProps {
  items?: NavItem[];
  user: {
    name: string;
    email: string;
    image?: string | null;
    role?: string | null;
  } | null;
}

export function MobileNav({ items, user }: MobileNavProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  if (isDesktop) return null;

  const handleSignOut = async () => {
    await authClient.signOut();
    router.refresh();
    setOpen(false);
  };

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

            <Separator />

            {user ? (
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-3 px-3">
                  <Avatar className="size-8">
                    <AvatarImage
                      src={user.image || ""}
                      alt={user.name || "User"}
                    />
                    <AvatarFallback>
                      {(user?.name
                        ? user.name
                            .trim()
                            .split(/\s+/)
                            .slice(0, 2)
                            .map((p) => p[0])
                            .join("")
                            .toUpperCase()
                        : "U") || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">
                      {user.name || "User"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <Button
                    variant="ghost"
                    className="justify-start px-3"
                    onClick={() => {
                      router.push(redirects.toDashboard);
                      setOpen(false);
                    }}
                  >
                    <GraduationCap className="mr-3 size-4" />
                    Portal
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start px-3"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-3 size-4" />
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-1 space-x-2">
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => {
                    router.push(redirects.toLogin);
                    setOpen(false);
                  }}
                >
                  <LogIn className="mr-2 size-4" />
                  Login
                </Button>
                <Button
                  className="justify-start"
                  onClick={() => {
                    router.push(redirects.toRegister);
                    setOpen(false);
                  }}
                >
                  <LogIn className="mr-2 size-4" />
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
