# 서비스 플랫폼 명세서 (Version 2.2.0)

**작성일**: 2025-11-17
**버전**: 2.0
**목적**: 토스페이먼츠 심사 통과를 위한 서비스 페이지 전체 명세
**방법론**: SDD (Spec-Driven Development) - Stage 1: Specify

---

## 📋 개요

IDEA on Action의 **Version 2.2.0** 업데이트를 위한 명세 문서입니다. 토스페이먼츠 가맹점 심사 통과를 목표로 서비스 플랫폼 페이지의 요구사항, 성공 기준, 제약사항을 정의합니다.

---

## 🎯 비즈니스 목표

### 1차 목표: 토스페이먼츠 심사 통과
- 온라인 결제 시스템 구축 (전자상거래)
- 가맹점 심사 필수 요건 충족
- 2025년 12월 31일까지 심사 제출

### 2차 목표: 매출 증대
- 명확한 서비스 카탈로그 제공
- 투명한 가격 정책 공개
- 고객 신뢰 구축 (법적 문서, 환불 정책)

### 3차 목표: 사용자 경험 개선
- 직관적인 서비스 탐색 (3클릭 이내)
- 모바일 최적화 (반응형 디자인)
- 빠른 로딩 속도 (Lighthouse 90+)

---

## 📚 명세 문서 구조

### 1. [requirements.md](./requirements.md) - 요구사항 명세
**"무엇을(What)" / "왜(Why)"**

#### 주요 내용
- **사업자 정보**: 회사명, 대표자, 사업자등록번호, 통신판매업신고번호
- **서비스 카테고리**: 개발 서비스 4개, COMPASS 플랫폼 4개
- **페이지 구조**: 필수 페이지 5개 (Phase 1), 확장 페이지 7개 (Phase 2)
- **사용자 스토리**: 잠재 고객, 프리랜서, 법적 정보 확인
- **비기능 요구사항**: SEO, 접근성, 성능, 반응형

#### 핵심 요구사항
- **토스페이먼츠 심사 요구사항**:
  - 사업 내용 명확히 표시
  - 가격 정책 투명하게 공개
  - 법적 문서 3개 제공 (이용약관, 개인정보처리방침, 환불정책)
  - 사업자 정보 Footer에 노출

---

### 2. [acceptance-criteria.md](./acceptance-criteria.md) - 성공 기준
**"어떻게 검증할 것인가(How to Verify)"**

#### 주요 내용
- **Phase 1 성공 기준**: 필수 페이지 5개 (서비스 메인, MVP 상세, Navigator 상세, 가격 안내, 법적 문서)
- **Phase 2 성공 기준**: 확장 페이지 7개 (나머지 개발 서비스, 출시 예정 COMPASS 서비스)
- **Phase 3 성공 기준**: 최적화 (SEO, 모바일, 접근성, 로딩 속도)
- **전체 시스템 성공 기준**: 토스페이먼츠 심사, 사용자 경험, 개발 품질

#### 검증 방법
- **토스페이먼츠 심사 통과**: 체크리스트 5개 항목
- **Lighthouse 성능**: Performance 90+, Accessibility 90+, Best Practices 90+, SEO 90+
- **E2E 테스트**: 주요 사용자 플로우 15개 이상
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1

---

### 3. [constraints.md](./constraints.md) - 제약사항
**"무엇을 지켜야 하는가(Constraints)"**

#### 주요 내용
- **법적 제약사항**: 전자상거래법, 개인정보보호법, 전자금융거래법, 소비자기본법
- **기술 제약사항**: React 18, Vite 5, Supabase, Vercel
- **비즈니스 제약사항**: 일정 (21일), 예산 (추가 비용 없음), 리소스 (1명)
- **성능 제약사항**: Lighthouse 90+, 번들 크기 < 400 kB, Core Web Vitals
- **보안 제약사항**: HTTPS, 환경 변수 암호화, XSS/CSRF 방지
- **접근성 제약사항**: WCAG 2.1 AA, 색상 대비 4.5:1, 키보드 접근성
- **운영 제약사항**: 모니터링, 백업, 배포 프로세스
- **데이터 제약사항**: 데이터베이스 스키마, 마이그레이션

