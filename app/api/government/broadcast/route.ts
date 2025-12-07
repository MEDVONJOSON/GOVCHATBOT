import { NextResponse } from "next/server"
import { getDb } from "@/lib/db-operations"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, content, category, urgency, channels } = body

    const db = getDb()

    const broadcastId = `BCAST-${Date.now()}`
    const timestamp = new Date().toISOString()

    db.prepare(`
      INSERT INTO broadcasts (
        broadcast_id,
        title,
        content,
        category,
        urgency,
        channels,
        created_at,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(broadcastId, title, content, category, urgency, JSON.stringify(channels), timestamp, "SENT")

    const recipients = db
      .prepare(`
      SELECT COUNT(*) as count FROM users WHERE opted_in = 1
    `)
      .get() as { count: number }

    return NextResponse.json({
      success: true,
      broadcastId,
      recipients: recipients.count,
      timestamp,
      channels,
    })
  } catch (error) {
    console.error("[v0] Error creating broadcast:", error)
    return NextResponse.json({ error: "Failed to create broadcast" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const db = getDb()

    const broadcasts = db
      .prepare(`
      SELECT * FROM broadcasts
      ORDER BY created_at DESC
      LIMIT 50
    `)
      .all()

    return NextResponse.json({ broadcasts })
  } catch (error) {
    console.error("[v0] Error fetching broadcasts:", error)
    return NextResponse.json({ error: "Failed to fetch broadcasts" }, { status: 500 })
  }
}
