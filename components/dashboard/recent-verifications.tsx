"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import useSWR from "swr"

interface Verification {
  id: number
  verification_id: string
  message_text: string
  verdict: "TRUE" | "FALSE" | "MISLEADING" | "UNVERIFIED"
  confidence: number
  created_at: string
  user_phone: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function RecentVerifications() {
  const { data: verifications, isLoading } = useSWR<Verification[]>("/api/verifications", fetcher, {
    refreshInterval: 5000, // Refresh every 5 seconds
    fallbackData: [],
  })

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "TRUE":
        return "text-green-600 bg-green-50 border-green-200"
      case "FALSE":
        return "text-red-600 bg-red-50 border-red-200"
      case "MISLEADING":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "UNVERIFIED":
        return "text-gray-600 bg-gray-50 border-gray-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case "TRUE":
        return "✓"
      case "FALSE":
        return "✗"
      case "MISLEADING":
        return "!"
      case "UNVERIFIED":
        return "?"
      default:
        return "?"
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Verifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-muted"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Verifications</CardTitle>
      </CardHeader>
      <CardContent>
        {verifications && verifications.length > 0 ? (
          <div className="space-y-4">
            {verifications.map((verification) => (
              <div
                key={verification.id}
                className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      {verification.message_text || "No message text"}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{verification.verification_id}</span>
                      <span>•</span>
                      <span>{verification.user_phone}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(verification.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${getVerdictColor(verification.verdict)}`}
                    >
                      <span>{getVerdictIcon(verification.verdict)}</span>
                      <span>{verification.verdict}</span>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(verification.confidence * 100)}% confident
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <p>No verifications yet</p>
            <p className="text-sm mt-1">Waiting for incoming messages...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
