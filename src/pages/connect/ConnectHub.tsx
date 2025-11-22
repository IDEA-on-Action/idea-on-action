import { Helmet } from "react-helmet-async";
import { MessageSquare, Users, Globe, Handshake } from "lucide-react";
import { PageLayout, HeroSection, Section } from "@/components/layouts";
import { ConnectCard } from "@/components/connect";

const connectSections = [
  {
    title: "프로젝트 문의",
    description: "협업 프로젝트를 제안해주세요. MVP 개발부터 기술 컨설팅까지 다양한 형태의 협업이 가능합니다.",
    icon: MessageSquare,
    linkTo: "/connect/inquiry",
  },
  {
    title: "채용",
    description: "함께 성장할 동료를 찾습니다. 열정과 아이디어가 있는 분을 환영합니다.",
    icon: Users,
    linkTo: "/connect/careers",
    badge: "준비중",
    disabled: true,
  },
  {
    title: "커뮤니티",
    description: "아이디어를 나누는 공간입니다. GitHub Discussions와 디스코드에서 만나보세요.",
    icon: Globe,
    linkTo: "/connect/community",
  },
] as const;

export default function ConnectHub() {
  return (
    <>
      <Helmet>
        <title>함께하기 - Connect - IDEA on Action</title>
        <meta
          name="description"
          content="IDEA on Action과 함께하세요. 프로젝트 문의, 채용, 커뮤니티 등 다양한 방법으로 연결됩니다."
        />
        <meta property="og:title" content="함께하기 - IDEA on Action" />
        <meta
          property="og:description"
          content="프로젝트 협업, 채용, 커뮤니티 - 연결의 시작점"
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <PageLayout>
        <HeroSection
          badge={{ icon: Handshake, text: "Connect With Us" }}
          title="함께하기"
          description={
            <>
              <p className="text-lg md:text-xl mb-2">
                연결의 시작점
              </p>
              <p className="text-base text-muted-foreground">
                프로젝트 협업, 채용, 커뮤니티 - 원하는 방식으로 함께해요
              </p>
            </>
          }
        />

        <Section maxWidth="5xl">
          <div className="grid md:grid-cols-3 gap-8">
            {connectSections.map((section, index) => (
              <div
                key={section.linkTo}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ConnectCard
                  title={section.title}
                  description={section.description}
                  icon={section.icon}
                  linkTo={section.linkTo}
                  badge={section.badge}
                  disabled={section.disabled}
                />
              </div>
            ))}
          </div>
        </Section>

        <Section variant="muted" maxWidth="4xl">
          <div className="text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              어떤 방식이든 환영합니다
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              큰 프로젝트가 아니어도 괜찮습니다. 작은 아이디어 공유, 기술 토론,
              피드백까지 - 모든 형태의 참여가 소중합니다.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <a
                href="mailto:sinclair.seo@ideaonaction.ai"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
              >
                <MessageSquare className="w-4 h-4" />
                이메일 보내기
              </a>
              <a
                href="https://github.com/IDEA-on-Action/idea-on-action/discussions"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border hover:bg-muted/50 transition-colors font-medium"
              >
                <Globe className="w-4 h-4" />
                GitHub Discussions
              </a>
            </div>
          </div>
        </Section>
      </PageLayout>
    </>
  );
}
