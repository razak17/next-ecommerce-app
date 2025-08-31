"use client";

import { DashboardIcon, ExitIcon, GearIcon } from "@radix-ui/react-icons";
import { IconUsersGroup } from "@tabler/icons-react";
import {
  ChartColumnStacked,
  ChevronDown,
  CreditCard,
  LogIn,
  ShoppingBag,
  User,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth/client";
import { redirects } from "@/lib/constants";

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

interface AuthDropdownProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
    role: string;
  } | null;
}

const iconMap = {
  ChevronDown,
  LogIn,
  User,
  DashboardIcon,
  ExitIcon,
  GearIcon,
  IconUsersGroup,
  ShoppingBag,
  ChartColumnStacked,
  WalletCards,
  CreditCard,
};

const authItems = {
  admin: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: "DashboardIcon",
    },
    {
      title: "Products",
      url: "/admin/products",
      icon: "ShoppingBag",
    },
    {
      title: "Categories",
      url: "/admin/categories",
      icon: "ChartColumnStacked",
    },
    {
      title: "Orders",
      url: "/admin/orders",
      icon: "CreditCard",
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: "IconUsersGroup",
    },
    {
      title: "Profile",
      url: "/admin/profile",
      icon: "GearIcon",
    },
  ],
  consumer: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: "DashboardIcon",
    },
    {
      title: "Orders",
      url: "/orders",
      icon: "CreditCard",
    },
    {
      title: "Profile",
      url: "/profile",
      icon: "User",
    },
  ],
};

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

  const initials = user.name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

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
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="max-w-[10rem] truncate font-medium text-md">
            {user?.name ?? "User"}
          </span>
          <ChevronDown className="size-6 opacity-70" aria-hidden="true" />
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
  return (
    <DropdownMenuGroup>
      {role === "admin" ? (
        <span>
          {authItems.admin.map((item) => {
            const IconComponent = item.icon
              ? iconMap[item.icon as keyof typeof iconMap]
              : null;

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
      ) : (
        <span>
          {authItems.consumer.map((item) => {
            const IconComponent = item.icon
              ? iconMap[item.icon as keyof typeof iconMap]
              : null;

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
