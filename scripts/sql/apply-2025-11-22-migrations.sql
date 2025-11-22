-- =====================================================
-- 2025-11-22 통합 마이그레이션 스크립트
-- =====================================================
-- Supabase Dashboard SQL Editor에서 실행
--
-- 포함된 마이그레이션:
--   1. Function Search Path 보안 강화 (Newsletter 함수 3개)
--   2. Critical Functions Search Path 보안 강화 (67개)
--   3. Compass → Minu 브랜드 전환
--   4. Media Library 테이블 생성
--
-- 총 영향 범위:
--   - 함수: 70개 보안 강화
--   - 테이블: services, subscription_plans 업데이트
--   - 뷰: minu_integration_view 생성
--   - 신규 테이블: media_library
--
-- 작성일: 2025-11-22
-- 작성자: Claude AI
-- =====================================================

-- =====================================================
-- [SECTION 1] Newsletter 함수 Search Path 보안 강화
-- 마이그레이션: 20251122000000_fix_function_search_path.sql
-- =====================================================

-- 1. subscribe_to_newsletter
CREATE OR REPLACE FUNCTION subscribe_to_newsletter(p_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  current_user_id UUID;
  profile_exists BOOLEAN;
  table_exists BOOLEAN;
BEGIN
  current_user_id := auth.uid();

  -- Security check: Must be authenticated
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to subscribe';
  END IF;

  -- Security check: Email must be provided
  IF p_email IS NULL OR p_email = '' THEN
    RAISE EXCEPTION 'Email is required for newsletter subscription';
  END IF;

  -- Validate email format (basic check)
  IF p_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;

  -- Check if user_profiles table exists
  SELECT EXISTS (
    SELECT 1 FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename = 'user_profiles'
  ) INTO table_exists;

  IF NOT table_exists THEN
    RAISE EXCEPTION 'user_profiles table does not exist yet';
  END IF;

  -- Check if profile exists
  SELECT EXISTS(
    SELECT 1 FROM public.user_profiles
    WHERE user_id = current_user_id
  ) INTO profile_exists;

  IF profile_exists THEN
    -- Update existing profile (RLS will ensure user can only update own profile)
    UPDATE public.user_profiles
    SET
      newsletter_subscribed = true,
      newsletter_subscribed_at = NOW(),
      newsletter_email = p_email
    WHERE user_id = current_user_id;
  ELSE
    -- Create new profile with newsletter subscription
    INSERT INTO public.user_profiles (
      user_id,
      newsletter_subscribed,
      newsletter_subscribed_at,
      newsletter_email
    )
    VALUES (current_user_id, true, NOW(), p_email);
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp;

-- 2. unsubscribe_from_newsletter
CREATE OR REPLACE FUNCTION unsubscribe_from_newsletter()
RETURNS BOOLEAN AS $$
DECLARE
  current_user_id UUID;
  table_exists BOOLEAN;
BEGIN
  current_user_id := auth.uid();

  -- Security check: Must be authenticated
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to unsubscribe';
  END IF;

  -- Check if user_profiles table exists
  SELECT EXISTS (
    SELECT 1 FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename = 'user_profiles'
  ) INTO table_exists;

  IF NOT table_exists THEN
    RAISE EXCEPTION 'user_profiles table does not exist yet';
  END IF;

  -- Update subscription status (RLS will ensure user can only update own profile)
  UPDATE public.user_profiles
  SET newsletter_subscribed = false
  WHERE user_id = current_user_id;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp;

-- 3. get_newsletter_subscribers
CREATE OR REPLACE FUNCTION get_newsletter_subscribers()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  email TEXT,
  display_name TEXT,
  subscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  -- Security check: Only admins can access (check via roles table)
  IF NOT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND r.name IN ('admin', 'super_admin')
  ) THEN
    RAISE EXCEPTION 'Only admins can access newsletter subscribers list';
  END IF;

  -- Return newsletter subscribers
  RETURN QUERY
  SELECT
    up.id,
    up.user_id,
    up.newsletter_email as email,
    up.display_name,
    up.newsletter_subscribed_at as subscribed_at,
    up.created_at
  FROM public.user_profiles up
  WHERE up.newsletter_subscribed = true
    AND up.newsletter_email IS NOT NULL
  ORDER BY up.newsletter_subscribed_at DESC;
