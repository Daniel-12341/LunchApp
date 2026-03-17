# Technology Stack

**Analysis Date:** 2026-03-15

## Languages

**Primary:**
- TypeScript 5.x - Full application (frontend, API routes)
- CSS - Styling via Tailwind CSS

**Secondary:**
- JavaScript (ES2017+) - Build configuration and tooling

## Runtime

**Environment:**
- Node.js 24.14.0 (current development environment)
- Next.js runtime for server-side features

**Package Manager:**
- npm 11.9.0
- Lockfile: `package-lock.json` (present)

## Frameworks

**Core:**
- Next.js 16.1.6 - Full-stack React framework with app router
- React 19.2.3 - UI component library
- React DOM 19.2.3 - React DOM rendering

**Styling:**
- Tailwind CSS 4.x - Utility-first CSS framework
- @tailwindcss/postcss 4.x - PostCSS plugin for Tailwind

**Development:**
- TypeScript 5.x - Type checking
- ESLint 9.x - Code linting
- eslint-config-next 16.1.6 - Next.js ESLint rules

**CSS Processing:**
- PostCSS - CSS transformation pipeline
- `postcss.config.mjs` - PostCSS configuration

## Key Dependencies

**Critical:**
- next@16.1.6 - Core framework; required for SSR, routing, and optimization
- react@19.2.3 - UI library; required for component rendering
- react-dom@19.2.3 - React rendering for DOM

**Development:**
- @types/node@^20 - TypeScript definitions for Node APIs
- @types/react@^19 - TypeScript definitions for React
- @types/react-dom@^19 - TypeScript definitions for React DOM
- eslint@^9 - Linting tool
- tailwindcss@^4 - CSS utility framework
- typescript@^5 - TypeScript compiler

## Configuration

**Environment:**
- `.env.local` file present (not committed - contains development configuration)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (public environment variable)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (public environment variable)

**Build:**
- `next.config.ts` - Next.js configuration (minimal, no custom config options set)
- `tsconfig.json` - TypeScript compiler options
  - Target: ES2017
  - Path alias: `@/*` maps to `./src/*`
  - Module resolution: bundler
  - Strict mode enabled
- `postcss.config.mjs` - PostCSS configuration with Tailwind plugin
- `eslint.config.mjs` - ESLint configuration using Next.js core web vitals and TypeScript configs

## Platform Requirements

**Development:**
- Node.js 24.x or compatible (v24.14.0 confirmed working)
- npm 11.x or compatible
- Supabase CLI for local database development (`supabase db push`)
- Git for version control

**Production:**
- Vercel (primary deployment target)
- Supabase cloud instance for database and authentication
- Environment variables properly configured in Vercel deployment

---

*Stack analysis: 2026-03-15*
