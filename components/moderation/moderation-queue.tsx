"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface QueueItem {
  id: string
  verificationId: string
  text: string
  userPhone: string
  confidence: number
  priority: "urgent" | "normal" | "low"
  timestamp: Date
}

export function ModerationQueue() {
  const [queue] = useState<QueueItem[]>([
    {
      id: "MOD-001",
      verificationId: "VER-20250615-005",
      text: "New education policy starting next year",
      userPhone: "+23276XXX890",
      confidence: 0.45,
      priority: "normal",
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
    },
    {
      id: "MOD-002",
      verificationId: "VER-20250615-007",
      text: "Hospital running out of medicine",
      userPhone: "+23277XXX234",
      confidence: 0.52,
      priority: "urgent",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
    },
  ])

  const handleApprove = (item: QueueItem) => {
    console.log("[v0] Approved:", item.id)
    alert(`Approved ${item.verificationId}`)
  }

  const handleReject = (item: QueueItem) => {
    console.log("[v0] Rejected:", item.id)
    alert(`Rejected ${item.verificationId}`)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "border-red-500 bg-red-50"
      case "normal":
        return "border-orange-500 bg-orange-50"
      default:
        return "border-gray-500 bg-gray-50"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Reviews ({queue.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {queue.map((item) => (
            <div key={item.id} className={`rounded-lg border-2 p-6 ${getPriorityColor(item.priority)}`}>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground">{item.verificationId}</span>
                    <span className="rounded-full bg-background px-3 py-1 text-xs font-medium uppercase">
                      {item.priority}
                    </span>
                  </div>
                  <p className="text-base font-medium text-foreground">{item.text}</p>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>User: {item.userPhone}</span>
                  <span>•</span>
                  <span>Confidence: {Math.round(item.confidence * 100)}%</span>
                  <span>•</span>
                  <span>{Math.floor((Date.now() - item.timestamp.getTime()) / 60000)} mins ago</span>
                </div>

                <div className="flex gap-3">
                  <Button onClick={() => handleApprove(item)} className="flex-1">
                    Approve as FALSE
                  </Button>
                  <Button onClick={() => handleApprove(item)} variant="outline" className="flex-1">
                    Approve as TRUE
                  </Button>
                  <Button onClick={() => handleReject(item)} variant="outline">
                    Needs More Info
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {queue.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">No items in queue. All caught up!</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
