# Version 2.0 아키텍처 설계

> 기술적 접근 방법과 시스템 구조 정의

**작성일**: 2025-11-13
**버전**: 2.0.0
**상태**: 📋 Draft
**담당자**: IDEA on Action Team

---

## 🏗️ 시스템 아키텍처

### 전체 구조

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Browser)                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │  React 18 + Vite + TypeScript                     │  │
│  │  - Pages: Home, About, Roadmap, Portfolio, etc.   │  │
│  │  - Components: shadcn/ui, Custom Components       │  │
│  │  - State: React Query, Zustand                    │  │
│  │  - Routing: React Router DOM                      │  │
│  │  - i18n: i18next                                  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  Supabase (Backend)                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │  PostgreSQL Database                              │  │
│  │  - projects, roadmap, logs, bounties, posts      │  │
│  │  - RLS Policies                                   │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Supabase Auth                                    │  │
│  │  - OAuth (Google, GitHub, Kakao)                 │  │
│  │  - JWT Tokens                                     │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Supabase Storage                                 │  │
│  │  - Project Images, Avatars                       │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Supabase Functions (Edge Functions)             │  │
│  │  - Weekly Recap Generator                        │  │
│  │  - Metrics Aggregator                            │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Third-Party Services                        │
│  - Giscus (GitHub Discussions)                          │
│  - Resend (Email Service)                               │
│  - Vercel (Hosting & CD)                                │
│  - Sentry (Error Tracking)                              │
│  - Google Analytics 4                                   │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 컴포넌트 구조

### 페이지별 컴포넌트 맵

#### 1. Home 페이지
```
HomePage
├── HeroSection
├── NowHighlight (최근 로그 3개)
├── RoadmapProgress (현재 분기 진행률)
├── PortfolioHighlight (추천 프로젝트 3개)
├── OpenBounty (활성 바운티 3개)
└── NewsletterCTA
```

#### 2. About 페이지
```
AboutPage
├── PageLayout
│   ├── HeroSection (Mission Statement)
│   ├── Section (Vision)
│   ├── Section (Values)
│   └── Section (Team - Optional)
```

#### 3. Roadmap 페이지
```
RoadmapPage
├── PageLayout
│   ├── HeroSection
│   └── Section
│       ├── QuarterTabs (Q1, Q2, Q3, Q4)
│       └── RoadmapCard[]
│           ├── ProgressRing
│           ├── RiskBadge
│           └── OwnerBadge
```

#### 4. Portfolio 페이지
```
PortfolioPage
├── PageLayout
│   ├── HeroSection
│   └── Section
│       ├── FilterBar (상태, 태그)
│       └── ProjectCard[]
│           ├── ProjectImage
│           ├── StatusBadge
│           ├── TagList
│           └── MetricsDisplay

ProjectDetailPage (/portfolio/:slug)
├── PageLayout
│   ├── ProjectHero
│   ├── Section (Overview)
│   ├── Section (Metrics)
│   ├── Section (Links)
│   └── Section (Related Projects)
```

#### 5. Now 페이지
```
NowPage
├── PageLayout
│   ├── HeroSection
│   └── Section
│       ├── FilterBar (타입, 프로젝트)
│       └── LogCard[]
│           ├── TypeBadge
│           ├── ProjectLink
│           └── Timestamp
```

#### 6. Lab 페이지
```
LabPage
├── PageLayout
│   ├── HeroSection
│   └── Section
│       ├── ExperimentCard[] (실험 프로젝트)
│       └── BountyCard[]
│           ├── SkillBadge
│           ├── RewardDisplay
│           ├── DeadlineDisplay
│           └── ApplyButton
```

#### 7. Community 페이지
```
CommunityPage
├── PageLayout
│   ├── HeroSection
│   └── Section
│       └── GiscusEmbed (GitHub Discussions)
```

#### 8. Blog 페이지
```
BlogPage
├── PageLayout
│   ├── HeroSection
│   └── Section
│       ├── FilterBar (카테고리, 태그)
│       └── PostCard[]
│           ├── Thumbnail
│           ├── TagList
│           └── PublishedDate

BlogPostPage (/blog/:slug)
├── PageLayout
│   ├── PostHero
│   ├── MarkdownContent
│   ├── ShareButtons
│   └── GiscusEmbed
```

