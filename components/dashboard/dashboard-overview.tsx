"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import useSWR from "swr"

interface Stats {
  totalVerifications: number
  totalReports: number
  activeUsers: number
  verificationsToday: number
  reportsToday: number
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function DashboardOverview() {
  const { data: stats, isLoading } = useSWR<Stats>("/api/stats", fetcher, {
    refreshInterval: 10000, // Refresh every 10 seconds
    fallbackData: {
      totalVerifications: 0,
      totalReports: 0,
      activeUsers: 0,
      verificationsToday: 0,
      reportsToday: 0,
    },
  })

  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 w-32 animate-pulse rounded bg-muted"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Verifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">{stats.totalVerifications.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">All time</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Reports Submitted</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">{stats.totalReports.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">All time</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">{stats.activeUsers.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">Registered users</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Today's Verifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">{stats.verificationsToday.toLocaleString()}</div>
          <p className="text-xs text-green-600 mt-1">Live tracking</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Today's Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">{stats.reportsToday.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-green-500"></span>
            <span className="text-2xl font-bold text-foreground">Online</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
        </CardContent>
      </Card>
    </div>
  )
}
