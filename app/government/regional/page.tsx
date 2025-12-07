"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function RegionalIntelligencePage() {
  const districts = [
    { name: "Western Area Urban", population: 1050000, threats: 23, risk: "HIGH" },
    { name: "Western Area Rural", population: 442951, threats: 12, risk: "MEDIUM" },
    { name: "Bo", population: 575478, threats: 8, risk: "MEDIUM" },
    { name: "Kenema", population: 609873, threats: 6, risk: "LOW" },
    { name: "Port Loko", population: 614063, threats: 9, risk: "MEDIUM" },
    { name: "Bombali", population: 606544, threats: 5, risk: "LOW" },
    { name: "Tonkolili", population: 531435, threats: 4, risk: "LOW" },
    { name: "Kailahun", population: 525372, threats: 3, risk: "LOW" },
    { name: "Kono", population: 505767, threats: 7, risk: "MEDIUM" },
    { name: "Moyamba", population: 318064, threats: 2, risk: "LOW" },
    { name: "Pujehun", population: 346461, threats: 1, risk: "LOW" },
    { name: "Kambia", population: 345474, threats: 5, risk: "LOW" },
    { name: "Koinadugu", population: 408097, threats: 2, risk: "LOW" },
    { name: "Bonthe", population: 168729, threats: 1, risk: "LOW" },
    { name: "Falaba", population: 204130, threats: 3, risk: "LOW" },
    { name: "Karene", population: 281285, threats: 4, risk: "LOW" },
  ]

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "HIGH":
        return "destructive"
      case "MEDIUM":
        return "default"
      default:
        return "secondary"
    }
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Regional Intelligence Dashboard</h1>
        <p className="text-muted-foreground">Monitor threats and scams across all 16 districts of Sierra Leone</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">High Risk Districts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1</div>
            <p className="text-xs text-red-600">Requires immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Medium Risk Districts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4</div>
            <p className="text-xs text-yellow-600">Under monitoring</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">95</div>
            <p className="text-xs text-muted-foreground">Across all districts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Population Covered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8.0M</div>
            <p className="text-xs text-green-600">Full national coverage</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>District-by-District Threat Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {districts.map((district, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{district.name}</h3>
                    <Badge variant={getRiskColor(district.risk)}>{district.risk} RISK</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Population: {district.population.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{district.threats}</p>
                  <p className="text-xs text-muted-foreground">Active threats</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Threat Types by Region</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Mobile Money Fraud</span>
              <span className="font-semibold">Western Area (67%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Land Dispute Scams</span>
              <span className="font-semibold">Bo, Kenema (45%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Mining Fraud</span>
              <span className="font-semibold">Kono (78%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Health Misinformation</span>
              <span className="font-semibold">Nationwide (23%)</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Regional Response Teams</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Western Area Team</span>
              <Badge variant="default">12 Officers</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Southern Province Team</span>
              <Badge variant="default">8 Officers</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Eastern Province Team</span>
              <Badge variant="default">6 Officers</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Northern Province Team</span>
              <Badge variant="default">7 Officers</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
