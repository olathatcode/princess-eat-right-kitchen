import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export function formatNaira(amount: number): string {
  // Intl outputs "NGN 3,500" in some runtimes; normalise to the ₦ symbol.
  return nairaFormatter.format(amount).replace(/NGN\s?/, "₦");
}

export function optimizeImageUrl(url: string, width: number = 600, quality: number = 75): string {
  if (url.includes("images.unsplash.com")) {
    try {
      const parsedUrl = new URL(url);
      parsedUrl.searchParams.set("w", width.toString());
      parsedUrl.searchParams.set("q", quality.toString());
      parsedUrl.searchParams.set("auto", "format");
      parsedUrl.searchParams.set("fit", "crop");
      return parsedUrl.toString();
    } catch {
      return url;
    }
  }
  return url;
}
