"use client";

import { ExitIcon } from "@radix-ui/react-icons";
import { LogIn, User } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { getInitials, isActiveUrl } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { siteConfig } from "@/config/site";
import type { SessionUser } from "@/types";
import { UserRole } from "@/types";
import { Icons } from "../icons";

interface AuthDropdownProps {
  user: SessionUser | null;
}

const authItems = [
  {
    title: "Login",
    href: "/login",
    icon: LogIn,
  },
  {
    title: "Register",
    href: "/register",
    icon: User,
  },
];

export function AuthDropdown({ user }: AuthDropdownProps) {
  if (!user) {
    return (
      <>
        {authItems.map((item, index) => (
          <Button key={index} variant="ghost" size="sm" asChild>
            <Link href={item.href as Route}>
              <item.icon className="mr-2 size-4" />
              {item.title}
              <span className="sr-only">Login</span>
            </Link>
          </Button>
        ))}
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="lg"
          className="flex items-center gap-2 rounded-sm px-2"
          aria-label="User menu"
        >
          <Avatar className="size-7">
            <AvatarImage src={user?.image ?? ""} alt={user?.name ?? "User"} />
            <AvatarFallback>{getInitials({ name: user.name })}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent
          className="w-56 bg-background"
          align="end"
          forceMount
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="font-medium text-sm leading-none">{user.name}</p>
              <p className="text-muted-foreground text-xs leading-none">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {user?.isAnonymous &&
            authItems.map((item, index) => {
              return (
                <DropdownMenuItem key={index} asChild>
                  <Link href={item.href as Route}>
                    <item.icon
                      className="mr-2 size-4 text-foreground"
                      aria-hidden="true"
                    />
                    {item.title}
                    <span className="sr-only">Login</span>
                  </Link>
                </DropdownMenuItem>
              );
            })}
          <AuthDropdownGroup role={user.role} />
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/logout">
              <ExitIcon
                className="mr-2 size-4 text-foreground"
                aria-hidden="true"
              />
              Logout
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}

function AuthDropdownGroup({ role }: { role?: string | null }) {
  const pathname = usePathname();

  return (
    <DropdownMenuGroup>
      {role === UserRole.Admin ? (
        <span>
          {siteConfig.authItems.admin.map((item) => {
            const IconComponent = Icons[item.icon ?? "chevronLeft"];

            return (
              <DropdownMenuItem
                className={`${isActiveUrl(pathname, item.url) && "bg-accent text-accent-foreground"}`}
                key={item.title}
                asChild
              >
                <Link href={item.url}>
                  {IconComponent && (
                    <IconComponent
                      className="mr-2 size-4 text-foreground"
                      aria-hidden="true"
                    />
                  )}
                  {item.title}
                </Link>
              </DropdownMenuItem>
            );
          })}
        </span>
      ) : (
        <span>
          {siteConfig.authItems.consumer.map((item) => {
            const IconComponent = Icons[item.icon ?? "chevronLeft"];

            return (
              <DropdownMenuItem key={item.title} asChild>
                <Link href={item.url}>
                  {IconComponent && (
                    <IconComponent
                      className="mr-2 size-4 text-foreground"
                      aria-hidden="true"
                    />
                  )}
                  {item.title}
                </Link>
              </DropdownMenuItem>
            );
          })}
        </span>
      )}
    </DropdownMenuGroup>
  );
}
