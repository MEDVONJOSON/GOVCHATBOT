import { NextResponse } from "next/server"
import { getDb } from "@/lib/db-operations"

export async function GET() {
  try {
    const db = getDb()

    const agencies = [
      {
        id: 1,
        name: "Sierra Leone Police - Financial Crimes",
        status: "ONLINE",
        contact: "+232-76-XXX-XXX",
      },
      {
        id: 2,
        name: "NATCOM",
        status: "ONLINE",
        contact: "+232-78-XXX-XXX",
      },
      {
        id: 3,
        name: "Ministry of Information",
        status: "ONLINE",
        contact: "+232-77-XXX-XXX",
      },
      {
        id: 4,
        name: "Ministry of Health",
        status: "ONLINE",
        contact: "+232-76-XXX-XXX",
      },
      {
        id: 5,
        name: "Bank of Sierra Leone",
        status: "ONLINE",
        contact: "+232-22-XXX-XXX",
      },
      {
        id: 6,
        name: "Office of National Security",
        status: "ONLINE",
        contact: "+232-76-XXX-XXX",
      },
    ]

    const agenciesWithStats = agencies.map((agency) => {
      const stats = db
        .prepare(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as resolved
        FROM cases
        WHERE assigned_agency = ?
      `)
        .get(agency.name) as { total: number; pending: number; resolved: number }

      return {
        ...agency,
        cases: stats.total || 0,
        pending: stats.pending || 0,
        resolved: stats.resolved || 0,
      }
    })

    return NextResponse.json({ agencies: agenciesWithStats })
  } catch (error) {
    console.error("[v0] Error fetching agencies:", error)
    return NextResponse.json({ error: "Failed to fetch agencies" }, { status: 500 })
  }
}
