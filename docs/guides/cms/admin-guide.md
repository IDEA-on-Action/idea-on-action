# CMS 관리자 가이드

**작성일**: 2025-11-15
**버전**: 1.0
**대상**: super_admin, admin, editor

---

## 📋 개요

IDEA on Action CMS 관리자 모드는 웹사이트 콘텐츠를 관리하기 위한 통합 관리 시스템입니다.

**접근 URL**: https://www.ideaonaction.ai/admin

**권한 구조**:
- **super_admin**: 모든 기능 접근 가능 (관리자 계정 관리 포함)
- **admin**: 콘텐츠 생성/수정/삭제 가능
- **editor**: 콘텐츠 생성/수정만 가능 (삭제 불가)

---

## 🚀 관리자 페이지 목록

### 1. Dashboard (/admin)

전체 통계 조회 및 빠른 링크를 제공하는 메인 페이지입니다.

**주요 기능**:
- 전체 통계 카드 (프로젝트, 로드맵, 실험, 팀원 수)
- 최근 활동 요약
- 각 관리 페이지로의 빠른 링크

**사용법**:
1. 로그인 후 자동으로 표시
2. 통계 카드를 클릭하여 각 관리 페이지로 이동
3. 사이드바 메뉴로 원하는 페이지 직접 접근

---

### 2. Roadmap 관리 (/admin/roadmap)

분기별 로드맵 항목을 관리하는 페이지입니다.

**주요 필드**:
- `quarter` (필수): 분기 (예: 2025 Q1, 2026 Q2)
- `theme` (필수): 로드맵 주제
- `goal`: 목표 설명
- `progress` (필수): 진행률 (0-100)
- `status`: 상태 (planning, in-progress, completed, cancelled)
- `risk_level`: 리스크 레벨 (low, medium, high)
- `owner`: 담당자 이름
- `period`: 기간 (예: 2025-01 ~ 2025-03)
- `kpis`: 핵심 성과 지표 (JSON 배열)
- `related_projects`: 연관 프로젝트 ID 배열
- `published`: 공개 여부 (true/false)

**사용법**:

**추가**:
1. "+ 로드맵 추가" 버튼 클릭
2. 필수 필드 입력 (quarter, theme, progress)
3. 진행률 슬라이더로 조정 (0-100%)
4. 리스크 레벨 선택 (Low/Medium/High)
5. KPIs는 JSON 배열 형식으로 입력:
   ```json
   [{"metric": "사용자 증가율", "target": "30%"}]
   ```
6. "저장" 버튼 클릭

**수정**:
1. 테이블에서 연필 아이콘 클릭
2. 필드 수정
3. "저장" 버튼 클릭

**삭제**:
1. 테이블에서 휴지통 아이콘 클릭
2. 확인 대화상자에서 "삭제" 클릭
3. 삭제는 되돌릴 수 없음 주의

**필터링**:
- Status 드롭다운으로 상태별 필터링 가능
- Published 체크박스로 공개/비공개 필터링

---

### 3. Portfolio 관리 (/admin/portfolio)

포트폴리오 프로젝트를 관리하는 페이지입니다.

**주요 필드** (15개):
- `slug` (필수): URL 식별자 (kebab-case)
- `title` (필수): 프로젝트 제목
- `summary` (필수): 요약 (1-2줄)
- `description`: 상세 설명
- `project_type` (필수): 프로젝트 타입 (mvp, fullstack, design, operations)
- `status`: 상태 (planning, in-progress, completed, cancelled)
- `image_url`: 대표 이미지 URL
- `tech_stack`: 기술 스택 (JSON 배열)
- `duration`: 기간 (예: 3개월)
- `team_size`: 팀 크기 (예: 3명)
- `client`: 고객사
- `testimonial`: 고객 추천사 (JSON 객체)
- `demo_url`: 데모 URL
- `github_url`: GitHub 저장소 URL
- `featured`: Featured 여부 (true/false)
- `published`: 공개 여부 (true/false)

