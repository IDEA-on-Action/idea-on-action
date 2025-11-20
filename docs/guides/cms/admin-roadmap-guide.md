# AdminRoadmap 관리 가이드

## 개요

### 목적
AdminRoadmap 페이지는 회사의 분기별 로드맵을 관리하는 관리자 전용 페이지입니다. 프로젝트의 주요 단계(Phase), 목표, 진행률, 마일스톤, KPI 등을 한눈에 관리할 수 있습니다. 이 페이지를 통해 공개 로드맵에 표시될 데이터를 최종적으로 제어합니다.

### 주요 기능
- 로드맵 항목(Phase) 목록 조회 및 통계 카드
- 로드맵 검색 및 필터링 (분기, 위험도)
- 로드맵 항목 생성, 수정, 삭제
- 동적 마일스톤 관리 (추가/삭제)
- 동적 KPI 관리 (추가/삭제)
- 진행률 슬라이더를 통한 실시간 진행 상태 업데이트
- 발행(Published) 상태 관리

### 접근 권한
- **필요 권한**: Admin 이상 (editor, admin, super_admin)
- **접근 경로**: `/admin/roadmap`

---

## 화면 구성

### 목록 화면 레이아웃

#### 상단 헤더
- **페이지 제목**: "Roadmap Management"
- **부제**: "Manage quarterly roadmap items with milestones and KPIs"
- **"New Roadmap Item" 버튼**: 우측 상단, 새 로드맵 항목 추가

#### 통계 카드 (Statistics Cards)
4개의 통계 카드가 그리드로 표시됩니다:

| 카드 | 설명 | 아이콘 |
|------|------|--------|
| **Total Phases** | 전체 로드맵 항목 개수 | Calendar |
| **In Progress** | 진행 중인 항목 (0% < progress < 100%) | TrendingUp |
| **Completed** | 완료된 항목 (progress = 100%) | Target |
| **Avg Progress** | 모든 항목의 평균 진행률 (%) | TrendingUp |

#### 필터 및 검색
- **검색창**: 테마 또는 목표로 검색 (대소문자 구분 없음)
- **분기 필터**: "All Quarters", Q1, Q2, Q3, Q4 등
- **위험도 필터**: "All Risk Levels", Low, Medium, High

#### 데이터 테이블
| 컬럼 | 설명 |
|------|------|
| **Theme** | 로드맵 테마 (주요 제목) |
| | 목표 (Goal)를 회색 텍스트로 표시 |
| **Quarter** | 분기 뱃지 (Q1, Q2 등) |
| **Progress** | 진행률 바 + 퍼센트 표시 |
| **Risk** | 위험도 뱃지 (Low 🟢, Medium 🟡, High 🔴) |
| **Milestones** | 완료된 마일스톤 / 전체 마일스톤 (예: 3/5) |
| **Published** | 발행 상태 (Published 또는 Draft) |
| **Created** | 생성 날짜 (한국어 형식, 예: 2025년 1월 1일) |
| **Actions** | 수정(연필), 삭제(휴지통) 버튼 |

---

## 기능 사용법

### 1. 조회

#### 목록 조회
1. `/admin/roadmap` 페이지에 접속합니다.
2. 등록된 모든 로드맵 항목이 테이블로 표시됩니다.
3. 상단 통계 카드에서 전체 현황을 한눈에 파악할 수 있습니다.

#### 검색
1. 상단 검색창에 로드맵 테마 또는 목표의 일부를 입력합니다.
2. 입력과 동시에 실시간으로 필터링됩니다.
3. 검색어는 대소문자 구분 없이 동작합니다.
4. 예시:
   - "Community" 입력 시 테마에 "Community"가 포함된 항목만 표시
   - "안정성" 입력 시 목표에 "안정성"이 포함된 항목만 표시

#### 필터링

**분기 필터**:
- "All Quarters": 모든 분기 표시
- "Q1", "Q2", "Q3", "Q4": 해당 분기만 표시
- 동적으로 기존 데이터의 분기가 자동 표시됨

