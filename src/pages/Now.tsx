import { Helmet } from "react-helmet-async";
import { Clock, FileText, Lightbulb, Rocket, TrendingUp, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLogs } from "@/hooks/useLogs";

const Now = () => {
  const { data: logsData, isLoading, error } = useLogs();

  const typeIcons = {
    release: Rocket,
    learning: Lightbulb,
    decision: TrendingUp
  };

  const typeLabels = {
    release: "릴리스",
    learning: "학습",
    decision: "의사결정"
  };

  const typeVariants: Record<string, "default" | "secondary" | "outline"> = {
    release: "default",
    learning: "secondary",
    decision: "outline"
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="glass-card p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">데이터 로드 실패</h2>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'}
          </p>
        </Card>
      </div>
    );
  }

  // Sort logs by date (most recent first) - already sorted by hook
  const sortedLogs = logsData || [];

  return (
    <>
      <Helmet>
        <title>Now - 최근 활동 - IDEA on Action</title>
        <meta
          name="description"
          content="IDEA on Action의 최근 활동을 확인하세요. 릴리스, 학습, 의사결정 과정을 투명하게 공개합니다."
        />
        <meta property="og:title" content="Now - IDEA on Action" />
        <meta property="og:description" content="최근 활동을 투명하게 공개합니다" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10"></div>
          <div className="container mx-auto max-w-6xl relative">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">실시간 업데이트</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                Now
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                지금 이 순간, 우리가 하고 있는 일들
              </p>
            </div>
          </div>
        </section>

        {/* Activity Feed */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="space-y-6">
              {sortedLogs.map((log, index) => {
                const IconComponent = typeIcons[log.type as keyof typeof typeIcons] || FileText;

                return (
                  <Card
                    key={log.id}
                    className="glass-card p-6 hover-lift"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>

                      <div className="flex-1 space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-xl font-bold flex-1">{log.title}</h3>
                          <Badge variant={typeVariants[log.type]}>
                            {typeLabels[log.type as keyof typeof typeLabels]}
                          </Badge>
                        </div>

                        {/* Content */}
                        <p className="text-foreground/80 leading-relaxed">
                          {log.content}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(log.createdAt).toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                          <span>•</span>
                          <span>{log.author}</span>
                          {log.tags && log.tags.length > 0 && (
                            <>
                              <span>•</span>
                              <div className="flex flex-wrap gap-1">
                                {log.tags.map((tag, tagIndex) => (
                                  <Badge key={tagIndex} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="container mx-auto max-w-4xl text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">주간 리캡 구독하기</h2>
            <p className="text-lg text-foreground/80">
              매주 일요일, 한 주간의 활동을 요약해서 보내드립니다.
            </p>
            <p className="text-sm text-muted-foreground">
              Sprint 2에서 Newsletter 기능이 추가됩니다.
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default Now;