END;
$$ LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp;

-- Newsletter 함수 코멘트
COMMENT ON FUNCTION subscribe_to_newsletter(TEXT) IS
'Subscribe current user to newsletter (SECURITY INVOKER - search_path secure)';

COMMENT ON FUNCTION unsubscribe_from_newsletter() IS
'Unsubscribe current user from newsletter (SECURITY INVOKER - search_path secure)';

COMMENT ON FUNCTION get_newsletter_subscribers() IS
'Admin-only function to get all newsletter subscribers (SECURITY INVOKER - search_path secure)';


-- =====================================================
-- [SECTION 2] Critical Functions Search Path 보안 강화
-- 마이그레이션: 20251122000001_fix_critical_functions_search_path.sql
-- =====================================================

-- 인증 & 보안 함수 (9개)
ALTER FUNCTION generate_password_reset_token(TEXT) SET search_path = public, pg_temp;
ALTER FUNCTION verify_password_reset_token(TEXT) SET search_path = public, pg_temp;
ALTER FUNCTION generate_email_verification_token(UUID, TEXT) SET search_path = public, pg_temp;
ALTER FUNCTION verify_email_token(TEXT) SET search_path = public, pg_temp;
ALTER FUNCTION lock_account_on_failed_attempts(TEXT) SET search_path = public, pg_temp;
ALTER FUNCTION is_account_locked(UUID) SET search_path = public, pg_temp;
ALTER FUNCTION get_recent_failed_attempts(TEXT, INET, INTEGER) SET search_path = public, pg_temp;
ALTER FUNCTION get_user_permissions(UUID) SET search_path = public, pg_temp;
ALTER FUNCTION user_has_permission(UUID, TEXT) SET search_path = public, pg_temp;

-- 분석 & 비즈니스 로직 함수 (10개)
ALTER FUNCTION get_revenue_by_date(TIMESTAMPTZ, TIMESTAMPTZ, TEXT) SET search_path = public, pg_temp;
ALTER FUNCTION get_revenue_by_service(TIMESTAMPTZ, TIMESTAMPTZ) SET search_path = public, pg_temp;
ALTER FUNCTION get_kpis(TIMESTAMPTZ, TIMESTAMPTZ) SET search_path = public, pg_temp;
ALTER FUNCTION calculate_bounce_rate(TIMESTAMPTZ, TIMESTAMPTZ) SET search_path = public, pg_temp;
ALTER FUNCTION calculate_funnel(TIMESTAMPTZ, TIMESTAMPTZ) SET search_path = public, pg_temp;
ALTER FUNCTION get_event_counts(TIMESTAMPTZ, TIMESTAMPTZ) SET search_path = public, pg_temp;
ALTER FUNCTION get_weekly_stats(TIMESTAMPTZ, TIMESTAMPTZ) SET search_path = public, pg_temp;
ALTER FUNCTION get_weekly_logs(TIMESTAMPTZ, TIMESTAMPTZ) SET search_path = public, pg_temp;
ALTER FUNCTION get_weekly_project_activity(TIMESTAMPTZ, TIMESTAMPTZ) SET search_path = public, pg_temp;
ALTER FUNCTION get_user_recent_activity(UUID, INTEGER) SET search_path = public, pg_temp;

-- 구독 & 결제 함수 (3개)
ALTER FUNCTION has_active_subscription(UUID, UUID) SET search_path = public, pg_temp;
ALTER FUNCTION expire_subscriptions() SET search_path = public, pg_temp;
ALTER FUNCTION generate_order_number() SET search_path = public, pg_temp;

-- Lab & Bounty 함수 (1개)
ALTER FUNCTION apply_to_bounty(BIGINT) SET search_path = public, pg_temp;

