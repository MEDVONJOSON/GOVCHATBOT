"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

export function SystemMetrics() {
  const [latencyData] = useState([
    { time: "00:00", p50: 12, p95: 28, p99: 45 },
    { time: "04:00", p50: 10, p95: 25, p99: 42 },
    { time: "08:00", p50: 15, p95: 32, p99: 55 },
    { time: "12:00", p50: 18, p95: 38, p99: 62 },
    { time: "16:00", p50: 20, p95: 42, p99: 68 },
    { time: "20:00", p50: 16, p95: 35, p99: 58 },
  ])

  const [verdictData] = useState([
    { verdict: "FALSE", count: 35421, color: "bg-red-500" },
    { verdict: "TRUE", count: 28901, color: "bg-green-500" },
    { verdict: "UNVERIFIED", count: 23854, color: "bg-yellow-500" },
    { verdict: "MISLEADING", count: 12356, color: "bg-orange-500" },
  ])

  const maxCount = Math.max(...verdictData.map((d) => d.count))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Response Time (24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-end justify-between gap-2 h-48">
              {latencyData.map((data, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative w-full flex items-end justify-center gap-1 h-full">
                    <div
                      className="w-2 bg-primary rounded-t"
                      style={{ height: `${(data.p50 / 70) * 100}%` }}
                      title={`p50: ${data.p50}s`}
                    />
                    <div
                      className="w-2 bg-chart-2 rounded-t"
                      style={{ height: `${(data.p95 / 70) * 100}%` }}
                      title={`p95: ${data.p95}s`}
                    />
                    <div
                      className="w-2 bg-chart-3 rounded-t"
                      style={{ height: `${(data.p99 / 70) * 100}%` }}
                      title={`p99: ${data.p99}s`}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{data.time}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-primary" />
                <span>p50</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-chart-2" />
                <span>p95</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-chart-3" />
                <span>p99</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verdict Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {verdictData.map((data, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{data.verdict}</span>
                  <span className="text-muted-foreground">{data.count.toLocaleString()}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full ${data.color} transition-all duration-500`}
                    style={{ width: `${(data.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
