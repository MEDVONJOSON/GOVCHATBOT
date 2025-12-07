"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

export default function SMSPortalPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">SMS & USSD Portal</h1>
        <p className="text-muted-foreground">
          Truth Engine accessible to ALL Sierra Leoneans - No smartphone or internet required
        </p>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <AlertTitle className="text-blue-800">Zero Barrier Access</AlertTitle>
        <AlertDescription className="text-blue-700">
          70% of Sierra Leoneans don't have smartphones. This SMS service ensures EVERYONE can verify information and
          report scams, regardless of device or internet access.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-700">Verify via SMS</CardTitle>
            <CardDescription>Simple text message verification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="font-medium mb-2">Send SMS to:</p>
              <div className="text-3xl font-bold text-green-700">7777</div>
              <p className="text-sm text-muted-foreground mt-1">Short code - works on all networks</p>
            </div>

            <div>
              <p className="font-medium mb-2">Example:</p>
              <div className="bg-gray-100 p-3 rounded border">
                <p className="font-mono text-sm">VERIFY Is it true that government is giving Le500,000?</p>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                You'll receive: TRUE, FALSE, or UNVERIFIED with brief explanation
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Commands:</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <code className="bg-gray-100 px-2 py-1 rounded">VERIFY [message]</code> - Check if something is true
                </p>
                <p>
                  <code className="bg-gray-100 px-2 py-1 rounded">REPORT</code> - Start scam reporting
                </p>
                <p>
                  <code className="bg-gray-100 px-2 py-1 rounded">HELP</code> - Get usage instructions
                </p>
                <p>
                  <code className="bg-gray-100 px-2 py-1 rounded">CASE [ID]</code> - Check case status
                </p>
              </div>
            </div>

            <Badge className="bg-green-600">Free on Orange, Africell, Qcell</Badge>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-700">Verify via USSD</CardTitle>
            <CardDescription>Instant verification without typing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-medium mb-2">Dial on your phone:</p>
              <div className="text-3xl font-bold text-blue-700">*777#</div>
              <p className="text-sm text-muted-foreground mt-1">Interactive menu - No internet needed</p>
            </div>

            <div>
              <p className="font-medium mb-2">Menu Options:</p>
              <div className="space-y-2">
                <div className="bg-gray-100 p-3 rounded">
                  <p className="font-semibold text-sm">1. Verify Message</p>
                  <p className="text-xs text-muted-foreground">Type what you heard/read</p>
                </div>
                <div className="bg-gray-100 p-3 rounded">
                  <p className="font-semibold text-sm">2. Report Scam</p>
                  <p className="text-xs text-muted-foreground">Guided reporting wizard</p>
                </div>
                <div className="bg-gray-100 p-3 rounded">
                  <p className="font-semibold text-sm">3. Get Alerts</p>
                  <p className="text-xs text-muted-foreground">Subscribe to scam warnings</p>
                </div>
                <div className="bg-gray-100 p-3 rounded">
                  <p className="font-semibold text-sm">4. Education</p>
                  <p className="text-xs text-muted-foreground">Learn to spot scams</p>
                </div>
              </div>
            </div>

            <Badge className="bg-blue-600">Works on basic phones</Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Telco Partnership Integration</CardTitle>
          <CardDescription>Deep integration with Orange, Africell, and Qcell for instant verification</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Orange SL</h4>
              <p className="text-sm text-muted-foreground mb-2">5.2M subscribers</p>
              <ul className="text-sm space-y-1">
                <li>✓ Free SMS verification</li>
                <li>✓ Caller ID verification</li>
                <li>✓ SIM-owner data sharing</li>
              </ul>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Africell</h4>
              <p className="text-sm text-muted-foreground mb-2">3.8M subscribers</p>
              <ul className="text-sm space-y-1">
                <li>✓ Free USSD access</li>
                <li>✓ Scam SMS filtering</li>
                <li>✓ Fraud reporting hotline</li>
              </ul>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Qcell</h4>
              <p className="text-sm text-muted-foreground mb-2">2.1M subscribers</p>
              <ul className="text-sm space-y-1">
                <li>✓ Free short code 7777</li>
                <li>✓ Mobile money integration</li>
                <li>✓ Transaction verification</li>
              </ul>
            </div>
          </div>

          <Alert className="mt-4">
            <AlertDescription>
              Partnership enables real-time SIM verification, automatic scam SMS blocking, and mobile money transaction
              flagging for all 11+ million subscribers.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle>Impact Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-3xl font-bold text-purple-700">11.2M</div>
              <p className="text-sm text-muted-foreground">Citizens reached</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-700">78%</div>
              <p className="text-sm text-muted-foreground">Using basic phones</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-700">Le 2.3B</div>
              <p className="text-sm text-muted-foreground">Fraud prevented</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-700">24/7</div>
              <p className="text-sm text-muted-foreground">Always available</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