**위험도 필터**:
- "All Risk Levels": 모든 위험도 표시
- "Low": 낮은 위험도만 표시 (🟢)
- "Medium": 중간 위험도만 표시 (🟡)
- "High": 높은 위험도만 표시 (🔴)

#### 통계 활용
- **Total Phases**: 현재 필터 조건에 맞는 전체 항목 수
- **In Progress**: 50% 진행 중인 항목의 개수 (progress > 0 && progress < 100)
- **Completed**: 완료된 항목의 개수 (progress = 100)
- **Avg Progress**: 필터된 항목들의 평균 진행률

---

### 2. 생성

#### 필수 입력 항목
- **Quarter** (필수): 분기 (예: Q1 2025, Q2, 2025년 2분기)
- **Theme** (필수): 로드맵 테마/제목 (최대 200자)
- **Goal** (필수): 분기의 목표 (최대 1000자)
- **Progress** (필수): 초기 진행률 (0-100%, 기본값 0)
- **Risk Level** (필수): 위험도 (Low/Medium/High, 기본값 Low)
- **Start Date** (필수): 로드맵 시작일 (YYYY-MM-DD 형식)
- **End Date** (필수): 로드맵 종료일 (YYYY-MM-DD 형식)

#### 선택 입력 항목
- **Owner**: 담당자 또는 팀 (최대 100자)
- **Milestones**: 마일스톤 목록 (동적 추가/삭제)
- **KPIs**: KPI 목록 (동적 추가/삭제)
- **Published**: 발행 여부 (기본값: false/Draft)

#### 단계별 가이드 - Phase 추가하기

**1단계: 모달 열기**
- "New Roadmap Item" 버튼을 클릭합니다.
- 생성 모달이 열립니다.

**2단계: 기본 정보 입력**
- "Basic Information" 아코디언을 엽니다 (기본 열림).
- **Quarter**: "Q1 2025" 또는 "2025년 1분기" 등 입력
- **Theme**: "Community & Open Metrics" 같은 테마 입력
  - 문자 카운터: 현재 입력 / 200
- **Goal**: 분기의 구체적인 목표 입력
  - 텍스트 영역, 최대 1000자
  - 문자 카운터: 현재 입력 / 1000

**3단계: 진행률 및 상태 설정**
- "Progress & Status" 아코디언을 엽니다.
- **Progress 슬라이더**:
  - 0~100% 범위의 슬라이더
  - 실시간으로 퍼센트 값이 표시됨
  - 드래그하여 값 조정 (또는 숫자 클릭)
- **Risk Level**:
  - Low: 위험도 낮음 (기본값)
  - Medium: 위험도 중간
  - High: 위험도 높음
- **Owner** (선택):
  - 담당 팀원 이름 입력 (예: 홍길동, Design Team)
- **Start Date**:
  - 날짜 선택 (YYYY-MM-DD 형식)
  - 달력 팝업 사용 가능
- **End Date**:
  - 날짜 선택
  - End Date >= Start Date 검증 필수

**4단계: 마일스톤 추가** (선택)
- "Milestones" 아코디언을 엽니다.
- 아코디언 제목에 추가된 마일스톤 개수가 표시됨 "Milestones (3)"
- 각 마일스톤 입력:

  **마일스톤 구조**:
  ```
  ID: 고유 식별자 (m1, m2, milestone_1 등)
  Title: 마일스톤 제목 (Phase 1 Completion)
  Description: 마일스톤 설명 (더 자세한 설명)
  Due Date: 마감일 (YYYY-MM-DD)
  Completed: 완료 여부 (체크박스)
  ```

  **추가 방법**:
  1. "Add Milestone" 버튼을 클릭합니다.
  2. 새 마일스톤 박스가 하단에 추가됩니다.
  3. "Milestone #1", "Milestone #2" 순서로 표시됩니다.
  4. ID, Title, Description, Due Date를 입력합니다.
  5. Completed 체크박스로 완료 상태 설정합니다.
  6. 삭제하려면 마일스톤 우측의 X 버튼을 클릭합니다.

  **예시**:
  ```
  Milestone #1
  ID: m1
  Title: Phase 1 Completion
  Description: Core infrastructure setup and testing
  Due Date: 2025-03-31
  Completed: unchecked

  Milestone #2
  ID: m2
  Title: Phase 2 Launch
  Description: Public beta launch and user feedback
  Due Date: 2025-06-30
  Completed: unchecked
  ```

