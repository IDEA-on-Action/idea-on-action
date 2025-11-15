# CMS 관리자 모드 구현 전략

**작성일**: 2025-11-15
**버전**: 1.0
**담당자**: Sinclair Seo

---

## 1. 구현 우선순위

### 1.1 Phase 분류
```
Phase 1: 기반 구축 (2주) → Must Have
Phase 2: 핵심 기능 (3주) → Must Have
Phase 3: 고급 기능 (2주) → Should Have
Phase 4: 최적화 및 테스트 (1주) → Must Have
```

### 1.2 MoSCoW 우선순위
| 분류 | 기능 | 이유 |
|------|------|------|
| **Must Have** | 로드맵, 포트폴리오, 블로그 CRUD | 핵심 콘텐츠 관리 |
| **Should Have** | 실험실, 팀원, 미디어 라이브러리 | 부가 기능 |
| **Could Have** | 실시간 업데이트, 협업 기능 | 향후 확장 |
| **Won't Have** | 버전 히스토리, 다중 언어 CMS | 복잡도 높음 |

---

## 2. Phase 1: 기반 구축 (2주)

### 2.1 Week 1: 데이터베이스 & 인증

#### Day 1-2: 데이터베이스 스키마 설계
**작업 항목**:
- [ ] ERD 설계 (8개 테이블)
- [ ] SQL 마이그레이션 파일 작성
  ```
  supabase/migrations/
  ├── 20251115000001_create_admins.sql
  ├── 20251115000002_create_roadmap_items.sql
  ├── 20251115000003_create_portfolio_items.sql
  ├── 20251115000004_create_lab_items.sql
  ├── 20251115000005_create_blog_posts.sql
  ├── 20251115000006_create_team_members.sql
  ├── 20251115000007_create_categories.sql
  └── 20251115000008_create_tags.sql
  ```
- [ ] Supabase Dashboard에서 마이그레이션 실행
- [ ] RLS 정책 10개 설정
- [ ] 인덱스 생성 (15+개)

**완료 기준**:
- [ ] 모든 테이블 생성 완료
- [ ] RLS 정책 테스트 통과 (anon, authenticated, admin)
- [ ] Supabase Type Generator 실행 → `database.types.ts` 생성

#### Day 3-4: 관리자 인증 시스템
**작업 항목**:
- [ ] `admins` 테이블에 Super Admin 계정 생성 (수동)
- [ ] `useAuth` 훅 확장 (기존 훅에 `isAdmin`, `adminRole` 추가)
- [ ] `usePermissions` 훅 생성 (권한 체크)
- [ ] `ProtectedRoute` 컴포넌트 수정 (관리자 체크)
- [ ] Login 페이지 수정 (관리자 로그인 후 /admin 리다이렉트)

**완료 기준**:
- [ ] Super Admin 계정으로 로그인 성공
- [ ] `/admin` 접근 시 대시보드 표시
- [ ] 일반 사용자 접근 시 403 Forbidden 표시

#### Day 5: Admin Layout 구조
**작업 항목**:
- [ ] `AdminLayout.tsx` 생성 (Header + Sidebar + Main)
- [ ] `Sidebar.tsx` 생성 (네비게이션 메뉴)
- [ ] `AdminHeader.tsx` 생성 (프로필, 로그아웃)
- [ ] `Breadcrumb.tsx` 생성 (경로 표시)
- [ ] Sidebar 토글 기능 (모바일용)

**완료 기준**:
- [ ] 사이드바 메뉴 클릭 시 페이지 전환
- [ ] 현재 페이지 하이라이트
- [ ] 모바일에서 햄버거 메뉴 동작

### 2.2 Week 2: 공통 컴포넌트

#### Day 6-7: 공통 UI 컴포넌트
**작업 항목**:
- [ ] `Table.tsx` 생성 (정렬, 페이지네이션 지원)
- [ ] `Modal.tsx` 생성 (확인 대화상자)
- [ ] `LoadingState.tsx`, `ErrorState.tsx`, `EmptyState.tsx` 생성
- [ ] `FormField.tsx` 생성 (React Hook Form 래퍼)
- [ ] `DatePicker.tsx` 생성 (date-fns 통합)
- [ ] `MultiSelect.tsx` 생성 (태그 입력)

**완료 기준**:
- [ ] Storybook 스토리 작성 (선택)
- [ ] 유닛 테스트 5개 작성

