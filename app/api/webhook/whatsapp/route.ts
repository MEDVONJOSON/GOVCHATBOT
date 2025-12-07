import { type NextRequest, NextResponse } from "next/server"
import { createVerification, incrementMetric } from "@/lib/db-operations"

// WhatsApp webhook verification (GET)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get("hub.mode")
  const token = searchParams.get("hub.verify_token")
  const challenge = searchParams.get("hub.challenge")

  // Verify the webhook
  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }

  return NextResponse.json({ error: "Invalid verification token" }, { status: 403 })
}

// WhatsApp webhook message handler (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Extract message from WhatsApp webhook
    const entry = body.entry?.[0]
    const changes = entry?.changes?.[0]
    const message = changes?.value?.messages?.[0]

    if (!message) {
      return NextResponse.json({ status: "no_message" }, { status: 200 })
    }

    const userPhone = message.from
    const messageType = message.type
    let messageText = ""

    // Extract text based on message type
    if (messageType === "text") {
      messageText = message.text.body
    } else if (messageType === "image") {
      messageText = message.image.caption || "[Image message]"
    } else if (messageType === "audio") {
      messageText = "[Audio message]"
    }

    // Simple verification logic (mock for now)
    const verdict = await verifyMessage(messageText)

    // Store in Supabase
    const verificationId = `VER-${Date.now()}`
    await createVerification({
      verification_id: verificationId,
      user_phone: userPhone,
      message_text: messageText,
      message_type: messageType,
      verdict: verdict.verdict,
      confidence: verdict.confidence,
      reasoning: verdict.reasoning,
      sources: verdict.sources,
    })

    // Update metrics
    await incrementMetric("total_verifications")
    await incrementMetric("verifications_today")

    // Send response to user via WhatsApp (implement later)
    // await sendWhatsAppMessage(userPhone, verdict)

    return NextResponse.json(
      {
        status: "processed",
        verification_id: verificationId,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

// Simple verification function (mock implementation)
async function verifyMessage(text: string) {
  const lowerText = text.toLowerCase()

  // Simple keyword-based verification (replace with actual AI later)
  if (lowerText.includes("le500,000") || lowerText.includes("government giving money")) {
    return {
      verdict: "FALSE",
      confidence: 0.92,
      reasoning: [
        "No official government announcement found",
        "Similar scam debunked by BBC News",
        "No record in State House press releases",
      ],
      sources: [{ url: "https://statehouse.gov.sl", title: "State House SL", authority_score: 1.0 }],
    }
  } else if (lowerText.includes("ebola") && lowerText.includes("freetown")) {
    return {
      verdict: "FALSE",
      confidence: 0.89,
      reasoning: ["No announcement from Ministry of Health", "WHO Sierra Leone reports no cases since 2016"],
      sources: [{ url: "https://health.gov.sl", title: "Ministry of Health", authority_score: 1.0 }],
    }
  } else {
    return {
      verdict: "UNVERIFIED",
      confidence: 0.45,
      reasoning: ["Insufficient information to verify claim"],
      sources: [],
    }
  }
}
