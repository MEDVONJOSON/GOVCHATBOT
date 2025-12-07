import { NextResponse } from "next/server"

export async function GET() {
  // Real-time threat detection would query database
  // For now, return example data structure

  const threats = [
    {
      id: "THREAT-001",
      title: "Fake Orange Money Le1M Giveaway Scam",
      description:
        "Viral WhatsApp message claiming Orange is giving Le1,000,000 to random customers. Links to phishing site collecting personal data and mobile money PINs.",
      first_seen: "2025-01-15 08:23 AM",
      report_count: 1247,
      districts: ["Western Area Urban", "Western Area Rural", "Bo", "Kenema"],
      estimated_loss: 45600000, // Le 45.6M
      threat_level: "CRITICAL",
      victim_count: 342,
      spreading_rate: "Very Fast",
    },
    {
      id: "THREAT-002",
      title: "Government Le500K Cash Distribution Fraud",
      description:
        "False claim that government is distributing Le500,000 to all citizens. Requires 'registration fee' of Le50,000 to be sent via mobile money.",
      first_seen: "2025-01-14 02:15 PM",
      report_count: 892,
      districts: ["Western Area Urban", "Port Loko", "Makeni"],
      estimated_loss: 34200000, // Le 34.2M
      threat_level: "CRITICAL",
      victim_count: 178,
      spreading_rate: "Fast",
    },
  ]

  return NextResponse.json(threats)
}