#### Day 8-9: useCRUD Hook
**작업 항목**:
- [ ] `src/hooks/useCRUD.ts` 생성
  - `list()` - 목록 조회 (필터링, 정렬, 페이지네이션)
  - `get()` - 단일 조회
  - `create()` - 생성
  - `update()` - 수정 (Optimistic Update)
  - `delete()` - 삭제
- [ ] 유닛 테스트 10개 작성
- [ ] React Query 캐싱 전략 설정

**완료 기준**:
- [ ] 모든 함수 테스트 통과
- [ ] Optimistic Update 동작 확인

#### Day 10: 파일 업로드 시스템
**작업 항목**:
- [ ] Supabase Storage 버킷 생성 (public/portfolio, public/blog 등)
- [ ] `useFileUpload` 훅 생성
  - `upload()` - 파일 업로드
  - `delete()` - 파일 삭제
  - `getPublicUrl()` - Public URL 반환
- [ ] `ImageUpload.tsx` 컴포넌트 생성 (드래그 앤 드롭, 미리보기)
- [ ] 파일 검증 로직 (크기, MIME 타입)

**완료 기준**:
- [ ] 이미지 업로드 성공
- [ ] 5MB 초과 파일 에러 표시
- [ ] 허용되지 않은 파일 타입 에러 표시

---

## 3. Phase 2: 핵심 기능 (3주)

### 3.1 Week 3: 로드맵 관리

#### Day 11-13: 로드맵 CRUD
**작업 항목**:
- [ ] `RoadmapList.tsx` 생성 (목록 페이지)
  - Table 컴포넌트 사용
  - 필터링 (카테고리, 상태)
  - 검색 (제목)
- [ ] `RoadmapForm.tsx` 생성 (생성/수정 폼)
  - React Hook Form + Zod 검증
  - 진행률 슬라이더
  - 태그 입력 (MultiSelect)
  - 공개/비공개 체크박스
- [ ] useCRUD 훅 연동
- [ ] E2E 테스트 5개 작성

**완료 기준**:
- [ ] 로드맵 생성/수정/삭제 가능
- [ ] 필터링/검색 동작
- [ ] 공개 로드맵 페이지 (`/roadmap`)에 즉시 반영

#### Day 14-15: 로드맵 상세 페이지 (선택)
**작업 항목**:
- [ ] `RoadmapDetail.tsx` 생성 (상세 보기)
- [ ] 진행률 차트 (Recharts)
- [ ] 관련 프로젝트 링크

### 3.2 Week 4: 포트폴리오 관리

#### Day 16-18: 포트폴리오 CRUD
**작업 항목**:
- [ ] `PortfolioList.tsx` 생성 (카드 그리드 레이아웃)
- [ ] `PortfolioForm.tsx` 생성 (생성/수정 폼)
  - Slug 자동 생성 로직
  - 이미지 갤러리 (ImageUpload 다중)
  - 기술 스택 태그 입력
  - 주요 프로젝트 체크박스
- [ ] E2E 테스트 5개 작성

**완료 기준**:
- [ ] 포트폴리오 생성/수정/삭제 가능
- [ ] 이미지 갤러리 드래그 앤 드롭 업로드
- [ ] Slug 중복 시 자동 suffix 추가

#### Day 19-20: 포트폴리오 상세 페이지
**작업 항목**:
- [ ] `PortfolioDetail.tsx` 생성
- [ ] 이미지 갤러리 Carousel
- [ ] 고객 평가 섹션

### 3.3 Week 5: 블로그 & 실험실

#### Day 21-23: 블로그 CRUD
**작업 항목**:
- [ ] `BlogList.tsx` 생성
- [ ] `BlogForm.tsx` 생성
  - Tiptap 에디터 통합 (`RichTextEditor.tsx`)
  - 코드 블록 문법 하이라이팅
  - 이미지 드래그 앤 드롭 삽입
  - 초안 저장 기능
- [ ] 카테고리 관리 페이지 (`CategoryList.tsx`, `CategoryForm.tsx`)
- [ ] E2E 테스트 5개 작성

**완료 기준**:
- [ ] 블로그 포스트 작성/수정/삭제 가능
- [ ] Markdown 렌더링 정상 동작
- [ ] 코드 블록 하이라이팅

#### Day 24-25: 실험실 CRUD
**작업 항목**:
- [ ] `LabList.tsx` 생성
- [ ] `LabForm.tsx` 생성
  - 기여자 추가/제거 UI
  - GitHub URL 입력
