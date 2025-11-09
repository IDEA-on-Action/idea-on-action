# RLS 정책 빠른 적용 가이드

## 현재 문제
다음 테이블에서 403 Forbidden 오류가 발생합니다:
- `carts` - permission denied
- `roadmap` - permission denied

## 해결 방법 (3단계)

### 1단계: Supabase Dashboard 접속
1. https://supabase.com/dashboard 접속
2. 프로젝트 선택 (zykjdneewbzyazfukzyg)

### 2단계: SQL Editor 열기
1. 좌측 메뉴에서 **"SQL Editor"** 클릭
2. **"+ New query"** 버튼 클릭

### 3단계: SQL 실행
1. `supabase/migrations/fix-rls-policies-all.sql` 파일을 열기
2. **전체 내용 복사** (Ctrl+A, Ctrl+C)
3. SQL Editor에 **붙여넣기** (Ctrl+V)
4. **"RUN"** 버튼 클릭 또는 **Ctrl+Enter**

## 실행 결과 확인

성공 메시지 예시:
```
✅ RLS 정책 수정 완료!
- notifications 테이블: 생성 + RLS 정책 4개
- carts 테이블: RLS 정책 4개 재생성
- cart_items 테이블: RLS 정책 4개 재생성
- user_roles 테이블: RLS 정책 2개 재생성
- roles 테이블: RLS 정책 1개 재생성
- user_profiles 테이블: RLS 정책 4개 재생성
- roadmap 테이블: RLS 정책 4개 재생성
```

## 적용 후 확인

1. 브라우저 콘솔 새로고침 (F5)
2. 403 오류가 사라졌는지 확인
3. Roadmap 페이지가 정상적으로 로드되는지 확인

## 문제 해결

### SQL 실행 시 오류가 발생하는 경우
- 에러 메시지를 확인하고, 이미 존재하는 정책은 무시해도 됩니다
- `DROP POLICY IF EXISTS` 구문이 포함되어 있어 안전하게 재실행 가능합니다

### 여전히 403 오류가 발생하는 경우
1. Supabase Dashboard → Authentication → Users에서 로그인한 사용자 확인
2. Supabase Dashboard → Database → Policies에서 정책이 생성되었는지 확인
3. 브라우저 캐시 삭제 후 재시도

