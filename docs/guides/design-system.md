# 디자인 시스템 가이드

## 개요

IDEA on Action 프로젝트의 일관된 디자인 시스템 가이드입니다. 모든 페이지와 컴포넌트는 이 가이드를 따라 구현되어야 합니다.

## 공통 레이아웃 컴포넌트

### PageLayout

페이지 전체 레이아웃 래퍼 컴포넌트입니다.

```tsx
import { PageLayout } from "@/components/layouts";

<PageLayout showHeader={true} showFooter={true}>
  {/* 페이지 컨텐츠 */}
</PageLayout>
```

**Props:**
- `children`: ReactNode - 페이지 컨텐츠
- `showHeader`: boolean (기본값: true) - Header 표시 여부
- `showFooter`: boolean (기본값: true) - Footer 표시 여부
- `className`: string - 추가 CSS 클래스

### HeroSection

일관된 Hero 섹션 컴포넌트입니다.

```tsx
import { HeroSection } from "@/components/layouts";
import { Rocket } from "lucide-react";

<HeroSection
  badge={{ icon: Rocket, text: "Welcome" }}
  title="페이지 제목"
  description="페이지 설명"
  variant="default" // 또는 "compact"
>
  {/* 추가 컨텐츠 (선택) */}
</HeroSection>
```

**Props:**
- `badge`: { icon?: LucideIcon, text: string } - 배지 정보 (선택)
- `title`: string | ReactNode - 제목
- `description`: string | ReactNode - 설명 (선택)
- `variant`: "default" | "compact" - 스타일 변형
- `className`: string - 추가 CSS 클래스
- `children`: ReactNode - 추가 컨텐츠 (선택)

**Variant 차이:**
- `default`: `py-20 px-4` (표준 패딩)
- `compact`: `py-16 md:py-24` (컴팩트 패딩)

### Section

섹션 래퍼 컴포넌트입니다.

```tsx
import { Section } from "@/components/layouts";

<Section variant="default" maxWidth="6xl">
  {/* 섹션 컨텐츠 */}
</Section>
```

**Props:**
- `children`: ReactNode - 섹션 컨텐츠
- `variant`: "default" | "muted" | "gradient" - 배경 스타일
- `container`: boolean (기본값: true) - 컨테이너 래퍼 사용 여부
- `maxWidth`: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "6xl" | "full" - 최대 너비
- `className`: string - 추가 CSS 클래스

**Variant:**
- `default`: 기본 배경
- `muted`: `bg-muted/30` 배경
- `gradient`: `bg-gradient-to-r from-primary/10 to-secondary/10` 배경

## 상태 컴포넌트

### LoadingState

일관된 로딩 상태 컴포넌트입니다.

```tsx
import { LoadingState } from "@/components/shared";

// 전체 화면 스피너
<LoadingState fullScreen={true} message="로딩 중..." />

// 인라인 스켈레톤
<LoadingState variant="skeleton" fullScreen={false} skeletonCount={5} />
```

**Props:**
- `variant`: "spinner" | "skeleton" - 로딩 스타일
- `fullScreen`: boolean (기본값: true) - 전체 화면 여부
- `message`: string - 로딩 메시지 (선택)
- `skeletonCount`: number (기본값: 3) - 스켈레톤 개수
- `className`: string - 추가 CSS 클래스

### ErrorState

일관된 에러 상태 컴포넌트입니다.

```tsx
import { ErrorState } from "@/components/shared";

<ErrorState
  error={error}
  title="데이터 로드 실패"
  fullScreen={true}
  onRetry={() => refetch()}
  variant="card" // 또는 "alert"
/>
```

**Props:**
- `error`: Error | string | unknown - 에러 객체 또는 메시지
- `title`: string (기본값: "데이터 로드 실패") - 에러 제목
- `fullScreen`: boolean (기본값: true) - 전체 화면 여부
- `onRetry`: () => void - 재시도 함수 (선택)
- `variant`: "card" | "alert" - 표시 스타일
- `className`: string - 추가 CSS 클래스

### EmptyState

일관된 빈 데이터 상태 컴포넌트입니다.

```tsx
import { EmptyState } from "@/components/shared";
import { Package } from "lucide-react";

<EmptyState
  icon={Package}
  title="데이터가 없습니다"
  description="아직 등록된 항목이 없습니다."
  action={{
    label: "새로 만들기",
    onClick: () => navigate("/create"),
  }}
/>
```

**Props:**
- `icon`: LucideIcon - 아이콘 컴포넌트
- `title`: string - 제목
- `description`: string - 설명 (선택)
- `action`: { label: string, onClick: () => void } - 액션 버튼 (선택)
- `className`: string - 추가 CSS 클래스

## 공통 스타일 클래스

### glass-card

