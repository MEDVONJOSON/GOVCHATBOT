import { NextResponse } from "next/server"
import { getDb } from "@/lib/db-operations"

export async function GET() {
  try {
    const db = getDb()

    const threats = db
      .prepare(`
      SELECT 
        threat_id,
        type,
        severity,
        first_seen,
        victim_count,
        financial_loss,
        status,
        description
      FROM threats
      WHERE status = 'ACTIVE' OR status = 'CONTAINED'
      ORDER BY 
        CASE severity 
          WHEN 'CRITICAL' THEN 1 
          WHEN 'HIGH' THEN 2 
          WHEN 'MEDIUM' THEN 3 
          ELSE 4 
        END,
        first_seen DESC
      LIMIT 50
    `)
      .all()

    const stats = db
      .prepare(`
      SELECT 
        COUNT(*) as total_threats,
        SUM(CASE WHEN severity = 'CRITICAL' THEN 1 ELSE 0 END) as critical,
        SUM(CASE WHEN severity = 'HIGH' THEN 1 ELSE 0 END) as high,
        SUM(victim_count) as total_victims,
        SUM(financial_loss) as total_loss
      FROM threats
      WHERE status = 'ACTIVE'
    `)
      .get() as {
      total_threats: number
      critical: number
      high: number
      total_victims: number
      total_loss: number
    }

    return NextResponse.json({
      threats,
      stats: {
        activeThreats: stats.total_threats || 0,
        critical: stats.critical || 0,
        high: stats.high || 0,
        totalVictims: stats.total_victims || 0,
        totalLoss: stats.total_loss || 0,
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching threats:", error)
    return NextResponse.json({ error: "Failed to fetch threats" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, severity, description, affectedRegions } = body

    const db = getDb()

    const threatId = `THR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`
    const timestamp = new Date().toISOString()

    db.prepare(`
      INSERT INTO threats (
        threat_id,
        type,
        severity,
        first_seen,
        victim_count,
        financial_loss,
        status,
        description,
        affected_regions
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(threatId, type, severity, timestamp, 0, 0, "ACTIVE", description, JSON.stringify(affectedRegions))

    return NextResponse.json({
      success: true,
      threatId,
      timestamp,
    })
  } catch (error) {
    console.error("[v0] Error creating threat:", error)
    return NextResponse.json({ error: "Failed to create threat" }, { status: 500 })
  }
}
