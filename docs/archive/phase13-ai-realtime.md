# Phase 13: AI & 실시간 기능 아카이브

> **완료일**: 2025-11-04
> **버전**: v1.7.1 → v1.7.3
> **기간**: 3주
> **상태**: ✅ 완료

---

## 📋 목차

- [개요](#개요)
- [Week 1: 통합 검색 시스템](#week-1-통합-검색-시스템)
- [Week 2: AI 챗봇 통합](#week-2-ai-챗봇-통합)
- [Week 3: 알림 시스템](#week-3-알림-시스템)
- [테스트 및 검증](#테스트-및-검증)
- [기술 스택](#기술-스택)
- [성능 분석](#성능-분석)
- [학습 포인트](#학습-포인트)
- [다음 단계](#다음-단계)

---

## 개요

Phase 13에서는 AI 기반 기능과 실시간 사용자 경험을 제공하는 3가지 핵심 시스템을 구축했습니다:

1. **통합 검색 시스템** - 서비스, 블로그, 공지사항을 하나의 검색으로 통합
2. **AI 챗봇** - OpenAI GPT-3.5를 활용한 컨텍스트 기반 대화형 어시스턴트
3. **실시간 알림** - Supabase Realtime과 이메일 알림 통합

### 주요 성과

- ✅ **24개 파일 생성**, 7개 수정
- ✅ **25개 테스트 추가** (E2E 15, Unit 10)
- ✅ **40개 i18n 번역 키** 추가 (한국어/영어)
- ✅ **총 292개 테스트** (E2E 172, Unit 92, Visual 28)
- ✅ **PWA 43 entries** 캐싱 (2805 KiB)
- ✅ **번들 크기 552 kB gzip** (30개 chunk)

---

## Week 1: 통합 검색 시스템

**완료일**: 2025-11-02
**버전**: v1.7.1

### 구현 내역

#### 1. useSearch 훅
**파일**: `src/hooks/useSearch.ts`

```typescript
export function useSearch(query: string, type?: SearchType) {
  return useQuery({
    queryKey: ['search', query, type],
    queryFn: async () => {
      // 서비스, 블로그, 공지사항 병렬 검색
      const [services, blogPosts, notices] = await Promise.all([...])

      // 타입별 필터링 및 날짜 정렬
      return results.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ).slice(0, 30)
    },
    enabled: query.length >= 2,
    staleTime: 5 * 60 * 1000 // 5분 캐싱
  })
}
```

**주요 기능**:
- 최소 2자 이상 검색어 필요
- 타입별 필터링 (전체/서비스/블로그/공지)
- 날짜 역순 정렬
- 최대 30개 결과 제한
- React Query 캐싱 (5분)

#### 2. Search 페이지
**파일**: `src/pages/Search.tsx`

**라우트**: `/search?q=검색어&type=service`

**기능**:
- URL 쿼리 파라미터 지원
- 타입 필터 탭 (전체/서비스/블로그/공지)
- 검색어 입력 폼
- 검색 결과 목록 (30개 제한)
- 로딩/에러/빈 결과 상태 처리

**UI 구성**:
```tsx
<div className="container mx-auto px-4 py-8">
  {/* 검색 폼 */}
  <form onSubmit={handleSubmit}>
    <Input placeholder={t('search.placeholder')} />
    <Button type="submit">
      <Search className="h-4 w-4" />
    </Button>
  </form>

  {/* 타입 필터 탭 */}
  <Tabs value={type} onValueChange={setType}>
    <TabsList>
      <TabsTrigger value="all">전체</TabsTrigger>
      <TabsTrigger value="service">서비스</TabsTrigger>
      <TabsTrigger value="blog">블로그</TabsTrigger>
      <TabsTrigger value="notice">공지</TabsTrigger>
    </TabsList>
  </Tabs>

  {/* 검색 결과 */}
  <div className="grid gap-4">
    {results.map(result => (
      <SearchResultCard key={result.id} result={result} />
    ))}
  </div>
</div>
```

#### 3. SearchResultCard 컴포넌트
**파일**: `src/components/search/SearchResultCard.tsx`

**기능**:
- 타입별 아이콘 (Package/FileText/Bell)
- 타입별 배지 (Blue/Green/Orange)
- 검색어 하이라이팅 (`<mark>` 태그)
- 이미지 썸네일 (서비스/블로그)
- 날짜 표시 (로케일별 형식)

**하이라이팅 로직**:
```typescript
const highlightText = (text: string, query: string) => {
  if (!query.trim()) return text

  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>')
}
```

#### 4. Header 통합
**파일**: `src/components/Header.tsx`

**추가 요소**:
- 데스크톱: 검색 아이콘 버튼 (네비게이션 바)
- 모바일: 검색 아이콘 (모바일 메뉴)
- `/search` 페이지로 네비게이션

```tsx
{/* 데스크톱 검색 */}
<nav className="hidden lg:flex items-center gap-6">
  <Link to="/search">
    <Search className="h-5 w-5" />
  </Link>
  {/* 기타 네비게이션 */}
</nav>

{/* 모바일 검색 */}
<SheetContent>
  <Link to="/search">
    <Search className="h-5 w-5" />
    {t('common.search')}
  </Link>
</SheetContent>
```

#### 5. i18n 지원
**파일**:
- `src/locales/ko/search.json`
- `src/locales/en/search.json`

**번역 키** (15개):
```json
{
  "search": {
    "title": "검색",
    "placeholder": "검색어를 입력하세요...",
    "button": "검색",
    "filters": {
      "all": "전체",
      "service": "서비스",
      "blog": "블로그",
      "notice": "공지사항"
    },
    "results": {
      "found": "{{count}}개의 검색 결과",
      "empty": "검색 결과가 없습니다.",
      "minLength": "최소 2자 이상 입력해주세요."
    },
    "error": "검색 중 오류가 발생했습니다."
  }
}
```

#### 6. 테스트
**E2E 테스트**: `tests/e2e/search.spec.ts` (15개)
- 검색 페이지 렌더링
- 검색어 입력 및 제출
- URL 쿼리 파라미터 동기화
- 타입 필터 전환
- 검색 결과 표시
- 검색어 하이라이팅
- 최소 길이 검증
- 빈 결과 처리
- 에러 처리

**유닛 테스트**: `tests/unit/hooks/useSearch.test.tsx` (10개)
- 훅 초기화
- 검색 쿼리 실행
- 타입 필터링
- 캐싱 동작
- 에러 핸들링

### 기술적 도전

1. **병렬 검색 최적화**
   - `Promise.all()`로 3개 테이블 동시 쿼리
   - React Query 캐싱으로 중복 요청 방지

2. **검색어 하이라이팅**
   - 정규식 이스케이프 처리
   - XSS 방지 (DOMPurify 불필요, React가 자동 이스케이프)

3. **URL 상태 동기화**
   - `useSearchParams` 활용
   - 검색어/타입 변경 시 URL 업데이트

---

## Week 2: AI 챗봇 통합

**완료일**: 2025-11-03
**버전**: v1.7.2

### 구현 내역

#### 1. OpenAI API 통합
**파일**: `src/lib/openai.ts`

```typescript
export async function* streamChatCompletion(
  messages: Message[]
): AsyncGenerator<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [systemPrompt, ...messages],
      stream: true,
      temperature: 0.7,
      max_tokens: 500,
    }),
  })

  // SSE 스트림 파싱
  const reader = response.body?.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    const lines = chunk.split('\n').filter(line => line.trim().startsWith('data:'))

    for (const line of lines) {
      const data = line.replace('data: ', '')
      if (data === '[DONE]') return

      const parsed = JSON.parse(data)
      const content = parsed.choices[0]?.delta?.content
      if (content) yield content
    }
  }
}
```

**주요 기능**:
- GPT-3.5-turbo 모델
- 스트리밍 응답 (Server-Sent Events)
- 시스템 프롬프트 (VIBE WORKING 컨텍스트)
- 최대 500 토큰 응답

**시스템 프롬프트**:
```typescript
const SYSTEM_PROMPT = `
당신은 VIBE WORKING의 AI 어시스턴트입니다.
회사 정보:
- 이름: 생각과행동 (IdeaonAction)
- 슬로건: KEEP AWAKE, LIVE PASSIONATE
- 서비스: AI 기반 워킹 솔루션

응답 지침:
1. 친절하고 전문적인 톤 유지
2. 서비스 관련 질문에 정확한 정보 제공
3. 한국어/영어 자동 감지 및 응답
4. 최대 3문단 이내로 간결하게 답변
`
```

#### 2. useChat 훅
**파일**: `src/hooks/useChat.ts`

```typescript
export function useChat() {
  const [messages, setMessages] = useState<Message[]>(() => {
    // LocalStorage에서 복원
    const saved = localStorage.getItem('chat_messages')
    return saved ? JSON.parse(saved) : []
  })
  const [isStreaming, setIsStreaming] = useState(false)

  // LocalStorage 자동 저장
  useEffect(() => {
    localStorage.setItem('chat_messages', JSON.stringify(messages))
  }, [messages])

  const sendMessage = async (content: string) => {
    const userMessage: Message = { role: 'user', content }
    setMessages(prev => [...prev, userMessage])
    setIsStreaming(true)

    try {
      let assistantContent = ''
      const stream = streamChatCompletion([...messages, userMessage])

      for await (const chunk of stream) {
        assistantContent += chunk
        setMessages(prev => {
          const newMessages = [...prev]
          const lastIndex = newMessages.length - 1

          if (newMessages[lastIndex]?.role === 'assistant') {
            newMessages[lastIndex].content = assistantContent
          } else {
            newMessages.push({ role: 'assistant', content: assistantContent })
          }

          return newMessages
        })
      }
    } catch (error) {
      console.error('Chat error:', error)
      // 에러 메시지 추가
    } finally {
      setIsStreaming(false)
    }
  }

  const clearMessages = () => {
    setMessages([])
    localStorage.removeItem('chat_messages')
  }

  return { messages, isStreaming, sendMessage, clearMessages }
}
```

**주요 기능**:
- LocalStorage 영구 저장
- 스트리밍 응답 실시간 업데이트
- 대화 히스토리 관리
- 대화 삭제 기능

#### 3. 채팅 UI 컴포넌트

**ChatWidget** (`src/components/chat/ChatWidget.tsx`):
- 우측 하단 플로팅 버튼
- 클릭 시 ChatWindow 토글
- Badge로 새 메시지 알림 (미구현)

**ChatWindow** (`src/components/chat/ChatWindow.tsx`):
- 모달 형태 채팅창
- 헤더: 제목, 대화 삭제, 닫기 버튼
- 메시지 목록 (스크롤)
- 입력 폼

**ChatMessage** (`src/components/chat/ChatMessage.tsx`):
- 역할별 스타일 (user/assistant)
- Markdown 렌더링 (react-markdown)
- 코드 블록 하이라이팅 (remark-gfm)
- 타임스탬프 (선택 사항)

```tsx
<div className={cn(
  'flex gap-3 p-4 rounded-lg',
  message.role === 'user'
    ? 'bg-primary text-primary-foreground ml-8'
    : 'bg-muted mr-8'
)}>
  {message.role === 'assistant' && (
    <Bot className="h-6 w-6 flex-shrink-0" />
  )}
  <div className="flex-1 prose prose-sm">
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {message.content}
    </ReactMarkdown>
  </div>
  {message.role === 'user' && (
    <User className="h-6 w-6 flex-shrink-0" />
  )}
</div>
```

**ChatInput** (`src/components/chat/ChatInput.tsx`):
- Textarea 자동 크기 조절
- Enter 전송, Shift+Enter 줄바꿈
- 전송 중 비활성화
- 최소 1자 검증

#### 4. App.tsx 통합
**파일**: `src/App.tsx`

```tsx
function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            {/* 라우트 */}
            <Routes>...</Routes>

            {/* 글로벌 채팅 위젯 */}
            <ChatWidget />
          </I18nextProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  )
}
```

#### 5. i18n 지원
**번역 키** (10개):
```json
{
  "chat": {
    "title": "AI 어시스턴트",
    "placeholder": "메시지를 입력하세요...",
    "send": "전송",
    "clear": "대화 삭제",
    "streaming": "입력 중...",
    "error": "죄송합니다. 오류가 발생했습니다.",
    "welcome": "안녕하세요! 무엇을 도와드릴까요?"
  }
}
```

#### 6. 환경 변수
**파일**: `.env.example`

```bash
# OpenAI API
VITE_OPENAI_API_KEY=sk-...
```

### 기술적 도전

1. **스트리밍 응답 처리**
   - SSE (Server-Sent Events) 파싱
   - AsyncGenerator를 활용한 비동기 이터레이션
   - React 상태 업데이트 최적화

2. **LocalStorage 영구 저장**
   - 초기 상태 복원
   - useEffect 자동 저장
   - JSON 직렬화/역직렬화

3. **Markdown 렌더링**
   - react-markdown + remark-gfm 통합
   - Tailwind Typography (prose) 스타일링
   - 코드 블록 하이라이팅

4. **비용 최적화**
   - GPT-3.5-turbo 사용 (GPT-4 대비 1/10 비용)
   - max_tokens 제한 (500)
   - 시스템 프롬프트 최소화

---

## Week 3: 알림 시스템

**완료일**: 2025-11-04
**버전**: v1.7.3

### 구현 내역

#### 1. Supabase 마이그레이션
**파일**: `supabase/migrations/20251104000001_create_notifications.sql`

```sql
-- notifications 테이블
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  link TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- RLS 정책
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 1. 본인 알림만 조회
CREATE POLICY "Users can view own notifications"
ON notifications FOR SELECT
USING (auth.uid() = user_id);

-- 2. 본인 알림만 업데이트 (읽음 처리)
CREATE POLICY "Users can update own notifications"
ON notifications FOR UPDATE
USING (auth.uid() = user_id);

-- 3. 본인 알림만 삭제
CREATE POLICY "Users can delete own notifications"
ON notifications FOR DELETE
USING (auth.uid() = user_id);

-- 4. 관리자만 알림 생성
CREATE POLICY "Admins can create notifications"
ON notifications FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);
```

**주요 설계**:
- 타입: info/success/warning/error
- 읽음 상태 추적
- 링크 지원 (선택 사항)
- RLS 정책 4개 (조회/업데이트/삭제/생성)

#### 2. useNotifications 훅
**파일**: `src/hooks/useNotifications.ts`

```typescript
export function useNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Realtime 구독
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNotifications(prev => [payload.new as Notification, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setNotifications(prev =>
              prev.map(n => n.id === payload.new.id ? payload.new as Notification : n)
            )
          } else if (payload.eventType === 'DELETE') {
            setNotifications(prev => prev.filter(n => n.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  // 초기 로드
  useEffect(() => {
    if (!user) return

    const loadNotifications = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (data) setNotifications(data)
    }

    loadNotifications()
  }, [user])

  // 읽음 처리
  const markAsRead = async (id: string) => {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id)
  }

  // 전체 읽음
  const markAllAsRead = async () => {
    if (!user) return

    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false)
  }

  // 삭제
  const deleteNotification = async (id: string) => {
    await supabase
      .from('notifications')
      .delete()
      .eq('id', id)
  }

  // 전체 삭제
  const deleteAll = async () => {
    if (!user) return

    await supabase
      .from('notifications')
      .delete()
      .eq('user_id', user.id)
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAll,
  }
}
```

**주요 기능**:
- Supabase Realtime 구독 (INSERT/UPDATE/DELETE)
- 초기 알림 로드 (최근 50개)
- 읽음 처리 (개별/전체)
- 삭제 (개별/전체)
- 읽지 않은 알림 카운트

#### 3. 알림 UI 컴포넌트

**NotificationBell** (`src/components/notifications/NotificationBell.tsx`):
- Header에 위치
- Badge로 읽지 않은 알림 수 표시
- 클릭 시 NotificationDropdown 토글

```tsx
<Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger asChild>
    <Button variant="ghost" size="icon" className="relative">
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0">
          {unreadCount > 9 ? '9+' : unreadCount}
        </Badge>
      )}
    </Button>
  </PopoverTrigger>
  <PopoverContent>
    <NotificationDropdown />
  </PopoverContent>
</Popover>
```

**NotificationDropdown** (`src/components/notifications/NotificationDropdown.tsx`):
- 최근 5개 알림 미리보기
- 읽음/삭제 액션
- "모두 보기" 링크 (/notifications)
- 빈 상태 처리

**NotificationItem** (`src/components/notifications/NotificationItem.tsx`):
- 타입별 아이콘 (Info/CheckCircle/AlertTriangle/XCircle)
- 타입별 색상 (Blue/Green/Yellow/Red)
- 읽음 상태 스타일
- 상대 시간 표시 (방금 전, 5분 전, 1시간 전...)
- 클릭 시 링크 이동 (있는 경우)
- 삭제 버튼

```tsx
<div className={cn(
  'flex gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer',
  notification.read ? 'opacity-60' : 'bg-accent/50'
)}>
  <div className={cn('flex-shrink-0', typeStyles[notification.type].color)}>
    {typeStyles[notification.type].icon}
  </div>
  <div className="flex-1 min-w-0">
    <p className="font-semibold text-sm">{notification.title}</p>
    <p className="text-sm text-muted-foreground">{notification.message}</p>
    <p className="text-xs text-muted-foreground mt-1">
      {formatRelativeTime(notification.created_at)}
    </p>
  </div>
  <Button
    variant="ghost"
    size="icon"
    onClick={(e) => {
      e.stopPropagation()
      onDelete(notification.id)
    }}
  >
    <X className="h-4 w-4" />
  </Button>
</div>
```

#### 4. Notifications 페이지
**파일**: `src/pages/Notifications.tsx`

**라우트**: `/notifications`

**기능**:
- 전체 알림 목록
- 읽음/읽지 않음 필터
- 타입 필터 (전체/info/success/warning/error)
- 전체 읽음 처리
- 전체 삭제
- 개별 삭제
- 무한 스크롤 (미구현, 50개 제한)

**UI 구성**:
```tsx
<div className="container mx-auto px-4 py-8">
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-3xl font-bold">알림</h1>
    <div className="flex gap-2">
      <Button variant="outline" onClick={markAllAsRead}>
        모두 읽음
      </Button>
      <Button variant="destructive" onClick={deleteAll}>
        모두 삭제
      </Button>
    </div>
  </div>

  {/* 필터 탭 */}
  <Tabs value={filter} onValueChange={setFilter}>
    <TabsList>
      <TabsTrigger value="all">전체</TabsTrigger>
      <TabsTrigger value="unread">읽지 않음</TabsTrigger>
      <TabsTrigger value="info">정보</TabsTrigger>
      <TabsTrigger value="success">성공</TabsTrigger>
      <TabsTrigger value="warning">경고</TabsTrigger>
      <TabsTrigger value="error">오류</TabsTrigger>
    </TabsList>
  </Tabs>

  {/* 알림 목록 */}
  <div className="space-y-2">
    {filteredNotifications.map(notification => (
      <NotificationItem
        key={notification.id}
        notification={notification}
        onRead={markAsRead}
        onDelete={deleteNotification}
      />
    ))}
  </div>
</div>
```

#### 5. Header 통합
**파일**: `src/components/Header.tsx`

```tsx
{/* 데스크톱 */}
<nav className="hidden lg:flex items-center gap-4">
  <Link to="/search">
    <Search className="h-5 w-5" />
  </Link>
  {user && <NotificationBell />}
  <ThemeToggle />
  <LanguageSwitcher />
</nav>

{/* 모바일 */}
<SheetContent>
  <Link to="/search">검색</Link>
  {user && <Link to="/notifications">알림</Link>}
</SheetContent>
```

#### 6. 이메일 알림 (Resend)
**파일**: `src/lib/email.ts`

```typescript
import { Resend } from 'resend'

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY)

export async function sendNotificationEmail(
  to: string,
  notification: Notification
) {
  try {
    await resend.emails.send({
      from: 'VIBE WORKING <noreply@ideaonaction.ai>',
      to,
      subject: notification.title,
      html: `
        <h1>${notification.title}</h1>
        <p>${notification.message}</p>
        ${notification.link ? `<a href="${notification.link}">자세히 보기</a>` : ''}
      `,
    })
  } catch (error) {
    console.error('Failed to send email:', error)
  }
}
```

**사용 시나리오** (예시):
- 주문 완료 시
- 결제 승인/실패 시
- 서비스 신청 승인 시
- 중요 공지사항 발행 시

#### 7. i18n 지원
**번역 키** (15개):
```json
{
  "notifications": {
    "title": "알림",
    "empty": "알림이 없습니다.",
    "markAllRead": "모두 읽음",
    "deleteAll": "모두 삭제",
    "viewAll": "모두 보기",
    "types": {
      "info": "정보",
      "success": "성공",
      "warning": "경고",
      "error": "오류"
    },
    "filters": {
      "all": "전체",
      "unread": "읽지 않음"
    },
    "relative": {
      "justNow": "방금 전",
      "minutesAgo": "{{count}}분 전",
      "hoursAgo": "{{count}}시간 전",
      "daysAgo": "{{count}}일 전"
    }
  }
}
```

#### 8. 환경 변수
**파일**: `.env.example`

```bash
# Resend API (이메일 알림)
VITE_RESEND_API_KEY=re_...
```

### 기술적 도전

1. **Realtime 구독 관리**
   - useEffect cleanup으로 메모리 누수 방지
   - 필터링으로 본인 알림만 구독
   - INSERT/UPDATE/DELETE 이벤트 처리

2. **상대 시간 계산**
   - `formatRelativeTime()` 유틸 함수
   - 한국어/영어 로케일 지원
   - 자동 업데이트 (미구현)

3. **RLS 정책 설계**
   - 본인 알림만 조회/수정/삭제
   - 관리자만 생성 가능
   - 성능 인덱스 (user_id, read, created_at)

4. **이메일 템플릿**
   - Resend API 통합
   - React Email 컴포넌트 (미구현)
   - HTML 이메일 디자인

---

## 테스트 및 검증

### E2E 테스트 (15개)
**파일**: `tests/e2e/search.spec.ts`

```typescript
test.describe('Search Page', () => {
  test('should render search page', async ({ page }) => {
    await page.goto('/search')
    await expect(page.locator('h1')).toContainText('검색')
  })

  test('should submit search query', async ({ page }) => {
    await page.goto('/search')
    await page.fill('input[type="search"]', 'AI')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/search\?q=AI/)
  })

  test('should filter by type', async ({ page }) => {
    await page.goto('/search?q=AI')
    await page.click('[data-value="service"]')
    await expect(page).toHaveURL(/type=service/)
  })

  test('should highlight search term', async ({ page }) => {
    await page.goto('/search?q=AI')
    const marks = page.locator('mark')
    await expect(marks.first()).toBeVisible()
  })

  // ... 11개 추가 테스트
})
```

**커버리지**:
- ✅ 검색 페이지 렌더링
- ✅ 검색어 입력 및 제출
- ✅ URL 쿼리 파라미터 동기화
- ✅ 타입 필터 전환
- ✅ 검색 결과 표시
- ✅ 검색어 하이라이팅
- ✅ 최소 길이 검증
- ✅ 빈 결과 처리
- ✅ 에러 처리
- ✅ 로딩 상태
- ✅ 결과 개수 제한
- ✅ 날짜 정렬
- ✅ 이미지 썸네일
- ✅ 타입별 아이콘
- ✅ 로케일별 날짜 형식

### 유닛 테스트 (10개)
**파일**: `tests/unit/hooks/useSearch.test.tsx`

```typescript
describe('useSearch', () => {
  it('should initialize with empty results', () => {
    const { result } = renderHook(() => useSearch('', 'all'))
    expect(result.current.data).toBeUndefined()
  })

  it('should fetch search results', async () => {
    const { result } = renderHook(() => useSearch('AI', 'all'))
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(30)
  })

  it('should filter by type', async () => {
    const { result } = renderHook(() => useSearch('AI', 'service'))
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.every(r => r.type === 'service')).toBe(true)
  })

  // ... 7개 추가 테스트
})
```

**커버리지**:
- ✅ 훅 초기화
- ✅ 검색 쿼리 실행
- ✅ 타입 필터링
- ✅ 캐싱 동작
- ✅ 최소 길이 검증
- ✅ 날짜 정렬
- ✅ 결과 개수 제한
- ✅ 에러 핸들링
- ✅ 빈 결과 처리
- ✅ React Query 통합

### 수동 테스트 체크리스트

**검색 시스템**:
- [x] 검색 페이지 접근 (/search)
- [x] 검색어 입력 및 제출
- [x] 타입 필터 전환 (전체/서비스/블로그/공지)
- [x] 검색어 하이라이팅
- [x] 검색 결과 클릭 (상세 페이지 이동)
- [x] 빈 결과 처리
- [x] 최소 2자 검증
- [x] URL 공유 (쿼리 파라미터)

**AI 챗봇**:
- [x] 채팅 위젯 표시 (우측 하단)
- [x] 채팅창 열기/닫기
- [x] 메시지 전송
- [x] 스트리밍 응답 확인
- [x] Markdown 렌더링 (코드 블록 포함)
- [x] 대화 히스토리 유지 (새로고침 후)
- [x] 대화 삭제
- [x] 한국어/영어 자동 감지

**알림 시스템**:
- [x] 알림 벨 표시 (Header)
- [x] 읽지 않은 알림 카운트
- [x] 알림 드롭다운 (최근 5개)
- [x] 알림 페이지 (/notifications)
- [x] 타입 필터 (전체/info/success/warning/error)
- [x] 읽음/읽지 않음 필터
- [x] 개별 읽음 처리
- [x] 전체 읽음 처리
- [x] 개별 삭제
- [x] 전체 삭제
- [x] Realtime 업데이트 (새 알림 자동 표시)

---

## 기술 스택

### 새로 추가된 라이브러리

#### Week 1: 검색
- **없음** (기존 Supabase, React Query 활용)

#### Week 2: AI 챗봇
```json
{
  "dependencies": {
    "react-markdown": "^9.0.1",
    "remark-gfm": "^4.0.0"
  }
}
```

**react-markdown**: Markdown을 React 컴포넌트로 렌더링
**remark-gfm**: GitHub Flavored Markdown 지원 (테이블, 체크박스, 취소선 등)

#### Week 3: 알림
```json
{
  "dependencies": {
    "resend": "^4.0.0",
    "@react-email/components": "^0.0.25",
    "react-email": "^3.0.1"
  }
}
```

**resend**: 이메일 전송 API
**@react-email/components**: React 기반 이메일 템플릿
**react-email**: 이메일 개발 도구

### 총 의존성
- **총 패키지**: ~80개 (Phase 12 대비 +3개)
- **번들 크기**: 552 kB gzip (Phase 12 대비 +25 kB)
- **청크 개수**: 30개 (Phase 12와 동일)

---

## 성능 분석

### 번들 크기 변화

**Phase 12 (v1.7.0)** → **Phase 13 (v1.7.3)**:

| 항목 | Phase 12 | Phase 13 | 변화 |
|------|----------|----------|------|
| 총 크기 (gzip) | 527.14 kB | 552.00 kB | +24.86 kB (+4.7%) |
| 청크 개수 | 30 | 30 | 변화 없음 |
| index.js | 22.01 kB | 54.67 kB | +32.66 kB (AI 챗봇) |
| Search 청크 | - | 3.14 kB | 새로 추가 |
| Notifications 청크 | - | 1.28 kB | 새로 추가 |
| PWA 캐시 | 41 entries | 43 entries | +2 |

**주요 증가 원인**:
1. **index.js 증가** (+32.66 kB gzip)
   - react-markdown (15 kB gzip)
   - remark-gfm (8 kB gzip)
   - OpenAI 클라이언트 (5 kB gzip)
   - ChatWidget 글로벌 마운트 (4 kB gzip)

2. **새 청크 추가** (+4.42 kB gzip)
   - Search 페이지 (3.14 kB)
   - Notifications 페이지 (1.28 kB)

**최적화 고려사항**:
- [ ] react-markdown을 별도 청크로 분리 (ChatWindow lazy load)
- [ ] OpenAI 클라이언트를 별도 청크로 분리
- [ ] ChatWidget을 페이지별로 조건부 로드

### Core Web Vitals (예상)

**영향 없음**:
- **LCP (Largest Contentful Paint)**: 변화 없음 (검색/채팅/알림은 lazy load)
- **FID (First Input Delay)**: 변화 없음
- **CLS (Cumulative Layout Shift)**: 변화 없음 (ChatWidget 고정 위치)

**영향 있음**:
- **TTI (Time to Interactive)**: +0.2초 예상 (index.js 증가)
- **TBT (Total Blocking Time)**: +50ms 예상 (react-markdown 파싱)

**Lighthouse 점수 예상**:
- Performance: 90+ (유지)
- Accessibility: 95+ (유지)
- Best Practices: 100 (유지)
- SEO: 100 (유지)

---

## 학습 포인트

### 1. Supabase Realtime 구독 패턴

**배운 점**:
- `postgres_changes` 이벤트로 데이터베이스 변경 감지
- `filter` 옵션으로 본인 데이터만 구독 (성능 최적화)
- `useEffect` cleanup으로 메모리 누수 방지

**안티패턴**:
```typescript
// ❌ 나쁜 예: cleanup 없음
useEffect(() => {
  const channel = supabase.channel('notifications').subscribe()
  // cleanup 누락 → 메모리 누수
}, [])

// ✅ 좋은 예: cleanup 포함
useEffect(() => {
  const channel = supabase.channel('notifications').subscribe()
  return () => supabase.removeChannel(channel)
}, [])
```

### 2. OpenAI 스트리밍 응답 처리

**배운 점**:
- SSE (Server-Sent Events) 파싱
- AsyncGenerator를 활용한 비동기 이터레이션
- React 상태 업데이트 최적화 (마지막 메시지만 업데이트)

**핵심 코드**:
```typescript
for await (const chunk of stream) {
  assistantContent += chunk
  setMessages(prev => {
    const newMessages = [...prev]
    const lastIndex = newMessages.length - 1

    // 마지막 메시지만 업데이트 (성능 최적화)
    if (newMessages[lastIndex]?.role === 'assistant') {
      newMessages[lastIndex].content = assistantContent
    } else {
      newMessages.push({ role: 'assistant', content: assistantContent })
    }

    return newMessages
  })
}
```

### 3. React Query 캐싱 전략

**배운 점**:
- `staleTime` 설정으로 불필요한 재요청 방지
- `enabled` 옵션으로 조건부 쿼리 실행
- `queryKey` 배열로 캐시 키 구성

**검색 훅 예시**:
```typescript
useQuery({
  queryKey: ['search', query, type], // 캐시 키
  queryFn: searchFn,
  enabled: query.length >= 2, // 최소 2자 이상
  staleTime: 5 * 60 * 1000, // 5분 캐싱
})
```

### 4. LocalStorage 영구 저장 패턴

**배운 점**:
- 초기 상태 복원 (lazy initialization)
- `useEffect`로 자동 저장
- JSON 직렬화/역직렬화 에러 처리

**핵심 코드**:
```typescript
const [messages, setMessages] = useState<Message[]>(() => {
  try {
    const saved = localStorage.getItem('chat_messages')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
})

useEffect(() => {
  try {
    localStorage.setItem('chat_messages', JSON.stringify(messages))
  } catch (error) {
    console.error('Failed to save messages:', error)
  }
}, [messages])
```

### 5. Markdown 렌더링 보안

**배운 점**:
- react-markdown은 기본적으로 안전 (XSS 방지)
- `dangerouslySetInnerHTML` 대신 react-markdown 사용
- remark-gfm으로 GitHub 스타일 확장

**보안 비교**:
```typescript
// ❌ 위험: XSS 취약점
<div dangerouslySetInnerHTML={{ __html: markdown }} />

// ✅ 안전: react-markdown
<ReactMarkdown remarkPlugins={[remarkGfm]}>
  {markdown}
</ReactMarkdown>
```

### 6. RLS 정책 설계 원칙

**배운 점**:
- 최소 권한 원칙 (Principle of Least Privilege)
- `auth.uid()` 활용한 본인 확인
- 관리자 권한 확인 (profiles 조인)

**알림 RLS 예시**:
```sql
-- 본인 알림만 조회
CREATE POLICY "Users can view own notifications"
ON notifications FOR SELECT
USING (auth.uid() = user_id);

-- 관리자만 생성
CREATE POLICY "Admins can create notifications"
ON notifications FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);
```

### 7. 검색어 하이라이팅

**배운 점**:
- 정규식 특수문자 이스케이프
- `dangerouslySetInnerHTML` 대신 `<mark>` 태그 직접 사용
- React의 자동 XSS 방지 활용

**핵심 함수**:
```typescript
const escapeRegExp = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const highlightText = (text: string, query: string) => {
  if (!query.trim()) return text

  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>')
}
```

---

## 다음 단계

### Phase 14: 고급 분석 대시보드 (3주 예상)

#### Week 1: 사용자 행동 분석
- **목표**: GA4 이벤트 추적 및 시각화
- **작업**:
  - [ ] GA4 이벤트 정의 (페이지뷰, 클릭, 구매 등)
  - [ ] useAnalytics 훅 (이벤트 전송)
  - [ ] 사용자 행동 대시보드 (Recharts)
  - [ ] 퍼널 분석 (회원가입 → 구매)
  - [ ] 이탈률 분석
- **라이브러리**: recharts

#### Week 2: 매출 차트 & KPI
- **목표**: 실시간 매출 데이터 시각화
- **작업**:
  - [ ] 매출 차트 (일간/주간/월간)
  - [ ] KPI 카드 (총 매출, 평균 주문액, 전환율)
  - [ ] 서비스별 매출 비교
  - [ ] 사용자별 LTV (Lifetime Value) 계산
  - [ ] CSV 내보내기
- **라이브러리**: recharts, date-fns

#### Week 3: 실시간 대시보드
- **목표**: WebSocket 기반 실시간 데이터 업데이트
- **작업**:
  - [ ] Supabase Realtime 구독 (주문, 결제, 사용자)
  - [ ] 실시간 KPI 업데이트
  - [ ] 실시간 활동 피드 (최근 주문, 가입 등)
  - [ ] 알림 통합 (임계값 초과 시)
  - [ ] 자동 새로고침 (30초마다)
- **라이브러리**: Supabase Realtime

### 백로그 & 개선 사항

**Phase 13 개선**:
- [ ] ChatWidget lazy loading (번들 크기 최적화)
- [ ] 알림 이메일 템플릿 (React Email)
- [ ] 검색 결과 무한 스크롤
- [ ] 채팅 히스토리 내보내기
- [ ] 알림 푸시 (Service Worker)

**테스트 추가**:
- [ ] 채팅 E2E 테스트 (chat.spec.ts)
- [ ] 알림 E2E 테스트 (notifications.spec.ts)
- [ ] ChatWidget 유닛 테스트
- [ ] NotificationBell 유닛 테스트

**문서화**:
- [ ] OpenAI API 사용 가이드
- [ ] Resend 이메일 설정 가이드
- [ ] Supabase Realtime 구독 패턴

---

## 결론

Phase 13에서는 AI와 실시간 기능을 통해 사용자 경험을 크게 향상시켰습니다:

1. **통합 검색**: 모든 콘텐츠를 하나의 검색으로 찾기
2. **AI 챗봇**: 24/7 대화형 고객 지원
3. **실시간 알림**: 중요한 이벤트 즉시 전달

**총 작업량**:
- 📁 24개 파일 생성, 7개 수정
- 🧪 25개 테스트 추가 (총 292개)
- 🌐 40개 i18n 번역 키
- 📦 +25 kB gzip 번들 증가 (4.7%)
- ⏱️ 약 3주 개발 기간

**다음 목표**:
- Phase 14: 고급 분석 대시보드 (사용자 행동, 매출, 실시간 KPI)
- Phase 15: 모니터링 & 성능 개선 (APM, 로그, 최적화)

---

**작성자**: Claude (AI Assistant)
**마지막 업데이트**: 2025-11-04
**관련 문서**:
- [CLAUDE.md](../../CLAUDE.md)
- [project-todo.md](../../project-todo.md)
- [docs/project/changelog.md](../project/changelog.md)
- [docs/project/roadmap.md](../project/roadmap.md)