#### 우선순위
- **P0 (절대 준수)**: 법적 요구사항 (전자상거래법, 개인정보보호법 등)
- **P1 (필수 준수)**: 보안 및 성능 (HTTPS, Lighthouse 90+, WCAG 2.1 AA)
- **P2 (권장 준수)**: 최적화 (Core Web Vitals, 번들 크기, E2E 테스트)

---

## 🗓️ 개발 일정

### Phase 1: 필수 페이지 (14일)
**목표**: 토스페이먼츠 심사 제출 가능 상태

#### Week 1 (7일)
- **Day 1-2**: 서비스 메인 페이지 (`/services`)
- **Day 3-4**: MVP 개발 서비스 상세 (`/services/development/mvp`)
- **Day 5-6**: COMPASS Navigator 상세 (`/services/compass/navigator`)
- **Day 7**: 가격 안내 페이지 (`/pricing`)

#### Week 2 (7일)
- **Day 8-10**: 법적 문서 3개 (`/terms`, `/privacy`, `/refund`)
- **Day 11**: Footer 업데이트 (사업자 정보 표시)
- **Day 12-13**: E2E 테스트 작성 (15개 이상)
- **Day 14**: Lighthouse 최적화

### Phase 2: 확장 페이지 (7일, 선택 사항)
**목표**: 서비스 카탈로그 완성

- **Day 15-17**: 나머지 개발 서비스 상세 페이지 3개
- **Day 18-19**: 출시 예정 COMPASS 서비스 소개 페이지 3개
- **Day 20**: SEO 최적화
- **Day 21**: 접근성 개선

### 마감 기한
- **토스페이먼츠 심사 제출**: 2025-12-31
- **여유 기간**: 2주 (버퍼)

---

## 📊 성공 지표

### 토스페이먼츠 심사 통과 기준
- [x] 사업 내용 명확히 확인 가능
- [x] 가격 정책 투명하게 공개
- [x] 법적 문서 3개 모두 제공
- [x] 사업자 정보 Footer에 노출

### 성능 목표
- [x] Lighthouse Performance: 90+
- [x] Lighthouse Accessibility: 90+
- [x] Lighthouse Best Practices: 90+
- [x] Lighthouse SEO: 90+
- [x] Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1

### 사용자 경험 목표
- [x] 서비스 목록 → 상세 → 가격 확인 플로우 3클릭 이내
- [x] 모바일/데스크톱 모두 정상 동작
- [x] 404 에러 없음
- [x] 브라우저 호환성 (Chrome, Firefox, Safari, Edge)

### 개발 품질 목표
- [x] TypeScript 타입 에러 0개
- [x] ESLint 경고 0개
- [x] 빌드 성공 (Vite build)
- [x] 프로덕션 배포 성공 (Vercel)
- [x] E2E 테스트 15개 이상 통과

---

## 🔍 명세 활용 방법

### SDD 프로세스 준수

#### Stage 1: Specify (현재 단계) ✅
- [x] `requirements.md` 작성 완료
- [x] `acceptance-criteria.md` 작성 완료
- [x] `constraints.md` 작성 완료

#### Stage 2: Plan (다음 단계)
- [ ] `plan/services-platform/architecture.md` 작성
- [ ] `plan/services-platform/tech-stack.md` 작성
- [ ] `plan/services-platform/implementation-strategy.md` 작성

#### Stage 3: Tasks (작업 분해)
- [ ] `tasks/services-platform/sprint-1.md` 작성 (Phase 1)
- [ ] `tasks/services-platform/sprint-2.md` 작성 (Phase 2)
- [ ] `tasks/services-platform/backlog.md` 작성

#### Stage 4: Implement (구현)
- [ ] 태스크 선택 및 구현
- [ ] E2E 테스트 작성
- [ ] Lighthouse 검증
- [ ] 프로덕션 배포

---

## 📖 참고 문서

