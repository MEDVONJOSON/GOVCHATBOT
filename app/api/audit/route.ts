import { NextResponse } from "next/server"
import { getDb } from "@/lib/db-operations"

export async function GET() {
  try {
    const db = getDb()

    const logs = db
      .prepare(`
      SELECT * FROM audit_logs 
      ORDER BY created_at DESC 
      LIMIT 100
    `)
      .all()

    return NextResponse.json({ logs })
  } catch (error) {
    console.error("[v0] Audit log fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { action, user, target, details } = await request.json()

    const db = getDb()
    const logId = `AUDIT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    db.prepare(`
      INSERT INTO audit_logs (log_id, action, user, target, details, created_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `).run(logId, action, user, target, JSON.stringify(details))

    return NextResponse.json({ success: true, logId })
  } catch (error) {
    console.error("[v0] Audit log creation error:", error)
    return NextResponse.json({ error: "Failed to create audit log" }, { status: 500 })
  }
}