글래스모피즘 효과가 적용된 카드 스타일입니다.

```tsx
<div className="glass-card p-6">
  {/* 컨텐츠 */}
</div>
```

### hover-lift

호버 시 살짝 올라오는 효과입니다.

```tsx
<Card className="glass-card p-6 hover-lift">
  {/* 컨텐츠 */}
</Card>
```

### gradient-bg

그라데이션 배경입니다.

```tsx
<div className="gradient-bg">
  {/* 컨텐츠 */}
</div>
```

## 레이아웃 패턴

### 표준 페이지 구조

```tsx
import { PageLayout, HeroSection, Section } from "@/components/layouts";
import { LoadingState, ErrorState } from "@/components/shared";

const MyPage = () => {
  const { data, isLoading, error } = useData();

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <PageLayout>
      <HeroSection
        badge={{ icon: Icon, text: "Badge" }}
        title="페이지 제목"
        description="페이지 설명"
      />

      <Section variant="default">
        {/* 메인 컨텐츠 */}
      </Section>

      <Section variant="muted">
        {/* 보조 컨텐츠 */}
      </Section>

      <Section variant="gradient">
        {/* CTA 섹션 */}
      </Section>
    </PageLayout>
  );
};
```

## 색상 시스템

### Primary Colors
- Primary: `hsl(217 91% 60%)` - 주요 액션, 링크
- Secondary: `hsl(210 40% 96.1%)` - 보조 요소
- Accent: `hsl(38 92% 50%)` - 강조 요소

### Text Colors
- Foreground: 기본 텍스트 색상
- Muted Foreground: `text-muted-foreground` - 보조 텍스트

### Background Colors
- Background: 기본 배경
- Muted: `bg-muted/30` - 섹션 배경

## 타이포그래피

### 제목
- Hero Title: `text-4xl md:text-5xl lg:text-6xl font-bold`
- Section Title: `text-3xl md:text-4xl font-bold`
- Card Title: `text-xl font-bold`

### 본문
- Large: `text-lg md:text-xl`
- Default: `text-base`
- Small: `text-sm`
- Muted: `text-muted-foreground`

## 간격 시스템

### 섹션 패딩
- Hero Section: `py-20 px-4` (default) 또는 `py-16 md:py-24` (compact)
- Section: `py-16 px-4`

### 컨테이너 최대 너비
- Hero: `max-w-6xl`
- Section: `max-w-6xl` (기본값)
- Content: `max-w-4xl`

## 사용 예시

### About 페이지

```tsx
import { PageLayout, HeroSection, Section } from "@/components/layouts";

const About = () => {
  return (
    <PageLayout>
      <HeroSection
        title="IDEA on Action"
        description="생각과행동"
      />

      <Section>
        {/* Mission & Vision */}
      </Section>

      <Section variant="muted">
        {/* Core Values */}
      </Section>
    </PageLayout>
  );
};
```

### 데이터 페칭이 있는 페이지

```tsx
import { PageLayout, HeroSection, Section } from "@/components/layouts";
import { LoadingState, ErrorState, EmptyState } from "@/components/shared";
import { Package } from "lucide-react";

const MyDataPage = () => {
  const { data, isLoading, error } = useData();

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="데이터가 없습니다"
        description="아직 등록된 항목이 없습니다."
      />
    );
  }

  return (
    <PageLayout>
      <HeroSection
        badge={{ icon: Package, text: `${data.length}개 항목` }}
        title="제목"
        description="설명"
      />

      <Section>
        {/* 데이터 표시 */}
      </Section>
    </PageLayout>
  );
};
```

## 마이그레이션 가이드

기존 페이지를 공통 컴포넌트로 마이그레이션하는 방법:

1. **Hero 섹션 교체**
   ```tsx
   // Before
   <section className="relative py-20 px-4 overflow-hidden">
     <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10"></div>
     <div className="container mx-auto max-w-6xl relative">
       <div className="text-center space-y-6">
         <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">Title</h1>
       </div>
     </div>
   </section>

   // After
   <HeroSection title="Title" />
   ```

2. **로딩 상태 교체**
   ```tsx
   // Before
   if (isLoading) {
     return (
       <div className="flex items-center justify-center min-h-screen">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
       </div>
     );
   }

   // After
   if (isLoading) {
     return <LoadingState />;
   }
   ```

3. **에러 상태 교체**
   ```tsx
   // Before
   if (error) {
     return (
       <div className="flex items-center justify-center min-h-screen">
         <Card className="glass-card p-8 max-w-md text-center">
           <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
           <h2 className="text-xl font-bold mb-2">데이터 로드 실패</h2>
           <p className="text-muted-foreground">{error.message}</p>
         </Card>
       </div>
     );
   }

   // After
   if (error) {
     return <ErrorState error={error} />;
   }
   ```

