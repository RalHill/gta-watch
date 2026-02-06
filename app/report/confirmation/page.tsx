"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, CheckCircle2, Loader2, MapPin, Phone } from "lucide-react";
import type { IncidentCategory } from "@/types";
import { supabase } from "@/lib/supabase/client";
import AIGuidancePanel from "@/components/guidance/ai-guidance-panel";
import { findNearbyEmergencyServices } from "@/lib/geoapify";
import type { EmergencyService } from "@/types";

export const dynamic = 'force-dynamic';

export default function ReportConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") as IncidentCategory | null;
  const description = searchParams.get("description") || undefined;
  const latitude = parseFloat(searchParams.get("latitude") || "0");
  const longitude = parseFloat(searchParams.get("longitude") || "0");
  const locationLabel = searchParams.get("location_label") || "";

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [showGuidance, setShowGuidance] = useState(false);
  const [emergencyServices, setEmergencyServices] = useState<
    EmergencyService[]
  >([]);
  const [loadingServices, setLoadingServices] = useState(false);

  useEffect(() => {
    if (!category || !latitude || !longitude) {
      router.push("/report");
      return;
    }

    // Auto-submit on mount
    handleSubmit();
  }, [category, latitude, longitude]);

  const handleSubmit = async () => {
    if (submitting || submitted) return;

    setSubmitting(true);
    setError(false);

    try {
      const { error: insertError } = await supabase
        .from("incidents")
        .insert([
          {
            category: category!,
            description: description || null,
            latitude,
            longitude,
            location_label: locationLabel,
          },
        ]);

      if (insertError) throw insertError;

      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting incident:", err);
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFindServices = async () => {
    setLoadingServices(true);
    try {
      const services = await findNearbyEmergencyServices(latitude, longitude);
      setEmergencyServices(services);
    } catch (err) {
      console.error("Error finding services:", err);
    } finally {
      setLoadingServices(false);
    }
  };

  if (!category || !latitude || !longitude) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation */}
      <header className="flex items-center justify-between border-b border-white/10 px-6 md:px-10 py-3 bg-surface/95 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-4 text-text-main">
          <div className="size-6 text-primary">
            <ShieldAlert className="w-full h-full" />
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-tight">
            GTA Watch
          </h2>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center py-12 px-6">
        <div className="w-full max-w-[640px] flex flex-col gap-8">
          {/* Submitting State */}
          {submitting && (
            <div className="text-center py-12">
              <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
              <h1 className="text-text-main text-2xl font-bold mb-2">
                Submitting Report...
              </h1>
              <p className="text-muted">
                Your anonymous incident report is being processed.
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-danger/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-danger"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h1 className="text-text-main text-2xl font-bold mb-2">
                Submission Failed
              </h1>
              <p className="text-muted mb-6">
                Unable to submit your report. Please try again.
              </p>
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all"
              >
                Retry Submission
              </button>
            </div>
          )}

          {/* Success State */}
          {submitted && !submitting && (
            <>
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12 text-success" />
                </div>
                <h1 className="text-text-main text-3xl font-bold mb-3">
                  Report Submitted
                </h1>
                <p className="text-muted text-lg">
                  Your anonymous incident report has been successfully submitted
                  to the GTA Watch community.
                </p>
              </div>

              {/* Incident Summary */}
              <div className="p-6 bg-surface border border-white/10 rounded-xl">
                <h2 className="text-lg font-bold text-text-main mb-4">
                  Incident Summary
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-muted text-sm w-24">Category:</span>
                    <span className="text-text-main font-semibold capitalize">
                      {category}
                    </span>
                  </div>
                  {description && (
                    <div className="flex items-start gap-3">
                      <span className="text-muted text-sm w-24">
                        Description:
                      </span>
                      <span className="text-text-main">{description}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <span className="text-muted text-sm w-24">Location:</span>
                    <span className="text-text-main">{locationLabel}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setShowGuidance(true)}
                  className="h-16 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3"
                >
                  <span className="text-xl">🤖</span>
                  What Should I Do Next?
                </button>
                <button
                  onClick={handleFindServices}
                  disabled={loadingServices}
                  className="h-16 bg-white/10 hover:bg-white/20 text-text-main font-bold rounded-xl transition-all flex items-center justify-center gap-3 border border-white/10 disabled:opacity-50"
                >
                  {loadingServices ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <MapPin className="w-5 h-5" />
                      Find Nearby Services
                    </>
                  )}
                </button>
              </div>

              {/* Emergency Services List */}
              {emergencyServices.length > 0 && (
                <div className="p-6 bg-surface border border-white/10 rounded-xl">
                  <h2 className="text-lg font-bold text-text-main mb-4">
                    Nearby Emergency Services
                  </h2>
                  <div className="space-y-3">
                    {emergencyServices.slice(0, 5).map((service, index) => (
                      <div
                        key={index}
                        className="p-4 bg-white/5 border border-white/5 rounded-lg hover:border-primary/30 transition-all"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-bold text-text-main">
                                {service.name}
                              </span>
                              <span
                                className={`text-xs px-2 py-0.5 rounded ${
                                  service.type === "hospital"
                                    ? "bg-warning/10 text-warning"
                                    : service.type === "police"
                                    ? "bg-primary/10 text-primary"
                                    : "bg-danger/10 text-danger"
                                }`}
                              >
                                {service.type}
                              </span>
                            </div>
                            <p className="text-xs text-muted">
                              {service.address}
                            </p>
                            <p className="text-xs text-muted mt-1">
                              {(service.distance / 1000).toFixed(1)} km away
                            </p>
                          </div>
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${service.latitude},${service.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 bg-primary/20 hover:bg-primary hover:text-white text-primary text-xs font-bold rounded-lg transition-all"
                          >
                            Directions
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Emergency Call Button */}
              <a
                href="tel:911"
                className="w-full h-16 bg-danger hover:bg-danger/90 active:scale-95 transition-all text-white rounded-xl shadow-lg shadow-danger/20 flex items-center justify-center gap-3 font-black uppercase tracking-wide text-lg"
              >
                <Phone className="w-6 h-6" />
                Call 911 Now
              </a>

              {/* Back to Dashboard */}
              <Link
                href="/"
                className="w-full h-12 bg-white/5 hover:bg-white/10 transition-all text-text-main rounded-xl font-semibold text-sm flex items-center justify-center"
              >
                Return to Dashboard
              </Link>
            </>
          )}
        </div>
      </main>

      {/* AI Guidance Panel */}
      {showGuidance && (
        <AIGuidancePanel
          category={category}
          description={description}
          latitude={latitude}
          longitude={longitude}
          onClose={() => setShowGuidance(false)}
        />
      )}
    </div>
  );
}
