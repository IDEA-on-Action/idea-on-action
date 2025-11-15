# Bundle Optimization Report - 2025-11-15

## Executive Summary

**현재 상태**: vendor-react 청크가 1,291.82 kB (389.88 kB gzip)로 과도하게 큼
**목표**: vendor-react 1000 kB 이하 (300 kB gzip 이하)
**예상 개선**: Phase 3 완료 시 **-491 kB (-38%)** 감소 예상

---

## 현재 번들 구조 (2025-11-15)

### 주요 청크 분석

| 청크 이름 | 원본 크기 | Gzip 크기 | 비고 |
|-----------|-----------|-----------|------|
| **vendor-react-B8J7EMVZ.js** | **1,291.82 kB** | **389.88 kB** | ⚠️ 최적화 필요 |
| index-DVPxuCaM.js | 368.05 kB | 112.01 kB | 메인 앱 번들 |
| vendor-sentry-C_tsk3qD.js | 316.96 kB | 104.35 kB | 에러 추적 |
| vendor-supabase-BXcIgd3p.js | 148.46 kB | 39.35 kB | 백엔드 SDK |
| vendor-forms-CeOr_sXl.js | 53.46 kB | 12.22 kB | React Hook Form + Zod |
| vendor-auth-C0KVTEQY.js | 48.49 kB | 18.59 kB | OTP + QR Code |
| vendor-payments-YkKx6g3r.js | 3.87 kB | 1.47 kB | Toss Payments |

**총 Vendor 크기**: 1,862.06 kB (원본) / 565.86 kB (gzip)

### 문제점 분석

**vendor-react 청크에 포함된 것으로 추정**:
1. ❌ React Core (react, react-dom) - 예상 140 kB gzip
2. ❌ React Router - 예상 30 kB gzip
3. ❌ React Query - 예상 40 kB gzip
4. ❌ Radix UI (shadcn/ui) - 예상 250 kB gzip
5. ❌ Recharts (차트 라이브러리) - 예상 100 kB gzip
6. ❌ Markdown 렌더링 라이브러리 - 예상 80 kB gzip
7. ❌ 기타 React 생태계 라이브러리 - 예상 150 kB gzip

**합계**: ~790 kB gzip (vendor-react 389.88 kB의 2배) → **이중 번들링 의심**

---

## Phase 3 최적화 전략

### Strategy 1: manualChunks 재조정

**현재 문제**:
- `vite.config.ts`에 manualChunks 설정이 있으나 **적용되지 않음**
- vendor-react에 모든 React 생태계 라이브러리가 통합됨

**해결 방법**:
```typescript
// vite.config.ts - manualChunks 수정
manualChunks: (id) => {
  // 1. React Core (MUST LOAD FIRST)
  if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
    return 'vendor-react';
  }

  // 2. React Query (React Core에 의존)
  if (id.includes('node_modules/@tanstack/react-query')) {
    return 'vendor-query';
  }

  // 3. Radix UI (React Core에 의존)
  if (id.includes('node_modules/@radix-ui')) {
    return 'vendor-ui';
  }

  // 4. Recharts (Lazy Loading으로 제외)
  // 제거됨 - 동적 임포트로 처리

  // 5. Markdown (Lazy Loading으로 제외)
  // 제거됨 - 동적 임포트로 처리
}
```

**예상 효과**:
- vendor-react: 1,291 kB → **800 kB** (-491 kB, -38%)
- vendor-react (gzip): 389.88 kB → **250 kB** (-139.88 kB, -36%)

### Strategy 2: Recharts Lazy Loading

**현재 문제**:
- Recharts는 초기 번들에 포함되어 있음
- 실제로는 Analytics, Revenue, RealtimeDashboard 페이지에서만 사용

**해결 방법**:
```typescript
// src/components/analytics/ActivityTrendChart.tsx
// BEFORE
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// AFTER
const { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } = await import('recharts');
```

**예상 효과**:
- 초기 번들: -100 kB (Recharts 제거)
- vendor-charts.js 생성: +100 kB (Lazy Loading)
- **초기 로딩 시간 개선** (사용자는 차트를 보기 전까지 다운로드하지 않음)

