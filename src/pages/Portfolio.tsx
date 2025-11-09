import { Helmet } from "react-helmet-async";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Briefcase, GitBranch, Users, TrendingUp, ExternalLink, Github, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useProjects } from "@/hooks/useProjects";

const Portfolio = () => {
  const { data: projectsData, isLoading, error } = useProjects();
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const statusLabels = {
    "all": "전체",
    "in-progress": "진행중",
    "validate": "검증",
    "launched": "출시",
    "backlog": "대기"
  };

  const statusVariants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
    "in-progress": "secondary",
    "validate": "outline",
    "launched": "default",
    "backlog": "outline"
  };

  const filteredProjects = useMemo(() => {
    if (!projectsData) return [];
    return selectedStatus === "all"
      ? projectsData
      : projectsData.filter(p => p.status === selectedStatus);
  }, [projectsData, selectedStatus]);

  const projectCounts = useMemo(() => {
    if (!projectsData) return { total: 0, inProgress: 0, validate: 0, launched: 0, backlog: 0 };
    return {
      total: projectsData.length,
      inProgress: projectsData.filter(p => p.status === "in-progress").length,
      validate: projectsData.filter(p => p.status === "validate").length,
      launched: projectsData.filter(p => p.status === "launched").length,
      backlog: projectsData.filter(p => p.status === "backlog").length
    };
  }, [projectsData]);

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

  return (
    <>
      <Helmet>
        <title>포트폴리오 - IDEA on Action</title>
        <meta
          name="description"
          content="IDEA on Action에서 진행한 프로젝트들을 둘러보세요. 아이디어부터 출시까지 전 과정을 공개합니다."
        />
        <meta property="og:title" content="포트폴리오 - IDEA on Action" />
        <meta property="og:description" content="아이디어부터 출시까지 전 과정을 공개하는 프로젝트 포트폴리오" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10"></div>
          <div className="container mx-auto max-w-6xl relative">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4">
                <Briefcase className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">{projectCounts.total}개 프로젝트</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                Portfolio
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                아이디어부터 출시까지, 전 과정을 투명하게 공개합니다
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-8 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card className="glass-card p-4 text-center">
                <div className="text-3xl font-bold text-primary">{projectCounts.total}</div>
                <div className="text-sm text-muted-foreground mt-1">전체</div>
              </Card>
              <Card className="glass-card p-4 text-center">
                <div className="text-3xl font-bold text-secondary">{projectCounts.inProgress}</div>
                <div className="text-sm text-muted-foreground mt-1">진행중</div>
              </Card>
              <Card className="glass-card p-4 text-center">
                <div className="text-3xl font-bold text-accent">{projectCounts.validate}</div>
                <div className="text-sm text-muted-foreground mt-1">검증</div>
              </Card>
              <Card className="glass-card p-4 text-center">
                <div className="text-3xl font-bold text-green-600">{projectCounts.launched}</div>
                <div className="text-sm text-muted-foreground mt-1">출시</div>
              </Card>
              <Card className="glass-card p-4 text-center">
                <div className="text-3xl font-bold text-muted-foreground">{projectCounts.backlog}</div>
                <div className="text-sm text-muted-foreground mt-1">대기</div>
              </Card>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
              <TabsList className="glass-card mb-8">
                {Object.entries(statusLabels).map(([key, label]) => (
                  <TabsTrigger key={key} value={key}>
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value={selectedStatus} className="space-y-6">
                {filteredProjects.length === 0 ? (
                  <Card className="glass-card p-12 text-center">
                    <p className="text-muted-foreground">해당 상태의 프로젝트가 없습니다.</p>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project, index) => (
                      <Link
                        key={project.id}
                        to={`/portfolio/${project.slug}`}
                        className="block"
                      >
                        <Card
                          className="glass-card p-6 space-y-4 hover-lift h-full flex flex-col"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          {/* Header */}
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-xl font-bold line-clamp-2 flex-1">
                              {project.title}
                            </h3>
                            <Badge variant={statusVariants[project.status] || "outline"}>
                              {statusLabels[project.status as keyof typeof statusLabels] || project.status}
                            </Badge>
                          </div>

                          {/* Summary */}
                          <p className="text-sm text-foreground/70 line-clamp-3 flex-1">
                            {project.summary}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2">
                            {project.tags.slice(0, 4).map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {project.tags.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{project.tags.length - 4}
                              </Badge>
                            )}
                          </div>

                          {/* Metrics */}
                          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <TrendingUp className="w-3 h-3 text-primary" />
                                <span className="text-xs text-muted-foreground">진행률</span>
                              </div>
                              <div className="font-bold">{project.metrics.progress}%</div>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <GitBranch className="w-3 h-3 text-primary" />
                                <span className="text-xs text-muted-foreground">커밋</span>
                              </div>
                              <div className="font-bold">{project.metrics.commits}</div>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <Users className="w-3 h-3 text-primary" />
                                <span className="text-xs text-muted-foreground">기여자</span>
                              </div>
                              <div className="font-bold">{project.metrics.contributors}</div>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <Progress value={project.metrics.progress} className="h-1" />

                          {/* Links */}
                          <div className="flex items-center gap-3 pt-2">
                            {project.links.github && (
                              <a
                                href={project.links.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Github className="w-4 h-4" />
                                <span>GitHub</span>
                              </a>
                            )}
                            {project.links.demo && (
                              <a
                                href={project.links.demo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="w-4 h-4" />
                                <span>Demo</span>
                              </a>
                            )}
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="container mx-auto max-w-4xl text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">다음 프로젝트의 주인공은?</h2>
            <p className="text-lg text-foreground/80">
              당신의 아이디어를 함께 실현해보세요.
            </p>
            <div className="flex items-center justify-center gap-4">
              <a
                href="/work-with-us"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-semibold"
              >
                프로젝트 제안하기
              </a>
              <a
                href="/lab"
                className="px-6 py-3 glass-card rounded-md hover:bg-muted/50 transition-colors font-semibold"
              >
                바운티 참여하기
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Portfolio;
