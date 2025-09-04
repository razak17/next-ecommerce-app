import type { Icons } from "@/components/icons";

export interface SessionUser {
  name: string;
  email: string;
  image?: string | null;
  role: string;
}

export interface StoredFile {
  id: string;
  name: string;
  url: string;
}

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: React.ReactNode;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}

export interface SidebarNavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  isActive?: boolean;
  description?: string;
}

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}
