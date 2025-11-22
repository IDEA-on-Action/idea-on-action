/**
 * Changelog Page
 * 릴리즈 노트 및 변경사항 페이지
 *
 * TASK-017: Changelog 페이지 생성
 */

import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { FileText, Filter, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChangelogEntry, type ChangelogEntryData } from "@/components/stories/ChangelogEntry";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 더미 데이터 (나중에 useChangelog 훅으로 교체)
const changelogEntries: ChangelogEntryData[] = [
  {
    id: "1",
    version: "v2.6.0",
    title: "사이트 재구조화 Sprint 1 완료",
    released_at: "2025-11-23",
    changes: [
      { type: "feature", description: "메뉴 7개 → 5개로 단순화 (홈/서비스/프로젝트/이야기/함께하기)" },
      { type: "feature", description: "허브 페이지 3개 신규 생성 (ProjectsHub, StoriesHub, ConnectHub)" },
      { type: "fix", description: "리디렉션 라우트 8개 설정 (/about → /, /roadmap → /projects?tab=roadmap 등)" },
      { type: "improvement", description: "E2E 테스트 2개 신규 작성 (navigation.spec.ts, redirects.spec.ts)" },
    ],
    project: { title: "IDEA on Action", slug: "idea-on-action" },
  },
  {
    id: "2",
    version: "v2.5.0",
    title: "CMS Phase 5 완료 - 리치 텍스트 에디터 & 미디어 라이브러리",
    released_at: "2025-11-22",
    changes: [
      { type: "feature", description: "Tiptap 리치 텍스트 에디터 고급 Extensions 4개 추가" },
      { type: "feature", description: "미디어 라이브러리 고도화 (Storage bucket 마이그레이션)" },
      { type: "feature", description: "useMediaUpload, useMediaList 훅 신규 생성" },
      { type: "improvement", description: "MediaUploader 접근성 개선 (WCAG 2.1 AA, 한글화)" },
      { type: "fix", description: "XSS 방지 및 보안 강화" },
    ],
    project: { title: "IDEA on Action CMS" },
  },
  {
    id: "3",
    version: "v2.4.0",
    title: "Minu 브랜드 전환 완료",
    released_at: "2025-11-21",
    changes: [
      { type: "breaking", description: "COMPASS → Minu 시리즈 리브랜딩" },
      { type: "feature", description: "Compass Navigator → Minu Find (사업기회 탐색)" },
      { type: "feature", description: "Compass Cartographer → Minu Frame (문제정의 & RFP)" },
      { type: "feature", description: "Compass Captain → Minu Build (프로젝트 진행)" },
      { type: "feature", description: "Compass Harbor → Minu Keep (운영/유지보수)" },
      { type: "improvement", description: "MCP 서버 연동 완료 - Minu 4개 서비스 페이지 MCP 클라이언트 통합" },
    ],
    project: { title: "Minu Platform" },
  },
  {
    id: "4",
    version: "v2.3.0",
    title: "Newsletter CSV Export 및 보안 강화",
    released_at: "2025-11-20",
    changes: [
      { type: "feature", description: "Newsletter CSV Export 날짜 필터 완성" },
      { type: "feature", description: "DateRangePicker 컴포넌트 신규 추가" },
      { type: "fix", description: "Function Search Path 보안 강화 - 67개 함수 SQL Injection 방어" },
      { type: "improvement", description: "보안 점수 98/100 달성" },
    ],
    project: { title: "IDEA on Action" },
  },
  {
    id: "5",
    version: "v2.2.0",
    title: "Services Platform Day 3 검증 완료",
    released_at: "2025-11-19",
    changes: [
      { type: "docs", description: "프로덕션 배포 검증 보고서 3개 작성" },
      { type: "feature", description: "CMS Phase 3 완료 - Admin 가이드 6개, API 문서 7개" },
      { type: "fix", description: "Supabase Security Issues 수정 - Newsletter 시스템 보안 강화" },
      { type: "improvement", description: "CMS Phase 2 완료 - 4개 Admin 페이지 병렬 구현" },
    ],
    project: { title: "IDEA on Action" },
  },
  {
    id: "6",
    version: "v2.1.0",
    title: "Version 2.0 리팩토링 완료",
    released_at: "2025-11-16",
    changes: [
      { type: "improvement", description: "ESLint 경고: 67개 → 2개 (-97%)" },
      { type: "improvement", description: "TypeScript any: 60+개 → 2개 (-97%)" },
      { type: "improvement", description: "초기 번들: ~500 kB → 338 kB gzip (-32%)" },
      { type: "improvement", description: "PWA precache: 4,031 KiB → 2,167 KiB (-46%)" },
      { type: "improvement", description: "Dependencies: 107개 → 94개 (-12%)" },
    ],
    project: { title: "IDEA on Action" },
  },
  {
    id: "7",
    version: "v2.0.0",
    title: "Version 2.0 메이저 업데이트",
    released_at: "2025-11-15",
    changes: [
      { type: "breaking", description: "아이디어 실험실 & 커뮤니티형 프로덕트 스튜디오로 진화" },
      { type: "feature", description: "Roadmap, Portfolio, Now, Lab, Community 상호작용 구조" },
      { type: "feature", description: "Admin CRUD E2E 테스트: 154개 신규 생성" },
      { type: "improvement", description: "4개 에이전트 동시 작업으로 전면 개선" },
    ],
    project: { title: "IDEA on Action" },
  },
];