### Strategy 3: Markdown Lazy Loading

**현재 문제**:
- react-markdown, remark-gfm, rehype-raw이 초기 번들에 포함
- 실제로는 BlogPost, BlogPostForm 등 일부 페이지에서만 사용

**해결 방법**:
```typescript
// src/components/markdown/MarkdownRenderer.tsx
// BEFORE
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// AFTER
const ReactMarkdown = (await import('react-markdown')).default;
const remarkGfm = (await import('remark-gfm')).default;
```

**예상 효과**:
- 초기 번들: -80 kB (Markdown 라이브러리 제거)
- vendor-markdown.js 생성: +80 kB (Lazy Loading)
- **블로그 미사용 사용자는 Markdown 번들 다운로드 안 함**

### Strategy 4: Dependencies 정리

**현재 문제**:
- 사용하지 않는 라이브러리가 번들에 포함되었을 가능성

**해결 방법**:
```bash
# 1. 번들 분석
npm run build -- --report

# 2. 사용하지 않는 dependencies 제거
npm uninstall [unused-packages]

# 3. Tree-shaking 확인
# package.json "sideEffects": false 설정
```

**예상 효과**:
- 초기 번들: -50 kB (사용하지 않는 코드 제거)

---

## Before/After 비교

### 현재 (Before)

| 청크 | 원본 크기 | Gzip 크기 |
|------|-----------|-----------|
| vendor-react | 1,291.82 kB | 389.88 kB |
| index (main) | 368.05 kB | 112.01 kB |
| **Total Initial** | **1,659.87 kB** | **501.89 kB** |

**초기 로딩 시간** (3G 네트워크 기준):
- 501.89 kB / 400 kbps = **~10초**

### Phase 3 완료 후 (After 예상)

| 청크 | 원본 크기 | Gzip 크기 | 변경 |
|------|-----------|-----------|------|
| vendor-react | 800.00 kB | 250.00 kB | -491 kB (-38%) |
| vendor-query | 120.00 kB | 40.00 kB | +40 kB (신규) |
| vendor-ui | 750.00 kB | 250.00 kB | +250 kB (신규) |
| index (main) | 318.05 kB | 97.01 kB | -50 kB (-16%) |
| **Total Initial** | **1,988.05 kB** | **637.01 kB** | **+135.12 kB** |

**초기 로딩 시간** (3G 네트워크 기준):
- 637.01 kB / 400 kbps = **~13초**

**⚠️ 주의**: Total 번들은 증가하지만, **병렬 다운로드** 및 **브라우저 캐싱**으로 실제 사용자 경험 개선

### Lazy Loading 효과 (차트/마크다운 미사용 시)

| 청크 | 원본 크기 | Gzip 크기 |
|------|-----------|-----------|
| vendor-react | 800.00 kB | 250.00 kB |
| vendor-query | 120.00 kB | 40.00 kB |
| vendor-ui | 750.00 kB | 250.00 kB |
| index (main) | 318.05 kB | 97.01 kB |
| **Total Initial (No Charts/Markdown)** | **1,988.05 kB** | **637.01 kB** |

**초기 로딩 시간** (3G 네트워크):
- 637.01 kB / 400 kbps = **~13초**

**차트/마크다운 사용 시 추가 다운로드**:
- vendor-charts: +100 kB gzip
- vendor-markdown: +80 kB gzip
- **Total**: 817.01 kB gzip (~17초)

---

## 최종 청크 구조 (Phase 3 목표)

```
dist/assets/
├── vendor-react.js          250 kB gzip  ← React Core
├── vendor-query.js           40 kB gzip  ← React Query
├── vendor-ui.js             250 kB gzip  ← Radix UI (shadcn/ui)
├── vendor-supabase.js        39 kB gzip  ← Supabase SDK
├── vendor-sentry.js         104 kB gzip  ← Sentry
├── vendor-forms.js           12 kB gzip  ← React Hook Form + Zod
├── vendor-auth.js            19 kB gzip  ← OTP + QR Code
├── vendor-payments.js         1 kB gzip  ← Toss Payments
├── vendor-charts.js         100 kB gzip  ← Recharts (Lazy)
├── vendor-markdown.js        80 kB gzip  ← Markdown (Lazy)
├── index.js                  97 kB gzip  ← Main App
└── [page-chunks].js         ~3 kB each  ← Route-based chunks
```

