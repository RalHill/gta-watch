import { Suspense } from "react";
import ConfirmationClient from "./confirmation-client";

export default function ReportConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center text-text-main">
          Loading report...
        </div>
      }
    >
      <ConfirmationClient />
    </Suspense>
  );
}
