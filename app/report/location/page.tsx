"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ShieldAlert, MapPin, Info, Loader2 } from "lucide-react";
import type { IncidentCategory } from "@/types";
import { reverseGeocode } from "@/lib/geoapify";
import { roundCoordinates } from "@/lib/utils";

export const dynamic = 'force-dynamic';

// Dynamically import map component (Leaflet requires window)
const LocationPicker = dynamic(
  () => import("@/components/map/location-picker"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-surface">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    ),
  }
);

const TORONTO_CENTER: [number, number] = [43.6532, -79.3832];

export default function ReportLocationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category") as IncidentCategory | null;
  const description = searchParams.get("description") || undefined;

  const [position, setPosition] = useState<[number, number]>(TORONTO_CENTER);
  const [address, setAddress] = useState("Fetching address...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) {
      router.push("/report");
      return;
    }

    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const rounded = roundCoordinates(
            pos.coords.latitude,
            pos.coords.longitude
          );
          setPosition([rounded.latitude, rounded.longitude]);
          fetchAddress(rounded.latitude, rounded.longitude);
          setLoading(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Use Toronto center as fallback
          fetchAddress(TORONTO_CENTER[0], TORONTO_CENTER[1]);
          setLoading(false);
        }
      );
    } else {
      fetchAddress(TORONTO_CENTER[0], TORONTO_CENTER[1]);
      setLoading(false);
    }
  }, [category, router]);

  const fetchAddress = async (lat: number, lon: number) => {
    const addr = await reverseGeocode(lat, lon);
    setAddress(addr);
  };

  const handleLocationChange = (latitude: number, longitude: number) => {
    const rounded = roundCoordinates(latitude, longitude);
    setPosition([rounded.latitude, rounded.longitude]);
    fetchAddress(rounded.latitude, rounded.longitude);
  };

  const handleConfirm = () => {
    if (category) {
      const params = new URLSearchParams();
      params.set("category", category);
      if (description) params.set("description", description);
      params.set("latitude", position[0].toString());
      params.set("longitude", position[1].toString());
      params.set("location_label", address);
      router.push(`/report/confirmation?${params.toString()}`);
    }
  };

  if (!category) return null;

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden">
      {/* Top Navigation */}
      <header className="flex items-center justify-between border-b border-solid border-white/10 bg-background/80 backdrop-blur-md px-10 py-4 z-50">
        <Link href="/" className="flex items-center gap-4">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white">shield</span>
          </div>
          <h2 className="text-text-main text-lg font-bold leading-tight tracking-tight">
            GTA Watch
          </h2>
        </Link>
        <div className="flex-1 flex justify-center">
          <div className="flex flex-col items-center gap-1 min-w-[300px]">
            <div className="flex w-full justify-between text-xs font-medium text-primary uppercase tracking-widest">
              <span className="text-muted">Incident Details</span>
              <span>Location Confirmation</span>
              <span className="text-muted">Finalize</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: "66%" }}
              ></div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex size-10 items-center justify-center rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
          <div className="bg-white/10 rounded-full size-10 border-2 border-primary/20" />
        </div>
      </header>

      <main className="relative flex-1 w-full h-full flex overflow-hidden">
        {/* Sidebar Panel */}
        <div className="w-96 bg-surface/90 backdrop-blur-xl border-r border-white/10 p-8 flex flex-col gap-6 z-40 relative shadow-2xl">
          <div>
            <h1 className="text-2xl font-bold text-text-main mb-2">
              Confirm Location
            </h1>
            <p className="text-muted text-sm leading-relaxed">
              Drag the map or move the pin to set the exact spot of the
              incident. Accuracy helps emergency responders arrive faster.
            </p>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Current Address
              </span>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="w-4 h-4 text-muted" />
                </div>
                <input
                  className="block w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-text-main placeholder:text-muted focus:ring-primary focus:border-primary text-sm"
                  readOnly
                  type="text"
                  value={address}
                />
              </div>
            </label>

            <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="text-xs text-text-main/80 leading-normal">
                  <strong>Safety First:</strong> Ensure you are in a safe
                  location before continuing your report. GTA Watch is
                  anonymous.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-3">
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Confirm Location
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <button
              onClick={() => router.back()}
              className="w-full bg-white/5 hover:bg-white/10 text-text-main/70 font-medium py-3 rounded-xl transition-all"
            >
              Go Back
            </button>
          </div>
        </div>

        {/* Interactive Map Area */}
        <div className="flex-1 relative bg-surface overflow-hidden">
          {!loading && (
            <LocationPicker
              initialPosition={position}
              onLocationChange={handleLocationChange}
            />
          )}

          {/* Search (visual parity; functional search comes next) */}
          <div className="absolute top-8 right-8 w-80 z-20">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-white/40 group-focus-within:text-primary transition-colors">
                  search
                </span>
              </div>
              <input
                className="w-full pl-11 pr-4 py-4 bg-background/90 border border-white/10 rounded-2xl text-text-main shadow-2xl backdrop-blur-md focus:ring-primary focus:border-primary"
                placeholder="Search different area..."
                type="text"
              />
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-8 left-8 p-3 rounded-lg bg-background/40 backdrop-blur-sm border border-white/5 text-[10px] text-white/40 flex gap-4 uppercase tracking-widest font-bold z-20">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-danger"></span> Active
              Reports
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-primary"></span> Your Pin
            </span>
          </div>

          {/* Floating Controls */}
          <div className="absolute bottom-8 right-8 flex flex-col gap-3 z-20">
            <button className="flex size-12 items-center justify-center rounded-xl bg-background/90 border border-white/10 text-text-main shadow-xl hover:bg-primary hover:text-white transition-all">
              <span className="material-symbols-outlined">my_location</span>
            </button>
            <div className="flex flex-col rounded-xl bg-background/90 border border-white/10 overflow-hidden shadow-xl">
              <button className="flex size-12 items-center justify-center border-b border-white/10 text-text-main hover:bg-white/5 transition-all">
                <span className="material-symbols-outlined">add</span>
              </button>
              <button className="flex size-12 items-center justify-center text-text-main hover:bg-white/5 transition-all">
                <span className="material-symbols-outlined">remove</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
