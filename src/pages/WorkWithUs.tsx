import { Helmet } from "react-helmet-async";
import { Rocket, Code, Palette, Mail, Calendar, Server, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WorkWithUsForm } from "@/components/forms/WorkWithUsForm";
import { PageLayout, HeroSection, Section } from "@/components/layouts";
import { developmentServices } from "@/data/services";

const serviceIcons = {
  mvp: Rocket,
  fullstack: Code,
  design: Palette,
  operations: Server,
} as const;

const WorkWithUs = () => {
  // Development Services만 표시 (MVP, Fullstack, Design, Operations)
  const services = developmentServices.map((service) => ({
    ...service,
    icon: serviceIcons[service.slug as keyof typeof serviceIcons] || Rocket,
  }));

  return (
    <>
      <Helmet>
        <title>Work with Us - 협업 제안 - IDEA on Action</title>
        <meta
          name="description"
          content="IDEA on Action과 함께 프로젝트를 진행하세요. MVP 개발, 기술 컨설팅, 디자인 시스템 구축 등 다양한 협업이 가능합니다."
        />
        <meta property="og:title" content="Work with Us - IDEA on Action" />
        <meta property="og:description" content="함께 만들어갈 프로젝트를 기다립니다" />
        <meta property="og:type" content="website" />
      </Helmet>

      <PageLayout>
        <HeroSection
          badge={{ icon: Rocket, text: "Let's Build Together" }}
          title="Work with Us"
          description="아이디어를 현실로 만드는 여정에 함께하세요"
        />

        {/* Services */}
        <Section maxWidth="6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">개발 서비스</h2>
            <p className="text-lg text-muted-foreground">
              프로젝트 단계와 니즈에 맞는 서비스를 선택하세요
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => {
                const Icon = service.icon;
                // 가격 정보 추출
                let priceDisplay = "협의";
                if (service.pricing.type === "package" && service.pricing.packages) {
                  const prices = service.pricing.packages.map(p => p.price);
                  const minPrice = Math.min(...prices);
                  const maxPrice = Math.max(...prices);
                  if (minPrice === maxPrice) {
                    priceDisplay = `₩${(minPrice / 1000000).toFixed(1)}M`;
                  } else {
                    priceDisplay = `₩${(minPrice / 1000000).toFixed(1)}M ~ ₩${(maxPrice / 1000000).toFixed(1)}M`;
                  }
                } else if (service.pricing.type === "monthly" && service.pricing.monthly) {
                  const prices = service.pricing.monthly.map(p => p.price);
                  const minPrice = Math.min(...prices);
                  const maxPrice = Math.max(...prices);
                  priceDisplay = `₩${(minPrice / 1000).toFixed(0)}K ~ ₩${(maxPrice / 1000).toFixed(0)}K/월`;
                } else if (service.pricing.type === "hourly" && service.pricing.hourly) {
                  priceDisplay = `₩${(service.pricing.hourly.juniorRate / 1000).toFixed(0)}K ~ ₩${(service.pricing.hourly.seniorRate / 1000).toFixed(0)}K/시간`;
                }

                return (
                  <Card
                    key={service.id}
                    className="glass-card p-6 space-y-4 hover-lift flex flex-col"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-1">{service.name}</h3>
                        <div className="text-sm font-semibold text-primary mb-2">{priceDisplay}</div>
                        <p className="text-xs text-foreground/70 line-clamp-2">{service.description}</p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t flex-1">
                      {service.features.slice(0, 4).map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-2">
                          <span className="text-primary mt-0.5 text-xs">✓</span>
                          <span className="text-xs text-foreground/80 line-clamp-1">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t">
                      <Link to={`/services/development/${service.slug}`}>
                        <Button variant="outline" className="w-full" size="sm">
                          자세히 보기
                        </Button>
                      </Link>
                    </div>
                  </Card>
                );
              })}
          </div>
        </Section>

        {/* Contact Form */}
        <Section variant="muted" maxWidth="4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">협업 제안하기</h2>
            <p className="text-lg text-muted-foreground">
              프로젝트에 대한 자세한 내용을 알려주시면 2-3일 내에 답변드리겠습니다.
            </p>
          </div>

          <Card className="glass-card p-8 md:p-12">
            <WorkWithUsForm />
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mt-8 max-w-2xl mx-auto">
              <a
                href="mailto:sinclair.seo@ideaonaction.ai?subject=프로젝트 협업 문의"
                className="flex items-center justify-center gap-3 p-6 glass-card rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <Mail className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="font-bold">직접 이메일 보내기</div>
                  <div className="text-sm text-muted-foreground">sinclair.seo@ideaonaction.ai</div>
                </div>
              </a>

              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Sprint 3에서 Cal.com 통합 예정입니다.');
                }}
                className="flex items-center justify-center gap-3 p-6 glass-card rounded-lg hover:bg-muted/50 transition-colors group opacity-50 cursor-not-allowed"
              >
                <Calendar className="w-6 h-6 text-secondary group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="font-bold">미팅 예약</div>
                  <div className="text-sm text-muted-foreground">Coming Soon</div>
                </div>
              </a>
          </div>
        </Section>

        {/* Process */}
        <Section maxWidth="6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">협업 프로세스</h2>
            <p className="text-muted-foreground">투명하고 체계적인 프로세스로 진행합니다</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: "1", title: "문의", description: "이메일로 프로젝트 개요를 보내주세요" },
                { step: "2", title: "상담", description: "요구사항을 상세히 논의합니다" },
                { step: "3", title: "제안", description: "견적 및 일정을 제안합니다" },
                { step: "4", title: "시작", description: "계약 후 프로젝트를 시작합니다" }
              ].map((item, index) => (
                <div key={index} className="text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto text-2xl font-bold text-white">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
          </div>
        </Section>

        {/* CTA Section */}
        <Section variant="gradient" maxWidth="4xl">
          <div className="text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">프로젝트 시작 준비되셨나요?</h2>
            <p className="text-lg text-foreground/80">
              함께 만들어갈 여정이 기다립니다.
            </p>
            <a
              href="mailto:sinclair.seo@ideaonaction.ai?subject=프로젝트 협업 문의"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-semibold"
            >
              <Mail className="w-4 h-4" />
              지금 문의하기
            </a>
          </div>
        </Section>
      </PageLayout>
    </>
  );
};

export default WorkWithUs;
