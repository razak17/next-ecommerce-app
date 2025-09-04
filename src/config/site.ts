import type { NavItem, SidebarNavItem } from "@/types";

const links = {
  github: "https://github.com/razak17/next-ecommerce-app",
  githubAccount: "https://github.com/razak17",
};

const authItems = {
  admin: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: "dashboard",
    },
    {
      title: "Profile",
      url: "/profile",
      icon: "settings",
    },
  ] satisfies SidebarNavItem[],
  consumer: [
    {
      title: "Orders",
      url: "/orders",
      icon: "credit",
    },
    {
      title: "Profile",
      url: "/profile",
      icon: "settings",
    },
  ] satisfies SidebarNavItem[],
};

export const siteConfig = {
  name: "Evershop",
  description:
    "An ecommerce app built with Next.js, TypeScript, and Tailwind CSS",
  url: "https://ecommerce.razakmo.tech",
  links,
  authItems,
  mainNav: [
    {
      title: "Home",
      url: "/",
      icon: "Home",
    },
    {
      title: "Shop",
      url: "/shop",
      icon: "ShoppingBag",
    },
    {
      title: "Cart",
      url: "/cart",
      icon: "ShoppingCart",
    },
    {
      title: "Favorites",
      url: "/favorites",
      icon: "Heart",
    },
  ] satisfies NavItem[],
};
