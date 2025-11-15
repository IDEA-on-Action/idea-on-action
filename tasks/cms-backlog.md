# CMS 관리자 모드 백로그

**작성일**: 2025-11-15
**버전**: 1.0
**담당자**: Sinclair Seo

---

## 백로그 우선순위

```
P0 (Critical) - 시스템 동작 필수 기능
P1 (High) - 핵심 비즈니스 로직
P2 (Medium) - 사용자 경험 개선
P3 (Low) - Nice-to-have
```

---

## Phase 1: 기반 구축 (2주)

### P0: 데이터베이스 스키마
- [ ] **CMS-001**: admins 테이블 생성 및 RLS 정책
- [ ] **CMS-002**: roadmap_items 테이블 생성 및 RLS 정책
- [ ] **CMS-003**: portfolio_items 테이블 생성 및 RLS 정책
- [ ] **CMS-004**: lab_items 테이블 생성 및 RLS 정책
- [ ] **CMS-005**: blog_posts 테이블 생성 및 RLS 정책
- [ ] **CMS-006**: team_members 테이블 생성 및 RLS 정책
- [ ] **CMS-007**: categories 테이블 생성 및 RLS 정책
- [ ] **CMS-008**: tags 테이블 생성 및 RLS 정책
- [ ] **CMS-009**: 인덱스 15+개 생성 (slug, published, category 등)
- [ ] **CMS-010**: Supabase Type Generator 실행 → database.types.ts

### P0: 관리자 인증
- [ ] **CMS-011**: Super Admin 계정 생성 (Supabase Dashboard 수동)
- [ ] **CMS-012**: useAuth 훅 확장 (isAdmin, adminRole 추가)
- [ ] **CMS-013**: usePermissions 훅 생성 (can 함수)
- [ ] **CMS-014**: ProtectedRoute 수정 (관리자 체크)
- [ ] **CMS-015**: Login 페이지 수정 (/admin 리다이렉트)

### P0: Admin Layout
- [ ] **CMS-016**: AdminLayout.tsx 생성 (Header + Sidebar + Main)
- [ ] **CMS-017**: Sidebar.tsx 생성 (네비게이션 메뉴)
- [ ] **CMS-018**: AdminHeader.tsx 생성 (프로필, 로그아웃)
- [ ] **CMS-019**: Breadcrumb.tsx 생성 (경로 표시)
- [ ] **CMS-020**: Sidebar 토글 기능 (모바일용 햄버거 메뉴)

### P1: 공통 컴포넌트
- [ ] **CMS-021**: Table.tsx 생성 (정렬, 페이지네이션)
- [ ] **CMS-022**: Modal.tsx 생성 (확인 대화상자)
- [ ] **CMS-023**: LoadingState, ErrorState, EmptyState 생성
- [ ] **CMS-024**: FormField.tsx 생성 (React Hook Form 래퍼)
- [ ] **CMS-025**: DatePicker.tsx 생성 (date-fns 통합)
- [ ] **CMS-026**: MultiSelect.tsx 생성 (태그 입력)

### P1: useCRUD Hook
- [ ] **CMS-027**: useCRUD 훅 생성 (list, get, create, update, delete)
- [ ] **CMS-028**: Optimistic Update 로직 구현
- [ ] **CMS-029**: React Query 캐싱 전략 설정
- [ ] **CMS-030**: useCRUD 유닛 테스트 10개 작성

### P1: 파일 업로드
- [ ] **CMS-031**: Supabase Storage 버킷 생성 (public/portfolio, public/blog 등)
- [ ] **CMS-032**: useFileUpload 훅 생성 (upload, delete, getPublicUrl)
- [ ] **CMS-033**: ImageUpload.tsx 생성 (드래그 앤 드롭, 미리보기)
- [ ] **CMS-034**: 파일 검증 로직 (크기, MIME 타입, 확장자)
- [ ] **CMS-035**: useFileUpload 유닛 테스트 5개 작성

---

## Phase 2: 핵심 기능 (3주)

### P1: 로드맵 관리
- [ ] **CMS-036**: RoadmapList.tsx 생성 (목록 페이지)
- [ ] **CMS-037**: RoadmapForm.tsx 생성 (생성/수정 폼)
- [ ] **CMS-038**: 필터링 UI (카테고리, 상태)
- [ ] **CMS-039**: 검색 UI (제목)
- [ ] **CMS-040**: useCRUD('roadmap_items') 연동
- [ ] **CMS-041**: 로드맵 E2E 테스트 5개 작성
- [ ] **CMS-042**: RoadmapDetail.tsx 생성 (선택)

