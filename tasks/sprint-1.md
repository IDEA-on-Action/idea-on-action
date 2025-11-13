# Sprint 1: Structure & Static Data

> 페이지 구조 및 정적 데이터 구축

**기간**: Week 1
**목표**: IA 구조 완성, 라우팅 구축, 목데이터 생성
**상태**: 📋 Planned

---

## 🎯 Sprint 목표

- [ ] React Router 라우팅 확장 (8개 새 페이지)
- [ ] 기존 Hero/Feature 컴포넌트 재활용
- [ ] 정적 데이터(JSON) 생성
- [ ] SEO/OG 메타태그 추가
- [ ] Lighthouse 90+ 점 유지

---

## 📋 작업 목록

### Task-S1-001: 라우팅 구조 확장 ⏱️ 2시간

**목표**: 새로운 페이지 라우트 추가

**구현 내용**:
- [ ] App.tsx에 라우트 추가
  - `/about` - About 페이지
  - `/roadmap` - Roadmap 페이지
  - `/portfolio` - Portfolio 목록
  - `/portfolio/:slug` - Portfolio 상세
  - `/now` - Now 페이지
  - `/lab` - Lab 페이지
  - `/community` - Community 페이지
  - `/work-with-us` - Work with Us 페이지
  - `/status` - Status 페이지
- [ ] 네비게이션 메뉴 업데이트 (Header.tsx)
- [ ] Footer 링크 업데이트

**완료 기준**:
- [ ] 모든 라우트 접근 가능
- [ ] 404 페이지 동작
- [ ] 네비게이션 정상 동작
- [ ] 빌드 성공

**관련 파일**:
- `src/App.tsx`
- `src/components/shared/Header.tsx`
- `src/components/shared/Footer.tsx`

**의존성**: 없음

---

### Task-S1-002: About 페이지 구현 ⏱️ 3시간

**목표**: 회사 소개 페이지 생성

**구현 내용**:
- [ ] `src/pages/About.tsx` 생성
- [ ] PageLayout 적용
- [ ] HeroSection (Mission Statement)
- [ ] Section: Vision
  - 회사 비전 텍스트
  - 비전 이미지/아이콘
- [ ] Section: Values
  - 3-5개 핵심 가치
  - 각 가치에 대한 설명
  - 아이콘
- [ ] Section: Team (Optional)
  - 팀 멤버 카드
  - 프로필 이미지, 이름, 역할
- [ ] 다크 모드 지원
- [ ] 반응형 디자인

**완료 기준**:
- [ ] About 페이지 렌더링
- [ ] 모든 섹션 표시
- [ ] 반응형 레이아웃 (모바일/태블릿/데스크톱)
- [ ] Lighthouse Accessibility 95+
- [ ] 린트 에러 0개

**관련 파일**:
- `src/pages/About.tsx`
- `src/components/layout/PageLayout.tsx`
- `src/components/layout/HeroSection.tsx`
- `src/components/layout/Section.tsx`

**의존성**: Task-S1-001

---

### Task-S1-003: 정적 데이터 생성 (projects.json) ⏱️ 1.5시간

**목표**: 프로젝트 목데이터 생성

**구현 내용**:
- [ ] `src/data/projects.json` 생성
- [ ] 3개 프로젝트 데이터 작성
  - id, title, summary
  - status (backlog/in-progress/validate/launched)
  - tags (최소 2개)
  - metrics (users, revenue, satisfaction)
  - links (github, demo, documentation)
  - created_at
- [ ] TypeScript 타입 정의 (`src/types/project.ts`)
- [ ] JSON 스키마 검증

**완료 기준**:
- [ ] projects.json 생성 (3개 프로젝트)
- [ ] 타입 정의 완료
- [ ] JSON 유효성 검증
- [ ] 린트 에러 0개

**관련 파일**:
- `src/data/projects.json`
- `src/types/project.ts`

**의존성**: 없음

---

### Task-S1-004: Portfolio 페이지 구현 (정적) ⏱️ 3시간

**목표**: 프로젝트 포트폴리오 목록 페이지 생성

**구현 내용**:
- [ ] `src/pages/Portfolio.tsx` 생성
- [ ] PageLayout 적용
- [ ] projects.json 데이터 로드
- [ ] FilterBar 컴포넌트
  - 상태별 필터 (전체/backlog/in-progress/validate/launched)
  - 태그별 필터
