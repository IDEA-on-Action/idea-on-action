/**
 * NewsletterArchive Page
 * 발송된 뉴스레터 아카이브 목록 페이지
 *
 * Sprint 2 - TASK-019
 */

import { Helmet } from "react-helmet-async";
import { Mail } from "lucide-react";
import { PageLayout } from "@/components/layouts/PageLayout";
import { NewsletterCard } from "@/components/stories/NewsletterCard";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// 더미 데이터 (나중에 useNewsletterArchive 훅으로 교체)
const newsletters = [
  {
    id: "1",
    subject: "2025년 11월 셋째 주 소식",
    preview: "CMS Phase 5 완료, Minu 브랜드 런칭, 사이트 재구조화 Sprint 1 완료 등 이번 주 주요 업데이트 소식을 전합니다.",
    sent_at: "2025-11-22",
    recipient_count: 150,
  },
  {
    id: "2",
    subject: "2025년 11월 둘째 주 소식",
    preview: "Services Platform 출시, 토스페이먼츠 연동 완료, 뉴스레터 시스템 구축 등 11월 두 번째 주간 업데이트입니다.",
    sent_at: "2025-11-15",
    recipient_count: 142,
  },
  {
    id: "3",
    subject: "2025년 11월 첫째 주 소식",
    preview: "Version 2.0 대규모 리팩토링 완료, PWA 최적화, Admin CRUD E2E 테스트 154개 신규 작성 등 개선 사항을 공유합니다.",
    sent_at: "2025-11-08",
    recipient_count: 135,
  },
  {
    id: "4",
    subject: "IDEA on Action 런칭 소식",
    preview: "안녕하세요! IDEA on Action의 첫 번째 뉴스레터입니다. 우리가 어떤 회사인지, 무엇을 하는지 소개합니다.",
    sent_at: "2025-11-01",
    recipient_count: 120,
  },
];

export default function NewsletterArchive() {
  const isLoading = false;
  const isEmpty = newsletters.length === 0;

  return (
    <PageLayout maxWidth="xl">
      <Helmet>
        <title>뉴스레터 | IDEA on Action</title>
        <meta
          name="description"
          content="IDEA on Action의 뉴스레터 아카이브입니다. 정기적으로 전하는 최신 소식과 인사이트를 확인하세요."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">뉴스레터</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          정기적으로 전하는 최신 소식과 인사이트
        </p>
      </section>

      {/* 구독 CTA */}
      <Card className="mb-12 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">뉴스레터 구독하기</CardTitle>
          <CardDescription>
            새로운 소식이 발행되면 이메일로 받아보세요
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <NewsletterForm
            variant="inline"
            location="newsletter_archive"
            placeholder="이메일 주소를 입력하세요"
            buttonText="구독하기"
          />
        </CardContent>
      </Card>

      {/* 아카이브 목록 */}
      <section>
        <h2 className="text-2xl font-bold mb-6">발송된 뉴스레터</h2>

        {isLoading ? (
          // 로딩 상태
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-full" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-1/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : isEmpty ? (
          // 빈 상태
          <EmptyState
            icon={Mail}
            title="아직 발송된 뉴스레터가 없습니다"
            description="곧 첫 번째 뉴스레터가 발송될 예정입니다. 구독하고 기다려주세요!"
          />
        ) : (
          // 뉴스레터 목록
          <div className="space-y-4">
            {newsletters.map((newsletter) => (
              <NewsletterCard key={newsletter.id} {...newsletter} />
            ))}
          </div>
        )}
      </section>

      {/* 하단 안내 */}
      {!isEmpty && (
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            각 뉴스레터를 클릭하여 전체 내용을 확인하세요
          </p>
        </div>
      )}
    </PageLayout>
  );
}
