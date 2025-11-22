/**
 * NewsletterCard Component
 * 뉴스레터 아카이브 목록에서 사용하는 카드 컴포넌트
 *
 * Sprint 2 - TASK-019
 */

import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export interface NewsletterCardProps {
  id: string;
  subject: string;
  preview: string;
  sent_at: string;
  recipient_count?: number;
}

export function NewsletterCard({
  id,
  subject,
  preview,
  sent_at,
  recipient_count,
}: NewsletterCardProps) {
  // 한국어 날짜 포맷
  const formattedDate = (() => {
    try {
      return format(new Date(sent_at), "yyyy년 M월 d일", { locale: ko });
    } catch {
      return sent_at;
    }
  })();

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {subject}
            </CardTitle>
            <CardDescription className="mt-2 line-clamp-2">
              {preview}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="shrink-0">
            발송됨
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          {/* 메타 정보 */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            {recipient_count !== undefined && recipient_count > 0 && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{recipient_count.toLocaleString()}명</span>
              </div>
            )}
          </div>

          {/* 읽기 버튼 */}
          <Link to={`/stories/newsletter/${id}`}>
            <Button variant="ghost" size="sm" className="group/btn">
              읽기
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default NewsletterCard;
