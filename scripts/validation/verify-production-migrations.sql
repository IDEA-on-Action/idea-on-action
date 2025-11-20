-- ================================================================
-- Production Migration Verification Script
-- ================================================================
-- Purpose: Verify that Newsletter Security and Function Search Path
--          migrations have been successfully applied to production DB
-- Date: 2025-11-21
-- Migrations Verified:
--   1. 20251121000000_fix_newsletter_security_issues.sql
--   2. 20251122000001_fix_critical_functions_search_path.sql
-- ================================================================

\set QUIET on
\pset footer off
\pset border 2

-- Set output format
\echo ''
\echo '================================================================'
\echo 'Production Migration Verification Report'
\echo 'Generated: ' `date`
\echo '================================================================'
\echo ''

-- ================================================================
-- PART 1: Newsletter Security Migration Verification
-- ================================================================

\echo '1. Newsletter Security Migration (20251121000000)'
\echo '   Testing 8 security controls...'
\echo ''

DO $$
DECLARE
  v_view_exists BOOLEAN;
  v_security_invoker BOOLEAN;
  v_auth_users_ref BOOLEAN;
  v_rls_policies_count INTEGER;
  v_anon_revoked BOOLEAN;
  v_subscribe_invoker BOOLEAN;
  v_unsubscribe_invoker BOOLEAN;
  v_admin_count_invoker BOOLEAN;
  v_total_checks INTEGER := 0;
  v_passed_checks INTEGER := 0;
