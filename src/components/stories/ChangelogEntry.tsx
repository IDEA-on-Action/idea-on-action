/**
 * ChangelogEntry Component
 * 변경사항 페이지의 개별 엔트리를 표시하는 컴포넌트
 *
 * TASK-017: Changelog 페이지 생성
 */

import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Wrench, AlertTriangle, ExternalLink, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";

// 변경 타입 정의
export type ChangeType = "feature" | "fix" | "breaking" | "improvement" | "docs";

// 개별 변경사항 아이템
export interface ChangeItem {
  type: ChangeType;
  description: string;
}

// 프로젝트 정보 (선택적)
export interface ChangelogProject {
  slug?: string;
  title: string;
}

// Changelog Entry 전체 타입
export interface ChangelogEntryData {
  id: string;
  version: string;
  title: string;
  released_at: string;
  changes: ChangeItem[];
  project?: ChangelogProject;
}

// 변경 타입별 스타일 매핑
const changeTypeConfig: Record<
  ChangeType,
  { icon: typeof Plus; label: string; className: string; badgeVariant: "default" | "secondary" | "destructive" | "outline" }
> = {
  feature: {
    icon: Plus,
    label: "기능 추가",
    className: "text-green-600 dark:text-green-400",
    badgeVariant: "default",
  },
  fix: {
    icon: Wrench,
    label: "버그 수정",
    className: "text-amber-600 dark:text-amber-400",
    badgeVariant: "secondary",
  },
  breaking: {
    icon: AlertTriangle,
    label: "Breaking Change",
    className: "text-red-600 dark:text-red-400",
    badgeVariant: "destructive",
  },
  improvement: {
    icon: Plus,
    label: "개선",
    className: "text-blue-600 dark:text-blue-400",
    badgeVariant: "outline",
  },
  docs: {
    icon: Plus,
    label: "문서",
    className: "text-gray-600 dark:text-gray-400",
    badgeVariant: "outline",
  },
};

interface ChangelogEntryProps extends ChangelogEntryData {
  className?: string;
}

export function ChangelogEntry({
  version,
  title,
  released_at,
  changes,
  project,
  className,
}: ChangelogEntryProps) {
  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "yyyy년 M월 d일", { locale: ko });
    } catch {
      return dateString;
    }
  };

  return (
    <Card className={cn("relative", className)}>
      {/* 타임라인 도트 (왼쪽) */}
      <div className="absolute -left-3 top-6 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md">
        <div className="w-3 h-3 bg-background rounded-full" />
      </div>

      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          {/* 버전 배지 */}
          <Badge variant="default" className="w-fit text-sm font-mono px-3 py-1">
            {version}
          </Badge>

          {/* 날짜 */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <time dateTime={released_at}>{formatDate(released_at)}</time>
          </div>
        </div>

        <CardTitle className="text-xl mt-2">{title}</CardTitle>

        {/* 프로젝트 링크 */}
        {project && (
          <div className="mt-1">
            {project.slug ? (
              <Link
                to={`/projects/${project.slug}`}
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                {project.title}
                <ExternalLink className="w-3 h-3" />
              </Link>
            ) : (
              <span className="text-sm text-muted-foreground">{project.title}</span>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent>
        {/* 변경사항 목록 */}
        <ul className="space-y-2">
          {changes.map((change, index) => {
            const config = changeTypeConfig[change.type] || changeTypeConfig.feature;
            const Icon = config.icon;

            return (
              <li key={index} className="flex items-start gap-3">
                {/* 아이콘 */}
                <div
                  className={cn(
                    "mt-0.5 p-1 rounded-md bg-muted flex-shrink-0",
                    config.className
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* 설명 */}
                <div className="flex-1">
                  <span className="text-sm">{change.description}</span>
                </div>

                {/* 타입 배지 (모바일에서는 숨김) */}
                <Badge
                  variant={config.badgeVariant}
                  className="hidden sm:inline-flex text-xs flex-shrink-0"
                >
                  {config.label}
                </Badge>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

export default ChangelogEntry;
