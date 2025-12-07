"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function BroadcastPage() {
  const [message, setMessage] = useState("")
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([])
  const [urgencyLevel, setUrgencyLevel] = useState("normal")

  const districts = [
    "Western Area Urban",
    "Western Area Rural",
    "Bo",
    "Bonthe",
    "Bombali",
    "Kailahun",
    "Kambia",
    "Kenema",
    "Koinadugu",
    "Kono",
    "Moyamba",
    "Port Loko",
    "Pujehun",
    "Tonkolili",
    "Karene",
    "Falaba",
  ]

  const handleBroadcast = async () => {
    const response = await fetch("/api/government/broadcast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        districts: selectedDistricts.length === 0 ? "all" : selectedDistricts,
        urgency_level: urgencyLevel,
        timestamp: new Date().toISOString(),
      }),
    })

    if (response.ok) {
      alert("Broadcast sent successfully!")
      setMessage("")
      setSelectedDistricts([])
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Emergency Broadcast System</h1>
        <p className="text-muted-foreground">Send critical alerts to citizens via WhatsApp, SMS, and USSD instantly</p>
      </div>

      <Alert className="bg-red-50 border-red-200">
        <AlertTitle className="text-red-800">Authorized Personnel Only</AlertTitle>
        <AlertDescription className="text-red-700">
          This system broadcasts to millions of citizens. Only use for official government communications, emergencies,
          and public safety alerts. All broadcasts are logged and audited.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Potential Reach</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8.2M</div>
            <p className="text-xs text-muted-foreground">Citizens across all channels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Delivery Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">~30s</div>
            <p className="text-xs text-muted-foreground">Nationwide distribution</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Broadcasts Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compose Broadcast Message</CardTitle>
          <CardDescription>Message will be sent via WhatsApp, SMS, and USSD to selected regions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Urgency Level</Label>
            <div className="flex gap-2 mt-2">
              {[
                { value: "critical", label: "Critical", color: "bg-red-600" },
                { value: "urgent", label: "Urgent", color: "bg-orange-600" },
                { value: "normal", label: "Normal", color: "bg-blue-600" },
              ].map((level) => (
                <button
                  key={level.value}
                  onClick={() => setUrgencyLevel(level.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    urgencyLevel === level.value
                      ? `${level.color} text-white`
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Target Districts</Label>
            <div className="mt-2 max-h-48 overflow-y-auto border rounded-lg p-3 space-y-2">
              <div className="flex items-center space-x-2 font-medium mb-2">
                <Checkbox
                  checked={selectedDistricts.length === districts.length}
                  onCheckedChange={(checked) => {
                    setSelectedDistricts(checked ? districts : [])
                  }}
                />
                <label className="text-sm">All Districts (Nationwide)</label>
              </div>
              {districts.map((district) => (
                <div key={district} className="flex items-center space-x-2 ml-4">
                  <Checkbox
                    checked={selectedDistricts.includes(district)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedDistricts([...selectedDistricts, district])
                      } else {
                        setSelectedDistricts(selectedDistricts.filter((d) => d !== district))
                      }
                    }}
                  />
                  <label className="text-sm">{district}</label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Message Content</Label>
            <Textarea
              placeholder="Example: URGENT ALERT from Ministry of Health: No confirmed Ebola cases in Sierra Leone. Ignore false messages. For health concerns, call 117. - Official Government Message"
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">{message.length}/500 characters</p>
          </div>

          <Alert>
            <AlertTitle>Message Preview (WhatsApp)</AlertTitle>
            <AlertDescription className="mt-2 bg-white p-3 rounded border">
              <Badge variant={urgencyLevel === "critical" ? "destructive" : "default"} className="mb-2">
                {urgencyLevel.toUpperCase()}
              </Badge>
              <p className="text-sm whitespace-pre-wrap">{message || "(Your message will appear here)"}</p>
              <p className="text-xs text-muted-foreground mt-2">
                From: Sierra Leone Government via TECW
                <br />
                Sent to: {selectedDistricts.length === 0 ? "All 16 districts" : `${selectedDistricts.length} districts`}
              </p>
            </AlertDescription>
          </Alert>

          <Button
            onClick={handleBroadcast}
            disabled={!message || message.length < 20}
            size="lg"
            className={urgencyLevel === "critical" ? "bg-red-600 hover:bg-red-700" : ""}
          >
            Send Broadcast to{" "}
            {selectedDistricts.length === 0 ? "8.2M" : `${((selectedDistricts.length / 16) * 8.2).toFixed(1)}M`}{" "}
            Citizens
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Broadcasts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                message:
                  "Ministry of Health: No Ebola outbreak. Ignore false WhatsApp messages. For health concerns call 117.",
                sent_by: "Ministry of Health",
                timestamp: "2025-01-15 09:23 AM",
                reach: "8.2M citizens",
                urgency: "critical",
              },
              {
                message: "Bank of Sierra Leone: No government cash distribution program exists. Report scams to TECW.",
                sent_by: "Bank of Sierra Leone",
                timestamp: "2025-01-14 02:15 PM",
                reach: "8.2M citizens",
                urgency: "urgent",
              },
              {
                message: "NATCOM: Beware of fake mobile money messages. Never share your PIN. Report fraud to 7777.",
                sent_by: "NATCOM",
                timestamp: "2025-01-13 11:45 AM",
                reach: "8.2M citizens",
                urgency: "normal",
              },
            ].map((broadcast, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge variant={broadcast.urgency === "critical" ? "destructive" : "default"}>
                      {broadcast.urgency}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">{broadcast.sent_by}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{broadcast.timestamp}</p>
                </div>
                <p className="text-sm">{broadcast.message}</p>
                <p className="text-xs text-muted-foreground">Reached: {broadcast.reach}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
