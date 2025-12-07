"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function LegalCompliancePage() {
  const cases = [
    {
      caseId: "LEGAL-2025-0034",
      suspect: "John Doe (alias)",
      charges: "Cyber Fraud, Impersonation",
      amount: "Le 45M",
      victims: 67,
      status: "PROSECUTION",
      court: "High Court Freetown",
      nextHearing: "2025-02-10",
    },
    {
      caseId: "LEGAL-2025-0028",
      suspect: "Jane Smith (alias)",
      charges: "Mobile Money Fraud",
      amount: "Le 23M",
      victims: 34,
      status: "INVESTIGATION",
      court: "N/A",
      nextHearing: "N/A",
    },
  ]

  return (
    <div className="container mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Legislative Compliance & Prosecution</h1>
        <p className="text-muted-foreground">Track cybercrime cases from investigation to prosecution</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Prosecutions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">In court system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Under Investigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">34</div>
            <p className="text-xs text-yellow-600">Evidence gathering</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Convictions (2025)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <p className="text-xs text-green-600">Successful prosecutions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Assets Recovered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Le 167M</div>
            <p className="text-xs text-muted-foreground">Returned to victims</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Legal Cases</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cases.map((legalCase) => (
            <div key={legalCase.caseId} className="rounded-lg border p-4">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Badge>{legalCase.status}</Badge>
                    <span className="text-xs text-muted-foreground">{legalCase.caseId}</span>
                  </div>
                  <h3 className="font-semibold">{legalCase.suspect}</h3>
                  <p className="text-sm text-muted-foreground">{legalCase.charges}</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-5">
                <div>
                  <p className="text-xs text-muted-foreground">Amount Involved</p>
                  <p className="font-medium">{legalCase.amount}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Victims</p>
                  <p className="font-medium">{legalCase.victims}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Court</p>
                  <p className="font-medium">{legalCase.court}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Next Hearing</p>
                  <p className="font-medium">{legalCase.nextHearing}</p>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    View File
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
            <CardTitle>Evidence Chain of Custody</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border p-3">
              <p className="font-medium">Digital Evidence Items</p>
              <p className="text-2xl font-bold">456</p>
              <p className="text-xs text-muted-foreground">All SHA-256 hashed and timestamped</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="font-medium">Chain Integrity</p>
              <p className="text-2xl font-bold text-green-600">100%</p>
              <p className="text-xs text-muted-foreground">No tampering detected</p>
            </div>
            <Button variant="outline" className="w-full bg-transparent">
              Generate Evidence Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cybercrime Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Average Case Duration</span>
              <span className="font-semibold">89 days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Prosecution Success Rate</span>
              <span className="font-semibold text-green-600">67%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Assets Recovery Rate</span>
              <span className="font-semibold">34%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Pending Warrants</span>
              <span className="font-semibold">23</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
