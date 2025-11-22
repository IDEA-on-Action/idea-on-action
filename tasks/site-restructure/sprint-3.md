# Sprint 3: 이야기 & 함께하기 섹션

> Phase 3 - 이야기 허브 구축, 뉴스레터 아카이브, Changelog, 함께하기 허브

**시작일**: 2025-11-23 (즉시 시작, Sprint 2와 병렬)
**종료일**: 2025-11-27 (예정)
**소요 기간**: 4일 (병렬 진행)
**의존성**: Sprint 1 완료 ✅
**상태**: 🚀 진행 중

---

## 스프린트 목표

1. StoriesHub 완성 (블로그/뉴스레터/Changelog/공지사항)
2. 뉴스레터 아카이브 페이지 신규 생성
3. Changelog 페이지 신규 생성
4. ConnectHub 완성 (문의/채용/커뮤니티)

---

## 작업 목록

### TASK-016: StoriesHub.tsx 완성
**예상 시간**: 2시간
**담당**: Agent 1
**의존성**: Sprint 1 완료

**설명**:
이야기 허브 페이지 완성 - 4개 섹션 미리보기

**구현 내용**:
```typescript
export default function StoriesHub() {
  return (
    <div className="container py-12">
      <h1>이야기</h1>
      <p>우리가 나누는 것들</p>

      <div className="grid md:grid-cols-2 gap-8 mt-12">
        {/* 블로그 섹션 */}
        <StoriesSection
          title="블로그"
          description="생각과 경험을 나눕니다"
          items={blogPosts.slice(0, 3)}
          linkTo="/stories/blog"
        />

        {/* 뉴스레터 섹션 */}
        <StoriesSection
          title="뉴스레터"
          description="정기 소식을 전합니다"
          items={newsletters.slice(0, 3)}
          linkTo="/stories/newsletter"
        />

        {/* Changelog 섹션 */}
        <StoriesSection
          title="변경사항"
          description="서비스 업데이트 내역"
          items={changelog.slice(0, 3)}
          linkTo="/stories/changelog"
        />

        {/* 공지사항 섹션 */}
        <StoriesSection
          title="공지사항"
          description="중요한 안내사항"
          items={notices.slice(0, 3)}
          linkTo="/stories/notices"
        />
      </div>
    </div>
  );
}
```

**완료 기준**:
- [ ] 4개 섹션 미리보기 표시
- [ ] 각 섹션 "더 보기" 링크 동작
- [ ] 반응형 2x2 그리드

---

### TASK-017: Changelog.tsx 신규 생성
**예상 시간**: 3시간
**담당**: Agent 1
**의존성**: TASK-018

**설명**:
릴리즈 노트/변경사항 페이지 생성

**구현 내용**:
```typescript
export default function Changelog() {
  const { data: entries, isLoading } = useChangelog();

  return (
    <div className="container py-12">
      <h1>변경사항</h1>
      <p>서비스 업데이트 내역</p>

      {/* 프로젝트 필터 */}
      <ProjectFilter />

      {/* 타임라인 형태 */}
      <div className="mt-8 space-y-8">
        {entries?.map(entry => (
          <ChangelogEntry
            key={entry.id}
            version={entry.version}
            title={entry.title}
            date={entry.released_at}
            changes={entry.changes}
            project={entry.project}
          />
        ))}
      </div>
    </div>
  );
}
```

**ChangelogEntry 컴포넌트**:
- 버전 배지 (v2.5.0)
- 날짜 표시
- 변경사항 목록 (feature/fix/breaking)
- 프로젝트 링크

**완료 기준**:
- [ ] Changelog 목록 표시
- [ ] 프로젝트별 필터 동작
- [ ] 변경 타입별 아이콘/색상

---

### TASK-018: changelog_entries 테이블 마이그레이션
**예상 시간**: 1시간
**담당**: Agent 3
**의존성**: 없음

