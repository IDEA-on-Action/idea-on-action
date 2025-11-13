# Version 2.0 제약사항 (Constraints)

> 비기능 요구사항 및 기술적 제약사항

**작성일**: 2025-11-13
**버전**: 2.0.0
**상태**: 📋 Draft

---

## 🔧 기술 스택 제약사항

### 변경 불가능한 기술 (Non-negotiable)

#### 프론트엔드
- **프레임워크**: React 18.x (변경 불가)
- **빌드 도구**: Vite 5.x (변경 불가)
- **언어**: TypeScript 5.x (Strict Mode 필수)
- **라우팅**: React Router DOM 6.x

#### 백엔드
- **Backend-as-a-Service**: Supabase (변경 불가)
  - PostgreSQL 15+
  - Supabase Auth (OAuth 통합)
  - Supabase Storage (이미지 저장)
  - Supabase Edge Functions (서버리스)

#### 배포
- **호스팅**: Vercel (변경 불가)
- **도메인**: www.ideaonaction.ai
- **CD/CI**: GitHub Actions + Vercel

#### 스타일링
- **CSS 프레임워크**: Tailwind CSS 3.4.x (변경 불가)
- **UI 라이브러리**: shadcn/ui (변경 불가)
- **아이콘**: Lucide Icons

---

## 🌐 브라우저 지원

### 지원 브라우저
- **Chrome**: 100+ (Desktop, Mobile)
- **Firefox**: 100+ (Desktop, Mobile)
- **Safari**: 15+ (Desktop, Mobile)
- **Edge**: 100+ (Desktop)

### 지원하지 않는 브라우저
- Internet Explorer (모든 버전)
- Opera Mini
- UC Browser

---

## 📱 디바이스 지원

### 화면 크기
- **모바일**: 320px ~ 767px
- **태블릿**: 768px ~ 1023px
- **데스크톱**: 1024px ~ 1920px
- **와이드 스크린**: 1921px+

### Breakpoints (Tailwind CSS)
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

---

## ⚡ 성능 제약사항

### Lighthouse 목표
- **Performance**: 90+ (필수)
- **Accessibility**: 95+ (필수)
- **SEO**: 90+ (필수)
- **Best Practices**: 90+ (권장)

### Core Web Vitals
- **FCP (First Contentful Paint)**: 1.5초 이하
- **TTI (Time to Interactive)**: 3.0초 이하
- **CLS (Cumulative Layout Shift)**: 0.1 이하
- **LCP (Largest Contentful Paint)**: 2.5초 이하
- **FID (First Input Delay)**: 100ms 이하

### 번들 크기 제약
- **초기 JS 번들**: 300KB 이하 (gzip)
- **CSS 번들**: 50KB 이하 (gzip)
- **이미지**: WebP 형식 사용, 5MB 제한

---

## 🔒 보안 제약사항

### 인증 및 권한
- **RLS (Row Level Security)**: 모든 Supabase 테이블 필수
- **JWT**: Supabase Auth 토큰 사용 (수명 1시간)
- **OAuth**: Google, GitHub, Kakao만 지원
- **관리자 권한**: `user_roles` 테이블 기반

### 데이터 보호
- **환경 변수**: `.env.local` (gitignore 필수)
- **API 키**: Vercel Secrets로 관리
- **HTTPS**: 모든 요청 HTTPS 필수
- **CORS**: Vercel 도메인만 허용

### 입력 검증
- **XSS 방지**: React 기본 이스케이핑 + react-markdown
- **SQL Injection 방지**: Supabase Prepared Statements
- **CSRF 방지**: Supabase JWT + SameSite 쿠키
- **Rate Limiting**: Edge Functions (Newsletter 1회/분, Brief 5회/시간)

---

## 📦 데이터베이스 제약사항

