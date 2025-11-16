# User Value Fields Migration Guide

**Migration File**: `20251116120000_add_user_value_fields.sql`
**Created**: 2025-11-16
**Status**: Ready for Production
**Impact**: Low (Backward Compatible, Optional Fields)

---

## Overview

This migration adds user-centric storytelling fields to the `roadmap` and `projects` tables, enabling the Roadmap and Portfolio pages to communicate user benefits and business impact more effectively.

### What's Added

#### Roadmap Table
- `user_benefits` (JSONB, default `[]`) - Array of user-facing benefits
- `stability_score` (INTEGER, default 99) - Service reliability score (0-100)
- GIN index on `user_benefits` for efficient JSON queries
- Check constraint on `stability_score` (0-100 range)

#### Projects Table
- `problem` (TEXT) - User problem statement
- `solution` (TEXT) - How the project solves it
- `impact` (JSONB, default `{}`) - Business impact metrics
- GIN index on `impact` for efficient JSON queries

### Design Principles

1. **Backward Compatible**: All fields are optional with default values
2. **Non-Breaking**: Existing queries continue to work
3. **Performance**: GIN indexes for JSON field queries
4. **Validation**: Check constraints ensure data integrity

---

## Pre-Migration Checklist

Before applying this migration to production, verify:

- [ ] **Backup**: Full database backup completed
- [ ] **Testing**: Migration tested on local/staging environment
- [ ] **Dependencies**: No conflicting migrations pending
- [ ] **RLS Policies**: Existing RLS policies will apply to new fields
- [ ] **TypeScript**: Types updated in `src/types/v2.ts`
- [ ] **Application Code**: No hardcoded queries relying on old schema

---

## Migration Methods

### Method 1: Supabase CLI (Recommended)

```bash
# 1. Pull latest migrations from remote
supabase db pull

# 2. Apply migration locally (Docker Desktop required)
supabase db reset

# 3. Test the migration
npm run test:e2e

# 4. Push to production
supabase db push
```

### Method 2: Supabase Dashboard (GUI)

1. Navigate to: https://supabase.com/dashboard/project/[PROJECT_ID]/sql
2. Copy contents of `supabase/migrations/20251116120000_add_user_value_fields.sql`
3. Paste into SQL editor
4. Click "Run" button
5. Verify success message

### Method 3: Direct psql (Advanced)

```bash
# Connect to production database
psql postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres

# Run migration
\i supabase/migrations/20251116120000_add_user_value_fields.sql

# Verify
\d roadmap
\d projects
```

---

## Verification Steps

### 1. Check Column Existence

```sql
-- Verify roadmap columns
SELECT
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'roadmap'
  AND column_name IN ('user_benefits', 'stability_score')
ORDER BY ordinal_position;

-- Verify projects columns
SELECT
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'projects'
  AND column_name IN ('problem', 'solution', 'impact')
ORDER BY ordinal_position;
```

**Expected Output**:
```
roadmap columns:
  user_benefits  | jsonb   | '[]'::jsonb | YES
  stability_score | integer | 99          | YES

projects columns:
  problem  | text  | NULL       | YES
  solution | text  | NULL       | YES
  impact   | jsonb | '{}'::jsonb | YES
```

### 2. Check Indexes

```sql
-- Verify GIN indexes
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename IN ('roadmap', 'projects')
  AND indexdef LIKE '%GIN%';
```

**Expected Output**:
```
idx_roadmap_user_benefits | CREATE INDEX idx_roadmap_user_benefits ON public.roadmap USING gin (user_benefits)
idx_projects_impact       | CREATE INDEX idx_projects_impact ON public.projects USING gin (impact)
```

### 3. Test Data Insert

```sql
-- Test roadmap insert
INSERT INTO roadmap (quarter, theme, progress, user_benefits, stability_score)
VALUES (
  'Q1 2025',
  'Test Migration',
  50,
  '["빠른 로딩", "안정적인 서비스"]'::jsonb,
  99
) RETURNING id, user_benefits, stability_score;

-- Test projects insert
INSERT INTO projects (slug, title, summary, status, category, problem, solution, impact)
VALUES (
  'test-migration',
  'Test Project',
  'Testing migration',
  'in-progress',
  'platform',
  '포트폴리오 웹사이트가 없었어요',
  'React + Supabase로 풀스택 웹사이트 구축',
  '{"users": "월 1,200명", "satisfaction": "4.9/5.0"}'::jsonb
) RETURNING id, problem, solution, impact;

-- Cleanup test data
DELETE FROM roadmap WHERE theme = 'Test Migration';
DELETE FROM projects WHERE slug = 'test-migration';
```

