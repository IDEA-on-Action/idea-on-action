import { Helmet } from "react-helmet-async";
import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, GitBranch, Users, TrendingUp, ExternalLink, Github, Rocket, FlaskConical, Clock, Star, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useProjects } from "@/hooks/useProjects";
import { PageLayout, HeroSection, Section } from "@/components/layouts";
import { NextStepsCTA } from "@/components/common/NextStepsCTA";
import { LoadingState, ErrorState, EmptyState } from "@/components/shared";
import { analytics } from "@/lib/analytics";

const Portfolio = () => {
  const { data: projectsData, isLoading, error } = useProjects();
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const navigate = useNavigate();

  // GA4: Portfolio 페이지 조회 이벤트
  useEffect(() => {
    analytics.viewPortfolio();
  }, []);

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

  // 모든 훅은 early return 전에 호출되어야 합니다
  // useMemo로 감싸서 참조 안정성 보장
  const projects = useMemo(() => projectsData || [], [projectsData]);

  const projectCounts = useMemo(() => {
    if (!projects || projects.length === 0) {
      return { total: 0, inProgress: 0, validate: 0, launched: 0, backlog: 0 };
    }
    return {
      total: projects.length,
      inProgress: projects.filter(p => p.status === "in-progress").length,
      validate: projects.filter(p => p.status === "validate").length,
      launched: projects.filter(p => p.status === "launched").length,
      backlog: projects.filter(p => p.status === "backlog").length
    };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (!projects || projects.length === 0) return [];
    return selectedStatus === "all"
      ? projects
      : projects.filter(p => p.status === selectedStatus);
  }, [projects, selectedStatus]);

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} />;
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

      <PageLayout>
        <HeroSection
          badge={{ icon: Briefcase, text: `${projectCounts.total}개 프로젝트` }}
          title="Portfolio"
          description="아이디어부터 출시까지, 전 과정을 투명하게 공개합니다"
        />

        {/* Stats */}
        <Section variant="muted" className="py-8">
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
        </Section>

        {/* Projects */}
        <Section>
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
                <EmptyState
                  icon={Briefcase}
                  title="프로젝트가 없습니다"
                  description="해당 상태의 프로젝트가 없습니다."
                />
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project, index) => (
                    <div
                      key={project.id}
                      onClick={() => navigate(`/portfolio/${project.slug}`)}
                      className="cursor-pointer"
                    >
                      <Card
                        className="glass-card p-6 space-y-4 hover-lift h-full flex flex-col"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {/* Header with Problem Badge */}
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-xl font-bold line-clamp-2 flex-1">
                            {project.title}
                          </h3>
                          {project.problem ? (
                            <Badge variant="destructive" className="flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              문제
                            </Badge>
                          ) : (
                            <Badge variant={statusVariants[project.status] || "outline"}>
                              {statusLabels[project.status as keyof typeof statusLabels] || project.status}
                            </Badge>
                          )}
                        </div>

                        {/* Problem Context (if available) */}
                        {project.problem && (
                          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                            <p className="text-xs font-medium text-destructive mb-1">해결한 문제</p>
                            <p className="text-sm text-foreground/80 line-clamp-2">{project.problem}</p>
                          </div>
                        )}

                        {/* Solution or Summary */}
                        {project.solution ? (
                          <div className="space-y-2 flex-1">
                            <p className="text-xs font-semibold text-primary">우리의 해결책</p>
                            <p className="text-sm text-foreground/70 line-clamp-3">{project.solution}</p>
                          </div>
                        ) : (
                          <p className="text-sm text-foreground/70 line-clamp-3 flex-1">
                            {project.summary}
                          </p>
                        )}

                        {/* Business Impact Metrics (NEW) */}
                        {project.impact && (project.impact.users || project.impact.timeSaved || project.impact.satisfaction) && (
                          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-primary/20 bg-primary/5 -mx-6 px-6 -mb-4 pb-4">
                            {project.impact.users && (
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  <Users className="w-4 h-4 text-primary" />
                                </div>
                                <div className="text-xs text-muted-foreground mb-0.5">사용자</div>
                                <div className="font-bold text-sm">{project.impact.users}</div>
                              </div>
                            )}
                            {project.impact.timeSaved && (
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  <Clock className="w-4 h-4 text-primary" />
                                </div>
                                <div className="text-xs text-muted-foreground mb-0.5">시간 절감</div>
                                <div className="font-bold text-sm">{project.impact.timeSaved}</div>
                              </div>
                            )}
                            {project.impact.satisfaction && (
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  <Star className="w-4 h-4 text-primary" />
                                </div>
                                <div className="text-xs text-muted-foreground mb-0.5">만족도</div>
                                <div className="font-bold text-sm">{project.impact.satisfaction}</div>
                              </div>
                            )}
                          </div>
                        )}

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

                        {/* Tech Details (Collapsible) */}
                        <Accordion type="single" collapsible className="border-t pt-2" onClick={(e) => e.stopPropagation()}>
                          <AccordionItem value="tech-details" className="border-0">
                            <AccordionTrigger className="py-2 text-xs text-muted-foreground hover:no-underline">
                              기술 상세 정보
                            </AccordionTrigger>
                            <AccordionContent className="pb-2">
                              {/* Technical Metrics */}
                              <div className="grid grid-cols-3 gap-3 mb-3 pb-3 border-b">
                                <div className="text-center">
                                  <div className="flex items-center justify-center gap-1 mb-1">
                                    <TrendingUp className="w-3 h-3 text-muted-foreground" />
                                  </div>
                                  <div className="text-xs text-muted-foreground">진행률</div>
                                  <div className="font-bold text-sm">{project.metrics.progress}%</div>
                                </div>
                                <div className="text-center">
                                  <div className="flex items-center justify-center gap-1 mb-1">
                                    <GitBranch className="w-3 h-3 text-muted-foreground" />
                                  </div>
                                  <div className="text-xs text-muted-foreground">커밋</div>
                                  <div className="font-bold text-sm">{project.metrics.commits}</div>
                                </div>
                                <div className="text-center">
                                  <div className="flex items-center justify-center gap-1 mb-1">
                                    <Users className="w-3 h-3 text-muted-foreground" />
                                  </div>
                                  <div className="text-xs text-muted-foreground">기여자</div>
                                  <div className="font-bold text-sm">{project.metrics.contributors}</div>
                                </div>
                              </div>

                              {/* Progress Bar */}
                              <Progress value={project.metrics.progress} className="h-1.5 mb-3" />

                              {/* Tech Stack Badges */}
                              {(project.tech.frontend || project.tech.backend) && (
                                <div className="space-y-2">
                                  {project.tech.frontend && project.tech.frontend.length > 0 && (
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">Frontend</p>
                                      <div className="flex flex-wrap gap-1">
                                        {project.tech.frontend.slice(0, 3).map((tech, techIndex) => (
                                          <Badge key={techIndex} variant="outline" className="text-xs">
                                            {tech}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {project.tech.backend && project.tech.backend.length > 0 && (
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">Backend</p>
                                      <div className="flex flex-wrap gap-1">
                                        {project.tech.backend.slice(0, 3).map((tech, techIndex) => (
                                          <Badge key={techIndex} variant="outline" className="text-xs">
                                            {tech}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Links */}
                              <div className="flex items-center gap-3 pt-3 mt-3 border-t">
                                {project.links.github && (
                                  <a
                                    href={project.links.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
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
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                    <span>Demo</span>
                                  </a>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Section>

        <NextStepsCTA
          title="다음 프로젝트의 주인공은?"
          description="당신의 아이디어를 함께 실현해보세요"
          primaryCTA={{
            label: "프로젝트 제안하기",
            href: "/work-with-us",
            icon: Rocket,
            description: "새로운 프로젝트를 제안하고 함께 만들어가세요"
          }}
          secondaryCTA={{
            label: "바운티 참여하기",
            href: "/lab",
            icon: FlaskConical,
            variant: "outline",
            description: "실제 프로젝트에 기여하고 보상을 받으세요"
          }}
          variant="gradient"
        />
      </PageLayout>
    </>
  );
};

export default Portfolio;
