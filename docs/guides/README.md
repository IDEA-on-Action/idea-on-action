# Guides

프로젝트 설정, 사용법, 운영 가이드를 제공합니다.

## 폴더 구조

### analytics/
분석 도구 설정 및 사용
- Google Analytics 4
- Sentry 에러 추적
- 이벤트 트래킹

### auth/
인증 시스템 설정
- OAuth 설정 (Google, GitHub, Kakao)
- Supabase Auth 연동
- 2FA 설정

### cms/
CMS 관리자 모드 가이드
- 관리자 페이지 사용법
- 콘텐츠 관리
- 미디어 업로드

### components/
주요 컴포넌트 사용 가이드
- Header, Footer, Hero 등
- UI 컴포넌트 사용법
- 커스텀 컴포넌트

### database/
데이터베이스 스키마 및 마이그레이션
- Supabase 스키마
- RLS 정책
- 마이그레이션 실행

### deployment/
배포 가이드
- Vercel 배포
- 환경 변수 설정
- CI/CD 설정
- 브랜치 전략

### design-system/
디자인 시스템 가이드
- 색상 시스템
- 타이포그래피
- 컴포넌트 스타일

### external-services/
외부 서비스 연동
- 결제 시스템 (Toss Payments)
- 이메일 (Resend)
- 스토리지 (Supabase Storage)

### storage/
파일 저장소 관리
- 이미지 업로드
- 파일 권한 관리
- CDN 설정

### testing/
테스트 가이드
- Playwright E2E 테스트
- Vitest 단위 테스트
- Lighthouse CI

### versioning/
버전 관리 가이드
- 버전 업데이트 규칙
- 릴리스 프로세스
- 버전별 로드맵 매핑

## 새 가이드 작성 방법

### 파일명 규칙
- 소문자, 하이픈 구분: `oauth-setup.md`
- 주제별 폴더에 위치: `auth/oauth-setup.md`

### 필수 구성 요소
1. **개요**: 가이드 목적 및 범위
2. **사전 준비**: 필요한 도구, 권한, 설정
3. **단계별 설명**: 명확한 순서와 스크린샷
4. **검증 방법**: 올바르게 설정되었는지 확인
5. **트러블슈팅**: 자주 발생하는 문제 해결
6. **관련 문서**: 참고할 다른 가이드 링크

### 예시 템플릿
```markdown
# [주제] 설정 가이드

## 개요
이 가이드는 [기능]을 설정하는 방법을 설명합니다.

## 사전 준비
- [ ] [필요한 도구]
- [ ] [필요한 권한]

## 설정 단계
### 1. [첫 번째 단계]
### 2. [두 번째 단계]

## 검증
[설정 확인 방법]

## 트러블슈팅
### [문제 1]
[해결 방법]

## 관련 문서
- [링크]
```

## 최근 추가 가이드

### Components (신규)
- `Features.md` - Features 컴포넌트 사용법
- `Footer.md` - Footer 컴포넌트
- `Header.md` - Header 컴포넌트
- `Hero.md` - Hero 섹션
- `Services.md` - Services 컴포넌트

### Deployment (통합)
- `branch-protection-guide.md` - 브랜치 보호 규칙
- `branch-strategy.md` - 브랜치 전략 (3-Tier)
- `deployment-checklist.md` - 배포 체크리스트
- `deployment-guide.md` - Vercel 배포 가이드
- `github-setup.md` - GitHub 저장소 설정

### Versioning (신규)
- `README.md` - 버전 관리 가이드
- `version-roadmap-mapping.md` - 버전별 로드맵 매핑

## 관련 문서
- [프로젝트 문서 인덱스](../README.md)
- [보고서](../reports/)
- [테스트 문서](../testing/)
