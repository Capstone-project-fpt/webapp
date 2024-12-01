import { type ClassValue, clsx } from "clsx";
import {
  eachDayOfInterval,
  eachHourOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  endOfDay,
  endOfMonth,
  endOfYear,
  format,
  startOfDay,
  startOfMonth,
  startOfYear,
} from "date-fns";
import { jwtDecode } from "jwt-decode";
import { DateRange } from "react-day-picker";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {},
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate"
      ? (accurateSizes[i] ?? "Bytest")
      : (sizes[i] ?? "Bytes")
  }`;
}

export function isTokenExpired(token?: string) {
  if (!token) {
    return;
  }

  const currentTime = Date.now();
  const decodedToken = jwtDecode<{ exp: number }>(token);
  return decodedToken.exp < currentTime;
}

export const calculateNewDates = (
  viewMode: string,
  index: number,
  currentIndex: number,
  dateRange: DateRange,
) => {
  let start = new Date(dateRange.from as Date);
  let end = new Date(dateRange.to as Date);
  const delta = (currentIndex - index) * -1;
  switch (viewMode) {
    case "day":
      start.setHours(start.getHours() + delta);
      end.setHours(end.getHours() + delta);
      break;
    case "week":
      start.setDate(start.getDate() + delta);
      end.setDate(end.getDate() + delta);
      break;
    case "month":
      start.setDate(start.getDate() + delta);
      end.setDate(end.getDate() + delta);
      break;
    case "year":
      start = new Date(dateRange.from as Date);
      start.setMonth(index);
      end = new Date(start);
      end.setMonth(start.getMonth() + 1);
      break;
  }
  return { start, end };
};

export const getLabelsForView = (
  viewMode: "day" | "week" | "month" | "year",
  dateRange: { start: Date; end: Date },
): string[] => {
  switch (viewMode) {
    case "day":
      // Generate hourly labels for each day in the range
      return eachHourOfInterval({
        start: startOfDay(dateRange.start),
        end: endOfDay(dateRange.end),
      }).map((hour) => format(hour, "HH:mm"));
    case "week":
      // Weekly labels based on the week number within the year
      return eachDayOfInterval({
        start: dateRange.start,
        end: dateRange.end,
      }).map((day) => `${format(day, "ccc ")} the ${format(day, "do")}`);
    case "month":
      // Monthly labels showing the full month name and year
      return eachWeekOfInterval({
        start: startOfMonth(dateRange.start),
        end: endOfMonth(dateRange.end),
      }).map((week) => `${format(week, "wo")} week of ${format(week, "MMM")}`);
    case "year":
      // Yearly labels showing month names only
      return eachMonthOfInterval({
        start: startOfYear(dateRange.start),
        end: endOfYear(dateRange.end),
      }).map((month) => format(month, "MMM"));
    default:
      return [];
  }
};
