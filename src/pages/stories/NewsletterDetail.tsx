/**
 * NewsletterDetail Page
 * 뉴스레터 상세 보기 페이지
 *
 * Sprint 2 - TASK-020
 */

import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ArrowRight, Calendar, Users, Mail, Share2 } from "lucide-react";
import { PageLayout } from "@/components/layouts/PageLayout";
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { devError } from "@/lib/errors";

// 더미 데이터 (나중에 useNewsletterDetail 훅으로 교체)
const newsletterData: Record<string, {
  id: string;
  subject: string;
  content: string;
  sent_at: string;
  recipient_count: number;
  prev_id?: string;
  next_id?: string;
}> = {
  "1": {
    id: "1",
    subject: "2025년 11월 셋째 주 소식",
    content: `
# 안녕하세요, IDEA on Action입니다!

이번 주 주요 업데이트 소식을 전합니다.

## 주요 업데이트

### CMS Phase 5 완료
- 리치 텍스트 에디터 (Tiptap) 통합
- 미디어 라이브러리 고도화
- 이미지 최적화 및 썸네일 자동 생성

### Minu 브랜드 런칭
COMPASS 서비스가 **Minu 시리즈**로 리브랜딩 되었습니다:
- **Minu Find**: 사업기회 탐색
- **Minu Frame**: 문제정의 & RFP
- **Minu Build**: 프로젝트 진행
- **Minu Keep**: 운영/유지보수

### 사이트 재구조화 Sprint 1
- 메뉴 구조 개선 (7개 → 5개)
- 허브 페이지 신규 생성
- 리디렉션 설정 완료

## 다음 주 예정
- Newsletter Archive 페이지 완성
- 검색 기능 개선
- 성능 최적화

---

다음 소식도 기대해 주세요!

**IDEA on Action** 드림
`,
    sent_at: "2025-11-22",
    recipient_count: 150,
    prev_id: "2",
  },
  "2": {
    id: "2",
    subject: "2025년 11월 둘째 주 소식",
    content: `
# 안녕하세요, IDEA on Action입니다!

11월 두 번째 주간 업데이트입니다.

## 주요 업데이트

### Services Platform 출시
새로운 서비스 플랫폼이 출시되었습니다:
- MVP 개발 서비스
- 풀스택 개발 서비스
- 디자인 서비스
- 운영 서비스

### 토스페이먼츠 연동
결제 시스템이 완전히 통합되었습니다:
- 신용카드 결제
- 간편결제 (카카오페이, 네이버페이)
- 구독 결제

### 뉴스레터 시스템 구축
- 구독 관리 시스템
- 자동 발송 시스템
- 아카이브 페이지

---

다음 소식도 기대해 주세요!

**IDEA on Action** 드림
`,
    sent_at: "2025-11-15",
    recipient_count: 142,
    prev_id: "3",
    next_id: "1",
  },
  "3": {
    id: "3",
    subject: "2025년 11월 첫째 주 소식",
    content: `
# 안녕하세요, IDEA on Action입니다!

11월 첫 번째 주간 업데이트입니다.

## 주요 업데이트

### Version 2.0 대규모 리팩토링
- ESLint 경고: 67개 → 2개 (-97%)
- TypeScript any: 60+개 → 2개 (-97%)
- 번들 크기 32% 감소

### PWA 최적화
- 오프라인 지원 강화
- 설치 프롬프트 개선
- 캐시 전략 최적화

### Admin CRUD E2E 테스트
154개의 새로운 E2E 테스트가 추가되었습니다.

---

다음 소식도 기대해 주세요!

**IDEA on Action** 드림
`,
    sent_at: "2025-11-08",
    recipient_count: 135,
    prev_id: "4",
    next_id: "2",
  },
  "4": {
    id: "4",
    subject: "IDEA on Action 런칭 소식",
    content: `
# 안녕하세요!

IDEA on Action의 첫 번째 뉴스레터입니다.

## 우리는 누구인가요?

**생각을 멈추지 않고, 행동으로 옮기는 회사**

IDEA on Action은 아이디어 실험실이자 커뮤니티형 프로덕트 스튜디오입니다.

## 우리가 하는 일

### 서비스 개발
- MVP 개발
- 풀스택 개발
- 디자인 시스템

### Minu 플랫폼
AI 기반 프로젝트 관리 솔루션을 제공합니다.

## 연락처

- 이메일: sinclair.seo@ideaonaction.ai
- 웹사이트: https://www.ideaonaction.ai

---

앞으로도 많은 관심 부탁드립니다!

**IDEA on Action** 드림
`,
    sent_at: "2025-11-01",
    recipient_count: 120,
    next_id: "3",
  },
};

