# Codebase Structure

**Analysis Date:** 2026-03-15

## Directory Layout

```
lunchapp/
├── src/                    # Source code root
│   └── app/               # Next.js App Router directory
│       ├── layout.tsx      # Root layout (HTML structure)
│       ├── page.tsx        # Home page (/)
│       ├── globals.css     # Global styles
│       └── favicon.ico     # Favicon
├── public/                # Static assets
├── supabase/              # Supabase configuration and migrations
│   └── migrations/        # Database migration files (currently empty)
├── .github/               # GitHub configuration
│   └── workflows/         # CI/CD workflows
│       └── deploy.yml     # Deployment pipeline
├── .planning/             # Planning and codebase analysis
│   └── codebase/          # Generated codebase documentation
├── tsconfig.json          # TypeScript configuration
├── next.config.ts         # Next.js configuration
├── package.json           # Dependencies and scripts
├── eslint.config.mjs      # ESLint configuration
├── postcss.config.mjs     # PostCSS configuration
├── CLAUDE.md              # Project instructions
└── README.md              # Basic project documentation
```

## Directory Purposes

**src/**
- Purpose: Main application source code
- Contains: React components, pages, styles
- Key files: `app/layout.tsx`, `app/page.tsx`

**src/app/**
- Purpose: Next.js App Router (file-based routing)
- Contains: Page components, layouts, route segments
- Key files: `layout.tsx` (root), `page.tsx` (home page)

**public/**
- Purpose: Static files served as-is
- Contains: Images (next.svg, vercel.svg), favicons, etc.
- Generated: No - committed to repo

**supabase/**
- Purpose: Supabase project configuration and database schema
- Contains: Database migrations, configuration files
- Key files: `migrations/` (empty currently - awaiting schema design)

**.github/workflows/**
- Purpose: CI/CD automation
- Contains: GitHub Actions workflows
- Key files: `deploy.yml` (dev/prod deployment pipeline)

**.planning/codebase/**
- Purpose: GSD codebase analysis documentation
- Contains: Generated architecture/conventions/testing guides
- Generated: Yes - auto-created by analysis tools

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: Root layout - initializes fonts, CSS, HTML structure
- `src/app/page.tsx`: Home page - main landing page at `/`
- `next.config.ts`: Build configuration entry point

**Configuration:**
- `tsconfig.json`: TypeScript compiler settings, path aliases
- `next.config.ts`: Next.js build and runtime settings
- `postcss.config.mjs`: PostCSS plugin configuration for Tailwind
- `eslint.config.mjs`: ESLint rules and preset config
- `.github/workflows/deploy.yml`: Deployment automation

**Core Logic:**
- `src/app/layout.tsx`: HTML structure, fonts, global CSS import
- `src/app/page.tsx`: Landing page content

**Styling:**
- `src/app/globals.css`: Tailwind imports, CSS variables, theme

## Naming Conventions

**Files:**
- `.tsx`: React components with TypeScript
- `.ts`: TypeScript utilities/configuration
- `.mjs`: ES modules (eslint, postcss config)
- `.css`: Stylesheets
- Kebab-case: Configuration files (`eslint.config`, `postcss.config`)
- camelCase: TypeScript/JavaScript source files

**Directories:**
- Lowercase: `src`, `app`, `public`, `supabase`
- Dot-prefix for special: `.github`, `.next`, `.planning`, `.git`

**React Components:**
- PascalCase function names: `RootLayout`, `Home`
- Default export for page/layout files
- Named exports for utility/helper components (when applicable)

**Types:**
- PascalCase: `Metadata` (from `next`)
- Readonly wrapper for immutable props: `Readonly<{ children: React.ReactNode }>`

## Where to Add New Code

**New Feature:**
- Primary code: `src/app/` (new route segments as needed)
- Tests: `src/app/*.test.tsx` or `src/__tests__/` (testing framework TBD)
- Example: New page → `src/app/feature-name/page.tsx`

**New Component/Module:**
- Implementation: Create in `src/app/` or new `src/components/` directory (if components are reusable)
- Usage: Import with `@/app/...` or `@/components/...` aliases
- Example: `src/components/Header.tsx` imports as `import Header from '@/components/Header'`

**Utilities/Helpers:**
- Shared logic: Create `src/lib/` directory for shared utilities
- Example: `src/lib/utils.ts` for helper functions
- Import using `@/lib/utils`

**Database/API:**
- Migrations: Create in `supabase/migrations/` with timestamp prefix
- API routes: `src/app/api/` (Next.js API routes - when needed)
- Database client: Create in `src/lib/supabase.ts` or similar

## Special Directories

**src/app/ (Next.js App Router):**
- Purpose: File-based routing - each file maps to a route
- Generated: No - manually created
- Committed: Yes
- Behavior:
  - `layout.tsx` = layout component for that segment
  - `page.tsx` = page component rendered at that route
  - `[id]` = dynamic route segments
  - `@slot` = parallel routes (advanced feature)

**.next/**
- Purpose: Build output and cache
- Generated: Yes - created by `npm run build`
- Committed: No - in `.gitignore`

**supabase/.temp/**
- Purpose: Supabase CLI temporary files
- Generated: Yes - created by `supabase` commands
- Committed: No - in `.gitignore`

**node_modules/**
- Purpose: Installed dependencies
- Generated: Yes - created by `npm install`
- Committed: No - in `.gitignore`

## Type Aliases and Path Resolution

**tsconfig.json paths:**
- `@/*` → `./src/*` - Primary import alias for all source code
- Example: `import Layout from '@/app/layout'`

**Recommended pattern:**
```typescript
// Good - uses path alias
import { metadata } from '@/app/layout';

// Avoid - relative imports
import { metadata } from '../app/layout';
```

## Development vs Production Differences

**Environment Variables:**
- Dev: `.env.local` (local only, never committed)
- Prod: GitHub Secrets in Actions (set in repository settings)
- Public vars: Prefixed `NEXT_PUBLIC_` in both environments
- Required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Build Process:**
- Dev: `npm run dev` (fast refresh, hot module reloading)
- Prod: `npm run build` + `npm start` (optimized production build)
- CI/CD: GitHub Actions applies migrations then deploys to Vercel

---

*Structure analysis: 2026-03-15*
