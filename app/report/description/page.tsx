"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, Info, EyeOff } from "lucide-react";
import type { IncidentCategory } from "@/types";

export default function ReportDescriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category") as IncidentCategory | null;

  const [description, setDescription] = useState("");
  const MAX_LENGTH = 200;

  useEffect(() => {
    if (!category) {
      router.push("/report");
    }
  }, [category, router]);

  const handleNext = () => {
    if (category) {
      const params = new URLSearchParams();
      params.set("category", category);
      if (description.trim()) {
        params.set("description", description.trim());
      }
      router.push(`/report/location?${params.toString()}`);
    }
  };

  const handleSkip = () => {
    if (category) {
      router.push(`/report/location?category=${category}`);
    }
  };

  if (!category) return null;

  return (
    <div className="min-h-screen bg-[#111818] text-text-main flex flex-col">
      {/* Top Navigation */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-white/10 px-6 md:px-10 py-3 bg-[#111818]/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-4 text-text-main">
          <div className="size-6 text-primary">
            <span className="material-symbols-outlined text-3xl">security</span>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-tight">
            GTA Watch
          </h2>
        </Link>
        <nav className="hidden md:flex items-center gap-9">
          <Link
            href="/"
            className="text-sm font-medium leading-normal hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            href="/"
            className="text-sm font-medium leading-normal hover:text-primary transition-colors"
          >
            Map
          </Link>
          <Link
            href="/"
            className="text-sm font-medium leading-normal hover:text-primary transition-colors"
          >
            Alerts
          </Link>
          <Link
            href="/report"
            className="text-sm font-medium leading-normal hover:text-primary transition-colors"
          >
            Report
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <button className="hidden md:flex min-w-[84px] items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em]">
            <span className="truncate">Profile</span>
          </button>
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-white/10 bg-white/10" />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center py-12 px-6">
        <div className="w-full max-w-[640px] flex flex-col gap-8">
          {/* Progress Stepper */}
          <div className="flex flex-col gap-3">
            <div className="flex gap-6 justify-between items-end">
              <div>
                <span className="text-primary text-xs font-bold uppercase tracking-wider">
                  Step 2 of 4
                </span>
                <p className="text-text-main text-base font-semibold leading-normal">
                  Reporting Progress
                </p>
              </div>
              <p className="text-muted text-sm font-medium">50% Complete</p>
            </div>
            <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: "50%" }}
              ></div>
            </div>
          </div>

          {/* Content Header */}
          <div className="flex flex-col gap-3">
            <h1 className="text-text-main text-4xl font-black leading-tight tracking-tight">
              Add a Description
            </h1>
            <p className="text-muted text-lg font-normal leading-relaxed">
              Briefly describe the situation in Toronto. This helps responders
              and the community understand the urgency of the incident.
            </p>
          </div>

          {/* Input Section */}
          <div className="flex flex-col gap-2">
            <label className="flex flex-col w-full">
              <span className="text-text-main text-sm font-bold uppercase tracking-wide pb-3">
                Incident Context
              </span>
              <div className="relative">
                <textarea
                  className="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-xl text-text-main focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-white/10 bg-[#1c2727] placeholder:text-muted min-h-[180px] p-5 text-lg font-normal leading-relaxed shadow-sm"
                  maxLength={MAX_LENGTH}
                  placeholder="e.g., Heavy smoke visible from the third floor near Dundas Square..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </label>
            <div className="flex justify-between items-center px-1">
              <p className="text-muted text-sm font-medium flex items-center gap-1">
                <Info className="w-4 h-4" />
                Keep it concise and factual
              </p>
              <p className="text-muted text-sm font-bold tabular-nums">
                {description.length} / {MAX_LENGTH} characters
              </p>
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <button
              onClick={handleNext}
              className="flex-1 w-full sm:w-auto min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-6 bg-primary text-white text-lg font-bold leading-normal tracking-wide shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
            >
              Next Step
            </button>
            <button
              onClick={handleSkip}
              className="flex-1 w-full sm:w-auto min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-6 border-2 border-white/10 text-text-main text-lg font-bold leading-normal hover:bg-white/5 transition-all"
            >
              Skip
            </button>
          </div>

          {/* Footer Note */}
          <div className="p-6 bg-surface rounded-xl border border-white/10 flex gap-4 items-start mt-4">
            <EyeOff className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-bold text-text-main">
                Reporting is anonymous
              </p>
              <p className="text-xs text-muted leading-normal">
                Your personal information is never shared with the public. This
                description will be used to alert nearby users and emergency
                services.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
