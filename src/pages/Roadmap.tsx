import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { Calendar, TrendingUp, Users, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useRoadmap } from "@/hooks/useRoadmap";

const Roadmap = () => {
  const { data: roadmapData, isLoading, error } = useRoadmap();
  const [selectedQuarter, setSelectedQuarter] = useState("");

  // Set initial selected quarter when data loads
  useEffect(() => {
    if (roadmapData && roadmapData.length > 0 && !selectedQuarter) {
      setSelectedQuarter(roadmapData[0].quarter);
    }
  }, [roadmapData, selectedQuarter]);

  const getRiskBadgeVariant = (risk: string[]) => {
    if (risk.includes("high")) return "destructive";
    if (risk.includes("medium")) return "warning";
    return "secondary";
  };

  const getRiskLabel = (risk: string[]) => {
    if (risk.includes("high")) return "높음";
    if (risk.includes("medium")) return "중간";
    return "낮음";
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "in-progress":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "완료";
      case "in-progress":
        return "진행중";
      default:
        return "예정";
    }
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

  // No data state
  if (!roadmapData || roadmapData.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="glass-card p-8 max-w-md text-center">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">로드맵 없음</h2>
          <p className="text-muted-foreground">아직 등록된 로드맵이 없습니다.</p>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>로드맵 - IDEA on Action</title>
        <meta
          name="description"
          content="IDEA on Action의 분기별 목표와 진행 상황을 확인하세요. 투명하게 공개되는 로드맵으로 함께 성장합니다."
        />
        <meta property="og:title" content="로드맵 - IDEA on Action" />
        <meta property="og:description" content="분기별 목표와 진행 상황을 투명하게 공개합니다" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10"></div>
          <div className="container mx-auto max-w-6xl relative">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">Roadmap 2025-2026</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                우리의 여정
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                투명하게 공개되는 로드맵으로 함께 성장합니다
              </p>
            </div>
          </div>
        </section>

        {/* Roadmap Tabs */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <Tabs value={selectedQuarter} onValueChange={setSelectedQuarter}>
              <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 bg-transparent h-auto">
                {roadmapData.map((item) => (
                  <TabsTrigger
                    key={item.id}
                    value={item.quarter}
                    className="glass-card data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <div className="text-center">
                      <div className="font-bold">{item.quarter}</div>
                      <div className="text-xs opacity-80">{item.progress}%</div>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>

              {roadmapData.map((quarter) => (
                <TabsContent key={quarter.id} value={quarter.quarter} className="mt-8 space-y-8">
                  {/* Quarter Overview */}
                  <Card className="glass-card p-8">
                    <div className="space-y-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <h2 className="text-3xl font-bold">{quarter.goal}</h2>
                          </div>
                          <p className="text-muted-foreground">{quarter.period}</p>
                          <p className="text-foreground/80 leading-relaxed">
                            {quarter.description}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant={getRiskBadgeVariant(quarter.risks)}>
                            <AlertCircle className="w-3 h-3 mr-1" />
                            리스크: {getRiskLabel(quarter.risks)}
                          </Badge>
                          <Badge variant="outline">
                            <Users className="w-3 h-3 mr-1" />
                            {quarter.owner}
                          </Badge>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold">전체 진행률</span>
                          <span className="text-muted-foreground">{quarter.progress}%</span>
                        </div>
                        <Progress value={quarter.progress} className="h-2" />
                      </div>

                      {/* KPIs */}
                      {quarter.kpis && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                          {Object.entries(quarter.kpis).map(([key, value]) => (
                            <div key={key} className="space-y-1">
                              <p className="text-xs text-muted-foreground uppercase">
                                {key}
                              </p>
                              <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold">
                                  {typeof value === 'object' && value !== null && 'current' in value
                                    ? value.current
                                    : value}
                                </span>
                                {typeof value === 'object' && value !== null && 'target' in value && (
                                  <span className="text-sm text-muted-foreground">
                                    / {value.target}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Milestones */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                      <TrendingUp className="w-6 h-6 text-primary" />
                      마일스톤
                    </h3>

                    <div className="grid md:grid-cols-3 gap-6">
                      {quarter.milestones.map((milestone) => (
                        <Card
                          key={milestone.id}
                          className="glass-card p-6 space-y-4 hover-lift"
                        >
                          <div className="flex items-start justify-between">
                            <h4 className="text-lg font-bold">{milestone.title}</h4>
                            <Badge variant={getStatusBadgeVariant(milestone.status)}>
                              {getStatusLabel(milestone.status)}
                            </Badge>
                          </div>

                          <div className="text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            {new Date(milestone.dueDate).toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>

                          <ul className="space-y-2">
                            {milestone.tasks.map((task, index) => (
                              <li
                                key={index}
                                className="text-sm text-foreground/70 flex items-start gap-2"
                              >
                                <span className="text-primary mt-1">•</span>
                                <span>{task}</span>
                              </li>
                            ))}
                          </ul>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="container mx-auto max-w-4xl text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">함께 만들어가고 싶으신가요?</h2>
            <p className="text-lg text-foreground/80">
              로드맵의 일부가 되어 함께 성장하세요.
            </p>
            <div className="flex items-center justify-center gap-4">
              <a
                href="/lab"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-semibold"
              >
                바운티 참여하기
              </a>
              <a
                href="/portfolio"
                className="px-6 py-3 glass-card rounded-md hover:bg-muted/50 transition-colors font-semibold"
              >
                프로젝트 보기
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Roadmap;