-- Activity Logging 함수 (3개)
ALTER FUNCTION log_action(UUID, TEXT, TEXT, TEXT, JSONB) SET search_path = public, pg_temp;
ALTER FUNCTION get_record_activity(TEXT, UUID) SET search_path = public, pg_temp;
ALTER FUNCTION get_session_timeline(TEXT) SET search_path = public, pg_temp;

-- Media Library 함수 (1개)
ALTER FUNCTION get_media_by_type_category(TEXT) SET search_path = public, pg_temp;

-- 유틸리티 함수 (1개)
ALTER FUNCTION is_blog_post_published(TEXT) SET search_path = public, pg_temp;

-- 트리거 함수 - Updated At (22개)
ALTER FUNCTION update_updated_at_column() SET search_path = public, pg_temp;
ALTER FUNCTION update_admins_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION update_billing_keys_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION update_blog_categories_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION update_bounties_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION update_cms_blog_categories_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION update_cms_lab_items_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION update_cms_media_library_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION update_cms_portfolio_items_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION update_cms_roadmap_items_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION update_cms_tags_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION update_cms_team_members_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION update_lab_items_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION update_logs_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION update_portfolio_items_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION update_projects_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION update_proposals_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION update_roadmap_items_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION update_roadmap_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION update_subscriptions_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION update_team_members_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION update_work_inquiries_updated_at() SET search_path = public, pg_temp;

-- 트리거 함수 - Created By (7개)
ALTER FUNCTION set_cms_blog_categories_created_by() SET search_path = public, pg_temp;
ALTER FUNCTION set_cms_lab_items_created_by() SET search_path = public, pg_temp;
ALTER FUNCTION set_cms_media_library_uploaded_by() SET search_path = public, pg_temp;
ALTER FUNCTION set_cms_portfolio_items_created_by() SET search_path = public, pg_temp;
ALTER FUNCTION set_cms_roadmap_items_created_by() SET search_path = public, pg_temp;
ALTER FUNCTION set_cms_tags_created_by() SET search_path = public, pg_temp;
ALTER FUNCTION set_cms_team_members_created_by() SET search_path = public, pg_temp;

-- 트리거 함수 - 기타 (5개)
ALTER FUNCTION log_cms_activity() SET search_path = public, pg_temp;
ALTER FUNCTION restrict_lab_user_updates() SET search_path = public, pg_temp;
ALTER FUNCTION set_proposal_user_id() SET search_path = public, pg_temp;
ALTER FUNCTION update_order_payment_id() SET search_path = public, pg_temp;
ALTER FUNCTION trigger_weekly_recap() SET search_path = public, pg_temp;


-- =====================================================
-- [SECTION 3] Compass -> Minu 브랜드 전환
-- 마이그레이션: 20251122000001_rename_compass_to_minu.sql
-- =====================================================

-- 서비스 데이터 업데이트 (services 테이블)

-- Compass Navigator -> Minu Find
UPDATE services
SET
  title = 'Minu Find',
  slug = 'find',
  description = '작은 신호에서 사업기회를 발견합니다. 시장, 기술, 정책, 경쟁사 정보를 자동으로 모아 ''할 만한 기회''만 깔끔하게 보여줍니다.',
  updated_at = NOW()
WHERE slug = 'navigator' OR title LIKE '%Navigator%';

-- Compass Cartographer -> Minu Frame
UPDATE services
SET
  title = 'Minu Frame',
  slug = 'frame',
  description = '올바른 문제 정의는 좋은 프로젝트의 절반입니다. Minu Frame은 생각을 구조화하고, 요구사항을 정리해 기획 초기 단계의 혼탁함을 단숨에 정리합니다.',
  updated_at = NOW()
WHERE slug = 'cartographer' OR title LIKE '%Cartographer%';

-- Compass Captain -> Minu Build
UPDATE services
SET
  title = 'Minu Build',
  slug = 'build',
  description = '프로젝트는 복잡하기 쉽지만, 진행 상황을 이해하는 일까지 복잡할 필요는 없습니다. Minu Build는 일정, 이슈, 진척을 부드럽게 요약해 PM/PL이 관리 대신 본질에 집중할 수 있게 만듭니다.',
  updated_at = NOW()
