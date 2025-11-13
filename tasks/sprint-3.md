# Sprint 3: Automation & Open Metrics

> 자동화 및 메트릭스 공개

**기간**: Week 3
**목표**: 주간 리캡 자동 생성, Status 페이지 구축, 테스트 및 배포
**상태**: 📋 Planned

---

## 🎯 Sprint 목표

- [ ] Weekly Recap 자동 생성 (Supabase Cron Job)
- [ ] Status 페이지 구축 (Open Metrics)
- [ ] 이벤트 트래킹 삽입 (GA4)
- [ ] Vitest 단위 테스트 작성
- [ ] Playwright E2E 테스트 작성
- [ ] SEO 최적화 (sitemap.xml, robots.txt)
- [ ] 최종 배포 및 검증

---

## 📋 주요 작업

### 1. Weekly Recap 자동 생성 (6시간)
- Supabase Edge Function 생성 (generate-weekly-recap)
- Cron Job 설정 (매주 일요일 23:59)
- logs 테이블 조회 (최근 7일)
- Markdown 요약 생성
- posts 테이블 저장 (series='Weekly Recap')
- Newsletter 발송

### 2. Status 페이지 구축 (8시간)
- aggregate-metrics Edge Function 생성
- Status 페이지 구현 (/status)
- MetricCard 컴포넌트
  - 프로젝트 수 (projects 테이블)
  - 활성 바운티 수 (bounties 테이블)
  - 커밋 수 (GitHub API)
  - 기여자 수 (GitHub API)
  - Newsletter 구독자 수
- ChartBlock 컴포넌트 (활동 추세)
- Redis 캐싱 (5분 TTL)

### 3. 이벤트 트래킹 (4시간)
- GA4 이벤트 정의
  - view_home, view_portfolio, view_roadmap
  - cta_click, subscribe_newsletter
  - join_community, apply_bounty
- trackEvent 함수 생성
- 주요 페이지 및 버튼에 이벤트 삽입

### 4. 단위 테스트 (6시간)
- 훅 테스트
  - useProjects.test.tsx (7개)
  - useRoadmap.test.tsx (7개)
  - useLogs.test.tsx (7개)
  - useBounties.test.tsx (7개)
  - usePosts.test.tsx (7개)
- 컴포넌트 테스트
  - ProjectCard.test.tsx
  - RoadmapCard.test.tsx
  - LogCard.test.tsx
  - BountyCard.test.tsx

### 5. E2E 테스트 (8시간)
- 사용자 여정 테스트
  - journey-1-visitor.spec.ts (처음 방문 → 커뮤니티 참여)
  - journey-2-collaborator.spec.ts (협업 제안 → 프로젝트 시작)
  - journey-3-fan.spec.ts (정기 방문 → 팬 되기)
- CRUD 테스트
  - admin-projects.spec.ts
  - admin-roadmap.spec.ts
  - admin-logs.spec.ts
  - admin-bounties.spec.ts
  - admin-blog.spec.ts
- 폼 제출 테스트
  - newsletter.spec.ts
  - work-with-us.spec.ts

### 6. SEO 최적화 (4시간)
- sitemap.xml 동적 생성
  - 정적 페이지 (12개)
  - 동적 페이지 (포트폴리오, 블로그)
  - 주간 리캡 포스트
- robots.txt 업데이트
  - Allow: /
  - Disallow: /admin
- 구조화 데이터 (JSON-LD)
  - Organization (Home)
  - Person (About)
  - Article (Blog)

### 7. 최종 배포 및 검증 (4시간)
- 환경 변수 설정 (Vercel)
- GitHub Actions 워크플로우 검증
- Lighthouse CI 실행
- 프로덕션 배포
- 수동 테스트 (주요 사용자 여정)
- 롤백 계획 수립

---

## 📊 Sprint 완료 기준

- [ ] Weekly Recap 자동 생성 동작
- [ ] Status 페이지 메트릭스 표시
- [ ] GA4 이벤트 트래킹 동작
- [ ] 단위 테스트 35개 통과
- [ ] E2E 테스트 20개 통과
- [ ] sitemap.xml, robots.txt 생성
- [ ] Lighthouse 점수 90+
- [ ] 프로덕션 배포 성공

---

## 📈 성공 지표 달성

### Quantitative Metrics
- [ ] 페이지뷰: 1,000/월
- [ ] 순방문자: 500/월
- [ ] 평균 세션 시간: 2분 이상
- [ ] 바운스율: 60% 이하
- [ ] Newsletter 구독자: 100명
- [ ] 커뮤니티 댓글: 50개/월
- [ ] 협업 제안: 5건/월
- [ ] 바운티 신청: 10건/월

### Technical Metrics
- [ ] Lighthouse Performance: 90+
- [ ] Lighthouse Accessibility: 95+
- [ ] Lighthouse SEO: 90+
- [ ] FCP: 1.5초 이하
- [ ] TTI: 3.0초 이하
- [ ] CLS: 0.1 이하

---

**총 예상 시간**: 40시간
**완료율**: 0% (Planned)

---

**Last Updated**: 2025-11-13
**Status**: 📋 Planned
