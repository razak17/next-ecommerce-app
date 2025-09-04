"use client";

import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import type * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { siteConfig } from "@/config/site";
import type { SidebarNavItem } from "@/types";
import { Icons } from "../icons";

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const segments = useSelectedLayoutSegments();

  const sidebarNav: SidebarNavItem[] = [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: "dashboard",
      isActive: segments.length === 0 || segments.includes("dashboard"),
    },
    {
      title: "Products",
      url: "/admin/products",
      icon: "product",
      isActive: segments.includes("products"),
    },
    {
      title: "Categories",
      url: "/admin/categories",
      icon: "category",
      isActive: segments.includes("categories"),
    },
    {
      title: "Orders",
      url: "/admin/orders",
      icon: "cart",
      isActive: segments.includes("orders"),
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: "users",
      isActive: segments.includes("users"),
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: "analytics",
      isActive: segments.includes("analytics"),
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: "settings",
      isActive: segments.includes("settings"),
    },
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="flex h-14 border-border/60 border-b px-0 py-2">
        <Link href="/" className="w-full">
          <SidebarMenu className="items-center justify-center px-4 lg:flex lg:px-6">
            <SidebarMenuItem>
              <span className="font-bold font-mono text-xl">
                {siteConfig.name}
              </span>
            </SidebarMenuItem>
          </SidebarMenu>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu className="pt-4">
              {sidebarNav.map((item) => {
                const Icon = Icons[item.icon ?? "chevronLeft"];
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={item.isActive}
                      className="px-4 py-6"
                    >
                      <Link href={item.url}>
                        {item.icon && <Icon />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
