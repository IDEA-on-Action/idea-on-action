/**
 * useChangelog Hook
 * TASK-022: Changelog 관련 React Query 훅
 *
 * Provides read operations for changelog entries
 * - 프로젝트별 필터링
 * - 페이지네이션
 * - 단일 항목 조회
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// =====================================================
// TYPES
// =====================================================

/**
 * 변경 항목 타입
 */
interface ChangeItem {
  type: 'feature' | 'fix' | 'breaking';
  description: string;
}

/**
 * 프로젝트 기본 정보 (관계)
 */
interface ProjectSummary {
  id: string;
  title: string;
  slug: string;
}

/**
 * Changelog 엔트리 타입
 */
export interface ChangelogEntry {
  id: string;
  version: string;
  title: string;
  description: string | null;
  changes: ChangeItem[];
  project_id: string | null;
  github_release_url: string | null;
  released_at: string;
  created_at: string;
  project?: ProjectSummary | null;
}

/**
 * useChangelog 옵션
 */
interface UseChangelogOptions {
  projectId?: string;
  limit?: number;
}

// =====================================================
// QUERY KEYS
// =====================================================

const QUERY_KEYS = {
  all: ['changelog'] as const,
  lists: () => [...QUERY_KEYS.all, 'list'] as const,
  list: (options?: UseChangelogOptions) => [...QUERY_KEYS.lists(), options] as const,
  details: () => [...QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...QUERY_KEYS.details(), id] as const,
};

// =====================================================
// 1. FETCH CHANGELOG LIST
// =====================================================

/**
 * Changelog 목록 조회 훅
 *
 * @param options.projectId - 특정 프로젝트 필터링
 * @param options.limit - 최대 조회 개수
 * @returns React Query 결과 (data, isLoading, error 등)
 *
 * @example
 * ```tsx
 * // 전체 changelog 조회
 * const { data: changelog } = useChangelog();
 *
 * // 특정 프로젝트의 changelog 조회 (최근 5개)
 * const { data } = useChangelog({ projectId: 'project-id', limit: 5 });
 * ```
 */
export function useChangelog(options?: UseChangelogOptions) {
  return useQuery({
    queryKey: QUERY_KEYS.list(options),
    queryFn: async () => {
      let query = supabase
        .from('changelog_entries')
        .select(`
          *,
          project:projects(id, title, slug)
        `)
        .order('released_at', { ascending: false });

      if (options?.projectId) {
        query = query.eq('project_id', options.projectId);
      }
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('[useChangelog] 조회 에러:', error);
        throw error;
      }

      return (data ?? []) as ChangelogEntry[];
    },
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });
}

// =====================================================
// 2. FETCH SINGLE CHANGELOG ENTRY
// =====================================================

/**
 * 단일 Changelog 항목 조회 훅
 *
 * @param id - Changelog 엔트리 ID
 * @returns React Query 결과
 *
 * @example
 * ```tsx
 * const { data: entry, isLoading } = useChangelogEntry('entry-id');
 * ```
 */
export function useChangelogEntry(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('changelog_entries')
        .select(`
          *,
          project:projects(id, title, slug)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('[useChangelogEntry] 조회 에러:', error);
        throw error;
      }

      return data as ChangelogEntry;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10분간 캐시 유지 (단일 항목은 더 길게)
  });
}

// =====================================================
// 3. FETCH CHANGELOG BY PROJECT SLUG
// =====================================================

/**
 * 프로젝트 슬러그로 Changelog 조회 훅
 *
 * @param projectSlug - 프로젝트 슬러그
 * @param limit - 최대 조회 개수
 * @returns React Query 결과
 *
 * @example
 * ```tsx
 * const { data } = useChangelogByProjectSlug('minu-find', 10);
 * ```
 */
export function useChangelogByProjectSlug(projectSlug: string, limit?: number) {
  return useQuery({
    queryKey: ['changelog', 'project-slug', projectSlug, limit],
    queryFn: async () => {
      // 먼저 프로젝트 ID 조회
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('id')
        .eq('slug', projectSlug)
        .single();

      if (projectError) {
        console.error('[useChangelogByProjectSlug] 프로젝트 조회 에러:', projectError);
        throw projectError;
      }

      // 해당 프로젝트의 changelog 조회
      let query = supabase
        .from('changelog_entries')
        .select('*')
        .eq('project_id', project.id)
        .order('released_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('[useChangelogByProjectSlug] Changelog 조회 에러:', error);
        throw error;
      }

      return (data ?? []) as ChangelogEntry[];
    },
    enabled: !!projectSlug,
    staleTime: 5 * 60 * 1000,
  });
}