**5단계: KPI 추가** (선택)
- "KPIs" 아코디언을 엽니다.
- 각 KPI 입력:

  **KPI 구조**:
  ```
  Metric: 지표 이름 (Projects Completed, Users Acquired)
  Target: 목표값 (숫자, 소수점 가능)
  Current: 현재값 (숫자, 소수점 가능)
  Unit: 단위 (projects, users, %, 개, 명 등)
  ```

  **추가 방법**:
  1. "Add KPI" 버튼을 클릭합니다.
  2. 새 KPI 박스가 하단에 추가됩니다.
  3. Metric, Target, Current, Unit을 입력합니다.
  4. 삭제하려면 KPI 우측의 X 버튼을 클릭합니다.

  **예시**:
  ```
  KPI #1
  Metric: Projects Completed
  Target: 10
  Current: 5
  Unit: projects

  KPI #2
  Metric: User Satisfaction
  Target: 4.5
  Current: 4.2
  Unit: /5.0
  ```

**6단계: 발행 설정**
- "Visibility" 아코디언을 엽니다.
- **Published 토글**:
  - ON: 로드맵이 공개 페이지에 표시됨
  - OFF: Draft 상태로 표시되며 공개되지 않음

**7단계: 저장**
- 모달 하단 "Create" 버튼을 클릭합니다.
- 저장 중: 버튼이 비활성화되고 로딩 스피너 표시
- 저장 완료: "Roadmap item created successfully" 토스트 메시지 표시, 모달 자동 닫힘
- 저장 실패: "Failed to save roadmap item: [에러 메시지]" 토스트 메시지 표시

---

### 3. 수정

#### 수정 가능 항목
- 모든 필드 수정 가능:
  - 기본 정보: Quarter, Theme, Goal
  - 진행 상태: Progress, Risk Level, Owner
  - 날짜: Start Date, End Date
  - 마일스톤 및 KPI: 추가, 수정, 삭제
  - 발행 상태: Published

#### 수정 불가 항목
- ID (자동 생성, UUID)
- Created At (생성일, 자동)
- Updated At (수정일, 자동 업데이트)
- Created By, Updated By (관리자 정보, 자동)

#### 수정 프로세스
1. 테이블에서 수정하려는 로드맵 항목의 "수정" 버튼(연필 아이콘)을 클릭합니다.
2. 편집 모달이 열리고 기존 값이 폼에 채워집니다.
3. 모달 제목이 "Edit Roadmap Item"으로 변경됩니다.
4. 수정하려는 항목의 값을 변경합니다.
5. 마일스톤이나 KPI를 추가/삭제할 수 있습니다.
6. 모달 하단 "Update" 버튼을 클릭합니다.
7. 저장 완료: "Roadmap item updated successfully" 토스트 메시지 표시
8. 저장 실패: 오류 메시지 표시

#### 진행률 빠른 업데이트
- 테이블의 진행률 바를 클릭하면 모달을 열지 않고도 진행률 슬라이더를 빠르게 접근할 수 있습니다 (향후 버전).
- 현재는 "수정" 버튼으로 모달을 열어 Progress 슬라이더를 조정합니다.

---

### 4. 삭제

#### 삭제 조건
- 관리자 권한이 있는 사용자만 삭제 가능
- 삭제된 데이터는 복구할 수 없음
- 로드맵 항목 삭제 시 연관된 마일스톤, KPI 데이터도 함께 삭제됨

