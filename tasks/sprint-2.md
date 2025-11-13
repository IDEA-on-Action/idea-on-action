# Sprint 2: Supabase Integration & Community

> 데이터베이스 연동 및 커뮤니티 기능 구축

**기간**: Week 2
**목표**: Supabase 테이블 생성, CRUD API 연결, Giscus/Newsletter 통합
**상태**: 📋 Planned

---

## 🎯 Sprint 목표

- [ ] Supabase 테이블 스키마 생성
- [ ] RLS 정책 설정
- [ ] CRUD 훅 생성 (useProjects, useRoadmap, useLogs, useBounties, usePosts)
- [ ] Admin CRUD 페이지 생성
- [ ] Giscus 댓글 임베드
- [ ] Newsletter 위젯 추가
- [ ] Work with Us 폼 구현

---

## 📋 주요 작업

### 1. Supabase 스키마 생성 (4시간)
- Migration 파일 작성 (projects, roadmap, logs, bounties, posts, comments)
- RLS 정책 설정 (SELECT: 모두, INSERT/UPDATE/DELETE: 관리자)
- 인덱스 생성

### 2. CRUD 훅 생성 (6시간)
- useProjects (목록, 상세, 생성, 수정, 삭제)
- useRoadmap (목록, 생성, 수정, 삭제)
- useLogs (목록, 생성, 수정, 삭제)
- useBounties (목록, 생성, 수정, 삭제, 신청)
- usePosts (목록, 상세, 생성, 수정, 삭제)
- handleSupabaseError 통합

### 3. 페이지 Supabase 연동 (8시간)
- Portfolio 페이지 (정적 → Supabase)
- Roadmap 페이지 (정적 → Supabase)
- Now 페이지 (정적 → Supabase)
- Lab 페이지 (정적 → Supabase)
- Blog 페이지 (신규 생성)
- BlogPost 페이지 (신규 생성)

### 4. Admin CRUD 페이지 (10시간)
- /admin/projects (목록, 생성, 수정, 삭제)
- /admin/roadmap (목록, 생성, 수정, 삭제)
- /admin/logs (목록, 생성, 수정, 삭제)
- /admin/bounties (목록, 생성, 수정, 삭제, 신청자 확인)
- /admin/blog (목록, 생성, 수정, 삭제, Markdown 에디터)
- AdminRoute 적용

### 5. Giscus 통합 (2시간)
- GitHub App 설치
- Giscus 설정 (repository, mapping, theme)
- Community 페이지 임베드
- BlogPost 페이지 임베드

### 6. Newsletter 통합 (4시간)
- Resend 계정 생성
- newsletter_subscriptions 테이블 생성
- useNewsletter 훅 (구독, 취소, 확인)
- NewsletterForm 컴포넌트 (Footer, Home)
- 구독 확인 이메일 발송

### 7. Work with Us 폼 (6시간)
- work_with_us_submissions 테이블 생성
- useSubmitBrief 훅
- BriefForm 컴포넌트
- 파일 업로드 (Supabase Storage)
- Webhook 알림 (Slack/Discord)
- 확인 이메일 발송

---

## 📊 Sprint 완료 기준

- [ ] Supabase 테이블 생성 (7개 테이블)
- [ ] RLS 정책 설정 완료
- [ ] CRUD 훅 5개 생성
- [ ] Admin CRUD 페이지 5개 생성
- [ ] Giscus 댓글 동작
- [ ] Newsletter 구독 가능
- [ ] Work with Us 폼 제출 가능
- [ ] E2E 테스트 통과

---

**총 예상 시간**: 40시간
**완료율**: 0% (Planned)

---

**Last Updated**: 2025-11-13
**Status**: 📋 Planned
