import { Link } from "react-router-dom";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface ConnectCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  linkTo: string;
  badge?: string;
  disabled?: boolean;
  className?: string;
}

export function ConnectCard({
  title,
  description,
  icon: Icon,
  linkTo,
  badge,
  disabled = false,
  className,
}: ConnectCardProps) {
  const cardContent = (
    <Card
      className={cn(
        "h-full transition-all duration-300 cursor-pointer group",
        "hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1",
        "border-border/50 hover:border-primary/30",
        disabled && "opacity-50 cursor-not-allowed hover:shadow-none hover:translate-y-0",
        className
      )}
    >
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div
            className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300",
              "bg-gradient-to-br from-primary/10 to-secondary/10",
              "group-hover:from-primary/20 group-hover:to-secondary/20",
              "group-hover:scale-110"
            )}
          >
            <Icon
              className={cn(
                "h-7 w-7 transition-colors duration-300",
                "text-primary/80 group-hover:text-primary"
              )}
            />
          </div>
          {badge && (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-secondary/10 text-secondary">
              {badge}
            </span>
          )}
          {!badge && !disabled && (
            <ArrowRight
              className={cn(
                "h-5 w-5 transition-all duration-300",
                "text-muted-foreground/50 group-hover:text-primary",
                "group-hover:translate-x-1"
              )}
            />
          )}
        </div>
        <div>
          <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors duration-300">
            {title}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p
          className={cn(
            "text-sm font-medium transition-colors duration-300",
            disabled
              ? "text-muted-foreground"
              : "text-muted-foreground group-hover:text-primary"
          )}
        >
          {disabled ? "준비 중입니다" : "바로 연결하기"}
        </p>
      </CardContent>
    </Card>
  );

  if (disabled) {
    return cardContent;
  }

  return (
    <Link to={linkTo} className="block">
      {cardContent}
    </Link>
  );
}

export default ConnectCard;
