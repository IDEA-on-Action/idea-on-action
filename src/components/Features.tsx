import { Zap, Shield, Rocket, Users } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "빠른 구현",
    description: "검증된 프레임워크로 신속한 프로토타입 개발"
  },
  {
    icon: Shield,
    title: "안정성",
    description: "엔터프라이즈급 보안과 안정적인 운영"
  },
  {
    icon: Rocket,
    title: "확장성",
    description: "비즈니스 성장에 맞춰 유연하게 확장"
  },
  {
    icon: Users,
    title: "협업",
    description: "팀 전체의 생산성을 높이는 협업 도구"
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 relative bg-card/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">VIBE WORKING</span>의 강점
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            최고 수준의 기술력과 경험으로 완벽한 솔루션을 제공합니다
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-border hover:border-primary/40 transition-all group cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
