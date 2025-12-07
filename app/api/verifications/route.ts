import { NextResponse } from "next/server"
import { getRecentVerifications } from "@/lib/db-operations"

export async function GET() {
  try {
    const verifications = await getRecentVerifications(10)

    return NextResponse.json(verifications)
  } catch (error) {
    console.error("[v0] Error fetching verifications:", error)
    return NextResponse.json({ error: "Failed to fetch verifications" }, { status: 500 })
  }
}
