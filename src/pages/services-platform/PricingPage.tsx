import { Helmet } from "react-helmet-async";
import PageLayout from "@/components/layouts/PageLayout";
import Section from "@/components/layouts/Section";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { servicePricingSummary } from "@/data/services";
import CTASection from "@/components/services-platform/CTASection";

export default function PricingPage() {
  const developmentServices = servicePricingSummary.filter(
    (s) => s.category === "development"
  );
  const compassServices = servicePricingSummary.filter(
    (s) => s.category === "compass"
  );

  return (
    <PageLayout>
      <Helmet>
        <title>가격 안내 | IDEA on Action</title>
        <meta
          name="description"
          content="IDEA on Action의 모든 서비스 가격을 확인하세요. 개발 서비스부터 COMPASS 플랫폼까지 투명한 가격 정책을 제공합니다."
        />
      </Helmet>

      {/* Hero */}
      <section className="text-center py-12 space-y-4">
        <h1 className="text-4xl font-bold">가격 안내</h1>
        <p className="text-xl text-muted-foreground">
          투명하고 합리적인 가격 정책
        </p>
      </section>

      {/* Development Services */}
      <Section title="개발 서비스">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>서비스</TableHead>
                <TableHead>가격 유형</TableHead>
                <TableHead>가격 범위</TableHead>
                <TableHead className="text-right">상세 보기</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {developmentServices.map((service) => (
                <TableRow key={service.slug}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>{service.pricing.type}</TableCell>
                  <TableCell>{service.pricing.range}</TableCell>
                  <TableCell className="text-right">
                    <a
                      href={service.href}
                      className="text-primary hover:underline"
                    >
                      자세히 보기
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Section>

      {/* COMPASS Platform */}
      <Section title="COMPASS 플랫폼">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>서비스</TableHead>
                <TableHead>가격 유형</TableHead>
                <TableHead>가격 범위</TableHead>
                <TableHead className="text-right">상세 보기</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {compassServices.map((service) => (
                <TableRow key={service.slug}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>{service.pricing.type}</TableCell>
                  <TableCell>{service.pricing.range}</TableCell>
                  <TableCell className="text-right">
                    <a
                      href={service.href}
                      className="text-primary hover:underline"
                    >
                      자세히 보기
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Section>

      {/* Discounts */}
      <Section title="할인 혜택">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="glass-card p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">개발 서비스</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• 연간 유지보수 계약 시: 10% 할인</li>
              <li>• 2개 이상 서비스 동시 계약: 15% 할인</li>
              <li>• 스타트업/비영리 단체: 20% 할인 (별도 심사)</li>
            </ul>
          </div>
          <div className="glass-card p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">COMPASS 플랫폼</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• 연간 구독: 20% 할인</li>
              <li>• Full Voyage Package: 30% 할인</li>
              <li>• 베타 테스터: 6개월 무료</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Payment Methods */}
      <Section title="결제 수단">
        <div className="max-w-2xl mx-auto glass-card p-6 rounded-lg">
          <ul className="space-y-2">
            <li>• 신용카드 (국내 모든 카드사)</li>
            <li>• 계좌이체</li>
            <li>• 법인카드</li>
            <li>• 토스페이먼츠 간편결제</li>
          </ul>
        </div>
      </Section>

      {/* CTA */}
      <CTASection
        primary={{ label: "견적 문의하기", href: "/work-with-us" }}
        secondary={{ label: "상담 신청하기", href: "/work-with-us" }}
      />
    </PageLayout>
  );
}