BEGIN
  \echo '   Check 1/8: newsletter_subscribers view exists'
  -- 1. View exists
  SELECT EXISTS(
    SELECT 1 FROM pg_views
    WHERE schemaname = 'public'
    AND viewname = 'newsletter_subscribers'
  ) INTO v_view_exists;

  IF v_view_exists THEN
    v_passed_checks := v_passed_checks + 1;
    RAISE NOTICE '   ✅ PASS: newsletter_subscribers view exists';
  ELSE
    RAISE NOTICE '   ❌ FAIL: newsletter_subscribers view does not exist';
  END IF;
  v_total_checks := v_total_checks + 1;

  \echo '   Check 2/8: View has security_invoker = true'
  -- 2. View has security_invoker = true
  SELECT EXISTS(
    SELECT 1 FROM pg_views
    WHERE schemaname = 'public'
    AND viewname = 'newsletter_subscribers'
    AND definition LIKE '%security_invoker%'
  ) INTO v_security_invoker;

  IF v_security_invoker THEN
    v_passed_checks := v_passed_checks + 1;
    RAISE NOTICE '   ✅ PASS: View has security_invoker = true';
  ELSE
    RAISE NOTICE '   ❌ FAIL: View does not have security_invoker = true';
  END IF;
  v_total_checks := v_total_checks + 1;

  \echo '   Check 3/8: View does not reference auth.users'
  -- 3. View does not reference auth.users
  SELECT EXISTS(
    SELECT 1 FROM pg_views
    WHERE schemaname = 'public'
    AND viewname = 'newsletter_subscribers'
    AND definition LIKE '%auth.users%'
  ) INTO v_auth_users_ref;

  IF NOT v_auth_users_ref THEN
    v_passed_checks := v_passed_checks + 1;
    RAISE NOTICE '   ✅ PASS: View does not reference auth.users';
  ELSE
    RAISE NOTICE '   ❌ FAIL: View still references auth.users';
  END IF;
  v_total_checks := v_total_checks + 1;

  \echo '   Check 4/8: RLS policies count (expected: 3)'
  -- 4. RLS policies count
  SELECT COUNT(*) INTO v_rls_policies_count
  FROM pg_policies
  WHERE schemaname = 'public'
  AND tablename = 'newsletter_subscriptions';

  IF v_rls_policies_count = 3 THEN
    v_passed_checks := v_passed_checks + 1;
    RAISE NOTICE '   ✅ PASS: Found 3 RLS policies';
  ELSE
    RAISE NOTICE '   ❌ FAIL: Found % RLS policies (expected 3)', v_rls_policies_count;
  END IF;
  v_total_checks := v_total_checks + 1;

  \echo '   Check 5/8: Anonymous role has no privileges'
  -- 5. Anonymous role has no privileges
  SELECT NOT EXISTS(
    SELECT 1 FROM information_schema.table_privileges
    WHERE table_schema = 'public'
    AND table_name = 'newsletter_subscriptions'
    AND grantee = 'anon'
    AND privilege_type IN ('SELECT', 'INSERT', 'UPDATE', 'DELETE')
  ) INTO v_anon_revoked;

  IF v_anon_revoked THEN
    v_passed_checks := v_passed_checks + 1;
    RAISE NOTICE '   ✅ PASS: Anonymous role privileges revoked';
  ELSE
    RAISE NOTICE '   ❌ FAIL: Anonymous role still has privileges';
  END IF;
  v_total_checks := v_total_checks + 1;

  \echo '   Check 6/8: subscribe_to_newsletter uses SECURITY INVOKER'
  -- 6. subscribe_to_newsletter uses SECURITY INVOKER
  SELECT prosecdef = false INTO v_subscribe_invoker
  FROM pg_proc
  WHERE proname = 'subscribe_to_newsletter'
  AND pronamespace = 'public'::regnamespace;

  IF v_subscribe_invoker THEN
    v_passed_checks := v_passed_checks + 1;
    RAISE NOTICE '   ✅ PASS: subscribe_to_newsletter uses SECURITY INVOKER';
  ELSE
    RAISE NOTICE '   ❌ FAIL: subscribe_to_newsletter uses SECURITY DEFINER';
  END IF;
  v_total_checks := v_total_checks + 1;

  \echo '   Check 7/8: unsubscribe_from_newsletter uses SECURITY INVOKER'
  -- 7. unsubscribe_from_newsletter uses SECURITY INVOKER
  SELECT prosecdef = false INTO v_unsubscribe_invoker
  FROM pg_proc
  WHERE proname = 'unsubscribe_from_newsletter'
  AND pronamespace = 'public'::regnamespace;

  IF v_unsubscribe_invoker THEN
    v_passed_checks := v_passed_checks + 1;
    RAISE NOTICE '   ✅ PASS: unsubscribe_from_newsletter uses SECURITY INVOKER';
  ELSE
    RAISE NOTICE '   ❌ FAIL: unsubscribe_from_newsletter uses SECURITY DEFINER';
  END IF;
  v_total_checks := v_total_checks + 1;

  \echo '   Check 8/8: admin_get_newsletter_count uses SECURITY INVOKER'
  -- 8. admin_get_newsletter_count uses SECURITY INVOKER
  SELECT prosecdef = false INTO v_admin_count_invoker
  FROM pg_proc
  WHERE proname = 'admin_get_newsletter_count'
  AND pronamespace = 'public'::regnamespace;

  IF v_admin_count_invoker THEN
    v_passed_checks := v_passed_checks + 1;
    RAISE NOTICE '   ✅ PASS: admin_get_newsletter_count uses SECURITY INVOKER';
  ELSE
    RAISE NOTICE '   ❌ FAIL: admin_get_newsletter_count uses SECURITY DEFINER';
  END IF;
  v_total_checks := v_total_checks + 1;

  -- Summary
  RAISE NOTICE '';
  RAISE NOTICE '   Summary: %/% checks passed', v_passed_checks, v_total_checks;
  IF v_passed_checks = v_total_checks THEN
    RAISE NOTICE '   ✅ Newsletter Security Migration: VERIFIED';
  ELSE
    RAISE NOTICE '   ❌ Newsletter Security Migration: FAILED';
  END IF;
END $$;

\echo ''
\echo '================================================================'
\echo ''

-- ================================================================
-- PART 2: Function Search Path Migration Verification
-- ================================================================

\echo '2. Function Search Path Migration (20251122000001)'
\echo '   Testing 72 critical functions...'
\echo ''

DO $$
DECLARE
  v_critical_count INTEGER;
  v_critical_with_path INTEGER;
  v_trigger_count INTEGER;
  v_trigger_with_path INTEGER;
  v_total_functions INTEGER;
  v_total_with_path INTEGER;
