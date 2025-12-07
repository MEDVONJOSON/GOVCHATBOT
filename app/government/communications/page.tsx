"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

export default function PublicCommunicationsPage() {
  const [statements, setStatements] = useState([
    {
      id: 1,
      title: "False Ebola Claims Debunked",
      content: "The Ministry of Health confirms no Ebola outbreak in Freetown...",
      date: "2025-01-15",
      views: 45000,
      status: "PUBLISHED",
    },
    {
      id: 2,
      title: "Mobile Money Fraud Alert",
      content: "Citizens should ignore messages claiming government cash handouts...",
      date: "2025-01-14",
      views: 67000,
      status: "PUBLISHED",
    },
  ])

  return (
    <div className="container mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Public Communication Hub</h1>
        <p className="text-muted-foreground">Issue official statements and corrections to combat misinformation</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Published Statements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2.1M</div>
            <p className="text-xs text-muted-foreground">Citizens informed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Average Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">45m</div>
            <p className="text-xs text-green-600">From detection to statement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pending Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Issue New Official Statement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Statement Title</label>
            <Input placeholder="E.g., Clarification on Tax Policy" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Statement Content</label>
            <Textarea placeholder="Write the official government statement here..." className="min-h-32" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Category</label>
              <select className="w-full rounded-md border p-2">
                <option>Health</option>
                <option>Financial</option>
                <option>Security</option>
                <option>General</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Urgency</label>
              <select className="w-full rounded-md border p-2">
                <option>CRITICAL</option>
                <option>HIGH</option>
                <option>MEDIUM</option>
                <option>LOW</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1">Publish Immediately</Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Save Draft
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Official Statements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {statements.map((statement) => (
            <div key={statement.id} className="rounded-lg border p-4">
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{statement.title}</h3>
                  <p className="text-sm text-muted-foreground">{statement.date}</p>
                </div>
                <Badge>{statement.status}</Badge>
              </div>
              <p className="mb-3 text-sm">{statement.content}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{statement.views.toLocaleString()} views</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Rebroadcast
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