- [ ] ProjectCard 컴포넌트
  - 프로젝트 이미지 (플레이스홀더)
  - 제목, 요약
  - StatusBadge
  - TagList
  - MetricsDisplay (사용자, 매출)
- [ ] 그리드 레이아웃 (1열→2열→3열)
- [ ] 빈 상태 처리

**완료 기준**:
- [ ] Portfolio 페이지 렌더링
- [ ] 3개 프로젝트 카드 표시
- [ ] 필터 동작 (상태, 태그)
- [ ] 반응형 레이아웃
- [ ] 린트 에러 0개

**관련 파일**:
- `src/pages/Portfolio.tsx`
- `src/components/portfolio/FilterBar.tsx`
- `src/components/portfolio/ProjectCard.tsx`
- `src/data/projects.json`

**의존성**: Task-S1-003

---

### Task-S1-005: Portfolio 상세 페이지 구현 (정적) ⏱️ 2.5시간

**목표**: 프로젝트 상세 정보 페이지 생성

**구현 내용**:
- [ ] `src/pages/PortfolioDetail.tsx` 생성
- [ ] useParams로 slug 가져오기
- [ ] projects.json에서 해당 프로젝트 찾기
- [ ] PageLayout 적용
- [ ] ProjectHero 섹션
  - 프로젝트 이미지
  - 제목, 상태, 태그
- [ ] Section: Overview
  - 프로젝트 요약
  - 주요 기능 목록
- [ ] Section: Metrics
  - 사용자 수, 매출, 만족도
  - 차트/그래프 (옵션)
- [ ] Section: Links
  - GitHub, 데모, 문서 링크
- [ ] Section: Related Projects (옵션)
- [ ] 404 처리 (프로젝트 없음)

**완료 기준**:
- [ ] 상세 페이지 렌더링
- [ ] 모든 섹션 표시
- [ ] 링크 동작 확인
- [ ] 404 처리
- [ ] 린트 에러 0개

**관련 파일**:
- `src/pages/PortfolioDetail.tsx`
- `src/data/projects.json`

**의존성**: Task-S1-004

---

### Task-S1-006: 정적 데이터 생성 (roadmap.json, logs.json, bounties.json) ⏱️ 2시간

**목표**: 로드맵, 로그, 바운티 목데이터 생성

**구현 내용**:
- [ ] `src/data/roadmap.json` 생성
  - 5개 로드맵 항목 (Q1~Q4)
  - quarter, goal, progress, risk, owner, related_projects
- [ ] `src/data/logs.json` 생성
  - 10개 로그 항목
  - type (decision/learning/release), content, project_id, created_at
- [ ] `src/data/bounties.json` 생성
  - 2개 바운티 항목
  - title, skill, reward, deadline, status, applicants
- [ ] TypeScript 타입 정의
  - `src/types/roadmap.ts`
  - `src/types/log.ts`
  - `src/types/bounty.ts`
- [ ] JSON 스키마 검증

**완료 기준**:
- [ ] 3개 JSON 파일 생성
- [ ] 타입 정의 완료
- [ ] JSON 유효성 검증
- [ ] 린트 에러 0개

**관련 파일**:
- `src/data/roadmap.json`
- `src/data/logs.json`
- `src/data/bounties.json`
- `src/types/roadmap.ts`
- `src/types/log.ts`
- `src/types/bounty.ts`

**의존성**: 없음

---

### Task-S1-007: Roadmap 페이지 구현 (정적) ⏱️ 3시간

**목표**: 로드맵 페이지 생성

**구현 내용**:
- [ ] `src/pages/Roadmap.tsx` 생성 (기존 파일 업데이트)
- [ ] PageLayout 적용
- [ ] roadmap.json 데이터 로드
- [ ] QuarterTabs 컴포넌트
  - Q1, Q2, Q3, Q4 탭
  - 선택된 분기 상태 관리
- [ ] RoadmapCard 컴포넌트
  - 목표 텍스트
  - ProgressRing (0-100%)
  - RiskBadge (low/medium/high)
  - OwnerBadge
  - 관련 프로젝트 링크
- [ ] 빈 상태 처리
- [ ] 다크 모드 지원

