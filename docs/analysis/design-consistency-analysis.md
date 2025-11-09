# 디자인 일관성 분석 보고서

## Step 1: 현재 디자인 패턴 분석

### Hero 섹션 패턴

#### 일관된 패턴 (대부분의 페이지)
```tsx
<section className="relative py-20 px-4 overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10"></div>
  <div className="container mx-auto max-w-6xl relative">
    <div className="text-center space-y-6">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4">
        <Icon className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold">Badge Text</span>
      </div>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">Title</h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">Description</p>
    </div>
  </div>
</section>
```

**사용 페이지:**
- About.tsx
- Roadmap.tsx
- Status.tsx
- Community.tsx
- WorkWithUs.tsx
- Lab.tsx
- Now.tsx
- Portfolio.tsx

#### 불일치 패턴

**Blog.tsx, Notices.tsx:**
```tsx
<section className="relative py-16 md:py-24">
  <div className="container mx-auto px-4">
    <div className="text-center max-w-3xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">Title</h1>
      <p className="text-lg md:text-xl text-muted-foreground">Description</p>
    </div>
  </div>
</section>
```

**Services.tsx, Search.tsx:**
```tsx
<main className="flex-1 container mx-auto px-4 py-16 space-y-12">
  <div className="text-center space-y-4">
    <h1 className="text-4xl md:text-5xl font-bold">Title</h1>
    <p className="text-lg text-muted-foreground">Description</p>
  </div>
</main>
```

### Section 패턴

#### 일반 섹션
```tsx
<section className="py-16 px-4">
  <div className="container mx-auto max-w-6xl">
    {/* Content */}
  </div>
</section>
```

#### 배경색이 있는 섹션
```tsx
<section className="py-16 px-4 bg-muted/30">
  {/* 또는 */}
<section className="py-16 px-4 bg-gradient-to-r from-primary/10 to-secondary/10">
```

### glass-card 사용 현황
- **총 74회 사용** (16개 파일)
- 일관되게 사용되고 있음
- 패턴: `className="glass-card p-6"` 또는 `className="glass-card p-8"`

### 로딩 상태 처리

#### 패턴 1: Spinner (대부분)
```tsx
if (isLoading) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}
```

**사용 페이지:**
- Roadmap.tsx
- Status.tsx
- Lab.tsx
- Now.tsx

#### 패턴 2: Skeleton (일부)
```tsx
<Skeleton className="h-10 w-24" />
```

**사용 페이지:**
- Services.tsx
- Blog.tsx

### 에러 상태 처리

#### 패턴 1: Card with AlertCircle (대부분)
```tsx
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
```

**사용 페이지:**
- Roadmap.tsx
- Status.tsx
- Lab.tsx
- Now.tsx

#### 패턴 2: Alert 컴포넌트 (일부)
```tsx
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>{error.message}</AlertDescription>
</Alert>
```

**사용 페이지:**
- Services.tsx

## Step 2: 문제점 도출

### 1. Hero 섹션 구조 불일치
- **문제**: Blog, Notices는 다른 패딩 값 사용 (`py-16 md:py-24` vs `py-20`)
- **문제**: Services, Search는 Hero 섹션이 없고 main 태그에 직접 스타일 적용
- **영향**: 시각적 일관성 저하

### 2. 로딩 상태 처리 불일치
- **문제**: 일부는 Spinner, 일부는 Skeleton 사용
- **문제**: 로딩 상태의 레이아웃이 페이지마다 다름
- **영향**: 사용자 경험 불일치

### 3. 에러 상태 처리 불일치
- **문제**: 일부는 Card + AlertCircle, 일부는 Alert 컴포넌트
- **문제**: 에러 메시지 형식이 페이지마다 다름
- **영향**: 에러 처리 일관성 부족

### 4. 공통 레이아웃 컴포넌트 부재
- **문제**: Hero 섹션, Section 래퍼가 각 페이지에 중복 구현
- **문제**: 로딩/에러 상태가 각 페이지에 중복 구현
- **영향**: 유지보수 어려움, 일관성 확보 어려움

### 5. 빈 데이터 상태 처리 부재
- **문제**: 빈 데이터 상태에 대한 일관된 컴포넌트 없음
- **영향**: 빈 상태 UI가 페이지마다 다름

## Step 3: 개선 방안

### 공통 컴포넌트 설계

1. **PageLayout**: 페이지 전체 레이아웃 래퍼
2. **HeroSection**: 일관된 Hero 섹션 컴포넌트
3. **Section**: 섹션 래퍼 컴포넌트
4. **LoadingState**: 일관된 로딩 상태 컴포넌트
5. **ErrorState**: 일관된 에러 상태 컴포넌트
6. **EmptyState**: 빈 데이터 상태 컴포넌트

## Step 4: 구현 완료

### 생성된 컴포넌트

1. ✅ **PageLayout** (`src/components/layouts/PageLayout.tsx`)
   - Header/Footer 포함 여부 선택 가능
   - 일관된 페이지 구조 제공

2. ✅ **HeroSection** (`src/components/layouts/HeroSection.tsx`)
   - 배지, 제목, 설명을 포함한 표준 Hero 섹션
   - default/compact variant 지원

3. ✅ **Section** (`src/components/layouts/Section.tsx`)
   - 일관된 섹션 스타일
   - default/muted/gradient variant 지원
   - 최대 너비 옵션 제공

4. ✅ **LoadingState** (`src/components/shared/LoadingState.tsx`)
   - Spinner/Skeleton variant 지원
   - 전체 화면/인라인 옵션

5. ✅ **ErrorState** (`src/components/shared/ErrorState.tsx`)
   - Card/Alert variant 지원
   - 재시도 기능 포함

6. ✅ **EmptyState** (`src/components/shared/EmptyState.tsx`)
   - 아이콘, 제목, 설명, 액션 버튼 지원

### 디자인 시스템 문서

✅ **디자인 시스템 가이드** (`docs/guides/design-system.md`)
- 공통 컴포넌트 사용법
- 레이아웃 패턴 가이드
- 마이그레이션 가이드

## Step 5: 페이지 리팩토링 완료

### 적용된 페이지

1. ✅ **Now.tsx**
   - PageLayout, HeroSection, Section 적용
   - LoadingState, ErrorState, EmptyState 적용

2. ✅ **Lab.tsx**
   - PageLayout, HeroSection, Section 적용
   - LoadingState, ErrorState, EmptyState 적용

3. ✅ **About.tsx**
   - PageLayout, HeroSection, Section 적용

### 개선 효과

1. **코드 일관성**: 모든 페이지가 동일한 패턴 사용
2. **유지보수성**: 공통 컴포넌트 수정 시 모든 페이지에 자동 반영
3. **개발 속도**: 새로운 페이지 개발 시 공통 컴포넌트 재사용
4. **사용자 경험**: 일관된 UI/UX 제공