#### 9. Work with Us 페이지
```
WorkWithUsPage
├── PageLayout
│   ├── HeroSection
│   ├── Section (Packages)
│   │   ├── PackageTile (컨설팅)
│   │   ├── PackageTile (개발)
│   │   └── PackageTile (디자인)
│   └── Section (Brief Form)
│       └── BriefForm
│           ├── FormField (이름, 이메일, 회사명)
│           ├── FormSelect (프로젝트 유형)
│           ├── FormSelect (예산 범위)
│           ├── FormTextarea (프로젝트 설명)
│           └── FormFile (첨부 파일)
```

#### 10. Status 페이지
```
StatusPage
├── PageLayout
│   ├── HeroSection
│   └── Section
│       ├── MetricCard[] (프로젝트, 바운티, 커밋, 구독자)
│       └── ChartBlock (활동 추세)
```

---

## 🗄️ 데이터베이스 스키마

### ERD (Entity Relationship Diagram)

```
┌─────────────────┐
│    projects     │
├─────────────────┤
│ id (PK)         │◄──┐
│ title           │   │
│ summary         │   │
│ status          │   │
│ tags[]          │   │
│ metrics (JSONB) │   │
│ links (JSONB)   │   │
│ created_at      │   │
└─────────────────┘   │
                      │
                      │ FK (project_id)
                      │
┌─────────────────┐   │
│    roadmap      │   │
├─────────────────┤   │
│ id (PK)         │   │
│ quarter         │   │
│ goal            │   │
│ progress        │   │
│ risk            │   │
│ owner           │   │
│ related_projs[] │───┘
└─────────────────┘

┌─────────────────┐
│      logs       │
├─────────────────┤
│ id (PK)         │
│ type            │
│ content         │
│ project_id (FK) │───┐
│ created_at      │   │
└─────────────────┘   │
                      │
┌─────────────────┐   │
│    bounties     │   │
├─────────────────┤   │
│ id (PK)         │   │
│ title           │   │
│ skill           │   │
│ reward          │   │
│ deadline        │   │
│ status          │   │
│ applicants[]    │   │
└─────────────────┘   │
                      │
┌─────────────────┐   │
│      posts      │   │
├─────────────────┤   │
│ id (PK)         │   │
│ slug (UNIQUE)   │   │
│ title           │   │
│ body            │   │
│ tags[]          │   │
│ series          │   │
│ published_at    │   │
└─────────────────┘   │
```

### RLS 정책 (Row Level Security)

#### projects 테이블
```sql
-- SELECT: 모든 사용자
CREATE POLICY "Anyone can view projects"
  ON projects FOR SELECT
  USING (true);

-- INSERT/UPDATE/DELETE: 관리자만
CREATE POLICY "Only admins can modify projects"
  ON projects FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');
```

#### roadmap 테이블
```sql
-- SELECT: 모든 사용자
CREATE POLICY "Anyone can view roadmap"
  ON roadmap FOR SELECT
  USING (true);

-- INSERT/UPDATE/DELETE: 관리자만
CREATE POLICY "Only admins can modify roadmap"
  ON roadmap FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');
```

#### logs 테이블
```sql
-- SELECT: 모든 사용자
CREATE POLICY "Anyone can view logs"
  ON logs FOR SELECT
  USING (true);

-- INSERT/UPDATE/DELETE: 관리자만
CREATE POLICY "Only admins can modify logs"
  ON logs FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');
```

#### bounties 테이블
```sql
-- SELECT: 모든 사용자
CREATE POLICY "Anyone can view bounties"
  ON bounties FOR SELECT
  USING (true);

-- INSERT/UPDATE/DELETE: 관리자만
CREATE POLICY "Only admins can modify bounties"
  ON bounties FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- UPDATE applicants: 인증된 사용자
CREATE POLICY "Authenticated users can apply to bounties"
  ON bounties FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.uid() = ANY(applicants));
```

#### posts 테이블
```sql
-- SELECT: 모든 사용자 (published_at이 과거인 것만)
CREATE POLICY "Anyone can view published posts"
  ON posts FOR SELECT
  USING (published_at <= NOW());

-- INSERT/UPDATE/DELETE: 관리자만
CREATE POLICY "Only admins can modify posts"
  ON posts FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');
```

---

## 🔄 데이터 흐름

### 1. 페이지 렌더링 흐름

