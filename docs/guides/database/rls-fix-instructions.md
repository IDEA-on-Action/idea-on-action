# RLS 정책 수정 가이드

## 문제 상황
다음 테이블들에서 403 Forbidden 오류가 발생하는 경우:
- `user_roles` - permission denied
- `carts` - permission denied
- `notifications` - permission denied
- `roadmap` - permission denied

## 해결 방법

### 방법 1: Supabase Dashboard 사용 (권장)

1. **Supabase Dashboard 접속**
   - https://supabase.com/dashboard 접속
   - 프로젝트 선택

2. **SQL Editor 열기**
   - 좌측 메뉴에서 "SQL Editor" 클릭
   - "New query" 클릭

3. **SQL 파일 내용 복사 및 실행**
   - 파일 경로: `supabase/migrations/fix-rls-policies-all.sql`
   - 파일 내용을 전체 복사하여 SQL Editor에 붙여넣기
   - "Run" 버튼 클릭하여 실행

4. **실행 결과 확인**
   - 성공 메시지 확인
   - 에러가 발생하면 에러 메시지 확인

### 방법 2: Supabase CLI 사용

```bash
# Supabase 프로젝트 연결
supabase link --project-ref <your-project-ref>

# SQL 파일 실행
supabase db execute --file supabase/migrations/fix-rls-policies-all.sql
```

## 적용되는 정책

### 1. notifications 테이블
- 사용자는 자신의 알림만 조회/수정/삭제 가능
- 서비스 역할은 모든 알림 삽입 가능

### 2. carts 테이블
- 사용자는 자신의 장바구니만 조회/생성/수정/삭제 가능

### 3. cart_items 테이블
- 사용자는 자신의 장바구니에 속한 항목만 조회/생성/수정/삭제 가능

### 4. user_roles 테이블
- 사용자는 자신의 역할 조회 가능
- 모든 사용자가 관리자 권한 확인을 위해 조회 가능 (임시)

### 5. roles 테이블
- 모든 사용자가 역할 정보 조회 가능

### 6. user_profiles 테이블
- 사용자는 자신의 프로필만 조회/생성/수정 가능
- 관리자는 모든 프로필 조회 가능 (임시)

### 7. roadmap 테이블
- 모든 사용자가 roadmap 조회 가능
- 관리자만 roadmap 생성/수정/삭제 가능

## 검증

정책 적용 후 다음 명령어로 검증:

```bash
npm run check:rls
```

또는 Supabase Dashboard에서:

```sql
-- RLS 정책 확인
SELECT 
  tablename,
  policyname,
  cmd AS operation
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('notifications', 'carts', 'cart_items', 'user_roles', 'roles', 'user_profiles', 'roadmap')
ORDER BY tablename, cmd;
```

## 주의사항

⚠️ **프로덕션 환경에서는 다음 정책을 더 엄격하게 설정하세요:**
- `user_roles`: 모든 사용자 조회 정책 제거
- `user_profiles`: 관리자 전체 조회 정책 제거

## 문제 해결

### 정책이 적용되지 않는 경우
1. Supabase Dashboard에서 테이블의 RLS 활성화 상태 확인
2. 정책이 실제로 생성되었는지 확인
3. 사용자 인증 상태 확인 (`auth.uid()`가 올바르게 반환되는지)

### 여전히 403 오류가 발생하는 경우
1. 브라우저 콘솔에서 정확한 에러 메시지 확인
2. Supabase Dashboard의 Logs 섹션에서 서버 로그 확인
3. 정책의 USING/WITH CHECK 조건이 올바른지 확인

