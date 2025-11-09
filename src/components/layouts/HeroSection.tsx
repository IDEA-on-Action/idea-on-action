/**
 * HeroSection Component
 * 
 * 일관된 Hero 섹션 컴포넌트
 * - 모든 페이지에서 동일한 Hero 섹션 스타일 제공
 * - 배지, 제목, 설명을 포함한 표준 구조
 */

import { ReactNode, LucideIcon } from "lucide-react";

interface HeroSectionProps {
  badge?: {
    icon?: LucideIcon;
    text: string;
  };
  title: string | ReactNode;
  description?: string | ReactNode;
  className?: string;
  variant?: "default" | "compact";
  children?: ReactNode;
}

export const HeroSection = ({
  badge,
  title,
  description,
  className = "",
  variant = "default",
  children,
}: HeroSectionProps) => {
  const paddingClass = variant === "compact" ? "py-16 md:py-24" : "py-20 px-4";
  const Icon = badge?.icon;

  return (
    <section className={`relative ${paddingClass} overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10"></div>
      <div className="container mx-auto max-w-6xl relative">
        <div className="text-center space-y-6">
          {badge && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4">
              {Icon && <Icon className="w-4 h-4 text-primary" />}
              <span className="text-sm font-semibold">{badge.text}</span>
            </div>
          )}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            {title}
          </h1>
          {description && (
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
    </section>
  );
};

