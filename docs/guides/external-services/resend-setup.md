# Resend 설정 가이드
## 이메일 발송 서비스

**작성일**: 2025-11-14
**목적**: Work with Us 폼 제출 시 관리자 이메일 알림 발송
**소요 시간**: 30분 (도메인 검증 포함 24-48시간)

---

## 📋 개요

### Resend란?
- 개발자 친화적 이메일 API 서비스
- 간단한 REST API
- React Email 템플릿 지원
- 무료 티어: **월 3,000 이메일**

### 왜 Resend인가?
- ✅ 무료 티어 충분 (월 100개 문의 가정)
- ✅ 간단한 API (SendGrid 대비)
- ✅ 도메인 검증 쉬움
- ✅ React Email 템플릿 지원
- ✅ 전송률 높음 (스팸 필터링 우회)

### 제한사항
- 무료 티어: 월 3,000 이메일 (초과 시 유료 전환 필요)
- 도메인 검증 필수 (DNS 설정 24-48시간 소요)
- 일일 전송 제한: 100 이메일/일 (무료 티어)

---

## 🚀 설정 단계

### Step 1: Resend 계정 생성

**1.1. Resend 가입**

```
https://resend.com/signup
```

- GitHub 계정으로 가입 권장 (OAuth)
- 이메일 인증 완료

**1.2. 프로젝트 생성**

1. 대시보드 → **Create Project**
2. Project Name: `IDEA on Action`
3. **Create** 클릭

---

### Step 2: 도메인 검증

**2.1. 도메인 추가**

1. 대시보드 → **Domains** 탭
2. **Add Domain** 클릭
3. 도메인 입력: `ideaonaction.ai`
4. **Add Domain** 클릭

**2.2. DNS 레코드 설정**

Resend가 제공하는 DNS 레코드를 복사:

**SPF 레코드** (TXT):
```
Name: @
Type: TXT
Value: v=spf1 include:spf.resend.com ~all
```

**DKIM 레코드** (TXT):
```
Name: resend._domainkey
Type: TXT
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQ... (Resend 제공)
```

**DMARC 레코드** (TXT):
```
Name: _dmarc
Type: TXT
Value: v=DMARC1; p=none; rua=mailto:dmarc@ideaonaction.ai
```

**2.3. DNS 등록**

도메인 등록 업체 (예: Cloudflare, GoDaddy, Namecheap):

1. DNS 관리 페이지 이동
2. 위 3개 TXT 레코드 추가
3. **Save** 클릭

**DNS 전파 대기**: 24-48시간 소요 (보통 1-2시간 내 완료)

**2.4. 검증 확인**

Resend 대시보드:
- **Check Verification** 버튼 클릭
- 상태가 "Verified" 🟢로 변경될 때까지 대기

**검증 실패 시**: DNS 레코드 다시 확인 (`dig TXT ideaonaction.ai`)

---

### Step 3: API Key 발급

**3.1. API Key 생성**

1. 대시보드 → **API Keys** 탭
2. **Create API Key** 클릭
3. Name: `Production API Key`
4. Permission: **Full Access** (권장) 또는 **Sending Access**
5. **Create** 클릭

**3.2. API Key 복사**

```
re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**⚠️ 주의**: API Key는 한 번만 표시됩니다. 안전한 곳에 저장하세요!

---

### Step 4: 환경변수 설정

**4.1. .env.local 파일 수정**

프로젝트 루트 디렉토리:
```bash
# .env.local (기존 파일에 추가)

# Resend
VITE_RESEND_FROM_EMAIL="noreply@ideaonaction.ai"
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

**⚠️ 중요**: `RESEND_API_KEY`는 `VITE_` 접두사 없음 (서버 전용)

**4.2. GitHub Secrets 추가**

GitHub 리포지토리 → **Settings** → **Secrets and variables** → **Actions**:

```
Name: RESEND_API_KEY
Value: re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**4.3. Vercel 환경변수 추가**

Vercel 대시보드:
1. Project → **Settings** → **Environment Variables**
2. `RESEND_API_KEY` 추가
3. **Production**, **Preview** 체크 (Development는 로컬 .env 사용)

---

### Step 5: 이메일 발송 함수 작성

**5.1. Resend SDK 설치**

```bash
npm install resend
```

**5.2. 이메일 발송 함수 생성**

파일: `src/lib/email.ts`

```typescript
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

/**
 * Work with Us 문의 이메일 발송
 */
