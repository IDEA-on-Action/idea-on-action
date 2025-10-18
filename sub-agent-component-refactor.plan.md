# Sub-Agent를 활용한 컴포넌트 리팩토링

## 작업 개요

5개의 주요 컴포넌트를 Sub-Agent로 병렬 처리하여 리팩토링, 스타일링 개선, 테스트 코드 작성, 컴포넌트 문서 생성을 진행합니다.

## 대상 컴포넌트

1. **Hero.tsx** - 메인 히어로 섹션
2. **Features.tsx** - 기능 소개 섹션  
3. **Services.tsx** - 서비스 소개 섹션
4. **Header.tsx** - 네비게이션 헤더
5. **Footer.tsx** - 사이트 푸터

## Sub-Agent 작업 분할

### Sub-Agent 1: Hero 컴포넌트

- 반응형 레이아웃 개선
- 애니메이션 최적화
- 접근성(a11y) 개선
- 테스트 코드 작성 (`tests/unit/components/Hero.test.tsx`)
- 컴포넌트 문서 작성 (`docs/components/Hero.md`)

### Sub-Agent 2: Features 컴포넌트

- 카드 레이아웃 리팩토링
- 호버 효과 개선
- prop 타입 정의
- 테스트 코드 작성 (`tests/unit/components/Features.test.tsx`)
- 컴포넌트 문서 작성 (`docs/components/Features.md`)

### Sub-Agent 3: Services 컴포넌트

- 재사용 가능한 ServiceCard 컴포넌트 활용
- 데이터 구조 타입 정의
- 로딩/에러 상태 처리
- 테스트 코드 작성 (`tests/unit/components/Services.test.tsx`)
- 컴포넌트 문서 작성 (`docs/components/Services.md`)

### Sub-Agent 4: Header 컴포넌트

- 모바일 메뉴 구현 개선
- 스크롤 동작 최적화
- 사용자 메뉴 접근성 개선
- 테스트 코드 작성 (`tests/unit/components/Header.test.tsx`)
- 컴포넌트 문서 작성 (`docs/components/Header.md`)

### Sub-Agent 5: Footer 컴포넌트

- 링크 구조 정리
- 소셜 링크 컴포넌트화
- SEO 최적화
- 테스트 코드 작성 (`tests/unit/components/Footer.test.tsx`)
- 컴포넌트 문서 작성 (`docs/components/Footer.md`)

## 공통 작업 항목

각 Sub-Agent는 다음을 포함해야 합니다:

1. **리팩토링**

- 코드 가독성 향상
- 매직 넘버/문자열 상수화
- prop 타입 명확화

2. **스타일링**

- Tailwind 클래스 최적화
- 반응형 디자인 개선
- 다크모드 지원 강화

3. **테스트 코드**

- 렌더링 테스트
- 사용자 상호작용 테스트
- 접근성 테스트 (axe-core)

4. **문서화**

- Props 인터페이스 설명
- 사용 예시
- 스타일 커스터마이징 가이드
- 접근성 고려사항

## 예상 결과물

### 업데이트된 컴포넌트 파일

- `src/components/Hero.tsx`
- `src/components/Features.tsx`
- `src/components/Services.tsx`
- `src/components/Header.tsx`
- `src/components/Footer.tsx`

### 테스트 파일

- `tests/unit/components/Hero.test.tsx`
- `tests/unit/components/Features.test.tsx`
- `tests/unit/components/Services.test.tsx`
- `tests/unit/components/Header.test.tsx`
- `tests/unit/components/Footer.test.tsx`

### 문서 파일

- `docs/components/Hero.md`
- `docs/components/Features.md`
- `docs/components/Services.md`
- `docs/components/Header.md`
- `docs/components/Footer.md`
- `docs/components/README.md` (컴포넌트 문서 인덱스)

### To-dos

- [ ] Hero 컴포넌트 리팩토링 + 테스트 + 문서
- [ ] Features 컴포넌트 리팩토링 + 테스트 + 문서
- [ ] Services 컴포넌트 리팩토링 + 테스트 + 문서
- [ ] Header 컴포넌트 리팩토링 + 테스트 + 문서
- [ ] Footer 컴포넌트 리팩토링 + 테스트 + 문서
- [ ] 컴포넌트 문서 인덱스 생성
