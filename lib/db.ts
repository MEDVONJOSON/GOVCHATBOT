
// Mock database implementation to replace better-sqlite3
// This allows the project to run without native build dependencies

export function getDb() {
  return {
    prepare: (sql: string) => ({
      get: () => ({ count: 0, avg: 0 }),
      all: () => [],
      run: () => ({ changes: 1, lastInsertRowid: 1 }),
    }),
    exec: () => {},
    pragma: () => {},
  }
}

// Database operations with mock data
export const dbOperations = {
  // Get dashboard stats
  getStats: () => {
    return {
      totalVerifications: 1250,
      totalReports: 45,
      activeUsers: 320,
      avgResponseTime: 1.2,
      verdictDistribution: [
        { verdict: "TRUE", count: 450 },
        { verdict: "FALSE", count: 600 },
        { verdict: "UNVERIFIED", count: 200 },
      ],
    }
  },

  // Get recent verifications
  getRecentVerifications: (limit = 10) => {
    return [
      {
        verification_id: "v1",
        user_phone: "+232 77 123456",
        content_text: "Is the government distributing free rice?",
        verdict: "FALSE",
        confidence: 0.95,
        reasoning: "No official announcement found.",
        matched_sources: "[]",
        created_at: new Date().toISOString(),
      },
      {
        verification_id: "v2",
        user_phone: "+232 88 654321",
        content_text: "Election date confirmed for June 24",
        verdict: "TRUE",
        confidence: 0.98,
        reasoning: "Confirmed by NEC press release.",
        matched_sources: "[]",
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
    ]
  },

  // Create new verification
  createVerification: (data: any) => {
    console.log("[MockDB] Creating verification:", data)
    return { changes: 1, lastInsertRowid: Date.now() }
  },

  // Create new case
  createCase: (data: any) => {
    console.log("[MockDB] Creating case:", data)
    return { changes: 1, lastInsertRowid: Date.now() }
  },

  // Get moderation queue
  getModerationQueue: () => {
    return []
  },

  // Record metric
  recordMetric: (name: string, value: number) => {
    console.log("[MockDB] Recording metric:", name, value)
    return { changes: 1 }
  },
}
