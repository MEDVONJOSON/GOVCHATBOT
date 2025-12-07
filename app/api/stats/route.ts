import { NextResponse } from "next/server"
import { getSystemMetrics } from "@/lib/db-operations"

export async function GET() {
  try {
    const metrics = await getSystemMetrics()

    return NextResponse.json({
      totalVerifications: metrics.totalVerifications || 0,
      totalReports: metrics.totalReports || 0,
      activeUsers: metrics.activeUsers || 0,
      avgResponseTime: metrics.avgResponseTime || 0,
      verdictDistribution: metrics.verdictDistribution || [],
    })
  } catch (error) {
    console.error("[v0] Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
