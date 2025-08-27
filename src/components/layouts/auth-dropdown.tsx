"use client";

import {
  ChevronDown,
  GraduationCap,
  LogIn,
  LogOut,
  UserRound,
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
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AuthDropdownProps {
  user: {
    name: string;
    image?: string | null;
  } | null;
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
            <UserRound className="mr-2 size-4" />
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
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image ?? ""} alt={user?.name ?? "User"} />
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
          <span className="max-w-[10rem] truncate font-medium text-md">
            {user?.name ?? "User"}
          </span>
          <ChevronDown className="size-6 opacity-70" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent align="end" sideOffset={8} className="w-42">
          <DropdownMenuItem
            className="text-md text-primary focus:text-primary"
            onClick={() => {
              router.push(redirects.toDashboard);
            }}
          >
            <GraduationCap className="size-5" />
            Portal
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-md text-primary focus:text-primary"
            onClick={async () => {
              await authClient.signOut();
              router.refresh();
            }}
          >
            <LogOut className="size-5" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