export async function sendWorkWithUsEmail(data: {
  name: string;
  email: string;
  company?: string;
  package: string;
  budget?: string;
  brief: string;
}) {
  try {
    const { data: result, error } = await resend.emails.send({
      from: 'IDEA on Action <noreply@ideaonaction.ai>',
      to: ['sinclairseo@gmail.com'],
      replyTo: data.email,
      subject: `[IDEA on Action] 새 문의: ${data.name} - ${data.package}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>새 프로젝트 문의가 접수되었습니다</h2>

          <h3>📋 문의자 정보</h3>
          <ul>
            <li><strong>이름:</strong> ${data.name}</li>
            <li><strong>이메일:</strong> ${data.email}</li>
            ${data.company ? `<li><strong>회사:</strong> ${data.company}</li>` : ''}
          </ul>

          <h3>💼 프로젝트 정보</h3>
          <ul>
            <li><strong>선택 패키지:</strong> ${data.package}</li>
            ${data.budget ? `<li><strong>예산 범위:</strong> ${data.budget}</li>` : ''}
          </ul>

          <h3>📝 프로젝트 브리프</h3>
          <p style="white-space: pre-wrap; background: #f5f5f5; padding: 16px; border-radius: 8px;">
            ${data.brief}
          </p>

          <hr style="margin: 32px 0; border: none; border-top: 1px solid #e5e5e5;" />

          <p style="color: #666; font-size: 14px;">
            이 이메일은 <a href="https://www.ideaonaction.ai/work-with-us">Work with Us</a> 폼에서 자동 발송되었습니다.
          </p>
        </div>
      `,
    });

    if (error) {
      throw new Error(`Resend API error: ${error.message}`);
    }

    return { success: true, id: result?.id };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

/**
 * 뉴스레터 환영 이메일 발송 (Optional)
 */
export async function sendNewsletterWelcomeEmail(email: string) {
  try {
    const { data: result, error } = await resend.emails.send({
      from: 'IDEA on Action Newsletter <newsletter@ideaonaction.ai>',
      to: [email],
      subject: '📬 IDEA on Action 뉴스레터 구독을 환영합니다!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>안녕하세요! 👋</h2>

          <p>
            IDEA on Action 뉴스레터 구독을 환영합니다!<br>
            매주 월요일 아침, 다음과 같은 소식을 전해드립니다:
          </p>

          <ul>
            <li>📊 주간 프로젝트 진행 현황</li>
            <li>💡 새로운 아이디어와 실험</li>
            <li>🚀 프로덕트 릴리스 소식</li>
            <li>📚 배운 것들과 인사이트</li>
          </ul>

          <p>
            첫 번째 뉴스레터는 다음 월요일에 발송됩니다.<br>
            기대해주세요! 🎉
          </p>

          <hr style="margin: 32px 0; border: none; border-top: 1px solid #e5e5e5;" />

          <p style="color: #666; font-size: 14px;">
            구독을 취소하려면 <a href="https://www.ideaonaction.ai/unsubscribe?email=${encodeURIComponent(email)}">여기</a>를 클릭하세요.
          </p>
        </div>
      `,
    });

    if (error) {
      throw new Error(`Resend API error: ${error.message}`);
    }

    return { success: true, id: result?.id };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { success: false, error };
  }
}
```

**5.3. Work with Us 폼에서 호출**

파일: `src/pages/WorkWithUs.tsx`

```typescript
import { sendWorkWithUsEmail } from '@/lib/email';

async function handleSubmit(data: WorkWithUsFormData) {
  // 1. Supabase에 저장
  const { error: dbError } = await supabase
    .from('work_with_us_inquiries')
    .insert({
      name: data.name,
      email: data.email,
      company: data.company,
      package: data.package,
      budget: data.budget,
      brief: data.brief,
    });

  if (dbError) {
    toast.error('문의 접수에 실패했습니다.');
    return;
  }

  // 2. 이메일 발송 (비동기, 실패해도 사용자에게는 성공 표시)
  sendWorkWithUsEmail(data).catch((error) => {
    console.error('Email send failed (non-blocking):', error);
    // 관리자 대시보드에 로그 남기기 (Optional)
  });

  // 3. 사용자에게 성공 메시지
  toast.success('문의가 접수되었습니다. 영업일 기준 2일 내 답변드리겠습니다.');
  reset(); // 폼 초기화
}
```

---

## ✅ 검증

### 로컬 테스트

**1. .env.local 확인**

```bash
cat .env.local | grep RESEND
```

출력:
```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_RESEND_FROM_EMAIL=noreply@ideaonaction.ai
```

**2. 테스트 이메일 발송**

파일: `scripts/test-resend.js`

```javascript
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  const { data, error } = await resend.emails.send({
    from: 'IDEA on Action <noreply@ideaonaction.ai>',
    to: ['sinclairseo@gmail.com'],
    subject: '[TEST] Resend 설정 테스트',
    html: '<p>Resend가 정상적으로 설정되었습니다! ✅</p>',
  });

  if (error) {
    console.error('❌ Error:', error);
  } else {
    console.log('✅ Email sent successfully!');
    console.log('Email ID:', data.id);
  }
}

testEmail();
```

실행:
```bash
node scripts/test-resend.js
```

**3. 이메일 수신 확인**

`sinclairseo@gmail.com` 메일함 확인:
- 제목: `[TEST] Resend 설정 테스트`
- 발신자: `IDEA on Action <noreply@ideaonaction.ai>`
- 스팸 폴더 확인 (처음에는 스팸 가능)

---

## 🐛 문제 해결

### Q1: "Domain not verified" 에러

**원인**: 도메인 검증 미완료
**해결**:
1. Resend 대시보드 → Domains → **Check Verification**
2. DNS 레코드 확인: `dig TXT ideaonaction.ai`
3. DNS 전파 대기 (최대 48시간)

---

### Q2: 이메일이 스팸 폴더로 감

**원인**: 발신자 평판 부족
**해결**:
1. SPF, DKIM, DMARC 레코드 확인
2. 이메일 내용에 스팸 키워드 제거
3. 수신자가 "스팸 아님" 처리
4. 발송량 점진적으로 증가 (초기 5-10개/일)

---

### Q3: "Invalid API key" 에러

**원인**: API Key가 잘못됨 또는 만료됨
**해결**:
1. Resend 대시보드 → API Keys → 새 키 발급
2. `.env.local` 업데이트
3. 서버 재시작 (`npm run dev`)

---

### Q4: 이메일 발송 실패 (429 Rate Limit)

**원인**: 무료 티어 일일 제한 초과 (100 이메일/일)
**해결**:
1. Resend 대시보드 → Usage 확인
2. 발송 로직에 Throttling 추가
3. 유료 플랜 검토 (Pro: $20/month, 50,000 이메일)

---

### Q5: 환경변수가 undefined

**원인**: Vite는 `VITE_` 접두사 필요, 서버 전용 변수는 노출 금지
**해결**:
- 클라이언트에서 사용: `VITE_RESEND_FROM_EMAIL` ✅
- 서버 전용 (API Key): `RESEND_API_KEY` (VITE_ 없음) ✅

---

## 📊 완료 체크리스트

Sprint 2 구현 전에 다음 항목을 **모두** 완료해야 합니다:

### Resend 계정 설정
- [ ] Resend 계정 생성 및 프로젝트 생성
- [ ] API Key 발급 및 안전 보관

### 도메인 검증
- [ ] DNS 레코드 3개 추가 (SPF, DKIM, DMARC)
- [ ] DNS 전파 대기 (24-48시간)
- [ ] Resend 대시보드에서 "Verified" 상태 확인

### 환경변수
- [ ] `.env.local`에 Resend 환경변수 추가
- [ ] GitHub Secrets에 `RESEND_API_KEY` 추가
- [ ] Vercel 환경변수에 `RESEND_API_KEY` 추가

### 코드 준비
- [ ] `resend` 패키지 설치
- [ ] `src/lib/email.ts` 생성 (선택사항, 구현 시 생성)

### 검증
- [ ] `scripts/test-resend.js` 실행 → 이메일 수신 확인
- [ ] 스팸 폴더 아닌 받은편지함에 도착 확인

---

## 💰 비용 계획

### 무료 티어 (현재)
- 월 3,000 이메일
- 일일 100 이메일
- 비용: **$0/month**

**예상 사용량**:
- Work with Us 문의: ~10 이메일/월
- Newsletter 환영 메일: ~50 이메일/월
- **총 60 이메일/월** (여유 충분)

### 유료 전환 시점
- 구독자 1,000명 도달 시 (월 4,000 이메일)
- Pro 플랜: $20/month (50,000 이메일)

---

## 📝 참고 자료

- **Resend 공식 사이트**: https://resend.com/
- **Resend 문서**: https://resend.com/docs
- **Resend API 레퍼런스**: https://resend.com/docs/api-reference
- **React Email**: https://react.email/ (템플릿 라이브러리)

---

**문서 변경 이력**:
- 2025-11-14: 초안 작성 (v1.0)
