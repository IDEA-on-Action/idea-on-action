/**
 * ErrorState Component
 * 
 * 일관된 에러 상태 컴포넌트
 * - 에러 메시지 표시
 * - 재시도 기능 지원
 */

import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorStateProps {
  error: Error | string | unknown;
  title?: string;
  fullScreen?: boolean;
  onRetry?: () => void;
  variant?: "card" | "alert";
  className?: string;
}

export const ErrorState = ({
  error,
  title = "데이터 로드 실패",
  fullScreen = true,
  onRetry,
  variant = "card",
  className = "",
}: ErrorStateProps) => {
  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : "알 수 없는 오류가 발생했습니다.";

  const containerClass = fullScreen
    ? "flex items-center justify-center min-h-screen"
    : "py-12";

  if (variant === "alert") {
    return (
      <div className={containerClass}>
        <Alert variant="destructive" className={className}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="mt-4"
            >
              다시 시도
            </Button>
          )}
        </Alert>
      </div>
    );
  }

  return (
    <div className={`${containerClass} ${className}`}>
      <Card className="glass-card p-8 max-w-md text-center mx-auto">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-6">{errorMessage}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="default">
            다시 시도
          </Button>
        )}
      </Card>
    </div>
  );
};