### Supabase 제한
- **무료 플랜**:
  - 500MB 데이터베이스 (초과 시 유료 플랜)
  - 1GB Storage (초과 시 유료 플랜)
  - 2 Edge Functions (추가 시 유료 플랜)
  - 50,000 월간 활성 사용자 (MAU)
- **연결 제한**: 최대 60개 동시 연결 (Connection Pool)

### RLS 정책 제약
- **SELECT**: 모든 사용자 허용
- **INSERT/UPDATE/DELETE**: 관리자만 허용 (user_roles 확인)
- **특별 케이스**:
  - `newsletter_subscriptions`: 모든 사용자 INSERT 허용
  - `work_with_us_submissions`: 모든 사용자 INSERT 허용
  - `bounties.applicants`: 인증된 사용자만 UPDATE 허용

### 인덱스 제약
- 모든 외래 키에 인덱스 필수
- 자주 조회되는 컬럼 (created_at, status, quarter) 인덱스 필수

---

## 🌍 국제화 제약사항

### 지원 언어
- **한국어** (ko): 기본 언어
- **영어** (en): 2차 지원

### 번역 범위
- **UI 텍스트**: 모든 버튼, 라벨, 메시지
- **콘텐츠**: 블로그 포스트는 별도 번역 (수동)
- **에러 메시지**: 모든 에러 메시지 번역

### 지원하지 않는 언어
- 중국어, 일본어, 프랑스어 등 (추후 확장 가능)

---

## 📧 이메일 서비스 제약사항

### Resend 제한
- **무료 플랜**:
  - 100 이메일/일 (초과 시 유료 플랜)
  - 1 도메인 (추가 시 유료 플랜)
- **발신자**: `no-reply@ideaonaction.ai` (도메인 인증 필수)
- **수신자**: 유효한 이메일 주소만
- **첨부 파일**: 10MB 제한

---

## 💬 커뮤니티 기능 제약사항

### Giscus (GitHub Discussions)
- **GitHub 계정 필수**: 댓글 작성 시 GitHub 로그인 필요
- **Repository**: `IDEA-on-Action/idea-on-action`
- **Mapping**: pathname 기반
- **테마**: preferred_color_scheme (시스템 설정)

### Newsletter
- **구독 확인**: Double Opt-in (이메일 확인 필수)
- **구독 취소**: 모든 이메일에 Unsubscribe 링크 포함
- **GDPR 준수**: 개인정보 수집 동의 필수

---

## 🧪 테스트 제약사항

### 코드 커버리지
- **최소 커버리지**: 80% (유닛 테스트)
- **E2E 커버리지**: 주요 사용자 여정 100%

### 테스트 환경
- **Playwright**: Chromium, Firefox, WebKit
- **Vitest**: jsdom 환경
- **테스트 데이터**: Supabase 테스트 프로젝트 사용 (프로덕션 분리)

---

## 🚀 배포 제약사항

