"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import type { Incident, IncidentCategory } from "@/types";
import { supabase } from "@/lib/supabase/client";
import { formatTimeAgo } from "@/lib/utils";

// Dynamically import map (Leaflet requires window)
const IncidentMap = dynamic(() => import("@/components/map/incident-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-surface">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
    </div>
  ),
});

export default function HomePage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null
  );
  const [showRecent, setShowRecent] = useState(true);
  const [tilesStyle, setTilesStyle] = useState<"muted" | "normal">("muted");
  const [toast, setToast] = useState<string | null>(null);
  const [map, setMap] = useState<import("leaflet").Map | null>(null);

  useEffect(() => {
    async function fetchIncidents() {
      try {
        const { data, error } = await supabase
          .from("incidents")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        setIncidents(data ?? []);
      } catch (e) {
        console.error("Failed to load incidents", e);
      } finally {
        setLoading(false);
      }
    }

    fetchIncidents();

    const channel = supabase
      .channel("incidents-dashboard")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "incidents" },
        (payload) => {
          setIncidents((prev) => [payload.new as Incident, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const activeAlerts = incidents.length;

  const recentIncidents = useMemo(() => incidents.slice(0, 6), [incidents]);

  const categoryPill = (cat: IncidentCategory) => {
    const base =
      "px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider";
    switch (cat) {
      case "fire":
        return `${base} bg-danger/10 text-danger border-danger/20`;
      case "medical":
        return `${base} bg-primary/10 text-primary border-primary/20`;
      case "accident":
        return `${base} bg-accent/10 text-accent border-accent/20`;
      case "shooting":
        return `${base} bg-danger/10 text-danger border-danger/20`;
      case "assault":
        return `${base} bg-accent/10 text-accent border-accent/20`;
      case "suspicious":
        return `${base} bg-primary/10 text-primary border-primary/20`;
      case "theft":
        return `${base} bg-accent/10 text-accent border-accent/20`;
      default:
        return `${base} bg-white/10 text-text-main/70 border-white/10`;
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <IncidentMap
          incidents={showRecent ? incidents : []}
          onIncidentClick={(inc) => setSelectedIncident(inc)}
          disablePopups
          tilesStyle={tilesStyle}
          onMapReady={(m) => setMap(m)}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none map-overlay-gradient z-[1]" />

      {/* Top Bar */}
      <header className="absolute left-8 top-6 right-8 z-20 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-4 bg-surface/80 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="bg-primary size-8 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <span
                className="material-symbols-outlined text-white text-xl"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                radar
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight leading-none text-text-main">
                Toronto Incident Map
              </h1>
              <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-0.5">
                GTA Watch Real-time Dashboard
              </p>
            </div>
          </div>
          <div className="w-px h-8 bg-white/10 mx-2" />
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold text-text-main/70 uppercase tracking-wider">
              Live System
            </span>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-4">
          <div className="flex bg-surface/90 backdrop-blur-md border border-white/10 p-1.5 rounded-xl shadow-2xl">
            <button
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-text-main bg-white/10 rounded-lg"
              aria-current="page"
              type="button"
            >
              Map View
            </button>
            <Link
              href="/incidents"
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-text-main/50 hover:text-text-main transition-colors rounded-lg"
            >
              List View
            </Link>
          </div>

          <div className="bg-surface/90 backdrop-blur-md border border-white/10 p-1.5 rounded-xl shadow-2xl flex items-center gap-4 px-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-text-main/40 font-bold uppercase">
                Active Alerts
              </span>
              <span className="text-sm font-bold">
                {loading ? "—" : `${activeAlerts} Incidents`}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setToast("No notifications (demo).");
                window.setTimeout(() => setToast(null), 2500);
              }}
              className="size-10 rounded-lg bg-white/5 flex items-center justify-center text-text-main hover:bg-white/10 transition-colors"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined text-xl">
                notifications
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Left: Recent Incidents */}
      <aside className="absolute left-8 top-1/2 -translate-y-1/2 z-20 w-80 max-h-[70vh] flex flex-col pointer-events-none">
        <div className="bg-surface border border-white/10 rounded-2xl flex flex-col pointer-events-auto shadow-2xl overflow-hidden">
          <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                history
              </span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-text-main">
                Recent Incidents
              </h2>
            </div>
            <Link
              href="/incidents"
              className="text-[10px] font-bold text-primary hover:underline"
            >
              VIEW ALL
            </Link>
          </div>

          <div className="overflow-y-auto custom-scrollbar p-4 flex flex-col gap-3 h-full">
            {loading ? (
              <div className="p-6 flex items-center justify-center text-muted text-sm">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading…
              </div>
            ) : recentIncidents.length === 0 ? (
              <div className="p-6 text-muted text-sm">
                No incidents in the last 24 hours.
              </div>
            ) : (
              recentIncidents.map((incident) => (
                <div
                  key={incident.id}
                  onClick={() => setSelectedIncident(incident)}
                  className="p-3 rounded-xl bg-white/10 border border-white/10 hover:border-primary/30 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={categoryPill(incident.category)}>
                      {incident.category}
                    </span>
                    <span className="text-[10px] text-text-main/40">
                      {formatTimeAgo(incident.created_at)}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-text-main/90 leading-snug line-clamp-2">
                    {incident.description || incident.location_label}
                  </p>
                  <p className="text-[10px] text-text-main/40 mt-1 line-clamp-1">
                    {incident.location_label}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="p-4 bg-white/5 border-t border-white/5">
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                checked={showRecent}
                onChange={(e) => setShowRecent(e.target.checked)}
                className="sr-only peer"
                type="checkbox"
              />
              <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              <span className="ml-3 text-xs font-medium text-text-main/60">
                View Recent Incidents
              </span>
            </label>
          </div>
        </div>
      </aside>

      {/* Right: Map Controls */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2 pointer-events-none">
        <div className="pointer-events-auto flex flex-col bg-surface/90 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <button
            type="button"
            onClick={() => map?.zoomIn()}
            className="p-4 hover:bg-white/5 border-b border-white/5 transition-all text-text-main/60 hover:text-text-main"
            aria-label="Zoom in"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
          <button
            type="button"
            onClick={() => map?.zoomOut()}
            className="p-4 hover:bg-white/5 transition-all text-text-main/60 hover:text-text-main"
            aria-label="Zoom out"
          >
            <span className="material-symbols-outlined">remove</span>
          </button>
        </div>
        <button
          type="button"
          onClick={() => {
            if (!map) return;
            if (!navigator.geolocation) {
              setToast("Geolocation is unavailable in this browser.");
              return;
            }
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                map.setView([pos.coords.latitude, pos.coords.longitude], 15, {
                  animate: false,
                });
              },
              () => setToast("Location permission denied.")
            );
          }}
          className="pointer-events-auto size-14 bg-surface/90 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl text-text-main/60 hover:text-primary transition-all"
          aria-label="Center map on your location"
        >
          <span className="material-symbols-outlined">my_location</span>
        </button>
        <button
          type="button"
          onClick={() =>
            setTilesStyle((s) => (s === "muted" ? "normal" : "muted"))
          }
          className="pointer-events-auto size-14 bg-surface/90 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl text-text-main/60 hover:text-primary transition-all"
          aria-label="Toggle map styling"
        >
          <span className="material-symbols-outlined">layers</span>
        </button>
      </div>

      {/* Bottom Stats */}
      <footer className="absolute bottom-0 w-full z-20 p-8 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-8 bg-surface/80 backdrop-blur-md border border-white/10 px-6 py-4 rounded-2xl pointer-events-auto shadow-2xl">
          <div className="flex flex-col">
            <span className="text-[10px] text-text-main/40 font-bold uppercase">
              Avg Response Time
            </span>
            <span className="text-lg font-bold text-primary">6m 12s</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col">
            <span className="text-[10px] text-text-main/40 font-bold uppercase">
              Incidents / Hour
            </span>
            <span className="text-lg font-bold text-text-main">4.2</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col">
            <span className="text-[10px] text-text-main/40 font-bold uppercase">
              Report Trend
            </span>
            <span className="text-lg font-bold text-danger">+14%</span>
          </div>
        </div>

        <div className="bg-surface/90 backdrop-blur-md border border-white/10 px-4 py-3 rounded-2xl flex items-center gap-3 pointer-events-auto shadow-2xl">
          <div className="size-8 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-accent text-sm">
              support_agent
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider leading-none text-text-main">
              Status: Encrypted
            </p>
            <p className="text-[9px] text-text-main/40 mt-1 uppercase">
              User: Anonymous
            </p>
          </div>
        </div>
      </footer>

      {/* Report Emergency FAB */}
      <Link
        href="/report"
        className="absolute bottom-10 right-10 z-30 flex items-center gap-3 px-6 py-4 bg-danger text-white rounded-full shadow-2xl hover:brightness-110 active:scale-95 transition-all group pointer-events-auto"
      >
        <span className="material-symbols-outlined font-bold">emergency</span>
        <span className="text-sm font-bold uppercase tracking-widest">
          Report an Emergency
        </span>
      </Link>

      {/* Right: Incident Details Drawer (matches screenshot structure) */}
      {selectedIncident && (
        <aside className="fixed top-0 right-0 z-40 h-full w-full max-w-[480px] bg-surface/98 backdrop-blur-xl border-l border-white/10 shadow-2xl overflow-y-auto custom-scrollbar">
          <div className="relative h-48 w-full bg-[#111818]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c2727] via-transparent to-transparent" />
            <button
              onClick={() => setSelectedIncident(null)}
              className="absolute top-4 right-4 bg-[#111818]/60 backdrop-blur-md p-2 rounded-full text-text-main hover:bg-primary hover:text-white transition-colors"
              aria-label="Close incident details"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="absolute bottom-4 left-6">
              <span className="px-2 py-1 bg-danger/90 text-[10px] font-bold text-white rounded uppercase tracking-wider mb-2 inline-block">
                High Priority
              </span>
              <h2 className="text-2xl font-black text-text-main capitalize">
                {selectedIncident.category.replace(/_/g, " ")}
              </h2>
            </div>
          </div>

          <div className="p-6 flex flex-col gap-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted text-xs font-medium uppercase tracking-tighter">
                  Incident
                </p>
                <p className="text-text-main font-bold">
                  #{selectedIncident.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-muted text-xs font-medium uppercase tracking-tighter">
                  Reported
                </p>
                <p className="text-text-main font-bold">
                  {formatTimeAgo(selectedIncident.created_at)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[#283939] rounded-xl border border-white/5">
              <div className="bg-primary/20 p-2 rounded-lg">
                <span className="material-symbols-outlined text-primary">
                  location_on
                </span>
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted">Approximate Location</p>
                <p className="text-sm font-semibold text-text-main line-clamp-2">
                  {selectedIncident.location_label}
                </p>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${selectedIncident.latitude},${selectedIncident.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:bg-primary hover:text-white p-2 rounded-lg transition-all"
                aria-label="Open directions"
              >
                <span className="material-symbols-outlined">directions</span>
              </a>
            </div>

            {/* AI Guidance teaser (full matching will be next step) */}
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">
                smart_toy
              </span>
              <h3 className="text-lg font-bold text-text-main">AI Guidance</h3>
              <span className="ml-auto text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full uppercase font-bold tracking-widest">
                Live Analysis
              </span>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <p className="text-sm text-muted leading-relaxed">
                Generate calm, structured next steps tailored to this incident.
              </p>
              <button
                className="mt-4 w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20"
                onClick={() => {
                  // Next: wire to a drawer-mode AI panel matching screenshot
                  window.dispatchEvent(
                    new CustomEvent("gta-watch:open-guidance", {
                      detail: selectedIncident,
                    })
                  );
                }}
              >
                Generate Guidance
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest">
                Official Channels
              </p>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="https://www.toronto.ca/community-people/public-safety-alerts/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-3 bg-[#283939] rounded-xl border border-white/5 hover:bg-[#344b4b] transition-all text-left"
                >
                  <span className="material-symbols-outlined text-sm text-muted">
                    podcasts
                  </span>
                  <span className="text-xs font-semibold text-text-main">
                    City Alerts
                  </span>
                </a>
                <a
                  href="https://x.com/TPSOperations"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-3 bg-[#283939] rounded-xl border border-white/5 hover:bg-[#344b4b] transition-all text-left"
                >
                  <span className="material-symbols-outlined text-sm text-muted">
                    public
                  </span>
                  <span className="text-xs font-semibold text-text-main">
                    X Police Feed
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 p-6 bg-[#0d1117]/90 backdrop-blur-xl border-t border-white/10 flex flex-col gap-3">
            <a
              href="tel:911"
              className="flex items-center justify-center gap-2 w-full h-14 bg-danger hover:bg-danger/90 active:scale-95 transition-all text-white rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.3)]"
            >
              <span className="material-symbols-outlined font-bold">call</span>
              <span className="text-lg font-black tracking-wide uppercase">
                Call 911 Now
              </span>
            </a>
            <button
              type="button"
              onClick={async () => {
                const text = `GTA Watch incident: ${selectedIncident.category}\n${selectedIncident.location_label}\nReported ${formatTimeAgo(
                  selectedIncident.created_at
                )}\nMap: https://www.google.com/maps/search/?api=1&query=${selectedIncident.latitude},${selectedIncident.longitude}`;
                try {
                  if (navigator.share) {
                    await navigator.share({
                      title: "GTA Watch Incident",
                      text,
                    });
                    setToast("Share sheet opened.");
                    return;
                  }
                  await navigator.clipboard.writeText(text);
                  setToast("Incident copied to clipboard.");
                } catch {
                  setToast("Unable to share on this device.");
                }
              }}
              className="flex items-center justify-center gap-2 w-full h-12 bg-[#283939] hover:bg-[#344b4b] transition-all text-text-main rounded-xl font-bold text-sm"
            >
              <span className="material-symbols-outlined text-sm">share</span>
              Share Incident Report
            </button>
          </div>
        </aside>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-surface/90 backdrop-blur-md border border-white/10 text-text-main px-4 py-3 rounded-xl shadow-2xl text-sm">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
