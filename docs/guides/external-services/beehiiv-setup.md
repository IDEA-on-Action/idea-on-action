# Beehiiv 설정 가이드
## 뉴스레터 플랫폼 (Optional)

**작성일**: 2025-11-14
**목적**: 뉴스레터 구독 및 발송 관리 (P3 - Optional)
**소요 시간**: 20분

---

## 📋 개요

### Beehiiv란?
- 최신 뉴스레터 플랫폼 (Substack 대안)
- 임베드 위젯 제공
- 자동화 워크플로우
- 무료 티어: **구독자 2,500명**

### 왜 Beehiiv인가?
- ✅ 무료 티어 충분 (초기 2년 사용 가능)
- ✅ 임베드 위젯 간단 (코드 복사만)
- ✅ 이메일 템플릿 제공
- ✅ 분석 대시보드 (오픈율, 클릭율)

### 제한사항
- 무료 티어: 구독자 2,500명 (초과 시 $39/month)
- 커스터마이징 제한 (Pro 플랜 필요)
- 발신자 도메인: `@mail.beehiiv.com` (무료 티어)

---

## 🚀 설정 단계

### Step 1: Beehiiv 계정 생성

**1.1. Beehiiv 가입**

```
https://www.beehiiv.com/signup
```

- 이메일 또는 Google 계정으로 가입
- Publication Name: `IDEA on Action`
- Publication URL: `ideaonaction` (subdomain)

**1.2. 플랜 선택**

- **Free Plan** 선택 (구독자 2,500명)
- 카드 등록 불필요

---

### Step 2: 임베드 위젯 생성

**2.1. Grow 메뉴 이동**

대시보드 → **Grow** → **Embed Forms**

**2.2. 새 폼 생성**

1. **Create Embed Form** 클릭
2. Form Type: **Inline** (Footer용)
3. Form Name: `Footer Subscription`

**2.3. 디자인 커스터마이징**

**Colors**:
- Primary Color: `#3b82f6` (브랜드 Blue)
- Background: `Transparent`
- Text: `Inherit` (부모 색상 따라가기)

**Fields**:
- Email (필수)
- Name (선택사항, 추천: 체크 해제)

**Button Text**: "구독하기"

**Success Message**: "뉴스레터 구독 신청 완료! 📬"

**2.4. 임베드 코드 복사**

**Code** 탭:
```html
<iframe
  src="https://embeds.beehiiv.com/YOUR_EMBED_ID"
  data-test-id="beehiiv-embed"
  width="100%"
  height="320"
  frameborder="0"
  scrolling="no"
  style="border-radius: 4px; border: 2px solid #e5e5e5; margin: 0; background-color: transparent;"
></iframe>
```

---

### Step 3: Footer에 통합

**3.1. BeehiivWidget 컴포넌트 생성**

파일: `src/components/newsletter/BeehiivWidget.tsx`

```tsx
interface BeehiivWidgetProps {
  embedId: string;
  height?: number;
}

export function BeehiivWidget({ embedId, height = 320 }: BeehiivWidgetProps) {
  return (
    <div className="w-full">
      <iframe
        src={`https://embeds.beehiiv.com/${embedId}`}
        data-test-id="beehiiv-embed"
        width="100%"
        height={height}
        className="border-2 border-border rounded-lg"
        style={{
          margin: 0,
          backgroundColor: 'transparent',
        }}
      />
    </div>
  );
}
```

**3.2. Footer에 추가**

파일: `src/components/layout/Footer.tsx`

```tsx
import { BeehiivWidget } from '@/components/newsletter/BeehiivWidget';

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* 기존 컬럼들 */}

          {/* Newsletter 컬럼 */}
          <div>
            <h3 className="font-bold mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              주간 프로젝트 소식과 인사이트를 받아보세요
            </p>
            <BeehiivWidget
              embedId={import.meta.env.VITE_BEEHIIV_EMBED_ID}
              height={220}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
```

**3.3. 환경변수 설정**

파일: `.env.local`

```bash
VITE_BEEHIIV_EMBED_ID="YOUR_EMBED_ID"
```

---

### Step 4: 첫 뉴스레터 작성 (Optional)

**4.1. Posts 메뉴 이동**

대시보드 → **Posts** → **New Post**

**4.2. 뉴스레터 작성**

- Subject: `📬 IDEA on Action Weekly Recap #1`
- Preview Text: `이번 주 프로젝트 진행 현황과 배운 것들`
- Body: Markdown 에디터 사용

**예시 구조**:
```markdown
# Weekly Recap #1

안녕하세요! 👋

이번 주 IDEA on Action의 소식을 전해드립니다.

## 🚀 This Week

- **Sprint 1 완료**: Home 페이지 강화, SEO 최적화
- **OG Image 생성**: Playwright 자동 생성 스크립트 구현
- **GitHub Actions**: Weekly Recap 자동화 워크플로우

## 📚 Learned

- PostgreSQL RLS 정책 디버깅
- Vite manualChunks로 번들 크기 최적화
- Giscus 댓글 시스템 통합

## 📅 Next Week

- Sprint 2 시작: Supabase 연동 강화
- Giscus 댓글 기능 추가
- Work with Us 폼 구현

감사합니다! 🙏

---

IDEA on Action
www.ideaonaction.ai
```

