import type { NavItem } from "@/types";

export const mainNav: NavItem[] = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Shop",
    url: "/shop",
  },
  {
    title: "Cart",
    url: "/cart",
  },
  {
    title: "Favorites",
    url: "/favorites",
  },
];

export const siteConfig = {
  name: "Evershop",
  description: "Ecommerce Platform",
  url: "https://ecommerce.razakmo.tech",
  mainNav,
};
