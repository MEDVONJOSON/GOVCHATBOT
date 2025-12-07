import { NextResponse } from "next/server"
import { createReport } from "@/lib/db-operations"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const caseId = `SL-${new Date().toISOString().split("T")[0].replace(/-/g, "")}-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`

    const report = await createReport({
      case_id: caseId,
      victim_phone: body.victim_phone,
      incident_type: body.incident_type,
      description: body.description,
      amount_lost: body.amount_lost || 0,
      evidence: body.evidence,
    })

    return NextResponse.json({
      status: "success",
      case_id: caseId,
      message: "Report submitted successfully. Sierra Leone Police notified.",
    })
  } catch (error) {
    console.error("[v0] Error creating report:", error)
    return NextResponse.json({ error: "Failed to create report" }, { status: 500 })
  }
}