#### 삭제 프로세스
1. 테이블에서 삭제하려는 로드맵 항목의 "삭제" 버튼(휴지통 아이콘)을 클릭합니다.
2. 삭제 확인 다이얼로그가 표시됩니다.
   - 제목: "Delete Roadmap Item"
   - 메시지: "Are you sure you want to delete this roadmap item? This action cannot be undone."
3. "Cancel" 버튼으로 삭제 취소 가능합니다.
4. "Delete" 버튼을 클릭하여 삭제를 확정합니다.
5. 삭제 완료: "Roadmap item deleted successfully" 토스트 메시지 표시
6. 삭제 실패: 오류 메시지 표시

---

## 필드 설명

### 필드 상세 가이드

| 필드 | 타입 | 필수 | 최대값 | 설명 |
|------|------|------|--------|------|
| **Quarter** | 문자 | ✓ | - | 분기 정보 (Q1 2025, 2025년 1분기 등) |
| **Theme** | 문자 | ✓ | 200 | 로드맵 테마/제목 (공개 페이지에 표시됨) |
| **Goal** | 텍스트 | ✓ | 1000 | 분기의 구체적인 목표 및 방향 (Markdown 지원) |
| **Progress** | 수치 | ✓ | - | 진행률 (0-100%) |
| **Start Date** | 날짜 | ✓ | - | 로드맵 시작일 (YYYY-MM-DD) |
| **End Date** | 날짜 | ✓ | - | 로드맵 종료일 (YYYY-MM-DD >= Start Date) |
| **Risk Level** | 선택 | ✓ | - | 위험도: low, medium, high |
| **Owner** | 문자 | ✗ | 100 | 담당자 또는 팀 이름 |
| **Milestones** | 배열 | ✗ | - | 마일스톤 목록 (JSONB) |
| **KPIs** | 배열 | ✗ | - | KPI 목록 (JSONB) |
| **Published** | 불린 | ✗ | - | 발행 여부 (true=Published, false=Draft) |

### Milestone 필드

각 마일스톤은 다음 필드를 포함합니다:

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| **id** | 문자 | ✓ | 고유 식별자 (m1, m2, 자동 생성 가능) |
| **title** | 문자 | ✓ | 마일스톤 제목 (Phase 1 Completion 등) |
| **description** | 텍스트 | ✓ | 마일스톤 설명 |
| **due_date** | 날짜 | ✓ | 마감일 (YYYY-MM-DD) |
| **completed** | 불린 | ✓ | 완료 여부 (기본값: false) |

### KPI 필드

각 KPI는 다음 필드를 포함합니다:

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| **metric** | 문자 | ✓ | 지표 이름 (Projects Completed, Users Acquired 등) |
| **target** | 수치 | ✓ | 목표값 (0 초과의 양수) |
| **current** | 수치 | ✓ | 현재값 (0 이상의 수치) |
| **unit** | 문자 | ✓ | 단위 (projects, users, %, 개, 명, /5.0 등) |

---

## Milestones 가이드

### Milestone이란?
Milestone은 로드맵 내에서 달성해야 할 주요 목표지점입니다. 각 마일스톤은 일정 기한을 가지며, 완료 여부를 추적합니다.

### Milestone 추가하기

1. "Milestones" 아코디언을 엽니다.
2. "Add Milestone" 버튼을 클릭합니다.
3. 새로운 마일스톤 박스가 추가됩니다.
4. 다음 필드를 입력합니다:
   - **ID**: 고유 식별자 (예: m1, milestone_design_complete)
   - **Title**: 마일스톤 제목 (예: Design System Finalization)
   - **Description**: 마일스톤 상세 설명
   - **Due Date**: 완료 기한 (YYYY-MM-DD)
   - **Completed**: 완료 여부 (체크박스)

### Milestone 수정하기

1. "Milestones" 아코디언에서 해당 마일스톤을 찾습니다.
2. 각 필드의 입력값을 수정합니다.
3. Completed 체크박스를 클릭하여 완료 상태를 변경합니다.
4. "Update" 버튼으로 저장합니다.

