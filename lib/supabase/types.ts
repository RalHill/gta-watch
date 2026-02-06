import type { IncidentCategory } from "@/types";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      incidents: {
        Row: {
          id: string;
          category: IncidentCategory;
          description: string | null;
          latitude: number;
          longitude: number;
          location_label: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          category: IncidentCategory;
          description?: string | null;
          latitude: number;
          longitude: number;
          location_label: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          category?: IncidentCategory;
          description?: string | null;
          latitude?: number;
          longitude?: number;
          location_label?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
