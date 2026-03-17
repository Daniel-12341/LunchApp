# Architecture

**Analysis Date:** 2026-03-15

## Pattern Overview

**Overall:** Server-Rendered React with Next.js App Router

**Key Characteristics:**
- Server-side rendering with React Server Components (RSC) as default
- File-based routing via App Router in `src/app/`
- Unified TypeScript across frontend and backend
- Environment-based configuration for dev/prod deployments
- Database-agnostic frontend (Supabase integration planned)

## Layers

**UI/Presentation Layer:**
- Purpose: Renders React components using Tailwind CSS for styling
- Location: `src/app/`
- Contains: Page components, layout components, global styles
- Depends on: Next.js framework, React 19
- Used by: Browser clients, Next.js server

**Layout Layer:**
- Purpose: Defines root HTML structure and metadata
- Location: `src/app/layout.tsx`
- Contains: Root metadata, font imports, CSS imports, body wrapper
- Depends on: Next.js Metadata API, Google Fonts
- Used by: All pages in the app

**Page Layer:**
- Purpose: Serves as the home page entry point
- Location: `src/app/page.tsx`
- Contains: Main page content and UI
- Depends on: Layout, Next.js Image component
- Used by: Browser at root path `/`

**Styling Layer:**
- Purpose: Provides CSS framework and theming
- Location: `src/app/globals.css`
- Contains: Tailwind CSS imports, CSS variables, dark mode support
- Depends on: Tailwind CSS v4, CSS custom properties
- Used by: All pages via layout

**Build/Config Layer:**
- Purpose: Configures build behavior and module resolution
- Location: `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`
- Contains: TypeScript compiler options, path aliases, build settings
- Depends on: TypeScript, Next.js, PostCSS
- Used by: Dev server and build process

## Data Flow

**Request Flow (User loads page):**

1. Browser requests `/` (or any route)
2. Next.js server receives request at entry point
3. Next.js renders `src/app/layout.tsx` (root layout)
4. Layout wraps the matching page component
5. React Server Components render on server
6. HTML sent to browser
7. React hydration occurs on client (if needed)
8. Page interactive to user

**Styling Application:**

1. Global CSS imported in `src/app/layout.tsx`
2. Tailwind CSS processes utility classes in components
3. PostCSS processes Tailwind imports
4. CSS variables in `:root` applied for theming
5. Dark mode detected via `prefers-color-scheme` media query

**State Management:**

- Currently: No centralized state management (scaffolding phase)
- Data persistence: Planned via Supabase (not yet integrated)
- Environment variables: Via `NEXT_PUBLIC_` prefix for public exposure
- Local state: React component state (when needed)

## Key Abstractions

**Route Segments:**
- Purpose: Organize pages by URL path structure
- Examples: `src/app/page.tsx` (maps to `/`)
- Pattern: File-based routing - directories become path segments

**Layout Components:**
- Purpose: Define UI hierarchy and shared structure
- Examples: `src/app/layout.tsx` (root layout)
- Pattern: Wrap child pages, provide common metadata/styling

**TypeScript Path Aliases:**
- Purpose: Simplify imports and allow easy refactoring
- Examples: `@/*` → `src/*`
- Pattern: Configured in `tsconfig.json`, used throughout codebase

## Entry Points

**Application Root:**
- Location: `src/app/layout.tsx`
- Triggers: Server startup, route request
- Responsibilities: Loads fonts, imports global CSS, renders root HTML structure

**Home Page:**
- Location: `src/app/page.tsx`
- Triggers: GET request to `/`
- Responsibilities: Renders landing page content

**Build Entry:**
- Location: `next.config.ts`
- Triggers: `npm run build` or deployment
- Responsibilities: Configures build behavior, sets build options

## Error Handling

**Strategy:** Default Next.js error handling

**Patterns:**
- Unhandled errors fall back to Next.js default error UI
- Deployment workflow in CI/CD catches build errors before deployment
- No custom error boundaries implemented yet

## Cross-Cutting Concerns

**Logging:** Not implemented yet (console available if needed)

**Validation:** Not implemented yet (form validation planned with Supabase integration)

**Authentication:** Not implemented yet (Supabase Auth planned for integration)

**Environment Configuration:**
- Dev/Prod separation via GitHub Actions environments
- Secrets managed in GitHub (never committed locally)
- Public environment variables prefixed with `NEXT_PUBLIC_`

---

*Architecture analysis: 2026-03-15*
