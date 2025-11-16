import { Link } from "react-router-dom";
import { ArrowRight, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface NextStepCTA {
  label: string;
  href: string;
  icon?: LucideIcon;
  variant?: "default" | "outline";
  description?: string;
}

export interface NextStepsCTAProps {
  title: string;
  description?: string;
  primaryCTA: NextStepCTA;
  secondaryCTA?: NextStepCTA;
  variant?: "default" | "gradient" | "muted";
  className?: string;
}

/**
 * NextStepsCTA Component
 *
 * 사용자 여정(User Journey)을 안내하는 재사용 가능한 CTA 컴포넌트
 * 페이지 하단에 배치하여 다음 단계로 자연스럽게 유도
 *
 * @example
 * <NextStepsCTA
 *   title="다음 단계"
 *   description="우리의 여정을 계속 탐험하세요"
 *   primaryCTA={{ label: "로드맵 보기", href: "/roadmap", icon: Calendar }}
 *   secondaryCTA={{ label: "포트폴리오 보기", href: "/portfolio" }}
 * />
 */
export const NextStepsCTA = ({
  title,
  description,
  primaryCTA,
  secondaryCTA,
  variant = "default",
  className = "",
}: NextStepsCTAProps) => {
  // Variant에 따른 배경 스타일 결정
  const getVariantClasses = () => {
    switch (variant) {
      case "gradient":
        return "bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 dark:from-primary/5 dark:via-secondary/5 dark:to-accent/5";
      case "muted":
        return "bg-muted/50";
      default:
        return "";
    }
  };

  return (
    <section
      className={`py-16 md:py-20 ${getVariantClasses()} ${className}`}
      aria-label="다음 단계 안내"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="glass-card p-8 md:p-12">
          <div className="text-center space-y-6">
            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-bold">
              {title}
            </h2>

            {/* Description */}
            {description && (
              <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
                {description}
              </p>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              {/* Primary CTA */}
              <Button
                asChild
                variant={primaryCTA.variant || "default"}
                size="lg"
                className="w-full sm:w-auto group"
                aria-label={primaryCTA.label}
              >
                <Link to={primaryCTA.href} className="flex items-center gap-2">
                  {primaryCTA.icon && <primaryCTA.icon className="w-5 h-5" />}
                  <span>{primaryCTA.label}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              {/* Secondary CTA */}
              {secondaryCTA && (
                <Button
                  asChild
                  variant={secondaryCTA.variant || "outline"}
                  size="lg"
                  className="w-full sm:w-auto group"
                  aria-label={secondaryCTA.label}
                >
                  <Link to={secondaryCTA.href} className="flex items-center gap-2">
                    {secondaryCTA.icon && <secondaryCTA.icon className="w-5 h-5" />}
                    <span>{secondaryCTA.label}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              )}
            </div>

            {/* CTA Descriptions (Optional) */}
            {(primaryCTA.description || secondaryCTA?.description) && (
              <div className="grid sm:grid-cols-2 gap-4 pt-6 border-t">
                {primaryCTA.description && (
                  <div className="text-sm text-muted-foreground">
                    <strong className="block mb-1 text-foreground">
                      {primaryCTA.label}
                    </strong>
                    {primaryCTA.description}
                  </div>
                )}
                {secondaryCTA?.description && (
                  <div className="text-sm text-muted-foreground">
                    <strong className="block mb-1 text-foreground">
                      {secondaryCTA.label}
                    </strong>
                    {secondaryCTA.description}
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
};

export default NextStepsCTA;