// 프로젝트 목록 추출 (필터용)
const projects = Array.from(
  new Set(changelogEntries.map((entry) => entry.project?.title).filter(Boolean))
) as string[];

export default function Changelog() {
  const [selectedProject, setSelectedProject] = useState<string>("");

  // 필터링된 엔트리
  const filteredEntries = selectedProject
    ? changelogEntries.filter((entry) => entry.project?.title === selectedProject)
    : changelogEntries;

  const clearFilters = () => {
    setSelectedProject("");
  };

  const hasActiveFilters = Boolean(selectedProject);

  return (
    <>
      <Helmet>
        <title>변경사항 | IDEA on Action</title>
        <meta
          name="description"
          content="IDEA on Action 서비스의 업데이트 내역과 릴리즈 노트를 확인하세요."
        />
      </Helmet>

      <Header />
      <main id="main-content" className="min-h-screen gradient-bg">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 mb-6">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                변경사항
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                서비스 업데이트 내역과 릴리즈 노트
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-4 border-y bg-card/50">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              {/* Project Filter */}
              <div className="flex items-center gap-4">
                <Select
                  value={selectedProject || "all"}
                  onValueChange={(value) =>
                    setSelectedProject(value === "all" ? "" : value)
                  }
                >
                  <SelectTrigger className="w-[200px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="프로젝트 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 프로젝트</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project} value={project}>
                        {project}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {hasActiveFilters && (
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    <X className="w-4 h-4 mr-2" />
                    필터 초기화
                  </Button>
                )}
              </div>

              {/* 결과 수 */}
              <p className="text-sm text-muted-foreground">
                {filteredEntries.length}개의 릴리즈
              </p>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {/* 빈 상태 */}
            {filteredEntries.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  해당 프로젝트의 변경사항이 없습니다.
                </p>
                {hasActiveFilters && (
                  <Button variant="link" onClick={clearFilters} className="mt-2">
                    필터 초기화
                  </Button>
                )}
              </div>
            ) : (
              /* 타임라인 리스트 */
              <div className="relative max-w-3xl mx-auto">
                {/* 타임라인 세로선 */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-border ml-[0.5px]" />

                {/* 엔트리 목록 */}
                <div className="space-y-8 pl-8">
                  {filteredEntries.map((entry) => (
                    <ChangelogEntry key={entry.id} {...entry} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 하단 안내 */}
        <section className="py-8 border-t bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground">
              이전 버전의 변경사항은{" "}
              <a
                href="https://github.com/IDEA-on-Action/idea-on-action/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                GitHub Releases
              </a>
              에서 확인할 수 있습니다.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
