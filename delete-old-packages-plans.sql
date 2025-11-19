-- ============================================
-- Delete old service packages and plans (PRODUCTION)
-- 일시: 2025-11-19
-- 목적: 잘못된 service_id로 생성된 데이터 삭제
-- ============================================

-- Step 1: 현재 데이터 확인
DO $$
DECLARE
  packages_count INTEGER;
  plans_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO packages_count FROM public.service_packages;
  SELECT COUNT(*) INTO plans_count FROM public.subscription_plans;

  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '삭제 전 데이터 현황:';
  RAISE NOTICE '  service_packages: % rows', packages_count;
  RAISE NOTICE '  subscription_plans: % rows', plans_count;
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
END $$;

-- Step 2: 모든 패키지 삭제
DELETE FROM public.service_packages;

-- Step 3: 모든 플랜 삭제
DELETE FROM public.subscription_plans;

-- Step 4: 삭제 후 확인
DO $$
DECLARE
  packages_count INTEGER;
  plans_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO packages_count FROM public.service_packages;
  SELECT COUNT(*) INTO plans_count FROM public.subscription_plans;

  RAISE NOTICE '';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '✅ 삭제 완료!';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '삭제 후 데이터 현황:';
  RAISE NOTICE '  service_packages: % rows', packages_count;
  RAISE NOTICE '  subscription_plans: % rows', plans_count;
  RAISE NOTICE '';
  RAISE NOTICE '📋 다음 단계:';
  RAISE NOTICE '1. insert-service-packages-plans.sql 실행';
  RAISE NOTICE '2. node scripts/check-service-data-detailed.cjs 검증';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
END $$;
