import { Suspense } from "react";
import DescriptionClient from "./description-client";

export default function ReportDescriptionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#111818] flex items-center justify-center text-white">
          Loading...
        </div>
      }
    >
      <DescriptionClient />
    </Suspense>
  );
}
