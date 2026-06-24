import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function formatDate(date: string, format = "DD MMM YYYY"): string {
  return dayjs(date).format(format);
}

export function formatRelativeTime(date: string): string {
  return dayjs(date).fromNow();
}

export function formatReadingTime(minutes: number): string {
  return `${minutes} min read`;
}

export function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

export function generateOrderTrackingParams(identifier: string): {
  email?: string;
  orderNumber?: string;
} {
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
  return isEmail ? { email: identifier } : { orderNumber: identifier };
}
