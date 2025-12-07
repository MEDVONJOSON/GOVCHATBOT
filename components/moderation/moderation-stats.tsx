"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ModerationStats() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Queue Depth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">12</div>
          <p className="text-xs text-green-600 mt-1">Within SLA target</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Avg Review Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">8.5m</div>
          <p className="text-xs text-muted-foreground mt-1">Target: 15m</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Today Reviewed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">147</div>
          <p className="text-xs text-muted-foreground mt-1">+23 from yesterday</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">SLA Compliance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">96%</div>
          <p className="text-xs text-green-600 mt-1">Above 95% target</p>
        </CardContent>
      </Card>
    </div>
  )
}
