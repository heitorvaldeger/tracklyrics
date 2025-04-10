import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(sec: number, hasMilliseconds: boolean = true) {
  const minutes = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");

  if (!hasMilliseconds) {
    return `${minutes}:${seconds}`;
  }

  const milliseconds = Math.floor((sec % 1) * 100)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}.${milliseconds}`;
}

/**
 * Shuffle an array
 * @param array
 * @returns
 */
export function shuffleArray(array: any[]) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

/**
 * Convert a format mm:ss.ms string to seconds
 * @param timestamp
 * @returns
 */
export const parseTimestamp = (timestamp: string) => {
  const [minutes, seconds, milliseconds] = timestamp.split(/[:.]/).map(Number);
  return minutes * 60 + seconds + milliseconds / 1000;
};
