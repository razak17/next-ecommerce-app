import type { NavItem } from "@/types";

const links = {
  github: "https://github.com/razak17/next-ecommerce-app",
  githubAccount: "https://github.com/razak17",
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
      url: "/profile",
      icon: "GearIcon",
    },
  ] satisfies NavItem[],
  consumer: [
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
  ] satisfies NavItem[],
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
