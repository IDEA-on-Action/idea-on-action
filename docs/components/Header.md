# Header Component

네비게이션 헤더 컴포넌트로, 사이트의 주요 네비게이션과 사용자 인증 상태를 관리하는 컴포넌트입니다.

## 개요

Header 컴포넌트는 웹사이트의 상단 네비게이션을 담당하는 고정 헤더입니다. 브랜드 로고, 네비게이션 메뉴, 사용자 인증 상태, 모바일 메뉴를 포함하며, 스크롤 효과와 반응형 디자인을 지원합니다.

## Props

```typescript
interface HeaderProps {
  className?: string; // 추가 CSS 클래스
}
```

### Props 설명

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | 컴포넌트에 추가할 CSS 클래스 |

## 사용 예시

### 기본 사용법

```tsx
import Header from '@/components/Header';

function App() {
  return (
    <div>
      <Header />
    </div>
  );
}
```

### 커스텀 스타일 적용

```tsx
import Header from '@/components/Header';

function App() {
  return (
    <div>
      <Header className="custom-header-styles" />
    </div>
  );
}
```

## 주요 기능

### 1. 브랜드 로고 및 이름
- 클릭 가능한 로고 (홈페이지로 이동)
- 브랜드 이름과 태그라인 표시
- 접근성 최적화된 이미지 속성

### 2. 네비게이션 메뉴
- 데스크톱: 가로 배치된 네비게이션
- 모바일: 햄버거 메뉴로 접을 수 있는 네비게이션
- 현재 페이지에 따른 링크 동작 차별화

### 3. 사용자 인증 상태
- **로그인 전**: 로그인 버튼 표시
- **로그인 후**: 사용자 아바타와 드롭다운 메뉴
- **관리자**: 추가 관리자 메뉴 옵션

### 4. 반응형 디자인
- 데스크톱: 전체 네비게이션 표시
- 모바일: 햄버거 메뉴로 축약
- 태블릿: 중간 크기 최적화

### 5. 스크롤 효과
- 스크롤 시 배경 투명도 변화
- 백드롭 블러 효과
- 부드러운 전환 애니메이션

## 네비게이션 구조

### 데스크톱 네비게이션
```tsx
const NAVIGATION_ITEMS = [
  { label: "서비스", href: "/services" },
  { label: "기술", href: "#features" },
  { label: "회사소개", href: "#about" },
  { label: "문의", href: "#contact" }
];
```

### 모바일 네비게이션
- 햄버거 메뉴 버튼
- 슬라이드 다운 메뉴
- 터치 친화적 인터페이스

## 사용자 인증 상태

### 로그인 전
```tsx
<Button onClick={() => navigate('/login')}>
  로그인
</Button>
```

### 로그인 후
```tsx
<DropdownMenu>
  <DropdownMenuTrigger>
    <Avatar>
      <AvatarFallback>
        {user.email?.[0]?.toUpperCase()}
      </AvatarFallback>
    </Avatar>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>프로필</DropdownMenuItem>
    {isAdmin && <DropdownMenuItem>관리자</DropdownMenuItem>}
    <DropdownMenuItem>로그아웃</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## 스타일 커스터마이징

### CSS 변수 활용

```css
:root {
  --header-bg: rgba(255, 255, 255, 0.8);
  --header-scrolled-bg: rgba(255, 255, 255, 0.95);
  --header-border: rgba(0, 0, 0, 0.1);
}
```

### Tailwind 클래스 커스터마이징

```tsx
// 커스텀 클래스로 스타일 오버라이드
<Header className="bg-custom-gradient border-custom-color" />
```

### 스크롤 효과 커스터마이징

```css
.header-scrolled {
  @apply bg-background/95 backdrop-blur-md;
  @apply border-b border-gray-200 dark:border-gray-700;
}
```

## 접근성 고려사항

### 1. 키보드 네비게이션
- 모든 링크와 버튼이 키보드로 접근 가능
- Tab 순서가 논리적으로 구성
- Enter/Space 키로 상호작용 가능

### 2. 스크린 리더 지원
- 적절한 ARIA 라벨 제공
- 시맨틱 HTML 구조
- 상태 변화 알림

### 3. 모바일 접근성
- 터치 타겟 크기 최적화
- 스와이프 제스처 지원
- 음성 명령 호환성

## 성능 최적화

### 1. 스크롤 이벤트 최적화
```tsx
useEffect(() => {
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 10);
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

### 2. 조건부 렌더링
- 사용자 인증 상태에 따른 최적화
- 모바일/데스크톱 환경별 렌더링

### 3. 메모이제이션
- 불필요한 리렌더링 방지
- React.memo 사용 고려

## 테스트

### 단위 테스트

```bash
npm run test:unit Header.test.tsx
```

### 접근성 테스트

```bash
npm run test:a11y Header
```

### 모바일 테스트

```bash
npm run test:mobile Header
```

## 브라우저 지원

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- 모바일 브라우저 지원

## 관련 컴포넌트

- [ThemeToggle](../shared/ThemeToggle.md) - 테마 토글
- [Avatar](../ui/avatar.md) - 사용자 아바타
- [DropdownMenu](../ui/dropdown-menu.md) - 드롭다운 메뉴

## 변경 이력

### v1.5.0
- 모바일 메뉴 구현 개선
- 스크롤 효과 추가
- 접근성 개선 (ARIA 라벨, 키보드 네비게이션)
- TypeScript 타입 정의 추가
- 테스트 코드 작성

### v1.4.0
- 반응형 디자인 개선
- 사용자 인증 상태 관리 개선
- 애니메이션 성능 최적화

## 개발 팁

### 1. 새로운 네비게이션 항목 추가
```tsx
const NAVIGATION_ITEMS = [
  // 기존 항목들...
  { label: "새로운 페이지", href: "/new-page" }
];
```

### 2. 모바일 메뉴 커스터마이징
```tsx
// 모바일 메뉴 스타일 조정
<div className="md:hidden absolute top-16 left-0 right-0 bg-background/95">
  {/* 모바일 메뉴 내용 */}
</div>
```

### 3. 스크롤 효과 조정
```tsx
// 스크롤 임계값 조정
const handleScroll = () => {
  setIsScrolled(window.scrollY > 20); // 기본값: 10
};
```

### 4. 사용자 인증 상태 처리
```tsx
// 사용자 정보에 따른 UI 조정
{user ? (
  <UserMenu user={user} />
) : (
  <LoginButton />
)}
```
