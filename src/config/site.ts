import type { NavItem } from "@/types";

const links = {
  github: "https://github.com/razak17/next-ecommerce-app",
  githubAccount: "https://github.com/razak17",
};

export const siteConfig = {
  name: "Evershop",
  description:
    "An ecommerce app built with Next.js, TypeScript, and Tailwind CSS",
  url: "https://ecommerce.razakmo.tech",
  links,
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
