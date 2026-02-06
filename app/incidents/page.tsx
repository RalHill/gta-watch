"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { Incident, IncidentCategory } from "@/types";
import { supabase } from "@/lib/supabase/client";
import { formatTimeAgo } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const IncidentMap = dynamic(() => import("@/components/map/incident-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-surface">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
    </div>
  ),
});

export default function IncidentsListPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Incident | null>(null);

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
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchIncidents();
  }, []);

  const activeAlerts = incidents.length;

  const pill = (cat: IncidentCategory) => {
    const base =
      "px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider";
    switch (cat) {
      case "fire":
      case "shooting":
        return `${base} bg-danger/10 text-danger border-danger/20`;
      case "medical":
      case "suspicious":
        return `${base} bg-primary/10 text-primary border-primary/20`;
      case "accident":
      case "assault":
      case "theft":
        return `${base} bg-accent/10 text-accent border-accent/20`;
      default:
        return `${base} bg-white/10 text-text-main/70 border-white/10`;
    }
  };

  const list = useMemo(() => incidents.slice(0, 50), [incidents]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <IncidentMap
          incidents={incidents}
          onIncidentClick={(i) => setSelected(i)}
          disablePopups
        />
      </div>
      <div className="absolute inset-0 pointer-events-none map-overlay-gradient z-[1]" />

      {/* Top bar matching dashboard */}
      <header className="absolute left-8 top-6 right-8 z-20 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-4 bg-surface/90 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl shadow-2xl">
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
            <Link
              href="/"
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-text-main/50 hover:text-text-main transition-colors rounded-lg"
            >
              Map View
            </Link>
            <span className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-text-main bg-white/10 rounded-lg">
              List View
            </span>
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

      {/* List panel */}
      <aside className="absolute left-8 top-24 bottom-8 z-20 w-[420px] pointer-events-auto">
        <div className="h-full bg-surface/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                list
              </span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-text-main">
                Incidents (Last 24 Hours)
              </h2>
            </div>
            <Link
              href="/report"
              className="text-[10px] font-bold text-danger hover:underline uppercase tracking-wider"
            >
              REPORT
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-3">
            {loading ? (
              <div className="p-6 flex items-center justify-center text-muted text-sm">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading…
              </div>
            ) : list.length === 0 ? (
              <div className="p-6 text-muted text-sm">
                No incidents in the last 24 hours.
              </div>
            ) : (
              list.map((incident) => (
                <button
                  key={incident.id}
                  type="button"
                  onClick={() => setSelected(incident)}
                  className={`p-3 rounded-xl bg-white/5 border transition-all text-left ${
                    selected?.id === incident.id
                      ? "border-primary/50"
                      : "border-white/5 hover:border-primary/30"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={pill(incident.category)}>
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
                </button>
              ))
            )}
          </div>

          <div className="p-4 bg-white/5 border-t border-white/5 flex items-center justify-between">
            <p className="text-xs text-text-main/60">
              Click an incident to highlight on the map.
            </p>
            <Link
              href="/"
              className="text-xs font-bold text-primary hover:underline"
            >
              Back to Map
            </Link>
          </div>
        </div>
      </aside>

      <Link
        href="/report"
        className="absolute bottom-10 right-10 z-30 flex items-center gap-3 px-6 py-4 bg-danger text-white rounded-full shadow-2xl hover:brightness-110 active:scale-95 transition-all group pointer-events-auto"
      >
        <span className="material-symbols-outlined font-bold">emergency</span>
        <span className="text-sm font-bold uppercase tracking-widest">
          Report an Emergency
        </span>
      </Link>
    </div>
  );
}

