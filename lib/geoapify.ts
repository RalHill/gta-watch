import type { EmergencyService } from "@/types";

const GEOAPIFY_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_KEY;

if (!GEOAPIFY_KEY) {
  console.warn("GEOAPIFY_KEY not found");
}

/**
 * Reverse geocode coordinates to human-readable address
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<string> {
  try {
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${GEOAPIFY_KEY}`
    );

    if (!response.ok) {
      throw new Error("Geocoding failed");
    }

    const data = await response.json();
    if (data.features && data.features.length > 0) {
      const props = data.features[0].properties;
      return props.formatted || props.address_line1 || "Unknown location";
    }

    return "Unknown location";
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
  }
}

/**
 * Find nearby emergency services (hospitals, police, fire stations)
 */
export async function findNearbyEmergencyServices(
  latitude: number,
  longitude: number,
  radiusMeters: number = 5000
): Promise<EmergencyService[]> {
  try {
    const categories = [
      "healthcare.hospital",
      "service.police",
      "service.fire_station",
    ];

    const results: EmergencyService[] = [];

    for (const category of categories) {
      const response = await fetch(
        `https://api.geoapify.com/v2/places?categories=${category}&filter=circle:${longitude},${latitude},${radiusMeters}&limit=5&apiKey=${GEOAPIFY_KEY}`
      );

      if (!response.ok) continue;

      const data = await response.json();

      if (data.features) {
        for (const feature of data.features) {
          const props = feature.properties;
          const coords = feature.geometry.coordinates;

          let type: EmergencyService["type"] = "hospital";
          if (category.includes("police")) type = "police";
          if (category.includes("fire")) type = "fire";

          results.push({
            name: props.name || props.address_line1 || "Emergency Service",
            type,
            address: props.formatted || props.address_line1 || "Address unavailable",
            distance: props.distance || 0,
            latitude: coords[1],
            longitude: coords[0],
          });
        }
      }
    }

    // Sort by distance
    return results.sort((a, b) => a.distance - b.distance);
  } catch (error) {
    console.error("Error finding emergency services:", error);
    return [];
  }
}
