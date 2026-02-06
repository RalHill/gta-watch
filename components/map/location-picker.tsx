"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const TORONTO_CENTER: [number, number] = [43.6532, -79.3832];

// Custom draggable pin icon
const createPinIcon = () => {
  return L.divIcon({
    className: "custom-pin",
    html: `<div style="
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
    ">
      <div style="
        background: #0EA5A4;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 20px rgba(14, 164, 164, 0.5), 0 4px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        z-index: 10;
      ">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
      <div style="
        width: 2px;
        height: 12px;
        background: linear-gradient(to bottom, #0EA5A4, transparent);
      "></div>
    </div>`,
    iconSize: [36, 48],
    iconAnchor: [18, 48],
  });
};

interface DraggableMarkerProps {
  position: [number, number];
  onPositionChange: (lat: number, lng: number) => void;
}

function DraggableMarker({ position, onPositionChange }: DraggableMarkerProps) {
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    const marker = markerRef.current;
    if (marker) {
      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        onPositionChange(pos.lat, pos.lng);
      });
    }
  }, [onPositionChange]);

  return (
    <Marker
      position={position}
      icon={createPinIcon()}
      draggable={true}
      ref={markerRef}
    />
  );
}

interface MapClickHandlerProps {
  onMapClick: (lat: number, lng: number) => void;
}

function MapClickHandler({ onMapClick }: MapClickHandlerProps) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface LocationPickerProps {
  initialPosition?: [number, number];
  onLocationChange: (latitude: number, longitude: number) => void;
}

export default function LocationPicker({
  initialPosition = TORONTO_CENTER,
  onLocationChange,
}: LocationPickerProps) {
  const [position, setPosition] = useState<[number, number]>(initialPosition);

  const handlePositionChange = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    onLocationChange(lat, lng);
  };

  return (
    <MapContainer
      center={position}
      zoom={15}
      style={{ height: "100%", width: "100%" }}
      className="z-0"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <DraggableMarker
        position={position}
        onPositionChange={handlePositionChange}
      />

      <MapClickHandler
        onMapClick={(lat, lng) => handlePositionChange(lat, lng)}
      />
    </MapContainer>
  );
}