### Milestone 삭제하기

1. "Milestones" 아코디언에서 해당 마일스톤을 찾습니다.
2. 마일스톤 우측 X 버튼을 클릭합니다.
3. 즉시 삭제됩니다 (확인 다이얼로그 없음).
4. "Update" 버튼으로 저장합니다.

### Milestone 완료 추적

- 테이블의 "Milestones" 컬럼에서 "3/5" 형식으로 표시됩니다.
- 완료된 마일스톤 수 / 전체 마일스톤 수
- Due Date가 지난 미완료 마일스톤은 테이블에서 강조 표시됩니다 (향후 버전).

---

## KPIs 가이드

### KPI란?
KPI(Key Performance Indicator)는 로드맵 달성도를 측정하는 핵심 지표입니다. 목표값과 현재값을 추적하여 진행 상황을 정량적으로 관리합니다.

### KPI 추가하기

1. "KPIs" 아코디언을 엽니다.
2. "Add KPI" 버튼을 클릭합니다.
3. 새로운 KPI 박스가 추가됩니다.
4. 다음 필드를 입력합니다:
   - **Metric**: 지표 이름 (예: Projects Completed)
   - **Target**: 목표값 (예: 10)
   - **Current**: 현재값 (예: 5)
   - **Unit**: 단위 (예: projects)

### KPI 수정하기

1. "KPIs" 아코디언에서 해당 KPI를 찾습니다.
2. Metric, Target, Current, Unit 값을 수정합니다.
3. "Update" 버튼으로 저장합니다.

### KPI 삭제하기

1. "KPIs" 아코디언에서 해당 KPI를 찾습니다.
2. KPI 우측 X 버튼을 클릭합니다.
3. 즉시 삭제됩니다.
4. "Update" 버튼으로 저장합니다.

### KPI 진행률 계산

- 각 KPI의 진행률: (Current / Target) × 100%
- 전체 KPI 평균: 모든 KPI 진행률의 평균값
- 예: Target=10, Current=5 → 50% 진행률

### KPI 단위 선택 가이드

| 지표 유형 | 추천 단위 | 예시 |
|----------|---------|------|
| 프로젝트 | projects, PJTs | 완료된 프로젝트 5개 / 목표 10개 |
| 사용자 | users, 명, 개 | 가입 사용자 500명 / 목표 1000명 |
| 비율 | %, ratio | 달성률 50% |
| 시간 | hours, days | 개발 시간 200시간 / 목표 400시간 |
| 품질 | score, /5.0, /10 | 만족도 4.2 / 5.0 |
| 기술 | tests, bugs, commits | 테스트 292개 / 목표 500개 |

---

## 분기 및 위험도 관리

### 분기(Quarter) 선택 가이드

**표준 분기 형식**:
- Q1 (1월-3월)
- Q2 (4월-6월)
- Q3 (7월-9월)
- Q4 (10월-12월)

**입력 예시**:
- Q1 2025
- 2025년 1분기
- 1분기
- Q2

### 위험도(Risk Level) 선택

**Low (낮음)** 🟢
- 기술적 위험: 검증된 기술만 사용
- 일정 위험: 충분한 버퍼 있음
- 의존성: 최소한의 외부 의존성
- 예: 기존 기능의 개선, 알려진 라이브러리 업그레이드

**Medium (중간)** 🟡
- 기술적 위험: 새로운 기술 도입 필요
- 일정 위험: 적절한 버퍼 필요
- 의존성: 외부 팀과의 협력 필요
- 예: 새로운 UI 컴포넌트 개발, 써드파티 API 통합

**High (높음)** 🔴
- 기술적 위험: 새로운 기술 또는 검증되지 않은 접근법
- 일정 위험: 타이트한 일정, 버퍼 부족
- 의존성: 외부 팀 또는 공급자에게 큰 의존
- 예: 아키텍처 전면 개편, 대규모 마이그레이션

