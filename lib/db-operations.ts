import { dbOperations, getDb as getDatabase } from "./db"

export { getDatabase as getDb }

// Get recent verifications
export async function getRecentVerifications(limit = 10) {
  try {
    return dbOperations.getRecentVerifications(limit)
  } catch (error) {
    console.error("[v0] Error fetching verifications:", error)
    return []
  }
}

// Get system metrics
export async function getSystemMetrics() {
  try {
    return dbOperations.getStats()
  } catch (error) {
    console.error("[v0] Error fetching metrics:", error)
    return {
      totalVerifications: 0,
      totalReports: 0,
      activeUsers: 0,
      avgResponseTime: 0,
      verdictDistribution: [],
    }
  }
}

// Create verification record
export async function createVerification(verification: {
  verification_id: string
  user_phone: string
  message_text: string
  message_type: string
  verdict: string
  confidence: number
  reasoning: any
  sources: any
}) {
  try {
    return dbOperations.createVerification({
      verification_id: verification.verification_id,
      user_phone: verification.user_phone,
      content_type: verification.message_type,
      content_text: verification.message_text,
      verdict: verification.verdict,
      confidence: verification.confidence,
      reasoning: JSON.stringify(verification.reasoning),
      matched_sources: JSON.stringify(verification.sources),
    })
  } catch (error) {
    console.error("[v0] Error creating verification:", error)
    throw error
  }
}

// Create report
export async function createReport(report: {
  case_id: string
  victim_phone: string
  incident_type: string
  description: string
  amount_lost?: number
  evidence?: any
}) {
  try {
    return dbOperations.createCase({
      case_id: report.case_id,
      victim_phone: report.victim_phone,
      incident_type: report.incident_type,
      incident_date: new Date().toISOString().split("T")[0],
      description: report.description,
      financial_loss_amount: report.amount_lost || 0,
    })
  } catch (error) {
    console.error("[v0] Error creating report:", error)
    throw error
  }
}

// Get moderation queue
export async function getModerationQueue() {
  try {
    return dbOperations.getModerationQueue()
  } catch (error) {
    console.error("[v0] Error fetching moderation queue:", error)
    return []
  }
}

// Update metric
export async function incrementMetric(metricName: string) {
  try {
    dbOperations.recordMetric(metricName, 1)
    return 1
  } catch (error) {
    console.error("[v0] Error incrementing metric:", error)
    return 0
  }
}
