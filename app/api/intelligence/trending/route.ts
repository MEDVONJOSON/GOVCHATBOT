import { NextResponse } from "next/server"

export async function GET() {
  const trending = [
    {
      scam_type: "Fake Orange Money giveaway",
      mentions: 1247,
      trend: "up",
      risk_level: "high",
      change_24h: "+234%",
    },
    {
      scam_type: "Government cash distribution",
      mentions: 892,
      trend: "up",
      risk_level: "critical",
      change_24h: "+156%",
    },
    {
      scam_type: "UK visa lottery scam",
      mentions: 567,
      trend: "down",
      risk_level: "medium",
      change_24h: "-23%",
    },
    {
      scam_type: "Fake job posting",
      mentions: 423,
      trend: "up",
      risk_level: "medium",
      change_24h: "+89%",
    },
  ]

  return NextResponse.json(trending)
}
