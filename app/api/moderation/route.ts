import { NextResponse } from "next/server"
import { getModerationQueue } from "@/lib/db-operations"

export async function GET() {
  try {
    const queue = await getModerationQueue()

    return NextResponse.json(queue)
  } catch (error) {
    console.error("[v0] Error fetching moderation queue:", error)
    return NextResponse.json({ error: "Failed to fetch moderation queue" }, { status: 500 })
  }
}
