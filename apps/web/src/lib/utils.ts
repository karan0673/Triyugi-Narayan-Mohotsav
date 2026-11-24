import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely (same helper shadcn/ui uses). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
