import { ModerationQueue } from "@/components/moderation/moderation-queue"
import { ModerationStats } from "@/components/moderation/moderation-stats"
import { Navigation } from "@/components/navigation"

export default function ModerationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">Moderation Dashboard</h2>
          <p className="text-muted-foreground mt-1">Review and moderate flagged verifications</p>
        </div>

        <div className="space-y-8">
          <ModerationStats />
          <ModerationQueue />
        </div>
      </main>
    </div>
  )
}