**사용법**:

**추가**:
1. 프로젝트 타입 필터 선택 (전체/MVP/Fullstack/Design/Operations)
2. "+ 포트폴리오 추가" 버튼 클릭
3. 필수 필드 입력 (slug, title, summary, project_type)
4. tech_stack은 JSON 배열 형식:
   ```json
   ["React", "TypeScript", "Supabase", "Tailwind CSS"]
   ```
5. testimonial은 JSON 객체 형식:
   ```json
   {
     "author": "홍길동",
     "role": "CEO",
     "company": "ABC Company",
     "content": "훌륭한 협업이었습니다!"
   }
   ```
6. "저장" 버튼 클릭

**Featured/Published 토글**:
- Featured: 홈페이지에 강조 표시
- Published: 웹사이트에 공개

**필터링**:
- Project Type 드롭다운으로 타입별 필터링
- Status 드롭다운으로 상태별 필터링

---

### 4. Lab 관리 (/admin/lab)

실험실 아이템을 관리하는 페이지입니다.

**주요 필드** (15개):
- `title` (필수): 제목
- `slug` (필수): URL 식별자 (kebab-case)
- `summary` (필수): 요약
- `description`: 설명
- `content`: 본문 (Markdown 지원)
- `category` (필수): 카테고리 (experiment, prototype, research, tool)
- `status`: 상태 (planning, active, completed, archived)
- `difficulty`: 난이도 (beginner, intermediate, advanced)
- `tech_stack`: 기술 스택 (JSON 배열)
- `learning_objectives`: 학습 목표 (JSON 배열)
- `demo_url`: 데모 URL
- `github_url`: GitHub 저장소 URL
- `docs_url`: 문서 URL
- `published`: 공개 여부
- `featured`: Featured 여부

**사용법**:

**추가**:
1. 카테고리 필터 선택 (전체/Experiment/Prototype/Research/Tool)
2. "+ 실험실 아이템 추가" 버튼 클릭
3. 필수 필드 입력 (title, slug, summary, category)
4. content는 Markdown 형식으로 작성:
   ```markdown
   ## 실험 개요

   이 실험은...

   ## 결과

   - 결과 1
   - 결과 2
   ```
5. learning_objectives는 JSON 배열:
   ```json
   ["React Hooks 이해", "Custom Hook 작성", "성능 최적화"]
   ```
6. GitHub URL 연결 (선택)
7. "저장" 버튼 클릭

**난이도 표시**:
- Beginner: 초급 (녹색 배지)
- Intermediate: 중급 (노란색 배지)
- Advanced: 고급 (빨간색 배지)

**필터링**:
- Category 드롭다운으로 카테고리별 필터링
- Status 드롭다운으로 상태별 필터링
- Difficulty 드롭다운으로 난이도별 필터링

---

### 5. Team 관리 (/admin/team)

팀원 정보를 관리하는 페이지입니다.

**주요 필드**:
- `name` (필수): 이름
- `role` (필수): 역할 (예: Founder, Developer, Designer)
- `bio`: 소개
- `avatar`: 아바타 이미지 URL
- `email`: 이메일
- `skills`: 기술/역량 (JSON 배열)
- `social_links`: 소셜 링크 (JSON 객체)
- `active`: 활성 상태 (true/false)
- `priority`: 우선순위 (높을수록 먼저 표시, 기본값 0)

**사용법**:

**추가**:
1. "+ 팀원 추가" 버튼 클릭
2. 필수 필드 입력 (name, role)
3. 아바타 URL 입력 (이미지 미리보기 자동 표시)
4. skills는 JSON 배열 형식:
   ```json
   ["React", "TypeScript", "Node.js", "AWS"]
   ```
5. social_links는 JSON 객체 형식:
   ```json
   {
     "github": "https://github.com/username",
     "linkedin": "https://linkedin.com/in/username",
     "twitter": "https://twitter.com/username",
     "website": "https://example.com"
   }
   ```
