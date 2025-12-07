"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Dashboard" },
    { href: "/verifications", label: "Verifications" },
    { href: "/moderation", label: "Moderation" },
    { href: "/reports", label: "Reports" },
    { href: "/analytics", label: "Analytics" },
    { href: "/cases", label: "Cases" },
    { href: "/intelligence", label: "Intelligence" }, // Added threat intelligence
    { href: "/government", label: "Government" },
    { href: "/admin", label: "Admin" },
  ]

  const publicLinks = [
    { href: "/verify", label: "Public Verify", badge: "Citizens" },
    { href: "/chat", label: "Chat Bot", badge: "AI Assistant" },
    { href: "/sms", label: "SMS Portal", badge: "No Internet" },
    { href: "/education", label: "Education", badge: "Learn" },
  ]

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-600 to-blue-600">
              <span className="text-lg font-bold text-white">TC</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">TECW</h1>
              <p className="text-xs text-muted-foreground">Truth Engine & Cyber Watchdog</p>
            </div>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-2">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hidden lg:flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-700 rounded-lg text-xs font-medium hover:bg-green-500/20 transition-colors"
              >
                {link.label}
                <span className="px-1.5 py-0.5 bg-green-500 text-white rounded text-xs">{link.badge}</span>
              </Link>
            ))}

            <span className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-600 rounded-full text-sm font-medium">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              Live
            </span>
          </div>
        </div>
      </div>
    </nav>
  )
}
