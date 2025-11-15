import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseQuery, useSupabaseMutation, supabaseQuery } from '@/lib/react-query';
import type { PortfolioItem } from '@/types/v2';

/**
 * Hook to fetch all portfolio items
 */
export const usePortfolioItems = () => {
  return useSupabaseQuery<PortfolioItem[]>({
    queryKey: ['portfolio_items'],
    queryFn: async () => {
      return await supabaseQuery(
        async () => {
          const result = await supabase
            .from('portfolio_items')
            .select('*')
            .order('created_at', { ascending: false });
          return { data: result.data, error: result.error };
        },
        {
          table: 'portfolio_items',
          operation: 'Portfolio 목록 조회',
          fallbackValue: [],
        }
      );
    },
    table: 'portfolio_items',
    operation: 'Portfolio 목록 조회',
    fallbackValue: [],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a single portfolio item by ID
 */
export const usePortfolioItem = (id: string) => {
  return useSupabaseQuery<PortfolioItem>({
    queryKey: ['portfolio_items', id],
    queryFn: async () => {
      return await supabaseQuery(
        async () => {
          const result = await supabase
            .from('portfolio_items')
            .select('*')
            .eq('id', id)
            .single();
          return { data: result.data, error: result.error };
        },
        {
          table: 'portfolio_items',
          operation: 'Portfolio 상세 조회',
          fallbackValue: null,
        }
      );
    },
    table: 'portfolio_items',
    operation: 'Portfolio 상세 조회',
    fallbackValue: null,
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch a single portfolio item by slug
 */
export const usePortfolioItemBySlug = (slug: string) => {
  return useSupabaseQuery<PortfolioItem>({
    queryKey: ['portfolio_items', 'slug', slug],
    queryFn: async () => {
      return await supabaseQuery(
        async () => {
          const result = await supabase
            .from('portfolio_items')
            .select('*')
            .eq('slug', slug)
            .single();
          return { data: result.data, error: result.error };
        },
        {
          table: 'portfolio_items',
          operation: 'Portfolio slug 조회',
          fallbackValue: null,
        }
      );
    },
    table: 'portfolio_items',
    operation: 'Portfolio slug 조회',
    fallbackValue: null,
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch portfolio items by project type
 */
export const usePortfolioItemsByType = (projectType?: PortfolioItem['project_type']) => {
  return useSupabaseQuery<PortfolioItem[]>({
    queryKey: ['portfolio_items', 'type', projectType],
    queryFn: async () => {
      return await supabaseQuery(
        async () => {
          let query = supabase
            .from('portfolio_items')
            .select('*')
            .order('created_at', { ascending: false });

          if (projectType) {
            query = query.eq('project_type', projectType);
          }

          const result = await query;
          return { data: result.data, error: result.error };
        },
        {
          table: 'portfolio_items',
          operation: 'Portfolio 타입별 조회',
          fallbackValue: [],
        }
      );
    },
    table: 'portfolio_items',
    operation: 'Portfolio 타입별 조회',
    fallbackValue: [],
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch featured portfolio items
 */
export const useFeaturedPortfolioItems = () => {
  return useSupabaseQuery<PortfolioItem[]>({
    queryKey: ['portfolio_items', 'featured'],
    queryFn: async () => {
      return await supabaseQuery(
        async () => {
          const result = await supabase
            .from('portfolio_items')
            .select('*')
            .eq('featured', true)
            .order('created_at', { ascending: false });
          return { data: result.data, error: result.error };
        },
        {
          table: 'portfolio_items',
          operation: 'Portfolio featured 조회',
          fallbackValue: [],
        }
      );
    },
    table: 'portfolio_items',
    operation: 'Portfolio featured 조회',
    fallbackValue: [],
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch published portfolio items
 */
export const usePublishedPortfolioItems = () => {
  return useSupabaseQuery<PortfolioItem[]>({
    queryKey: ['portfolio_items', 'published'],
    queryFn: async () => {
      return await supabaseQuery(
        async () => {
          const result = await supabase
            .from('portfolio_items')
            .select('*')
            .eq('published', true)
            .order('created_at', { ascending: false });
          return { data: result.data, error: result.error };
        },
        {
          table: 'portfolio_items',
          operation: 'Portfolio published 조회',
          fallbackValue: [],
        }
      );
    },
    table: 'portfolio_items',
    operation: 'Portfolio published 조회',
    fallbackValue: [],
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to create a new portfolio item (Admin only)
 */
export const useCreatePortfolioItem = () => {
  const queryClient = useQueryClient();

  return useSupabaseMutation<PortfolioItem, Omit<PortfolioItem, 'id' | 'created_at' | 'updated_at'>>({
    mutationFn: async (item: Omit<PortfolioItem, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('portfolio_items')
        .insert([item])
        .select()
        .single();

      if (error) throw error;
      return data as PortfolioItem;
    },
    table: 'portfolio_items',
    operation: 'Portfolio 생성',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio_items'] });
    },
  });
};

/**
 * Hook to update a portfolio item (Admin only)
 */
export const useUpdatePortfolioItem = () => {
  const queryClient = useQueryClient();

  return useSupabaseMutation<PortfolioItem, { id: string; updates: Partial<PortfolioItem> }>({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<PortfolioItem> }) => {
      const { data, error } = await supabase
        .from('portfolio_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as PortfolioItem;
    },
    table: 'portfolio_items',
    operation: 'Portfolio 수정',
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['portfolio_items'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio_items', data.id] });
      queryClient.invalidateQueries({ queryKey: ['portfolio_items', 'slug', data.slug] });
    },
  });
};

/**
 * Hook to delete a portfolio item (Admin only)
 */
export const useDeletePortfolioItem = () => {
  const queryClient = useQueryClient();

  return useSupabaseMutation<string, string>({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    table: 'portfolio_items',
    operation: 'Portfolio 삭제',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio_items'] });
    },
  });
};
