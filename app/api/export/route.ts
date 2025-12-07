import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db-operations"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "verifications"
    const format = searchParams.get("format") || "csv"
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const db = getDb()
    let data: any[] = []
    let filename = ""

    if (type === "verifications") {
      let query = `SELECT * FROM verifications WHERE 1=1`
      const params: any[] = []

      if (startDate) {
        query += ` AND created_at >= ?`
        params.push(startDate)
      }
      if (endDate) {
        query += ` AND created_at <= ?`
        params.push(endDate)
      }

      query += ` ORDER BY created_at DESC LIMIT 10000`
      data = db.prepare(query).all(...params)
      filename = `verifications_export_${Date.now()}.csv`
    } else if (type === "reports") {
      let query = `SELECT * FROM scam_reports WHERE 1=1`
      const params: any[] = []

      if (startDate) {
        query += ` AND created_at >= ?`
        params.push(startDate)
      }
      if (endDate) {
        query += ` AND created_at <= ?`
        params.push(endDate)
      }

      query += ` ORDER BY created_at DESC LIMIT 10000`
      data = db.prepare(query).all(...params)
      filename = `reports_export_${Date.now()}.csv`
    }

    if (format === "csv") {
      const csv = convertToCSV(data)

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      })
    } else {
      // JSON export
      return NextResponse.json(data, {
        headers: {
          "Content-Disposition": `attachment; filename="${filename.replace(".csv", ".json")}"`,
        },
      })
    }
  } catch (error) {
    console.error("[v0] Export error:", error)
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return ""

  const headers = Object.keys(data[0])
  const rows = data.map((row) =>
    headers
      .map((header) => {
        const value = row[header]
        // Escape quotes and wrap in quotes if contains comma
        if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      })
      .join(","),
  )

  return [headers.join(","), ...rows].join("\n")
}