```
User Request → React Router → Page Component
                                     │
                                     ▼
                           Custom Hook (e.g., useProjects)
                                     │
                                     ▼
                           React Query (useQuery)
                                     │
                                     ▼
                          Supabase Client (SELECT)
                                     │
                                     ▼
                          RLS Policy Check
                                     │
                                     ▼
                          PostgreSQL Query
                                     │
                                     ▼
                          Response (JSON)
                                     │
                                     ▼
                          React Query Cache
                                     │
                                     ▼
                          Component Re-render
```

### 2. CRUD 작업 흐름 (관리자)

```
Admin Action (Create/Update/Delete)
                │
                ▼
Admin Component (Form Submit)
                │
                ▼
Custom Hook (e.g., useCreateProject)
                │
                ▼
React Query (useMutation)
                │
                ▼
Supabase Client (INSERT/UPDATE/DELETE)
                │
                ▼
RLS Policy Check (Admin Only)
                │
                ▼
PostgreSQL Mutation
                │
                ▼
Response (Success/Error)
                │
                ▼
React Query Invalidate Cache
                │
                ▼
UI Update (Success Toast)
```

### 3. Newsletter 구독 흐름

```
User Submit Email
        │
        ▼
NewsletterForm Component
        │
        ▼
useNewsletter Hook
        │
        ▼
Supabase (INSERT newsletter_subscriptions)
        │
        ▼
Resend API (Confirmation Email)
        │
        ▼
Success Toast
```

### 4. Weekly Recap 자동 생성 흐름

```
Supabase Cron Job (매주 일요일 23:59)
                │
                ▼
Supabase Edge Function (generate-weekly-recap)
                │
                ▼
Query logs (최근 7일)
                │
                ▼
Group by type (decision/learning/release)
                │
                ▼
Generate Markdown Summary
                │
                ▼
INSERT into posts (series='Weekly Recap')
                │
                ▼
Resend API (Send Newsletter)
```

---

## 🔌 API 엔드포인트

### Supabase REST API

#### Projects
- `GET /rest/v1/projects` - 프로젝트 목록
- `GET /rest/v1/projects?id=eq.{id}` - 프로젝트 상세
- `POST /rest/v1/projects` - 프로젝트 생성 (Admin)
- `PATCH /rest/v1/projects?id=eq.{id}` - 프로젝트 수정 (Admin)
- `DELETE /rest/v1/projects?id=eq.{id}` - 프로젝트 삭제 (Admin)

#### Roadmap
- `GET /rest/v1/roadmap` - 로드맵 목록
- `GET /rest/v1/roadmap?quarter=eq.{quarter}` - 분기별 로드맵
- `POST /rest/v1/roadmap` - 로드맵 생성 (Admin)
- `PATCH /rest/v1/roadmap?id=eq.{id}` - 로드맵 수정 (Admin)
- `DELETE /rest/v1/roadmap?id=eq.{id}` - 로드맵 삭제 (Admin)

#### Logs
- `GET /rest/v1/logs?order=created_at.desc&limit=30` - 최근 로그
- `GET /rest/v1/logs?type=eq.{type}` - 타입별 로그
- `POST /rest/v1/logs` - 로그 생성 (Admin)

#### Bounties
- `GET /rest/v1/bounties?status=eq.open` - 활성 바운티
- `POST /rest/v1/bounties` - 바운티 생성 (Admin)
- `PATCH /rest/v1/bounties?id=eq.{id}` - 바운티 신청 (User)

#### Posts
- `GET /rest/v1/posts?published_at=lte.{now}` - 공개 포스트
- `GET /rest/v1/posts?slug=eq.{slug}` - 포스트 상세
- `POST /rest/v1/posts` - 포스트 생성 (Admin)

### Custom Edge Functions

#### `/functions/generate-weekly-recap`
- **Method**: POST (Cron Trigger)
- **Auth**: Service Role Key
- **Response**: `{ success: boolean, post_id: number }`

#### `/functions/aggregate-metrics`
- **Method**: GET
- **Query**: `?cache=5m`
- **Response**:
  ```json
  {
    "projects": 12,
    "bounties": 5,
    "commits": 234,
    "contributors": 8,
    "subscribers": 150
  }
  ```

### External APIs

#### Giscus (GitHub Discussions)
- **Embed**: `<script src="https://giscus.app/client.js">`
- **Config**: repository, mapping, theme

