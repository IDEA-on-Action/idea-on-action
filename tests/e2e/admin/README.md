# Admin E2E Tests

Comprehensive end-to-end test suite for IDEA on Action admin management pages. Tests cover complete CRUD operations, search/filter functionality, form validation, and permission-based access control.

## Overview

### Test Coverage

The admin E2E tests cover **6 core management pages** with **154 total tests**:

| Page | Tests | Focus Areas |
|------|-------|-------------|
| **Portfolio** (`admin-portfolio.spec.ts`) | 32 | Project portfolio management, status toggles, featured items |
| **Lab** (`admin-lab.spec.ts`) | 28 | Experiments & bounties, difficulty levels, deadline management |
| **Team** (`admin-team.spec.ts`) | 28 | Team member management, role assignment, status control |
| **Blog Categories** (`admin-blog-categories.spec.ts`) | 24 | Category CRUD, slug generation, ordering |
| **Tags** (`admin-tags.spec.ts`) | 24 | Tag management, color assignment, usage tracking |
| **Users** (`admin-users.spec.ts`) | 18 | User management, role assignment, account status |

### Test Features

Each test file validates:
- ✅ Page navigation and layout
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Search and filtering
- ✅ Form validation and error handling
- ✅ Permission-based access (403 Forbidden for non-admins)
- ✅ Data persistence and updates
- ✅ Bulk operations and special features

---

## Prerequisites

### 1. Test Server Running

Start the development server before running tests:

```bash
npm run dev
# Server should be accessible at http://localhost:8080
```

### 2. Test User Setup

#### Option A: Manual Setup via Supabase Dashboard

1. **Create test users in Authentication**:
   - Email: `admin@ideaonaction.local` | Password: `demian00` | Role: `admin`
   - Email: `superadmin@ideaonaction.local` | Password: `SuperAdmin123!` | Role: `super_admin`

2. **Add users to admins table**:
   - Go to Supabase Dashboard > SQL Editor
   - Copy and run the SQL from `tests/fixtures/setup-test-admins.sql`
   - Replace user IDs from auth.users if needed

#### Option B: CLI Setup

```bash
# Create test users
supabase auth users create admin@ideaonaction.local --password demian00
supabase auth users create superadmin@ideaonaction.local --password SuperAdmin123!

# Add to admins table (SQL)
INSERT INTO public.admins (user_id, role)
SELECT id, 'admin' FROM auth.users
WHERE email = 'admin@ideaonaction.local';

INSERT INTO public.admins (user_id, role)
SELECT id, 'super_admin' FROM auth.users
WHERE email = 'superadmin@ideaonaction.local';
```

### 3. Verify Setup

Run the setup verification script:

```bash
# Verify test users exist and have correct roles
npx ts-node tests/fixtures/verify-test-admins.ts
```

Expected output:
```
✅ admin@ideaonaction.local exists with role: admin
✅ superadmin@ideaonaction.local exists with role: super_admin
```

### 4. Test User Credentials

See `tests/fixtures/users.ts` for full credentials:

```typescript
export const testUsers = {
  superAdmin: {
    email: 'superadmin@ideaonaction.local',
    password: 'SuperAdmin123!',
    username: 'superadmin',
    role: 'super_admin'
  },
  admin: {
    email: 'admin@ideaonaction.local',
    password: 'demian00',
    username: 'admin',
    role: 'admin'
  },
  regularUser: {
    email: 'test-user@ideaonaction.local',
    password: 'TestUser123!',
    username: 'test-user',
    role: 'user'
  }
}
```

---

## Running Tests

### Run All Admin Tests

```bash
# Run all admin E2E tests
npx playwright test tests/e2e/admin/

# With verbose output
npx playwright test tests/e2e/admin/ --reporter=verbose

# With HTML report
npx playwright test tests/e2e/admin/ --reporter=html
# Opens: playwright-report/index.html
```

### Run Specific Test File

```bash
# Test specific page
npx playwright test tests/e2e/admin/admin-portfolio.spec.ts
npx playwright test tests/e2e/admin/admin-lab.spec.ts
npx playwright test tests/e2e/admin/admin-users.spec.ts
```

### Run Single Test

```bash
# Test specific scenario by line number
npx playwright test tests/e2e/admin/admin-portfolio.spec.ts:30

# Run tests matching pattern
npx playwright test tests/e2e/admin/ -g "should render"
npx playwright test tests/e2e/admin/ -g "CRUD"
```

