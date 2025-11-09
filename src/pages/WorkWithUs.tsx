import { Helmet } from "react-helmet-async";
import { Rocket, Code, Palette, Mail, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkWithUsForm } from "@/components/forms/WorkWithUsForm";
import { PageLayout, HeroSection, Section } from "@/components/layouts";

const WorkWithUs = () => {
  const packages = [
    {
      icon: Rocket,
      name: "MVP 개발",
      price: "협의",
      description: "아이디어를 빠르게 검증할 수 있는 MVP를 함께 만듭니다.",
      features: [
        "요구사항 분석 및 기획",
        "UI/UX 디자인",
        "프론트엔드 & 백엔드 개발",
        "테스트 & 배포",
        "2주 무료 유지보수"
      ],
      duration: "4-6주",
      ideal: "스타트업, 초기 프로젝트"
    },
    {
      icon: Code,
      name: "기술 컨설팅",
      price: "500,000원~",
      description: "기술 스택 선정부터 아키텍처 설계까지 전문적인 조언을 제공합니다.",
      features: [
        "기술 스택 분석 및 추천",
        "아키텍처 설계 리뷰",
        "코드 리뷰 및 개선 제안",
        "성능 최적화 가이드",
        "문서화 지원"
      ],
      duration: "1-2주",
      ideal: "팀, 프로젝트 리딩"
    },
    {
      icon: Palette,
      name: "디자인 시스템",
      price: "300,000원~",
      description: "일관된 사용자 경험을 위한 디자인 시스템을 구축합니다.",
      features: [
        "브랜드 아이덴티티 설계",
        "컴포넌트 라이브러리 구축",
        "스타일 가이드 문서",
        "다크 모드 지원",
        "반응형 디자인"
      ],
      duration: "2-3주",
      ideal: "브랜드 구축, UI 통일"
    }
  ];

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

        {/* Packages */}
        <Section maxWidth="6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">협업 패키지</h2>
            <p className="text-lg text-muted-foreground">
              프로젝트 단계와 니즈에 맞는 패키지를 선택하세요
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <Card
                  key={index}
                  className="glass-card p-8 space-y-6 hover-lift"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <pkg.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                      <div className="text-3xl font-bold text-primary mb-2">{pkg.price}</div>
                      <p className="text-sm text-foreground/70">{pkg.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-6 border-t">
                    {pkg.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span className="text-sm text-foreground/80">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 pt-6 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">예상 기간</span>
                      <span className="font-semibold">{pkg.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">추천 대상</span>
                      <Badge variant="secondary" className="text-xs">
                        {pkg.ideal}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
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