**마이그레이션 파일**:
```sql
-- 20251208000000_create_changelog_entries.sql

CREATE TABLE changelog_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  changes JSONB DEFAULT '[]'::jsonb,
  -- [{type: 'feature'|'fix'|'breaking', description: '...'}]
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  github_release_url TEXT,
  released_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- 인덱스
CREATE INDEX idx_changelog_released_at ON changelog_entries(released_at DESC);
CREATE INDEX idx_changelog_project_id ON changelog_entries(project_id);

-- RLS
ALTER TABLE changelog_entries ENABLE ROW LEVEL SECURITY;

-- 공개 읽기
CREATE POLICY "changelog_select_public"
  ON changelog_entries FOR SELECT
  USING (true);

-- 관리자만 쓰기
CREATE POLICY "changelog_insert_admin"
  ON changelog_entries FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM admins WHERE user_id = auth.uid()
  ));

CREATE POLICY "changelog_update_admin"
  ON changelog_entries FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM admins WHERE user_id = auth.uid()
  ));

-- 트리거
CREATE TRIGGER update_changelog_updated_at
  BEFORE UPDATE ON changelog_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**완료 기준**:
- [ ] 마이그레이션 파일 생성
- [ ] 로컬 DB 테스트
- [ ] RLS 정책 동작 확인

---

### TASK-019: NewsletterArchive.tsx 신규 생성
**예상 시간**: 2시간
**담당**: Agent 2
**의존성**: TASK-021

**설명**:
발송된 뉴스레터 아카이브 페이지

**구현 내용**:
```typescript
export default function NewsletterArchive() {
  const { data: newsletters, isLoading } = useNewsletterArchive();

  return (
    <div className="container py-12">
      <h1>뉴스레터</h1>
      <p>정기적으로 전하는 소식</p>

      {/* 구독 CTA */}
      <NewsletterCTA />

      {/* 아카이브 목록 */}
      <div className="mt-8 space-y-4">
        {newsletters?.map(newsletter => (
          <NewsletterCard
            key={newsletter.id}
            subject={newsletter.subject}
            sentAt={newsletter.sent_at}
            preview={newsletter.preview}
            linkTo={`/stories/newsletter/${newsletter.id}`}
          />
        ))}
      </div>
    </div>
  );
}
```

**완료 기준**:
- [ ] 뉴스레터 목록 표시
- [ ] 발송일, 제목, 미리보기 표시
- [ ] 구독 CTA 동작

---

### TASK-020: NewsletterDetail.tsx 신규 생성
**예상 시간**: 1시간
**담당**: Agent 2
**의존성**: TASK-019

**설명**:
뉴스레터 전체 내용 표시 페이지

**완료 기준**:
- [ ] /stories/newsletter/:id 접근 가능
- [ ] 전체 내용 렌더링
- [ ] 이전/다음 네비게이션

---

### TASK-021: newsletter_archive 테이블 마이그레이션
**예상 시간**: 1시간
**담당**: Agent 3
**의존성**: 없음

**마이그레이션 파일**:
```sql
-- 20251208000001_create_newsletter_archive.sql

CREATE TABLE newsletter_archive (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  preview TEXT, -- 첫 200자
  sent_at TIMESTAMPTZ NOT NULL,
  recipient_count INTEGER DEFAULT 0,
  open_rate DECIMAL(5,2),
  click_rate DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- 인덱스
CREATE INDEX idx_newsletter_archive_sent_at ON newsletter_archive(sent_at DESC);

-- RLS
ALTER TABLE newsletter_archive ENABLE ROW LEVEL SECURITY;

CREATE POLICY "newsletter_archive_select_public"
  ON newsletter_archive FOR SELECT
  USING (true);

CREATE POLICY "newsletter_archive_insert_admin"
  ON newsletter_archive FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM admins WHERE user_id = auth.uid()
  ));
