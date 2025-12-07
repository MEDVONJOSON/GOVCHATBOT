import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Download } from "lucide-react"

export default function VerificationsPage() {
  const verifications = [
    {
      id: "VER-20250615-123456",
      message: "Government giving Le500,000 to all citizens",
      verdict: "FALSE",
      confidence: 0.92,
      user: "23276XXXXXXX",
      timestamp: "2025-06-15 14:32:15",
      sources: 3,
    },
    {
      id: "VER-20250615-123457",
      message: "President Bio attended UN General Assembly",
      verdict: "TRUE",
      confidence: 0.95,
      user: "23277XXXXXXX",
      timestamp: "2025-06-15 14:28:03",
      sources: 5,
    },
    {
      id: "VER-20250615-123458",
      message: "New education policy starting next year",
      verdict: "UNVERIFIED",
      confidence: 0.55,
      user: "23278XXXXXXX",
      timestamp: "2025-06-15 14:15:42",
      sources: 1,
    },
  ]

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "TRUE":
        return "bg-green-500/10 text-green-600 border-green-500/20"
      case "FALSE":
        return "bg-red-500/10 text-red-600 border-red-500/20"
      case "UNVERIFIED":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
      case "MISLEADING":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20"
      default:
        return "bg-secondary"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">All Verifications</h2>
              <p className="text-muted-foreground mt-1">Complete history of claim verifications</p>
            </div>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search by verification ID, user phone, or message..." className="pl-10" />
                </div>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {verifications.map((verification) => (
                  <div
                    key={verification.id}
                    className="p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getVerdictColor(verification.verdict)}>
                            {verification.verdict}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {Math.round(verification.confidence * 100)}% confidence
                          </span>
                          <span className="text-sm text-muted-foreground">{verification.sources} sources</span>
                        </div>
                        <p className="text-sm font-medium">{verification.message}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>ID: {verification.id}</span>
                          <span>User: {verification.user}</span>
                          <span>{verification.timestamp}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
