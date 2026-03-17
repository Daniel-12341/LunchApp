# Testing Patterns

**Analysis Date:** 2026-03-15

## Test Framework

**Runner:**
- Not detected — testing infrastructure not yet configured
- Recommended: Jest (with Next.js support) or Vitest (Vite-compatible, faster)

**Assertion Library:**
- Not detected — no test setup in place

**Run Commands:**
- `npm run lint` — ESLint code quality checks (only current validation)
- Recommended test commands once configured:
  ```bash
  npm run test              # Run all tests
  npm run test -- --watch   # Watch mode
  npm run test -- --coverage # Coverage report
  ```

## Test File Organization

**Location:**
- Not yet established
- Recommended pattern: Co-locate tests with source files
- Pattern: `src/components/__tests__/ComponentName.test.tsx` or `src/components/ComponentName.test.tsx`

**Naming:**
- Recommended pattern: `[FileName].test.tsx` for component tests
- Pattern: `[UtilityName].test.ts` for utility tests

**Structure:**
- Recommended directory structure:
  ```
  src/
  ├── app/
  │   ├── page.tsx
  │   ├── page.test.tsx
  │   ├── layout.tsx
  │   └── layout.test.tsx
  ├── components/
  │   ├── Button.tsx
  │   ├── Button.test.tsx
  │   └── __tests__/
  │       └── shared-fixtures.ts
  ├── utils/
  │   ├── helpers.ts
  │   └── helpers.test.ts
  └── __tests__/
      └── setup.ts
  ```

## Test Structure

**Suite Organization:**
- Not yet established
- Recommended pattern (using Jest):

```typescript
describe('ComponentName', () => {
  describe('rendering', () => {
    it('should render without errors', () => {
      // test implementation
    });
  });

  describe('user interactions', () => {
    it('should handle click events', () => {
      // test implementation
    });
  });
});
```

**Patterns:**
- Setup: Use `beforeEach()` or `beforeAll()` for test initialization
- Teardown: Use `afterEach()` or `afterAll()` for cleanup
- Assertion pattern: `expect(value).toBe(expected)` or similar

## Mocking

**Framework:**
- Not yet configured
- Recommended: Jest's built-in mocking (jest.mock()) or Vitest equivalent

**Patterns:**
- Recommended pattern for Next.js modules:
```typescript
jest.mock('next/image');
jest.mock('next/navigation');

// Mock implementation
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      getSession: jest.fn(),
    },
  },
}));
```

**What to Mock:**
- External API calls (Supabase client, HTTP requests)
- Next.js built-in modules (`next/image`, `next/navigation`, `next/link`)
- Environment variables (process.env)

**What NOT to Mock:**
- Internal utility functions (test them directly)
- CSS/styling imports
- TypeScript type definitions
- Component logic that drives other tests

## Fixtures and Factories

**Test Data:**
- Not yet established
- Recommended pattern:

```typescript
// src/__tests__/fixtures/user.ts
export const mockUser = {
  id: '123',
  email: 'test@example.com',
  name: 'Test User',
};

export const createMockUser = (overrides = {}) => ({
  ...mockUser,
  ...overrides,
});
```

**Location:**
- Recommended: `src/__tests__/fixtures/` for shared test data
- Or `src/__tests__/factories/` for factory functions

## Coverage

**Requirements:**
- Not enforced — coverage thresholds not configured
- Recommended minimum: 80% line coverage, 70% branch coverage

**View Coverage:**
- Once configured: `npm run test -- --coverage`
- Coverage report generated to `coverage/` directory

## Test Types

**Unit Tests:**
- Scope: Individual functions, components, utilities
- Approach: Test inputs and outputs in isolation
- Priority: Write unit tests for business logic, utility functions, and critical components
- Example: Test a form validation function with various input types

**Integration Tests:**
- Scope: Multiple components/modules working together
- Approach: Test real interactions between components
- Example: Test a form submission that triggers state updates and API calls (with mocked API)
- Location: `src/__tests__/integration/` or same level as unit tests with `.integration.test.tsx` suffix

**E2E Tests:**
- Framework: Not yet implemented
- Recommended: Playwright or Cypress for end-to-end testing
- Scope: Full user workflows from browser perspective
- Example: User login flow through Supabase Auth
- Location: `e2e/` directory at project root (when implemented)

## Common Patterns

**Async Testing:**
- Use `async/await` in test functions:

```typescript
it('should fetch data successfully', async () => {
  const result = await fetchData();
  expect(result).toBeDefined();
});
```

- Alternative with Jest: Use `done` callback:
```typescript
it('should handle callbacks', (done) => {
  asyncFunction(() => {
    expect(true).toBe(true);
    done();
  });
});
```

**Error Testing:**
- Test error states explicitly:

```typescript
it('should throw error on invalid input', () => {
  expect(() => {
    validateInput(null);
  }).toThrow('Invalid input');
});

// For async errors:
it('should reject on API failure', async () => {
  await expect(apiCall()).rejects.toThrow('API Error');
});
```

## Next.js Testing Setup (Recommended)

**Testing Library Integration:**
- Use `@testing-library/react` for component testing
- Use `@testing-library/next` for Next.js-specific utilities
- Avoid testing implementation details; test user behavior

**Configuration Priority:**
1. Set up Jest or Vitest
2. Add @testing-library packages
3. Configure test environment (jsdom for React, node for utilities)
4. Add test setup file for global mocks and utilities
5. Integrate with CI/CD pipeline (.github/workflows)

## CI/CD Testing Integration

**Current State:**
- Build and lint happen in `.github/workflows/deploy.yml`
- No test step in deployment pipeline

**Recommended:**
- Add test step before build in deployment workflow:
```yaml
- run: npm run lint
- run: npm run test -- --coverage
- run: npm run build
```

---

*Testing analysis: 2026-03-15*
