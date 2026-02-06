"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "@/lib/supabase/client";
import type { Incident, IncidentCategory } from "@/types";
import { formatTimeAgo } from "@/lib/utils";

// Toronto coordinates
const TORONTO_CENTER: [number, number] = [43.6532, -79.3832];
const DEFAULT_ZOOM = 11;

// Category color mapping
const CATEGORY_COLORS: Record<IncidentCategory, string> = {
  shooting: "#DC2626", // red
  medical: "#F59E0B", // orange
  fire: "#EF4444", // red-orange
  accident: "#FBBF24", // yellow
  assault: "#7C3AED", // purple
  suspicious: "#3B82F6", // blue
  theft: "#8B5CF6", // purple
  other: "#6B7280", // gray
};

// Create custom markers for each category
function createCategoryIcon(category: IncidentCategory) {
  const color = CATEGORY_COLORS[category];
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background-color: ${color};
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

// Component to fit map to markers
function MapBounds({ incidents }: { incidents: Incident[] }) {
  const map = useMap();

  useEffect(() => {
    if (incidents.length > 0) {
      const bounds = L.latLngBounds(
        incidents.map((inc) => [inc.latitude, inc.longitude])
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  }, [incidents, map]);

  return null;
}

interface IncidentMapProps {
  onIncidentClick?: (incident: Incident) => void;
  incidents?: Incident[];
  disablePopups?: boolean;
  onMapReady?: (map: L.Map) => void;
  tilesStyle?: "muted" | "normal";
}

export default function IncidentMap({
  onIncidentClick,
  incidents: incidentsProp,
  disablePopups = true,
  onMapReady,
  tilesStyle = "muted",
}: IncidentMapProps) {
  const [incidents, setIncidents] = useState<Incident[]>(incidentsProp ?? []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (incidentsProp) {
      // Controlled mode: use parent-provided incidents
      setIncidents(incidentsProp);
      setLoading(false);
      return;
    }

    async function fetchIncidents() {
      try {
        const { data, error } = await supabase
          .from("incidents")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setIncidents(data || []);
      } catch (error) {
        console.error("Error fetching incidents:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchIncidents();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("incidents-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "incidents",
        },
        (payload) => {
          setIncidents((prev) => [payload.new as Incident, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [incidentsProp]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-surface">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted text-sm">Loading incidents...</p>
        </div>
      </div>
    );
  }

  function MapReady() {
    const map = useMap();
    useEffect(() => {
      onMapReady?.(map);
    }, [map]);
    return null;
  }

  return (
    <MapContainer
      center={TORONTO_CENTER}
      zoom={DEFAULT_ZOOM}
      style={{ height: "100%", width: "100%", opacity: 0.4 }}
      className="z-0"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        className={
          tilesStyle === "muted"
            ? "map-tiles grayscale"
            : "map-tiles"
        }
      />

      {incidents.map((incident) => (
        <Marker
          key={incident.id}
          position={[incident.latitude, incident.longitude]}
          icon={createCategoryIcon(incident.category)}
          eventHandlers={{
            click: () => onIncidentClick?.(incident),
          }}
        >
          {!disablePopups && (
            <Popup>
              <div className="text-sm">
                <div className="font-bold text-base mb-1 capitalize">
                  {incident.category}
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  {formatTimeAgo(incident.created_at)}
                </div>
                <div className="text-xs mb-1">{incident.location_label}</div>
                {incident.description && (
                  <div className="text-xs text-gray-700 mt-2 italic">
                    {incident.description}
                  </div>
                )}
              </div>
            </Popup>
          )}
        </Marker>
      ))}

      <MapBounds incidents={incidents} />
      <MapReady />
    </MapContainer>
  );
}
