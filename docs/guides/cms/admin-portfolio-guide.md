# AdminPortfolio 관리 가이드

> **Version**: 2.1.0
> **Last Updated**: 2025-11-21
> **Target Audience**: Admin 사용자
> **Related Pages**: [AdminLab Guide](./admin-lab-guide.md) | [API Documentation](./api/useProjects.md)

---

## 목차
- [개요](#개요)
- [페이지 접근 방법](#페이지-접근-방법)
- [주요 기능](#주요-기능)
- [단계별 가이드](#단계별-가이드)
  - [1. 새 프로젝트 추가하기](#1-새-프로젝트-추가하기)
  - [2. 프로젝트 수정하기](#2-프로젝트-수정하기)
  - [3. 썸네일 및 갤러리 이미지 관리](#3-썸네일-및-갤러리-이미지-관리)
  - [4. 기술 스택 선택하기](#4-기술-스택-선택하기)
  - [5. 고객 후기(Testimonial) 추가하기](#5-고객-후기testimonial-추가하기)
  - [6. 프로젝트 공개/비공개 설정](#6-프로젝트-공개비공개-설정)
  - [7. Featured 프로젝트 설정](#7-featured-프로젝트-설정)
  - [8. 프로젝트 삭제하기](#8-프로젝트-삭제하기)
  - [9. 검색 및 필터링](#9-검색-및-필터링)
- [JSON 필드 가이드](#json-필드-가이드)
- [FAQ](#faq)
- [관련 파일](#관련-파일)
- [주의사항](#주의사항)

---

## 개요

**AdminPortfolio 페이지**는 회사의 프로젝트 포트폴리오를 관리하는 CMS 관리자 전용 페이지입니다. 프로젝트 생성, 수정, 삭제, 공개 설정, 기술 스택 관리, 이미지 업로드 등 포트폴리오 전반을 관리할 수 있습니다.

### 핵심 기능
- **CRUD 작업**: 프로젝트 생성(Create), 조회(Read), 수정(Update), 삭제(Delete)
- **이미지 관리**: 썸네일 및 갤러리 이미지 URL 관리 (JSON 배열, 최대 10개)
- **기술 스택**: JSON 배열 형식으로 최대 20개 기술 스택 입력
- **고객 후기**: JSON 객체 형식으로 추천사 저장
- **공개 관리**: Draft(비공개) ↔ Published(공개) 전환
- **Featured 설정**: 상단 노출 프로젝트 지정
- **검색/필터**: 제목, 요약, 프로젝트 타입, 상태로 필터링

### 사용자 권한
- **필요 권한**: `admin` 또는 `super_admin`
- **접근 제한**: 관리자 로그인 필수 (비로그인 시 `/login` 리다이렉트)
- **RLS 정책**: Supabase Row Level Security로 보호

---

## 페이지 접근 방법

### 1. 직접 URL 접근
```
https://www.ideaonaction.ai/admin/portfolio
```

### 2. 관리자 사이드바 메뉴
1. 관리자 대시보드(`/admin/dashboard`) 로그인
2. 좌측 사이드바에서 **"Portfolio"** 클릭

### 3. 네비게이션 경로
```
Home → Admin → Dashboard → Portfolio
```

---

## 주요 기능

### 1. 프로젝트 목록 테이블
- **8개 컬럼**: 썸네일, 제목, 타입, 상태, 기술 스택, Featured, 공개, 작업
- **인라인 미리보기**: 썸네일 이미지 (16x16 픽셀), 요약 트런케이트
- **인라인 토글**: Featured/공개 스위치로 즉시 변경
- **작업 버튼**: 수정(Pencil), 삭제(Trash2) 아이콘

### 2. 검색 및 필터
- **검색창**: 제목, 요약 실시간 검색 (좌측 상단)
- **프로젝트 타입 필터**: MVP(파란색), Fullstack(초록색), Design(보라색), Operations(주황색)
- **상태 필터**: 전체, 공개(초록색), 비공개(회색), Featured(노란색)

### 3. 프로젝트 폼 (4개 Accordion 섹션)
AdminPortfolio.tsx는 폼을 인라인으로 포함하고 있으며, 다음과 같은 섹션으로 구성됩니다:

#### Section 1: 기본 정보 (8개 필드)
- Slug (kebab-case, 자동 생성 가능)
- 제목 (title)
- 요약 (summary, 최대 500자)
- 상세 설명 (description, 최대 5000자, Markdown 지원)
- 클라이언트명 (clientName)
- 클라이언트 로고 URL (clientLogo)
- 프로젝트 타입 (projectType: mvp/fullstack/design/operations)
- 썸네일 URL (thumbnail)

#### Section 2: 프로젝트 상세 (7개 필드)
- 이미지 URL (images, JSON 배열)
- 기술 스택 (techStack, JSON 배열)
- 프로젝트 URL (projectUrl)
- GitHub URL (githubUrl)
- 기간 (duration, 예: "3개월")
- 팀 크기 (teamSize, 1~100)
- 시작일/종료일 (startDate, endDate)

#### Section 3: 도전과제 및 성과 (4개 필드)
- 도전 과제 (challenges, 최대 2000자)
- 해결 방법 (solutions, 최대 2000자)
- 성과 (outcomes, 최대 2000자)
- 추천사 (testimonial, JSON 객체)

#### Section 4: 공개 설정 (2개 필드)
- Featured 여부 (체크박스)
- 공개 여부 (스위치)

---

## 단계별 가이드

### 1. 새 프로젝트 추가하기

**목적**: 신규 프로젝트 포트폴리오 항목을 생성합니다.

#### 1.1 폼 열기
1. 우측 상단 **"+ 새 포트폴리오 항목"** 버튼 클릭
2. 대화상자(Dialog) 팝업 표시 (최대 너비 4xl, 스크롤 가능)

#### 1.2 필수 필드 입력 ⭐
- **Slug** * (URL-friendly)
  - 형식: 소문자, 숫자, 하이픈만 허용 (`^[a-z0-9-]+$`)
  - 예시: `ai-chatbot-platform-2024`
  - 자동 생성: Title 입력 후 blur 시 자동 생성
  - 수동 재생성: "Generate" 버튼 클릭

- **제목 (Title)** * (최소 1자)
  - 예시: "AI 챗봇 플랫폼 개발"
  - 팁: 명확하고 간결하게 작성 (권장 30자 이내)

- **요약 (Summary)** * (최소 1자, 최대 500자)
  - 예시: "고객 지원 자동화를 위한 AI 챗봇 플랫폼. GPT-4 기반 자연어 처리로 24/7 고객 응대 자동화를 실현했습니다."
  - 팁: 프로젝트 핵심 가치를 2-3문장으로 요약

- **프로젝트 타입 (Project Type)** *
  - MVP: 최소 기능 제품 (파란색 배지)
  - Fullstack: 풀스택 개발 프로젝트 (초록색 배지)
  - Design: 디자인 시스템 구축 (보라색 배지)
  - Operations: 운영/관리 프로젝트 (주황색 배지)

#### 1.3 선택 필드 입력 (권장)
- **상세 설명 (Description)**: Markdown 지원, 최대 5000자
  ```markdown
  # 프로젝트 개요
  GPT-4 기반 AI 챗봇 플랫폼 개발

  ## 주요 기능
  - 자연어 질의응답
  - 다국어 지원 (한국어, 영어)
  - 실시간 학습 시스템
  ```

- **클라이언트명 (Client Name)**: 최대 100자
  - 예시: "ABC Corp", "스타트업 XYZ"

- **클라이언트 로고 URL**: HTTPS URL
  - 예시: `https://example.com/logo.png`
  - 권장 크기: 200x200px (PNG, SVG)

- **썸네일 URL**: HTTPS URL
  - 예시: `https://example.com/thumbnail.jpg`
  - 권장 크기: 800x600px (JPG, WebP)
  - 용량: 200KB 이하 권장

#### 1.4 프로젝트 상세 입력
- **이미지 URL (JSON 배열)**: 갤러리 이미지 (최대 10개)
  ```json
  [
    "https://example.com/screenshot1.jpg",
    "https://example.com/screenshot2.jpg",
    "https://example.com/screenshot3.jpg"
  ]
  ```

- **기술 스택 (JSON 배열)**: 최대 20개
  ```json
  ["React", "TypeScript", "Supabase", "Tailwind CSS", "OpenAI GPT-4"]
  ```

- **프로젝트 URL / GitHub URL**: 라이브 URL 및 소스코드 링크

- **기간 / 팀 크기**: 예: "3개월", 5명

- **시작일 / 종료일**: 날짜 선택기 (YYYY-MM-DD)

#### 1.5 도전과제 및 성과 입력 (선택적, 스토리텔링)
- **도전 과제 (Challenges)**: 최대 2000자
  - 예시: "기존 고객 지원 시스템은 24시간 대응이 불가능했고, 반복적인 질문으로 인력 낭비가 심각했습니다."

- **해결 방법 (Solutions)**: 최대 2000자
  - 예시: "GPT-4 기반 AI 챗봇을 도입하여 FAQ 90% 자동 응답을 구현했습니다. 복잡한 질문은 자동으로 상담원에게 연결되도록 설계했습니다."

- **성과 (Outcomes)**: 최대 2000자
  - 예시: "고객 만족도 25% 상승, 응대 시간 60% 단축, 상담 인력 30% 절감"

#### 1.6 고객 후기 (Testimonial) 추가 (선택적)
JSON 객체 형식으로 입력:
```json
{
  "author": "김철수",
  "role": "CTO",
  "company": "ABC Corp",
  "content": "IDEA on Action 팀은 단 3개월 만에 우리의 AI 챗봇을 완성했습니다. 기술력과 커뮤니케이션 모두 훌륭했습니다.",
  "avatar": "https://example.com/avatar.jpg"
}
```

#### 1.7 공개 설정
- **Featured**: 체크 시 포트폴리오 페이지 상단 노출
- **Published**: 체크 시 공개, 해제 시 비공개(Draft)

#### 1.8 저장
1. **"저장"** 버튼 클릭
2. 성공 Toast: "포트폴리오 생성 완료"
3. 폼 자동 닫힘, 목록 새로고침

**예시 스크린샷**: [Screenshot: AdminPortfolio - 새 프로젝트 폼]

---

### 2. 프로젝트 수정하기

**목적**: 기존 프로젝트 정보를 수정합니다.

#### 2.1 수정 폼 열기
- **방법 1**: 목록 테이블에서 제목 클릭 ❌ (현재 미지원)
- **방법 2**: 우측 작업 컬럼에서 **Pencil 아이콘** 클릭 ✅

#### 2.2 필드 수정
- 기존 데이터가 자동으로 채워져 있음
- 원하는 필드 수정 (모든 필드 수정 가능)
- JSON 필드는 유효한 JSON 형식 유지 필수

#### 2.3 저장
1. **"저장"** 버튼 클릭
2. 성공 Toast: "포트폴리오 수정 완료"
3. 폼 닫힘, 목록 새로고침

**주의**: Slug 변경 시 기존 URL (`/portfolio/:slug`)이 깨질 수 있으므로 신중히 변경하세요.

---

### 3. 썸네일 및 갤러리 이미지 관리

**목적**: 프로젝트 썸네일 및 갤러리 이미지를 관리합니다.

#### 3.1 썸네일 (단일 이미지)
- **필드**: Section 1 "기본 정보" → Thumbnail URL
- **입력 방법**: HTTPS URL 직접 입력
  ```
  https://example.com/projects/ai-chatbot/thumbnail.jpg
  ```
- **권장 사양**:
  - 크기: 800x600px 또는 1200x900px (4:3 비율)
  - 형식: JPG, WebP (압축 권장)
  - 용량: 200KB 이하
  - CDN: Cloudinary, Imgur, Supabase Storage 권장

#### 3.2 갤러리 이미지 (최대 10개)
- **필드**: Section 2 "프로젝트 상세" → Images (JSON 배열)
- **입력 방법**: JSON 배열 형식
  ```json
  [
    "https://example.com/screenshot1.jpg",
    "https://example.com/screenshot2.jpg",
    "https://example.com/screenshot3.jpg"
  ]
  ```
- **권장 사양**:
  - 크기: 1920x1080px (Full HD)
  - 형식: WebP (JPG 대비 30% 작은 용량)
  - 용량: 각 500KB 이하
  - 순서: 중요한 스크린샷을 앞에 배치

#### 3.3 이미지 URL 준비 방법

**Option 1: Supabase Storage (추천)**
```bash
# 이미지 업로드
supabase storage upload projects/ai-chatbot/screenshot1.jpg ./screenshot1.jpg

# 공개 URL 생성
https://zykjdneewbzyazfukzyg.supabase.co/storage/v1/object/public/projects/ai-chatbot/screenshot1.jpg
```

**Option 2: Cloudinary**
- 계정 생성 후 이미지 업로드
- 자동 최적화 및 CDN 제공
- URL 예시: `https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg`

**Option 3: Imgur (개발 테스트용)**
- 무료, 빠른 업로드
- 단, 프로덕션 용도로는 비권장 (삭제 가능성)

#### 3.4 이미지 최적화 팁
- **WebP 변환**: JPG/PNG → WebP 변환으로 30-50% 용량 절감
  ```bash
  # ImageMagick 사용
  convert input.jpg -quality 80 output.webp
  ```
- **압축**: TinyPNG, Squoosh 사용
- **Lazy Loading**: 이미지는 자동으로 lazy load 적용됨

**예시 스크린샷**: [Screenshot: AdminPortfolio - 이미지 URL 입력 폼]

---

### 4. 기술 스택 선택하기

**목적**: 프로젝트에서 사용한 기술 스택을 기록합니다.

#### 4.1 현재 입력 방법 (JSON 배열)
- **필드**: Section 2 "프로젝트 상세" → Tech Stack (JSON 배열)
- **형식**: JSON 배열 (string[])
  ```json
  ["React", "TypeScript", "Supabase", "Tailwind CSS", "Vite", "React Query"]
  ```
- **최대 개수**: 20개 (권장 5-7개)

#### 4.2 기술 스택 카테고리별 권장 항목

**Frontend**
```json
["React", "Vue.js", "Angular", "Next.js", "Tailwind CSS", "shadcn/ui"]
```

**Backend**
```json
["Node.js", "Python", "PostgreSQL", "MongoDB", "Supabase", "Firebase"]
```

**DevOps**
```json
["Docker", "Kubernetes", "AWS", "Vercel", "GitHub Actions", "CI/CD"]
```

**기타**
```json
["GraphQL", "REST API", "Redis", "Elasticsearch", "Sentry", "OpenAI GPT-4"]
```

#### 4.3 명명 규칙 (일관성 유지)
- **✅ 권장**: "React", "TypeScript", "PostgreSQL" (공식 명칭)
- **❌ 비권장**: "react", "TS", "Postgres" (소문자, 약어)

#### 4.4 목록 테이블 표시
- 처음 3개만 Badge로 표시
- 4개 이상일 경우 "+N" Badge 추가 표시
  ```
  [React] [TypeScript] [Supabase] [+3]
  ```

**팁**: 기술 스택은 프로젝트 핵심 기술만 선택하세요. 너무 많으면 가독성이 떨어집니다.

**예시 스크린샷**: [Screenshot: AdminPortfolio - 기술 스택 JSON 입력]

---

### 5. 고객 후기(Testimonial) 추가하기

**목적**: 클라이언트 또는 팀원의 추천사를 추가하여 신뢰도를 높입니다.

#### 5.1 Testimonial JSON 구조
```json
{
  "author": "김철수",
  "role": "CTO",
  "company": "ABC Corp",
  "content": "IDEA on Action 팀은 우리의 MVP를 단 3개월 만에 완성했습니다. 기술력과 커뮤니케이션이 훌륭했고, 투자 유치에 성공할 수 있었습니다.",
  "avatar": "https://example.com/profiles/kimcs.jpg"
}
```

#### 5.2 필드 설명

| 필드 | 타입 | 필수 | 설명 | 예시 |
|------|------|------|------|------|
| `author` | string | ✅ | 추천사 작성자 이름 | "김철수", "John Doe" |
| `role` | string | ✅ | 직책 | "CEO", "Product Manager", "Lead Developer" |
| `company` | string | ❌ | 회사명 (선택) | "ABC Corp", "Startup XYZ" |
| `content` | string | ✅ | 추천사 내용 (최대 2000자) | "프로젝트가 훌륭했습니다..." |
| `avatar` | string | ❌ | 프로필 이미지 URL (선택) | "https://example.com/avatar.jpg" |

#### 5.3 입력 방법
1. 폼의 **Section 3: 도전과제 및 성과** 섹션 열기
2. **Testimonial (JSON 객체)** 필드 찾기
3. 위 JSON 구조를 붙여넣기
4. 각 필드 값 수정

#### 5.4 유효성 검증
- **JSON 문법**: 유효한 JSON 형식이어야 함 (쉼표, 따옴표, 중괄호 확인)
- **author, role, content 필수**: 누락 시 저장은 되나 화면에 표시 안 됨
- **avatar URL**: 유효한 HTTPS URL 또는 빈 문자열 `""`

#### 5.5 빈 Testimonial (추천사 없을 경우)
```json
{}
```
또는 필드를 비워두면 기본값 `{}`로 저장됩니다.

#### 5.6 여러 추천사 (현재 미지원)
- 현재는 프로젝트당 1개 추천사만 지원
- 여러 추천사가 필요한 경우 content에 통합:
  ```json
  {
    "author": "여러 고객",
    "role": "프로젝트 참여자",
    "content": "김철수(CTO, ABC): '훌륭했습니다.'\n홍길동(CEO, XYZ): '매우 만족했습니다.'"
  }
  ```

**예시 스크린샷**: [Screenshot: AdminPortfolio - Testimonial JSON 입력 폼]

---

### 6. 프로젝트 공개/비공개 설정

**목적**: 프로젝트를 공개(Published) 또는 비공개(Draft)로 전환합니다.

#### 6.1 목록 테이블에서 즉시 전환
1. 목록 테이블의 **"공개"** 컬럼에서 스위치 클릭
2. 즉시 상태 변경 (Toast 알림 표시)
3. **공개**: 초록색 "공개" 배지, 사용자에게 표시
4. **비공개**: 회색 "비공개" 배지, 관리자만 표시

#### 6.2 폼에서 설정
1. 폼의 **Section 4: 공개 설정** 열기
2. **Published** 스위치 토글
   - ON: "공개 시 사용자에게 표시됩니다"
   - OFF: "비공개 시 관리자에게만 표시됩니다"
3. 저장 버튼 클릭

#### 6.3 Draft vs Published 비교

| 구분 | Draft (비공개) | Published (공개) |
|------|----------------|------------------|
| 사용자 표시 | ❌ 관리자만 | ✅ 전체 사용자 |
| 포트폴리오 페이지 | 제외 | 포함 |
| 검색 | 불가 | 가능 |
| URL 접근 | 404 에러 | 정상 표시 |
| 배지 색상 | 회색 (Secondary) | 초록색 (bg-green-600) |
| API 응답 | RLS 정책으로 필터링 | SELECT 허용 |

#### 6.4 권장 워크플로우
```
1. 프로젝트 생성 (Draft)
2. 필드 작성 완료
3. 이미지/기술 스택 추가
4. 내부 리뷰
5. Published로 전환
6. 사용자에게 공개
```

**팁**: 프로젝트 작성 중에는 Draft로 두고, 완료 후 Published로 전환하세요. 실수로 미완성 프로젝트가 공개되는 것을 방지할 수 있습니다.

**예시 스크린샷**: [Screenshot: AdminPortfolio - 공개 스위치 토글]

---

### 7. Featured 프로젝트 설정

**목적**: 홈페이지 또는 포트폴리오 페이지 상단에 노출할 주요 프로젝트를 지정합니다.

#### 7.1 Featured 설정 방법
- **방법 1**: 목록 테이블의 **"Featured"** 컬럼 스위치 클릭 (즉시 적용)
- **방법 2**: 폼의 **Section 4: 공개 설정**에서 **Featured 여부** 체크박스 선택

#### 7.2 Featured 프로젝트 특징
- **배지**: 노란색 "Featured" 배지 표시 (bg-yellow-600)
- **우선 순위**: 포트폴리오 페이지 상단 노출
- **권장 개수**: 3~5개 (너무 많으면 희소성 감소)
- **자동 정렬**: Featured 프로젝트가 먼저 표시됨 (일부 뷰)

#### 7.3 Featured 선정 기준 (권장)
- ✅ 회사의 대표 프로젝트
- ✅ 높은 기술 난이도 또는 혁신성
- ✅ 고객 만족도가 높은 프로젝트
- ✅ 최근 완료된 프로젝트
- ❌ 너무 오래된 프로젝트
- ❌ 미완성 또는 Draft 프로젝트

#### 7.4 Featured 해제
- 스위치를 다시 클릭하여 즉시 해제
- Toast 알림: "Featured 해제되었습니다"

#### 7.5 Featured + Published 조합

| Featured | Published | 결과 |
|----------|-----------|------|
| ✅ | ✅ | 공개 + 상단 노출 (권장) |
| ✅ | ❌ | 비공개 (관리자만 Featured 표시) |
| ❌ | ✅ | 공개 + 일반 목록 |
| ❌ | ❌ | 비공개 (Draft) |

**팁**: Featured는 Published와 함께 사용하세요. Featured인데 비공개인 경우 사용자에게 노출되지 않습니다.

**예시 스크린샷**: [Screenshot: AdminPortfolio - Featured 프로젝트 배지]

---

### 8. 프로젝트 삭제하기

**목적**: 불필요한 프로젝트를 삭제합니다.

#### 8.1 삭제 절차
1. 목록 테이블 우측 작업 컬럼에서 **Trash2 아이콘** 클릭 (빨간색)
2. 확인 대화상자 표시
   ```
   포트폴리오 삭제
   정말로 이 포트폴리오 항목을 삭제하시겠습니까?
   이 작업은 되돌릴 수 없습니다.
   ```
3. **"삭제"** 버튼 클릭 (빨간색 버튼, bg-destructive)
4. Toast 알림: "포트폴리오 삭제 완료"
5. 목록에서 즉시 제거

#### 8.2 삭제 시 주의사항
- **되돌릴 수 없음**: 삭제 후 복구 불가능 (DB에서 영구 삭제)
- **관련 데이터**: 프로젝트와 연결된 모든 데이터 삭제
- **URL 깨짐**: 외부 링크된 `/portfolio/:slug` URL이 404 에러 반환
- **검색 인덱스**: 검색 엔진에서 인덱싱된 페이지는 시간이 지나면 자동 제거

#### 8.3 삭제 대신 권장 방법
**Option 1: 비공개(Draft) 전환**
- 삭제 대신 Published를 OFF로 전환
- 사용자에게는 숨겨지지만, 관리자는 계속 접근 가능
- 나중에 다시 공개 가능

**Option 2: 보관(Archived) 상태 추가 (향후 기능)**
- 현재는 미지원
- 향후 `archived` 필드 추가 예정

#### 8.4 삭제 전 체크리스트
- [ ] 정말 이 프로젝트를 삭제해야 하나요?
- [ ] 비공개(Draft)로 전환하는 것이 더 나은 선택 아닌가요?
- [ ] 프로젝트 데이터를 백업했나요? (JSON 내보내기)
- [ ] 외부에서 링크된 URL이 있나요?
- [ ] 클라이언트 또는 팀원에게 알렸나요?

**예시 스크린샷**: [Screenshot: AdminPortfolio - 삭제 확인 대화상자]

---

### 9. 검색 및 필터링

**목적**: 많은 프로젝트 중 원하는 항목을 빠르게 찾습니다.

#### 9.1 검색창 사용
1. 좌측 상단 검색창에 키워드 입력
2. **검색 범위**: 제목(title), 요약(summary)
3. **실시간 필터링**: 타이핑 즉시 반영 (debounce 없음)
4. **대소문자 구분 없음**: "AI" = "ai"

**예시 검색 키워드**:
- "AI" → "AI 챗봇 플랫폼", "AI 이미지 생성기"
- "디자인" → "디자인 시스템 구축", "UI/UX 리디자인"
- "MVP" → 요약에 "MVP" 포함된 모든 프로젝트

#### 9.2 프로젝트 타입 필터
- **드롭다운**: 검색창 오른쪽, "전체 타입" 기본값
- **옵션**:
  - 전체 타입 (all)
  - MVP (파란색 배지)
  - Fullstack (초록색 배지)
  - Design (보라색 배지)
  - Operations (주황색 배지)

**필터 적용 예시**:
```javascript
// 검색: "AI" + 타입: MVP
filteredItems = items.filter(item =>
  (item.title.includes("AI") || item.summary.includes("AI")) &&
  item.projectType === "mvp"
)
```

#### 9.3 상태 필터
- **드롭다운**: 타입 필터 오른쪽, "전체 상태" 기본값
- **옵션**:
  - 전체 상태 (all)
  - 공개 (published=true, 초록색 배지)
  - 비공개 (published=false, 회색 배지)
  - Featured (featured=true, 노란색 배지)

**조합 필터링**:
```
검색: "플랫폼" + 타입: "Fullstack" + 상태: "공개"
→ 제목/요약에 "플랫폼" 포함 + Fullstack + Published 프로젝트만 표시
```

#### 9.4 필터 초기화
- 각 필터 드롭다운에서 **"전체"** 옵션 선택
- 검색창 비우기 (Clear 버튼 없음, 수동 삭제)

#### 9.5 정렬 (현재 미지원)
- 기본 정렬: `created_at DESC` (최근 생성순)
- 테이블 헤더 클릭 정렬: 현재 미지원 (향후 DataTable에서 지원 예정)

**팁**: 복잡한 검색은 브라우저 검색(Ctrl+F)보다 테이블 검색창이 더 빠르고 정확합니다.

**예시 스크린샷**: [Screenshot: AdminPortfolio - 검색 및 필터 UI]

---

## JSON 필드 가이드

AdminPortfolio 페이지는 3개 JSON 필드를 사용합니다. 유효한 JSON 형식이 필수입니다.

### 1. Images (갤러리 이미지)

**형식**: JSON 배열 (`string[]`)

**예시**:
```json
[
  "https://example.com/projects/ai-chatbot/screenshot1.jpg",
  "https://example.com/projects/ai-chatbot/screenshot2.jpg",
  "https://example.com/projects/ai-chatbot/screenshot3.jpg"
]
```

**규칙**:
- 최대 10개 이미지 (폼 검증 없으나 권장)
- 각 URL은 유효한 HTTP(S) URL
- 빈 배열 허용: `[]`
- 따옴표 필수 (JSON 문법)

**에러 예시**:
```json
// ❌ 잘못된 예시 (따옴표 누락)
[https://example.com/img.jpg]

// ❌ 잘못된 예시 (쉼표 누락)
["https://example.com/img1.jpg" "https://example.com/img2.jpg"]

// ❌ 잘못된 예시 (마지막 쉼표)
["https://example.com/img1.jpg", "https://example.com/img2.jpg",]

// ✅ 올바른 예시
["https://example.com/img1.jpg", "https://example.com/img2.jpg"]
```

**JSON 검증 도구**: [JSONLint](https://jsonlint.com/)

---

### 2. Tech Stack (기술 스택)

**형식**: JSON 배열 (`string[]`)

**예시**:
```json
[
  "React",
  "TypeScript",
  "Supabase",
  "Tailwind CSS",
  "Vite",
  "React Query",
  "Zustand"
]
```

**규칙**:
- 최대 20개 기술 (폼 검증 없으나 권장 5-7개)
- 최소 1개 필수 (권장, 검증 없음)
- 대소문자 구분 없음 (권장: PascalCase)
- 중복 허용 (권장하지 않음)

**명명 규칙** (일관성 유지):
| ✅ 권장 | ❌ 비권장 | 이유 |
|---------|-----------|------|
| React | react | 공식 명칭 (대문자 시작) |
| TypeScript | TS, typescript | 약어/소문자 혼용 방지 |
| PostgreSQL | Postgres, postgres | 공식 명칭 |
| Next.js | Nextjs, nextjs | 대소문자 일관성 |
| Tailwind CSS | TailwindCSS, tailwind | 공식 명칭 (공백) |

**팁**: 공통 기술 스택 세트를 복사해두면 재입력 시 편리합니다.

```json
// 프리셋 예시
{
  "mvp": ["React", "TypeScript", "Supabase", "Tailwind CSS"],
  "fullstack": ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS"],
  "design": ["Figma", "Tailwind CSS", "shadcn/ui", "Radix UI"]
}
```

---

### 3. Testimonial (고객 후기)

**형식**: JSON 객체

**예시**:
```json
{
  "author": "김철수",
  "role": "CTO",
  "company": "테크스타트업",
  "content": "3개월 만에 MVP를 완성했고, 투자 유치에 성공했습니다. IDEA on Action 팀의 전문성에 감사드립니다. 기술력뿐 아니라 커뮤니케이션도 훌륭했습니다.",
  "avatar": "https://example.com/profiles/kim.jpg"
}
```

**필드 상세**:
```typescript
interface Testimonial {
  author: string;         // 필수 (실제 검증 없음)
  role: string;           // 필수
  company?: string;       // 선택
  content: string;        // 필수, 최대 2000자 권장
  avatar?: string;        // 선택, HTTPS URL
}
```

**유효성 검증**:
- author, role, content는 필수 (미입력 시 화면 표시 안 됨)
- company, avatar는 선택 (빈 문자열 `""` 허용)
- avatar는 유효한 URL 또는 빈 문자열
- content는 최대 2000자 (권장, 검증 없음)

**빈 Testimonial** (추천사 없을 경우):
```json
{}
```
또는 필드를 비워두면 기본값 `{}`로 저장됩니다.

**특수문자 이스케이프**:
```json
// ❌ 잘못된 예시 (따옴표 이스케이프 누락)
{"content": "He said "hello""}

// ✅ 올바른 예시 (백슬래시 이스케이프)
{"content": "He said \"hello\""}

// ✅ 또는 작은따옴표 사용 (권장)
{"content": "He said 'hello'"}
```

---

## FAQ

### Q1: 이미지 크기 제한은 얼마인가요?
**A**: AdminPortfolio 페이지 자체는 이미지 크기 제한이 없습니다. 다만, Supabase Storage를 사용할 경우 파일당 50MB 제한이 있습니다. 웹 성능을 위해 다음을 권장합니다:
- **썸네일**: 800x600px, 200KB 이하 (JPG, WebP)
- **갤러리**: 1920x1080px, 500KB 이하 (WebP 권장)
- **아바타**: 200x200px, 50KB 이하 (PNG, SVG)

### Q2: Slug를 변경하면 기존 URL이 깨지나요?
**A**: 네, Slug는 URL 경로(`/portfolio/:slug`)에 사용되므로 변경 시 기존 링크가 404 에러를 반환합니다. 가능하면 Slug는 생성 시 신중히 정하고, 변경을 피하세요. 부득이하게 변경할 경우:
- Vercel/Nginx 리다이렉트 규칙 추가 (`old-slug` → `new-slug`)
- 사용자에게 URL 변경 공지
- 외부 링크 업데이트 요청

### Q3: JSON 형식 에러가 발생하면 어떻게 하나요?
**A**: JSON 형식 에러는 주로 다음 이유로 발생합니다:
- **따옴표 누락**: `["React", TypeScript]` → `["React", "TypeScript"]`
- **쉼표 누락/중복**: `["React" "TS"]` → `["React", "TS"]`
- **마지막 쉼표**: `["React", "TS",]` → `["React", "TS"]`
- **중괄호 불일치**: `{"author": "Kim"` → `{"author": "Kim"}`

**해결 방법**:
1. [JSONLint](https://jsonlint.com/)에서 JSON 유효성 검증
2. 에러 메시지 확인 (행/열 번호 표시)
3. 검증 후 붙여넣기

### Q4: Featured 프로젝트는 몇 개까지 설정할 수 있나요?
**A**: 기술적으로는 제한이 없지만, 사용자 경험을 위해 **3~5개**를 권장합니다. Featured가 너무 많으면:
- 일반 프로젝트와 차별성 사라짐
- 상단 섹션이 과도하게 길어짐
- 사용자가 선택 피로감 느낌

권장: 회사 대표 프로젝트 3개만 Featured 설정

### Q5: 프로젝트를 삭제했는데 복구할 수 있나요?
**A**: 아니요, AdminPortfolio는 삭제 시 즉시 DB에서 영구 제거되며 복구가 불가능합니다. 중요한 프로젝트는:
- 삭제 전 JSON 내보내기로 백업
- 삭제 대신 **비공개(Draft)** 상태로 변경
- 정기 DB 백업 (Supabase 자동 백업 활용)

### Q6: 기술 스택을 MultiSelect로 선택할 수 있나요?
**A**: 현재 AdminPortfolio.tsx는 JSON 배열 직접 입력만 지원합니다. PortfolioForm 컴포넌트(`src/components/admin/forms/PortfolioForm.tsx`)는 MultiSelect를 지원하나, AdminPortfolio 페이지는 아직 통합되지 않았습니다. 향후 업데이트 예정입니다.

**임시 해결책**: 기술 스택 프리셋을 복사하여 재사용
```json
// 프리셋 저장 (메모장)
["React", "TypeScript", "Supabase", "Tailwind CSS"]
```

### Q7: 프로젝트 타입은 나중에 변경할 수 있나요?
**A**: 네, 프로젝트 수정 폼에서 언제든지 변경 가능합니다. 타입 변경은 URL이나 데이터에 영향을 주지 않으며, 즉시 반영됩니다.

---

## 관련 파일

### 페이지 컴포넌트
- **AdminPortfolio.tsx** (`src/pages/admin/AdminPortfolio.tsx`)
  - 메인 포트폴리오 관리 페이지
  - DataTable 통합, 검색/필터, CRUD 핸들러
  - 999줄 (React Hook Form + Zod)
  - Helmet 메타태그 포함

### 폼 컴포넌트
- **PortfolioForm.tsx** (`src/components/admin/forms/PortfolioForm.tsx`)
  - 4개 Accordion 섹션 (기본 정보, 미디어, 기술, 타임라인, 상세, 공개 설정)
  - ImageUpload, MultiSelect, DateRangePicker 통합 (현재 AdminPortfolio에서 미사용)
  - 692줄 (Zod 스키마, auto-slug, 17개 필드)

### TypeScript 타입
- **cms.types.ts** (`src/types/cms.types.ts`)
  - `PortfolioItem` 인터페이스
  - `PortfolioStatus` ("draft" | "published")
  - `ProjectType` ("mvp" | "fullstack" | "design" | "operations")

### React Hooks
- **usePortfolioItems.ts** (`src/hooks/usePortfolioItems.ts`)
  - `usePortfolioItems()`: 목록 조회 (React Query)
  - `useCreatePortfolioItem()`: 생성 (useMutation)
  - `useUpdatePortfolioItem()`: 수정 (useMutation)
  - `useDeletePortfolioItem()`: 삭제 (useMutation)

### 유틸리티
- **cms-utils.ts** (`src/lib/cms-utils.ts`)
  - `generateSlug(title: string)`: Slug 자동 생성 (kebab-case)
  - `formatRelativeTime(date: string)`: 상대 시간 포맷팅
  - `truncateText(text: string, maxLength: number)`: 텍스트 자르기

### DB 스키마
- **projects 테이블** (`supabase/migrations/20250110000000_add_projects_table.sql`)
  - 25개 컬럼 (id, title, slug, summary, description, tech_stack, testimonial, ...)
  - RLS 정책:
    - SELECT: public (published=true만)
    - INSERT/UPDATE/DELETE: admin 이상

---

## 주의사항

### 1. 권한 관리
- **Admin 권한 필수**: AdminPortfolio 페이지는 일반 사용자 접근 불가
- **RLS 정책**: Supabase Row Level Security로 보호됨
  - Anonymous: SELECT 불가
  - Authenticated (non-admin): SELECT (published=true만)
  - Admin/Super_admin: 모든 작업 가능
- **비로그인 시**: `/login` 페이지로 리다이렉트

### 2. JSON 필드 주의
- **유효한 JSON 필수**: 형식 오류 시 저장 실패
- **특수문자 이스케이프**: 따옴표, 백슬래시 등 이스케이프 필요
  ```json
  // ❌ 잘못된 예시
  {"content": "He said "hello""}

  // ✅ 올바른 예시
  {"content": "He said \"hello\""}
  ```
- **빈 JSON**: 빈 배열 `[]`, 빈 객체 `{}` 허용
- **검증 도구**: [JSONLint](https://jsonlint.com/) 사용 권장

### 3. 이미지 최적화
- **WebP 형식 권장**: JPG/PNG 대비 30% 작은 용량
- **CDN 사용**: 로딩 속도 향상 (Cloudinary, Supabase Storage)
- **Lazy Loading**: 이미지는 자동으로 lazy load 적용됨
- **Alt 텍스트**: 접근성을 위해 이미지 설명 추가 권장 (현재 미지원)

### 4. Slug 명명 규칙
- **소문자 + 하이픈**: `my-awesome-project` (✅)
- **카멜케이스 금지**: `myAwesomeProject` (❌)
- **공백 금지**: `my project` (❌)
- **특수문자 금지**: `my_project!` (❌)
- **정규식**: `^[a-z0-9-]+$`

### 5. 기술 스택 일관성
- **대소문자 통일**: "React" vs "react" → "React" 권장
- **약어 피하기**: "TS" → "TypeScript"
- **공식 명칭 사용**: "Postgres" → "PostgreSQL"
- **공백 일관성**: "TailwindCSS" → "Tailwind CSS"

### 6. 성능 고려사항
- **이미지 개수**: 갤러리 10개 초과 시 로딩 느려짐 (권장 5-7개)
- **기술 스택**: 20개 초과 시 UI 복잡해짐 (권장 5-7개)
- **Testimonial 길이**: 2000자 초과 시 레이아웃 깨짐 가능
- **Description 길이**: 5000자 초과 시 스크롤 과도

### 7. 데이터 백업
- **정기 백업**: 중요 프로젝트는 JSON 내보내기로 백업
- **삭제 전 확인**: 복구 불가능하므로 신중히 결정
- **버전 관리**: Git에 DB 마이그레이션 파일 커밋
- **Supabase 백업**: Point-in-time recovery 활용

### 8. 보안
- **XSS 방지**: Markdown은 sanitize 처리됨 (rehype-sanitize)
- **SQL Injection**: Prepared Statements 사용 (Supabase 자동)
- **CSRF**: Supabase 자동 방어 (JWT 토큰)
- **파일 업로드**: Supabase Storage 사용 시 파일 타입 검증 권장

---

**관련 가이드**:
- [AdminLab 가이드](./admin-lab-guide.md) - 바운티 관리
- [AdminTeam 가이드](./admin-team-guide.md) - 팀원 관리
- [API 문서: useProjects](./api/useProjects.md) - React Query 훅

**피드백**: 가이드 개선 제안은 [admin@ideaonaction.ai](mailto:admin@ideaonaction.ai)로 보내주세요.
