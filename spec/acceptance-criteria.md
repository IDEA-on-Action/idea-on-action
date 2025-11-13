# Version 2.0 검수 기준 (Acceptance Criteria)

> 각 기능의 성공 기준과 검증 방법

**작성일**: 2025-11-13
**버전**: 2.0.0
**상태**: 📋 Draft

---

## 🎯 전체 프로젝트 검수 기준

### 1. 페이지 접근성
- [ ] 모든 페이지 (/about, /roadmap, /portfolio, etc.) 200 OK 응답
- [ ] 404 페이지 동작 (존재하지 않는 URL)
- [ ] 모바일/태블릿/데스크톱 반응형 레이아웃

### 2. 데이터 표시
- [ ] 프로젝트 3개 이상 포트폴리오 표시
- [ ] 로드맵 5개 이상 목표 표시
- [ ] 활동 로그 10개 이상 표시
- [ ] 바운티 2개 이상 표시

### 3. 커뮤니티 기능
- [ ] Giscus 댓글 로드 (Community, Blog)
- [ ] Newsletter 구독 폼 동작
- [ ] Work with Us 폼 제출 성공

### 4. 성능 기준
- [ ] Lighthouse Performance 90+
- [ ] Lighthouse Accessibility 95+
- [ ] Lighthouse SEO 90+
- [ ] FCP 1.5초 이하
- [ ] TTI 3.0초 이하
- [ ] CLS 0.1 이하

---

## 📄 페이지별 검수 기준

### Home 페이지 (/)

#### 필수 요소
- [ ] Hero 섹션 (슬로건, CTA 버튼)
- [ ] Now Highlight (최근 로그 3개)
- [ ] Roadmap Progress (현재 분기)
- [ ] Portfolio Highlight (추천 프로젝트 3개)
- [ ] Open Bounty (활성 바운티 3개)
- [ ] Newsletter CTA

#### 동작 검증
- [ ] CTA 버튼 클릭 → 해당 페이지로 이동
- [ ] "더보기" 링크 동작 (/now, /roadmap, /portfolio, /lab)
- [ ] Newsletter 구독 폼 제출 성공

---

### About 페이지 (/about)

#### 필수 요소
- [ ] Mission Statement (Hero)
- [ ] Vision 섹션
- [ ] Values 섹션 (3-5개 핵심 가치)
- [ ] Team 섹션 (옵션)

#### 동작 검증
- [ ] 페이지 렌더링 (2초 이내)
- [ ] 다크 모드 토글 동작
- [ ] 스크롤 애니메이션 (옵션)

---

### Roadmap 페이지 (/roadmap)

#### 필수 요소
- [ ] 분기별 탭 (Q1, Q2, Q3, Q4)
- [ ] 로드맵 카드 (목표, 진행률, 위험도, 담당자)
- [ ] ProgressRing 애니메이션
- [ ] 관련 프로젝트 링크

#### 동작 검증
- [ ] 탭 전환 동작 (Q1→Q2→Q3→Q4)
- [ ] 진행률 표시 (0-100%)
- [ ] 위험도 배지 (낮음/중간/높음)
- [ ] 관련 프로젝트 클릭 → Portfolio 상세 이동

---

### Portfolio 페이지 (/portfolio)

#### 필수 요소
- [ ] 프로젝트 카드 목록 (3개 이상)
- [ ] 상태별 필터 (전체/backlog/in-progress/validate/launched)
- [ ] 태그별 필터
- [ ] StatusBadge, TagList, MetricsDisplay

#### 동작 검증
- [ ] 필터 선택 → 프로젝트 목록 업데이트
- [ ] 프로젝트 카드 클릭 → 상세 페이지 이동
- [ ] 빈 상태 처리 (필터 결과 0개)

---

### Portfolio 상세 페이지 (/portfolio/:slug)

#### 필수 요소
- [ ] ProjectHero (제목, 상태, 태그)
- [ ] Overview 섹션 (요약, 주요 기능)
- [ ] Metrics 섹션 (사용자, 매출, 만족도)
- [ ] Links 섹션 (GitHub, 데모, 문서)
- [ ] Related Projects (옵션)

#### 동작 검증
- [ ] URL slug로 프로젝트 조회
- [ ] 존재하지 않는 slug → 404 페이지
- [ ] 외부 링크 클릭 → 새 탭 열기

---

### Now 페이지 (/now)

#### 필수 요소
- [ ] 로그 카드 목록 (10개 이상)
- [ ] 타입별 필터 (전체/decision/learning/release)
- [ ] TypeBadge (decision/learning/release)
- [ ] Timestamp (상대 시간)

