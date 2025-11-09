/**
 * LoadingState Component
 * 
 * 일관된 로딩 상태 컴포넌트
 * - 전체 페이지 로딩 또는 인라인 로딩 지원
 * - 스피너 또는 스켈레톤 옵션
 */

import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface LoadingStateProps {
  variant?: "spinner" | "skeleton";
  fullScreen?: boolean;
  message?: string;
  skeletonCount?: number;
  className?: string;
}

export const LoadingState = ({
  variant = "spinner",
  fullScreen = true,
  message,
  skeletonCount = 3,
  className = "",
}: LoadingStateProps) => {
  if (variant === "skeleton") {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <Card key={index} className="glass-card p-6">
            <div className="space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const containerClass = fullScreen
    ? "flex items-center justify-center min-h-screen"
    : "flex items-center justify-center py-12";

  return (
    <div className={`${containerClass} ${className}`}>
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
        {message && (
          <p className="text-sm text-muted-foreground">{message}</p>
        )}
      </div>
    </div>
  );
};