### P1: 포트폴리오 관리
- [ ] **CMS-043**: PortfolioList.tsx 생성 (카드 그리드)
- [ ] **CMS-044**: PortfolioForm.tsx 생성 (생성/수정 폼)
- [ ] **CMS-045**: Slug 자동 생성 로직
- [ ] **CMS-046**: 이미지 갤러리 (ImageUpload 다중)
- [ ] **CMS-047**: 기술 스택 태그 입력 (MultiSelect)
- [ ] **CMS-048**: 주요 프로젝트 체크박스 (featured)
- [ ] **CMS-049**: useCRUD('portfolio_items') 연동
- [ ] **CMS-050**: 포트폴리오 E2E 테스트 5개 작성
- [ ] **CMS-051**: PortfolioDetail.tsx 생성

### P1: 블로그 관리
- [ ] **CMS-052**: BlogList.tsx 생성 (목록 페이지)
- [ ] **CMS-053**: BlogForm.tsx 생성 (생성/수정 폼)
- [ ] **CMS-054**: RichTextEditor.tsx 생성 (Tiptap 통합)
  - [ ] StarterKit extension
  - [ ] Image extension (드래그 앤 드롭)
  - [ ] CodeBlockLowlight extension (문법 하이라이팅)
  - [ ] Link extension
- [ ] **CMS-055**: 초안 저장 기능 (published: false)
- [ ] **CMS-056**: 카테고리 관리 (CategoryList.tsx, CategoryForm.tsx)
- [ ] **CMS-057**: useCRUD('blog_posts') 연동
- [ ] **CMS-058**: 블로그 E2E 테스트 5개 작성

### P2: 실험실 관리
- [ ] **CMS-059**: LabList.tsx 생성 (목록 페이지)
- [ ] **CMS-060**: LabForm.tsx 생성 (생성/수정 폼)
- [ ] **CMS-061**: 기여자 추가/제거 UI
- [ ] **CMS-062**: GitHub URL 입력
- [ ] **CMS-063**: useCRUD('lab_items') 연동
- [ ] **CMS-064**: 실험실 E2E 테스트 3개 작성

---

## Phase 3: 고급 기능 (2주)

### P2: 미디어 라이브러리
- [ ] **CMS-065**: MediaLibrary.tsx 생성 (그리드/리스트 뷰)
- [ ] **CMS-066**: MediaGrid.tsx 생성 (파일 카드)
- [ ] **CMS-067**: MediaUploader.tsx 생성 (다중 업로드)
- [ ] **CMS-068**: 검색 및 필터링 (파일 타입, 날짜)
- [ ] **CMS-069**: URL 복사 기능
- [ ] **CMS-070**: 일괄 삭제 기능
- [ ] **CMS-071**: 미디어 라이브러리 E2E 테스트 3개

### P2: 팀원 관리
- [ ] **CMS-072**: TeamList.tsx 생성 (드래그 앤 드롭 정렬)
- [ ] **CMS-073**: TeamForm.tsx 생성
- [ ] **CMS-074**: 아바타 업로드 (원형 크롭 미리보기)
- [ ] **CMS-075**: 스킬셋 태그 입력
- [ ] **CMS-076**: 소셜 링크 입력 (URL 검증)
- [ ] **CMS-077**: useCRUD('team_members') 연동
- [ ] **CMS-078**: 팀원 E2E 테스트 3개

### P2: SEO 설정
- [ ] **CMS-079**: 블로그 폼에 SEO 필드 추가 (SEO 제목, SEO 설명)
- [ ] **CMS-080**: 포트폴리오 폼에 SEO 필드 추가
- [ ] **CMS-081**: Open Graph 이미지 업로드
- [ ] **CMS-082**: Sitemap 자동 생성 로직 확인 (generate-sitemap.ts)

### P3: 관리자 설정 (Super Admin만)
- [ ] **CMS-083**: AdminSettings.tsx 생성
- [ ] **CMS-084**: 관리자 목록 조회
- [ ] **CMS-085**: 관리자 추가/제거
- [ ] **CMS-086**: 역할 변경 (Super Admin/Admin/Editor)
- [ ] **CMS-087**: 관리자 설정 E2E 테스트 3개

---

## Phase 4: 최적화 및 테스트 (1주)