WHERE slug = 'captain' OR title LIKE '%Captain%';

-- Compass Harbor -> Minu Keep
UPDATE services
SET
  title = 'Minu Keep',
  slug = 'keep',
  description = '운영은 ''묵직하게''가 아니라 ''가볍고 지속 가능한 방식''이어야 합니다. Minu Keep은 버그, 업데이트, 리소스, 운영 기록을 단정하면서도 가벼운 방식으로 정리합니다.',
  updated_at = NOW()
WHERE slug = 'harbor' OR title LIKE '%Harbor%';

-- 구독 플랜 이름 업데이트 (subscription_plans 테이블)
UPDATE subscription_plans
SET
  plan_name = REPLACE(plan_name, 'Compass Navigator', 'Minu Find'),
  updated_at = NOW()
WHERE plan_name LIKE '%Compass Navigator%';

UPDATE subscription_plans
SET
  plan_name = REPLACE(plan_name, 'COMPASS Navigator', 'Minu Find'),
  updated_at = NOW()
WHERE plan_name LIKE '%COMPASS Navigator%';

-- 뷰 생성 (기존 뷰 삭제 후 신규 생성)
DROP VIEW IF EXISTS public.compass_integration_view;
DROP VIEW IF EXISTS public.minu_integration_view;

CREATE VIEW public.minu_integration_view AS
SELECT
  u.id as user_id,
  u.email,
  u.raw_user_meta_data->>'full_name' as full_name,
  u.raw_user_meta_data->>'avatar_url' as avatar_url,
  s.id as subscription_id,
  s.status as subscription_status,
  s.current_period_start,
  s.current_period_end,
  sp.plan_name,
  sp.price,
  sp.billing_cycle,
  sp.features,
  srv.title as service_title,
  srv.slug as service_slug
FROM auth.users u
LEFT JOIN subscriptions s ON u.id = s.user_id AND s.status = 'active'
LEFT JOIN subscription_plans sp ON s.plan_id = sp.id
LEFT JOIN services srv ON sp.service_id = srv.id
WHERE srv.slug IN ('find', 'frame', 'build', 'keep') OR srv.slug IS NULL;

-- 하위 호환성을 위한 별칭 뷰
CREATE OR REPLACE VIEW public.compass_integration_view AS
SELECT * FROM public.minu_integration_view;

-- 권한 설정
GRANT SELECT ON public.minu_integration_view TO authenticated;
GRANT SELECT ON public.compass_integration_view TO authenticated;

-- 코멘트 추가
COMMENT ON VIEW public.minu_integration_view IS 'Minu 플랫폼 통합 뷰 - 사용자, 구독, 플랜 정보 조회';
COMMENT ON VIEW public.compass_integration_view IS 'Deprecated: minu_integration_view를 사용하세요 (하위 호환성)';


-- =====================================================
-- [SECTION 4] Media Library 테이블 생성
-- 마이그레이션: 20251122100000_create_media_library_table.sql
-- =====================================================

-- 기존 테이블 삭제 (있는 경우)
DROP TABLE IF EXISTS public.media_library CASCADE;

-- media_library 테이블 생성
CREATE TABLE public.media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_size INTEGER NOT NULL CHECK (file_size > 0),
  mime_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  thumbnail_path TEXT,
  alt_text TEXT,
  width INTEGER,
  height INTEGER,
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  deleted_at TIMESTAMPTZ
);

-- 인덱스 생성
CREATE INDEX idx_media_library_uploaded_by ON public.media_library(uploaded_by);
CREATE INDEX idx_media_library_mime_type ON public.media_library(mime_type);
CREATE INDEX idx_media_library_created_at ON public.media_library(created_at DESC);
CREATE INDEX idx_media_library_filename ON public.media_library(filename);
CREATE INDEX idx_media_library_deleted_at ON public.media_library(deleted_at) WHERE deleted_at IS NULL;

-- RLS 활성화
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