### 브랜치 전략
- **main**: Production (보호됨, PR만 허용)
- **develop**: Development
- **feature/***: Feature branches
- **hotfix/***: Hotfix branches

### 배포 조건
- **main 브랜치**:
  - [ ] 모든 테스트 통과 (E2E + Unit)
  - [ ] Lighthouse CI 통과 (Performance 90+)
  - [ ] 코드 리뷰 승인 (1명 이상)
  - [ ] 빌드 성공 (0 에러)
- **develop 브랜치**:
  - [ ] 빌드 성공
  - [ ] 린트 에러 0개

### 롤백 정책
- **Vercel**: 이전 배포로 즉시 롤백 가능
- **데이터베이스**: Migration Revert 스크립트 필수
- **긴급 수정**: hotfix 브랜치 → main PR (1시간 내 배포)

---

## 📊 모니터링 제약사항

### 에러 추적
- **Sentry**: 프로덕션 에러 자동 수집
- **에러 재현율**: 80% 이상 (Replay 세션)
- **알림**: Critical 에러는 즉시 Slack 알림

### 분석 도구
- **Google Analytics 4**: 페이지뷰, 이벤트 추적
- **Vercel Analytics**: Core Web Vitals
- **Custom Metrics**: `/api/metrics` 엔드포인트

---

## 🔄 자동화 제약사항

### Supabase Cron Jobs
- **Weekly Recap**: 매주 일요일 23:59 (UTC+9)
- **실행 시간**: 최대 30초 (Edge Function 제한)
- **실패 처리**: 3회 재시도 후 Slack 알림

### Webhook
- **Work with Us**: Slack/Discord 알림
- **타임아웃**: 5초 (초과 시 재시도)

---

## 💾 스토리지 제약사항

### Supabase Storage
- **버킷**: `project-images`, `avatars`, `attachments`
- **파일 크기**: 최대 5MB (프로젝트 이미지), 10MB (첨부 파일)
- **파일 형식**: JPG, PNG, WebP (이미지), PDF (첨부 파일)
- **보안**: Public 버킷 (RLS 적용 불가), 파일명 UUID 난수화

---

## 🎨 디자인 제약사항

### 색상 시스템
- **Primary**: Blue (#3b82f6) - 고정
- **Accent**: Orange (#f59e0b) - 고정
- **Secondary**: Purple (#8b5cf6) - 고정
- **Neutral**: Tailwind Gray 팔레트 사용

### 타이포그래피
- **본문**: Inter (Google Fonts) - 고정
- **코드**: JetBrains Mono (Google Fonts) - 고정
- **폰트 크기**: Tailwind CSS 기본값 사용

### 그리드 시스템
- **간격**: 8px 기준 (0.5, 1, 2, 4, 8, 12, 16, 24, 32...)
- **컨테이너**: max-width 1280px (xl breakpoint)

---

## 📝 콘텐츠 제약사항

### Markdown 지원
- **라이브러리**: react-markdown + remark-gfm
- **지원 기능**: 헤딩, 리스트, 코드 블록, 이미지, 링크, 테이블
- **미지원 기능**: HTML 태그 (보안 이유)

### 이미지
- **형식**: WebP 권장, JPG/PNG 허용
- **최적화**: Supabase Storage CDN 자동 최적화
- **Alt 텍스트**: 모든 이미지 필수 (접근성)

---

## 🔗 외부 API 제약사항

### GitHub API
- **Rate Limit**: 5,000 요청/시간 (인증된 요청)
- **캐싱**: 5분 (Redis)
- **데이터**: 커밋 수, 기여자 수

### Google Analytics 4
- **이벤트 제한**: 500 이벤트/세션
- **커스텀 이벤트**: 최대 25개

---

## 📅 일정 제약사항

### Sprint 기간
- **Sprint 1**: 1주 (28시간 예상)
- **Sprint 2**: 1주 (40시간 예상)
- **Sprint 3**: 1주 (40시간 예상)
- **총 기간**: 3주 (108시간 예상)

### 마일스톤
- **Week 1 End**: 정적 페이지 완성
- **Week 2 End**: Supabase 연동 완성
- **Week 3 End**: 자동화 및 배포 완성

---

## 🚫 명시적 제외사항

### 지원하지 않는 기능
- **결제 시스템**: Version 2.0에서 제외 (Phase 9 기능 활용)
- **채팅 기능**: Version 2.0에서 제외
- **AI 챗봇**: Version 2.0에서 제외 (Phase 13 기능 활용)
- **실시간 알림**: Version 2.0에서 제외 (Phase 13 기능 활용)

### 기술적 제한
- **SSR (Server-Side Rendering)**: Vite는 SPA만 지원
- **Edge Functions**: 최대 2개 (무료 플랜)
- **WebSocket**: Supabase Realtime 제한적 지원

---

**Last Updated**: 2025-11-13
**Version**: 2.0.0
**Status**: 📋 Draft
**Next Review**: Sprint 완료 시