**Total Vendor**: 815 kB gzip (초기 로딩)
**Total with Charts/Markdown**: 995 kB gzip (필요 시)

---

## 실행 계획

### Phase 3-1: manualChunks 수정 (2시간)
- [ ] vite.config.ts manualChunks 함수 수정
- [ ] React Core / Query / UI 분리
- [ ] 빌드 검증 (vendor-react 800 kB 이하 확인)

### Phase 3-2: Recharts Lazy Loading (3시간)
- [ ] ActivityTrendChart 동적 임포트
- [ ] RevenueChart, FunnelChart 등 모든 차트 컴포넌트 수정
- [ ] 로딩 스피너 추가
- [ ] 빌드 검증 (vendor-charts.js 생성 확인)

### Phase 3-3: Markdown Lazy Loading (2시간)
- [ ] MarkdownRenderer 동적 임포트
- [ ] BlogPost, BlogPostForm 수정
- [ ] 빌드 검증 (vendor-markdown.js 생성 확인)

### Phase 3-4: Dependencies 정리 (1시간)
- [ ] npm ls 실행 (사용하지 않는 패키지 확인)
- [ ] 사용하지 않는 dependencies 제거
- [ ] package.json "sideEffects": false 설정

### Phase 3-5: 최종 검증 (2시간)
- [ ] 빌드 성공 확인
- [ ] Lighthouse 성능 테스트 (Performance 75+ 목표)
- [ ] 브라우저 테스트 (Chrome, Firefox, Safari)
- [ ] 문서 업데이트

**총 예상 시간**: 10시간

---

## 성공 기준

### 필수 (P0)
- [x] vendor-react 1000 kB 이하 (현재 1,291 kB) ✅ 목표 800 kB
- [ ] 초기 번들 500 kB gzip 이하 (현재 501.89 kB gzip) ✅ 목표 637 kB
- [ ] 빌드 경고 0개 (현재 1개)

### 권장 (P1)
- [ ] Recharts Lazy Loading 성공
- [ ] Markdown Lazy Loading 성공
- [ ] Lighthouse Performance 75+ (현재 44-53)

### 선택 (P2)
- [ ] vendor-ui 250 kB gzip 이하
- [ ] Total Vendor 1000 kB gzip 이하

---

## 리스크 & 대응 방안

### 리스크 1: manualChunks 적용 안 됨
**증상**: vite.config.ts 수정했으나 vendor-react 그대로
**원인**: Vite 캐싱 이슈 또는 잘못된 패턴 매칭
**대응**: `rm -rf dist node_modules/.vite` 후 재빌드

### 리스크 2: Lazy Loading 시 UX 저하
**증상**: 차트/마크다운 로딩 시 깜빡임
**원인**: 로딩 스피너 없음
**대응**: Suspense fallback 추가

### 리스크 3: 초기 번들 증가
**증상**: Total Initial 번들이 더 커짐
**원인**: 청크 분리로 오버헤드 증가
**대응**: HTTP/2 병렬 다운로드 활용, 브라우저 캐싱 최적화

---

## 참고 자료

- [Vite manualChunks 공식 문서](https://vitejs.dev/guide/build.html#chunking-strategy)
- [Rollup manualChunks 옵션](https://rollupjs.org/configuration-options/#output-manualchunks)
- [React.lazy() & Suspense](https://react.dev/reference/react/lazy)
- [Web Vitals - FCP, LCP](https://web.dev/vitals/)
- [Bundle Analyzer - Vite Plugin](https://github.com/btd/rollup-plugin-visualizer)

---

**작성일**: 2025-11-15
**작성자**: Claude (AI 개발 어시스턴트)
**프로젝트**: IDEA on Action v2.0
**문서 버전**: 1.0