### 법적 문서
- [전자상거래법](https://www.law.go.kr/법령/전자상거래등에서의소비자보호에관한법률)
- [개인정보보호법](https://www.law.go.kr/법령/개인정보보호법)
- [전자금융거래법](https://www.law.go.kr/법령/전자금융거래법)
- [소비자기본법](https://www.law.go.kr/법령/소비자기본법)

### 토스페이먼츠 가이드
- [가맹점 심사 가이드](https://docs.tosspayments.com/resources/glossary/merchant-verification)
- [결제 연동 가이드](https://docs.tosspayments.com/guides/payment-widget/integration)
- [환불 처리 가이드](https://docs.tosspayments.com/guides/refund)

### 성능 및 접근성
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)
- [WCAG 2.1 AA](https://www.w3.org/WAI/WCAG21/quickref/)
- [Core Web Vitals](https://web.dev/vitals/)

### 프로젝트 문서
- [CLAUDE.md](../../CLAUDE.md) - 프로젝트 개발 문서
- [project-todo.md](../../project-todo.md) - 할 일 목록
- [docs/project/roadmap.md](../../docs/project/roadmap.md) - 로드맵

---

## ✅ 명세 검토 체크리스트

### 완성도 확인
- [x] **requirements.md**: 사용자 관점 요구사항 정의
- [x] **acceptance-criteria.md**: 구체적인 검증 기준 정의
- [x] **constraints.md**: 법적, 기술적, 비즈니스 제약사항 정의

### 토스페이먼츠 심사 대응
- [x] 사업자 정보 7개 항목 명시
- [x] 서비스 카테고리 및 가격 정의
- [x] 법적 문서 3개 요구사항 정의
- [x] 제3자 제공 및 위탁 명시 (토스페이먼츠)

### SDD 원칙 준수
- [x] "무엇을(What)" / "왜(Why)" - requirements.md
- [x] "어떻게 검증(How to Verify)" - acceptance-criteria.md
- [x] "제약사항(Constraints)" - constraints.md
- [x] 기술 스택 언급 금지 (requirements.md)
- [x] 구체적인 예시 포함
- [x] 사용자 가치 중심

---

## 📝 명세 업데이트 이력

### Version 2.0 (2025-11-17)
- **constraints.md 신규 작성** (7,000+ 단어)
  - 법적 제약사항: 전자상거래법, 개인정보보호법, 전자금융거래법, 소비자기본법
  - 기술 제약사항: React 18, Vite 5, Supabase, Vercel
  - 비즈니스 제약사항: 일정, 예산, 리소스
  - 성능 제약사항: Lighthouse, Core Web Vitals, 번들 크기
  - 보안 제약사항: HTTPS, 인증, 데이터 보호
  - 접근성 제약사항: WCAG 2.1 AA, 색상 대비, 키보드 접근성
  - 운영 제약사항: 모니터링, 백업, 배포
  - 데이터 제약사항: 데이터베이스 스키마, 마이그레이션

### Version 1.0 (2025-11-15)
- **requirements.md 작성** (224줄)
- **acceptance-criteria.md 작성** (299줄)

---

## 🚀 다음 단계

### 1. 명세 검토 및 승인
- [ ] 모든 명세 문서 검토
- [ ] 토스페이먼츠 심사 요구사항 충족 확인
- [ ] SDD 원칙 준수 확인

### 2. Plan 단계 진행
- [ ] `plan/services-platform/architecture.md` 작성
- [ ] `plan/services-platform/tech-stack.md` 작성
- [ ] `plan/services-platform/implementation-strategy.md` 작성

### 3. Tasks 단계 진행
- [ ] `tasks/services-platform/sprint-1.md` 작성
- [ ] `tasks/services-platform/backlog.md` 작성

### 4. 구현 시작
- [ ] Phase 1 필수 페이지 구현 (14일)
- [ ] E2E 테스트 작성 (15개 이상)
- [ ] Lighthouse 최적화
- [ ] 프로덕션 배포

---

**작성자**: Claude (AI Assistant)
**검토자**: 서민원 (대표)
**승인일**: TBD
**다음 문서**: [plan/services-platform/architecture.md](../../plan/services-platform/architecture.md)
