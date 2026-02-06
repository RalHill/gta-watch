import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Round coordinates to 5 decimal places for privacy
 */
export function roundCoordinates(lat: number, lon: number) {
  return {
    latitude: Math.round(lat * 100000) / 100000,
    longitude: Math.round(lon * 100000) / 100000,
  };
}

/**
 * Format timestamp to relative time (e.g., "2m ago")
 */
export function formatTimeAgo(timestamp: string): string {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
}

/**
 * Calculate distance between two coordinates in km
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
