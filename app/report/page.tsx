"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { IncidentCategory } from "@/types";
import {
  Siren,
  HeartPulse,
  Flame,
  Car,
  UserX,
  Eye,
  ShieldAlert,
  AlertTriangle,
  Info,
} from "lucide-react";

const CATEGORIES: {
  value: IncidentCategory;
  label: string;
  Icon: any;
}[] = [
  { value: "shooting", label: "Shooting", Icon: Siren },
  { value: "medical", label: "Medical", Icon: HeartPulse },
  { value: "fire", label: "Fire / Smoke", Icon: Flame },
  { value: "accident", label: "Collision", Icon: Car },
  { value: "assault", label: "Assault", Icon: UserX },
  { value: "suspicious", label: "Suspicious", Icon: Eye },
  { value: "theft", label: "Theft", Icon: ShieldAlert },
  { value: "other", label: "Other", Icon: AlertTriangle },
];

export default function ReportCategoryPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] =
    useState<IncidentCategory | null>(null);

  const handleContinue = () => {
    if (selectedCategory) {
      router.push(`/report/description?category=${selectedCategory}`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation Bar */}
      <header className="flex items-center justify-between border-b border-white/10 px-6 lg:px-40 py-3 bg-surface/95 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-4 text-text-main">
          <div className="size-6 text-primary">
            <ShieldAlert className="w-full h-full" />
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-tight">
            GTA Watch
          </h2>
        </Link>
        <div className="flex flex-1 justify-end gap-8">
          <nav className="hidden md:flex items-center gap-9">
            <Link
              href="/"
              className="text-sm font-medium leading-normal hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/"
              className="text-sm font-medium leading-normal hover:text-primary transition-colors"
            >
              Live Map
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex justify-center py-10 px-4">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          {/* Progress Stepper */}
          <div className="flex flex-col gap-3 p-4 mb-6">
            <div className="flex gap-6 justify-between items-end">
              <div>
                <h3 className="text-primary text-sm font-bold uppercase tracking-wider">
                  Step 1 of 4
                </h3>
                <p className="text-text-main text-2xl font-bold">
                  Category Selection
                </p>
              </div>
              <p className="text-text-main text-sm font-normal mb-1">
                25% Complete
              </p>
            </div>
            <div className="rounded-full bg-white/10 h-2 w-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: "25%" }}></div>
            </div>
          </div>

          <div className="px-4 mb-8 text-center lg:text-left">
            <h1 className="text-text-main tracking-tight text-[32px] font-bold leading-tight">
              Report an Incident
            </h1>
            <p className="text-muted text-base font-normal leading-normal mt-2">
              Your report is anonymous. Select the category that best matches
              the emergency situation to alert others nearby.
            </p>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
            {CATEGORIES.map(({ value, label, Icon }) => (
              <button
                key={value}
                onClick={() => setSelectedCategory(value)}
                className={`group relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 p-6 text-text-main cursor-pointer transition-all hover:border-primary/50 hover:bg-primary/5 ${
                  selectedCategory === value
                    ? "border-primary bg-primary/10"
                    : "border-white/10"
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                    selectedCategory === value
                      ? "bg-primary text-white"
                      : "bg-white/10 text-text-main"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-center font-semibold">{label}</span>
                {selectedCategory === value && (
                  <div className="absolute top-3 right-3">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Navigation Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 mt-8 border-t border-white/10 pt-8">
            <Link
              href="/"
              className="w-full sm:w-auto px-8 h-12 rounded-xl border border-white/20 text-text-main font-bold hover:bg-white/5 transition-colors flex items-center justify-center"
            >
              Cancel Report
            </Link>
            <button
              onClick={handleContinue}
              disabled={!selectedCategory}
              className="w-full sm:w-auto px-12 h-12 rounded-xl bg-primary text-white font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
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
          </div>

          {/* Emergency Notice */}
          <div className="mt-12 flex items-start gap-4 p-6 rounded-xl bg-surface border border-primary/20">
            <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-text-main">
                Emergency Services Notice
              </p>
              <p className="text-xs text-muted leading-relaxed mt-1">
                GTA Watch is a community tool. In a life-threatening emergency,
                always dial 9-1-1 immediately. This tool helps notify the
                community after authorities have been contacted.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-10 text-center border-t border-white/10 bg-surface">
        <p className="text-muted text-xs">
          © 2024 GTA Watch Toronto. Anonymous Incident Awareness.
        </p>
      </footer>
    </div>
  );
}
