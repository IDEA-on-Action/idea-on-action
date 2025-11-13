# Version 2.0 요구사항 명세서

> **From:** 소개용 정적 웹사이트
> **To:** 실시간 커뮤니티형 프로덕트 스튜디오

**작성일**: 2025-11-13
**버전**: 2.0.0
**상태**: 📋 Draft
**담당자**: IDEA on Action Team

---

## 📖 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [사용자 스토리](#사용자-스토리)
3. [기능 요구사항](#기능-요구사항)
4. [사용자 여정](#사용자-여정)
5. [성공 지표](#성공-지표)

---

## 🎯 프로젝트 개요

### Vision
IDEA on Action은 "생각을 멈추지 않고, 행동으로 옮기는 회사"로, 아이디어 실험실이자 커뮤니티형 프로덕트 스튜디오를 구축합니다.

### 핵심 루프
```
아이디어 → 실험 → 결과공유 → 참여 → 다음 아이디어
```

### 목표
| 구분 | 목표 | KPI (지표) |
|------|------|------------|
| **콘텐츠화** | About / Roadmap / Portfolio / Now / Lab 페이지 완성 | 페이지 정상동작, 3건 이상의 데이터 |
| **데이터 기반화** | 정적 JSON → Supabase Schema로 전환 | CRUD API 연결 및 Admin UI |
| **커뮤니티 구축** | Giscus 기반 피드백/토론 활성화 | 댓글/참여율 15% 이상 |
| **참여 유도** | Work with Us 폼 + Bounty 시스템 | 제안/참여 5건 이상 |
| **오픈 메트릭스** | 활동지표 투명 공개 | Status 페이지 1개 운영 |
| **자동화 운영** | 주간 리캡 자동 요약 및 발행 | Weekly Recap 자동 생성 성공 |

---

## 👤 사용자 스토리

### 1. 방문자 (Visitor)

#### US-001: 회사 정보 확인
**As a** 방문자
**I want to** About 페이지에서 회사의 미션, 비전, 가치를 확인할 수 있기를
**So that** IDEA on Action이 어떤 회사인지 이해할 수 있다

**수용 기준**:
- [ ] About 페이지 접근 가능 (/about)
- [ ] Mission, Vision, Values 섹션 표시
- [ ] 회사 연혁 타임라인
- [ ] 팀 소개 (옵션)

#### US-002: 로드맵 확인
**As a** 방문자
**I want to** Roadmap 페이지에서 분기별 목표와 진행률을 볼 수 있기를
**So that** 회사의 계획과 진행 상황을 이해할 수 있다

**수용 기준**:
- [ ] Roadmap 페이지 접근 가능 (/roadmap)
- [ ] 분기별 탭 (Q1, Q2, Q3, Q4)
- [ ] 목표별 진행률 표시 (0-100%)
- [ ] 위험도 표시 (낮음/중간/높음)
- [ ] 담당자 표시
- [ ] 관련 프로젝트 링크

#### US-003: 프로젝트 포트폴리오 탐색
**As a** 방문자
**I want to** Portfolio 페이지에서 프로젝트 목록과 상세 정보를 볼 수 있기를
**So that** 회사가 진행한 프로젝트를 탐색할 수 있다

**수용 기준**:
- [ ] Portfolio 페이지 접근 가능 (/portfolio)
- [ ] 프로젝트 카드 목록 표시
- [ ] 상태별 필터 (backlog/in-progress/validate/launched)
- [ ] 태그별 필터
- [ ] 프로젝트 상세 페이지 (/portfolio/:slug)
- [ ] 메트릭 시각화 (사용자 수, 매출 등)
- [ ] 관련 링크 (GitHub, 데모 등)

#### US-004: 최근 활동 확인
**As a** 방문자
**I want to** Now 페이지에서 최근 활동 로그를 볼 수 있기를
**So that** 회사의 실시간 활동을 파악할 수 있다

**수용 기준**:
- [ ] Now 페이지 접근 가능 (/now)
- [ ] 최근 로그 목록 (최근 30일)
- [ ] 로그 타입별 필터 (decision/learning/release)
- [ ] 프로젝트별 필터
- [ ] 주간 리캡 자동 생성 표시

#### US-005: 실험 및 바운티 확인
**As a** 방문자
**I want to** Lab 페이지에서 실험 프로젝트와 바운티를 볼 수 있기를
**So that** 참여 가능한 기회를 찾을 수 있다

**수용 기준**:
- [ ] Lab 페이지 접근 가능 (/lab)
- [ ] 실험 프로젝트 카드 목록
- [ ] 바운티 카드 목록
- [ ] 바운티 상태 (open/assigned/done)
- [ ] 바운티 보상 표시
- [ ] 바운티 마감일 표시
- [ ] 신청 버튼

---

### 2. 커뮤니티 참여자 (Community Member)

#### US-006: 토론 참여
**As a** 커뮤니티 참여자
**I want to** Community 페이지에서 토론에 참여할 수 있기를
**So that** 아이디어와 피드백을 공유할 수 있다

**수용 기준**:
- [ ] Community 페이지 접근 가능 (/community)
- [ ] Giscus 댓글 임베드
- [ ] GitHub 계정으로 로그인
- [ ] 댓글 작성/수정/삭제
- [ ] 반응(Reaction) 추가
- [ ] 토론 카테고리별 분류

#### US-007: 블로그 읽기
**As a** 커뮤니티 참여자
**I want to** Blog 페이지에서 글을 읽을 수 있기를
**So that** 회사의 인사이트와 경험을 배울 수 있다

**수용 기준**:
- [ ] Blog 페이지 접근 가능 (/blog)
- [ ] 블로그 포스트 목록
- [ ] 카테고리별 필터
- [ ] 태그별 필터
- [ ] 포스트 상세 페이지 (/blog/:slug)
- [ ] Markdown 렌더링
- [ ] Giscus 댓글 임베드
- [ ] 공유 버튼 (Twitter, LinkedIn)

#### US-008: 뉴스레터 구독
**As a** 커뮤니티 참여자
**I want to** 뉴스레터를 구독할 수 있기를
**So that** 정기적으로 업데이트를 받을 수 있다

**수용 기준**:
- [ ] Footer에 뉴스레터 구독 폼
- [ ] Home 페이지에 뉴스레터 CTA
- [ ] 이메일 검증
- [ ] 구독 확인 이메일
- [ ] 구독 취소 링크

---

### 3. 협업 제안자 (Collaborator)

#### US-009: 협업 제안
**As a** 협업 제안자
**I want to** Work with Us 페이지에서 협업을 제안할 수 있기를
**So that** 프로젝트 협업 또는 의뢰를 할 수 있다

**수용 기준**:
- [ ] Work with Us 페이지 접근 가능 (/work-with-us)
- [ ] 협업 패키지 소개 (컨설팅, 개발, 디자인)
- [ ] Brief 제출 폼
  - [ ] 이름, 이메일, 회사명
  - [ ] 프로젝트 유형 (컨설팅/개발/디자인)
  - [ ] 예산 범위
  - [ ] 프로젝트 설명
  - [ ] 첨부 파일 (옵션)
- [ ] 제출 성공 알림
- [ ] Webhook 알림 (Slack/Discord)

#### US-010: 바운티 신청
**As a** 협업 제안자
**I want to** Lab 페이지에서 바운티를 신청할 수 있기를
**So that** 오픈 바운티에 참여할 수 있다

**수용 기준**:
- [ ] 바운티 카드에서 "신청하기" 버튼
- [ ] 신청 폼 (이름, 이메일, 포트폴리오 링크)
- [ ] 신청 성공 알림
- [ ] 신청자 목록 관리자만 확인 가능

---

### 4. 관리자 (Admin)

#### US-011: 프로젝트 관리
**As a** 관리자
**I want to** Admin 페이지에서 프로젝트를 생성/수정/삭제할 수 있기를
**So that** 포트폴리오를 관리할 수 있다

**수용 기준**:
- [ ] Admin Projects 페이지 (/admin/projects)
- [ ] 프로젝트 목록 테이블
- [ ] 프로젝트 생성 폼
- [ ] 프로젝트 수정 폼
- [ ] 프로젝트 삭제 (확인 대화상자)
- [ ] 이미지 업로드

#### US-012: 로드맵 관리
**As a** 관리자
**I want to** Admin 페이지에서 로드맵을 생성/수정/삭제할 수 있기를
**So that** 분기별 목표를 관리할 수 있다

**수용 기준**:
- [ ] Admin Roadmap 페이지 (/admin/roadmap)
- [ ] 로드맵 목록 테이블
- [ ] 로드맵 생성 폼 (분기, 목표, 진행률, 위험도, 담당자)
- [ ] 로드맵 수정 폼
- [ ] 로드맵 삭제

#### US-013: 활동 로그 관리
**As a** 관리자
**I want to** Admin 페이지에서 활동 로그를 생성/수정/삭제할 수 있기를
**So that** Now 페이지 콘텐츠를 관리할 수 있다

**수용 기준**:
- [ ] Admin Logs 페이지 (/admin/logs)
- [ ] 로그 목록 테이블
- [ ] 로그 생성 폼 (타입, 내용, 프로젝트 연결)
- [ ] 로그 수정 폼
- [ ] 로그 삭제

#### US-014: 바운티 관리
**As a** 관리자
**I want to** Admin 페이지에서 바운티를 생성/수정/삭제할 수 있기를
**So that** Lab 페이지 바운티를 관리할 수 있다

**수용 기준**:
- [ ] Admin Bounties 페이지 (/admin/bounties)
- [ ] 바운티 목록 테이블
- [ ] 바운티 생성 폼 (제목, 스킬, 보상, 마감일)
- [ ] 바운티 수정 폼
- [ ] 바운티 삭제
- [ ] 신청자 목록 확인

#### US-015: 블로그 포스트 관리
**As a** 관리자
**I want to** Admin 페이지에서 블로그 포스트를 생성/수정/삭제할 수 있기를
**So that** 블로그 콘텐츠를 관리할 수 있다

**수용 기준**:
- [ ] Admin Blog 페이지 (/admin/blog)
- [ ] 포스트 목록 테이블
- [ ] Markdown 에디터
- [ ] 포스트 생성 폼 (slug, 제목, 본문, 태그, 시리즈)
- [ ] 포스트 수정 폼
- [ ] 포스트 삭제
- [ ] 미리보기 기능

---

## 🛠️ 기능 요구사항

### 1. 페이지 구조

```
/
├── Home (Now, Roadmap, Portfolio, Bounty)
├── About (우리는 어떤 회사인가)
├── Roadmap (Quarterly 목표 + 진행률)
├── Portfolio (Case Study 목록)
│   └── [slug] (상세 페이지)
├── Now (최근 활동 / 로그)
├── Lab (실험 / Bounty / Prototype)
├── Community (Giscus 기반 토론)
├── Blog (Notes / Weekly Recap)
│   └── [slug] (상세 페이지)
├── Work-with-Us (의뢰 / 협업)
└── Status (Open Metrics)
```

### 2. 데이터 모델

#### Projects 테이블
```typescript
interface Project {
  id: string // UUID
  title: string
  summary: string
  status: 'backlog' | 'in-progress' | 'validate' | 'launched'
  tags: string[]
  metrics: {
    users?: number
    revenue?: number
    satisfaction?: number
  }
  links: {
    github?: string
    demo?: string
    documentation?: string
  }
  created_at: string // ISO 8601
}
```

#### Roadmap 테이블
```typescript
interface Roadmap {
  id: number
  quarter: string // 'Q1 2025'
  goal: string
  progress: number // 0-100
  risk: 'low' | 'medium' | 'high'
  owner: string
  related_projects: string[] // project IDs
}
```

#### Logs 테이블
```typescript
interface Log {
  id: number
  type: 'decision' | 'learning' | 'release'
  content: string
  project_id?: string // optional
  created_at: string // ISO 8601
}
```

#### Bounties 테이블
```typescript
interface Bounty {
  id: number
  title: string
  skill: string
  reward: number // KRW
  deadline: string // ISO 8601 date
  status: 'open' | 'assigned' | 'done'
  applicants: string[] // user IDs
}
```

#### Posts 테이블
```typescript
interface Post {
  id: number
  slug: string // unique
  title: string
  body: string // Markdown
  tags: string[]
  series?: string
  published_at: string // ISO 8601
}
```

#### Comments 테이블 (Giscus 통합)
- GitHub Discussions 기반
- 별도 테이블 불필요

### 3. 커뮤니티 기능

#### Giscus 통합
- **설치**: GitHub App 설치
- **설정**:
  - Repository: IDEA-on-Action/idea-on-action
  - Mapping: pathname
  - Theme: preferred_color_scheme
- **페이지**: Community, Blog 포스트 상세

#### Newsletter 통합
- **서비스**: Resend 또는 Beehiiv
- **위젯 위치**: Footer, Home CTA
- **기능**:
  - 이메일 구독
  - 구독 확인 이메일
  - 구독 취소 링크
  - Weekly Recap 자동 발송

### 4. 협업 폼

#### Work with Us 폼
- **필드**:
  - 이름 (required)
  - 이메일 (required, email validation)
  - 회사명 (optional)
  - 프로젝트 유형 (required, select)
  - 예산 범위 (required, select)
  - 프로젝트 설명 (required, textarea)
  - 첨부 파일 (optional, max 10MB)
- **제출 후**:
  - 성공 메시지 표시
  - Webhook 알림 (Slack/Discord)
  - 확인 이메일 발송

### 5. 자동화

#### Weekly Recap 자동 생성
- **트리거**: Supabase Cron Job (매주 일요일 23:59)
- **로직**:
  1. logs 테이블에서 최근 7일 데이터 조회
  2. 타입별로 그룹화 (decision/learning/release)
  3. Markdown 형식으로 요약 생성
  4. posts 테이블에 저장 (series: 'Weekly Recap')
  5. Newsletter 발송

#### Open Metrics 집계
- **API**: `/api/metrics`
- **데이터**:
  - 프로젝트 수 (projects 테이블 count)
  - 활성 바운티 수 (bounties 테이블 status='open' count)
  - 커뮤니티 참여자 수 (Giscus API)
  - 커밋 수 (GitHub API)
  - Newsletter 구독자 수
- **캐싱**: Redis (5분 TTL)

---

## 🚶 사용자 여정

### Journey 1: 처음 방문 → 커뮤니티 참여

1. **진입**: Google 검색 → Home 페이지
2. **탐색**: About → Roadmap → Portfolio 탐색
3. **관심**: Lab 페이지에서 바운티 발견
4. **참여**: Community 페이지에서 질문
5. **구독**: Newsletter 구독

### Journey 2: 협업 제안 → 프로젝트 시작

1. **진입**: 지인 추천 → Portfolio 페이지
2. **확인**: 프로젝트 상세 페이지에서 퀄리티 확인
3. **제안**: Work with Us 페이지에서 Brief 제출
4. **응답**: 확인 이메일 수신
5. **협의**: Slack/이메일로 세부 논의

### Journey 3: 정기 방문 → 팬 되기

1. **진입**: Newsletter 이메일 → Blog 포스트
2. **학습**: Weekly Recap 읽기
3. **참여**: Blog 포스트에 댓글
4. **공유**: Twitter에 공유
5. **추천**: 지인에게 추천

---

## 📊 성공 지표

### Quantitative Metrics

| 지표 | 목표 | 측정 방법 |
|------|------|-----------|
| **페이지뷰** | 1,000/월 | Google Analytics |
| **순방문자** | 500/월 | Google Analytics |
| **평균 세션 시간** | 2분 이상 | Google Analytics |
| **바운스율** | 60% 이하 | Google Analytics |
| **Newsletter 구독자** | 100명 | Supabase DB |
| **커뮤니티 댓글** | 50개/월 | Giscus API |
| **협업 제안** | 5건/월 | Supabase DB |
| **바운티 신청** | 10건/월 | Supabase DB |

### Qualitative Metrics

| 지표 | 목표 | 측정 방법 |
|------|------|-----------|
| **사용자 만족도** | 4.0/5.0 이상 | 설문 조사 |
| **NPS (Net Promoter Score)** | 30 이상 | 설문 조사 |
| **피드백 긍정률** | 80% 이상 | 댓글 감정 분석 |

### Technical Metrics

| 지표 | 목표 | 측정 방법 |
|------|------|-----------|
| **Lighthouse Performance** | 90+ | Lighthouse CI |
| **Lighthouse Accessibility** | 95+ | Lighthouse CI |
| **Lighthouse SEO** | 90+ | Lighthouse CI |
| **First Contentful Paint** | 1.5초 이하 | Core Web Vitals |
| **Time to Interactive** | 3.0초 이하 | Core Web Vitals |
| **Cumulative Layout Shift** | 0.1 이하 | Core Web Vitals |

---

## 📝 비고

### Phase 1-14 완료 기능 활용
- **인증 시스템**: 이미 구축된 OAuth 및 관리자 시스템 활용
- **테스트 인프라**: Playwright, Vitest 활용
- **디자인 시스템**: 기존 Tailwind CSS, shadcn/ui 활용
- **CMS**: 기존 블로그 시스템 확장

### 기술 제약사항
- **프레임워크**: Vite + React 18 (변경 불가)
- **백엔드**: Supabase (변경 불가)
- **배포**: Vercel (변경 불가)
- **브라우저**: Chrome 100+, Firefox 100+, Safari 15+ 지원

### 일정
- **Sprint 1**: Structure & Static Data (1주)
- **Sprint 2**: Supabase Integration & Community (1주)
- **Sprint 3**: Automation & Open Metrics (1주)
- **Total**: 3주

---

**Last Updated**: 2025-11-13
**Version**: 2.0.0
**Status**: 📋 Draft
**Next Review**: 2025-11-20
