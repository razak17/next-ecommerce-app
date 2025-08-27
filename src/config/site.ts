import type { NavItem } from "@/types";

export const mainNav: NavItem[] = [
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
];

export const siteConfig = {
  name: "Evershop",
  description: "Ecommerce Platform",
  url: "https://ecommerce.razakmo.tech",
  mainNav,
};
