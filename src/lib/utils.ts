import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalize(str: string) {
  return str === "/" ? "/" : str.replace(/\/$/, "");
}

export function isActiveUrl(pathname: string, url: string) {
  const normalizedPathname = normalize(pathname || "/");
  const normalizedItemUrl = normalize(url);
  const isActive = normalizedPathname === normalizedItemUrl;
  return isActive;
}
