# Truth Engine & Cyber Watchdog (TECW)

AI-powered WhatsApp chatbot for Sierra Leone - Verify claims and report cyber scams.

## Features

- **Message Verification**: Verify text, images, audio, and video claims against trusted sources
- **Scam Reporting**: Guided wizard to report cyber scams to authorities
- **Real-time Analytics**: Dashboard showing verification trends and system metrics
- **Human Moderation**: Queue system for cases requiring expert review
- **Multilingual Support**: English, Krio, and local languages

## Tech Stack

- **Frontend**: React.js, Next.js 16, Tailwind CSS v4, shadcn/ui
- **Backend**: Next.js API Routes
- **Verification Engine**: Python, FastAPI
- **Database**: Supabase (PostgreSQL)
- **Integrations**: WhatsApp Business API
- **Real-time Updates**: SWR

## Quick Start

### 1. Setup Supabase Database

1. In v0, go to sidebar → **Connect** → Add **Supabase** integration
2. Once connected, go to your Supabase dashboard
3. Navigate to **SQL Editor**
4. Copy and run the SQL from `scripts/create_supabase_tables.sql`
5. This creates all tables (users, verifications, reports, moderation_queue, system_metrics)

### 2. Environment Variables

Supabase integration automatically adds:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

For WhatsApp integration, add in v0 sidebar → **Vars**:
- `WHATSAPP_VERIFY_TOKEN` (any secure string)
- `WHATSAPP_ACCESS_TOKEN` (from Meta Business)
- `WHATSAPP_PHONE_NUMBER_ID` (from Meta Business)

### 3. Run the Application

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

\`\`\`
tecw-sierra-leone/
├── app/                          # Next.js app directory
│   ├── page.tsx                  # Main dashboard
│   ├── moderation/               # Moderation interface
│   └── layout.tsx                # Root layout
├── components/                   # React components
│   ├── dashboard/                # Dashboard components
│   ├── moderation/               # Moderation components
│   └── ui/                       # UI primitives (shadcn)
├── backend/                      # Node.js backend
│   └── server.js                 # Express API server
├── scripts/                      # Python services & SQL
│   ├── verification_service.py   # AI verification engine
│   └── create_supabase_tables.sql # Supabase schema
└── TECW_COMPLETE_SPECIFICATION.md # Full technical spec
\`\`\`

## API Endpoints

### Dashboard APIs

\`\`\`bash
GET /api/stats
# Returns: totalVerifications, totalReports, activeUsers, etc.

GET /api/verifications
# Returns: Recent verifications with verdict and confidence

GET /api/moderation/queue
# Returns: Cases pending human review
\`\`\`

### WhatsApp Webhook

\`\`\`bash
GET /api/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=...
# Webhook verification from Meta

POST /api/webhook/whatsapp
# Receives messages from WhatsApp Business API
# Automatically processes and stores in Supabase
\`\`\`

## Database Structure

Supabase tables:
- **users** - WhatsApp users (phone, language, last_active)
- **verifications** - All verification requests and AI verdicts
- **reports** - Scam reports with case tracking
- **moderation_queue** - Low-confidence cases for human review
- **system_metrics** - Real-time counters (auto-updated)

## Deployment

### Deployment to Antygravity

This app works perfectly with Antygravity because:
1. **Supabase is standard PostgreSQL** - works from any platform
2. **No custom backend servers** - just Next.js API routes
3. **Environment variables** - easy to set in any editor

#### Steps:
1. Copy your Supabase credentials from v0 → **Vars** section
2. In Antygravity, set the same environment variables
3. Deploy the Next.js app
4. Your database stays in Supabase (no migration needed)

### Deployment to Vercel

Click **Publish** in v0 - automatically configured with Supabase!

## Documentation

- [Complete Technical Specification](./TECW_COMPLETE_SPECIFICATION.md)
- API Documentation: See OpenAPI spec (coming soon)
- Conversation Design: See spec Section 4
- Security & Privacy: See spec Section 8

## License

Proprietary - Sierra Leone Government & NATCOM

## Support

For issues or questions, contact the TECW development team.
