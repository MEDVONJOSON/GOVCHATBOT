"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function EducationPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Scam Prevention Education</h1>
        <p className="text-muted-foreground">
          Learn how to protect yourself and your family from cyber scams and misinformation
        </p>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <AlertTitle className="text-blue-800">Free Education Program</AlertTitle>
        <AlertDescription className="text-blue-700">
          Available in English, Krio, Temne, and Mende. Share these lessons with your community.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="basics" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="mobile-money">Mobile Money</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="government">Government</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>5 Red Flags of a Scam</CardTitle>
              <CardDescription>Learn to spot suspicious messages instantly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  title: "1. Too Good to Be True",
                  description: "Free money, instant wealth, guaranteed wins",
                  example: "You won Le10,000,000! Click here to claim!",
                  tip: "If it sounds too good to be true, it probably is",
                },
                {
                  title: "2. Urgency and Pressure",
                  description: "Act now, limited time, account will be closed",
                  example: "Your account expires in 24 hours. Send payment now!",
                  tip: "Scammers create fake urgency to stop you from thinking",
                },
                {
                  title: "3. Request for Money or Personal Info",
                  description: "Send registration fee, share PIN, provide ID number",
                  example: "To receive your prize, send Le50,000 processing fee",
                  tip: "Real organizations never ask for payment to give you money",
                },
                {
                  title: "4. Suspicious Links",
                  description: "Shortened URLs, misspelled websites, strange domains",
                  example: "bit.ly/xyz123 or orange-mony.com",
                  tip: "Hover over links before clicking. Check the actual URL",
                },
                {
                  title: "5. Poor Grammar and Spelling",
                  description: "Many typos, awkward phrasing, mixed languages",
                  example: "Dear customer you have been select for cash price",
                  tip: "Official messages are professionally written",
                },
              ].map((flag, i) => (
                <div key={i} className="border rounded-lg p-4 space-y-2">
                  <h3 className="font-semibold text-lg">{flag.title}</h3>
                  <p className="text-sm text-muted-foreground">{flag.description}</p>
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <p className="text-sm font-mono text-red-800">Example: "{flag.example}"</p>
                  </div>
                  <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded p-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <p className="text-sm text-green-800">{flag.tip}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mobile-money" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mobile Money Safety</CardTitle>
              <CardDescription>Protect your Orange Money, Africell Money, and Q-Money accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTitle>NEVER Share Your PIN</AlertTitle>
                <AlertDescription>
                  Orange, Africell, and Qcell will NEVER ask for your PIN via SMS, call, or message. Not even customer
                  service staff need your PIN.
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 space-y-2">
                  <Badge variant="destructive">SCAM</Badge>
                  <h4 className="font-semibold">Fake Mobile Money Message</h4>
                  <div className="bg-red-50 border border-red-200 rounded p-3 text-sm font-mono">
                    "Your Orange Money account has been blocked. Send your PIN to 076XXXXXX to unlock."
                  </div>
                  <p className="text-sm text-red-600 font-semibold">This is FAKE. Do not respond.</p>
                </div>

                <div className="border rounded-lg p-4 space-y-2">
                  <Badge className="bg-green-600">REAL</Badge>
                  <h4 className="font-semibold">Legitimate Orange Money</h4>
                  <div className="bg-green-50 border border-green-200 rounded p-3 text-sm font-mono">
                    "You received Le50,000 from 076XXXXXX. New balance: Le75,000. Fee: Le0."
                  </div>
                  <p className="text-sm text-green-600 font-semibold">Real messages show transaction details only.</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Common Mobile Money Scams:</h4>
                {[
                  "Fake account suspension/blocking messages",
                  "Requests to 'verify' account by sending money",
                  "Prize notifications requiring payment to claim",
                  "SIM swap fraud (someone transfers your number)",
                  "Agent impersonation at withdrawal points",
                ].map((scam, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded">
                    <Badge variant="outline" className="mt-0.5">
                      Alert
                    </Badge>
                    <p className="text-sm">{scam}</p>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2">What To Do If Scammed:</h4>
                <ol className="space-y-2 text-sm">
                  <li>1. Call your mobile money provider immediately (Orange: 111, Africell: 121)</li>
                  <li>2. Block the scammer's number</li>
                  <li>3. Report to TECW via WhatsApp or SMS 7777</li>
                  <li>4. Visit nearest police station with evidence</li>
                  <li>5. Never send more money to "recover" your loss</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Media & WhatsApp Safety</CardTitle>
              <CardDescription>How to spot fake news and misinformation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold">Check the Source</h4>
                  <p className="text-sm text-muted-foreground">
                    Is it from an official government page? A verified news outlet? Or a random account with no profile
                    picture?
                  </p>
                </div>

                <div className="border rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold">Look for Evidence</h4>
                  <p className="text-sm text-muted-foreground">
                    Real news has photos, videos, named sources, and dates. Fake news is vague and doesn't cite sources.
                  </p>
                </div>

                <div className="border rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold">Verify Before Sharing</h4>
                  <p className="text-sm text-muted-foreground">
                    Forward to TECW WhatsApp for instant verification. Don't spread unconfirmed information.
                  </p>
                </div>
              </div>

              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertTitle className="text-yellow-800">WhatsApp Forwarding Warning</AlertTitle>
                <AlertDescription className="text-yellow-700">
                  Messages forwarded many times are often false. WhatsApp shows "Forwarded many times" for viral
                  content. Always verify before forwarding further.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <h4 className="font-semibold">Common Misinformation Topics:</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { topic: "Health", example: "Fake Ebola outbreaks, miracle cures, vaccine lies" },
                    { topic: "Politics", example: "False government announcements, fake policies" },
                    { topic: "Finance", example: "New currency, bank closures, economic collapse" },
                    { topic: "Disasters", example: "Fake accidents, exaggerated casualties" },
                    { topic: "Crime", example: "False kidnapping alerts, gang warnings" },
                    { topic: "Religion", example: "Fake prophecies, manipulated religious messages" },
                  ].map((item, i) => (
                    <div key={i} className="border rounded p-3 space-y-1">
                      <Badge>{item.topic}</Badge>
                      <p className="text-sm text-muted-foreground">{item.example}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="government" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Verify Government Information</CardTitle>
              <CardDescription>How to know if a government announcement is real</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-green-50 border-green-200">
                <AlertTitle className="text-green-800">Official Sources Only</AlertTitle>
                <AlertDescription className="text-green-700">
                  Real government announcements come through official channels. Always verify with TECW.
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-700">✓ Trusted Sources</h4>
                  {[
                    "State House official website and social media",
                    "Ministry official pages",
                    "SLBC (Sierra Leone Broadcasting Corporation)",
                    "Government press releases",
                    "TECW verified announcements",
                  ].map((source, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 bg-green-50 border border-green-200 rounded">
                      <span className="text-green-600">✓</span>
                      <p className="text-sm">{source}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-red-700">✗ Do Not Trust</h4>
                  {[
                    "WhatsApp groups claiming to be government",
                    "Anonymous Facebook pages",
                    "Screenshots without official logo",
                    "Voice notes from unknown numbers",
                    "Messages asking for money or personal info",
                  ].map((source, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 bg-red-50 border border-red-200 rounded">
                      <span className="text-red-600">✗</span>
                      <p className="text-sm">{source}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Common Fake Government Scams:</h4>
                <div className="space-y-2">
                  {[
                    "Free cash distribution programs (government doesn't give cash via WhatsApp)",
                    "Fake tax collection messages",
                    "Fraudulent national ID card 'renewal' fees",
                    "Fake government job offers requiring payment",
                    "False coronavirus/health emergency alerts",
                  ].map((scam, i) => (
                    <p key={i} className="text-sm flex gap-2">
                      <span className="text-blue-600">•</span>
                      <span>{scam}</span>
                    </p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-4">
          <Card className="border-red-200">
            <CardHeader className="bg-red-50">
              <CardTitle className="text-red-800">Emergency Response Guide</CardTitle>
              <CardDescription>What to do in urgent situations</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <Alert className="border-red-200 bg-red-50">
                <AlertTitle className="text-red-800">If Crime Is Happening NOW</AlertTitle>
                <AlertDescription className="text-red-700 text-base">
                  <strong>CALL 999 IMMEDIATELY</strong> - Police emergency line
                  <br />
                  Do not waste time on WhatsApp or social media
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Emergency Contacts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="font-semibold">Police Emergency</p>
                      <p className="text-2xl font-bold text-blue-600">999</p>
                    </div>
                    <div>
                      <p className="font-semibold">Fire Service</p>
                      <p className="text-2xl font-bold text-orange-600">999</p>
                    </div>
                    <div>
                      <p className="font-semibold">Ambulance</p>
                      <p className="text-2xl font-bold text-red-600">999</p>
                    </div>
                    <div>
                      <p className="font-semibold">TECW Fraud Hotline</p>
                      <p className="text-xl font-bold text-green-600">SMS 7777</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">When to Report to TECW</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <p>Already lost money to a scam</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <p>Received suspicious message</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <p>Verify if news is true</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <p>Track your case status</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-600">✗</span>
                      <p>
                        <strong>NOT for active emergencies</strong>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-yellow-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-lg">Health Emergencies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>For health information, always verify with:</p>
                  <ul className="space-y-1 ml-4">
                    <li>• Ministry of Health hotline</li>
                    <li>• WHO Sierra Leone</li>
                    <li>• Nearest hospital or health center</li>
                    <li>• TECW verification (for social media health claims)</li>
                  </ul>
                  <Alert className="mt-3">
                    <AlertDescription>
                      Do not follow medical advice from WhatsApp groups or Facebook. Seek professional medical help.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle>Download Educational Materials</CardTitle>
          <CardDescription>Share these with your family and community</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-3 gap-3">
            <div className="border rounded-lg p-3 bg-white">
              <p className="font-medium mb-1">Poster (PDF)</p>
              <p className="text-xs text-muted-foreground mb-2">5 Red Flags of Scams</p>
              <Badge className="bg-green-600">English</Badge>
              <Badge className="bg-blue-600 ml-1">Krio</Badge>
            </div>
            <div className="border rounded-lg p-3 bg-white">
              <p className="font-medium mb-1">Audio Guide (MP3)</p>
              <p className="text-xs text-muted-foreground mb-2">Mobile Money Safety</p>
              <Badge className="bg-green-600">English</Badge>
              <Badge className="bg-blue-600 ml-1">Krio</Badge>
            </div>
            <div className="border rounded-lg p-3 bg-white">
              <p className="font-medium mb-1">Video Tutorial</p>
              <p className="text-xs text-muted-foreground mb-2">How to Use TECW</p>
              <Badge className="bg-green-600">All Languages</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
