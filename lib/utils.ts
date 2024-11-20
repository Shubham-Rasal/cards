import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatTime = (ms: number): string => {
  const seconds = Math.round(ms / 1000);
  return `${seconds}s`;
};

export function generateColorScheme(url: string) {
  // Create a hash of the URL
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = ((hash << 5) - hash) + url.charCodeAt(i);
    hash = hash & hash;
  }

  // Use the hash to generate a base hue (0-360)
  const hue = Math.abs(hash % 360);

  // Define color variations
  return {
    primary: `hsl(${hue}, 65%, 50%)`,
    light: `hsl(${hue}, 65%, 65%)`,
    lighter: `hsl(${hue}, 65%, 75%)`,
    dark: `hsl(${hue}, 65%, 35%)`,
    darker: `hsl(${hue}, 65%, 25%)`,
    bg: `hsl(${hue}, 35%, 15%)`,
    text: `hsl(${hue}, 65%, 85%)`,
  };
}