### Debug Mode

```bash
# UI mode (interactive debugging)
npx playwright test tests/e2e/admin/ --ui

# Step through test with inspector
npx playwright test tests/e2e/admin/ --debug

# Generate trace for later inspection
npx playwright test tests/e2e/admin/ --trace on
# View trace: npx playwright show-trace trace.zip
```

### Headed Mode (See Browser)

```bash
# Run tests with visible browser window
npx playwright test tests/e2e/admin/ --headed

# Single browser
npx playwright test tests/e2e/admin/ --headed --project=chromium
```

---

## Test Structure

### Typical Test File Layout

Each test file follows this standardized structure:

```typescript
import { test, expect } from '@playwright/test';
import { loginAsAdmin } from '../helpers/auth';

test.describe('AdminPortfolio', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cookies and storage
    await page.context().clearCookies();

    // Login as admin
    await loginAsAdmin(page);

    // Navigate to admin page
    await page.goto('/admin/portfolio');
  });

  test.describe('Page Navigation & Loading', () => {
    // Tests for page load and UI elements
  });

  test.describe('Create Operations', () => {
    // Tests for creating new items
  });

  test.describe('Search & Filtering', () => {
    // Tests for search and filter functionality
  });

  test.describe('Edit Operations', () => {
    // Tests for updating items
  });

  test.describe('Delete Operations', () => {
    // Tests for removing items
  });

  test.describe('Special Features', () => {
    // Tests for unique features (toggles, bulk ops, etc.)
  });
});
```

### Helper Functions

All tests use authentication helpers from `tests/e2e/helpers/auth.ts`:

```typescript
import {
  loginAsAdmin,
  loginAsRegularUser,
  loginAsSuperAdmin,
  logout,
  isLoggedIn,
  isAdmin
} from '../helpers/auth';

// Login before each test
await loginAsAdmin(page);

// Check permissions
const hasAdmin = await isAdmin(page);

// Cleanup after test
await logout(page);
```

---

## Test Files

### 1. Admin Portfolio (`admin-portfolio.spec.ts`)

**Tests**: 32 | **Focus**: Project portfolio management

**Coverage**:
- Create new portfolio items with project type, description, tags
- Search by title or summary
- Filter by project type (MVP/Fullstack/Design/Operations)
- Edit portfolio details and featured status
- Delete portfolio items
- Toggle published/archived status
- Form validation (required fields, max lengths)

**Key Scenarios**:
- Portfolio items appear in correct status columns
- Featured items display prominently
- Search updates results in real-time
- Status changes persist after page reload

### 2. Admin Lab (`admin-lab.spec.ts`)

**Tests**: 28 | **Focus**: Experiments and bounty management

**Coverage**:
- Create experiment/bounty listings
- Set difficulty levels (초급/중급/고급)
- Manage deadlines and rewards
- Track applicants and status
- Search by title or skills
- Filter by difficulty and status

**Key Scenarios**:
- Bounty status transitions (open → assigned → done)
- Difficulty colors render correctly
- Reward amounts validate (positive integers)
- Applicant tracking updates in real-time

### 3. Admin Team (`admin-team.spec.ts`)

**Tests**: 28 | **Focus**: Team member management

**Coverage**:
- Add new team members
- Assign roles and responsibilities
- Update member profiles and avatars
- Manage team member status
- Search and filter team members
- Track team member activity

**Key Scenarios**:
- Role assignments restrict permissions
- Avatar uploads process correctly
- Team member search includes name and role
- Status changes affect profile visibility

### 4. Admin Blog Categories (`admin-blog-categories.spec.ts`)

**Tests**: 24 | **Focus**: Blog category management

**Coverage**:
- Create categories with slugs
- Edit category names and descriptions
- Delete categories (with orphaned post handling)
- Reorder categories (drag-and-drop)
- Search and filter categories
- Color coding for visual organization

**Key Scenarios**:
- Category slugs auto-generate from names
- Slug editing with validation
- Empty categories can be archived
- Category reordering persists
- Slug format validation (kebab-case)

### 5. Admin Tags (`admin-tags.spec.ts`)

**Tests**: 24 | **Focus**: Tag management

**Coverage**:
- Create and manage tags
- Assign tag colors
- Track tag usage across content
- Edit tag names and metadata
- Delete unused tags
- Bulk tag operations

