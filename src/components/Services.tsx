import { Brain, Workflow, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";

const services = [
  {
    icon: Brain,
    title: "AI 컨설팅",
    description: "최신 AI 기술을 활용한 맞춤형 컨설팅으로 비즈니스 혁신을 지원합니다",
    features: ["AI 전략 수립", "모델 개발", "최적화 솔루션"]
  },
  {
    icon: Workflow,
    title: "워크플로우 자동화",
    description: "반복적인 업무를 자동화하여 팀의 생산성을 획기적으로 향상시킵니다",
    features: ["프로세스 자동화", "통합 시스템", "효율성 개선"]
  },
  {
    icon: BarChart3,
    title: "데이터 분석",
    description: "방대한 데이터에서 인사이트를 도출하여 의사결정을 지원합니다",
    features: ["데이터 시각화", "예측 분석", "실시간 대시보드"]
  }
];

const Services = () => {
  return (
    <section id="services" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            혁신적인 <span className="bg-gradient-primary bg-clip-text text-transparent">솔루션</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            AI 기반의 첨단 기술로 비즈니스의 모든 단계를 지원합니다
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card 
                key={index}
                className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all hover:shadow-glow group cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </div>

                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