6. priority 설정 (높을수록 먼저 표시)
7. "저장" 버튼 클릭

**우선순위 설정**:
- Priority가 높은 순서로 About 페이지에 표시
- 같은 priority면 생성 날짜 순서

**활성 상태**:
- Active: 웹사이트에 표시
- Inactive: 숨김 (관리자 페이지에만 표시)

---

### 6. Blog Categories (/admin/blog/categories)

블로그 카테고리를 관리하는 페이지입니다.

**주요 필드**:
- `name` (필수): 카테고리 이름
- `slug` (필수): URL 식별자 (kebab-case)
- `description`: 설명
- `color`: 색상 (hex 코드: #RRGGBB)
- `icon`: 아이콘 이름 (Lucide 아이콘)
- `post_count`: 포스트 수 (읽기 전용, 자동 추적)

**사용법**:

**추가**:
1. "+ 카테고리 추가" 버튼 클릭
2. 필수 필드 입력 (name, slug)
3. 색상 선택기로 색상 선택
   - 색상은 hex 코드 형식 (#RRGGBB)
   - 예: #3b82f6 (파란색), #f59e0b (주황색)
4. 아이콘 이름 입력 (Lucide 아이콘)
   - 예: Book, Code, Lightbulb, Rocket
5. slug는 kebab-case로 자동 검증
   - 올바른 예: tech-tips, project-updates
   - 잘못된 예: Tech Tips, project_updates
6. "저장" 버튼 클릭

**수정**:
1. 테이블에서 연필 아이콘 클릭
2. 필드 수정 (post_count는 읽기 전용)
3. "저장" 버튼 클릭

**삭제**:
1. 테이블에서 휴지통 아이콘 클릭
2. 확인 대화상자에서 "삭제" 클릭
3. post_count > 0이면 경고 메시지 표시
4. 삭제는 되돌릴 수 없음 주의

**Post Count 자동 업데이트**:
- 블로그 포스트 추가 시 자동 증가
- 블로그 포스트 삭제 시 자동 감소
- 수동 변경 불가 (읽기 전용)

---

### 7. Tags (/admin/tags)

태그를 관리하는 페이지입니다.

**주요 필드**:
- `name` (필수): 태그 이름
- `slug` (필수): URL 식별자 (kebab-case)
- `usage_count`: 사용 횟수 (읽기 전용, 자동 추적)

**사용법**:

**추가**:
1. "+ 태그 추가" 버튼 클릭
2. 필수 필드 입력 (name, slug)
3. slug는 kebab-case로 자동 검증
   - 올바른 예: react, typescript, web-development
   - 잘못된 예: React, Type Script, web_development
4. "저장" 버튼 클릭

**수정**:
1. 테이블에서 연필 아이콘 클릭
2. name, slug 수정 (usage_count는 읽기 전용)
3. "저장" 버튼 클릭

**삭제**:
1. 테이블에서 휴지통 아이콘 클릭
2. usage_count > 0이면 경고 메시지 표시:
   - "이 태그는 X개의 포스트에서 사용 중입니다. 삭제하시겠습니까?"
3. 확인 대화상자에서 "삭제" 클릭
4. 삭제 시 연관된 포스트에서 태그 제거됨

**Usage Count 자동 업데이트**:
- 블로그 포스트에 태그 추가 시 자동 증가
- 블로그 포스트에서 태그 제거 시 자동 감소
- 수동 변경 불가 (읽기 전용)

---

### 8. Users (/admin/users) **[super_admin only]**

관리자 계정을 관리하는 페이지입니다.

**권한 필요**: super_admin만 접근 가능

**주요 필드**:
- `user_id` (필수): 사용자 ID (이메일 검색으로 선택)
- `role` (필수): 역할 (super_admin, admin, editor)

**사용법**:

**추가**:
1. "+ 관리자 추가" 버튼 클릭
2. 이메일 검색 필드에 최소 3자 입력
3. 검색 결과에서 사용자 선택
4. 역할 선택:
   - **super_admin**: 모든 기능 접근 (관리자 계정 관리 포함)
   - **admin**: 콘텐츠 생성/수정/삭제 가능
   - **editor**: 콘텐츠 생성/수정만 가능 (삭제 불가)
5. "저장" 버튼 클릭

**수정 (역할 변경)**:
1. 테이블에서 연필 아이콘 클릭
2. 역할 선택 (super_admin, admin, editor)
3. "저장" 버튼 클릭

**삭제 (관리자 권한 제거)**:
1. 테이블에서 휴지통 아이콘 클릭
2. 확인 대화상자에서 "삭제" 클릭
3. 사용자 계정은 삭제되지 않고, 관리자 권한만 제거됨

**주의사항**:
- 자기 자신의 역할을 변경하거나 삭제할 수 없음
- 마지막 super_admin은 삭제 불가 (최소 1명 유지)
- 일반 사용자만 검색 가능 (이미 관리자 역할이 있는 사용자는 검색되지 않음)

---

## ⚠️ 주의사항

### 권한

**editor 제약**:
- 삭제 기능 사용 불가 (모든 페이지)
- 휴지통 아이콘이 표시되지 않음

**admin 제약**:
- Users 페이지 접근 불가

**super_admin 전용**:
- Users 페이지 접근 및 관리
- 모든 기능 제한 없음

### 데이터 검증

**slug 형식**:
- 항상 kebab-case 형식 (소문자 + 하이픈)
- 올바른 예: `my-first-post`, `web-development`
- 잘못된 예: `My First Post`, `web_development`, `웹-개발`

**색상 형식**:
- hex 코드 (#RRGGBB)
- 올바른 예: `#3b82f6`, `#f59e0b`
- 잘못된 예: `blue`, `rgb(59, 130, 246)`, `3b82f6`

**JSON 필드 형식**:
- 배열: `["item1", "item2"]` (쌍따옴표 필수)
- 객체: `{"key": "value"}` (키도 쌍따옴표 필수)
- 잘못된 예: `['item1']` (작은따옴표), `{key: "value"}` (키 따옴표 없음)

### 삭제

**확인 대화상자**:
- 모든 삭제 작업은 확인 대화상자 표시
- "취소" 버튼으로 삭제 취소 가능

**경고 메시지**:
- Tags/Categories 삭제 시 usage_count > 0이면 경고
- 연관된 데이터가 있을 경우 추가 경고

**되돌릴 수 없음**:
- 삭제는 되돌릴 수 없음
- 중요한 데이터는 삭제 전 백업 권장

### 필수 필드

**빨간색 별표** (*):
- 필수 필드는 빨간색 별표로 표시
- 필수 필드 누락 시 "필수 필드를 입력해주세요" 에러

**유효성 검증**:
- 이메일: 올바른 이메일 형식
- URL: 올바른 URL 형식 (http:// 또는 https://)
- JSON: 올바른 JSON 형식

---

## 🔧 문제 해결

### "권한이 없습니다" 에러

**원인**:
- 로그인하지 않음
- 관리자 계정이 아님
- 역할 권한 부족

**해결 방법**:
1. 로그인 상태 확인 (Header 프로필 아이콘 확인)
2. 관리자 계정 여부 확인 (super_admin, admin, editor)
3. Users 페이지는 super_admin만 접근 가능
4. 삭제 기능은 editor 역할에서 사용 불가

### "필수 필드를 입력해주세요" 에러

**원인**:
- 빨간색 별표(*) 필드 누락
- 유효성 검증 실패

**해결 방법**:
1. 빨간색으로 표시된 필드 확인
2. 모든 필수 필드 입력
3. 유효성 검증 통과 확인 (이메일, URL, slug 형식)
4. "저장" 버튼 다시 클릭

### JSON 형식 오류

**원인**:
- 잘못된 JSON 형식 입력
- 작은따옴표 사용
- 키에 따옴표 누락

**해결 방법**:

**tech_stack (배열)**:
```json
// 올바른 예
["React", "TypeScript", "Supabase"]

// 잘못된 예
['React', 'TypeScript']  // 작은따옴표
[React, TypeScript]      // 따옴표 없음
```

**testimonial (객체)**:
```json
// 올바른 예
{
  "author": "홍길동",
  "role": "CEO",
  "company": "ABC Company",
  "content": "훌륭한 협업이었습니다!"
}

// 잘못된 예
{author: "홍길동"}       // 키에 따옴표 없음
{'author': '홍길동'}     // 작은따옴표
```

### slug 중복 오류

**원인**:
- 동일한 slug가 이미 존재

**해결 방법**:
1. 다른 slug 사용
2. 기존 항목 수정 고려
3. slug는 고유해야 함 (URL 식별자)

### 이미지 미리보기 안 나옴

**원인**:
- 잘못된 이미지 URL
- CORS 제한
- 이미지 서버 오류

**해결 방법**:
1. 이미지 URL 직접 브라우저에서 열어보기
2. HTTPS URL 사용 권장
3. 공개된 이미지 URL 사용 (인증 필요한 URL 사용 불가)
4. Supabase Storage 사용 권장

### 저장 후 목록에 안 나옴

**원인**:
- published: false 설정
- 필터링 활성화
- 캐싱 문제

**해결 방법**:
1. published 필드 확인 (true로 설정)
2. 필터 "전체" 선택
3. 페이지 새로고침 (F5)
4. 브라우저 캐시 삭제

---

## 📊 관리 팁

### 효율적인 콘텐츠 관리

**우선순위 활용**:
- Team 페이지: priority 높은 순서로 표시
- Featured 체크: 홈페이지 강조 표시

**상태 관리**:
- planning → active → completed 순서로 진행
- archived 상태는 목록에서 숨김 (필터로 확인 가능)

**태그 정리**:
- 주기적으로 usage_count 0인 태그 삭제
- 일관된 naming convention 유지 (kebab-case)

### JSON 데이터 관리

**tech_stack**:
- 공식 기술명 사용 (React, TypeScript, Node.js)
- 대소문자 일관성 유지
- 버전은 제외 (React 18 → React)

**learning_objectives**:
- 구체적인 학습 목표 작성
- 3-5개 항목 권장
- 동사로 시작 ("이해하기", "작성하기", "최적화하기")

**social_links**:
- 전체 URL 입력 (https:// 포함)
- 유효한 URL만 입력
- 비어있으면 표시 안 함

### 권한 관리 (super_admin)

**역할 할당 원칙**:
- editor: 콘텐츠 작성자 (삭제 권한 없음)
- admin: 콘텐츠 관리자 (모든 콘텐츠 관리)
- super_admin: 시스템 관리자 (계정 관리 포함)

**보안 권장사항**:
- super_admin 최소 인원 유지 (1-2명)
- 퇴사자 즉시 권한 제거
- 정기적인 권한 감사 (월 1회)

---

## 🆘 지원

### 기술 지원

**이메일**: sinclairseo@gmail.com
**문서**: https://www.ideaonaction.ai/docs
**GitHub Issues**: https://github.com/IDEA-on-Action/idea-on-action/issues

### 긴급 상황

**관리자 계정 잠김**:
- super_admin에게 연락
- 비밀번호 재설정 (/login → "비밀번호 찾기")

**데이터 복구**:
- super_admin에게 연락
- Supabase 백업 확인

**버그 제보**:
- GitHub Issues에 등록
- 재현 단계 상세 기술
- 스크린샷 첨부

---

**작성자**: Claude (with Sinclair Seo)
**최종 업데이트**: 2025-11-15
**버전**: 1.0
