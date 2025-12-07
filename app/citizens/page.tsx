"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

export default function CitizensPortalPage() {
  const [messageToVerify, setMessageToVerify] = useState("")
  const [verificationResult, setVerificationResult] = useState<any>(null)

  const handleVerify = async () => {
    const response = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: { type: "text", text: messageToVerify },
        userPhone: "+23276XXXXXXX",
      }),
    })

    const result = await response.json()
    setVerificationResult(result)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">TC</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Truth Engine</h1>
              <p className="text-xs text-muted-foreground">Verify Messages Instantly</p>
            </div>
          </div>
          <Button variant="outline">WhatsApp: +232 XX XXX XXX</Button>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl space-y-8 p-6">
        <section className="text-center space-y-3">
          <h2 className="text-4xl font-bold">Protect Yourself from Scams</h2>
          <p className="text-lg text-muted-foreground">
            Free service by the Sierra Leone Government to verify messages and report scams
          </p>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Verify a Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Paste the message you want to verify</label>
              <Textarea
                placeholder="Example: Government is giving Le500,000 to all citizens. Click here to register..."
                className="min-h-32"
                value={messageToVerify}
                onChange={(e) => setMessageToVerify(e.target.value)}
              />
            </div>

            <Button onClick={handleVerify} className="w-full" size="lg" disabled={!messageToVerify}>
              Verify Now
            </Button>

            {verificationResult && (
              <div className="mt-6 rounded-lg border p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Badge
                    variant={
                      verificationResult.verdict === "FALSE"
                        ? "destructive"
                        : verificationResult.verdict === "TRUE"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {verificationResult.verdict}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Confidence: {Math.round(verificationResult.confidence * 100)}%
                  </span>
                </div>

                <h3 className="mb-2 font-semibold">Why?</h3>
                <ul className="mb-4 space-y-1">
                  {verificationResult.reasoning?.map((reason: string, i: number) => (
                    <li key={i} className="text-sm">
                      • {reason}
                    </li>
                  ))}
                </ul>

                {verificationResult.matchedSources?.length > 0 && (
                  <>
                    <h3 className="mb-2 font-semibold">Sources Checked</h3>
                    <ul className="space-y-1">
                      {verificationResult.matchedSources.map((source: any, i: number) => (
                        <li key={i} className="text-sm text-blue-600">
                          • {source.title}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How to Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>1. Receive a suspicious message on WhatsApp or SMS</p>
              <p>2. Forward it to our WhatsApp number</p>
              <p>3. Get instant verification within 30 seconds</p>
              <p>4. Report scams with evidence</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Common Scams</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Badge variant="destructive" className="mt-0.5">
                  Fraud
                </Badge>
                <span>Fake mobile money messages</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="destructive" className="mt-0.5">
                  Fraud
                </Badge>
                <span>Government impersonation</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="destructive" className="mt-0.5">
                  False
                </Badge>
                <span>Health misinformation</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="destructive" className="mt-0.5">
                  Scam
                </Badge>
                <span>Fake job offers and lotteries</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-medium">WhatsApp</p>
                <p className="text-muted-foreground">+232 XX XXX XXX</p>
              </div>
              <div>
                <p className="font-medium">Emergency</p>
                <p className="text-muted-foreground">Call 999</p>
              </div>
              <div>
                <p className="font-medium">Police Hotline</p>
                <p className="text-muted-foreground">+232 76 XXX XXX</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Official Statements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">False Ebola Claims Debunked</h3>
                  <p className="text-xs text-muted-foreground">Ministry of Health - Jan 15, 2025</p>
                </div>
                <Badge>Official</Badge>
              </div>
              <p className="text-sm">
                The Ministry of Health confirms no Ebola outbreak in Freetown. Citizens should ignore false messages
                circulating on social media.
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">Mobile Money Fraud Alert</h3>
                  <p className="text-xs text-muted-foreground">Bank of Sierra Leone - Jan 14, 2025</p>
                </div>
                <Badge>Official</Badge>
              </div>
              <p className="text-sm">
                Citizens should ignore messages claiming government cash handouts. No such program exists. Report
                suspicious messages to TECW.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
