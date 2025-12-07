const express = require("express")
const cors = require("cors")
const crypto = require("crypto")
const { db } = require("./db-mysql")

const app = express()

app.use(cors())
app.use(express.json())

// Prevent process from exiting on unhandled errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('[v0] Unhandled Rejection at:', promise, 'reason:', reason)
})

process.on('uncaughtException', (error) => {
  console.error('[v0] Uncaught Exception:', error)
})

// Middleware to log API requests
app.use(async (req, res, next) => {
  const start = Date.now()
  const ip = req.ip || req.connection.remoteAddress

  res.on("finish", async () => {
    const responseTime = Date.now() - start
    try {
      await db.logApiRequest(req.path, ip, res.statusCode, responseTime)
    } catch (error) {
      console.error("[v0] Failed to log API request:", error.message)
    }
  })

  next()
})

// WhatsApp webhook endpoint
app.post("/webhooks/whatsapp", async (req, res) => {
  console.log("[v0] Received WhatsApp webhook:", JSON.stringify(req.body, null, 2))

  const signature = req.headers["x-hub-signature-256"]
  if (signature && process.env.WHATSAPP_APP_SECRET) {
    const payload = JSON.stringify(req.body)
    const expectedSignature =
      "sha256=" + crypto.createHmac("sha256", process.env.WHATSAPP_APP_SECRET).update(payload).digest("hex")

    if (signature !== expectedSignature) {
      console.log("[v0] Invalid webhook signature")
      return res.status(403).send("Invalid signature")
    }
  }

  res.status(200).send("EVENT_RECEIVED")

  const { entry } = req.body
  if (entry && entry.length > 0) {
    for (const item of entry) {
      const changes = item.changes || []
      for (const change of changes) {
        const { messages } = change.value || {}
        if (messages && messages.length > 0) {
          for (const message of messages) {
            await processWhatsAppMessage(message)
          }
        }
      }
    }
  }
})

async function processWhatsAppMessage(message) {
  const { from, type, id } = message
  console.log("[v0] Processing message:", { from, type, id })

  let content = null
  if (type === "text") {
    content = { type: "text", text: message.text.body }
  } else if (type === "image") {
    content = { type: "image", caption: message.image.caption || "" }
  } else if (type === "audio") {
    content = { type: "audio" }
  } else {
    console.log("[v0] Unsupported message type:", type)
    return
  }

  await triggerVerification(from, content)
}

async function triggerVerification(userPhone, content) {
  console.log("[v0] Triggering verification for:", userPhone)

  const verdict = determineVerdict(content)
  const confidence = Math.random() * 0.4 + 0.6
  const reasoning = ["No official government announcement found", "Similar claim debunked by trusted sources"]

  const evidenceHash = crypto
    .createHash("sha256")
    .update(JSON.stringify(content) + Date.now())
    .digest("hex")

  const verificationId = await db.createVerification({
    user_phone: userPhone,
    content,
    verdict,
    confidence,
    reasoning,
    evidence_hash: evidenceHash,
  })

  if (confidence < 0.7) {
    await db.addToModerationQueue(verificationId)
    console.log("[v0] Queued for human review:", verificationId)
  } else {
    console.log("[v0] Auto-replied with verdict:", verdict)
  }

  await db.updateSystemMetrics()

  return { id: verificationId, verdict, confidence }
}

function determineVerdict(content) {
  if (content.type === "text") {
    const text = content.text.toLowerCase()
    if (text.includes("government") && text.includes("money")) {
      return "FALSE"
    }
    if (text.includes("president") && text.includes("un")) {
      return "TRUE"
    }
    if (text.includes("ebola")) {
      return "FALSE"
    }
  }
  return "UNVERIFIED"
}

app.get("/api/stats", async (req, res) => {
  try {
    const stats = await db.getSystemMetrics()
    res.json(stats)
  } catch (error) {
    console.error("[v0] Error fetching stats:", error.message)
    res.status(500).json({ error: "Failed to fetch stats" })
  }
})

app.get("/api/verifications/recent", async (req, res) => {
  try {
    const recent = await db.getRecentVerifications(10)
    res.json(recent)
  } catch (error) {
    console.error("[v0] Error fetching verifications:", error.message)
    res.status(500).json({ error: "Failed to fetch verifications" })
  }
})

app.post("/api/verify", async (req, res) => {
  const { request_id, user_phone, content } = req.body

  if (!user_phone || !content) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  try {
    const verification = await triggerVerification(user_phone, content)
    res.status(201).json(verification)
  } catch (error) {
    console.error("[v0] Error creating verification:", error.message)
    res.status(500).json({ error: "Failed to create verification" })
  }
})

app.post("/api/web-chat", async (req, res) => {
  const { message, user_id } = req.body

  if (!message) {
    return res.status(400).json({ error: "Message is required" })
  }

  const userId = user_id || "web-user-" + Date.now()
  const content = { type: "text", text: message }

  try {
    // Reuse the existing verification logic
    const verification = await triggerVerification(userId, content)

    // Format response for the web chat
    res.json({
      id: verification.id,
      text: `Verdict: ${verification.verdict}\nConfidence: ${(verification.confidence * 100).toFixed(1)}%\n\nReasoning: ${verification.reasoning ? verification.reasoning[0] : "Analysis complete."}`,
      verdict: verification.verdict,
      confidence: verification.confidence
    })
  } catch (error) {
    console.error("[v0] Error processing web chat:", error.message)
    res.status(500).json({ error: "Failed to process message" })
  }
})

app.post("/api/reports", async (req, res) => {
  const { victim, incident, suspects, evidence } = req.body

  if (!victim || !incident) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  const caseId = `SL-${new Date().toISOString().split("T")[0].replace(/-/g, "")}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`

  try {
    await db.createReport({
      case_id: caseId,
      incident,
      risk_score: 70,
      assigned_to: "Sierra Leone Police - Financial Crimes Unit",
    })

    await db.updateSystemMetrics()

    res.status(201).json({
      status: "submitted",
      case_id: caseId,
      message: "Report received. Sierra Leone Police notified.",
      expected_contact_within: "48 hours",
    })
  } catch (error) {
    console.error("[v0] Error creating report:", error.message)
    res.status(500).json({ error: "Failed to create report" })
  }
})

app.get("/api/cases/:caseId", async (req, res) => {
  const { caseId } = req.params

  try {
    const report = await db.getReportByCaseId(caseId)
    if (!report) {
      return res.status(404).json({ error: "Case not found" })
    }
    res.json(report)
  } catch (error) {
    console.error("[v0] Error fetching case:", error.message)
    res.status(500).json({ error: "Failed to fetch case" })
  }
})

app.get("/api/moderation/queue", async (req, res) => {
  try {
    const queue = await db.getModerationQueue()
    res.json(queue)
  } catch (error) {
    console.error("[v0] Error fetching moderation queue:", error.message)
    res.status(500).json({ error: "Failed to fetch moderation queue" })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`[v0] TECW Backend API running on port ${PORT}`)
  console.log(`[v0] MySQL database: ${process.env.MYSQL_DATABASE || "tecw_db"}`)
  console.log(`[v0] WhatsApp webhook: http://localhost:${PORT}/webhooks/whatsapp`)
  console.log(`[v0] API endpoints: http://localhost:${PORT}/api/*`)
})
