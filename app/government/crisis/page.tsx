"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

export default function CrisisResponsePage() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      level: "CRITICAL",
      title: "Mobile Money Fraud Spike",
      description: "400% increase in fake Orange Money messages in Western Area",
      timestamp: "2025-01-15 14:32",
      affected: "Western Area Urban, Western Area Rural",
      status: "ACTIVE",
    },
    {
      id: 2,
      level: "HIGH",
      title: "Health Misinformation",
      description: "False Ebola outbreak claims circulating on WhatsApp",
      timestamp: "2025-01-14 09:15",
      affected: "Nationwide",
      status: "CONTAINED",
    },
  ])

  return (
    <div className="container mx-auto max-w-7xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">National Crisis Response Center</h1>
          <p className="text-muted-foreground">Emergency broadcast and rapid response system</p>
        </div>
        <Button size="lg" className="bg-red-600 hover:bg-red-700">
          Issue National Alert
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-xs text-red-600">2 Critical, 1 High</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Citizens Affected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">45.2K</div>
            <p className="text-xs text-muted-foreground">Last 48 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8m</div>
            <p className="text-xs text-green-600">Under target</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Agencies Coordinating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Active now</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active National Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start gap-4 rounded-lg border p-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={alert.level === "CRITICAL" ? "destructive" : "default"}>{alert.level}</Badge>
                  <Badge variant="outline">{alert.status}</Badge>
                  <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                </div>
                <h3 className="font-semibold">{alert.title}</h3>
                <p className="text-sm text-muted-foreground">{alert.description}</p>
                <p className="text-xs">
                  <span className="font-medium">Affected Regions:</span> {alert.affected}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Broadcast
                </Button>
                <Button variant="outline" size="sm">
                  Update
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Emergency Broadcast Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full justify-start bg-transparent" variant="outline">
            WhatsApp Broadcast - 250K subscribers
          </Button>
          <Button className="w-full justify-start bg-transparent" variant="outline">
            SMS Alert - All mobile networks
          </Button>
          <Button className="w-full justify-start bg-transparent" variant="outline">
            Radio Announcement - SLBC Network
          </Button>
          <Button className="w-full justify-start bg-transparent" variant="outline">
            Social Media - Official Government Channels
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
