# AdminLab 관리 가이드

> **Version**: 2.1.0
> **Last Updated**: 2025-11-21
> **Target Audience**: Admin 사용자
> **Related Pages**: [AdminPortfolio Guide](./admin-portfolio-guide.md) | [API Documentation](./api/useLabItems.md)

---

## 목차
- [개요](#개요)
- [페이지 접근 방법](#페이지-접근-방법)
- [주요 기능](#주요-기능)
- [단계별 가이드](#단계별-가이드)
  - [1. 새 바운티 추가하기](#1-새-바운티-추가하기)
  - [2. 바운티 수정하기](#2-바운티-수정하기)
  - [3. 상태 관리하기](#3-상태-관리하기)
  - [4. GitHub URL 연동하기](#4-github-url-연동하기)
  - [5. 보상금 설정하기](#5-보상금-설정하기)
  - [6. 지원자 관리하기](#6-지원자-관리하기)
  - [7. 바운티 삭제하기](#7-바운티-삭제하기)
  - [8. 검색 및 필터링](#8-검색-및-필터링)
- [바운티 상태 전환 가이드](#바운티-상태-전환-가이드)
- [FAQ](#faq)
- [관련 파일](#관련-파일)
- [주의사항](#주의사항)

---

## 개요

**AdminLab 페이지**는 회사의 실험적 프로젝트와 커뮤니티 바운티를 관리하는 CMS 관리자 전용 페이지입니다. 바운티 생성, 지원자 관리, 상태 추적, GitHub 연동 등 Lab 프로젝트 전반을 관리할 수 있습니다.

### 핵심 기능
- **CRUD 작업**: 바운티 생성(Create), 조회(Read), 수정(Update), 삭제(Delete)
- **상태 관리**: open → in_progress → completed → closed (4단계)
- **난이도 관리**: beginner, intermediate, advanced (3단계)
- **지원자 관리**: 지원자 목록 조회, 수락/거절 (Applicants Modal)
- **GitHub 연동**: GitHub 리포지토리/이슈 URL 연결
- **스킬 관리**: 필요 스킬 JSON 배열 (최대 10개)
- **통계 카드**: 총 바운티, Open, In Progress, Completed 개수 표시
- **검색/필터**: 제목, 설명, 상태, 난이도, 공개 여부로 필터링

### 사용자 권한
- **필요 권한**: `admin` 또는 `super_admin`
- **접근 제한**: 관리자 로그인 필수 (비로그인 시 `/login` 리다이렉트)
- **RLS 정책**: Supabase Row Level Security로 보호

---

## 페이지 접근 방법

### 1. 직접 URL 접근
```
https://www.ideaonaction.ai/admin/lab
```

### 2. 관리자 사이드바 메뉴
1. 관리자 대시보드(`/admin/dashboard`) 로그인
2. 좌측 사이드바에서 **"Lab"** 클릭

### 3. 네비게이션 경로
```
Home → Admin → Dashboard → Lab
```

---

## 주요 기능

### 1. 통계 카드 (Statistics Cards)
페이지 상단에 4개 통계 카드가 표시됩니다:
- **Total Bounties**: 전체 바운티 개수
- **Open**: 오픈된 바운티 (초록색, 지원 가능)
- **In Progress**: 진행 중인 바운티 (파란색, 작업 중)
- **Completed**: 완료된 바운티 (회색, 종료됨)

### 2. 바운티 목록 테이블 (DataTable)
- **8개 컬럼**: Title, Status, Difficulty, Reward, Skills, Applicants, Published, Created
- **상태 배지**:
  - Open (초록색, bg-green-500)
  - In Progress (파란색, bg-blue-500)
  - Completed (회색, bg-gray-500)
  - Closed (빨간색, bg-red-500)
- **난이도 배지**:
  - Beginner (초록색)
  - Intermediate (노란색)
  - Advanced (빨간색)
- **지원자 버튼**: Users 아이콘 + 숫자 (클릭 시 지원자 모달)
- **작업 버튼**: 수정(Edit), 삭제(Delete)

### 3. 검색 및 필터
- **검색창**: 제목(title), 설명(description) 실시간 검색
- **상태 필터**: All Status, Open, In Progress, Completed, Closed
- **난이도 필터**: All Difficulty, Beginner, Intermediate, Advanced
- **공개 필터**: All, Published, Draft

### 4. 바운티 폼 (LabForm, 4개 Accordion 섹션)
#### Section 1: Basic Information (4개 필드)
- Title (제목, 최소 3자)
- Slug (kebab-case, 자동 생성)
- Status (open/in_progress/completed/closed)
- Description (설명, 최소 50자, Markdown 지원)

#### Section 2: Bounty Details (4개 필드)
- Difficulty (beginner/intermediate/advanced)
- Reward (보상금, 최대 200자)
- Skills Required (JSON 배열, 최소 1개, 최대 10개)
- GitHub URL (선택)

#### Section 3: Contributors & Tags (2개 필드)
- Contributors (자동 관리, 수락된 지원자)
- Tags (JSON 배열, 최소 1개, 최대 10개)

#### Section 4: Visibility (1개 필드)
- Published (공개 여부, 스위치)

---

## 단계별 가이드

### 1. 새 바운티 추가하기

**목적**: 신규 커뮤니티 바운티를 생성합니다.

#### 1.1 폼 열기
1. 우측 상단 **"+ New Bounty"** 버튼 클릭
2. 모달 다이얼로그 팝업 표시 (크기: lg)

#### 1.2 필수 필드 입력 ⭐
- **Title** * (최소 3자, 최대 100자)
  - 예시: "AI 챗봇 프롬프트 최적화 실험"
  - 팁: 명확하고 구체적인 작업 설명

- **Slug** * (kebab-case)
  - 형식: 소문자, 숫자, 하이픈만 (`^[a-z0-9-]+$`)
  - 예시: `ai-chatbot-prompt-optimization`
  - 자동 생성: Title 입력 후 blur 시 자동 생성
  - 수동 재생성: "Generate" 버튼 클릭

- **Status** * (4가지 중 선택)
  - **Open**: 지원 가능 (기본값, 초록색)
  - **In Progress**: 작업 진행 중 (파란색)
  - **Completed**: 작업 완료 (회색)
  - **Closed**: 마감 (빨간색)

- **Description** * (최소 50자, 최대 5000자)
  - Markdown 지원
  - 예시:
    ```markdown
    # 바운티 개요
    AI 챗봇의 프롬프트를 최적화하여 응답 품질을 향상시킵니다.

    ## 목표
    - 사용자 만족도 10% 상승
    - 응답 정확도 20% 개선

    ## 요구사항
    - GPT-4 API 경험
    - 프롬프트 엔지니어링 지식
    ```

#### 1.3 바운티 상세 입력
- **Difficulty** * (난이도)
  - **Beginner**: 초보자 가능 (초록색)
  - **Intermediate**: 중급자 (노란색)
  - **Advanced**: 고급자 (빨간색)

- **Reward** (보상금, 최대 200자)
  - 예시: "$500", "10% equity", "Open source contribution credit"
  - 팁: 명확한 보상 조건 명시

- **Skills Required** * (JSON 배열, 최소 1개, 최대 10개)
  ```json
  ["React", "TypeScript", "OpenAI API", "Prompt Engineering"]
  ```

- **GitHub URL** (선택)
  - 예시: `https://github.com/IDEA-on-Action/project/issues/123`
  - 팁: GitHub 이슈 또는 리포지토리 연결

#### 1.4 태그 및 공개 설정
- **Tags** * (JSON 배열, 최소 1개, 최대 10개)
  ```json
  ["bounty", "experiment", "aiml", "frontend"]
  ```

- **Published** (공개 여부)
  - ON: 일반 사용자에게 표시
  - OFF: 관리자만 표시 (Draft)

#### 1.5 저장
1. **"Create"** 버튼 클릭
2. 성공 Toast: "Lab bounty created successfully"
3. 폼 자동 닫힘, 목록 새로고침

**예시 스크린샷**: [Screenshot: AdminLab - 새 바운티 폼]

---

### 2. 바운티 수정하기

**목적**: 기존 바운티 정보를 수정합니다.

#### 2.1 수정 폼 열기
- **방법 1**: 목록 테이블에서 제목 클릭 (Edit 모드)
- **방법 2**: 우측 작업 컬럼에서 Edit 버튼 클릭

#### 2.2 필드 수정
- 기존 데이터가 자동으로 채워져 있음
- 원하는 필드 수정 (모든 필드 수정 가능)
- JSON 필드는 유효한 JSON 형식 유지 필수

#### 2.3 저장
1. **"Update"** 버튼 클릭
2. 성공 Toast: "Lab bounty updated successfully"
3. 폼 닫힘, 목록 새로고침

**주의**: Slug 변경 시 기존 URL (`/lab/:slug`)이 깨질 수 있으므로 신중히 변경하세요.

---

### 3. 상태 관리하기

**목적**: 바운티 진행 상황을 추적합니다.

#### 3.1 바운티 상태 4단계
1. **Open** (오픈) - 초록색
   - 지원 가능 상태
   - 사용자가 지원 신청 가능
   - 지원자 수 표시

2. **In Progress** (진행 중) - 파란색
   - 지원자 수락 후 작업 진행 중
   - Contributors 자동 추가
   - 진행 상황 업데이트

3. **Completed** (완료) - 회색
   - 작업 완료, 보상 지급 완료
   - 더 이상 지원 불가
   - 완료 날짜 기록

4. **Closed** (마감) - 빨간색
   - 바운티 취소 또는 만료
   - 지원 불가, 작업 중단

#### 3.2 상태 전환 방법
1. 바운티 수정 폼 열기
2. **Status** 드롭다운에서 변경할 상태 선택
3. 저장 버튼 클릭

#### 3.3 권장 워크플로우
```
1. Open (바운티 생성)
   ↓ 지원자 수락
2. In Progress (작업 시작)
   ↓ 작업 완료 및 리뷰
3. Completed (보상 지급)
또는
4. Closed (취소/만료)
```

**예시 스크린샷**: [Screenshot: AdminLab - 상태 배지]

---

### 4. GitHub URL 연동하기

**목적**: 바운티를 GitHub 이슈 또는 리포지토리와 연동합니다.

#### 4.1 GitHub URL 형식
- **GitHub Issue**: `https://github.com/owner/repo/issues/123`
- **GitHub Repository**: `https://github.com/owner/repo`
- **GitHub Pull Request**: `https://github.com/owner/repo/pull/456`

#### 4.2 연동 방법
1. 바운티 수정 폼 열기
2. **Section 2: Bounty Details** → **GitHub Repository URL** 필드
3. GitHub URL 붙여넣기
4. 저장 버튼 클릭

#### 4.3 GitHub URL 표시
- 목록 테이블의 **"GitHub"** 컬럼에 링크 아이콘 표시
- URL 없을 경우 "-" 표시
- 클릭 시 새 탭에서 GitHub 페이지 열림

#### 4.4 GitHub 연동 이점
- ✅ 코드 리뷰 및 토론 가능
- ✅ Pull Request 연결로 작업 추적
- ✅ GitHub Actions 자동화 가능
- ✅ 커뮤니티 투명성 향상

**예시 스크린샷**: [Screenshot: AdminLab - GitHub URL 입력]

---

### 5. 보상금 설정하기

**목적**: 바운티 완료 시 지급할 보상을 명시합니다.

#### 5.1 보상금 유형
- **금전적 보상**: "$500", "₩50만원", "€300"
- **지분 보상**: "10% equity", "Stock options"
- **비금전적 보상**: "Open source credit", "Portfolio project", "Mentorship"

#### 5.2 보상금 설정 방법
1. 바운티 폼의 **Section 2: Bounty Details** → **Reward** 필드
2. 최대 200자 이내로 보상 내용 입력
3. 보상 조건 명시 (예: "작업 완료 및 리뷰 통과 시")

#### 5.3 보상금 예시
```
✅ 명확한 예시:
- "$500 (작업 완료 시 즉시 지급)"
- "₩50만원 + 10% 지분 (6개월 베스팅)"
- "Open source contribution credit + Resume 추천서"

❌ 모호한 예시:
- "적절한 보상"
- "협의 후 결정"
- "TBD"
```

#### 5.4 보상금 변경
- 바운티 진행 중에도 수정 가능
- 변경 시 지원자에게 알림 권장 (수동)
- 이미 수락된 지원자와는 재협상 필요

**팁**: 보상금은 구체적이고 명확하게 작성하세요. 모호한 보상은 지원자 감소로 이어집니다.

**예시 스크린샷**: [Screenshot: AdminLab - 보상금 입력]

---

### 6. 지원자 관리하기

**목적**: 바운티 지원자를 조회하고 수락/거절합니다.

#### 6.1 지원자 모달 열기
1. 목록 테이블의 **"Applicants"** 컬럼에서 Users 아이콘 + 숫자 클릭
2. 지원자 목록 모달 팝업 표시

#### 6.2 지원자 정보 확인
각 지원자 카드에 다음 정보가 표시됩니다:
- **이름 (Name)**: 지원자 이름
- **User ID**: Supabase 사용자 ID
- **Applied**: 지원 시간 (상대 시간 표시, 예: "2 hours ago")
- **Message**: 지원 메시지 (있을 경우)
- **Status**: pending (대기 중), accepted (수락), rejected (거절)

#### 6.3 지원자 수락
1. 지원자 카드에서 **"Accept"** 버튼 클릭 (초록색)
2. 상태가 "accepted"로 변경 (초록색 배지)
3. Contributors 배열에 자동 추가 (user_id)
4. Toast 알림: "Applicant accepted"
5. 모달 자동 닫힘, 목록 새로고침

#### 6.4 지원자 거절
1. 지원자 카드에서 **"Reject"** 버튼 클릭 (빨간색)
2. 상태가 "rejected"로 변경 (빨간색 배지)
3. Toast 알림: "Applicant rejected"
4. 모달 자동 닫힘, 목록 새로고침

#### 6.5 Applicants 데이터 구조 (JSONB)
```typescript
interface Applicant {
  user_id: string;         // Supabase 사용자 ID
  name: string;            // 지원자 이름
  applied_at: string;      // ISO 8601 날짜
  message?: string;        // 지원 메시지 (선택)
  status: 'pending' | 'accepted' | 'rejected';
}
```

**예시**:
```json
[
  {
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "홍길동",
    "applied_at": "2025-11-21T10:30:00Z",
    "message": "3년 경력의 프롬프트 엔지니어입니다. 관련 프로젝트 경험이 있습니다.",
    "status": "pending"
  }
]
```

#### 6.6 Contributors 자동 관리
- 지원자를 수락하면 Contributors 배열에 자동 추가
- Contributors 필드에는 user_id 배열 저장
  ```json
  ["123e4567-e89b-12d3-a456-426614174000", "789e0123-e45b-67c8-d901-234567890123"]
  ```
- 폼의 **Section 3: Contributors & Tags**에서 Contributors 표시 (읽기 전용)

**예시 스크린샷**: [Screenshot: AdminLab - 지원자 모달]

---

### 7. 바운티 삭제하기

**목적**: 불필요한 바운티를 삭제합니다.

#### 7.1 삭제 절차
1. 목록 테이블 우측 작업 컬럼에서 **Delete 버튼** 클릭
2. 확인 대화상자 표시 (브라우저 기본 confirm)
   ```
   Are you sure you want to delete this bounty?
   ```
3. **"확인"** 버튼 클릭
4. Toast 알림: "Bounty deleted successfully"
5. 목록에서 즉시 제거

#### 7.2 삭제 시 주의사항
- **되돌릴 수 없음**: 삭제 후 복구 불가능 (DB에서 영구 삭제)
- **지원자 데이터 손실**: 지원자 정보도 함께 삭제됨
- **URL 깨짐**: 외부 링크된 `/lab/:slug` URL이 404 에러 반환

#### 7.3 삭제 대신 권장 방법
**Option 1: Closed 상태로 전환**
- 삭제 대신 Status를 "Closed"로 변경
- 사용자에게는 마감으로 표시
- 관리자는 계속 조회 가능
- 나중에 다시 Open 가능

**Option 2: 비공개(Draft) 전환**
- Published를 OFF로 전환
- 사용자에게는 숨겨짐
- 관리자는 계속 접근 가능

#### 7.4 삭제 전 체크리스트
- [ ] 정말 이 바운티를 삭제해야 하나요?
- [ ] Closed 상태로 전환하는 것이 더 나은 선택 아닌가요?
- [ ] 지원자 데이터를 백업했나요?
- [ ] 외부에서 링크된 URL이 있나요?
- [ ] 팀원에게 알렸나요?

**예시 스크린샷**: [Screenshot: AdminLab - 삭제 확인 대화상자]

---

### 8. 검색 및 필터링

**목적**: 많은 바운티 중 원하는 항목을 빠르게 찾습니다.

#### 8.1 검색창 사용
1. 좌측 상단 검색창에 키워드 입력
2. **검색 범위**: 제목(title), 설명(description)
3. **실시간 필터링**: 타이핑 즉시 반영
4. **대소문자 구분 없음**: "AI" = "ai"

**예시 검색 키워드**:
- "AI" → "AI 챗봇", "AI 이미지 생성"
- "실험" → "프롬프트 실험", "성능 실험"
- "바운티" → 제목에 "바운티" 포함된 모든 항목

#### 8.2 상태 필터
- **드롭다운**: 검색창 오른쪽
- **옵션**:
  - All Status (기본값)
  - Open (초록색)
  - In Progress (파란색)
  - Completed (회색)
  - Closed (빨간색)

#### 8.3 난이도 필터
- **드롭다운**: 상태 필터 오른쪽
- **옵션**:
  - All Difficulty (기본값)
  - Beginner (초록색)
  - Intermediate (노란색)
  - Advanced (빨간색)

#### 8.4 공개 필터
- **드롭다운**: 난이도 필터 오른쪽
- **옵션**:
  - All (기본값)
  - Published (공개)
  - Draft (비공개)

#### 8.5 조합 필터링
```
검색: "AI" + 상태: "Open" + 난이도: "Beginner" + 공개: "Published"
→ 제목/설명에 "AI" 포함 + Open + Beginner + Published 바운티만 표시
```

#### 8.6 필터 초기화
- 각 필터 드롭다운에서 **"All"** 옵션 선택
- 검색창 비우기 (수동 삭제)

**팁**: 복잡한 검색은 브라우저 검색(Ctrl+F)보다 테이블 검색창이 더 빠르고 정확합니다.

**예시 스크린샷**: [Screenshot: AdminLab - 검색 및 필터 UI]

---

## 바운티 상태 전환 가이드

### 상태 다이어그램
```
┌──────────────────────────────────────┐
│            Open (초록)                │
│        지원 가능 상태                  │
└──────────┬───────────────────────────┘
           │ 지원자 수락
           ▼
┌──────────────────────────────────────┐
│       In Progress (파란)              │
│        작업 진행 중                    │
└──────────┬───────────┬────────────────┘
           │           │ 취소/만료
           │           ▼
           │      ┌────────────┐
           │      │   Closed   │
           │      │  (빨간색)   │
           │      └────────────┘
           │ 작업 완료
           ▼
┌──────────────────────────────────────┐
│        Completed (회색)               │
│      보상 지급 완료                    │
└──────────────────────────────────────┘
```

### 상태별 작업 가능 여부

| 작업 | Open | In Progress | Completed | Closed |
|------|------|-------------|-----------|--------|
| 지원 신청 | ✅ | ❌ | ❌ | ❌ |
| 지원자 수락 | ✅ | ✅ | ❌ | ❌ |
| 작업 진행 | ❌ | ✅ | ❌ | ❌ |
| 보상 지급 | ❌ | ❌ | ✅ | ❌ |
| 바운티 수정 | ✅ | ✅ | ✅ | ✅ |
| 바운티 삭제 | ✅ | ✅ | ✅ | ✅ |

### 상태 전환 규칙 (권장)

**Open → In Progress**
- 조건: 지원자 수락 1명 이상
- 작업: Contributors 추가, 작업 시작 알림

**In Progress → Completed**
- 조건: 작업 완료, 리뷰 통과, 보상 지급 완료
- 작업: 완료 날짜 기록, 포트폴리오 추가

**Open/In Progress → Closed**
- 조건: 바운티 취소, 만료, 예산 부족
- 작업: 지원자 알림, 사유 기록

---

## FAQ

### Q1: 바운티 상태 의미는 무엇인가요?
**A**: 바운티 상태는 4단계로 구성됩니다:
- **Open**: 지원 가능 상태 (초록색)
- **In Progress**: 지원자 수락 후 작업 진행 중 (파란색)
- **Completed**: 작업 완료, 보상 지급 완료 (회색)
- **Closed**: 바운티 취소 또는 만료 (빨간색)

### Q2: GitHub 연동 방법은 무엇인가요?
**A**: 바운티 폼의 **Section 2: Bounty Details** → **GitHub Repository URL** 필드에 GitHub 이슈 또는 리포지토리 URL을 입력하세요. 예시:
```
https://github.com/IDEA-on-Action/project/issues/123
```
저장 후 목록 테이블에 GitHub 링크 아이콘이 표시됩니다.

### Q3: 지원자는 어떻게 추가되나요?
**A**: 지원자는 사용자가 Lab 페이지에서 "Apply" 버튼을 클릭하면 자동으로 `applicants` JSONB 배열에 추가됩니다. 관리자는 지원자 모달에서 수락/거절할 수 있습니다.

### Q4: Contributors와 Applicants의 차이는 무엇인가요?
**A**:
- **Applicants**: 지원자 전체 목록 (pending, accepted, rejected 포함)
- **Contributors**: 수락된 지원자만 (accepted 상태, user_id 배열)

수락 시 자동으로 Contributors에 추가됩니다.

### Q5: 여러 지원자를 동시에 수락할 수 있나요?
**A**: 네, 가능합니다. 각 지원자의 "Accept" 버튼을 클릭하면 됩니다. 다만, 바운티 성격에 따라 1명만 수락하거나 여러 명을 수락할 수 있습니다.

### Q6: 비공개(Draft) 바운티는 어디에서 볼 수 있나요?
**A**: 비공개 바운티(published=false)는 관리자 페이지에서만 볼 수 있습니다. 일반 사용자 Lab 페이지에는 표시되지 않습니다. Published 필터를 "Draft"로 설정하면 조회 가능합니다.

### Q7: 보상금을 나중에 변경할 수 있나요?
**A**: 네, 바운티 수정 폼에서 언제든지 변경 가능합니다. 다만, 이미 수락된 지원자가 있는 경우 재협상이 필요할 수 있으므로 신중히 변경하세요.

---

## 관련 파일

### 페이지 컴포넌트
- **AdminLab.tsx** (`src/pages/admin/AdminLab.tsx`)
  - 메인 Lab 관리 페이지
  - DataTable 통합, 통계 카드, 지원자 모달
  - 528줄 (React, useCRUD 훅)

### 폼 컴포넌트
- **LabForm.tsx** (`src/components/admin/forms/LabForm.tsx`)
  - 4개 Accordion 섹션 (기본 정보, 바운티 상세, 메타, 공개 설정)
  - MultiSelect 통합 (Skills, Tags)
  - 512줄 (Zod 스키마, auto-slug, 11개 필드)

### TypeScript 타입
- **cms-lab.types.ts** (`src/types/cms-lab.types.ts`)
  - `CMSLabItem` 인터페이스
  - `LabStatus` ("open" | "in_progress" | "completed" | "closed")
  - `LabDifficulty` ("beginner" | "intermediate" | "advanced")
  - `LabApplicant` 인터페이스

### React Hooks
- **useCRUD.ts** (`src/hooks/useCRUD.ts`)
  - 제네릭 CRUD 훅 (Create, Read, Update, Delete)
  - React Query 기반
  - Supabase 통합

### 유틸리티
- **cms-utils.ts** (`src/lib/cms-utils.ts`)
  - `generateSlug(title: string)`: Slug 자동 생성
  - `formatRelativeTime(date: string)`: 상대 시간 포맷팅

### DB 스키마
- **cms_lab_items 테이블** (`supabase/migrations/...`)
  - 15개+ 컬럼 (id, title, slug, description, status, difficulty, reward, ...)
  - JSONB 필드: applicants, skills_required, contributors, tags
  - RLS 정책:
    - SELECT: public (is_published=true만)
    - INSERT/UPDATE/DELETE: admin 이상

---

## 주의사항

### 1. 권한 관리
- **Admin 권한 필수**: AdminLab 페이지는 일반 사용자 접근 불가
- **RLS 정책**: Supabase Row Level Security로 보호
  - Anonymous: SELECT 불가
  - Authenticated (non-admin): SELECT (is_published=true만)
  - Admin/Super_admin: 모든 작업 가능
- **비로그인 시**: `/login` 페이지로 리다이렉트

### 2. JSON 필드 주의
- **유효한 JSON 필수**: 형식 오류 시 저장 실패
- **Skills Required, Tags**: JSON 배열 형식
  ```json
  ["React", "TypeScript", "OpenAI API"]
  ```
- **Applicants**: JSONB 배열, 자동 관리 (사용자 지원 시)
- **Contributors**: string[] 배열, 자동 관리 (지원자 수락 시)

### 3. Slug 명명 규칙
- **소문자 + 하이픈**: `ai-chatbot-experiment` (✅)
- **카멜케이스 금지**: `aiChatbotExperiment` (❌)
- **공백 금지**: `ai chatbot` (❌)
- **특수문자 금지**: `ai_chatbot!` (❌)
- **정규식**: `^[a-z0-9-]+$`

### 4. 지원자 데이터 보안
- **PII 보호**: 지원자 이메일, 전화번호 등 민감 정보 저장 금지
- **User ID 사용**: Supabase user_id로 식별
- **RLS 정책**: 지원자는 자신의 지원 내역만 조회 가능

### 5. 성능 고려사항
- **Applicants 개수**: 100명 초과 시 모달 로딩 느려짐 (페이지네이션 권장)
- **Skills 개수**: 10개 초과 시 UI 복잡해짐 (권장 3-5개)
- **Tags 개수**: 10개 초과 시 검색 성능 저하 (권장 3-5개)

### 6. 데이터 백업
- **정기 백업**: 중요 바운티는 JSON 내보내기로 백업
- **삭제 전 확인**: 복구 불가능하므로 신중히 결정
- **Supabase 백업**: Point-in-time recovery 활용

### 7. 보안
- **XSS 방지**: Markdown은 sanitize 처리됨 (rehype-sanitize)
- **SQL Injection**: Prepared Statements 사용 (Supabase 자동)
- **CSRF**: Supabase 자동 방어 (JWT 토큰)

---

**관련 가이드**:
- [AdminPortfolio 가이드](./admin-portfolio-guide.md) - 프로젝트 관리
- [AdminTeam 가이드](./admin-team-guide.md) - 팀원 관리
- [API 문서: useLabItems](./api/useLabItems.md) - React Query 훅

**피드백**: 가이드 개선 제안은 [admin@ideaonaction.ai](mailto:admin@ideaonaction.ai)로 보내주세요.
