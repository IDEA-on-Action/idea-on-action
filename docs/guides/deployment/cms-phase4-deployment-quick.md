# CMS Phase 4 프로덕션 배포 - 빠른 가이드

**마이그레이션**: `20251116115700_fix_service_categories_complete.sql`
**예상 소요 시간**: 30분

---

## 🔥 5분 체크리스트

### 1. 백업 (5분)
```bash
# Supabase Dashboard → Settings → Database → Backups
# "Create Snapshot" → 이름: pre-cms-phase4-2025-11-16
```

### 2. 로컬 검증 (10분)
```bash
# 로컬 DB 리셋
supabase db reset

# 빌드 테스트
npm run build

# 미리보기
npm run preview
# → http://localhost:4173/services 확인
```

### 3. 프로덕션 배포 (5분)
```bash
# Supabase 마이그레이션
supabase db push

# Vercel 배포 (자동)
git push origin main
```

### 4. 검증 (5분)
```bash
# 서비스 데이터 확인
node scripts/check-production-services.cjs
# → 4개 서비스, 16개 Features 확인

# 프로덕션 확인
# → https://www.ideaonaction.ai/services
```

### 5. 모니터링 (5분)
```bash
# Sentry 에러 체크
# Lighthouse 점수 측정
# /services 페이지 수동 테스트
```

---

## 📋 핵심 체크리스트

### 배포 전
- [ ] Supabase 스냅샷 생성: `pre-cms-phase4-2025-11-16`
- [ ] 로컬 빌드 성공: `npm run build`
- [ ] 로컬 미리보기 동작: `npm run preview`

### 배포
- [ ] Supabase 마이그레이션: `supabase db push`
- [ ] Git 푸시: `git push origin main`
- [ ] Vercel 배포 성공 확인

### 배포 후
- [ ] 서비스 데이터 확인: `node scripts/check-production-services.cjs`
- [ ] /services 페이지 정상 로드
- [ ] Sentry 에러 없음

---

## 🚨 롤백 (1분 이내)

### RLS 정책 에러 시
```sql
-- Supabase Dashboard → SQL Editor

DROP POLICY IF EXISTS "service_categories_anon_select" ON service_categories;
DROP POLICY IF EXISTS "service_categories_authenticated_select" ON service_categories;

CREATE POLICY "Active categories are viewable by everyone"
  ON public.service_categories FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all categories"
  ON public.service_categories FOR SELECT
  TO authenticated
  USING (true);
```

### Vercel 배포 롤백
```
Vercel Dashboard → Deployments → 이전 배포 선택 → "Promote to Production"
```

---

## 🎯 배포 후 확인사항

### 즉시 확인 (1시간 이내)
1. **프로덕션 페이지**
   - [ ] https://www.ideaonaction.ai/services
   - [ ] 서비스 4개 표시
   - [ ] 카테고리 필터링 동작

2. **Admin 페이지**
   - [ ] /admin/services CRUD 동작
   - [ ] 이미지 업로드 정상

3. **에러 모니터링**
   - [ ] Sentry: 신규 에러 0건
   - [ ] Supabase Logs: RLS 에러 없음

### 24시간 모니터링
- [ ] Lighthouse 점수: 90+ 유지
- [ ] Sentry 누적 에러: < 10건
- [ ] 사용자 피드백 체크

---

## 📊 예상 결과

### 성공 기준
- ✅ 서비스 목록 조회 성공 (4개)
- ✅ 카테고리 필터링 동작
- ✅ Admin CRUD 정상 동작
- ✅ RLS 정책 에러 없음
- ✅ Lighthouse 점수 90+

### 배포 지표
- **빌드 시간**: ~20초
- **초기 번들**: ~338 kB gzip
- **PWA precache**: ~2,167 KiB
- **배포 시간**: ~3분

---

## 🆘 문제 발생 시

### 403 Forbidden 에러
1. Supabase Dashboard → Database → Policies
2. `service_categories_anon_select` 정책 확인
3. USING 조건: `true` (not `is_active = true`)

### 서비스 데이터 없음
```bash
# 프로덕션 데이터 확인
node scripts/check-production-services.cjs

# 결과: "Total services: 0" → 롤백 필요
```

### 빌드 실패
```bash
# 에러 로그 확인
npm run build 2>&1 | tee build-error.log

# TypeScript 에러 확인
npx tsc --noEmit
```

---

## 📚 상세 문서

- **전체 체크리스트**: `cms-phase4-deployment-checklist.md`
- **마이그레이션 가이드**: `docs/guides/database/service-categories-migration-guide.md`
- **검증 보고서**: `docs/archive/2025-11-16/cms-phase4-validation-report-2025-11-16.md`

---

**빠른 가이드 버전**: 1.0
**업데이트**: 2025-11-16
