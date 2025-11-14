# Weekly Recap 자동화 설정 가이드

> **Version 2.0 Sprint 3 - Automation**
> 활동 로그를 기반으로 주간 요약을 자동 생성하고 블로그에 발행하는 시스템

---

## 📋 개요

Weekly Recap 자동화 시스템은 다음과 같은 구성 요소로 이루어집니다:

1. **SQL 함수** (`20251114000001_weekly_recap_function.sql`)
   - `get_weekly_logs()`: 주간 로그 집계 (타입별)
   - `get_weekly_project_activity()`: 주간 프로젝트 활동 집계
   - `get_weekly_stats()`: 주간 통계 요약

2. **Supabase Edge Function** (`supabase/functions/weekly-recap/index.ts`)
   - Deno/TypeScript 기반
   - Markdown 템플릿 생성
   - `posts` 테이블에 자동 발행

3. **CRON Job** (`20251114000002_weekly_recap_cron.sql`)
   - 매주 일요일 자정 (KST) 자동 실행
   - `pg_cron` 기반 스케줄링

---

## 🚀 설치 단계

### Step 1: SQL 마이그레이션 실행

Supabase Dashboard → SQL Editor에서 다음 파일을 순서대로 실행:

```bash
# 1. SQL 함수 생성
supabase/migrations/20251114000001_weekly_recap_function.sql

# 2. CRON Job 설정 (선택)
supabase/migrations/20251114000002_weekly_recap_cron.sql
```

**또는** Supabase CLI 사용:

```bash
cd d:\GitHub\idea-on-action

# Supabase 로컬 환경 시작
supabase start

# 마이그레이션 적용
supabase db push
```

### Step 2: Edge Function 배포

```bash
# Supabase CLI 설치 (아직 없는 경우)
npm install -g supabase

# Supabase 로그인
supabase login

# 프로젝트 링크
supabase link --project-ref zykjdneewbzyazfukzyg

# Edge Function 배포
supabase functions deploy weekly-recap

# 환경 변수 설정 (Supabase Dashboard에서)
SUPABASE_URL=https://zykjdneewbzyazfukzyg.supabase.co
SUPABASE_SERVICE_ROLE_KEY=[YOUR_SERVICE_ROLE_KEY]
```

### Step 3: CRON Job 설정 (선택)

**방법 1: SQL 실행** (자동)

`20251114000002_weekly_recap_cron.sql` 파일 실행 시 자동으로 설정됩니다.

**방법 2: Supabase Dashboard** (수동)

1. Supabase Dashboard → Database → Cron Jobs
2. "Create a new cron job" 클릭
3. 설정:
   - **Name**: `weekly-recap-generation`
   - **Schedule**: `0 15 * * 0` (매주 일요일 15:00 UTC = 월요일 00:00 KST)
   - **Command**:
     ```sql
     SELECT net.http_post(
       url := '[YOUR_SUPABASE_URL]/functions/v1/weekly-recap',
       headers := '{"Content-Type": "application/json", "Authorization": "Bearer [YOUR_SERVICE_ROLE_KEY]"}'::jsonb,
       body := '{}'::jsonb
     );
     ```

---

## 🧪 테스트

### 수동 실행 (SQL)

```sql
-- SQL 함수 테스트 (지난 7일 로그)
SELECT * FROM public.get_weekly_stats();
SELECT * FROM public.get_weekly_logs();
SELECT * FROM public.get_weekly_project_activity();

-- Edge Function 수동 실행
SELECT public.trigger_weekly_recap();
```

### 수동 실행 (Edge Function 직접 호출)

```bash
# cURL로 호출
curl -X POST \
  'https://zykjdneewbzyazfukzyg.supabase.co/functions/v1/weekly-recap' \
  -H 'Authorization: Bearer [YOUR_ANON_KEY]' \
  -H 'Content-Type: application/json'

# 또는 Supabase CLI로 로컬 실행
supabase functions serve weekly-recap

# 다른 터미널에서 호출
curl -X POST http://localhost:54321/functions/v1/weekly-recap \
  -H 'Authorization: Bearer [YOUR_ANON_KEY]'
```

### 결과 확인

```sql
-- 생성된 Weekly Recap 포스트 확인
SELECT slug, title, published_at, tags
FROM public.posts
WHERE tags @> ARRAY['weekly-recap']
ORDER BY published_at DESC
LIMIT 5;

-- CRON Job 실행 기록 확인
SELECT *
FROM cron.job_run_details
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'weekly-recap-generation')
ORDER BY start_time DESC
LIMIT 10;
```

---

## 📊 생성되는 Weekly Recap 구조

### Markdown 템플릿

