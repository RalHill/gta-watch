import Link from "next/link";
import TopNav from "@/components/shell/top-nav";

export default function AlertsPage() {
  return (
    <div className="min-h-screen bg-background text-text-main">
      <TopNav />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-surface/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
          <h1 className="text-2xl font-bold">Alerts</h1>
          <p className="text-muted mt-2">
            This demo focuses on anonymous incident reporting and map
            awareness. Alerts feed is a placeholder screen to keep navigation
            functional.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="px-5 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors text-center"
            >
              Back to Dashboard
            </Link>
            <a
              href="https://www.toronto.ca/community-people/public-safety-alerts/"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-text-main font-bold hover:bg-white/10 transition-colors text-center"
            >
              View Official City Alerts
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

