import { NextResponse } from "next/server"

export async function GET() {
  const regional = [
    { district: "Western Area Urban", reports: 456, risk_level: "critical" },
    { district: "Western Area Rural", reports: 234, risk_level: "high" },
    { district: "Bo", reports: 189, risk_level: "high" },
    { district: "Kenema", reports: 156, risk_level: "medium" },
    { district: "Makeni", reports: 134, risk_level: "medium" },
    { district: "Port Loko", reports: 112, risk_level: "medium" },
    { district: "Kailahun", reports: 89, risk_level: "low" },
    { district: "Bombali", reports: 78, risk_level: "low" },
  ]

  return NextResponse.json(regional)
}
