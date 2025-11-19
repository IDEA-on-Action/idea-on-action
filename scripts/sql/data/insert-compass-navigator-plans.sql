-- ============================================
-- COMPASS Navigator 정기구독 플랜 추가
-- 일시: 2025-11-19
-- 목적: 토스페이먼츠 심사용 COMPASS Navigator 플랜 데이터
-- 참고: AI 기반 워크플로우 자동화 플랫폼
-- ============================================

-- ============================================
-- Step 1: 서비스 정보 확인
-- ============================================
DO $$
DECLARE
  service_record RECORD;
  existing_plans_count INTEGER;
BEGIN
  -- COMPASS Navigator 서비스 조회
  SELECT * INTO service_record
  FROM public.services
  WHERE id = 'fed76f94-b3a0-4c88-9540-cf3f98ef354c';

  -- 기존 플랜 개수 확인
  SELECT COUNT(*) INTO existing_plans_count
  FROM public.subscription_plans
  WHERE service_id = 'fed76f94-b3a0-4c88-9540-cf3f98ef354c';

  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '🧭 COMPASS Navigator 서비스 정보:';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE 'Title: %', service_record.title;
  RAISE NOTICE 'ID: %', service_record.id;
  RAISE NOTICE 'Status: %', service_record.status;
  RAISE NOTICE '기존 플랜 개수: %', existing_plans_count;
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
END $$;

-- ============================================
-- Step 2: 기존 플랜 삭제 (중복 방지)
-- ============================================
DELETE FROM public.subscription_plans
WHERE service_id = 'fed76f94-b3a0-4c88-9540-cf3f98ef354c';

-- ============================================
-- Step 3: 베이직 플랜 (개인/소규모 팀)
-- ============================================
INSERT INTO public.subscription_plans (
  service_id,
  plan_name,
  billing_cycle,
  price,
  features,
  is_popular,
  display_order
)
VALUES (
  'fed76f94-b3a0-4c88-9540-cf3f98ef354c',
  '베이직',
  'monthly',
  50000,
  '[
    {"icon": "Check", "text": "개인 사용자 1명"},
    {"icon": "Check", "text": "월 100개 자동화 작업"},
    {"icon": "Check", "text": "기본 워크플로우 템플릿 10개"},
    {"icon": "Check", "text": "이메일 알림"},
    {"icon": "Check", "text": "커뮤니티 지원 (48시간 응답)"},
    {"icon": "Check", "text": "14일 무료 체험"}
  ]'::jsonb,
  false,
  1
);

-- ============================================
-- Step 4: 프로 플랜 (중소기업) - 인기 플랜
-- ============================================
INSERT INTO public.subscription_plans (
  service_id,
  plan_name,
  billing_cycle,
  price,
  features,
  is_popular,
  display_order
)
VALUES (
  'fed76f94-b3a0-4c88-9540-cf3f98ef354c',
  '프로',
  'monthly',
  150000,
  '[
    {"icon": "Check", "text": "팀 사용자 10명"},
    {"icon": "Check", "text": "월 1,000개 자동화 작업"},
    {"icon": "Check", "text": "고급 워크플로우 템플릿 50개"},
    {"icon": "Check", "text": "사용자 정의 워크플로우 빌더"},
    {"icon": "Check", "text": "Slack/Teams 연동"},
    {"icon": "Check", "text": "이메일 + Slack 알림"},
    {"icon": "Check", "text": "우선 지원 (24시간 응답)"},
    {"icon": "Check", "text": "분석 대시보드"},
    {"icon": "Check", "text": "14일 무료 체험"}
  ]'::jsonb,
  true,
  2
);

-- ============================================
-- Step 5: 엔터프라이즈 플랜 (대기업)
-- ============================================
INSERT INTO public.subscription_plans (
  service_id,
  plan_name,
  billing_cycle,
  price,
  features,
  is_popular,
  display_order
)
VALUES (
  'fed76f94-b3a0-4c88-9540-cf3f98ef354c',
  '엔터프라이즈',
  'monthly',
  500000,
  '[
    {"icon": "Check", "text": "무제한 사용자"},
    {"icon": "Check", "text": "무제한 자동화 작업"},
    {"icon": "Check", "text": "모든 워크플로우 템플릿"},
    {"icon": "Check", "text": "AI 기반 맞춤형 워크플로우 자동 생성"},
    {"icon": "Check", "text": "전사 시스템 통합 (ERP, CRM, HRIS)"},
    {"icon": "Check", "text": "전담 계정 매니저"},
    {"icon": "Check", "text": "24/7 긴급 지원 (1시간 응답)"},
    {"icon": "Check", "text": "고급 분석 및 리포팅"},
    {"icon": "Check", "text": "온프레미스 배포 옵션"},
    {"icon": "Check", "text": "맞춤형 SLA"},
    {"icon": "Check", "text": "14일 무료 체험"}
  ]'::jsonb,
  false,
  3
);

-- ============================================
-- Step 6: 검증
-- ============================================
DO $$
DECLARE
  plans_count INTEGER;
  basic_plan RECORD;
  pro_plan RECORD;
  enterprise_plan RECORD;
BEGIN
  -- 전체 플랜 개수
  SELECT COUNT(*) INTO plans_count
  FROM public.subscription_plans
  WHERE service_id = 'fed76f94-b3a0-4c88-9540-cf3f98ef354c';

  -- 각 플랜 정보
  SELECT * INTO basic_plan FROM public.subscription_plans
  WHERE service_id = 'fed76f94-b3a0-4c88-9540-cf3f98ef354c'
    AND plan_name = '베이직' LIMIT 1;

  SELECT * INTO pro_plan FROM public.subscription_plans
  WHERE service_id = 'fed76f94-b3a0-4c88-9540-cf3f98ef354c'
    AND plan_name = '프로' LIMIT 1;

  SELECT * INTO enterprise_plan FROM public.subscription_plans
  WHERE service_id = 'fed76f94-b3a0-4c88-9540-cf3f98ef354c'
    AND plan_name = '엔터프라이즈' LIMIT 1;

  RAISE NOTICE '';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '✅ COMPASS Navigator 플랜 추가 완료!';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '총 플랜 개수: % (예상: 3)', plans_count;
  RAISE NOTICE '';
  RAISE NOTICE '플랜 상세:';
  RAISE NOTICE '  1. 베이직: ₩%/월 (% features)', basic_plan.price, jsonb_array_length(basic_plan.features);
  RAISE NOTICE '  2. 프로: ₩%/월 (% features) %', pro_plan.price, jsonb_array_length(pro_plan.features),
    CASE WHEN pro_plan.is_popular THEN '⭐ 인기' ELSE '' END;
  RAISE NOTICE '  3. 엔터프라이즈: ₩%/월 (% features)', enterprise_plan.price, jsonb_array_length(enterprise_plan.features);
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '';
  RAISE NOTICE '📋 다음 단계:';
  RAISE NOTICE '1. 검증: node scripts/check-compass-service.cjs';
  RAISE NOTICE '2. 브라우저: https://www.ideaonaction.ai/services/fed76f94-b3a0-4c88-9540-cf3f98ef354c';
  RAISE NOTICE '3. 장바구니 버튼 확인 (프로 플랜에 ⭐ 인기 배지)';
  RAISE NOTICE '';
  RAISE NOTICE '💡 Tip: slug가 NULL이므로 URL이 UUID 형태입니다.';
  RAISE NOTICE '    더 나은 URL을 원하면 services 테이블의 slug 컬럼을 "compass-navigator"로 업데이트하세요.';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
END $$;
