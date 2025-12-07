import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db-operations"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, userPhone, language = "en" } = body

    // Validate input
    if (!content || !userPhone) {
      return NextResponse.json({ error: "Missing required fields: content and userPhone" }, { status: 400 })
    }

    // AI Verification Engine
    const verificationResult = await performAIVerification(content, language)

    // Store in database
    const db = getDb()
    const verificationId = `VER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    db.prepare(`
      INSERT INTO verifications (
        verification_id, user_phone, message_content, verdict, 
        confidence, reasoning, matched_sources, language, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).run(
      verificationId,
      userPhone,
      content,
      verificationResult.verdict,
      verificationResult.confidence,
      JSON.stringify(verificationResult.reasoning),
      JSON.stringify(verificationResult.sources),
      language,
    )

    // Update stats
    db.prepare(`
      UPDATE system_stats 
      SET total_verifications = total_verifications + 1,
          verifications_today = verifications_today + 1
      WHERE id = 1
    `).run()

    return NextResponse.json({
      verificationId,
      ...verificationResult,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Verification error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}

async function performAIVerification(content: string, language: string) {
  const strategies = [
    detectFinancialScam(content),
    detectHealthMisinformation(content),
    detectGovernmentImpersonation(content),
    detectUrgencyManipulation(content),
    checkTrustedSources(content),
  ]

  const results = await Promise.all(strategies)
  const aggregatedScore = calculateAggregatedConfidence(results)

  // Determine verdict based on confidence thresholds
  let verdict = "UNVERIFIED"
  if (aggregatedScore >= 0.85) {
    verdict = results.some((r) => r.indicator === "scam") ? "FALSE" : "TRUE"
  } else if (aggregatedScore >= 0.7) {
    verdict = "MISLEADING"
  }

  return {
    verdict,
    confidence: aggregatedScore,
    reasoning: results.flatMap((r) => r.reasons).slice(0, 5),
    sources: results.flatMap((r) => r.sources).slice(0, 3),
    detectedPatterns: results.map((r) => r.pattern).filter(Boolean),
    riskLevel: calculateRiskLevel(aggregatedScore, verdict),
  }
}

// Detection strategies
function detectFinancialScam(content: string) {
  const scamKeywords = [
    "le500,000",
    "le500000",
    "free money",
    "government giving",
    "click link",
    "register now",
    "limited time",
    "send money",
    "orange money",
    "account suspended",
    "verify account",
  ]

  const foundKeywords = scamKeywords.filter((keyword) => content.toLowerCase().includes(keyword.toLowerCase()))

  if (foundKeywords.length >= 2) {
    return {
      indicator: "scam",
      pattern: "financial_fraud",
      confidence: Math.min(0.95, 0.6 + foundKeywords.length * 0.1),
      reasons: [
        `Detected ${foundKeywords.length} scam indicators: ${foundKeywords.slice(0, 3).join(", ")}`,
        "Matches known mobile money fraud patterns",
      ],
      sources: [
        {
          title: "NATCOM Consumer Alert Database",
          url: "https://natcom.gov.sl/alerts",
          authority: 0.95,
        },
      ],
    }
  }

  return {
    indicator: "clean",
    pattern: null,
    confidence: 0.3,
    reasons: [],
    sources: [],
  }
}

function detectHealthMisinformation(content: string) {
  const healthKeywords = [
    "ebola",
    "outbreak",
    "virus",
    "pandemic",
    "cure",
    "vaccine",
    "world health",
    "ministry of health",
    "disease",
  ]

  const foundKeywords = healthKeywords.filter((keyword) => content.toLowerCase().includes(keyword.toLowerCase()))

  if (foundKeywords.length >= 1) {
    // Health claims require verification from WHO or Ministry of Health
    return {
      indicator: "requires_verification",
      pattern: "health_claim",
      confidence: 0.5, // Always require human review for health claims
      reasons: ["Health-related claim detected", "Requires verification from Ministry of Health or WHO"],
      sources: [
        {
          title: "WHO Sierra Leone",
          url: "https://who.int/sierra-leone",
          authority: 1.0,
        },
      ],
    }
  }

  return {
    indicator: "clean",
    pattern: null,
    confidence: 0.3,
    reasons: [],
    sources: [],
  }
}

function detectGovernmentImpersonation(content: string) {
  const govKeywords = [
    "government",
    "president bio",
    "state house",
    "minister",
    "natcom",
    "police",
    "official",
    "directive",
  ]

  const urgencyWords = ["immediately", "urgent", "deadline", "must", "required"]

  const hasGovKeyword = govKeywords.some((keyword) => content.toLowerCase().includes(keyword.toLowerCase()))
  const hasUrgency = urgencyWords.some((word) => content.toLowerCase().includes(word.toLowerCase()))

  if (hasGovKeyword && hasUrgency) {
    return {
      indicator: "suspicious",
      pattern: "government_impersonation",
      confidence: 0.75,
      reasons: [
        "Claims to be from government with urgency language",
        "Government communications rarely use urgent/threatening tone",
      ],
      sources: [
        {
          title: "State House Official Press Releases",
          url: "https://statehouse.gov.sl",
          authority: 1.0,
        },
      ],
    }
  }

  return {
    indicator: "clean",
    pattern: null,
    confidence: 0.3,
    reasons: [],
    sources: [],
  }
}

function detectUrgencyManipulation(content: string) {
  const urgencyPhrases = [
    "act now",
    "limited time",
    "expires",
    "hurry",
    "last chance",
    "immediately",
    "within 24 hours",
    "today only",
    "dont miss",
  ]

  const foundPhrases = urgencyPhrases.filter((phrase) => content.toLowerCase().includes(phrase.toLowerCase()))

  if (foundPhrases.length >= 2) {
    return {
      indicator: "manipulation",
      pattern: "urgency_scam",
      confidence: 0.8,
      reasons: [
        `Uses ${foundPhrases.length} urgency manipulation tactics`,
        "Legitimate organizations rarely pressure for immediate action",
      ],
      sources: [],
    }
  }

  return {
    indicator: "clean",
    pattern: null,
    confidence: 0.3,
    reasons: [],
    sources: [],
  }
}

function checkTrustedSources(content: string) {
  // Simulate checking against trusted source database
  const trustedDomains = ["statehouse.gov.sl", "who.int", "natcom.gov.sl", "slbc.sl"]

  // Check if any trusted domain is mentioned
  const hasTrustedSource = trustedDomains.some((domain) => content.toLowerCase().includes(domain))

  if (hasTrustedSource) {
    return {
      indicator: "verified",
      pattern: "trusted_source",
      confidence: 0.9,
      reasons: ["Message references trusted government or official source"],
      sources: [
        {
          title: "Official Government Source",
          url: trustedDomains.find((d) => content.toLowerCase().includes(d)) || "",
          authority: 1.0,
        },
      ],
    }
  }

  return {
    indicator: "unknown",
    pattern: null,
    confidence: 0.4,
    reasons: [],
    sources: [],
  }
}

function calculateAggregatedConfidence(results: any[]) {
  // Weight different detection strategies
  const weights = {
    scam: 0.3,
    manipulation: 0.25,
    suspicious: 0.25,
    verified: 0.2,
  }

  let totalScore = 0
  let totalWeight = 0

  results.forEach((result) => {
    const weight = weights[result.indicator as keyof typeof weights] || 0.1
    totalScore += result.confidence * weight
    totalWeight += weight
  })

  return totalWeight > 0 ? totalScore / totalWeight : 0.5
}

function calculateRiskLevel(confidence: number, verdict: string) {
  if (verdict === "FALSE" && confidence >= 0.85) return "HIGH"
  if (verdict === "MISLEADING" && confidence >= 0.7) return "MEDIUM"
  if (verdict === "UNVERIFIED") return "UNKNOWN"
  return "LOW"
}