### 필터링 활용

**위험도 필터로 집중 관리**:
- High: 우선적으로 모니터링이 필요한 항목
- Medium: 정기적인 상태 점검
- Low: 안정적인 진행

**분기 필터로 현재 시점 관리**:
- Q1: 1월-3월 진행 과제
- Q2: 4월-6월 진행 과제
- Q3, Q4: 향후 분기 계획

---

## FAQ

### 1. **Milestone과 KPI의 차이는?**

| 항목 | Milestone | KPI |
|------|-----------|-----|
| **정의** | 달성해야 할 목표지점 | 달성도를 측정하는 지표 |
| **특성** | 정성적, 체크포인트 | 정량적, 측정 가능 |
| **예시** | "Phase 1 Completion" | "Projects Completed: 5/10" |
| **완료** | 체크박스로 완료 표시 | Target vs Current로 추적 |
| **시간** | Due Date로 관리 | 기한 없음 (진행 중 계속 추적) |

### 2. **진행률은 자동 계산되나요?**

아니요, 진행률은 **수동으로 입력**합니다. 슬라이더에서 0-100% 사이의 값을 직접 설정해야 합니다.

하지만 KPI의 진행률은 참고할 수 있습니다:
- KPI 진행률 = (Current / Target) × 100%
- 이를 바탕으로 로드맵의 Progress를 조정하세요.

### 3. **위험도는 어떻게 설정하나요?**

위험도는 프로젝트 관리자가 상황을 판단하여 설정합니다:

**Low로 설정해야 할 때**:
- 예전에 성공한 유사 프로젝트가 있을 때
- 필요한 리소스가 충분할 때
- 외부 의존성이 적을 때

**Medium으로 설정해야 할 때**:
- 새로운 기술을 도입할 때
- 일정이 적당히 타이트할 때
- 몇 가지 외부 의존성이 있을 때

**High로 설정해야 할 때**:
- 완전히 새로운 시도일 때
- 일정이 매우 타이트할 때
- 많은 외부 의존성이 있을 때

위험도가 높을수록 더 자주 모니터링하세요.

### 4. **로드맵 항목을 삭제했는데 복구할 수 있나요?**

**아니요, 삭제는 영구적입니다.** 삭제 전에 반드시 확인 다이얼로그를 읽고 신중하게 결정하세요.

중요한 로드맵은 삭제하기 전에 Screenshot이나 문서로 백업하는 것을 권장합니다.

### 5. **마일스톤의 Due Date가 End Date보다 뒤일 수 있나요?**

기술적으로는 가능하지만 **권장하지 않습니다.** 로드맵의 End Date는 모든 마일스톤이 완료되어야 하는 날짜이므로:

- 모든 Milestone Due Date <= Roadmap End Date

이 원칙을 따르세요.

### 6. **Quarter 형식에 정해진 규칙이 있나요?**

아니요, 자유로운 형식으로 입력할 수 있습니다:
- Q1 2025
- 2025년 1분기
- 1분기
- 2025-Q1

일관성 있게 사용하시면 됩니다.

### 7. **여러 마일스톤을 한 번에 추가할 수 있나요?**

아니요, 한 번에 하나씩 추가해야 합니다. "Add Milestone" 버튼을 여러 번 클릭하여 마일스톤을 추가하세요.

일괄 업로드 기능은 향후 버전에서 제공될 예정입니다.

### 8. **Published 토글을 OFF로 설정하면 로드맵이 어떻게 되나요?**

- **OFF (Draft)**: 공개 로드맵 페이지에 표시되지 않음 (관리자만 볼 수 있음)
- **ON (Published)**: 공개 로드맵 페이지에 표시됨

Draft 상태에서 작성, 검토, 수정 후 최종 확인 후 Publish하세요.

### 9. **로드맵 항목의 정렬 순서를 변경할 수 있나요?**

현재 버전에서는 **정렬 순서를 변경할 수 없습니다.** 테이블의 헤더를 클릭해도 정렬되지 않습니다.

