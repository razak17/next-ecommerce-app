"use client";

import { ExitIcon } from "@radix-ui/react-icons";
import { LogIn, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { authClient } from "@/lib/auth/client";
import { redirects } from "@/lib/constants";
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

export function AuthDropdown({ user }: AuthDropdownProps) {
  const router = useRouter();

  if (!user) {
    return (
      <>
        <Button variant="ghost" size="sm" asChild>
          <Link href={redirects.toLogin}>
            <LogIn className="mr-2 size-4" />
            Login
            <span className="sr-only">Login</span>
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href={redirects.toRegister}>
            <User className="mr-2 size-4" />
            Register
            <span className="sr-only">Register</span>
          </Link>
        </Button>
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
          <Avatar className="size-8">
            <AvatarImage src={user?.image ?? ""} alt={user?.name ?? "User"} />
            <AvatarFallback>{getInitials({ name: user.name })}</AvatarFallback>
          </Avatar>
          <span className="max-w-[10rem] truncate font-medium text-md">
            {user?.name ?? "User"}
          </span>
          {/* <ChevronDown className="size-6 opacity-70" aria-hidden="true" /> */}
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
          <AuthDropdownGroup role={user.role} />
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              await authClient.signOut();
              router.push(redirects.toLanding);
              router.refresh();
            }}
          >
            <ExitIcon
              className="mr-2 size-4 text-foreground"
              aria-hidden="true"
            />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}

function AuthDropdownGroup({ role }: { role: string }) {
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
