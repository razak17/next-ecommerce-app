import type { Icons } from "@/components/icons";
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
const bannerSlides = [
  {
    image: "/images/banner-0.jpg",
    title: "Next-Gen Mobility",
    description:
      "Power, performance, and style - experience the future of smartphones today.",
  },
  {
    image: "/images/banner-1.jpg",
    title: "Innovation Redefined",
    description:
      "Discover cutting-edge technology designed to enhance your digital lifestyle.",
  },
  {
    image: "/images/banner-2.jpg",
    title: "Premium Experience",
    description:
      "Quality craftsmanship meets modern design for the ultimate user experience.",
  },
];

const whyChooseUs = [
  {
    icon: "store",
    title: "Quality Products",
    description:
      "Carefully curated selection of high-quality products from trusted brands and suppliers worldwide.",
  },
  {
    icon: "cart",
    title: "Fast Delivery",
    description:
      "Lightning-fast shipping with real-time tracking. Get your orders delivered within 24-48 hours.",
  },
  {
    icon: "users",
    title: "24/7 Support",
    description:
      "Our dedicated customer support team is available round the clock to assist you with any queries.",
  },
  {
    icon: "credit",
    title: "Secure Payments",
    description:
      "Shop with confidence using our encrypted payment system supporting multiple payment methods.",
  },
  {
    icon: "analytics",
    title: "Easy Returns",
    description:
      "Hassle-free 30-day return policy. Not satisfied? Return your purchase with no questions asked.",
  },
  {
    icon: "dollarSign",
    title: "Best Prices",
    description:
      "Competitive pricing with regular discounts and special offers. Get the best value for your money.",
  },
] satisfies {
  icon: keyof typeof Icons;
  title: string;
  description: string;
}[];

const lobbyStats = [
  { label: "Happy Customers", value: "10K+" },
  { label: "Products Sold", value: "50K+" },
  { label: "Satisfaction Rate", value: "99.9%" },
  { label: "Support Available", value: "24/7" },
];

export const siteConfig = {
  name: "Evershop",
  description:
    "An ecommerce app built with Next.js, TypeScript, and Tailwind CSS",
  url: "https://ecommerce.razakmo.tech",
  links,
  authItems,
  bannerSlides,
  whyChooseUs,
  lobbyStats,
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
