"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function InterAgencyPage() {
  const agencies = [
    {
      name: "Sierra Leone Police - Financial Crimes",
      status: "ONLINE",
      cases: 234,
      pending: 45,
      resolved: 189,
      contact: "+232-76-XXX-XXX",
    },
    {
      name: "NATCOM (Telecommunications Regulator)",
      status: "ONLINE",
      cases: 189,
      pending: 23,
      resolved: 166,
      contact: "+232-78-XXX-XXX",
    },
    {
      name: "Ministry of Information",
      status: "ONLINE",
      cases: 156,
      pending: 12,
      resolved: 144,
      contact: "+232-77-XXX-XXX",
    },
    {
      name: "Ministry of Health",
      status: "ONLINE",
      cases: 98,
      pending: 8,
      resolved: 90,
      contact: "+232-76-XXX-XXX",
    },
    {
      name: "Bank of Sierra Leone",
      status: "ONLINE",
      cases: 67,
      pending: 15,
      resolved: 52,
      contact: "+232-22-XXX-XXX",
    },
    {
      name: "Office of National Security",
      status: "ONLINE",
      cases: 45,
      pending: 5,
      resolved: 40,
      contact: "+232-76-XXX-XXX",
    },
  ]

  return (
    <div className="container mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Inter-Agency Coordination Hub</h1>
        <p className="text-muted-foreground">Real-time collaboration between government agencies</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Agencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">6</div>
            <p className="text-xs text-green-600">All systems online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Collaborations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Multi-agency cases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Response SLA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">94%</div>
            <p className="text-xs text-green-600">Within 4 hours</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {agencies.map((agency, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{agency.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{agency.contact}</p>
                </div>
                <Badge variant={agency.status === "ONLINE" ? "default" : "destructive"}>{agency.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Cases</p>
                  <p className="text-2xl font-bold">{agency.cases}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{agency.pending}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">{agency.resolved}</p>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    View Cases
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Case Routing Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="font-medium">Mobile Money Fraud</p>
              <p className="text-sm text-muted-foreground">Auto-route to Police + NATCOM + Bank</p>
            </div>
            <Badge>Active</Badge>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="font-medium">Health Misinformation</p>
              <p className="text-sm text-muted-foreground">Auto-route to Ministry of Health + Info</p>
            </div>
            <Badge>Active</Badge>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="font-medium">Government Impersonation</p>
              <p className="text-sm text-muted-foreground">Auto-route to Police + National Security</p>
            </div>
            <Badge>Active</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