BEGIN
  \echo '   Check 1/3: Critical functions (28 expected)'
  -- Critical functions (Admin, Auth, Revenue, Subscriptions, etc.)
  SELECT
    COUNT(*) as total,
    COUNT(CASE
      WHEN 'search_path=public, pg_temp' = ANY(p.proconfig)
      THEN 1
    END) as with_path
  INTO v_critical_count, v_critical_with_path
  FROM pg_proc p
  JOIN pg_namespace n ON p.pronamespace = n.oid
  WHERE n.nspname = 'public'
  AND p.proname IN (
    -- Admin functions
    'is_admin_user', 'can_admin_delete', 'check_admin_access',
    -- Auth functions
    'handle_new_user', 'assign_user_role', 'update_user_profile',
    -- Revenue functions
    'get_total_revenue', 'get_monthly_revenue', 'get_revenue_by_service',
    'get_revenue_trend', 'get_avg_transaction_value',
    -- Subscription functions
    'get_active_subscriptions_count', 'get_subscription_revenue',
    'get_subscription_growth_rate', 'get_churn_rate',
    -- Analytics functions
    'get_popular_services', 'get_conversion_rate', 'track_page_view',
    -- Newsletter functions
    'subscribe_to_newsletter', 'unsubscribe_from_newsletter',
    'admin_get_newsletter_count',
    -- Service functions
    'increment_service_view_count', 'get_service_analytics',
    -- Project functions
    'get_featured_projects', 'increment_project_view_count',
    -- Roadmap functions
    'get_active_roadmap_items', 'update_roadmap_progress'
  );

  IF v_critical_count = 28 AND v_critical_with_path = 28 THEN
    RAISE NOTICE '   ✅ PASS: All 28 critical functions have search_path';
  ELSE
    RAISE NOTICE '   ❌ FAIL: Critical functions: %/% have search_path (expected 28/28)',
      v_critical_with_path, v_critical_count;
  END IF;

  \echo '   Check 2/3: Trigger functions (44 expected)'
  -- Trigger functions
  SELECT
    COUNT(*) as total,
    COUNT(CASE
      WHEN 'search_path=public, pg_temp' = ANY(p.proconfig)
      THEN 1
    END) as with_path
  INTO v_trigger_count, v_trigger_with_path
  FROM pg_proc p
  JOIN pg_namespace n ON p.pronamespace = n.oid
  WHERE n.nspname = 'public'
  AND p.proname LIKE '%_trigger';

  IF v_trigger_with_path = v_trigger_count THEN
    RAISE NOTICE '   ✅ PASS: All %/% trigger functions have search_path',
      v_trigger_with_path, v_trigger_count;
  ELSE
    RAISE NOTICE '   ⚠️  WARN: Trigger functions: %/% have search_path',
      v_trigger_with_path, v_trigger_count;
  END IF;

  \echo '   Check 3/3: Total functions with search_path'
  -- Total summary
  v_total_functions := v_critical_count + v_trigger_count;
  v_total_with_path := v_critical_with_path + v_trigger_with_path;

  RAISE NOTICE '   Total: %/% functions have search_path',
    v_total_with_path, v_total_functions;

  IF v_total_with_path >= 72 THEN
    RAISE NOTICE '';
    RAISE NOTICE '   ✅ Function Search Path Migration: VERIFIED';
  ELSE
    RAISE NOTICE '';
    RAISE NOTICE '   ❌ Function Search Path Migration: FAILED';
    RAISE NOTICE '   Expected: 72+ functions, Found: %', v_total_with_path;
  END IF;
END $$;

\echo ''
\echo '================================================================'
\echo ''

-- ================================================================
-- PART 3: Additional Security Checks
-- ================================================================

\echo '3. Additional Security Checks'
\echo ''

-- Check for any remaining SECURITY DEFINER functions
\echo '   Check 1/2: Remaining SECURITY DEFINER functions'
SELECT
  COUNT(*) as definer_count,
  CASE
    WHEN COUNT(*) = 0 THEN '✅ PASS: No SECURITY DEFINER functions'
    ELSE '⚠️  WARN: ' || COUNT(*) || ' SECURITY DEFINER functions found'
  END as status
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.prosecdef = true;

-- Check for views without security_invoker
\echo '   Check 2/2: Views with security_invoker'
SELECT
  COUNT(*) as total_views,
  COUNT(CASE
    WHEN definition LIKE '%security_invoker%'
    THEN 1
  END) as secure_views,
  CASE
    WHEN COUNT(*) = COUNT(CASE WHEN definition LIKE '%security_invoker%' THEN 1 END)
    THEN '✅ PASS: All views have security_invoker'
    ELSE '⚠️  WARN: Some views missing security_invoker'
  END as status
FROM pg_views
WHERE schemaname = 'public';

\echo ''
\echo '================================================================'
\echo 'Verification Complete'
\echo '================================================================'
\echo ''

-- Reset output format
\set QUIET off
\pset footer on
