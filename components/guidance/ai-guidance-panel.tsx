"use client";

import { useState } from "react";
import type { IncidentCategory } from "@/types";
import { X, Loader2, AlertCircle, Bot } from "lucide-react";

interface AIGuidancePanelProps {
  category: IncidentCategory;
  description?: string;
  latitude: number;
  longitude: number;
  onClose: () => void;
}

export default function AIGuidancePanel({
  category,
  description,
  latitude,
  longitude,
  onClose,
}: AIGuidancePanelProps) {
  const [guidance, setGuidance] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchGuidance = async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await fetch("/api/guidance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
          description,
          latitude,
          longitude,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch guidance");

      const data = await response.json();
      setGuidance(data.guidance);
    } catch (err) {
      console.error("Error fetching guidance:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface-light border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-main">AI Guidance</h2>
              <p className="text-xs text-muted uppercase tracking-wider">
                Live Analysis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close guidance panel"
          >
            <X className="w-5 h-5 text-text-main" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!guidance && !loading && !error && (
            <div className="text-center py-12">
              <Bot className="w-16 h-16 text-primary/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-main mb-2">
                Get AI-Powered Guidance
              </h3>
              <p className="text-sm text-muted mb-6 max-w-md mx-auto">
                Receive calm, structured advice on what to do next based on the
                incident category and location.
              </p>
              <button
                onClick={fetchGuidance}
                className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20"
              >
                Generate Guidance
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-12" aria-live="polite">
              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
              <p className="text-sm text-muted">
                Generating personalized guidance...
              </p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-danger mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-main mb-2">
                Unable to Generate Guidance
              </h3>
              <p className="text-sm text-muted mb-6">
                Please try again or call 911 if this is an emergency.
              </p>
              <button
                onClick={fetchGuidance}
                className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all"
              >
                Try Again
              </button>
            </div>
          )}

          {guidance && (
            <div
              className="prose prose-invert max-w-none"
              aria-live="polite"
              role="article"
            >
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 space-y-4">
                <div
                  className="text-sm text-text-main leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: guidance
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\n/g, "<br>"),
                  }}
                />
              </div>

              <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl">
                <p className="text-xs text-muted italic flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  This is AI-generated guidance. In a life-threatening
                  emergency, always call 911 immediately.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {guidance && (
          <div className="p-6 bg-white/5 border-t border-white/10 flex flex-col gap-3">
            <a
              href="tel:911"
              className="w-full h-14 bg-danger hover:bg-danger/90 active:scale-95 transition-all text-white rounded-xl shadow-lg shadow-danger/20 flex items-center justify-center gap-2 font-bold uppercase tracking-wide"
            >
              <span className="text-xl">📞</span>
              Call 911 Now
            </a>
            <button
              onClick={onClose}
              className="w-full h-12 bg-white/5 hover:bg-white/10 transition-all text-text-main rounded-xl font-semibold text-sm"
            >
              Close Guidance
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
