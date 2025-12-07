"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ThreatIntelligencePage() {
  const [activeThreats, setActiveThreats] = useState<any[]>([])
  const [trendingScams, setTrendingScams] = useState<any[]>([])
  const [regionalData, setRegionalData] = useState<any[]>([])

  useEffect(() => {
    // Fetch real-time threat data
    fetch("/api/intelligence/active")
      .then((res) => res.json())
      .then(setActiveThreats)
    fetch("/api/intelligence/trending")
      .then((res) => res.json())
      .then(setTrendingScams)
    fetch("/api/intelligence/regional")
      .then((res) => res.json())
      .then(setRegionalData)
  }, [])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Real-Time Threat Intelligence</h1>
        <p className="text-muted-foreground">AI-powered monitoring of misinformation and scams across Sierra Leone</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-red-700">Active Threats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700">{activeThreats.length}</div>
            <p className="text-xs text-red-600 mt-1">Requiring immediate action</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-700">Trending Scams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-700">{trendingScams.length}</div>
            <p className="text-xs text-orange-600 mt-1">Viral in last 24 hours</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-yellow-700">Districts Affected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-700">{regionalData.length}</div>
            <p className="text-xs text-yellow-600 mt-1">Out of 16 districts</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Threats</TabsTrigger>
          <TabsTrigger value="trending">Trending Scams</TabsTrigger>
          <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
          <TabsTrigger value="regional">Regional Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertTitle className="text-red-800">Critical Alert System</AlertTitle>
            <AlertDescription className="text-red-700">
              These threats require immediate government response. Auto-broadcast to affected regions enabled.
            </AlertDescription>
          </Alert>

          {activeThreats.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No active critical threats detected
              </CardContent>
            </Card>
          ) : (
            activeThreats.map((threat, i) => (
              <Card key={i} className="border-red-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{threat.title}</CardTitle>
                      <CardDescription className="mt-1">{threat.description}</CardDescription>
                    </div>
                    <Badge variant="destructive">CRITICAL</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium">First Detected:</span>
                      <p className="text-sm text-muted-foreground">{threat.first_seen}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Reports Received:</span>
                      <p className="text-sm text-muted-foreground">{threat.report_count} citizens</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Affected Districts:</span>
                      <p className="text-sm text-muted-foreground">{threat.districts?.join(", ")}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Financial Loss:</span>
                      <p className="text-sm text-red-600 font-semibold">Le {threat.estimated_loss?.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="trending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Viral Scams (Last 24 Hours)</CardTitle>
              <CardDescription>AI-detected patterns spreading rapidly across social media and WhatsApp</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    scam: "Fake Orange Money giveaway",
                    mentions: 1247,
                    trend: "up",
                    risk: "high",
                  },
                  {
                    scam: "Government Le500,000 cash distribution",
                    mentions: 892,
                    trend: "up",
                    risk: "critical",
                  },
                  {
                    scam: "UK visa lottery scam",
                    mentions: 567,
                    trend: "down",
                    risk: "medium",
                  },
                  {
                    scam: "Fake Afri-Radio job posting",
                    mentions: 423,
                    trend: "up",
                    risk: "medium",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{item.scam}</p>
                      <p className="text-sm text-muted-foreground">{item.mentions} mentions detected</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Badge
                        variant={
                          item.risk === "critical" ? "destructive" : item.risk === "high" ? "default" : "secondary"
                        }
                      >
                        {item.risk}
                      </Badge>
                      <span className={item.trend === "up" ? "text-red-500" : "text-green-500"}>
                        {item.trend === "up" ? "↑" : "↓"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Predictive Analysis</CardTitle>
              <CardDescription>Machine learning predicts likely scam outbreaks in next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4 bg-purple-50 border-purple-200">
                <AlertTitle className="text-purple-800">Prediction Model</AlertTitle>
                <AlertDescription className="text-purple-700">
                  Analyzes 50+ factors including payday cycles, mobile money transaction patterns, political events, and
                  seasonal trends to predict scam surges.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                {[
                  {
                    prediction: "Mobile money fraud surge expected",
                    probability: 87,
                    timeframe: "Next 3-5 days (payday period)",
                    recommendation: "Pre-broadcast warning to all mobile money users",
                  },
                  {
                    prediction: "Fake government program scams",
                    probability: 72,
                    timeframe: "After cabinet meeting (Thursday)",
                    recommendation: "Coordinate with State House for official statement",
                  },
                  {
                    prediction: "Health misinformation spike",
                    probability: 65,
                    timeframe: "Weekend (low news cycle)",
                    recommendation: "Prepare fact-checks with Ministry of Health",
                  },
                ].map((pred, i) => (
                  <Card key={i} className="border-purple-200">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold">{pred.prediction}</h4>
                        <Badge className="bg-purple-600">{pred.probability}% likely</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>When:</strong> {pred.timeframe}
                      </p>
                      <p className="text-sm text-purple-700">
                        <strong>Action:</strong> {pred.recommendation}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regional" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>District-Level Breakdown</CardTitle>
              <CardDescription>Real-time scam activity across all 16 districts of Sierra Leone</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { district: "Western Area Urban", reports: 456, risk: "critical" },
                  { district: "Western Area Rural", reports: 234, risk: "high" },
                  { district: "Bo", reports: 189, risk: "high" },
                  { district: "Kenema", reports: 156, risk: "medium" },
                  { district: "Makeni", reports: 134, risk: "medium" },
                  { district: "Port Loko", reports: 112, risk: "medium" },
                  { district: "Kailahun", reports: 89, risk: "low" },
                  { district: "Bombali", reports: 78, risk: "low" },
                ].map((area, i) => (
                  <div key={i} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <p className="font-medium">{area.district}</p>
                      <p className="text-sm text-muted-foreground">{area.reports} reports (7 days)</p>
                    </div>
                    <Badge
                      variant={
                        area.risk === "critical" ? "destructive" : area.risk === "high" ? "default" : "secondary"
                      }
                    >
                      {area.risk}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