### 4. Check RLS Policies

```sql
-- Verify RLS policies still work
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN ('roadmap', 'projects')
ORDER BY tablename, policyname;
```

**Expected**: Existing RLS policies should automatically apply to new columns.

---

## Data Population Guide

### Example 1: Roadmap User Benefits

```sql
-- Update CMS Phase 4 roadmap item
UPDATE roadmap
SET
  user_benefits = jsonb_build_array(
    '관리자 페이지로 블로그 글 직접 작성 가능',
    '이미지 업로드 자동화',
    '실시간 미리보기 지원'
  ),
  stability_score = 99
WHERE theme LIKE '%CMS Phase 4%';
```

### Example 2: Project Storytelling

```sql
-- Update IDEA on Action homepage project
UPDATE projects
SET
  problem = '프리랜서 개발자가 포트폴리오를 보여줄 웹사이트가 없었어요',
  solution = 'React + Supabase + Vite 기반 풀스택 웹사이트를 3주 만에 구축했습니다',
  impact = jsonb_build_object(
    'users', '월 1,200명 방문',
    'timeSaved', '수작업 대비 80% 시간 절감',
    'satisfaction', '4.9/5.0',
    'engagement', '평균 체류 시간 3분 12초'
  )
WHERE slug = 'homepage-2025';
```

### Admin Page Integration

After migration, you can edit these fields in the Admin panel:

**Roadmap Admin** (`/admin/roadmap`):
- "User Benefits" field (JSON array editor)
- "Stability Score" field (0-100 slider)

**Portfolio Admin** (`/admin/portfolio`):
- "Problem" field (textarea)
- "Solution" field (textarea)
- "Impact" field (JSON editor with keys: users, timeSaved, satisfaction, revenue)

---

## Rollback Scenarios

### Scenario 1: Immediate Rollback (Before Production Use)

```sql
-- Remove columns (safe if no data yet)
ALTER TABLE roadmap DROP COLUMN IF EXISTS user_benefits;
ALTER TABLE roadmap DROP COLUMN IF EXISTS stability_score;
ALTER TABLE projects DROP COLUMN IF EXISTS problem;
ALTER TABLE projects DROP COLUMN IF EXISTS solution;
ALTER TABLE projects DROP COLUMN IF EXISTS impact;

-- Drop indexes
DROP INDEX IF EXISTS idx_roadmap_user_benefits;
DROP INDEX IF EXISTS idx_projects_impact;

-- Drop constraints
ALTER TABLE roadmap DROP CONSTRAINT IF EXISTS chk_roadmap_stability_score;
```

### Scenario 2: Delayed Rollback (After Data Exists)

```sql
-- 1. Backup data first
CREATE TABLE roadmap_backup AS
  SELECT id, user_benefits, stability_score
  FROM roadmap
  WHERE user_benefits IS NOT NULL OR stability_score IS NOT NULL;

CREATE TABLE projects_backup AS
  SELECT id, problem, solution, impact
  FROM projects
  WHERE problem IS NOT NULL OR solution IS NOT NULL OR impact IS NOT NULL;

-- 2. Then drop columns
ALTER TABLE roadmap DROP COLUMN user_benefits;
ALTER TABLE roadmap DROP COLUMN stability_score;
ALTER TABLE projects DROP COLUMN problem;
ALTER TABLE projects DROP COLUMN solution;
ALTER TABLE projects DROP COLUMN impact;

-- 3. Restore from backup if needed
ALTER TABLE roadmap ADD COLUMN user_benefits JSONB;
UPDATE roadmap r
SET user_benefits = rb.user_benefits
FROM roadmap_backup rb
WHERE r.id = rb.id;
```

### Scenario 3: Verification Failed

If verification queries fail:

1. **Check migration logs**:
   ```sql
   SELECT * FROM supabase_migrations.schema_migrations
   ORDER BY version DESC LIMIT 5;
   ```

2. **Re-run verification**:
   ```sql
   \i supabase/migrations/20251116120000_add_user_value_fields.sql
   ```

3. **Contact support** if errors persist

---

## Troubleshooting

