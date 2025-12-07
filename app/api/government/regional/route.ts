import { NextResponse } from "next/server"
import { getDb } from "@/lib/db-operations"

export async function GET() {
  try {
    const db = getDb()

    const districts = [
      { name: "Western Area Urban", population: 1050000 },
      { name: "Western Area Rural", population: 442951 },
      { name: "Bo", population: 575478 },
      { name: "Kenema", population: 609873 },
      { name: "Port Loko", population: 614063 },
      { name: "Bombali", population: 606544 },
      { name: "Tonkolili", population: 531435 },
      { name: "Kailahun", population: 525372 },
      { name: "Kono", population: 505767 },
      { name: "Moyamba", population: 318064 },
      { name: "Pujehun", population: 346461 },
      { name: "Kambia", population: 345474 },
      { name: "Koinadugu", population: 408097 },
      { name: "Bonthe", population: 168729 },
      { name: "Falaba", population: 204130 },
      { name: "Karene", population: 281285 },
    ]

    const districtsWithStats = districts.map((district) => {
      const stats = db
        .prepare(`
        SELECT COUNT(*) as threats
        FROM threats t
        WHERE json_extract(t.affected_regions, '$') LIKE ?
        AND status = 'ACTIVE'
      `)
        .get(`%${district.name}%`) as { threats: number }

      const threatCount = stats.threats || 0
      let risk = "LOW"
      if (threatCount > 20) risk = "HIGH"
      else if (threatCount > 10) risk = "MEDIUM"

      return {
        ...district,
        threats: threatCount,
        risk,
      }
    })

    return NextResponse.json({ districts: districtsWithStats })
  } catch (error) {
    console.error("[v0] Error fetching regional data:", error)
    return NextResponse.json({ error: "Failed to fetch regional data" }, { status: 500 })
  }
}
