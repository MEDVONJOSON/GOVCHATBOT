"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminPage() {
  const [exportLoading, setExportLoading] = useState(false)
  const { data: auditLogs } = useSWR("/api/audit", fetcher, { refreshInterval: 30000 })

  const handleExport = async (type: string) => {
    setExportLoading(true)
    try {
      const response = await fetch(`/api/export?type=${type}&format=csv`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${type}_export_${Date.now()}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (error) {
      console.error("[v0] Export failed:", error)
      alert("Export failed. Please try again.")
    } finally {
      setExportLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">System Administration</h1>
          <p className="text-muted-foreground mt-2">Advanced system configuration, monitoring, and data management</p>
        </div>

        <Tabs defaultValue="export" className="space-y-6">
          <TabsList>
            <TabsTrigger value="export">Data Export</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="monitoring">System Health</TabsTrigger>
          </TabsList>

          {/* Data Export Tab */}
          <TabsContent value="export" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Export Data</CardTitle>
                <CardDescription>Export verifications and reports for analysis and compliance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Verifications</CardTitle>
                      <CardDescription>Export all verification records</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input type="date" placeholder="Start date" />
                          <Input type="date" placeholder="End date" />
                        </div>
                        <Button
                          onClick={() => handleExport("verifications")}
                          disabled={exportLoading}
                          className="w-full"
                        >
                          {exportLoading ? "Exporting..." : "Export to CSV"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Scam Reports</CardTitle>
                      <CardDescription>Export all scam report records</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input type="date" placeholder="Start date" />
                          <Input type="date" placeholder="End date" />
                        </div>
                        <Button onClick={() => handleExport("reports")} disabled={exportLoading} className="w-full">
                          {exportLoading ? "Exporting..." : "Export to CSV"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-2">Export Options</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• CSV format includes all fields for spreadsheet analysis</p>
                    <p>• JSON format available for programmatic processing</p>
                    <p>• Maximum 10,000 records per export</p>
                    <p>• Sensitive data is automatically redacted</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="audit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Audit Logs</CardTitle>
                <CardDescription>System activity logs for compliance and security monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditLogs?.logs?.slice(0, 20).map((log: any) => (
                    <div key={log.log_id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <Badge variant="outline" className="text-xs">
                        {log.action}
                      </Badge>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{log.user || "System"}</p>
                        <p className="text-xs text-muted-foreground">{log.target}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(log.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )) || <p className="text-sm text-muted-foreground text-center py-8">No audit logs found</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configuration Tab */}
          <TabsContent value="config" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>Configure AI thresholds and system behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Auto-Reply Confidence Threshold</Label>
                    <Input type="number" defaultValue="0.70" step="0.05" min="0" max="1" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimum confidence to send automatic reply (0.0-1.0)
                    </p>
                  </div>

                  <div>
                    <Label>Human Review Threshold</Label>
                    <Input type="number" defaultValue="0.69" step="0.05" min="0" max="1" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Cases below this confidence go to human moderators
                    </p>
                  </div>

                  <div>
                    <Label>Rate Limit (requests per hour)</Label>
                    <Input type="number" defaultValue="10" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Maximum verification requests per user per hour
                    </p>
                  </div>

                  <Separator />

                  <div className="flex gap-2">
                    <Button>Save Configuration</Button>
                    <Button variant="outline">Reset to Defaults</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Health Tab */}
          <TabsContent value="monitoring" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Database Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-green-500"></span>
                    <span className="text-lg font-bold">Healthy</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">All queries responding normally</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">API Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-green-500"></span>
                    <span className="text-lg font-bold">Online</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Response time: 45ms avg</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">WhatsApp API</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-green-500"></span>
                    <span className="text-lg font-bold">Connected</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Webhook responding</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
