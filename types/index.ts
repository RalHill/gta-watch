export type IncidentCategory =
  | "shooting"
  | "medical"
  | "fire"
  | "accident"
  | "assault"
  | "suspicious"
  | "theft"
  | "other";

export interface Incident {
  id: string;
  category: IncidentCategory;
  description: string | null;
  latitude: number;
  longitude: number;
  location_label: string;
  created_at: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface EmergencyService {
  name: string;
  type: "hospital" | "police" | "fire";
  address: string;
  distance: number;
  latitude: number;
  longitude: number;
}

export interface AIGuidanceResponse {
  guidance: string;
}

export interface ReportFormData {
  category: IncidentCategory;
  description?: string;
  latitude: number;
  longitude: number;
  location_label: string;
}
