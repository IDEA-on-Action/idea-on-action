# Weekly Recap CRON Job 프로덕션 배포 가이드

> 매주 일요일 자정에 자동으로 Weekly Recap을 생성하는 CRON Job 설정

**작성일**: 2025-11-14
**대상 환경**: Supabase 프로덕션 (https://zykjdneewbzyazfukzyg.supabase.co)

---

## 📋 배포 순서

### 1단계: SQL 함수 배포 (선행 작업)

Supabase Dashboard > SQL Editor에서 다음 파일 실행:

```bash
supabase/migrations/20251114000001_weekly_recap_function.sql
```

**포함 내용**:
- ✅ `get_weekly_logs()` - 주간 로그 집계
- ✅ `get_weekly_project_activity()` - 주간 프로젝트 활동
- ✅ `get_weekly_stats()` - 주간 통계 요약

---

### 2단계: Service Role Key 설정

Supabase Dashboard > SQL Editor에서 실행:

```sql
-- Service Role Key 설정 (보안 주의!)
-- 실제 키는 Supabase Dashboard > Settings > API에서 확인
ALTER DATABASE postgres SET app.supabase_service_role_key = 'YOUR_ACTUAL_SERVICE_ROLE_KEY';
```

⚠️ **보안 주의사항**:
- Service Role Key는 절대 Git에 커밋하지 마세요
- Dashboard > Settings > API에서 `service_role` 키 복사
- SQL Editor에서 직접 실행 후 히스토리 삭제 권장

---

### 3단계: CRON Job 배포

Supabase Dashboard > SQL Editor에서 다음 파일 실행:

```bash
supabase/migrations/20251114000002_weekly_recap_cron.sql
```

**포함 내용**:
- ✅ PostgreSQL Custom Settings 설정
- ✅ pg_cron 확장 설치
- ✅ CRON Job 생성 (매주 일요일 15:00 UTC = 월요일 00:00 KST)
- ✅ 수동 실행 함수 (`trigger_weekly_recap()`)

---

### 4단계: CRON Job 확인

```sql
-- 현재 스케줄된 작업 확인
SELECT * FROM cron.job WHERE jobname = 'weekly-recap-generation';

-- 예상 결과
-- jobid | schedule      | command                     | nodename  | nodeport | database | username
-- 1     | 0 15 * * 0    | SELECT net.http_post(...)   | localhost | 5432     | postgres | postgres
```

---

### 5단계: 수동 테스트

```sql
-- Weekly Recap 수동 생성
SELECT public.trigger_weekly_recap();

-- 예상 결과 (JSONB)
-- {
--   "message": "Weekly Recap generated successfully",
--   "post": {
--     "id": 1,
--     "slug": "weekly-recap-2025-w46",
--     "title": "Weekly Recap - 2025년 46주차",
--     ...
--   }
-- }
```

**확인 사항**:
- [ ] posts 테이블에 새 레코드 생성됨
- [ ] slug 형식: `weekly-recap-YYYY-wWW`
- [ ] series: `Weekly Recap`
- [ ] 에러 없이 정상 응답

---

### 6단계: CRON Job 실행 기록 확인

```sql
-- 작업 실행 기록 확인 (최근 10개)
SELECT
  jobid,
  runid,
  status,
  return_message,
  start_time,
  end_time
FROM cron.job_run_details
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'weekly-recap-generation')
ORDER BY start_time DESC
LIMIT 10;
```

---

## 🔧 트러블슈팅

### pg_cron 확장이 설치되지 않는 경우

```sql
-- 슈퍼유저 권한 필요
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 권한 확인
SELECT * FROM pg_extension WHERE extname = 'pg_cron';
```

**해결 방법**:
- Supabase 프로덕션에서는 기본적으로 pg_cron이 활성화되어 있어야 합니다
- 활성화되지 않은 경우 Supabase Support에 문의

---

### Service Role Key가 설정되지 않는 경우

```sql
-- 현재 설정 확인
SELECT current_setting('app.supabase_service_role_key', true);

-- NULL 또는 에러 발생 시 다시 설정
ALTER DATABASE postgres SET app.supabase_service_role_key = 'YOUR_KEY';

-- 세션 재연결 후 확인
SELECT current_setting('app.supabase_service_role_key', true);
```

---

### CRON Job이 실행되지 않는 경우

```sql
-- CRON Job 삭제
SELECT cron.unschedule('weekly-recap-generation');

-- 다시 생성 (20251114000002_weekly_recap_cron.sql 재실행)
```

**확인 사항**:
- [ ] Edge Function이 배포되어 있는가? (`/functions/v1/weekly-recap`)
- [ ] Service Role Key가 올바르게 설정되었는가?
- [ ] Supabase URL이 정확한가?

---

### Edge Function 404 에러

```bash
# Edge Function 배포 확인
supabase functions list

# Edge Function 배포
supabase functions deploy weekly-recap
```

---

## 📅 예상 스케줄

| 실행 시간 (UTC) | 실행 시간 (KST) | 생성되는 Recap |
|----------------|-----------------|----------------|
| 일요일 15:00    | 월요일 00:00     | 지난 주 (일~토) 요약 |

**예시**:
- 2025-11-17 (일) 15:00 UTC → 2025-11-18 (월) 00:00 KST
- 생성: `weekly-recap-2025-w47` (11/11~11/17 활동 요약)

---

## ✅ 최종 체크리스트

- [ ] SQL 함수 3개 배포 완료 (`20251114000001`)
- [ ] Service Role Key 설정 완료
- [ ] CRON Job 생성 완료 (`20251114000002`)
- [ ] CRON Job 등록 확인 (`cron.job` 테이블)
- [ ] 수동 테스트 성공 (`trigger_weekly_recap()`)
- [ ] posts 테이블에 Weekly Recap 생성 확인
- [ ] Edge Function 정상 동작 확인

---

## 📚 관련 파일

- `supabase/migrations/20251114000001_weekly_recap_function.sql` - SQL 함수
- `supabase/migrations/20251114000002_weekly_recap_cron.sql` - CRON Job
- `supabase/functions/weekly-recap/index.ts` - Edge Function
- `CLAUDE.md` - 프로젝트 문서

---

**Last Updated**: 2025-11-14
**Status**: 📋 Ready for Deployment
