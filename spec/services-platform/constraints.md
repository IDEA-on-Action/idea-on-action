# 서비스 플랫폼 제약사항

**작성일**: 2025-11-17
**버전**: 2.0
**목적**: 토스페이먼츠 심사 통과를 위한 법적, 기술적, 비즈니스 제약사항 정의

---

## 목차

1. [법적 제약사항](#1-법적-제약사항)
2. [기술 제약사항](#2-기술-제약사항)
3. [비즈니스 제약사항](#3-비즈니스-제약사항)
4. [성능 제약사항](#4-성능-제약사항)
5. [보안 제약사항](#5-보안-제약사항)
6. [접근성 제약사항](#6-접근성-제약사항)
7. [운영 제약사항](#7-운영-제약사항)
8. [데이터 제약사항](#8-데이터-제약사항)

---

## 1. 법적 제약사항

### 1.1 전자상거래법 준수

**필수 표시 정보** (전자상거래 등에서의 소비자보호에 관한 법률 제10조):

#### 사업자 정보
- **회사명**: 생각과 행동 (영문: IDEA on Action)
- **대표자**: 서민원
- **사업자등록번호**: 537-05-01511
- **통신판매업신고번호**: 2025-경기시흥-2094
- **사업장 소재지**: 경기도 시흥시 대은로104번길 11 (은행동, 우남아파트) 103동 601호
- **전화번호**: 010-4904-2671
- **이메일**: sinclairseo@gmail.com

#### 표시 위치
- **Footer 섹션**: 모든 페이지 하단에 고정 표시
- **회사소개 페이지**: `/about` 페이지에 상세 표시
- **이용약관**: `/terms` 페이지 서문에 재표시

#### 재화/용역 내용 명시 의무
- **서비스명**: 명확한 서비스 제목 (예: "MVP 개발 서비스", "COMPASS Navigator")
- **제공 내용**: 구체적인 제공 내용 및 기능 목록
- **제공 기간**: 개발 기간, 구독 기간 명시
- **결과물**: 납품물 목록 (소스 코드, 문서, 디자인 파일 등)
- **보증**: 무상 지원 기간, 버그 수정 보증 범위

#### 가격 표시 의무
- **총 금액**: 부가가치세 포함 금액 명시 (예: "₩5,000,000 (VAT 포함)")
- **단계별 결제**: 착수금, 중간금, 잔금 비율 명시
- **구독료**: 월 이용료, 연간 구독 할인율 명시
- **추가 비용**: 발생 가능한 추가 비용 사전 고지 (예: 도메인, 호스팅)

### 1.2 개인정보보호법 준수

**개인정보처리방침 필수 명시 사항** (개인정보보호법 제30조):

#### 수집 항목
- **필수 정보**: 이름, 이메일, 전화번호
- **선택 정보**: 회사명, 직책, 프로젝트 예산
- **자동 수집**: IP 주소, 쿠키, 접속 로그

#### 수집 목적
- **서비스 제공**: 상담, 견적, 계약, 납품
- **결제 처리**: 결제 승인, 영수증 발행, 환불 처리
- **고객 지원**: 문의 응대, 기술 지원, A/S
- **마케팅**: 뉴스레터, 이벤트 안내 (동의 시)

#### 보유 기간
- **회원 정보**: 탈퇴 시까지
- **거래 정보**: 전자상거래법에 따라 5년
- **쿠키**: 브라우저 종료 시 또는 1년

#### 제3자 제공 (토스페이먼츠)
- **제공받는 자**: ㈜토스페이먼츠
- **제공 목적**: 결제 처리 및 정산
- **제공 항목**: 이름, 이메일, 전화번호, 결제 금액, 결제 수단
- **보유 기간**: 거래 완료 후 5년 (전자금융거래법 제22조)
- **법적 근거**: 전자금융거래법 제21조 (위탁)

#### 처리 위탁
- **수탁업체**: ㈜토스페이먼츠, Vercel Inc. (호스팅), Supabase Inc. (데이터베이스)
- **위탁 업무**: 결제 처리, 웹 호스팅, 데이터베이스 관리
- **감독**: 정기 감사, 보안 점검

#### 개인정보 보호책임자
- **성명**: 서민원
- **직책**: 대표
- **이메일**: sinclairseo@gmail.com
- **전화**: 010-4904-2671

### 1.3 전자금융거래법 준수

**전자금융거래 기본약관 필수 명시 사항** (전자금융거래법 제8조):

#### 전자지급수단
- **지원 결제 수단**: 신용카드, 체크카드, 계좌이체, 가상계좌
- **결제대행사**: ㈜토스페이먼츠 (PG사)
- **결제 취소**: 결제 후 7일 이내 청약 철회 가능 (단, 용역 제공 시작 전)

#### 보안 조치
- **암호화**: TLS 1.3 (HTTPS)
- **인증**: 카드사 본인인증 (3D Secure)
- **접근 제어**: 관리자 권한 분리, 2FA

#### 사고 발생 시 책임
- **보상**: 사용자 과실이 아닌 경우 전액 보상
- **통지**: 사고 발생 즉시 고객 통지
- **긴급 연락처**: support@ideaonaction.com, 010-4904-2671

### 1.4 소비자기본법 준수

**환불 정책 필수 명시 사항** (소비자기본법 제16조):

#### 청약 철회 권리
- **기간**: 계약 체결 후 7일 이내
- **예외**: 용역 제공이 시작된 경우 (단, 착수 전 철회 가능)
- **통지 방법**: 이메일, 전화, 서면

#### 환불 처리
- **처리 기간**: 접수 후 14영업일 이내
- **환불 수수료**: 원칙적으로 없음 (단, 이용자 귀책 사유 시 협의)
- **환불 방법**: 원 결제 수단으로 환불 (카드 취소, 계좌 이체)

#### 환불 불가 사유
- **개발 완료 후**: 최종 납품 후 7일 경과
- **이용자 귀책**: 허위 정보 제공, 계약 불이행
- **합의 해지**: 쌍방 합의 시 약정 금액

---

## 2. 기술 제약사항

### 2.1 프론트엔드 제약

#### 프레임워크 및 버전
- **React**: 18.x (최신 안정 버전)
- **TypeScript**: 5.x (strict mode 필수)
- **Vite**: 5.x (빌드 도구)
- **React Router**: 6.x (클라이언트 사이드 라우팅)

#### 스타일링
- **Tailwind CSS**: 3.4.x
- **shadcn/ui**: 컴포넌트 라이브러리 (Radix UI 기반)
- **커스텀 CSS**: 최소화 (Tailwind utility 우선)

#### 상태 관리
- **React Query**: 서버 상태 관리
- **React Hook Form**: 폼 상태 관리
- **Zustand**: 클라이언트 전역 상태 (필요 시)

### 2.2 백엔드 제약

#### 데이터베이스
- **Supabase PostgreSQL**: 14.x
- **RLS (Row Level Security)**: 모든 테이블에 적용
- **마이그레이션**: Supabase CLI로 버전 관리

#### 인증
- **Supabase Auth**: OAuth 2.0, JWT
- **역할 기반 접근 제어**: admin, user 역할
- **세션 관리**: httpOnly 쿠키

#### API
- **Supabase REST API**: 자동 생성 CRUD API
- **Edge Functions**: Deno 런타임 (필요 시)
- **Rate Limiting**: Supabase 기본 제공 (초당 100 요청)

### 2.3 배포 제약

#### 호스팅
- **Vercel**: 프로덕션 배포 플랫폼
- **CDN**: Vercel Edge Network (자동)
- **리전**: 글로벌 (자동 라우팅)

#### 환경 변수
- **필수 변수**:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_TOSS_CLIENT_KEY` (토스페이먼츠 클라이언트 키)
  - `VITE_GA_MEASUREMENT_ID` (Google Analytics)
- **보안**: `.env.local` (gitignore), GPG 암호화 백업

#### 도메인
- **프로덕션**: https://www.ideaonaction.ai/
- **SSL/TLS**: Let's Encrypt (Vercel 자동 관리)
- **HTTPS**: 필수 (HTTP → HTTPS 자동 리다이렉트)

### 2.4 브라우저 호환성

#### 지원 브라우저
- **Chrome**: 최신 버전 및 1년 이내 버전
- **Firefox**: 최신 버전 및 1년 이내 버전
- **Safari**: 최신 버전 및 1년 이내 버전
- **Edge**: 최신 버전 및 1년 이내 버전

#### 미지원
- **Internet Explorer**: 전체 버전 미지원 (사용자에게 브라우저 업그레이드 안내)
- **Opera Mini**: 제한된 지원 (기본 기능만)

---

## 3. 비즈니스 제약사항

### 3.1 일정 제약

#### Phase 1: 필수 페이지 (14일)
- **Week 1** (7일):
  - 서비스 메인 페이지 (`/services`) - 2일
  - MVP 개발 서비스 상세 (`/services/development/mvp`) - 2일
  - COMPASS Navigator 상세 (`/services/compass/navigator`) - 2일
  - 가격 안내 페이지 (`/pricing`) - 1일
- **Week 2** (7일):
  - 법적 문서 3개 (`/terms`, `/privacy`, `/refund`) - 3일
  - Footer 업데이트 (사업자 정보 표시) - 1일
  - E2E 테스트 작성 (15개 이상) - 2일
  - Lighthouse 최적화 - 1일

#### Phase 2: 확장 페이지 (7일, 선택 사항)
- 나머지 개발 서비스 상세 페이지 3개 - 3일
- 출시 예정 COMPASS 서비스 소개 페이지 3개 - 2일
- SEO 최적화 - 1일
- 접근성 개선 - 1일

#### 마감 기한
- **토스페이먼츠 심사 제출**: 2025-12-31까지
- **여유 기간**: 최소 2주 (버퍼)

### 3.2 예산 제약

#### 개발 비용
- **인건비**: 기존 팀 리소스 활용 (추가 비용 없음)
- **외주 비용**: 없음 (내부 개발)

#### 운영 비용
- **Vercel**: 무료 티어 (Pro 플랜 필요 시 월 $20)
- **Supabase**: 무료 티어 (Pro 플랜 필요 시 월 $25)
- **도메인**: 기존 도메인 활용 (추가 비용 없음)
- **토스페이먼츠**: 거래 수수료 (3.3% + VAT, 거래 발생 시만)

#### 목표
- **추가 예산 없이 프로젝트 완료**
- **기존 스택 최대 활용**
- **무료 티어 범위 내 운영**

### 3.3 리소스 제약

#### 개발 인력
- **1명**: 풀스택 개발자 (서민원)
- **작업 시간**: 주 20시간 (파트타임)

#### 의사결정
- **단독 결정**: 개발자가 기술적 의사결정
- **외부 검토**: 법적 문서는 변호사 자문 (필요 시)

---

## 4. 성능 제약사항

### 4.1 Lighthouse 목표

#### 필수 달성 (Phase 1)
- **Performance**: 90+ 점
- **Accessibility**: 90+ 점
- **Best Practices**: 90+ 점
- **SEO**: 90+ 점

#### 권장 달성 (Phase 2)
- **Performance**: 95+ 점
- **Accessibility**: 100점
- **Best Practices**: 100점
- **SEO**: 100점

### 4.2 Core Web Vitals

#### LCP (Largest Contentful Paint)
- **목표**: < 2.5초
- **최적화**: 이미지 lazy loading, WebP 형식, CDN

#### FID (First Input Delay)
- **목표**: < 100ms
- **최적화**: JavaScript 번들 크기 최소화, Code Splitting

#### CLS (Cumulative Layout Shift)
- **목표**: < 0.1
- **최적화**: 이미지/비디오 크기 사전 지정, 폰트 로딩 최적화

### 4.3 번들 크기

#### 초기 번들 (gzip)
- **목표**: < 400 kB
- **현재**: ~338 kB (Phase 5 리팩토링 완료 후)
- **추가 허용**: < 50 kB (서비스 페이지 추가 시)

#### Code Splitting
- **서비스 페이지**: 별도 청크 분리
- **법적 문서**: 별도 청크 분리
- **Admin 페이지**: 이미 분리됨

#### PWA Precache
- **목표**: < 3 MB
- **현재**: ~2.2 MB (Phase 5 리팩토링 완료 후)
- **추가 허용**: < 500 KB

### 4.4 로딩 시간

#### TTFB (Time to First Byte)
- **목표**: < 600ms
- **최적화**: Vercel Edge Network, HTTP/2, Brotli 압축

#### FCP (First Contentful Paint)
- **목표**: < 1.5초
- **최적화**: Critical CSS 인라인, 폰트 preload

#### TTI (Time to Interactive)
- **목표**: < 3.5초
- **최적화**: JavaScript 지연 로딩, Service Worker

---

## 5. 보안 제약사항

### 5.1 전송 보안

#### HTTPS 필수
- **프로토콜**: TLS 1.3 (최소 TLS 1.2)
- **인증서**: Let's Encrypt (Vercel 자동 관리)
- **HSTS**: Strict-Transport-Security 헤더 (max-age=31536000)

#### API 통신
- **Supabase**: HTTPS 필수
- **토스페이먼츠**: HTTPS 필수
- **제3자 API**: HTTPS 검증

### 5.2 인증 및 권한

#### 사용자 인증
- **Supabase Auth**: OAuth 2.0, JWT
- **세션 관리**: httpOnly 쿠키 (XSS 방지)
- **토큰 만료**: 1시간 (refresh token 7일)

#### 관리자 권한
- **역할**: `admin`, `super_admin`
- **RLS 정책**: Supabase Row Level Security
- **2FA**: Google Authenticator (관리자 필수)

### 5.3 데이터 보호

#### XSS 방지
- **DOMPurify**: 모든 사용자 입력 sanitization
- **React**: JSX 자동 이스케이핑
- **CSP**: Content-Security-Policy 헤더

#### CSRF 방지
- **Supabase Auth**: CSRF 토큰 자동 관리
- **SameSite 쿠키**: Strict 모드

#### SQL Injection 방지
- **Supabase**: Parameterized queries 자동
- **RLS**: 모든 테이블에 적용

### 5.4 환경 변수 보안

#### 민감 정보 관리
- **GPG 암호화**: `.env.local.gpg` (AES256)
- **1Password**: 백업 저장소
- **Git**: `.env.local` gitignore

#### 노출 금지 변수
- `SUPABASE_SERVICE_ROLE_KEY` (서버 사이드만)
- `TOSS_SECRET_KEY` (서버 사이드만)
- `DATABASE_PASSWORD` (Supabase 관리)

---

## 6. 접근성 제약사항

### 6.1 WCAG 2.1 AA 준수

#### 색상 대비
- **텍스트**: 최소 4.5:1 (일반 텍스트)
- **대형 텍스트**: 최소 3:1 (18px bold 이상)
- **UI 컴포넌트**: 최소 3:1 (버튼, 입력 필드)

#### 키보드 접근성
- **Tab 순서**: 논리적 순서 (좌→우, 상→하)
- **포커스 표시**: 모든 인터랙티브 요소
- **Skip to content**: 메인 콘텐츠로 바로가기 링크

#### 스크린 리더
- **ARIA 레이블**: 모든 인터랙티브 요소
- **대체 텍스트**: 모든 이미지 (alt 속성)
- **랜드마크**: `<header>`, `<main>`, `<footer>`, `<nav>`

### 6.2 반응형 디자인

#### 브레이크포인트
- **모바일**: 320px ~ 639px
- **태블릿**: 640px ~ 1023px
- **데스크톱**: 1024px ~ 1279px
- **와이드**: 1280px 이상

#### 터치 영역
- **최소 크기**: 44px × 44px (iOS HIG, Android Material Design)
- **간격**: 최소 8px (인접 요소)

#### 폰트 크기
- **최소**: 16px (본문 텍스트)
- **헤딩**: 24px ~ 48px (반응형)
- **모바일**: 14px ~ 32px (줄임)

### 6.3 다국어 지원

#### 언어
- **한국어**: 기본 언어
- **영어**: 향후 지원 (i18next 준비)

#### 텍스트 방향
- **LTR**: 좌→우 (한국어, 영어)
- **RTL**: 미지원 (아랍어, 히브리어)

---

## 7. 운영 제약사항

### 7.1 모니터링

#### 에러 추적
- **Sentry**: 프론트엔드 에러 추적
- **알림**: 에러 발생 시 이메일 통지
- **임계값**: 5분 내 10건 이상 에러 발생 시 긴급 알림

#### 성능 모니터링
- **Google Analytics 4**: 사용자 행동 분석
- **Vercel Analytics**: Core Web Vitals 추적
- **Lighthouse CI**: 배포 시 자동 성능 측정

### 7.2 백업 및 복구

#### 데이터베이스 백업
- **자동 백업**: Supabase 일일 백업 (7일 보관)
- **수동 백업**: 배포 전 스냅샷
- **복구 절차**: 15분 이내 복구 가능

#### 코드 백업
- **Git**: GitHub 원격 저장소
- **브랜치**: `main` (프로덕션), `develop` (개발)
- **태그**: 버전별 릴리스 태그 (v2.2.0)

### 7.3 배포 프로세스

#### CI/CD
- **GitHub Actions**: 자동 린트, 테스트, 빌드
- **Vercel**: 자동 배포 (main 브랜치)
- **Preview**: Pull Request마다 Preview 환경

#### 롤백
- **Vercel**: 1클릭 롤백 (이전 배포 버전)
- **데이터베이스**: 마이그레이션 롤백 스크립트
- **시간**: 5분 이내 롤백 완료

---

## 8. 데이터 제약사항

### 8.1 데이터베이스 스키마

#### 기존 테이블 활용
- `services`: 서비스 목록
- `service_categories`: 서비스 카테고리
- `projects`: 포트폴리오 (참조용)
- `roadmap_items`: 로드맵 (참조용)

#### 신규 테이블 (필요 시)
- `pricing_packages`: 가격 패키지 정보
- `service_features`: 서비스 기능 목록
- `testimonials`: 고객 후기 (서비스별)

### 8.2 데이터 검증

#### 필수 필드
- `services.name`: 서비스명 (최대 100자)
- `services.description`: 서비스 설명 (최대 500자)
- `services.price`: 가격 (숫자, 양수)
- `services.category_id`: 카테고리 (FK)

#### 선택 필드
- `services.thumbnail_url`: 썸네일 이미지
- `services.tech_stack`: 기술 스택 (JSONB)
- `services.testimonials`: 고객 후기 (JSONB)

### 8.3 데이터 마이그레이션

#### 기존 데이터 유지
- 서비스 4개: MVP, Fullstack, Design, Operations (이미 존재)
- 카테고리 2개: Development, Platform (이미 존재)

#### 신규 데이터 추가
- COMPASS Navigator 서비스 정보
- 가격 패키지 정보 (3개 패키지 × 5개 서비스)
- 법적 문서 내용 (DB 저장 또는 정적 파일)

---

## 9. 제약사항 우선순위

### P0 (절대 준수) - 법적 요구사항
- [ ] 전자상거래법: 사업자 정보 표시
- [ ] 개인정보보호법: 개인정보처리방침
- [ ] 전자금융거래법: 전자금융거래 기본약관
- [ ] 소비자기본법: 환불 정책

### P1 (필수 준수) - 보안 및 성능
- [ ] HTTPS 필수
- [ ] Lighthouse Performance 90+
- [ ] WCAG 2.1 AA 준수
- [ ] 브라우저 호환성 (Chrome, Firefox, Safari, Edge)

### P2 (권장 준수) - 최적화
- [ ] Core Web Vitals 목표 달성
- [ ] 번들 크기 < 400 kB
- [ ] E2E 테스트 15개 이상
- [ ] Lighthouse 95+ 점

---

## 10. 제약사항 검증

### 10.1 법적 검증

**체크리스트**:
- [ ] Footer에 사업자 정보 7개 항목 표시
- [ ] 개인정보처리방침에 토스페이먼츠 제3자 제공 명시
- [ ] 환불 정책에 단계별 환불 규정 명시
- [ ] 이용약관에 저작권 이전 조항 포함

**검증 방법**:
- 변호사 자문 (필요 시)
- 토스페이먼츠 가맹점 심사 가이드 비교
- 유사 서비스 벤치마킹

### 10.2 기술 검증

**체크리스트**:
- [ ] TypeScript 타입 에러 0개
- [ ] ESLint 경고 0개
- [ ] Vite 빌드 성공
- [ ] Vercel 배포 성공

**검증 방법**:
```bash
npm run lint        # ESLint 검사
npm run type-check  # TypeScript 검사
npm run build       # 프로덕션 빌드
```

### 10.3 성능 검증

**체크리스트**:
- [ ] Lighthouse Performance 90+
- [ ] LCP < 2.5초
- [ ] FID < 100ms
- [ ] CLS < 0.1

**검증 방법**:
- Lighthouse CI (배포 시 자동)
- Chrome DevTools Performance 탭
- WebPageTest.org

### 10.4 접근성 검증

**체크리스트**:
- [ ] WCAG 2.1 AA 색상 대비 충족
- [ ] 키보드만으로 모든 기능 사용 가능
- [ ] 스크린 리더 호환성 (NVDA, JAWS)

**검증 방법**:
- axe DevTools (Chrome 확장)
- WAVE (Web Accessibility Evaluation Tool)
- 수동 키보드 네비게이션 테스트

---

## 다음 단계

1. **명세 검토**: 모든 제약사항이 프로젝트 범위 내에서 충족 가능한지 확인
2. **계획 수립**: [plan/services-platform/architecture.md](../../plan/services-platform/architecture.md) 작성
3. **작업 분해**: [tasks/services-platform/sprint-1.md](../../tasks/services-platform/) 작성
4. **구현 시작**: 제약사항을 준수하며 개발 진행

---

**관련 문서**:
- [requirements.md](./requirements.md) - 요구사항 명세
- [acceptance-criteria.md](./acceptance-criteria.md) - 성공 기준
- [../../plan/services-platform/architecture.md](../../plan/services-platform/architecture.md) - 아키텍처 설계
