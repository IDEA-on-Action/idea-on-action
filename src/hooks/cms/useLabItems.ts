import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseQuery, useSupabaseMutation, supabaseQuery } from '@/lib/react-query';
import type { LabItem, LabItemInsert, LabItemUpdate, LabCategory, LabStatus } from '@/types/cms.types';

/**
 * Hook to fetch all lab items
 */
export const useLabItems = () => {
  return useSupabaseQuery<LabItem[]>({
    queryKey: ['lab_items'],
    queryFn: async () => {
      return await supabaseQuery(
        async () => {
          const result = await supabase
            .from('lab_items')
            .select('*')
            .order('created_at', { ascending: false });
          return { data: result.data, error: result.error };
        },
        {
          table: 'lab_items',
          operation: 'Lab 목록 조회',
          fallbackValue: [],
        }
      );
    },
    table: 'lab_items',
    operation: 'Lab 목록 조회',
    fallbackValue: [],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a single lab item by ID
 */
export const useLabItem = (id: string) => {
  return useSupabaseQuery<LabItem>({
    queryKey: ['lab_items', id],
    queryFn: async () => {
      return await supabaseQuery(
        async () => {
          const result = await supabase
            .from('lab_items')
            .select('*')
            .eq('id', id)
            .single();
          return { data: result.data, error: result.error };
        },
        {
          table: 'lab_items',
          operation: 'Lab 상세 조회',
          fallbackValue: null,
        }
      );
    },
    table: 'lab_items',
    operation: 'Lab 상세 조회',
    fallbackValue: null,
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch a single lab item by slug
 */
export const useLabItemBySlug = (slug: string) => {
  return useSupabaseQuery<LabItem>({
    queryKey: ['lab_items', 'slug', slug],
    queryFn: async () => {
      return await supabaseQuery(
        async () => {
          const result = await supabase
            .from('lab_items')
            .select('*')
            .eq('slug', slug)
            .single();
          return { data: result.data, error: result.error };
        },
        {
          table: 'lab_items',
          operation: 'Lab slug 조회',
          fallbackValue: null,
        }
      );
    },
    table: 'lab_items',
    operation: 'Lab slug 조회',
    fallbackValue: null,
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch lab items by category
 */
export const useLabItemsByCategory = (category?: LabCategory) => {
  return useSupabaseQuery<LabItem[]>({
    queryKey: ['lab_items', 'category', category],
    queryFn: async () => {
      return await supabaseQuery(
        async () => {
          let query = supabase
            .from('lab_items')
            .select('*')
            .order('created_at', { ascending: false });

          if (category) {
            query = query.eq('category', category);
          }

          const result = await query;
          return { data: result.data, error: result.error };
        },
        {
          table: 'lab_items',
          operation: 'Lab 카테고리별 조회',
          fallbackValue: [],
        }
      );
    },
    table: 'lab_items',
    operation: 'Lab 카테고리별 조회',
    fallbackValue: [],
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch lab items by status
 */
export const useLabItemsByStatus = (status?: LabStatus) => {
  return useSupabaseQuery<LabItem[]>({
    queryKey: ['lab_items', 'status', status],
    queryFn: async () => {
      return await supabaseQuery(
        async () => {
          let query = supabase
            .from('lab_items')
            .select('*')
            .order('created_at', { ascending: false });

          if (status) {
            query = query.eq('status', status);
          }

          const result = await query;
          return { data: result.data, error: result.error };
        },
        {
          table: 'lab_items',
          operation: 'Lab 상태별 조회',
          fallbackValue: [],
        }
      );
    },
    table: 'lab_items',
    operation: 'Lab 상태별 조회',
    fallbackValue: [],
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch published lab items
 */
export const usePublishedLabItems = () => {
  return useSupabaseQuery<LabItem[]>({
    queryKey: ['lab_items', 'published'],
    queryFn: async () => {
      return await supabaseQuery(
        async () => {
          const result = await supabase
            .from('lab_items')
            .select('*')
            .eq('published', true)
            .order('created_at', { ascending: false });
          return { data: result.data, error: result.error };
        },
        {
          table: 'lab_items',
          operation: 'Lab published 조회',
          fallbackValue: [],
        }
      );
    },
    table: 'lab_items',
    operation: 'Lab published 조회',
    fallbackValue: [],
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to create a new lab item (Admin only)
 */
export const useCreateLabItem = () => {
  const queryClient = useQueryClient();

  return useSupabaseMutation<LabItem, LabItemInsert>({
    mutationFn: async (item: LabItemInsert) => {
      const { data, error } = await supabase
        .from('lab_items')
        .insert([item])
        .select()
        .single();

      if (error) throw error;
      return data as LabItem;
    },
    table: 'lab_items',
    operation: 'Lab 생성',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lab_items'] });
    },
  });
};

/**
 * Hook to update a lab item (Admin only)
 */
export const useUpdateLabItem = () => {
  const queryClient = useQueryClient();

  return useSupabaseMutation<LabItem, { id: string; updates: LabItemUpdate }>({
    mutationFn: async ({ id, updates }: { id: string; updates: LabItemUpdate }) => {
      const { data, error } = await supabase
        .from('lab_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as LabItem;
    },
    table: 'lab_items',
    operation: 'Lab 수정',
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['lab_items'] });
      queryClient.invalidateQueries({ queryKey: ['lab_items', data.id] });
      queryClient.invalidateQueries({ queryKey: ['lab_items', 'slug', data.slug] });
    },
  });
};

/**
 * Hook to delete a lab item (Admin only)
 */
export const useDeleteLabItem = () => {
  const queryClient = useQueryClient();

  return useSupabaseMutation<string, string>({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('lab_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    table: 'lab_items',
    operation: 'Lab 삭제',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lab_items'] });
    },
  });
};