- [ ] E2E 테스트 3개 작성

---

## 4. Phase 3: 고급 기능 (2주)

### 4.1 Week 6: 미디어 라이브러리

#### Day 26-28: 미디어 라이브러리 구현
**작업 항목**:
- [ ] `MediaLibrary.tsx` 생성 (그리드/리스트 뷰)
- [ ] `MediaGrid.tsx` 생성 (파일 카드)
- [ ] `MediaUploader.tsx` 생성 (다중 업로드)
- [ ] 검색 및 필터링 (파일 타입, 날짜)
- [ ] URL 복사 기능
- [ ] 일괄 삭제 기능

**완료 기준**:
- [ ] 파일 업로드/삭제 가능
- [ ] URL 복사 버튼 동작
- [ ] 그리드/리스트 뷰 전환

#### Day 29-30: 팀원 관리
**작업 항목**:
- [ ] `TeamList.tsx` 생성 (드래그 앤 드롭 정렬)
- [ ] `TeamForm.tsx` 생성
  - 아바타 업로드
  - 스킬셋 태그 입력
  - 소셜 링크 입력 (URL 검증)
- [ ] E2E 테스트 3개 작성

### 4.2 Week 7: SEO 및 설정

#### Day 31-33: SEO 설정 UI
**작업 항목**:
- [ ] 블로그/포트폴리오 폼에 SEO 필드 추가
  - SEO 제목, SEO 설명
  - Open Graph 이미지
- [ ] Sitemap 자동 생성 로직 확인 (기존 `scripts/generate-sitemap.ts` 사용)
- [ ] robots.txt 관리 UI (선택)

#### Day 34-35: 관리자 설정
**작업 항목**:
- [ ] `AdminSettings.tsx` 생성 (Super Admin만)
  - 관리자 목록 조회
  - 관리자 추가/제거
  - 역할 변경
- [ ] E2E 테스트 3개 작성

---

## 5. Phase 4: 최적화 및 테스트 (1주)

### 5.1 Day 36-37: 성능 최적화

**작업 항목**:
- [ ] React.lazy() 적용 (모든 관리자 페이지)
- [ ] Vite manualChunks 설정 (admin 청크 분리)
- [ ] React Query 캐싱 전략 재검토
- [ ] 이미지 Lazy Loading 적용
- [ ] Lighthouse CI 실행 (Performance 90+ 목표)

**완료 기준**:
- [ ] Admin 번들 크기 < 300 KB (gzip)
- [ ] 페이지 로딩 시간 < 2초

### 5.2 Day 38-39: 테스트 작성

**작업 항목**:
- [ ] E2E 테스트 20+개 작성 (기존 5+5+5+3+3 = 21개)
- [ ] 유닛 테스트 10+개 작성 (useCRUD, usePermissions, useFileUpload)
- [ ] 접근성 테스트 (jest-axe)
- [ ] Playwright 실행 (모든 테스트 통과)

**완료 기준**:
- [ ] 테스트 커버리지 70%+
- [ ] Accessibility 점수 95+

### 5.3 Day 40: 문서화 및 배포

**작업 항목**:
- [ ] 사용자 가이드 작성 (`docs/cms/user-guide.md`)
  - 관리자 계정 생성 방법
  - 각 메뉴 사용법 (스크린샷 포함)
  - FAQ
- [ ] 개발자 문서 작성 (`docs/cms/developer-guide.md`)
  - 시스템 아키텍처
  - API 문서 (RPC 함수)
  - 데이터베이스 스키마
- [ ] CLAUDE.md 업데이트 (CMS Phase 추가)
- [ ] roadmap.md 업데이트
- [ ] main 브랜치 푸시 → Vercel 자동 배포

**완료 기준**:
- [ ] 문서 2개 작성 완료
- [ ] 배포 성공 (Vercel)
- [ ] 프로덕션 동작 확인

---

## 6. 개발 워크플로우

### 6.1 일일 워크플로우
```
1. Git Pull (최신 코드 동기화)
2. 새 브랜치 생성 (feature/cms-roadmap-crud)
3. 작업 진행 (TDD: 테스트 → 구현 → 리팩토링)
4. ESLint/TypeScript 검사
5. 유닛 테스트 실행 (npm run test:unit)
6. 커밋 (Conventional Commits)
7. PR 생성 (main ← feature/*)
8. E2E 테스트 실행 (GitHub Actions)
9. 코드 리뷰 (선택)
10. Merge
```