### Issue 1: Permission Denied

**Error**: `ERROR: permission denied for table roadmap`

**Solution**:
```sql
-- Grant permissions to anon/authenticated roles
GRANT SELECT ON roadmap TO anon, authenticated;
GRANT SELECT ON projects TO anon, authenticated;

-- If using service_role
GRANT ALL ON roadmap TO service_role;
GRANT ALL ON projects TO service_role;
```

### Issue 2: RLS Policy Blocking Inserts

**Error**: `ERROR: new row violates row-level security policy`

**Solution**:
```sql
-- Check existing RLS policies
SELECT * FROM pg_policies WHERE tablename = 'roadmap';

-- Ensure admin users can insert
CREATE POLICY IF NOT EXISTS "Admins can insert roadmap"
  ON roadmap FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());
```

### Issue 3: JSON Validation Errors

**Error**: `ERROR: invalid input syntax for type json`

**Solution**:
```sql
-- Use jsonb_build_array for arrays
UPDATE roadmap
SET user_benefits = jsonb_build_array('benefit1', 'benefit2')
WHERE id = 1;

-- Use jsonb_build_object for objects
UPDATE projects
SET impact = jsonb_build_object('users', '1000', 'satisfaction', '4.5')
WHERE id = 1;
```

### Issue 4: Index Not Created

**Error**: GIN index missing in `pg_indexes`

**Solution**:
```sql
-- Manually create index
CREATE INDEX idx_roadmap_user_benefits
  ON public.roadmap USING GIN (user_benefits);

CREATE INDEX idx_projects_impact
  ON public.projects USING GIN (impact);

-- Verify
\d+ roadmap
\d+ projects
```

### Issue 5: TypeScript Type Errors

**Error**: `Property 'user_benefits' does not exist on type 'Roadmap'`

**Solution**:
1. Verify `src/types/v2.ts` has been updated
2. Restart TypeScript server (VS Code: Cmd+Shift+P → "Restart TS Server")
3. Clear cache: `npm run build -- --force`

---

## Performance Impact

### Expected Performance
- **GIN Indexes**: Queries on `user_benefits` and `impact` will be fast (< 50ms)
- **Null Checks**: Minimal overhead for optional fields
- **RLS Policies**: No additional latency

### Monitoring Queries

```sql
-- Check index usage
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE indexname IN ('idx_roadmap_user_benefits', 'idx_projects_impact');

-- Check table size impact
SELECT
  pg_size_pretty(pg_total_relation_size('roadmap')) AS roadmap_size,
  pg_size_pretty(pg_total_relation_size('projects')) AS projects_size;
```

---

## Post-Migration Tasks

After successful migration:

- [ ] **Update Admin UI**: Add form fields for new columns
- [ ] **Update Documentation**: Update API docs with new fields
- [ ] **Populate Data**: Fill in user benefits for top 10 roadmap items
- [ ] **Monitor Performance**: Check query performance for 1 week
- [ ] **User Testing**: Verify Roadmap/Portfolio pages display correctly
- [ ] **Changelog**: Add migration to `docs/project/changelog.md`

---

## Related Files

- **Migration**: `supabase/migrations/20251116120000_add_user_value_fields.sql`
- **Types**: `src/types/v2.ts` (Roadmap, Project interfaces)
- **Database Schema**: `supabase/schema.sql`
- **Admin Pages**:
  - `src/pages/admin/AdminRoadmap.tsx`
  - `src/pages/admin/AdminPortfolio.tsx`

---

## FAQ

### Q1: Are these fields required?
**A**: No, all fields are optional with default values. Existing data continues to work.

### Q2: What happens to existing data?
**A**: Nothing. Existing rows will have default values (`[]` for arrays, `99` for stability_score, `NULL` for text fields).

### Q3: Can I add data later?
**A**: Yes, you can populate these fields anytime via SQL or Admin UI.

### Q4: Will this break my app?
**A**: No, this is a backward-compatible migration. TypeScript types are optional (`?:`).

### Q5: How do I validate JSON data?
**A**: Use `jsonb_build_array()` and `jsonb_build_object()` functions for safe JSON construction.

---

## Contact

For migration issues or questions:
- **Developer**: 서민원 (sinclairseo@gmail.com)
- **Documentation**: `docs/guides/database/`
- **GitHub Issues**: https://github.com/IDEA-on-Action/idea-on-action/issues