정렬은 데이터베이스의 기본 정렬 규칙(start_date DESC, theme ASC)을 따릅니다.

### 10. **KPI의 Current 값이 Target보다 크면 어떻게 되나요?**

KPI 진행률이 100%를 초과합니다:
- Current: 12, Target: 10 → 진행률 120%
- 이는 목표를 초과 달성한 것을 나타냅니다 (긍정적).

### 11. **Owner 필드는 왜 필수가 아닌가요?**

Owner는 선택사항이지만 **매우 권장됩니다.** Owner가 설정되면:
- 책임 소재가 명확함
- 문제 발생 시 연락처 알 수 있음
- 팀 간 의존성 파악 용이

모든 로드맵 항목에 Owner를 설정하는 것을 권장합니다.

### 12. **검색할 때 특수문자나 한글을 입력해도 되나요?**

네, 한글, 영문, 특수문자 모두 검색 가능합니다. 검색은 Theme과 Goal 필드에 대해 대소문자 구분 없이 부분 일치로 동작합니다.

---

## 팁 & 트릭

### 1. **효율적인 마일스톤 설정**

마일스톤을 설정할 때는 **SMART 원칙**을 따르세요:
- **Specific**: 구체적 (예: "설계 완료" 아님 → "UI 컴포넌트 설계 완료")
- **Measurable**: 측정 가능 (예: "대부분 완료" 아님 → "상세 설계 문서 작성")
- **Achievable**: 달성 가능 (2주 이상의 버퍼 고려)
- **Relevant**: 관련성 있음 (로드맵 목표와 연결)
- **Time-bound**: 기한 명시 (Due Date 설정)

### 2. **위험도와 진행률의 관계**

- **Low 위험도 + 높은 진행률**: 안정적 진행 중
- **High 위험도 + 낮은 진행률**: 즉시 조치 필요
- **High 위험도 + 높은 진행률**: 위험도 재평가 고려

주간 회의에서 이 조합을 체크하세요.

### 3. **KPI 설정 팁**

KPI는 **최대 3-5개**만 설정하세요:
- 너무 많으면 관리 부담 증가
- 가장 중요한 지표만 선택
- 예: 품질, 일정, 비용 3가지만

### 4. **분기 계획 검토 체크리스트**

새 분기 시작 전에:
1. Quarter 입력 확인
2. Theme이 명확한가? (한 문장으로 설명 가능한가?)
3. Goal이 구체적인가? (측정 가능한가?)
4. Start/End Date가 올바른가?
5. Risk Level이 적절한가?
6. Milestones: 3-5개 정도인가?
7. KPIs: 3개 정도인가?

### 5. **진행 상황 업데이트 주기**

**권장 업데이트 주기**:
- Low 위험도: 주 1회
- Medium 위험도: 2-3회/주
- High 위험도: 매일

Progress와 KPI Current 값을 정기적으로 업데이트하세요.

### 6. **마일스톤 완료 추적**

테이블의 "Milestones" 컬럼을 활용하세요:
- 3/5: 5개 중 3개 완료 (60%)
- 이것이 진행률 보다 낮으면 일정 검토 필요

### 7. **Draft에서 Publish로 전환**

로드맵을 처음 만들 때:
1. **Draft 상태**에서 내용 작성 및 검토 (팀 내부)
2. **최종 검토**: 다른 팀원 리뷰
3. **Publish**: 최종 승인 후 전환

---

## 문제 해결

### 문제 1: "저장 실패" 메시지가 나옵니다.

**원인 및 해결**:
1. **필수 필드 미입력**: Quarter, Theme, Goal, Progress, Risk Level, Start/End Date 확인
2. **날짜 오류**: End Date < Start Date인 경우
   - 해결: End Date를 Start Date보다 뒤로 설정
3. **네트워크 오류**: 인터넷 연결 확인
4. **권한 문제**: Admin 이상 권한 필요