**완료 기준**:
- [ ] Roadmap 페이지 렌더링
- [ ] 분기별 탭 동작
- [ ] 5개 로드맵 카드 표시
- [ ] 진행률 애니메이션
- [ ] 린트 에러 0개

**관련 파일**:
- `src/pages/Roadmap.tsx`
- `src/components/roadmap/QuarterTabs.tsx`
- `src/components/roadmap/RoadmapCard.tsx`
- `src/components/roadmap/ProgressRing.tsx`
- `src/data/roadmap.json`

**의존성**: Task-S1-006

---

### Task-S1-008: Now 페이지 구현 (정적) ⏱️ 2.5시간

**목표**: 최근 활동 로그 페이지 생성

**구현 내용**:
- [ ] `src/pages/Now.tsx` 생성
- [ ] PageLayout 적용
- [ ] logs.json 데이터 로드
- [ ] FilterBar 컴포넌트
  - 타입별 필터 (전체/decision/learning/release)
  - 프로젝트별 필터 (옵션)
- [ ] LogCard 컴포넌트
  - TypeBadge (decision/learning/release)
  - 로그 내용
  - ProjectLink (프로젝트 연결 시)
  - Timestamp (상대 시간 표시)
- [ ] 시간 역순 정렬
- [ ] 빈 상태 처리

**완료 기준**:
- [ ] Now 페이지 렌더링
- [ ] 10개 로그 카드 표시
- [ ] 필터 동작 (타입)
- [ ] 시간 역순 정렬
- [ ] 린트 에러 0개

**관련 파일**:
- `src/pages/Now.tsx`
- `src/components/now/FilterBar.tsx`
- `src/components/now/LogCard.tsx`
- `src/data/logs.json`

**의존성**: Task-S1-006

---

### Task-S1-009: Lab 페이지 구현 (정적) ⏱️ 3시간

**목표**: 실험 프로젝트 및 바운티 페이지 생성

**구현 내용**:
- [ ] `src/pages/Lab.tsx` 생성
- [ ] PageLayout 적용
- [ ] bounties.json 데이터 로드
- [ ] Section: Experiments (옵션)
  - ExperimentCard 컴포넌트
  - 실험 프로젝트 설명
- [ ] Section: Bounties
  - BountyCard 컴포넌트
    - 제목, 스킬
    - RewardDisplay (금액)
    - DeadlineDisplay (마감일)
    - StatusBadge (open/assigned/done)
    - ApplyButton (비활성화, Sprint 2에서 활성화)
- [ ] 빈 상태 처리
- [ ] 다크 모드 지원

**완료 기준**:
- [ ] Lab 페이지 렌더링
- [ ] 2개 바운티 카드 표시
- [ ] 보상 및 마감일 표시
- [ ] Apply 버튼 (비활성화)
- [ ] 린트 에러 0개

**관련 파일**:
- `src/pages/Lab.tsx`
- `src/components/lab/ExperimentCard.tsx`
- `src/components/lab/BountyCard.tsx`
- `src/data/bounties.json`

**의존성**: Task-S1-006

---

### Task-S1-010: Home 페이지 강화 ⏱️ 2.5시간

**목표**: Home 페이지에 새로운 섹션 추가

**구현 내용**:
- [ ] `src/pages/Index.tsx` 업데이트
- [ ] Section: Now Highlight
  - 최근 로그 3개 표시
  - logs.json 데이터 로드
  - "더보기" 링크 (/now)
- [ ] Section: Roadmap Progress
  - 현재 분기 진행률 표시
  - roadmap.json 데이터 로드
  - "자세히 보기" 링크 (/roadmap)
- [ ] Section: Portfolio Highlight
  - 추천 프로젝트 3개 표시
  - projects.json 데이터 로드
  - "전체 보기" 링크 (/portfolio)
- [ ] Section: Open Bounty
  - 활성 바운티 3개 표시
  - bounties.json 데이터 로드
  - "모두 보기" 링크 (/lab)
- [ ] Newsletter CTA 추가 (비활성화, Sprint 2에서 활성화)

**완료 기준**:
- [ ] Home 페이지 렌더링
- [ ] 4개 새 섹션 표시
- [ ] 모든 링크 동작
- [ ] 반응형 레이아웃
- [ ] 린트 에러 0개

