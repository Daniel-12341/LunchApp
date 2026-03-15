\# LunchApp



\## Stack

\- Frontend: Next.js (TypeScript, Tailwind CSS)

\- Database: Supabase (Postgres)

\- Auth: Supabase Auth

\- Hosting: Vercel

\- Environments: dev / prod



\## Key Rules

\- Never edit schema directly in Supabase dashboard — always use migration files

\- All migrations go in supabase/migrations/

\- Never commit .env.local

\- All changes via feature branches, squash merge to main

\- Branch names: feature/xxx, fix/xxx, setup/xxx



\## Local Dev

\- npm run dev → http://localhost:3000

\- supabase db push → applies migrations to linked project

\- Always linked to DEV when developing locally



\## Environment Variables

\- NEXT\_PUBLIC\_SUPABASE\_URL

\- NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY



\## Common Commands

\- New migration: supabase migration new <name>

\- Push migrations: supabase db push

\- Run app: npm run dev

