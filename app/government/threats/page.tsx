"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function ThreatIntelligencePage() {
  const threats = [
    {
      id: "THR-2025-0089",
      type: "MOBILE_MONEY_FRAUD",
      severity: "CRITICAL",
      firstSeen: "2025-01-14",
      victims: 1240,
      financialLoss: "Le 248M",
      status: "ACTIVE",
      description: "Fake Orange Money SMS claiming account suspension",
    },
    {
      id: "THR-2025-0076",
      type: "GOVERNMENT_IMPERSONATION",
      severity: "HIGH",
      firstSeen: "2025-01-10",
      victims: 890,
      financialLoss: "Le 156M",
      status: "CONTAINED",
      description: "Scammers claiming to be from State House offering jobs",
    },
    {
      id: "THR-2025-0065",
      type: "HEALTH_MISINFORMATION",
      severity: "HIGH",
      firstSeen: "2025-01-08",
      victims: 3200,
      financialLoss: "N/A",
      status: "ACTIVE",
      description: "False claims about Ebola outbreak in Freetown",
    },
  ]

  return (
    <div className="container mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Threat Intelligence Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time threat detection, pattern analysis, and predictive intelligence
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">23</div>
            <p className="text-xs text-red-600">5 Critical, 18 High</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Victims (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8.4K</div>
            <p className="text-xs text-muted-foreground">Across all threat types</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Financial Loss (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Le 1.2B</div>
            <p className="text-xs text-red-600">Reported losses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Prediction Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">87%</div>
            <p className="text-xs text-green-600">AI threat detection</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>High-Priority Threats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {threats.map((threat) => (
            <div key={threat.id} className="rounded-lg border p-4">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Badge variant={threat.severity === "CRITICAL" ? "destructive" : "default"}>
                      {threat.severity}
                    </Badge>
                    <Badge variant="outline">{threat.status}</Badge>
                    <span className="text-xs text-muted-foreground">{threat.id}</span>
                  </div>
                  <h3 className="font-semibold">{threat.type.replace(/_/g, " ")}</h3>
                  <p className="text-sm text-muted-foreground">{threat.description}</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <p className="text-xs text-muted-foreground">First Detected</p>
                  <p className="font-medium">{threat.firstSeen}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Victims</p>
                  <p className="font-medium">{threat.victims.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Financial Loss</p>
                  <p className="font-medium">{threat.financialLoss}</p>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Emerging Threat Patterns</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border p-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-medium">SIM Swap Attacks</span>
                <Badge variant="destructive">RISING</Badge>
              </div>
              <p className="text-sm text-muted-foreground">+340% in last 7 days</p>
            </div>
            <div className="rounded-lg border p-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-medium">Fake Investment Schemes</span>
                <Badge variant="destructive">RISING</Badge>
              </div>
              <p className="text-sm text-muted-foreground">+125% in last 14 days</p>
            </div>
            <div className="rounded-lg border p-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-medium">Phishing Links</span>
                <Badge>STABLE</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Consistent pattern</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Threat Predictions (Next 7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border p-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-medium">Election Misinformation</span>
                <Badge variant="destructive">HIGH PROBABILITY</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Predicted: 2,300 potential cases</p>
            </div>
            <div className="rounded-lg border p-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-medium">Bank Fraud Spike</span>
                <Badge>MEDIUM PROBABILITY</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Predicted: 890 potential cases</p>
            </div>
            <div className="rounded-lg border p-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-medium">COVID Misinformation</span>
                <Badge variant="secondary">LOW PROBABILITY</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Predicted: 120 potential cases</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
