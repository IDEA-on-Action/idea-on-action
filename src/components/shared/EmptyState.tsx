/**
 * EmptyState Component
 * 
 * 일관된 빈 데이터 상태 컴포넌트
 * - 아이콘, 제목, 설명, 액션 버튼 지원
 */

import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) => {
  return (
    <div className={`flex items-center justify-center py-16 ${className}`}>
      <Card className="glass-card p-8 max-w-md text-center">
        <Icon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        {description && (
          <p className="text-muted-foreground mb-6">{description}</p>
        )}
        {action && (
          <Button onClick={action.onClick} variant="default">
            {action.label}
          </Button>
        )}
      </Card>
    </div>
  );
};