```

**완료 기준**:
- [ ] 마이그레이션 파일 생성
- [ ] 로컬 DB 테스트

---

### TASK-022: useNewsletterArchive & useChangelog 훅 생성
**예상 시간**: 2시간
**담당**: Agent 3
**의존성**: TASK-018, TASK-021

**생성할 파일**:
```
src/hooks/useNewsletterArchive.ts
src/hooks/useChangelog.ts
```

**완료 기준**:
- [ ] 두 훅 생성
- [ ] React Query 캐싱 적용
- [ ] 에러 핸들링

---

### TASK-023: 블로그 메뉴 활성화
**예상 시간**: 30분
**담당**: Agent 1
**의존성**: TASK-016

**설명**:
기존 블로그를 /stories/blog로 이동

**변경 내용**:
- App.tsx: `/stories/blog` 라우트 추가
- Blog.tsx: 기존 파일 이동 또는 import 경로 변경

**완료 기준**:
- [ ] /stories/blog 접근 가능
- [ ] WordPress 연동 정상
- [ ] 기존 기능 유지

---

### TASK-024: 공지사항 이전
**예상 시간**: 30분
**담당**: Agent 1
**의존성**: TASK-016

**설명**:
기존 공지사항을 /stories/notices로 이동

**완료 기준**:
- [ ] /stories/notices 접근 가능
- [ ] 기존 기능 유지

---

### TASK-025: E2E 테스트 작성 (이야기)
**예상 시간**: 2시간
**담당**: Agent 4
**의존성**: TASK-016~024

**테스트 파일**:
```
tests/e2e/stories/stories-hub.spec.ts
tests/e2e/stories/changelog.spec.ts
tests/e2e/stories/newsletter-archive.spec.ts
```

**완료 기준**:
- [ ] StoriesHub 테스트 5개
- [ ] Changelog 테스트 5개
- [ ] NewsletterArchive 테스트 3개

---

### TASK-034: ConnectHub.tsx 완성
**예상 시간**: 1시간
**담당**: Agent 2
**의존성**: Sprint 1 완료

**구현 내용**:
```typescript
export default function ConnectHub() {
  return (
    <div className="container py-12">
      <h1>함께하기</h1>
      <p>연결의 시작점</p>

      <div className="grid md:grid-cols-3 gap-8 mt-12">
        <ConnectCard
          title="프로젝트 문의"
          description="협업 프로젝트를 제안해주세요"
          icon={<MessageSquare />}
          linkTo="/connect/inquiry"
        />
        <ConnectCard
          title="채용"
          description="함께 성장할 동료를 찾습니다"
          icon={<Users />}
          linkTo="/connect/careers"
        />
        <ConnectCard
          title="커뮤니티"
          description="아이디어를 나누는 공간"
          icon={<Globe />}
          linkTo="/connect/community"
        />
      </div>
    </div>
  );
}
```

**완료 기준**:
- [ ] 3개 섹션 카드 표시
- [ ] 각 링크 동작

---

### TASK-035: ProjectInquiry.tsx (WorkWithUs 이전)
**예상 시간**: 30분
**담당**: Agent 2
**의존성**: TASK-034

**설명**:
기존 WorkWithUs.tsx를 ProjectInquiry.tsx로 이전

**완료 기준**:
- [ ] /connect/inquiry 접근 가능
- [ ] 폼 동작 유지

---

### TASK-036: Careers.tsx 신규 생성
**예상 시간**: 2시간
**담당**: Agent 2
**의존성**: TASK-034

**구현 내용**:
- 바운티 목록 연동 (Lab 데이터)
- 채용 공고 섹션 (정적 또는 CMS)

**완료 기준**:
- [ ] /connect/careers 접근 가능
- [ ] 바운티 목록 표시
- [ ] 지원하기 버튼 동작

---

### TASK-037: Community.tsx 이전
**예상 시간**: 30분
**담당**: Agent 2
**의존성**: TASK-034

**설명**:
기존 Community.tsx를 /connect/community로 이전

**완료 기준**:
- [ ] /connect/community 접근 가능
- [ ] 기존 기능 유지

---

## 스프린트 일정

```
Day 1 (월):
├── TASK-016: StoriesHub (Agent 1)
├── TASK-018: changelog 마이그레이션 (Agent 3)
├── TASK-021: newsletter 마이그레이션 (Agent 3)
└── TASK-034: ConnectHub (Agent 2)

Day 2 (화):
├── TASK-017: Changelog (Agent 1)
├── TASK-019: NewsletterArchive (Agent 2)
├── TASK-022: 훅 생성 (Agent 3)
└── TASK-035~037: Connect 하위 페이지 (Agent 2)

Day 3 (수):
├── TASK-020: NewsletterDetail (Agent 2)
├── TASK-023: 블로그 이전 (Agent 1)
├── TASK-024: 공지사항 이전 (Agent 1)
└── 통합 테스트

Day 4 (목):
├── TASK-025: E2E 테스트 (Agent 4)
├── 버그 수정
└── 리팩토링

Day 5 (금):
├── 최종 검증
├── 빌드 테스트
└── Sprint 4 준비
```

---

## 완료 기준

### 필수
- [ ] /stories 허브 동작
- [ ] /stories/changelog 동작
- [ ] /stories/newsletter 동작
- [ ] /connect 허브 동작
- [ ] 모든 하위 페이지 접근 가능

### 선택
- [ ] E2E 테스트 15개 이상
- [ ] DB 마이그레이션 프로덕션 적용

---

## 관련 문서

- [sprint-2.md](./sprint-2.md)
- [sprint-4.md](./sprint-4.md)
