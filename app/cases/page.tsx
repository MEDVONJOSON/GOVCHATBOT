import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, TrendingUp, TrendingDown, Minus } from "lucide-react"

export default function CasesPage() {
  const casesByAgency = [
    { agency: "Financial Crimes Unit", open: 89, investigating: 45, resolved: 234, total: 368 },
    { agency: "Cyber Crimes Unit", open: 56, investigating: 32, resolved: 189, total: 277 },
    { agency: "Bank of Sierra Leone", open: 34, investigating: 21, resolved: 145, total: 200 },
    { agency: "NATCOM", open: 23, investigating: 12, resolved: 98, total: 133 },
  ]

  const casesByType = [
    { type: "Mobile Money Fraud", count: 1523, trend: "up", change: "+15%" },
    { type: "Fake Bank Message", count: 678, trend: "up", change: "+8%" },
    { type: "Impersonation Scam", count: 445, trend: "down", change: "-3%" },
    { type: "Fake Job/Lottery", count: 201, trend: "stable", change: "0%" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Case Management</h2>
              <p className="text-muted-foreground mt-1">Track and manage cases across all agencies</p>
            </div>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="by-agency">By Agency</TabsTrigger>
              <TabsTrigger value="by-type">By Type</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Cases</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">978</div>
                    <p className="text-xs text-muted-foreground mt-1">All time</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Open</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">202</div>
                    <p className="text-xs text-muted-foreground mt-1">Awaiting action</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Investigating</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">110</div>
                    <p className="text-xs text-muted-foreground mt-1">In progress</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">666</div>
                    <p className="text-xs text-muted-foreground mt-1">68.1% rate</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Case Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-sm font-medium">SL-20250615-00{40 + i}</span>
                            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600">
                              Investigating
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Financial Crimes Unit - Mobile Money Fraud</p>
                        </div>
                        <span className="text-xs text-muted-foreground">2h ago</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="by-agency" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cases by Agency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {casesByAgency.map((agency) => (
                      <div key={agency.agency} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{agency.agency}</span>
                          <span className="text-sm text-muted-foreground">{agency.total} total</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="p-2 bg-blue-500/10 rounded-lg text-center">
                            <div className="text-lg font-bold text-blue-600">{agency.open}</div>
                            <div className="text-xs text-muted-foreground">Open</div>
                          </div>
                          <div className="p-2 bg-yellow-500/10 rounded-lg text-center">
                            <div className="text-lg font-bold text-yellow-600">{agency.investigating}</div>
                            <div className="text-xs text-muted-foreground">Investigating</div>
                          </div>
                          <div className="p-2 bg-green-500/10 rounded-lg text-center">
                            <div className="text-lg font-bold text-green-600">{agency.resolved}</div>
                            <div className="text-xs text-muted-foreground">Resolved</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="by-type" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cases by Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {casesByType.map((item) => (
                      <div
                        key={item.type}
                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{item.type}</span>
                            <div className="flex items-center gap-1 text-sm">
                              {item.trend === "up" && <TrendingUp className="h-4 w-4 text-red-500" />}
                              {item.trend === "down" && <TrendingDown className="h-4 w-4 text-green-500" />}
                              {item.trend === "stable" && <Minus className="h-4 w-4 text-gray-500" />}
                              <span
                                className={
                                  item.trend === "up"
                                    ? "text-red-500"
                                    : item.trend === "down"
                                      ? "text-green-500"
                                      : "text-gray-500"
                                }
                              >
                                {item.change}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{item.count}</div>
                          <div className="text-xs text-muted-foreground">cases</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Case Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">Timeline visualization coming soon</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