**Key Scenarios**:
- Tags auto-suggest during content creation
- Tag colors display consistently
- Usage count updates when items reference tags
- Merge related tags
- Search tags by name or color

### 6. Admin Users (`admin-users.spec.ts`)

**Tests**: 18 | **Focus**: User account management

**Coverage**:
- View user list with account details
- Update user profiles and roles
- Reset user passwords
- Activate/deactivate accounts
- Search and filter users
- Track user activity and logins

**Key Scenarios**:
- User role changes take effect immediately
- Deactivated users can't log in
- Email validation on profile updates
- Password reset sends verification email
- Activity logs track last login

---

## Common Test Patterns

### Pattern 1: Navigation Test

```typescript
test('should render portfolio management page', async ({ page }) => {
  await expect(page.locator('h1:has-text("포트폴리오 관리")')).toBeVisible();
  await expect(page.locator('button:has-text("새 포트폴리오 항목")')).toBeVisible();
});
```

### Pattern 2: Create Operation

```typescript
test('should create new portfolio item', async ({ page }) => {
  // Click create button
  await page.click('button:has-text("새 포트폴리오 항목")');

  // Fill form
  await page.fill('input[placeholder*="제목"]', 'New Project');
  await page.fill('textarea[placeholder*="설명"]', 'Project description');

  // Submit
  await page.click('button[type="submit"]');

  // Verify success
  await expect(page.locator('text=포트폴리오 항목이 생성되었습니다')).toBeVisible();
  await expect(page.locator('text=New Project')).toBeVisible();
});
```

### Pattern 3: Search & Filter

```typescript
test('should search portfolio items', async ({ page }) => {
  // Enter search term
  await page.fill('input[placeholder*="검색"]', 'MVP');

  // Wait for results
  await page.waitForTimeout(500);

  // Verify filtered results
  const items = await page.locator('[data-testid="portfolio-item"]').count();
  expect(items).toBeGreaterThan(0);
});
```

### Pattern 4: Edit Operation

```typescript
test('should edit portfolio item', async ({ page }) => {
  // Click edit button
  await page.click('[data-testid="edit-button"]');

  // Update fields
  await page.fill('input[placeholder*="제목"]', 'Updated Title');

  // Save
  await page.click('button[type="submit"]');

  // Verify update
  await expect(page.locator('text=저장되었습니다')).toBeVisible();
});
```

### Pattern 5: Permission Test

```typescript
test('should deny access to non-admins', async ({ page }) => {
  // Login as regular user
  await loginAsRegularUser(page);

  // Try to access admin page
  await page.goto('/admin/portfolio');

  // Verify access denied
  await expect(page.locator('text=접근 권한 없음')).toBeVisible();
  await expect(page).toHaveURL(/403|forbidden/);
});
```

---

## Troubleshooting

### Login Timeout (10s)

**Problem**: Test hangs at login step, times out after 10 seconds

**Solution**:
```bash
# 1. Verify dev server is running
npm run dev

# 2. Check dev server is on port 5173
curl http://localhost:5173

# 3. Increase timeout in playwright.config.ts
export default defineConfig({
  timeout: 30000,  // 30 seconds instead of 30s default
  ...
});

# 4. Clear browser cache
rm -rf ~/.cache/ms-playwright
npx playwright install
```

### "접근 권한 없음" (403 Access Denied)

**Problem**: Admin user gets 403 error on admin pages

**Likely Causes**:
1. User not in `admins` table
2. User role not set correctly
3. RLS policies blocking access

**Solution**:
```sql
-- Check if user is in admins table
SELECT * FROM public.admins
WHERE user_id = (SELECT id FROM auth.users
                 WHERE email = 'admin@ideaonaction.local');

-- Verify role is 'admin' or 'super_admin'
-- If missing, insert:
INSERT INTO public.admins (user_id, role)
SELECT id, 'admin' FROM auth.users
WHERE email = 'admin@ideaonaction.local';

-- Check RLS policies
SELECT * FROM pg_policies
WHERE tablename = 'admins';
```

### RLS Policy Errors

**Problem**: Tests fail with "new row violates row-level security policy"

**Solution**:
```sql
-- Check current RLS policies
SELECT * FROM pg_policies WHERE tablename = ANY('{portfolio,lab,team,tags,categories,users}');

-- Verify service role has bypass
-- In Supabase Dashboard: Authentication > Policies > Service Role should have full access

-- Test with service role from tests/fixtures/setup-test-admins.sql
```