**해결 순서**:
1. 콘솔 오류 메시지 확인 (F12 개발자 도구)
2. 필수 필드 재확인
3. 날짜 검증
4. 페이지 새로고침 후 재시도

### 문제 2: 마일스톤을 추가했는데 저장되지 않습니다.

**확인 사항**:
- ID, Title, Description, Due Date가 모두 입력되었는가?
- 필드 중 하나라도 비어있으면 저장 실패

**해결**:
1. 모든 필드 재확인
2. 오류 메시지 읽기 (빨강 에러 텍스트)
3. 필수 필드 입력 후 재시도

### 문제 3: 로드맵 항목이 검색에 나타나지 않습니다.

**확인 사항**:
1. **필터 설정 확인**: Quarter, Risk Level 필터가 올바른가?
   - "All Quarters", "All Risk Levels"로 설정하여 필터 제거
2. **검색어 확인**: Theme이나 Goal에 정확하게 포함되었는가?
   - 부분 일치이므로 일부 단어만 입력해도 됨
3. **Published 상태**: Published 필터는 없으므로 Draft도 표시됨

**해결**:
1. 모든 필터 리셋
2. 검색어 변경 (다른 단어 시도)
3. 페이지 새로고침

### 문제 4: 삭제하려는 항목이 계속 보입니다.

**확인 사항**:
1. 삭제 확인 다이얼로그에서 "Delete"를 클릭했는가?
2. "Cancel"을 클릭했으면 삭제되지 않음

**해결**:
1. 페이지 새로고침 (Ctrl+R 또는 Cmd+R)
2. 삭제 다이얼로그 재확인
3. "Delete" 버튼이 빨갛다면 클릭하여 확정

### 문제 5: KPI의 Target과 Current 값이 소수점으로 입력되지 않습니다.

**확인 사항**:
- 입력 필드의 step="0.01" 설정으로 소수점 입력 가능

**해결**:
1. 직접 타이핑 (예: 4.5 입력)
2. 또는 위아래 화살표로 0.01씩 증감
3. 키보드에서 직접 점(.) 입력

---

## 보안 및 권한

### 접근 권한
- **Editor 이상**: 로드맵 조회, 생성, 수정, 삭제 가능
- **Viewer**: 조회만 가능 (향후 권한 정책에 따라)

### 데이터 보안
- 모든 로드맵 데이터는 Supabase의 RLS(Row-Level Security)로 보호됨
- 관리자만 생성/수정/삭제 가능
- 공개 페이지에서는 Published=true인 항목만 표시

---

## 통계 이해하기

### Total Phases (전체 분기)
- **의미**: 현재 필터 조건에 맞는 전체 로드맵 항목 수
- **활용**: 분기별 과제 량 파악
- **예**: Total Phases: 14 = 4분기 × 3-4개 항목

### In Progress (진행 중)
- **의미**: 0% < progress < 100%인 항목 수
- **활용**: 현재 활동 중인 과제 파악
- **예**: In Progress: 7 = 14개 중 7개가 진행 중

### Completed (완료)
- **의미**: progress = 100%인 항목 수
- **활용**: 달성률 파악 (Completed / Total)
- **예**: Completed: 3 = 14개 중 3개 완료 (21%)

### Avg Progress (평균 진행률)
- **의미**: 모든 항목의 평균 진행률
- **계산**: (Sum of all Progress) / Total Phases
- **활용**: 전체 로드맵의 건강도 파악
- **예**: Avg Progress: 45% = 전체 절반 정도 진행 중

---

## 추가 리소스

### 관련 문서
- **공개 로드맵 페이지**: https://www.ideaonaction.ai/roadmap
- **관리자 가이드 메인**: [docs/guides/cms/admin-guide.md](admin-guide.md)

### 연락처
- 기술 문제: devops@ideaonaction.ai
- 콘텐츠 문제: content@ideaonaction.ai

---

**Last Updated**: 2025년 11월 21일
**Version**: 1.0
**Document Status**: Final
