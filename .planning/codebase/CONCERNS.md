# Codebase Concerns

**Analysis Date:** 2026-03-15

## Tech Debt

**Boilerplate Content:**
- Issue: Application still contains default Next.js template content with no actual LunchApp functionality
- Files: `src/app/page.tsx`, `src/app/layout.tsx`
- Impact: Page serves no business value; misleading metadata and imports (unused `Image` component)
- Fix approach: Replace with actual LunchApp UI/components. Implement proper app metadata, remove template links and boilerplate HTML

**No Supabase Integration:**
- Issue: Project claims to use Supabase (per `CLAUDE.md`) but no client initialization or integration exists in the codebase
- Files: No supabase client found in `src/`
- Impact: Cannot execute database queries, authentication, or any data operations despite being critical to project architecture
- Fix approach: Create `src/lib/supabase.ts` with Supabase client initialization using environment variables. Set up auth context provider. Create API routes or server actions for database interactions.

**Missing Migrations Directory:**
- Issue: `CLAUDE.md` mandates all migrations go in `supabase/migrations/` but directory doesn't exist
- Files: `supabase/.temp/` exists but is temporary/local only; no `supabase/migrations/` directory
- Impact: Cannot version control schema changes; violates stated project rules; makes collaboration and deployment risky
- Fix approach: Create `supabase/migrations/` directory. Generate initial migration for project schema using `supabase migration new` command

**Incomplete Metadata:**
- Issue: Generic placeholder metadata in layout file doesn't reflect actual application
- Files: `src/app/layout.tsx` line 16
- Impact: SEO issues; confusing for users; unprofessional appearance in browser tabs/search results
- Fix approach: Update title to "LunchApp" and description to actual app purpose

## Security Considerations

**.env.local Committed to Git:**
- Risk: `.env.local` file exists in working directory (checked via `ls`) and may be accidentally committed despite being in `.gitignore`
- Files: `/.env.local`
- Current mitigation: File is in `.gitignore`, but tool was able to detect it exists
- Recommendations: Ensure CI/CD and git hooks verify `.env.local` never reaches remote. Consider using a pre-commit hook to fail commits if `.env.local` is staged. Document local setup process explicitly.