**관련 파일**:
- `src/pages/Index.tsx`
- `src/components/home/NowHighlight.tsx`
- `src/components/home/RoadmapProgress.tsx`
- `src/components/home/PortfolioHighlight.tsx`
- `src/components/home/OpenBounty.tsx`

**의존성**: Task-S1-003, Task-S1-006

---

### Task-S1-011: SEO/OG 메타태그 추가 ⏱️ 2시간

**목표**: 모든 페이지에 SEO 및 OG 메타태그 추가

**구현 내용**:
- [ ] react-helmet-async 설치 (이미 설치됨)
- [ ] Helmet 컴포넌트로 메타태그 추가
  - Home: title, description, og:image
  - About: title, description
  - Roadmap: title, description
  - Portfolio: title, description
  - Portfolio Detail: 동적 title, description, og:image
  - Now: title, description
  - Lab: title, description
  - Community: title, description
  - Work with Us: title, description
  - Status: title, description
- [ ] Open Graph 이미지 생성 (1200x630px)
- [ ] Twitter Card 메타태그 추가
- [ ] JSON-LD 구조화 데이터 (Home, About)

**완료 기준**:
- [ ] 모든 페이지 메타태그 추가
- [ ] OG 이미지 생성 및 업로드
- [ ] Open Graph Debugger 검증
- [ ] Google 구조화 데이터 테스트 통과

**관련 파일**:
- `src/pages/*.tsx` (모든 페이지)
- `public/og-image.png` (OG 이미지)

**의존성**: Task-S1-001 ~ Task-S1-010

---

### Task-S1-012: Lighthouse 성능 검증 ⏱️ 1시간

**목표**: Lighthouse 점수 90+ 달성

**구현 내용**:
- [ ] Lighthouse CI 실행
- [ ] 성능 지표 확인
  - Performance: 90+
  - Accessibility: 95+
  - SEO: 90+
  - Best Practices: 90+
- [ ] 개선 필요 항목 수정
  - 이미지 최적화
  - Lazy Loading
  - 코드 스플리팅
- [ ] Core Web Vitals 확인
  - FCP: 1.5초 이하
  - TTI: 3.0초 이하
  - CLS: 0.1 이하

**완료 기준**:
- [ ] Lighthouse Performance 90+
- [ ] Lighthouse Accessibility 95+
- [ ] Lighthouse SEO 90+
- [ ] Core Web Vitals 목표 달성

**관련 파일**:
- `lighthouse.config.js`
- `.github/workflows/lighthouse.yml`

**의존성**: Task-S1-001 ~ Task-S1-011

---

## 📊 Sprint 완료 기준

- [ ] 8개 새 페이지 접근 가능
- [ ] 정적 데이터 3개 생성 (projects, roadmap, logs, bounties)
- [ ] SEO/OG 메타태그 모든 페이지 적용
- [ ] Lighthouse 점수 90+ 달성
- [ ] 빌드 성공 (0 에러)
- [ ] 린트 에러 0개
- [ ] E2E 테스트 통과 (주요 페이지 렌더링)

---

## 📈 진행률 추적

- [ ] Task-S1-001: 라우팅 구조 확장
- [ ] Task-S1-002: About 페이지 구현
- [ ] Task-S1-003: 정적 데이터 생성 (projects.json)
- [ ] Task-S1-004: Portfolio 페이지 구현 (정적)
- [ ] Task-S1-005: Portfolio 상세 페이지 구현 (정적)
- [ ] Task-S1-006: 정적 데이터 생성 (roadmap, logs, bounties)
- [ ] Task-S1-007: Roadmap 페이지 구현 (정적)
- [ ] Task-S1-008: Now 페이지 구현 (정적)
- [ ] Task-S1-009: Lab 페이지 구현 (정적)
- [ ] Task-S1-010: Home 페이지 강화
- [ ] Task-S1-011: SEO/OG 메타태그 추가
- [ ] Task-S1-012: Lighthouse 성능 검증

**총 예상 시간**: 28시간 (1주 내 완료 가능)
**완료율**: 0/12 (0%)

---

**Last Updated**: 2025-11-13
**Sprint Start**: TBD
**Sprint End**: TBD
**Status**: 📋 Planned
