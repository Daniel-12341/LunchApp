# External Integrations

**Analysis Date:** 2026-03-15

## APIs & External Services

**Supabase (Primary Backend):**
- Supabase - Unified backend platform for database, authentication, and real-time features
  - SDK/Client: `@supabase/supabase-js` (not yet installed, to be added)
  - Auth: Environment variables `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Documentation: Uses Supabase Auth for user authentication

## Data Storage

**Databases:**
- PostgreSQL via Supabase
  - Connection: Via `NEXT_PUBLIC_SUPABASE_URL` environment variable
  - Client: Supabase JavaScript SDK (to be implemented)
  - Migrations: Stored in `supabase/migrations/` directory
  - Workflow: `supabase db push` applies migrations to linked Supabase project

**File Storage:**
- Supabase Storage (available but not currently configured)

**Caching:**
- None configured

## Authentication & Identity

**Auth Provider:**
- Supabase Auth
  - Implementation: Supabase Auth service (cloud-hosted)
  - Connection: Via `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `NEXT_PUBLIC_SUPABASE_URL`
  - Status: Configured for use, implementation pending in codebase

## Monitoring & Observability

**Error Tracking:**
- Not detected

**Logs:**
- Standard Node.js/Next.js logging (console-based, no external service)

## CI/CD & Deployment

**Hosting:**
- Vercel (primary deployment platform)
- Next.js native deployment support

**CI Pipeline:**
- GitHub Actions (referenced in git history: `.github/workflows/` for deployment workflow)

## Environment Configuration

**Required env vars:**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (public)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous public key (public)

**Secrets location:**
- `.env.local` (local development only, never committed)
- Vercel environment variables (for prod/dev deployments)
- See CLAUDE.md: "Never commit .env.local"

## Webhooks & Callbacks

**Incoming:**
- None currently configured

**Outgoing:**
- None currently configured
- Supabase webhooks available for future integration

## Development Environment

**Local Database:**
- Supabase local development supported via `supabase db push`
- Always linked to DEV project when developing locally
- Migrations applied via `supabase migration new <name>` and `supabase db push`

**External Links:**
- Vercel (deployment): https://vercel.com
- Supabase (backend): Cloud-hosted
- Next.js Font Service: Google Fonts (used for Geist font family)

---

*Integration audit: 2026-03-15*
