# Analytics RPC 함수 마이그레이션 적용 가이드

> Phase 14: 분석 대시보드 RPC 함수 적용 방법

**작성일**: 2025-01-16  
**마이그레이션 파일**: `supabase/migrations/20251111000002_analytics_functions.sql`

---

## 🎯 개요

분석 대시보드에서 사용하는 RPC 함수들이 Supabase에 적용되지 않아 404 오류가 발생할 수 있습니다. 이 가이드를 따라 마이그레이션을 적용하세요.

### 생성되는 RPC 함수

1. `calculate_funnel` - 퍼널 분석 (회원가입 → 구매)
2. `calculate_bounce_rate` - 이탈률 계산
3. `get_event_counts` - 이벤트별 집계
4. `get_session_timeline` - 세션 타임라인 조회

---

## 🚀 방법 1: Supabase Dashboard (권장)

### Step 1: Supabase Dashboard 접속

1. https://supabase.com/dashboard 접속
2. 프로젝트 선택: `zykjdneewbzyazfukzyg`
3. 좌측 메뉴에서 **SQL Editor** 클릭

### Step 2: 마이그레이션 파일 열기

```bash
# 로컬에서 파일 열기
code supabase/migrations/20251111000002_analytics_functions.sql

# 또는 파일 내용 확인
cat supabase/migrations/20251111000002_analytics_functions.sql
```

### Step 3: SQL 실행

1. SQL Editor에 마이그레이션 파일 내용 전체 복사
2. **RUN** 버튼 클릭 (또는 `Ctrl+Enter`)
3. 성공 메시지 확인: "Success. No rows returned"

### Step 4: 함수 확인

SQL Editor에서 다음 쿼리 실행:

```sql
-- 함수 목록 확인
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
    'calculate_funnel',
    'calculate_bounce_rate',
    'get_event_counts',
    'get_session_timeline'
  )
ORDER BY routine_name;
```

**예상 결과**: 4개의 함수가 표시되어야 합니다.

---

## 🔧 방법 2: Supabase CLI

### 전제 조건

- Supabase CLI 설치: `npm install -g supabase`
- 프로젝트 연결: `supabase link --project-ref zykjdneewbzyazfukzyg`

### 마이그레이션 적용

```bash
# 프로젝트 루트에서 실행
cd D:\GitHub\idea-on-action

# 마이그레이션 적용
supabase db push

# 또는 특정 마이그레이션만 적용
supabase migration up 20251111000002_analytics_functions
```

### 확인

```bash
# 마이그레이션 상태 확인
supabase migration list

# 함수 확인
supabase db inspect --schema public
```

---

## ✅ 적용 확인

### 1. 브라우저 콘솔 확인

마이그레이션 적용 후 페이지를 새로고침하면:
- ✅ 404 오류가 사라짐
- ✅ `[Analytics]` 경고 메시지가 더 이상 표시되지 않음

### 2. 함수 테스트

SQL Editor에서 테스트 쿼리 실행:

```sql
-- 퍼널 분석 테스트
SELECT * FROM calculate_funnel(
  '2025-01-01'::timestamptz,
  '2025-12-31'::timestamptz
);

-- 이탈률 계산 테스트
SELECT * FROM calculate_bounce_rate(
  '2025-01-01'::timestamptz,
  '2025-12-31'::timestamptz
);

-- 이벤트 집계 테스트
SELECT * FROM get_event_counts(
  '2025-01-01'::timestamptz,
  '2025-12-31'::timestamptz
);
```

**예상 결과**: 빈 데이터 또는 실제 데이터가 반환되어야 합니다 (에러가 발생하지 않아야 함).

---

## 🔍 문제 해결

### 문제 1: "function already exists" 오류

```sql
-- 기존 함수 삭제 후 재생성
DROP FUNCTION IF EXISTS calculate_funnel(timestamptz, timestamptz);
DROP FUNCTION IF EXISTS calculate_bounce_rate(timestamptz, timestamptz);
DROP FUNCTION IF EXISTS get_event_counts(timestamptz, timestamptz);
DROP FUNCTION IF EXISTS get_session_timeline(text);

-- 그 다음 마이그레이션 파일 다시 실행
```

### 문제 2: "permission denied" 오류

- Supabase Dashboard에서 **Service Role Key**를 사용하여 실행
- 또는 관리자 권한이 있는 계정으로 로그인

### 문제 3: 여전히 404 오류 발생

1. 브라우저 캐시 클리어
2. 하드 리프레시: `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac)
3. Supabase Dashboard에서 함수 존재 여부 재확인

---

## 📚 참고 자료

- [Supabase RPC Functions 문서](https://supabase.com/docs/guides/database/functions)
- [프로젝트 마이그레이션 가이드](../../../supabase/MIGRATION_GUIDE.md)
- [분석 대시보드 문서](../../archive/phase14-analytics.md)

---

## 🎉 완료

마이그레이션 적용이 완료되면:

- ✅ 분석 대시보드가 정상 작동
- ✅ 퍼널 분석 데이터 표시
- ✅ 이탈률 계산 정상 작동
- ✅ 이벤트 집계 데이터 표시
- ✅ 콘솔 경고 메시지 사라짐

**다음 단계**: 분석 대시보드 페이지(`/admin/analytics`)에서 데이터 확인

