"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function PublicVerifyPage() {
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleVerify = async () => {
    if (!message.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: { type: "text", text: message },
          user_phone: "public_portal",
        }),
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Verification error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-700 mb-2">Truth Engine</h1>
          <p className="text-xl text-gray-600">Verify any message instantly - Free for all Sierra Leoneans</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Paste Your Message</CardTitle>
            <CardDescription>
              Forward any WhatsApp message, social media post, or SMS to verify if it's true
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Example: 'Government is giving Le500,000 to all citizens. Click here to register...'"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="text-lg"
            />
            <Button
              onClick={handleVerify}
              disabled={loading || !message.trim()}
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {loading ? "Verifying..." : "Verify Now - Free"}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Verification Result</CardTitle>
                <Badge
                  variant={
                    result.verdict === "TRUE" ? "default" : result.verdict === "FALSE" ? "destructive" : "secondary"
                  }
                  className="text-lg px-4 py-1"
                >
                  {result.verdict}
                </Badge>
              </div>
              <div className="mt-2">
                <span className="text-sm text-muted-foreground">Confidence: </span>
                <span className="text-lg font-bold">{Math.round(result.confidence * 100)}%</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Why this verdict?</h4>
                <ul className="space-y-2">
                  {result.reasoning?.map((reason: string, i: number) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-green-600">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {result.matched_sources && result.matched_sources.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Sources Checked:</h4>
                  <ul className="space-y-2">
                    {result.matched_sources.map((source: any, i: number) => (
                      <li key={i} className="text-sm">
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {source.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.verdict === "FALSE" && (
                <Alert className="bg-red-50 border-red-200">
                  <AlertDescription className="text-red-800">
                    <strong>Warning:</strong> This appears to be false information. Do not forward this message. If you
                    lost money to this scam, click below to report it to Sierra Leone Police.
                  </AlertDescription>
                </Alert>
              )}

              {result.verdict === "FALSE" && (
                <Button variant="destructive" className="w-full" asChild>
                  <a href="/citizens#report">Report This Scam</a>
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">24/7 Available</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Verify messages anytime, day or night</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Instant Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Get answers in under 30 seconds</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trusted Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">We check State House, WHO, and official agencies</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle>Use via WhatsApp</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">For even faster verification, just forward any message to our WhatsApp number:</p>
            <div className="text-3xl font-bold text-center text-blue-700 mb-4">+232 XX XXX XXXX</div>
            <p className="text-sm text-muted-foreground text-center">Free verification bot - No data charges</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
