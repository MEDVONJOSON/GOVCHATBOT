const mysql = require("mysql2/promise")

// MySQL connection pool configuration
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "tecw_db",
  charset: "utf8mb4",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
})

// Handle pool errors to prevent crashes
pool.on('error', (err) => {
  console.error('[v0] MySQL pool error:', err.message)
})

// Test connection
async function testConnection() {
  try {
    const connection = await pool.getConnection()
    console.log("[v0] MySQL connected successfully")
    connection.release()
  } catch (error) {
    console.error("[v0] MySQL connection failed:", error.message)
  }
}

testConnection()

// Database query helper functions
const db = {
  // Execute query with parameters
  async query(sql, params = []) {
    try {
      const [rows] = await pool.execute(sql, params)
      return rows
    } catch (error) {
      console.error("[v0] MySQL query error:", error.message)
      throw error
    }
  },

  // Get single row
  async queryOne(sql, params = []) {
    const rows = await this.query(sql, params)
    return rows.length > 0 ? rows[0] : null
  },

  // Insert and return inserted ID
  async insert(table, data) {
    const columns = Object.keys(data).join(", ")
    const placeholders = Object.keys(data)
      .map(() => "?")
      .join(", ")
    const values = Object.values(data)

    const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`
    const result = await this.query(sql, values)
    return result.insertId
  },

  // Update records
  async update(table, data, where, whereParams = []) {
    const setClauses = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ")
    const values = [...Object.values(data), ...whereParams]

    const sql = `UPDATE ${table} SET ${setClauses} WHERE ${where}`
    const result = await this.query(sql, values)
    return result.affectedRows
  },

  // Verifications
  async createVerification(data) {
    return await this.insert("verifications", {
      whatsapp_user_id: data.user_phone,
      message_content: data.content.text || JSON.stringify(data.content),
      verdict: data.verdict,
      confidence: data.confidence,
      reasoning: JSON.stringify(data.reasoning || []),
      evidence_hash: data.evidence_hash,
      processed_at: new Date(),
    })
  },

  async getRecentVerifications(limit = 10) {
    const sql = `
      SELECT id, whatsapp_user_id as user_phone, message_content, 
             verdict, confidence, reasoning, processed_at as timestamp
      FROM verifications 
      ORDER BY processed_at DESC 
      LIMIT ?
    `
    const rows = await this.query(sql, [limit])
    return rows.map((row) => ({
      ...row,
      reasoning: JSON.parse(row.reasoning || "[]"),
    }))
  },

  // Scam reports
  async createReport(data) {
    return await this.insert("scam_reports", {
      case_id: data.case_id,
      category: data.incident.type,
      risk_score: data.risk_score || 50,
      description: data.incident.description,
      evidence_url: data.evidence_url || null,
      status: "open",
    })
  },

  async getReportByCaseId(caseId) {
    const sql = `SELECT * FROM scam_reports WHERE case_id = ?`
    return await this.queryOne(sql, [caseId])
  },

  // Moderation queue
  async addToModerationQueue(verificationId) {
    return await this.insert("moderation_queue", {
      verification_id: verificationId,
      status: "pending",
    })
  },

  async getModerationQueue() {
    const sql = `
      SELECT mq.*, v.message_content, v.verdict, v.confidence
      FROM moderation_queue mq
      JOIN verifications v ON mq.verification_id = v.id
      WHERE mq.status = 'pending'
      ORDER BY mq.created_at ASC
    `
    return await this.query(sql)
  },

  // System metrics
  async getSystemMetrics() {
    const sql = `SELECT metric_name, metric_value FROM system_metrics`
    const rows = await this.query(sql)

    const metrics = {}
    rows.forEach((row) => {
      metrics[row.metric_name] = Number.parseFloat(row.metric_value)
    })

    return {
      totalVerifications: metrics.total_verifications || 0,
      totalReports: metrics.total_reports || 0,
      activeUsers: metrics.active_users || 0,
      queueDepth: metrics.queue_depth || 0,
      accuracyRate: metrics.accuracy_rate || 0,
      avgResponseTime: metrics.avg_response_time || 0,
    }
  },

  async updateSystemMetrics() {
    await this.query("CALL update_system_metrics()")
  },

  // API logging
  async logApiRequest(endpoint, ip, statusCode, responseTime) {
    return await this.insert("api_logs", {
      endpoint,
      ip,
      status_code: statusCode,
      response_time_ms: responseTime,
    })
  },
}

module.exports = { pool, db }