**Supabase Secrets Exposure Risk in CI/CD:**
- Risk: Workflow uses multiple secrets (`SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) which are correctly handled as GitHub secrets, but `NEXT_PUBLIC_SUPABASE_ANON_KEY` is intentionally public and will be exposed in production bundles
- Files: `.github/workflows/deploy.yml` lines 30-31, 60-61
- Current mitigation: Anon key is intentionally public by design (Next.js NEXT_PUBLIC_ prefix); other secrets use GitHub environments
- Recommendations: Ensure RLS (Row Level Security) policies are comprehensive on Supabase tables to prevent unauthorized data access via anon key. Document this design decision.

**No Input Validation or API Security:**
- Risk: Application currently has no API routes and no backend validation framework in place
- Files: `src/` - no API routes detected
- Current mitigation: None yet
- Recommendations: When implementing API routes, always validate and sanitize inputs. Use TypeScript types. Implement CSRF protection for mutations.

## Performance Bottlenecks

**Unused Imports:**
- Problem: `Image` component imported but only decoratively used in boilerplate content
- Files: `src/app/page.tsx` line 1
- Cause: Template code not tailored to actual application
- Improvement path: Remove unused imports once actual functionality is implemented

**Tailwind CSS Unused Styles:**
- Problem: Boilerplate template generates significant unused CSS due to default Next.js template styling
- Files: `src/app/globals.css` - imports all of Tailwind; `src/app/page.tsx` has extensive inline classes for template UI
- Cause: Default template not stripped
- Improvement path: Once real components are built, Tailwind's PurgeCSS will naturally remove unused styles. Currently, bundle includes unnecessary boilerplate styles.

## Fragile Areas

**Deployment Workflow Complexity:**
- Files: `.github/workflows/deploy.yml`
- Why fragile:
  - Dev job always triggers on push to main (lines 21), but prod job requires manual dispatch (line 51) - risk of environment confusion
  - Both jobs duplicate identical build steps (npm ci, npm run build, supabase setup) - maintenance burden
  - Vercel build uses `--prod` flag in both dev and prod deployments (line 40-42, 70-72) - unclear if this is correct for dev
  - Missing error handling; if supabase push fails, Vercel deployment still proceeds
- Safe modification: Extract common build steps into a reusable workflow. Add explicit environment confirmation step. Add conditional logic to only deploy to Vercel for prod.
- Test coverage: No CI tests exist; integration between supabase and vercel deployment untested

**Unvetted Dependency Versions:**
- Files: `package.json` lines 12-24
- Why fragile: Uses exact versions (Next.js 16.1.6, React 19.2.3) but some devDependencies use caret ranges (`^9`, `^4`, `^20`, `^19`, `^5`) which allow breaking changes
- Safe modification: Review and lock exact versions for all devDependencies. Run `npm audit` regularly. Test after any updates.

**No Configuration as Code for Supabase:**
- Files: `supabase/.temp/` (local state only)
- Why fragile: Supabase project configuration (authentication settings, RLS policies, database schema) not version controlled. Manual dashboard changes will not be tracked or reproducible.
- Safe modification: Store all schema in migrations. Export/version control auth config. Use Supabase CLI to manage all infrastructure as code.

## Scaling Limits

**Single Page Application:**
- Current capacity: Project currently has only one route (`/`)
- Limit: No app directory routing structure established; all future pages must be manually added
- Scaling path: Establish App Router pattern with clear directory structure for features (e.g., `src/app/(auth)/`, `src/app/(dashboard)/`). Create layout hierarchy to share UI components.

**No API Layer:**
- Current capacity: No backend endpoints exist
- Limit: Cannot implement server-side logic, database queries, authentication, or third-party integrations
- Scaling path: Create `src/app/api/` directory with route handlers. Establish patterns for: error handling, request validation, authentication middleware, response formatting.

## Dependencies at Risk

**Tailwind CSS v4 (@tailwindcss/postcss):**
- Risk: v4 is relatively new (caret dependency `^4`); major version changes may introduce breaking CSS changes
- Impact: Styling may break unexpectedly on dependency updates
- Migration plan: Lock to specific Tailwind version. Test thoroughly before upgrading major versions. Monitor Tailwind changelog.

**ESLint v9:**
- Risk: ESLint 9 introduced major configuration format changes; caret dependency allows breaking changes
- Impact: Linting could fail unexpectedly; new rules may break builds
- Migration plan: Lock ESLint to 9.x.x. Document any custom rules. Test CI after any version bumps.

## Missing Critical Features

**No Authentication Implementation:**
- Problem: Project architecture includes Supabase Auth but no auth flows (signup, login, logout, session management) implemented
- Blocks: Cannot build user-facing features; cannot associate data with users

**No Database Schema:**
- Problem: Supabase project linked but no schema exists yet
- Blocks: Cannot create, read, update, or delete any application data

**No API Routes:**
- Problem: No backend endpoints exist
- Blocks: Cannot implement server-side operations, validations, or protected operations

## Test Coverage Gaps

**No Tests Exist:**
- What's not tested: Entire application - no unit, integration, or e2e tests
- Files: No test files found; `package.json` has no test script (lines 5-9)
- Risk: Cannot safely refactor; bugs can slip into production undetected; deployment confidence is low
- Priority: High - establish testing infrastructure early before feature development

**No Linting or Type Checking CI:**
- What's not tested: TypeScript compilation, ESLint rules
- Files: `.github/workflows/deploy.yml` does not run `npm run lint` or type checking before building
- Risk: Invalid code could be deployed; style inconsistencies accumulate
- Priority: High - add pre-build validation step to CI

---

*Concerns audit: 2026-03-15*
