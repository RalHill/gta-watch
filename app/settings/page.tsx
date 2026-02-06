import TopNav from "@/components/shell/top-nav";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background text-text-main">
      <TopNav />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-surface/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted mt-2">
            No accounts. No tracking. Settings are intentionally minimal in this
            demo.
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <p className="text-sm font-bold">Map Style</p>
              <p className="text-xs text-muted mt-1">
                Use the layers button on the dashboard to toggle map styling.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <p className="text-sm font-bold">Incident Window</p>
              <p className="text-xs text-muted mt-1">
                Incidents are limited to the last 24 hours (enforced by RLS).
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

