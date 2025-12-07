import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Download, Eye } from "lucide-react"

export default function ReportsPage() {
  const reports = [
    {
      caseId: "SL-20250615-0042",
      type: "mobile_money_fraud",
      victim: "23276XXXXXXX",
      amount: 500000,
      status: "investigating",
      submitted: "2025-06-15 14:45:00",
      assignedTo: "Financial Crimes Unit",
      evidence: 3,
      priority: "high",
    },
    {
      caseId: "SL-20250615-0041",
      type: "fake_bank_message",
      victim: "23277XXXXXXX",
      amount: 200000,
      status: "resolved",
      submitted: "2025-06-15 12:30:00",
      assignedTo: "Bank of Sierra Leone",
      evidence: 2,
      priority: "medium",
    },
    {
      caseId: "SL-20250615-0040",
      type: "impersonation_scam",
      victim: "23278XXXXXXX",
      amount: 0,
      status: "open",
      submitted: "2025-06-15 10:15:00",
      assignedTo: "Cyber Crimes Unit",
      evidence: 4,
      priority: "low",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20"
      case "investigating":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
      case "resolved":
        return "bg-green-500/10 text-green-600 border-green-500/20"
      case "closed":
        return "bg-gray-500/10 text-gray-600 border-gray-500/20"
      default:
        return "bg-secondary"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-600 border-red-500/20"
      case "medium":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20"
      case "low":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20"
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
              <h2 className="text-2xl font-bold text-foreground">Scam Reports</h2>
              <p className="text-muted-foreground mt-1">User-submitted cybercrime and fraud reports</p>
            </div>
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Export Reports
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Open Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">342</div>
                <p className="text-xs text-muted-foreground mt-1">Awaiting investigation</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,156</div>
                <p className="text-xs text-muted-foreground mt-1">75.7% resolution rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Funds Recovered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Le 45M</div>
                <p className="text-xs text-muted-foreground mt-1">Total recovered</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search by case ID, victim phone, or type..." className="pl-10" />
                </div>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.caseId}
                    className="p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className={getStatusColor(report.status)}>
                            {report.status.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(report.priority)}>
                            {report.priority.toUpperCase()}
                          </Badge>
                          <span className="text-sm font-mono text-muted-foreground">{report.caseId}</span>
                        </div>

                        <div className="grid gap-2 md:grid-cols-2">
                          <div>
                            <span className="text-xs text-muted-foreground">Type:</span>
                            <p className="text-sm font-medium">{report.type.replace(/_/g, " ")}</p>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground">Amount Lost:</span>
                            <p className="text-sm font-medium">Le {report.amount.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground">Assigned To:</span>
                            <p className="text-sm font-medium">{report.assignedTo}</p>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground">Evidence:</span>
                            <p className="text-sm font-medium">{report.evidence} files</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Victim: {report.victim}</span>
                          <span>Submitted: {report.submitted}</span>
                        </div>
                      </div>

                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <Eye className="h-4 w-4" />
                        View
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