**4.3. 발송 설정**

- **Send Date**: Immediately 또는 Schedule (월요일 오전 9시)
- **Audience**: All Subscribers
- **Send Test Email**: 자신에게 테스트 발송

**4.4. 발송**

**Publish & Send** 클릭 → 구독자에게 이메일 발송

---

## 🔄 대안: Supabase 기반 자체 구독 시스템

Beehiiv 대신 Supabase로 간단히 구현 가능 (권장):

### Step 1: 테이블 생성

```sql
-- newsletter_subscriptions 테이블 (이미 존재)
CREATE TABLE newsletter_subscriptions (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

-- RLS 정책
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe"
  ON newsletter_subscriptions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read subscriptions"
  ON newsletter_subscriptions FOR SELECT
  USING (true);
```

### Step 2: NewsletterForm 컴포넌트

파일: `src/components/newsletter/NewsletterForm.tsx`

```tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const newsletterSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요'),
});

type NewsletterForm = z.infer<typeof newsletterSchema>;

export function NewsletterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<NewsletterForm>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterForm) => {
    setIsLoading(true);

    try {
      // 중복 확인
      const { data: existing } = await supabase
        .from('newsletter_subscriptions')
        .select('id')
        .eq('email', data.email)
        .single();

      if (existing) {
        toast.info('이미 구독 중입니다');
        return;
      }

      // 구독 저장
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert({ email: data.email });

      if (error) throw error;

      toast.success('뉴스레터 구독 신청 완료! 📬');
      reset();
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error('구독 신청에 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <Input
        type="email"
        placeholder="your@email.com"
        {...register('email')}
        disabled={isLoading}
      />
      {errors.email && (
        <p className="text-sm text-destructive">{errors.email.message}</p>
      )}
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? '구독 중...' : '구독하기'}
      </Button>
    </form>
  );
}
```

### Step 3: Footer에 통합

```tsx
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';

<div>
  <h3 className="font-bold mb-4">Newsletter</h3>
  <p className="text-sm text-muted-foreground mb-4">
    주간 프로젝트 소식과 인사이트를 받아보세요
  </p>
  <NewsletterForm />
</div>
```

### Step 4: Weekly Recap 발송 (Resend 활용)

**주간 요약 → 구독자 이메일 발송**은 별도 워크플로우로 구현 (Sprint 3 범위)

---

## ✅ 검증

### Beehiiv 위젯 테스트

1. `npm run dev` 실행
2. Footer 확인 → Beehiiv 위젯 로드됨
3. 테스트 이메일 입력 → "구독하기" 클릭
4. Beehiiv 대시보드 → **Subscribers** 확인

### Supabase 자체 시스템 테스트

1. Newsletter 폼 제출
2. Supabase 대시보드 → `newsletter_subscriptions` 테이블 확인
3. 중복 이메일 제출 → "이미 구독 중입니다" 토스트

---

## 📊 완료 체크리스트

### Beehiiv 사용 시
- [ ] Beehiiv 계정 생성 및 Publication 설정
- [ ] 임베드 위젯 생성 및 코드 복사
- [ ] `.env.local`에 `VITE_BEEHIIV_EMBED_ID` 추가
- [ ] Footer에 위젯 통합
- [ ] 테스트 구독 → Beehiiv 대시보드 확인

### Supabase 자체 시스템 사용 시 (권장)
- [ ] `newsletter_subscriptions` 테이블 존재 확인
- [ ] RLS 정책 설정 (이미 완료됨, Sprint 1)
- [ ] `NewsletterForm` 컴포넌트 생성
- [ ] Footer에 폼 통합
- [ ] 테스트 구독 → Supabase 테이블 확인

---

## 💡 권장 사항

**Sprint 2에서는 Supabase 자체 시스템 권장** ✅

**이유**:
1. **빠른 구현**: BeehiivWidget보다 간단 (15분 vs 5분)
2. **데이터 소유권**: 구독자 데이터를 자체 DB에 저장
3. **통합 용이**: 기존 Supabase 인프라 활용
4. **비용 절감**: Beehiiv 무료 티어 제한 회피

**Beehiiv는 나중에**:
- Sprint 3 또는 그 이후에 추가 고려
- 구독자 1,000명 초과 시 전문 플랫폼 필요
- 이메일 템플릿, A/B 테스트 등 고급 기능 필요 시

---

## 📝 참고 자료

- **Beehiiv 공식 사이트**: https://www.beehiiv.com/
- **Beehiiv 문서**: https://www.beehiiv.com/docs
- **Embed Forms 가이드**: https://www.beehiiv.com/docs/embed-forms

---

**문서 변경 이력**:
- 2025-11-14: 초안 작성 (v1.0)
