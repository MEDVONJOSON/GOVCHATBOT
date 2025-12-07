"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface VerificationDetailModalProps {
  verification: any
  open: boolean
  onClose: () => void
}

export function VerificationDetailModal({ verification, open, onClose }: VerificationDetailModalProps) {
  if (!verification) return null

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "TRUE":
        return "bg-green-500/10 text-green-600 border-green-500/20"
      case "FALSE":
        return "bg-red-500/10 text-red-600 border-red-500/20"
      case "MISLEADING":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20"
    }
  }

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case "TRUE":
        return "✓"
      case "FALSE":
        return "✗"
      case "MISLEADING":
        return "⚠"
      default:
        return "?"
    }
  }

  const reasoning = JSON.parse(verification.reasoning || "[]")
  const sources = JSON.parse(verification.matched_sources || "[]")

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Verification Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Verification ID */}
          <div>
            <p className="text-sm text-muted-foreground">Verification ID</p>
            <p className="font-mono text-sm">{verification.verification_id}</p>
          </div>

          {/* Message Content */}
          <div>
            <p className="text-sm font-medium mb-2">Message Content</p>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">{verification.message_content}</p>
            </div>
          </div>

          {/* Verdict */}
          <div>
            <p className="text-sm font-medium mb-2">Verdict</p>
            <Badge className={`${getVerdictColor(verification.verdict)} text-lg px-4 py-2`}>
              {getVerdictIcon(verification.verdict)} {verification.verdict}
            </Badge>
          </div>

          {/* Confidence Score */}
          <div>
            <p className="text-sm font-medium mb-2">Confidence Score</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${verification.confidence * 100}%` }}
                />
              </div>
              <span className="text-sm font-bold">{Math.round(verification.confidence * 100)}%</span>
            </div>
          </div>

          <Separator />

          {/* AI Reasoning */}
          {reasoning.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-3">AI Analysis & Reasoning</p>
              <ul className="space-y-2">
                {reasoning.map((reason: string, index: number) => (
                  <li key={index} className="flex gap-2 text-sm">
                    <span className="text-primary">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Matched Sources */}
          {sources.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-3">Verified Sources</p>
              <div className="space-y-2">
                {sources.map((source: any, index: number) => (
                  <div key={index} className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">{source.title}</p>
                    {source.url && (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        {source.url}
                      </a>
                    )}
                    {source.authority && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Authority: {Math.round(source.authority * 100)}%
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">User Phone</p>
              <p className="font-mono">{verification.user_phone}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Language</p>
              <p className="uppercase">{verification.language || "EN"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Created</p>
              <p>{new Date(verification.created_at).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <Badge variant="outline" className="bg-green-500/10 text-green-600">
                Processed
              </Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Close
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Export PDF
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Flag for Review
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