#### 동작 검증
- [ ] 시간 역순 정렬
- [ ] 필터 선택 → 로그 목록 업데이트
- [ ] 프로젝트 링크 클릭 → Portfolio 상세 이동

---

### Lab 페이지 (/lab)

#### 필수 요소
- [ ] 실험 프로젝트 카드 (옵션)
- [ ] 바운티 카드 목록 (2개 이상)
- [ ] RewardDisplay (금액)
- [ ] DeadlineDisplay (마감일)
- [ ] StatusBadge (open/assigned/done)
- [ ] ApplyButton

#### 동작 검증
- [ ] 바운티 카드 표시
- [ ] Apply 버튼 클릭 → 신청 폼 (Sprint 2)
- [ ] 마감된 바운티 → 비활성화 버튼

---

### Community 페이지 (/community)

#### 필수 요소
- [ ] Giscus 댓글 임베드
- [ ] GitHub 로그인 버튼
- [ ] 토론 카테고리

#### 동작 검증
- [ ] Giscus 댓글 로드 (5초 이내)
- [ ] 댓글 작성 가능 (GitHub 계정)
- [ ] 반응(Reaction) 추가 가능

---

### Blog 페이지 (/blog)

#### 필수 요소
- [ ] 블로그 포스트 목록
- [ ] 카테고리별 필터
- [ ] 태그별 필터
- [ ] 포스트 카드 (제목, 요약, 날짜)

#### 동작 검증
- [ ] 포스트 카드 클릭 → 상세 페이지 이동
- [ ] 필터 선택 → 포스트 목록 업데이트
- [ ] 빈 상태 처리

---

### Blog 포스트 상세 페이지 (/blog/:slug)

#### 필수 요소
- [ ] PostHero (제목, 날짜, 태그)
- [ ] Markdown 렌더링 (본문)
- [ ] Giscus 댓글 임베드
- [ ] 공유 버튼 (Twitter, LinkedIn)

#### 동작 검증
- [ ] Markdown 정상 렌더링 (코드 블록, 이미지)
- [ ] Giscus 댓글 로드
- [ ] 공유 버튼 클릭 → 새 탭 열기

---

### Work with Us 페이지 (/work-with-us)

#### 필수 요소
- [ ] 협업 패키지 소개 (컨설팅, 개발, 디자인)
- [ ] Brief 제출 폼
  - [ ] 이름, 이메일, 회사명 (required)
  - [ ] 프로젝트 유형 (select)
  - [ ] 예산 범위 (select)
  - [ ] 프로젝트 설명 (textarea)
  - [ ] 첨부 파일 (optional, max 10MB)
- [ ] 제출 버튼

#### 동작 검증
- [ ] 폼 검증 (required 필드)
- [ ] 이메일 형식 검증
- [ ] 파일 크기 제한 (10MB)
- [ ] 제출 성공 → Success Toast
- [ ] Webhook 알림 발송 (Slack/Discord)
- [ ] 확인 이메일 발송

---

### Status 페이지 (/status)

#### 필수 요소
- [ ] MetricCard (프로젝트, 바운티, 커밋, 구독자)
- [ ] ChartBlock (활동 추세)
- [ ] 실시간 데이터 표시

#### 동작 검증
- [ ] Metrics API 호출 성공
- [ ] 5분 캐싱 동작 (Redis)
- [ ] 자동 새로고침 (옵션)

---

## 🔐 관리자 기능 검수 기준

### Admin Projects (/admin/projects)

#### 필수 요소
- [ ] 프로젝트 목록 테이블
- [ ] 생성 버튼 → 폼 페이지
- [ ] 수정 버튼 → 폼 페이지 (데이터 로드)
- [ ] 삭제 버튼 → 확인 대화상자

#### 동작 검증
- [ ] 관리자만 접근 가능 (비관리자 → 403)
- [ ] 프로젝트 생성 성공
- [ ] 프로젝트 수정 성공
- [ ] 프로젝트 삭제 성공 (이미지 연쇄 삭제)

---

### Admin Roadmap (/admin/roadmap)

#### 필수 요소
- [ ] 로드맵 목록 테이블
- [ ] 생성/수정/삭제 버튼

#### 동작 검증
- [ ] 로드맵 CRUD 동작
- [ ] 진행률 0-100 범위 검증
- [ ] 위험도 선택 (low/medium/high)

---

### Admin Logs (/admin/logs)

#### 필수 요소
- [ ] 로그 목록 테이블
- [ ] 생성/수정/삭제 버튼

#### 동작 검증
- [ ] 로그 CRUD 동작
- [ ] 타입 선택 (decision/learning/release)
- [ ] 프로젝트 연결 (옵션)

