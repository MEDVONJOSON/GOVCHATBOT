import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Settings</h2>
            <p className="text-muted-foreground mt-1">Configure system preferences and integration settings</p>
          </div>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="moderation">Moderation</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Configuration</CardTitle>
                  <CardDescription>Basic system settings and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="confidence-threshold">Auto-Reply Confidence Threshold</Label>
                    <Input id="confidence-threshold" type="number" defaultValue="0.70" step="0.05" min="0" max="1" />
                    <p className="text-sm text-muted-foreground">
                      Verifications with confidence below this will be sent to human review
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Multilingual Support</Label>
                      <p className="text-sm text-muted-foreground">Enable verification in Krio, Temne, and Mende</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Audio Transcription</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically transcribe voice notes for verification
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Image Forensics</Label>
                      <p className="text-sm text-muted-foreground">Check images for tampering and manipulation</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Button>Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>WhatsApp Business API</CardTitle>
                  <CardDescription>Configure WhatsApp integration settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div>
                      <div className="font-medium text-green-600">Connected</div>
                      <div className="text-sm text-muted-foreground">Phone: +232-76-XXXXXX</div>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                      Active
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <Input id="webhook-url" defaultValue="https://api.tecw.sl/webhooks/whatsapp" readOnly />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="verify-token">Verify Token</Label>
                    <Input id="verify-token" type="password" defaultValue="••••••••••••" readOnly />
                  </div>

                  <Button variant="outline">Test Connection</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Database</CardTitle>
                  <CardDescription>SQLite database configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <div>
                      <div className="font-medium text-blue-600">Connected</div>
                      <div className="text-sm text-muted-foreground">database/tecw.db</div>
                    </div>
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                      Active
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline">Backup Database</Button>
                    <Button variant="outline">View Logs</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="moderation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Moderation Settings</CardTitle>
                  <CardDescription>Configure human review workflows</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="review-sla">Review SLA (minutes)</Label>
                    <Input id="review-sla" type="number" defaultValue="15" />
                    <p className="text-sm text-muted-foreground">
                      Target time for moderator review during business hours
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Priority Escalation</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically flag high-impact claims for urgent review
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekend Coverage</Label>
                      <p className="text-sm text-muted-foreground">Enable moderation queue during weekends</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Button>Save Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage system alerts and notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Alerts</Label>
                      <p className="text-sm text-muted-foreground">Send email for critical system events</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Queue Backup Alerts</Label>
                      <p className="text-sm text-muted-foreground">Alert when moderation queue exceeds threshold</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">Receive weekly analytics summary</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alert-email">Alert Email</Label>
                    <Input id="alert-email" type="email" defaultValue="admin@tecw.sl" />
                  </div>

                  <Button>Save Preferences</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
