import Link from "next/link";
import TopNav from "@/components/shell/top-nav";

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-background text-text-main">
      <TopNav />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-surface/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted mt-2">
            In this portfolio demo, reports are submitted anonymously via the
            guided flow.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/report"
              className="px-5 py-3 rounded-xl bg-danger text-white font-bold hover:bg-danger/90 transition-colors text-center"
            >
              Report an Emergency
            </Link>
            <Link
              href="/incidents"
              className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-text-main font-bold hover:bg-white/10 transition-colors text-center"
            >
              View Incidents List
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

