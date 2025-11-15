import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseQuery, useSupabaseMutation, supabaseQuery } from '@/lib/react-query';
import type { RoadmapItem } from '@/types/v2';

/**
 * Hook to fetch all roadmap items
 */
export const useRoadmapItems = () => {
  return useSupabaseQuery<RoadmapItem[]>({
    queryKey: ['roadmap-items'],
    queryFn: async () => {
      return await supabaseQuery(
        async () => {
          const result = await supabase
            .from('roadmap_items')
            .select('*')
            .order('priority', { ascending: false })
            .order('created_at', { ascending: false });
          return { data: result.data, error: result.error };
        },
        {
          table: 'roadmap_items',
          operation: 'Roadmap 아이템 목록 조회',
          fallbackValue: [],
        }
      );
    },
    table: 'roadmap_items',
    operation: 'Roadmap 아이템 목록 조회',
    fallbackValue: [],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a single roadmap item by ID
 */
export const useRoadmapItem = (id: string) => {
  return useSupabaseQuery<RoadmapItem>({
    queryKey: ['roadmap-items', id],
    queryFn: async () => {
      return await supabaseQuery(
        async () => {
          const result = await supabase
            .from('roadmap_items')
            .select('*')
            .eq('id', id)
            .single();
          return { data: result.data, error: result.error };
        },
        {
          table: 'roadmap_items',
          operation: 'Roadmap 아이템 상세 조회',
          fallbackValue: null,
        }
      );
    },
    table: 'roadmap_items',
    operation: 'Roadmap 아이템 상세 조회',
    fallbackValue: null,
    enabled: !!id,
  });
};

/**
 * Hook to fetch roadmap items by category
 */
export const useRoadmapItemsByCategory = (category?: RoadmapItem['category']) => {
  return useSupabaseQuery<RoadmapItem[]>({
    queryKey: ['roadmap-items', 'category', category],
    queryFn: async () => {
      return await supabaseQuery(
        async () => {
          let query = supabase
            .from('roadmap_items')
            .select('*')
            .order('priority', { ascending: false })
            .order('created_at', { ascending: false });

          if (category) {
            query = query.eq('category', category);
          }

          const result = await query;
          return { data: result.data, error: result.error };
        },
        {
          table: 'roadmap_items',
          operation: 'Roadmap 아이템 카테고리별 조회',
          fallbackValue: [],
        }
      );
    },
    table: 'roadmap_items',
    operation: 'Roadmap 아이템 카테고리별 조회',
    fallbackValue: [],
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch roadmap items by status
 */
export const useRoadmapItemsByStatus = (status?: RoadmapItem['status']) => {
  return useSupabaseQuery<RoadmapItem[]>({
    queryKey: ['roadmap-items', 'status', status],
    queryFn: async () => {
      return await supabaseQuery(
        async () => {
          let query = supabase
            .from('roadmap_items')
            .select('*')
            .order('priority', { ascending: false })
            .order('created_at', { ascending: false });

          if (status) {
            query = query.eq('status', status);
          }

          const result = await query;
          return { data: result.data, error: result.error };
        },
        {
          table: 'roadmap_items',
          operation: 'Roadmap 아이템 상태별 조회',
          fallbackValue: [],
        }
      );
    },
    table: 'roadmap_items',
    operation: 'Roadmap 아이템 상태별 조회',
    fallbackValue: [],
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch only published roadmap items (public-facing)
 */
export const usePublishedRoadmapItems = () => {
  return useSupabaseQuery<RoadmapItem[]>({
    queryKey: ['roadmap-items', 'published'],
    queryFn: async () => {
      return await supabaseQuery(
        async () => {
          const result = await supabase
            .from('roadmap_items')
            .select('*')
            .eq('published', true)
            .order('priority', { ascending: false })
            .order('created_at', { ascending: false });
          return { data: result.data, error: result.error };
        },
        {
          table: 'roadmap_items',
          operation: '공개 Roadmap 아이템 조회',
          fallbackValue: [],
        }
      );
    },
    table: 'roadmap_items',
    operation: '공개 Roadmap 아이템 조회',
    fallbackValue: [],
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to create a new roadmap item (Admin only)
 */
export const useCreateRoadmapItem = () => {
  const queryClient = useQueryClient();

  return useSupabaseMutation<RoadmapItem, Omit<RoadmapItem, 'id' | 'created_at' | 'updated_at'>>({
    mutationFn: async (item: Omit<RoadmapItem, 'id' | 'created_at' | 'updated_at'>) => {
      // Validate progress is 0-100
      if (item.progress < 0 || item.progress > 100) {
        throw new Error('Progress must be between 0 and 100');
      }

      const { data, error } = await supabase
        .from('roadmap_items')
        .insert([item])
        .select()
        .single();

      if (error) throw error;
      return data as RoadmapItem;
    },
    table: 'roadmap_items',
    operation: 'Roadmap 아이템 생성',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap-items'] });
    },
  });
};

/**
 * Hook to update a roadmap item (Admin only)
 */
export const useUpdateRoadmapItem = () => {
  const queryClient = useQueryClient();

  return useSupabaseMutation<RoadmapItem, { id: string; updates: Partial<RoadmapItem> }>({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<RoadmapItem> }) => {
      // Validate progress if provided
      if (updates.progress !== undefined && (updates.progress < 0 || updates.progress > 100)) {
        throw new Error('Progress must be between 0 and 100');
      }

      const { data, error } = await supabase
        .from('roadmap_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as RoadmapItem;
    },
    table: 'roadmap_items',
    operation: 'Roadmap 아이템 수정',
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['roadmap-items'] });
      queryClient.invalidateQueries({ queryKey: ['roadmap-items', data.id] });
    },
  });
};

/**
 * Hook to delete a roadmap item (Admin only)
 */
export const useDeleteRoadmapItem = () => {
  const queryClient = useQueryClient();

  return useSupabaseMutation<string, string>({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('roadmap_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    table: 'roadmap_items',
    operation: 'Roadmap 아이템 삭제',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap-items'] });
    },
  });
};