---

### Admin Bounties (/admin/bounties)

#### 필수 요소
- [ ] 바운티 목록 테이블
- [ ] 생성/수정/삭제 버튼
- [ ] 신청자 목록 확인

#### 동작 검증
- [ ] 바운티 CRUD 동작
- [ ] 보상 금액 숫자 검증
- [ ] 마감일 날짜 검증
- [ ] 신청자 목록 표시

---

### Admin Blog (/admin/blog)

#### 필수 요소
- [ ] 포스트 목록 테이블
- [ ] Markdown 에디터
- [ ] 생성/수정/삭제 버튼
- [ ] 미리보기 기능

#### 동작 검증
- [ ] 포스트 CRUD 동작
- [ ] Markdown 에디터 동작
- [ ] 미리보기 렌더링
- [ ] slug 중복 검증

---

## 🧪 자동화 검수 기준

### Weekly Recap 자동 생성

#### 필수 요소
- [ ] Supabase Edge Function (generate-weekly-recap)
- [ ] Cron Job (매주 일요일 23:59)
- [ ] Markdown 요약 생성
- [ ] posts 테이블 저장
- [ ] Newsletter 발송

#### 동작 검증
- [ ] 최근 7일 로그 조회 성공
- [ ] 타입별 그룹화 (decision/learning/release)
- [ ] Markdown 형식 올바름
- [ ] posts 테이블 INSERT 성공
- [ ] Newsletter 이메일 발송 성공

---

### Open Metrics 집계

#### 필수 요소
- [ ] aggregate-metrics Edge Function
- [ ] Redis 캐싱 (5분 TTL)
- [ ] API 엔드포인트 (/api/metrics)

#### 동작 검증
- [ ] 프로젝트 수 집계 성공
- [ ] 바운티 수 집계 성공
- [ ] GitHub API 호출 성공 (커밋, 기여자)
- [ ] Newsletter 구독자 수 조회 성공
- [ ] 5분 캐싱 동작 확인

---

## 📊 테스트 검수 기준

### 단위 테스트 (Vitest)

- [ ] 35개 이상 테스트 통과
- [ ] 훅 테스트 (useProjects, useRoadmap, useLogs, useBounties, usePosts)
- [ ] 컴포넌트 테스트 (ProjectCard, RoadmapCard, LogCard, BountyCard)
- [ ] 코드 커버리지 80% 이상

### E2E 테스트 (Playwright)

- [ ] 20개 이상 테스트 통과
- [ ] 사용자 여정 테스트 (3개)
- [ ] CRUD 테스트 (5개)
- [ ] 폼 제출 테스트 (2개)

### 시각적 회귀 테스트

- [ ] 다크 모드 전환 (8개 페이지)
- [ ] 반응형 레이아웃 (모바일/태블릿/데스크톱)

---

## 🚀 배포 검수 기준

### 배포 전 체크리스트

- [ ] 환경 변수 설정 (Vercel Secrets)
- [ ] GitHub Actions 워크플로우 통과
- [ ] Lighthouse CI 통과 (Performance 90+)
- [ ] E2E 테스트 통과
- [ ] 프로덕션 빌드 성공 (0 에러)

### 배포 후 검증

- [ ] 프로덕션 URL 접근 가능 (https://www.ideaonaction.ai/)
- [ ] 모든 페이지 200 OK 응답
- [ ] Newsletter 구독 동작
- [ ] Giscus 댓글 로드
- [ ] Work with Us 폼 제출 동작
- [ ] GA4 이벤트 트래킹 동작

---

## 📈 성공 지표 검수 기준

### Quantitative Metrics (1개월 후)

- [ ] 페이지뷰 1,000/월 달성
- [ ] 순방문자 500/월 달성
- [ ] 평균 세션 시간 2분 이상
- [ ] 바운스율 60% 이하
- [ ] Newsletter 구독자 100명 달성
- [ ] 커뮤니티 댓글 50개/월 달성
- [ ] 협업 제안 5건/월 달성
- [ ] 바운티 신청 10건/월 달성

### Technical Metrics (지속)

- [ ] Lighthouse Performance 90+ 유지
- [ ] Lighthouse Accessibility 95+ 유지
- [ ] Lighthouse SEO 90+ 유지
- [ ] FCP 1.5초 이하 유지
- [ ] TTI 3.0초 이하 유지
- [ ] CLS 0.1 이하 유지

---

**Last Updated**: 2025-11-13
**Version**: 2.0.0
**Status**: 📋 Draft
**Next Review**: Sprint 완료 시
