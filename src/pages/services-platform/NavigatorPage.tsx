import { Helmet } from "react-helmet-async";
import PageLayout from "@/components/layouts/PageLayout";
import Section from "@/components/layouts/Section";
import PlanComparisonTable from "@/components/services-platform/PlanComparisonTable";
import FAQSection from "@/components/services-platform/FAQSection";
import CTASection from "@/components/services-platform/CTASection";
import { Badge } from "@/components/ui/badge";
import { compassNavigatorService } from "@/data/services/compass-navigator";
import { CheckCircle2 } from "lucide-react";

export default function NavigatorPage() {
  const service = compassNavigatorService;

  return (
    <PageLayout>
      <Helmet>
        <title>{service.title} | IDEA on Action</title>
        <meta name="description" content={service.description} />
      </Helmet>

      {/* Hero */}
      <section className="text-center py-12 space-y-4">
        <Badge>SaaS 플랫폼</Badge>
        <h1 className="text-4xl font-bold">{service.title}</h1>
        <p className="text-xl text-muted-foreground">{service.subtitle}</p>
      </section>

      {/* Service Introduction */}
      <Section title="서비스 소개">
        <p className="text-lg text-center max-w-3xl mx-auto">
          {service.description}
        </p>
      </Section>

      {/* Key Features */}
      <Section title="주요 기능">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="glass-card p-6 rounded-lg">
            <div className="text-xl font-semibold mb-3">🌐 통합 수집</div>
            <p className="text-muted-foreground">
              위시켓, 크몽, 원티드긱스, 나라장터 등 주요 플랫폼 자동 크롤링 및
              중복 제거
            </p>
          </div>
          <div className="glass-card p-6 rounded-lg">
            <div className="text-xl font-semibold mb-3">🤖 AI 분석</div>
            <p className="text-muted-foreground">
              프로젝트 난이도 평가, 경쟁률 예측, 클라이언트 신뢰도 분석
            </p>
          </div>
          <div className="glass-card p-6 rounded-lg">
            <div className="text-xl font-semibold mb-3">⚙️ 맞춤형 필터</div>
            <p className="text-muted-foreground">
              JavaScript 기반 평가 규칙 작성 및 가중치 설정
            </p>
          </div>
          <div className="glass-card p-6 rounded-lg">
            <div className="text-xl font-semibold mb-3">🔔 실시간 알림</div>
            <p className="text-muted-foreground">
              Slack, 이메일, SMS를 통한 조건별 실시간 알림
            </p>
          </div>
        </div>
      </Section>

      {/* Plan Comparison */}
      <Section title="플랜 비교">
        {service.pricing.monthly && (
          <PlanComparisonTable plans={service.pricing.monthly} />
        )}
      </Section>

      {/* Pricing */}
      <Section title="가격 정책">
        <div className="max-w-2xl mx-auto glass-card p-6 rounded-lg space-y-3">
          <ul className="space-y-2">
            <li>• 월 단위 구독 (자동 결제)</li>
            <li>
              • 연간 구독 시{" "}
              {service.pricing.monthly?.[0].annualDiscount || 0}% 할인
            </li>
            <li>• 30일 무료 체험 (신규 가입자)</li>
          </ul>
        </div>
      </Section>

      {/* Payment Method */}
      <Section title="결제 방식">
        <div className="max-w-2xl mx-auto glass-card p-6 rounded-lg space-y-3">
          <ul className="space-y-2">
            <li>• 신용카드 자동 결제</li>
            <li>• 매월 가입일에 자동 청구</li>
            <li>• 언제든지 취소 가능 (즉시 효력)</li>
          </ul>
        </div>
      </Section>

      {/* Refund Policy */}
      {service.refundPolicy && (
        <Section title="환불 정책">
          <div className="max-w-2xl mx-auto glass-card p-6 rounded-lg space-y-3">
            <p>• {service.refundPolicy.beforeStart}</p>
            <p>• {service.refundPolicy.inProgress}</p>
            <p>• {service.refundPolicy.afterCompletion}</p>
            <p className="text-sm text-muted-foreground pt-3 border-t">
              ※ 자세한 내용은{" "}
              <a href="/refund" className="text-primary hover:underline">
                환불 정책
              </a>{" "}
              페이지를 참조해주세요.
            </p>
          </div>
        </Section>
      )}

      {/* Service Terms */}
      <Section title="서비스 이용약관">
        <div className="max-w-2xl mx-auto glass-card p-6 rounded-lg space-y-3">
          <ul className="space-y-2">
            <li>• 14세 이상 이용 가능</li>
            <li>• 사업자 정보 등록 필요 (Enterprise 플랜)</li>
            <li>• 수집 데이터의 재판매 금지</li>
            <li>• 플랫폼 이용약관 준수 의무</li>
          </ul>
          <p className="text-sm text-muted-foreground pt-3 border-t">
            ※ 전체 이용약관은{" "}
            <a href="/terms" className="text-primary hover:underline">
              이용약관
            </a>{" "}
            페이지를 참조해주세요.
          </p>
        </div>
      </Section>

      {/* Beta Tester */}
      <Section title="베타 테스터 모집">
        <div className="max-w-2xl mx-auto glass-card p-6 rounded-lg">
          <p className="mb-4">
            현재 COMPASS Navigator는 베타 서비스 중입니다. 베타 테스터로
            참여하시면:
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span>6개월간 Pro 플랜 무료 이용</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span>신규 기능 우선 체험</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span>피드백 제공 시 리워드</span>
            </li>
          </ul>
        </div>
      </Section>

      {/* FAQ */}
      {service.faq && <FAQSection faqs={service.faq} />}

      {/* CTA */}
      <CTASection
        primary={{ label: "무료 체험 시작하기", href: "/signup?plan=trial" }}
        secondary={{
          label: "플랜 비교 자세히 보기",
          href: "#plan-comparison",
        }}
      />
    </PageLayout>
  );
}
