import { Suspense } from "react";
import LocationClient from "./location-client";

export default function ReportLocationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center text-white">
          Loading...
        </div>
      }
    >
      <LocationClient />
    </Suspense>
  );
}