export default function NewsletterDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 더미 데이터에서 뉴스레터 가져오기
  const newsletter = id ? newsletterData[id] : null;

  // 한국어 날짜 포맷
  const formattedDate = newsletter?.sent_at
    ? format(new Date(newsletter.sent_at), "yyyy년 M월 d일", { locale: ko })
    : "";

  // 공유 기능
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: newsletter?.subject || "뉴스레터",
          text: newsletter?.subject || "",
          url: window.location.href,
        });
      } catch (err) {
        devError(err, { operation: "뉴스레터 공유", service: "Newsletter" });
      }
    } else {
      // Fallback: 클립보드에 복사
      navigator.clipboard.writeText(window.location.href);
      alert("링크가 클립보드에 복사되었습니다!");
    }
  };

  // 뉴스레터를 찾을 수 없는 경우
  if (!newsletter) {
    return (
      <PageLayout>
        <div className="text-center py-16">
          <Mail className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">뉴스레터를 찾을 수 없습니다</h1>
          <p className="text-muted-foreground mb-6">
            요청하신 뉴스레터가 존재하지 않거나 삭제되었습니다.
          </p>
          <Button asChild>
            <Link to="/stories/newsletter">
              <ArrowLeft className="mr-2 h-4 w-4" />
              뉴스레터 목록으로
            </Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Helmet>
        <title>{newsletter.subject} | IDEA on Action 뉴스레터</title>
        <meta
          name="description"
          content={`${newsletter.subject} - IDEA on Action 뉴스레터`}
        />
      </Helmet>

      {/* 상단 네비게이션 */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" asChild>
          <Link to="/stories/newsletter">
            <ArrowLeft className="mr-2 h-4 w-4" />
            뉴스레터 목록
          </Link>
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="mr-2 h-4 w-4" />
          공유
        </Button>
      </div>

      {/* 헤더 */}
      <header className="mb-8">
        <Badge variant="secondary" className="mb-4">
          발송됨
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{newsletter.subject}</h1>

        {/* 메타 정보 */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          {newsletter.recipient_count > 0 && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{newsletter.recipient_count.toLocaleString()}명에게 발송</span>
            </div>
          )}
        </div>
      </header>

      <Separator className="mb-8" />

      {/* 본문 */}
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <MarkdownRenderer content={newsletter.content} />
      </article>

      <Separator className="my-8" />

      {/* 이전/다음 네비게이션 */}
      <nav className="flex items-center justify-between mb-12">
        {newsletter.prev_id ? (
          <Button
            variant="outline"
            onClick={() => navigate(`/stories/newsletter/${newsletter.prev_id}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            이전 뉴스레터
          </Button>
        ) : (
          <div />
        )}
        {newsletter.next_id ? (
          <Button
            variant="outline"
            onClick={() => navigate(`/stories/newsletter/${newsletter.next_id}`)}
          >
            다음 뉴스레터
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <div />
        )}
      </nav>

      {/* 구독 CTA */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">뉴스레터 구독하기</CardTitle>
          <CardDescription>
            새로운 소식이 발행되면 이메일로 받아보세요
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <NewsletterForm
            variant="inline"
            location="newsletter_detail"
            placeholder="이메일 주소를 입력하세요"
            buttonText="구독하기"
          />
        </CardContent>
      </Card>

      {/* 목록으로 돌아가기 */}
      <div className="text-center mt-8">
        <Button variant="ghost" asChild>
          <Link to="/stories/newsletter">
            <ArrowLeft className="mr-2 h-4 w-4" />
            뉴스레터 목록으로 돌아가기
          </Link>
        </Button>
      </div>
    </PageLayout>
  );
}
