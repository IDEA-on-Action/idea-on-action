/**
 * useMediaList Hook
 *
 * Provides media list operations with React Query integration.
 * Supports both pagination and infinite scroll modes.
 *
 * @example
 * // Pagination mode (default)
 * const { data, fetchNextPage, hasNextPage } = useMediaList({
 *   params: { page: 1, per_page: 20 },
 *   mode: 'pagination'
 * });
 *
 * // Infinite scroll mode
 * const { data, fetchNextPage, hasNextPage } = useMediaList({
 *   params: { per_page: 20 },
 *   mode: 'infinite'
 * });
 */

import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { MediaItem, MediaSearchParams } from '@/types/cms.types';

// =====================================================
// Constants
// =====================================================

const DEFAULT_PER_PAGE = 20;

// =====================================================
// Query Keys
// =====================================================

export const mediaListQueryKeys = {
  all: ['media-list'] as const,
  lists: () => [...mediaListQueryKeys.all, 'list'] as const,
  list: (params?: MediaSearchParams) => [...mediaListQueryKeys.lists(), params] as const,
  infinite: (params?: MediaSearchParams) => [...mediaListQueryKeys.all, 'infinite', params] as const,
};

// =====================================================
// Types
// =====================================================

export interface UseMediaListOptions {
  /**
   * Search and filter parameters
   */
  params?: MediaSearchParams;

  /**
   * Query mode: 'pagination' for regular pagination, 'infinite' for infinite scroll
   */
  mode?: 'pagination' | 'infinite';

  /**
   * Enable or disable the query
   */
  enabled?: boolean;

  /**
   * Stale time in milliseconds (default: 5 minutes)
   */
  staleTime?: number;
}

export interface MediaListResult {
  data: MediaItem[];
  count: number;
  page: number;
  perPage: number;
  totalPages: number;
  hasNextPage: boolean;
}

// =====================================================
// Fetch Function
// =====================================================

async function fetchMediaList(
  params: MediaSearchParams,
  page: number = 1
): Promise<MediaListResult> {
  let query = supabase
    .from('media_library')
    .select('*', { count: 'exact' })
    .is('deleted_at', null);

  // Apply search filter
  if (params.search) {
    query = query.or(`filename.ilike.%${params.search}%,original_filename.ilike.%${params.search}%`);
  }

  // Apply mime type filter
  if (params.mime_type) {
    query = query.ilike('mime_type', `${params.mime_type}%`);
  }

  // Apply date range filters
  if (params.date_from) {
    query = query.gte('created_at', params.date_from);
  }
  if (params.date_to) {
    query = query.lte('created_at', params.date_to);
  }

  // Apply sorting
  const sortBy = params.sort_by || 'created_at';
  const sortOrder = params.sort_order || 'desc';
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  // Apply pagination
  const perPage = params.per_page || DEFAULT_PER_PAGE;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('[useMediaList] Query error:', error);
    throw error;
  }

  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / perPage);

  return {
    data: (data || []) as MediaItem[],
    count: totalCount,
    page,
    perPage,
    totalPages,
    hasNextPage: page < totalPages,
  };
}

// =====================================================
// Hook: Pagination Mode
// =====================================================

function useMediaListPagination(options: UseMediaListOptions) {
  const { params = {}, enabled = true, staleTime = 1000 * 60 * 5 } = options;

  return useQuery({
    queryKey: mediaListQueryKeys.list(params),
    queryFn: () => fetchMediaList(params, params.page || 1),
    enabled,
    staleTime,
  });
}

// =====================================================
// Hook: Infinite Scroll Mode
// =====================================================

function useMediaListInfinite(options: UseMediaListOptions) {
  const { params = {}, enabled = true, staleTime = 1000 * 60 * 5 } = options;

  return useInfiniteQuery({
    queryKey: mediaListQueryKeys.infinite(params),
    queryFn: ({ pageParam = 1 }) => fetchMediaList(params, pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.hasNextPage) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled,
    staleTime,
  });
}

// =====================================================
// Main Hook
// =====================================================

export function useMediaList(options: UseMediaListOptions = {}) {
  const { mode = 'pagination' } = options;
  const queryClient = useQueryClient();

  // Use the appropriate query hook based on mode
  const paginationQuery = useMediaListPagination({
    ...options,
    enabled: mode === 'pagination' && (options.enabled ?? true),
  });

  const infiniteQuery = useMediaListInfinite({
    ...options,
    enabled: mode === 'infinite' && (options.enabled ?? true),
  });

  // Invalidate queries
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: mediaListQueryKeys.lists() });
    queryClient.invalidateQueries({ queryKey: mediaListQueryKeys.infinite() });
  };

  // Return based on mode
  if (mode === 'infinite') {
    const allItems = infiniteQuery.data?.pages.flatMap((page) => page.data) || [];
    const lastPage = infiniteQuery.data?.pages[infiniteQuery.data.pages.length - 1];

    return {
      // Data
      mediaItems: allItems,
      totalCount: lastPage?.count || 0,
      currentPage: lastPage?.page || 1,
      totalPages: lastPage?.totalPages || 0,

      // State
      isLoading: infiniteQuery.isLoading,
      isFetching: infiniteQuery.isFetching,
      isFetchingNextPage: infiniteQuery.isFetchingNextPage,
      error: infiniteQuery.error,

      // Infinite scroll specific
      hasNextPage: infiniteQuery.hasNextPage,
      fetchNextPage: infiniteQuery.fetchNextPage,

      // Methods
      refetch: infiniteQuery.refetch,
      invalidate,
    };
  }

  // Pagination mode (default)
  return {
    // Data
    mediaItems: paginationQuery.data?.data || [],
    totalCount: paginationQuery.data?.count || 0,
    currentPage: paginationQuery.data?.page || 1,
    totalPages: paginationQuery.data?.totalPages || 0,

    // State
    isLoading: paginationQuery.isLoading,
    isFetching: paginationQuery.isFetching,
    isFetchingNextPage: false,
    error: paginationQuery.error,

    // Infinite scroll specific (disabled in pagination mode)
    hasNextPage: (paginationQuery.data?.page || 1) < (paginationQuery.data?.totalPages || 0),
    fetchNextPage: () => Promise.resolve(),

    // Methods
    refetch: paginationQuery.refetch,
    invalidate,
  };
}

export default useMediaList;
