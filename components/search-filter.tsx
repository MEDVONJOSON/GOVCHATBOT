"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SearchFilterProps {
  onSearch: (filters: any) => void
}

export function SearchFilter({ onSearch }: SearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [verdict, setVerdict] = useState<string>("all")
  const [dateRange, setDateRange] = useState<string>("all")
  const [confidenceMin, setConfidenceMin] = useState<string>("0")

  const handleApplyFilters = () => {
    onSearch({
      searchTerm,
      verdict: verdict === "all" ? null : verdict,
      dateRange,
      confidenceMin: Number.parseFloat(confidenceMin),
    })
  }

  const handleReset = () => {
    setSearchTerm("")
    setVerdict("all")
    setDateRange("all")
    setConfidenceMin("0")
    onSearch({ searchTerm: "", verdict: null, dateRange: "all", confidenceMin: 0 })
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search messages, phone numbers, case IDs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
          className="flex-1"
        />
        <Button onClick={handleApplyFilters}>Search</Button>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Verdict</label>
          <Select value={verdict} onValueChange={setVerdict}>
            <SelectTrigger>
              <SelectValue placeholder="All verdicts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Verdicts</SelectItem>
              <SelectItem value="TRUE">True</SelectItem>
              <SelectItem value="FALSE">False</SelectItem>
              <SelectItem value="MISLEADING">Misleading</SelectItem>
              <SelectItem value="UNVERIFIED">Unverified</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Date Range</label>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger>
              <SelectValue placeholder="All time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Min Confidence</label>
          <Select value={confidenceMin} onValueChange={setConfidenceMin}>
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Any (0%)</SelectItem>
              <SelectItem value="0.5">Low (50%+)</SelectItem>
              <SelectItem value="0.7">Medium (70%+)</SelectItem>
              <SelectItem value="0.85">High (85%+)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button variant="outline" onClick={handleReset} className="w-full bg-transparent">
            Reset Filters
          </Button>
        </div>
      </div>

      {(searchTerm || verdict !== "all" || dateRange !== "all" || confidenceMin !== "0") && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {searchTerm && (
            <Badge variant="secondary" className="text-xs">
              Search: {searchTerm}
            </Badge>
          )}
          {verdict !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Verdict: {verdict}
            </Badge>
          )}
          {dateRange !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Date: {dateRange}
            </Badge>
          )}
          {confidenceMin !== "0" && (
            <Badge variant="secondary" className="text-xs">
              Confidence: {Math.round(Number.parseFloat(confidenceMin) * 100)}%+
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
