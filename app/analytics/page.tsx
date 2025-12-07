import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, MessageSquare, AlertTriangle, CheckCircle } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Analytics & Insights</h2>
            <p className="text-muted-foreground mt-1">Comprehensive system performance and impact metrics</p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="impact">Impact</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Active Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12,547</div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 gap-1">
                        <TrendingUp className="h-3 w-3" />
                        +18.2%
                      </Badge>
                      <span className="text-xs text-muted-foreground">vs last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Verifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">100,532</div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 gap-1">
                        <TrendingUp className="h-3 w-3" />
                        +22.5%
                      </Badge>
                      <span className="text-xs text-muted-foreground">vs last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      False Claims Detected
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">35,421</div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20 gap-1">
                        <TrendingUp className="h-3 w-3" />
                        +12.3%
                      </Badge>
                      <span className="text-xs text-muted-foreground">misinformation rate</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Accuracy Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">92.4%</div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 gap-1">
                        <TrendingUp className="h-3 w-3" />
                        +1.2%
                      </Badge>
                      <span className="text-xs text-muted-foreground">verified by audits</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Misinformation Topics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { topic: "Government Financial Scams", count: 8234, percentage: 23.2 },
                        { topic: "Mobile Money Fraud", count: 6543, percentage: 18.5 },
                        { topic: "Health Misinformation", count: 4521, percentage: 12.8 },
                        { topic: "Fake Job Offers", count: 3876, percentage: 10.9 },
                        { topic: "Election Disinformation", count: 2847, percentage: 8.0 },
                      ].map((item, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{item.topic}</span>
                            <span className="text-muted-foreground">{item.count}</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-500"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Regional Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { region: "Western Area (Freetown)", users: 5234, percentage: 41.7 },
                        { region: "Northern Province", users: 2876, percentage: 22.9 },
                        { region: "Southern Province", users: 2345, percentage: 18.7 },
                        { region: "Eastern Province", users: 2092, percentage: 16.7 },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{item.region}</div>
                            <div className="text-xs text-muted-foreground mt-1">{item.users} active users</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">{item.percentage}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance">
              <Card>
                <CardHeader>
                  <CardTitle>System Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Average Response Time</div>
                      <div className="text-3xl font-bold">18.5s</div>
                      <div className="text-xs text-green-600">Target: &lt;30s</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Human Escalation Rate</div>
                      <div className="text-3xl font-bold">12.3%</div>
                      <div className="text-xs text-green-600">Target: &lt;15%</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">System Uptime</div>
                      <div className="text-3xl font-bold">99.8%</div>
                      <div className="text-xs text-green-600">Target: &gt;99.5%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="impact">
              <Card>
                <CardHeader>
                  <CardTitle>Social Impact Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                        <div className="text-sm text-green-600 mb-2">Prevented Financial Loss</div>
                        <div className="text-3xl font-bold text-green-600">Le 125M</div>
                        <div className="text-xs text-muted-foreground mt-2">
                          Estimated based on reported scam amounts
                        </div>
                      </div>
                      <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="text-sm text-blue-600 mb-2">Lives Protected</div>
                        <div className="text-3xl font-bold text-blue-600">45,000+</div>
                        <div className="text-xs text-muted-foreground mt-2">Users who avoided false health claims</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <div className="text-sm text-purple-600 mb-2">Cases Submitted to Authorities</div>
                        <div className="text-3xl font-bold text-purple-600">2,847</div>
                        <div className="text-xs text-muted-foreground mt-2">With complete evidence packages</div>
                      </div>
                      <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                        <div className="text-sm text-orange-600 mb-2">Community Reach</div>
                        <div className="text-3xl font-bold text-orange-600">78,000+</div>
                        <div className="text-xs text-muted-foreground mt-2">
                          People informed through verified alerts
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends">
              <Card>
                <CardHeader>
                  <CardTitle>Trend Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">Detailed trend analysis coming soon</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
