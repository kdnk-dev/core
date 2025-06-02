import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const maybeParseBool = (val: any) =>
  val === "true" ? true : val === "false" ? false : val;
