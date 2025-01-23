import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Function to generate a random ID
export function generateRandomId(): string {
  return `id-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