### 6.2 TDD (Test-Driven Development) 사이클
```
Red (실패하는 테스트 작성)
  ↓
Green (최소한의 코드로 테스트 통과)
  ↓
Refactor (코드 정리, 중복 제거)
  ↓
Repeat
```

### 6.3 브랜치 전략
```
main         (프로덕션, 보호됨)
  ↑
  └─ feature/cms-* (기능 개발 브랜치)
```

---

## 7. 리스크 관리

### 7.1 기술적 리스크
| 리스크 | 확률 | 영향 | 대응 방안 |
|--------|------|------|-----------|
| Tiptap 러닝 커브 | 중간 | 높음 | 공식 문서 학습, 예제 코드 분석 |
| RLS 정책 복잡도 | 높음 | 중간 | Supabase Docs 참고, 테스트 케이스 작성 |
| 파일 업로드 실패 | 낮음 | 중간 | 에러 핸들링, 재시도 로직 |
| 성능 저하 | 중간 | 높음 | Code Splitting, React Query 캐싱 |

### 7.2 일정 리스크
| 리스크 | 확률 | 영향 | 대응 방안 |
|--------|------|------|-----------|
| Phase 2 지연 | 중간 | 높음 | 실험실 기능 Phase 3로 이동 |
| 테스트 작성 지연 | 낮음 | 중간 | Phase 4 일정 연장 (1주 → 2주) |

### 7.3 리소스 리스크
| 리스크 | 확률 | 영향 | 대응 방안 |
|--------|------|------|-----------|
| Supabase 무료 티어 초과 | 낮음 | 중간 | 유료 플랜 전환 (월 $25) |
| Vercel 무료 티어 초과 | 낮음 | 낮음 | 배포 빈도 조절 |

---

## 8. 품질 기준 (Quality Gates)

### 8.1 Phase별 완료 조건
**Phase 1 완료**:
- [ ] 관리자 로그인 성공
- [ ] Admin Layout 렌더링
- [ ] useCRUD 훅 테스트 통과

**Phase 2 완료**:
- [ ] 로드맵, 포트폴리오, 블로그 CRUD 동작
- [ ] E2E 테스트 15+개 통과

**Phase 3 완료**:
- [ ] 미디어 라이브러리 동작
- [ ] 팀원 관리 동작

**Phase 4 완료**:
- [ ] Lighthouse Performance 90+
- [ ] 테스트 커버리지 70%+
- [ ] 문서 2개 작성 완료

### 8.2 코드 리뷰 체크리스트
- [ ] TypeScript strict 모드 통과
- [ ] ESLint 에러 0개
- [ ] 유닛 테스트 작성 (함수/훅)
- [ ] E2E 테스트 작성 (사용자 플로우)
- [ ] 접근성 검사 (ARIA 속성)
- [ ] 에러 핸들링 (try-catch, ErrorBoundary)
- [ ] 보안 검사 (XSS, CSRF, SQL Injection)

---

## 9. 배포 전략

### 9.1 배포 단계
```
1. 개발 환경 테스트 (로컬)
2. Staging 배포 (Vercel Preview)
3. E2E 테스트 실행 (Playwright)
4. 프로덕션 배포 (main 브랜치 푸시)
5. Smoke 테스트 (주요 기능 확인)
6. 모니터링 (Sentry, GA4)
```

### 9.2 롤백 계획
```
1. Vercel Deployments에서 이전 버전 선택
2. "Promote to Production" 클릭
3. 즉시 롤백 완료 (< 1분)
```

---

## 10. 성공 지표 (KPI)

### 10.1 개발 효율성
- [ ] Phase별 일정 준수율 > 80%
- [ ] 버그 발견율 < 10% (테스트 커버리지 덕분)
- [ ] 코드 리뷰 시간 < 30분/PR

### 10.2 품질 지표
- [ ] Lighthouse Performance > 90
- [ ] 테스트 커버리지 > 70%
- [ ] E2E 테스트 통과율 100%
- [ ] 접근성 점수 > 95

### 10.3 운영 지표 (Phase 4 이후)
- [ ] 관리자 사용률 > 80% (주 1회 이상 로그인)
- [ ] 콘텐츠 업데이트 빈도 > 주 3회
- [ ] 에러율 < 0.1% (Sentry)

---

**작성자**: Sinclair Seo (with Claude)
**다음 단계**: [tasks/cms-backlog.md](../../tasks/cms-backlog.md)
