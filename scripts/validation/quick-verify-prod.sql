-- ================================================================
-- Quick Production Migration Verification (5 minutes)
-- ================================================================
-- Purpose: Fast verification of critical migration points
-- Run time: ~30 seconds
-- ================================================================

\set QUIET on
\pset border 0
\pset footer off

\echo ''
\echo '🔍 Quick Production Migration Verification'
\echo '==========================================='
\echo ''

-- Newsletter Security (5 critical checks)
\echo '📧 Newsletter Security:'
SELECT
  CASE
    WHEN EXISTS(
      SELECT 1 FROM pg_views
      WHERE schemaname = 'public'
      AND viewname = 'newsletter_subscribers'
    )
    THEN '✅ View exists'
    ELSE '❌ View missing'
  END as check_1;

SELECT
  CASE
    WHEN EXISTS(
      SELECT 1 FROM pg_views
      WHERE schemaname = 'public'
      AND viewname = 'newsletter_subscribers'
      AND definition NOT LIKE '%auth.users%'
    )
    THEN '✅ No auth.users exposure'
    ELSE '❌ auth.users still exposed'
  END as check_2;

SELECT
  CASE
    WHEN COUNT(*) = 3
    THEN '✅ 3 RLS policies'
    ELSE '❌ RLS policies: ' || COUNT(*)::text
  END as check_3
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'newsletter_subscriptions';

SELECT
  CASE
    WHEN COUNT(*) = 0
    THEN '✅ No DEFINER functions'
    ELSE '❌ DEFINER functions: ' || COUNT(*)::text
  END as check_4
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.prosecdef = true
AND p.proname IN ('subscribe_to_newsletter', 'unsubscribe_from_newsletter', 'admin_get_newsletter_count');

SELECT
  CASE
    WHEN NOT EXISTS(
      SELECT 1 FROM information_schema.table_privileges
      WHERE table_schema = 'public'
      AND table_name = 'newsletter_subscriptions'
      AND grantee = 'anon'
    )
    THEN '✅ Anonymous access revoked'
    ELSE '❌ Anonymous still has access'
  END as check_5;

\echo ''
\echo '🔧 Function Search Path:'

-- Function Search Path (2 critical checks)
SELECT
  CASE
    WHEN COUNT(CASE
      WHEN 'search_path=public, pg_temp' = ANY(p.proconfig)
      THEN 1
    END) >= 28
    THEN '✅ Critical functions: ' || COUNT(CASE WHEN 'search_path=public, pg_temp' = ANY(p.proconfig) THEN 1 END)::text || '/28+'
    ELSE '❌ Critical functions: ' || COUNT(CASE WHEN 'search_path=public, pg_temp' = ANY(p.proconfig) THEN 1 END)::text || '/28'
  END as check_6
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname IN (
  'is_admin_user', 'can_admin_delete', 'check_admin_access',
  'handle_new_user', 'assign_user_role', 'update_user_profile',
  'get_total_revenue', 'get_monthly_revenue', 'get_revenue_by_service',
  'subscribe_to_newsletter', 'unsubscribe_from_newsletter',
  'increment_service_view_count', 'get_service_analytics'
);

SELECT
  CASE
    WHEN COUNT(CASE
      WHEN 'search_path=public, pg_temp' = ANY(p.proconfig)
      THEN 1
    END) >= 40
    THEN '✅ Trigger functions: ' || COUNT(CASE WHEN 'search_path=public, pg_temp' = ANY(p.proconfig) THEN 1 END)::text || '/44+'
    ELSE '⚠️  Trigger functions: ' || COUNT(CASE WHEN 'search_path=public, pg_temp' = ANY(p.proconfig) THEN 1 END)::text || '/44'
  END as check_7
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname LIKE '%_trigger';

\echo ''
\echo '📊 Overall Status:'

-- Overall status
SELECT
  CASE
    WHEN (
      -- Newsletter checks (5)
      (SELECT COUNT(*) FROM pg_views
       WHERE schemaname = 'public'
       AND viewname = 'newsletter_subscribers') = 1
      AND
      (SELECT COUNT(*) FROM pg_views
       WHERE schemaname = 'public'
       AND viewname = 'newsletter_subscribers'
       AND definition NOT LIKE '%auth.users%') = 1
      AND
      (SELECT COUNT(*) FROM pg_policies
       WHERE schemaname = 'public'
       AND tablename = 'newsletter_subscriptions') = 3
      AND
      (SELECT COUNT(*) FROM pg_proc p
       JOIN pg_namespace n ON p.pronamespace = n.oid
       WHERE n.nspname = 'public'
       AND p.prosecdef = true
       AND p.proname IN ('subscribe_to_newsletter', 'unsubscribe_from_newsletter')) = 0
      AND
      NOT EXISTS(
        SELECT 1 FROM information_schema.table_privileges
        WHERE table_schema = 'public'
        AND table_name = 'newsletter_subscriptions'
        AND grantee = 'anon'
      )
      -- Function Search Path checks (2)
      AND
      (SELECT COUNT(CASE WHEN 'search_path=public, pg_temp' = ANY(p.proconfig) THEN 1 END)
       FROM pg_proc p
       JOIN pg_namespace n ON p.pronamespace = n.oid
       WHERE n.nspname = 'public') >= 72
    )
    THEN '✅ ALL MIGRATIONS VERIFIED'
    ELSE '❌ SOME CHECKS FAILED - Run full verification'
  END as final_status;

\echo ''
\echo '==========================================='
\echo ''

-- Reset
\set QUIET off
\pset footer on
\pset border 2
