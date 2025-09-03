import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalize(str: string) {
  return str === "/" ? "/" : str.replace(/\/$/, "");
}

export function getInitials(
  firstName?: string | null,
  lastName?: string | null,
) {
  return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
}

export function isActiveUrl(pathname: string, url: string) {
  const normalizedPathname = normalize(pathname || "/");
  const normalizedItemUrl = normalize(url);
  const isActive = normalizedPathname === normalizedItemUrl;
  return isActive;
}

export function formatBytes(
  bytes: number,
  decimals = 0,
  sizeType: "accurate" | "normal" = "normal",
) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(decimals)} ${
    sizeType === "accurate"
      ? (accurateSizes[i] ?? "Bytest")
      : (sizes[i] ?? "Bytes")
  }`;
}

type SuccessResult<T> = readonly [data: T, error: null];
type ErrorResult<E> = readonly [data: null, error: E];
type Result<T, E = Error> = SuccessResult<T> | ErrorResult<E>;

export async function tryCatch<T, E = Error>(
  promise: Promise<T>,
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return [data, null] as const;
  } catch (error) {
    return [null, error as E] as const;
  }
}
