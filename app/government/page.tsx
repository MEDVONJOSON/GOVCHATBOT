export default function GovernmentPortalPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center px-4">
          <h1 className="text-xl font-bold">Government Portal - TECW</h1>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="container mx-auto max-w-7xl space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Sierra Leone Government Portal</h2>
            <p className="text-muted-foreground">Multi-agency coordination and national security operations center</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <GovernmentFeatureCard
              title="National Crisis Response"
              description="Emergency broadcast system for national threats"
              icon="AlertTriangle"
              link="/government/crisis"
            />
            <GovernmentFeatureCard
              title="Inter-Agency Coordination"
              description="Coordinate between Police, NATCOM, and ministries"
              icon="Users"
              link="/government/agencies"
            />
            <GovernmentFeatureCard
              title="Public Communication Hub"
              description="Issue official statements and corrections"
              icon="Megaphone"
              link="/government/communications"
            />
            <GovernmentFeatureCard
              title="Regional Intelligence"
              description="Monitor threats by district and chiefdom"
              icon="Map"
              link="/government/regional"
            />
            <GovernmentFeatureCard
              title="Threat Intelligence Dashboard"
              description="Real-time threat detection and patterns"
              icon="Shield"
              link="/government/threats"
            />
            <GovernmentFeatureCard
              title="Legislative Compliance"
              description="Track cybercrime cases for prosecution"
              icon="Scale"
              link="/government/legal"
            />
          </div>
        </div>
      </main>
    </div>
  )
}

function GovernmentFeatureCard({
  title,
  description,
  icon,
  link,
}: {
  title: string
  description: string
  icon: string
  link: string
}) {
  return (
    <a href={link} className="block">
      <div className="flex h-full flex-col rounded-lg border bg-card p-6 transition-colors hover:bg-accent">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <div className="h-6 w-6 text-primary">{icon}</div>
        </div>
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </a>
  )
}