#### Resend (Email Service)
- **Endpoint**: `POST https://api.resend.com/emails`
- **Payload**:
  ```json
  {
    "from": "IDEA on Action <no-reply@ideaonaction.ai>",
    "to": ["subscriber@example.com"],
    "subject": "Weekly Recap",
    "html": "<html>...</html>"
  }
  ```

---

## 🎨 UI/UX 원칙

### 디자인 시스템 활용
- **기존 시스템**: Tailwind CSS, shadcn/ui
- **색상**: Primary (Blue), Accent (Orange), Secondary (Purple)
- **테마**: Light/Dark 모드 지원
- **타이포그래피**: Inter (본문), JetBrains Mono (코드)

### 레이아웃 패턴
- **PageLayout**: 일관된 페이지 구조
  - Header (고정)
  - Main (스크롤 가능)
  - Footer (고정)
- **Section**: 섹션 구분 (여백, 배경)
- **Card**: 콘텐츠 그룹화 (글래스모피즘)

### 반응형 디자인
- **Mobile**: 1열 레이아웃
- **Tablet**: 2열 레이아웃
- **Desktop**: 3열 레이아웃
- **Breakpoints**: 640px, 1024px

### 접근성
- **키보드 네비게이션**: 모든 인터랙티브 요소
- **스크린 리더**: aria-label, aria-describedby
- **색상 대비**: 4.5:1 이상
- **Focus Visible**: 포커스 표시

---

## 🔒 보안 고려사항

### 1. RLS (Row Level Security)
- 모든 테이블에 RLS 적용
- SELECT: 모든 사용자
- INSERT/UPDATE/DELETE: 관리자만

### 2. 환경 변수 관리
- `.env.local` (gitignore)
- `VITE_` 접두사 (클라이언트 노출)
- Vercel Secrets (배포 시)

### 3. XSS 방지
- React의 기본 이스케이핑 활용
- Markdown 렌더링 시 `react-markdown` 사용
- 사용자 입력 검증 (Zod)

### 4. CSRF 방지
- Supabase JWT 토큰 사용
- SameSite 쿠키 설정

### 5. Rate Limiting
- Supabase Edge Functions에서 설정
- Newsletter 구독: 1회/분/IP
- Brief 제출: 5회/시간/IP

---

## 📊 성능 최적화

### 1. Code Splitting
- React.lazy + Suspense
- Vite manualChunks
- 페이지별 청크 분리

### 2. 이미지 최적화
- WebP 형식 사용
- Lazy Loading (Intersection Observer)
- Supabase Storage CDN

### 3. 캐싱 전략
- **React Query**: staleTime 5분
- **Service Worker**: CacheFirst (정적 리소스)
- **Redis**: Metrics API (5분 TTL)

### 4. Core Web Vitals 목표
- **FCP**: 1.5초 이하
- **TTI**: 3.0초 이하
- **CLS**: 0.1 이하

---

## 🧪 테스트 전략

### 1. 유닛 테스트 (Vitest)
- 커스텀 훅 (useProjects, useRoadmap, etc.)
- 유틸리티 함수
- 컴포넌트 렌더링

### 2. E2E 테스트 (Playwright)
- 사용자 여정 (Journey 1, 2, 3)
- CRUD 작업 (Admin)
- 폼 제출 (Newsletter, Brief)

### 3. 시각적 회귀 테스트
- 다크 모드 전환
- 반응형 레이아웃
- 스크린샷 비교

### 4. 접근성 테스트
- Axe-core 통합
- WCAG 2.1 AA 준수

---

## 📦 배포 전략

### CI/CD 파이프라인

```
GitHub Push
    │
    ▼
GitHub Actions
    │
    ├── Lint (ESLint)
    ├── Type Check (TypeScript)
    ├── Unit Test (Vitest)
    ├── E2E Test (Playwright)
    └── Build (Vite)
    │
    ▼
Vercel Deployment
    │
    ├── Preview (PR)
    └── Production (main)
```

### 브랜치 전략
- **main**: Production
- **develop**: Development
- **feature/***: Feature branches
- **hotfix/***: Hotfix branches

### 롤백 전략
- Vercel 이전 배포로 롤백
- GitHub Revert Commit
- Supabase Migration Revert

---

**Last Updated**: 2025-11-13
**Version**: 2.0.0
**Status**: 📋 Draft
**Next Review**: 2025-11-20
