import { clsx, type ClassValue } from "clsx";
import { formatDistanceToNowStrict } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getUserTokenFromLocalStorage = () => {
  return localStorage.getItem("user-token");
};

export const getDateRelativeFromNowByYear = (year: number) =>
  formatDistanceToNowStrict(new Date(year, 1, 1), {
    addSuffix: true,
  });