### P0: 성능 최적화
- [ ] **CMS-088**: React.lazy() 적용 (모든 관리자 페이지)
- [ ] **CMS-089**: Vite manualChunks 설정 (admin 청크 분리)
- [ ] **CMS-090**: React Query 캐싱 전략 재검토
- [ ] **CMS-091**: 이미지 Lazy Loading 적용
- [ ] **CMS-092**: Lighthouse CI 실행 (Performance 90+ 목표)

### P0: 테스트 작성
- [ ] **CMS-093**: E2E 테스트 총 20+개 작성
  - [ ] 로드맵 5개
  - [ ] 포트폴리오 5개
  - [ ] 블로그 5개
  - [ ] 실험실 3개
  - [ ] 미디어 라이브러리 3개
  - [ ] 팀원 3개
  - [ ] 관리자 설정 3개
- [ ] **CMS-094**: 유닛 테스트 10+개 작성
  - [ ] useCRUD 5개
  - [ ] usePermissions 3개
  - [ ] useFileUpload 3개
- [ ] **CMS-095**: 접근성 테스트 (jest-axe)
- [ ] **CMS-096**: Playwright 실행 (모든 테스트 통과)

### P1: 문서화
- [ ] **CMS-097**: 사용자 가이드 작성 (docs/cms/user-guide.md)
  - [ ] 관리자 계정 생성 방법
  - [ ] 각 메뉴 사용법 (스크린샷 포함)
  - [ ] FAQ
- [ ] **CMS-098**: 개발자 문서 작성 (docs/cms/developer-guide.md)
  - [ ] 시스템 아키텍처
  - [ ] API 문서 (RPC 함수)
  - [ ] 데이터베이스 스키마 ERD
- [ ] **CMS-099**: CLAUDE.md 업데이트 (CMS 링크 추가)
- [ ] **CMS-100**: roadmap.md 업데이트 (CMS Phase 추가)

### P0: 배포
- [ ] **CMS-101**: main 브랜치 푸시
- [ ] **CMS-102**: Vercel 자동 배포 확인
- [ ] **CMS-103**: 프로덕션 Smoke 테스트 (주요 기능 확인)
- [ ] **CMS-104**: Sentry 에러 모니터링 확인

---

## 백로그 (향후 확장)

### P3: 실시간 기능 (Phase 5)
- [ ] **CMS-105**: Supabase Realtime 구독 (roadmap_items, portfolio_items)
- [ ] **CMS-106**: 실시간 목록 업데이트
- [ ] **CMS-107**: 편집 중 표시 (다른 사용자가 편집 중)
- [ ] **CMS-108**: 자동 저장 (30초마다)

### P3: 협업 기능 (Phase 6)
- [ ] **CMS-109**: 댓글 시스템 (콘텐츠별 댓글)
- [ ] **CMS-110**: 멘션 기능 (@username)
- [ ] **CMS-111**: 알림 시스템 (새 댓글, 멘션)

### P3: 버전 히스토리 (Phase 7)
- [ ] **CMS-112**: Git-like 버전 관리 (commit, diff, revert)
- [ ] **CMS-113**: 변경 이력 조회 (누가, 언제, 무엇을)
- [ ] **CMS-114**: 이전 버전 복원

### P3: 다중 언어 CMS (Phase 8)
- [ ] **CMS-115**: 언어별 콘텐츠 관리 (한국어/영어)
- [ ] **CMS-116**: 번역 상태 추적 (translated, pending)
- [ ] **CMS-117**: 언어 전환 UI

---

## 작업 진행 상태

**범례**:
- [ ] 미완료 (Pending)
- [x] 완료 (Done)
- [~] 진행 중 (In Progress)
- [-] 스킵 (Skipped)

**현재 진행**: Phase 0 (문서화 완료)
**다음 단계**: Phase 1 시작 (데이터베이스 스키마)

---

## 예상 일정

| Phase | 기간 | 시작일 | 종료일 | 상태 |
|-------|------|--------|--------|------|
| Phase 0 (문서화) | 1일 | 2025-11-15 | 2025-11-15 | ✅ 완료 |
| Phase 1 (기반) | 2주 | TBD | TBD | 📋 대기 |
| Phase 2 (핵심) | 3주 | TBD | TBD | 📋 대기 |
| Phase 3 (고급) | 2주 | TBD | TBD | 📋 대기 |
| Phase 4 (최적화) | 1주 | TBD | TBD | 📋 대기 |
| **Total** | **8주** | | | |

---

**작성자**: Sinclair Seo (with Claude)
**최종 업데이트**: 2025-11-15
