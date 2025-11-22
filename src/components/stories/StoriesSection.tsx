/**
 * StoriesSection Component
 * 이야기 허브 페이지의 각 섹션을 표시하는 카드 컴포넌트
 *
 * Sprint 1 - Site Restructure
 */

import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, LucideIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

// 섹션 아이템 타입 정의
export interface StoriesSectionItem {
  id: string;
  title: string;
  excerpt?: string;
  published_at?: string | null;
  created_at?: string;
}

interface StoriesSectionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  items: StoriesSectionItem[];
  linkTo: string;
  linkLabel?: string;
  emptyMessage?: string;
  isLoading?: boolean;
}

export function StoriesSection({
  title,
  description,
  icon: Icon,
  items,
  linkTo,
  linkLabel = "더 보기",
  emptyMessage = "아직 등록된 콘텐츠가 없습니다",
  isLoading = false,
}: StoriesSectionProps) {
  // 날짜 포맷팅 헬퍼
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "";
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ko,
      });
    } catch {
      return "";
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        {isLoading ? (
          // 로딩 스켈레톤
          <div className="space-y-3 flex-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          // 빈 상태
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-muted-foreground text-center">
              {emptyMessage}
            </p>
          </div>
        ) : (
          // 아이템 목록
          <div className="space-y-3 flex-1">
            {items.map((item) => (
              <div
                key={item.id}
                className="group border-b border-border/50 pb-3 last:border-0 last:pb-0"
              >
                <h4 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                  {item.title}
                </h4>
                {item.excerpt && (
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                    {item.excerpt}
                  </p>
                )}
                {(item.published_at || item.created_at) && (
                  <span className="text-xs text-muted-foreground/70">
                    {formatDate(item.published_at || item.created_at)}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 더 보기 링크 */}
        <div className="mt-4 pt-4 border-t">
          <Link to={linkTo}>
            <Button variant="ghost" className="w-full group/btn">
              {linkLabel}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default StoriesSection;