### Test Timeout on Slow Connection

**Problem**: Tests fail with timeout errors

**Solution**:
```typescript
// In playwright.config.ts
export default defineConfig({
  timeout: 60000,              // Increase default timeout
  expect: { timeout: 10000 },

  use: {
    navigationTimeout: 30000,  // Wait longer for navigation
    actionTimeout: 10000,      // Wait longer for actions
  },

  webServer: {
    timeout: 120000,           // Longer wait for server startup
  }
});
```

### Form Submission Fails

**Problem**: "Click succeeded but no page navigated" error

**Solution**:
```typescript
// Use waitForNavigation for form submissions
await Promise.all([
  page.waitForNavigation(),
  page.click('button[type="submit"]')
]);

// Or use waitForSelector for async updates
await page.click('button[type="submit"]');
await page.waitForSelector('text=성공');
```

### Screenshots/Videos Missing

**Problem**: No artifacts in test report

**Solution**:
```bash
# Run with trace and screenshots
npx playwright test tests/e2e/admin/ --trace on --screenshot on

# View artifacts
npx playwright show-report
```

---

## Running Tests in CI/CD

### GitHub Actions Workflow

See `.github/workflows/test-e2e.yml`:

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      # Install dependencies
      - run: npm ci

      # Install Playwright browsers
      - run: npx playwright install --with-deps

      # Setup test users in Supabase
      - run: npx ts-node tests/fixtures/setup-test-admins.ts
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}

      # Run tests
      - run: npm run test:e2e:admin

      # Upload report
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### Local Test Before Push

```bash
# Run all tests locally before committing
npm run test:e2e:admin

# Only push if all tests pass
# OR use git pre-commit hook:
echo "npm run test:e2e:admin" > .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

---

## Best Practices

### 1. Wait for Elements Properly

```typescript
// ✅ Good: Wait for network idle
await page.waitForLoadState('networkidle');

// ✅ Good: Wait for specific element
await page.waitForSelector('[data-testid="item"]');

// ❌ Bad: Hard-coded waits
await page.waitForTimeout(2000);
```

### 2. Use Data Attributes for Selectors

```typescript
// ✅ Good: Stable selector
await page.click('[data-testid="delete-button"]');

// ❌ Bad: Fragile selectors
await page.click('button.red');
await page.click('div > div > button');
```

### 3. Clear State Between Tests

```typescript
test.beforeEach(async ({ page }) => {
  // Clear cookies
  await page.context().clearCookies();

  // Clear localStorage
  await page.evaluate(() => localStorage.clear());

  // Clear sessionStorage
  await page.evaluate(() => sessionStorage.clear());
});
```

### 4. Use Meaningful Test Names

```typescript
// ✅ Good: Clear intent
test('should create portfolio item with all required fields');

// ❌ Bad: Vague
test('should work');
```

### 5. Test User Flows, Not Implementation

```typescript
// ✅ Good: Tests user-visible behavior
test('user can create and then edit portfolio item', async ({ page }) => {
  await page.click('button:has-text("새 항목")');
  await page.fill('input[placeholder*="제목"]', 'Item');
  await page.click('button[type="submit"]');

  // Edit
  await page.click('[data-testid="edit"]');
  await page.fill('input[placeholder*="제목"]', 'Updated');
  await page.click('button[type="submit"]');
});
```

---

## Related Documentation

- **Test Setup Guide**: `docs/guides/testing/test-user-setup.md`
- **Testing Strategy**: `tests/README.md`
- **Playwright Docs**: https://playwright.dev/docs/intro
- **Test Fixtures**: `tests/fixtures/users.ts`
- **Auth Helpers**: `tests/e2e/helpers/auth.ts`

---

## Quick Reference Commands

```bash
# Run all admin tests
npm run test:e2e:admin

# Run single file
npx playwright test tests/e2e/admin/admin-portfolio.spec.ts

# UI mode (interactive)
npx playwright test tests/e2e/admin/ --ui

# Debug mode with browser
npx playwright test tests/e2e/admin/ --debug

# Generate report
npx playwright test tests/e2e/admin/ && npx playwright show-report

# Check specific test
npx playwright test tests/e2e/admin/ -g "should create"

# Kill stuck test processes
pkill -f playwright
```

---

**Last Updated**: 2025-11-16
**Tests**: 154 total | Portfolio 32 | Lab 28 | Team 28 | Categories 24 | Tags 24 | Users 18
