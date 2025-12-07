import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { RecentVerifications } from "@/components/dashboard/recent-verifications"
import { SystemMetrics } from "@/components/dashboard/system-metrics"
import { Navigation } from "@/components/navigation"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Dashboard Overview</h2>
            <p className="text-muted-foreground mt-1">
              Real-time monitoring of verification requests and system health
            </p>
          </div>

          <DashboardOverview />
          <div className="grid gap-6 lg:grid-cols-2">
            <RecentVerifications />
            <SystemMetrics />
          </div>
        </div>
      </main>
    </div>
  )
}