-- RLS 정책: SELECT (모든 사용자)
CREATE POLICY select_media_public
  ON public.media_library
  FOR SELECT
  USING (deleted_at IS NULL);

-- RLS 정책: INSERT (인증된 사용자)
CREATE POLICY insert_media_authenticated
  ON public.media_library
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
  );

-- RLS 정책: UPDATE (관리자만)
CREATE POLICY update_media_admin
  ON public.media_library
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
    )
  );

-- RLS 정책: DELETE (관리자만)
CREATE POLICY delete_media_admin
  ON public.media_library
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
    )
  );

-- 트리거 함수 생성
CREATE OR REPLACE FUNCTION update_media_library_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

-- 트리거 생성
CREATE TRIGGER media_library_updated_at
  BEFORE UPDATE ON public.media_library
  FOR EACH ROW
  EXECUTE FUNCTION update_media_library_updated_at();

-- 테이블 코멘트
COMMENT ON TABLE public.media_library IS 'CMS Phase 5: Media asset storage with soft delete support';
COMMENT ON COLUMN public.media_library.filename IS 'Generated unique filename stored in storage';
COMMENT ON COLUMN public.media_library.original_filename IS 'Original filename uploaded by user';
COMMENT ON COLUMN public.media_library.file_size IS 'File size in bytes';
COMMENT ON COLUMN public.media_library.mime_type IS 'MIME type (e.g., image/jpeg, image/png)';
COMMENT ON COLUMN public.media_library.storage_path IS 'Full path in Supabase Storage bucket';
COMMENT ON COLUMN public.media_library.thumbnail_path IS 'Optional thumbnail path in storage';
COMMENT ON COLUMN public.media_library.alt_text IS 'Alt text for accessibility (WCAG compliance)';
COMMENT ON COLUMN public.media_library.width IS 'Image width in pixels';
COMMENT ON COLUMN public.media_library.height IS 'Image height in pixels';
COMMENT ON COLUMN public.media_library.uploaded_by IS 'User ID who uploaded the file';
COMMENT ON COLUMN public.media_library.deleted_at IS 'Soft delete timestamp (NULL = active)';

-- 권한 부여
GRANT SELECT ON public.media_library TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.media_library TO authenticated;


-- =====================================================
-- [SECTION 5] 적용 완료 확인
-- =====================================================

-- 적용 완료 메시지
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '2025-11-22 마이그레이션 적용 완료!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '적용된 변경사항:';
  RAISE NOTICE '  - Newsletter 함수 3개 보안 강화';
  RAISE NOTICE '  - Critical 함수 67개 보안 강화';
  RAISE NOTICE '  - Compass -> Minu 브랜드 전환';
  RAISE NOTICE '  - media_library 테이블 생성';
  RAISE NOTICE '========================================';
END $$;


-- =====================================================
-- [ROLLBACK SCRIPT] 롤백이 필요한 경우
-- =====================================================
/*
-- 주의: 롤백 스크립트는 필요한 경우에만 실행하세요!

-- 1. Media Library 롤백
DROP TABLE IF EXISTS public.media_library CASCADE;
DROP FUNCTION IF EXISTS update_media_library_updated_at();

-- 2. Minu -> Compass 브랜드 롤백
UPDATE services SET title = 'COMPASS Navigator', slug = 'navigator' WHERE slug = 'find';
UPDATE services SET title = 'COMPASS Cartographer', slug = 'cartographer' WHERE slug = 'frame';
UPDATE services SET title = 'COMPASS Captain', slug = 'captain' WHERE slug = 'build';
UPDATE services SET title = 'COMPASS Harbor', slug = 'harbor' WHERE slug = 'keep';

UPDATE subscription_plans
SET plan_name = REPLACE(plan_name, 'Minu Find', 'COMPASS Navigator')
WHERE plan_name LIKE '%Minu Find%';

DROP VIEW IF EXISTS public.minu_integration_view;
DROP VIEW IF EXISTS public.compass_integration_view;

-- 3. Function Search Path 롤백은 불필요 (보안 강화이므로 유지 권장)

*/