```markdown
# Weekly Recap - 2025년 46주차

> 2025년 11월 10일 ~ 2025년 11월 16일

## 📊 이번 주 통계

- **총 활동**: 15건
- **릴리스**: 5건
- **학습**: 7건
- **결정**: 3건
- **활성 프로젝트**: 2개

**인기 태그**: #release, #analytics, #dashboard, #pwa, #testing

## 🚀 프로젝트 활동

### IDEA on Action Homepage

- 총 12건의 활동
- 🎉 릴리스 4건
- 📚 학습 6건
- 🤔 결정 2건

## 📝 상세 활동

### 🎉 릴리스

#### Phase 14 완료 - 고급 분석 대시보드

> 11월 4일

사용자 행동 분석, 매출 차트 & KPI, 실시간 대시보드 구축 완료...

**태그**: `release`, `analytics`, `dashboard`

---

### 📚 학습

#### Supabase Realtime 구독 패턴 학습

> 11월 3일

Supabase Realtime을 활용한 실시간 주문 및 이벤트 구독 패턴 구현...

**태그**: `learning`, `supabase`, `realtime`

---

...

📌 이 리캡은 자동으로 생성되었습니다. [IDEA on Action](https://www.ideaonaction.ai)
```

---

## 🔧 트러블슈팅

### 1. Edge Function 배포 실패

**문제**: `supabase functions deploy` 실패

**해결**:
```bash
# Supabase CLI 업데이트
npm update -g supabase

# 프로젝트 재링크
supabase unlink
supabase link --project-ref zykjdneewbzyazfukzyg

# 다시 배포
supabase functions deploy weekly-recap
```

### 2. CRON Job이 실행되지 않음

**문제**: 스케줄된 시간에 Weekly Recap이 생성되지 않음

**해결**:
```sql
-- CRON Job 상태 확인
SELECT * FROM cron.job WHERE jobname = 'weekly-recap-generation';

-- 실행 기록 확인
SELECT * FROM cron.job_run_details
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'weekly-recap-generation')
ORDER BY start_time DESC;

-- pg_cron 확장 확인
SELECT * FROM pg_extension WHERE extname = 'pg_cron';

-- 없으면 설치
CREATE EXTENSION pg_cron;
```

### 3. "No activity this week" 메시지

**문제**: 로그가 없어서 Weekly Recap이 생성되지 않음

**해결**:
```sql
-- 최근 7일 로그 확인
SELECT COUNT(*) FROM public.logs
WHERE created_at >= NOW() - INTERVAL '7 days';

-- 샘플 로그 추가 (테스트용)
INSERT INTO public.logs (type, title, content, tags)
VALUES
  ('release', '테스트 릴리스', '테스트 내용', ARRAY['test']),
  ('learning', '테스트 학습', '학습 내용', ARRAY['test']);
```

### 4. 블로그 발행 권한 오류

**문제**: `posts` 테이블에 INSERT 권한 없음

**해결**:
```sql
-- RLS 정책 확인
SELECT * FROM pg_policies WHERE tablename = 'posts';

-- Service Role Key가 정확한지 확인
-- Supabase Dashboard → Settings → API → service_role key
```

---

## 📝 커스터마이징

### Markdown 템플릿 변경

`supabase/functions/weekly-recap/index.ts` 파일의 `generateMarkdown()` 함수를 수정:

```typescript
function generateMarkdown(
  stats: WeeklyStats,
  logs: WeeklyLog[],
  projects: ProjectActivity[]
): string {
  // 여기에 커스텀 템플릿 로직 작성
  let markdown = `# 🎉 이번 주 하이라이트\n\n`
  // ...
  return markdown
}
```

### 스케줄 변경

`20251114000002_weekly_recap_cron.sql` 파일의 CRON 표현식 수정:

```sql
-- 매주 금요일 오후 6시 (KST)
'0 9 * * 5', -- UTC 09:00 = KST 18:00

-- 매일 자정 (KST)
'0 15 * * *', -- UTC 15:00 = KST 00:00 (다음날)

-- 매월 1일 자정 (KST)
'0 15 1 * *', -- UTC 15:00 = KST 00:00 (다음날)
```

### 로그 필터링

`supabase/functions/weekly-recap/index.ts`에서 특정 타입만 포함:

```typescript
// 릴리스 로그만 포함
const { data: logs } = await supabaseClient
  .from('logs')
  .select('*')
  .eq('type', 'release')
  .gte('created_at', startDate.toISOString())
  .lte('created_at', endDate.toISOString())
```

---

## 🎯 다음 단계

1. **AI 요약 통합** (선택)
   - OpenAI API 연동하여 로그를 자연어로 요약
   - `src/lib/openai.ts` 활용

2. **이메일 발송** (선택)
   - Resend API로 Weekly Recap을 뉴스레터로 발송
   - `src/lib/email.ts` 활용

3. **소셜 미디어 공유** (선택)
   - Twitter API로 자동 트윗
   - Slack Webhook으로 알림

4. **메트릭 시각화** (선택)
   - 주간 통계 차트 이미지 생성
   - Analytics 데이터 통합

---

## 📚 참고 자료

- [Supabase Edge Functions 문서](https://supabase.com/docs/guides/functions)
- [pg_cron 확장](https://github.com/citusdata/pg_cron)
- [Deno 문서](https://deno.land/manual)
- [CRON 표현식 가이드](https://crontab.guru/)

---

**작성일**: 2025-11-14
**작성자**: Claude AI
**관련 바운티**: Weekly Recap 자동 생성 시스템 (150,000원, 12시간)
