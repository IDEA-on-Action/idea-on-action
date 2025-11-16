-- ============================================================
-- Verification Script: User Value Fields Migration
-- ============================================================
-- Migration: 20251116120000_add_user_value_fields.sql
-- Purpose: Verify all columns, indexes, and constraints exist
-- ============================================================

\echo '================================================================='
\echo 'User Value Fields Migration Verification'
\echo '================================================================='
\echo ''

-- 1. Check roadmap columns
\echo '1. Roadmap Table Columns:'
\echo '-------------------------'

SELECT
  column_name,
  data_type,
  column_default,
  is_nullable,
  character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'roadmap'
  AND column_name IN ('user_benefits', 'stability_score')
ORDER BY ordinal_position;

\echo ''

-- 2. Check projects columns
\echo '2. Projects Table Columns:'
\echo '-------------------------'

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

\echo ''

-- 3. Check indexes
\echo '3. GIN Indexes:'
\echo '-------------------------'

SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname IN ('idx_roadmap_user_benefits', 'idx_projects_impact')
ORDER BY tablename, indexname;

\echo ''

-- 4. Check constraints
\echo '4. Check Constraints:'
\echo '-------------------------'

SELECT
  conname AS constraint_name,
  conrelid::regclass AS table_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conname = 'chk_roadmap_stability_score'
  AND conrelid = 'public.roadmap'::regclass;

\echo ''

-- 5. Check column comments
\echo '5. Column Comments:'
\echo '-------------------------'

SELECT
  col.table_name,
  col.column_name,
  pg_catalog.col_description(
    (quote_ident(col.table_schema)||'.'||quote_ident(col.table_name))::regclass::oid,
    col.ordinal_position
  ) AS column_comment
FROM information_schema.columns col
WHERE col.table_schema = 'public'
  AND col.table_name IN ('roadmap', 'projects')
  AND col.column_name IN ('user_benefits', 'stability_score', 'problem', 'solution', 'impact')
ORDER BY col.table_name, col.ordinal_position;

\echo ''

-- 6. Sample data check
\echo '6. Sample Data (if exists):'
\echo '-------------------------'

-- Check roadmap with user_benefits
SELECT
  id,
  theme,
  user_benefits,
  stability_score
FROM roadmap
WHERE user_benefits IS NOT NULL
   OR stability_score IS NOT NULL
LIMIT 3;

\echo ''

-- Check projects with storytelling fields
SELECT
  id,
  title,
  SUBSTRING(problem, 1, 50) AS problem_preview,
  SUBSTRING(solution, 1, 50) AS solution_preview,
  impact
FROM projects
WHERE problem IS NOT NULL
   OR solution IS NOT NULL
   OR impact IS NOT NULL
LIMIT 3;

\echo ''

-- 7. Statistics
\echo '7. Data Statistics:'
\echo '-------------------------'

SELECT
  'roadmap' AS table_name,
  COUNT(*) AS total_rows,
  COUNT(user_benefits) FILTER (WHERE user_benefits != '[]'::jsonb) AS rows_with_benefits,
  COUNT(stability_score) FILTER (WHERE stability_score != 99) AS rows_with_custom_score
FROM roadmap
UNION ALL
SELECT
  'projects' AS table_name,
  COUNT(*) AS total_rows,
  COUNT(problem) AS rows_with_problem,
  COUNT(solution) AS rows_with_solution
FROM projects;

\echo ''

-- 8. Index usage stats
\echo '8. Index Usage Statistics:'
\echo '-------------------------'

SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan AS index_scans,
  idx_tup_read AS tuples_read,
  idx_tup_fetch AS tuples_fetched
FROM pg_stat_user_indexes
WHERE indexname IN ('idx_roadmap_user_benefits', 'idx_projects_impact')
ORDER BY tablename, indexname;

\echo ''

-- 9. Table size impact
\echo '9. Table Size:'
\echo '-------------------------'

SELECT
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS indexes_size
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('roadmap', 'projects')
ORDER BY tablename;

\echo ''
\echo '================================================================='
\echo 'Verification Complete'
\echo '================================================================='
\echo ''
\echo 'Expected Results:'
\echo '  - roadmap: user_benefits (jsonb), stability_score (integer)'
\echo '  - projects: problem (text), solution (text), impact (jsonb)'
\echo '  - 2 GIN indexes created'
\echo '  - 1 check constraint on stability_score (0-100)'
\echo '  - Column comments present'
\echo ''
\echo 'If any checks fail, review the migration script:'
\echo '  supabase/migrations/20251116120000_add_user_value_fields.sql'
\echo '================================================================='
