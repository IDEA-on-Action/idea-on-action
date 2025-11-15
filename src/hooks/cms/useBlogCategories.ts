import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseQuery, useSupabaseMutation, supabaseQuery } from '@/lib/react-query';
import type { BlogCategory, BlogCategoryInsert, BlogCategoryUpdate } from '@/types/cms.types';

/**
 * Hook to fetch all blog categories (sorted by name)
 */
export const useBlogCategories = () => {
  return useSupabaseQuery<BlogCategory[]>({
    queryKey: ['blog_categories'],
    queryFn: async () => {
      return await supabaseQuery(
        async () => {
          const result = await supabase
            .from('blog_categories')
            .select('*')
            .order('name', { ascending: true });
          return { data: result.data, error: result.error };
        },
        {
          table: 'blog_categories',
          operation: '블로그 카테고리 목록 조회',
          fallbackValue: [],
        }
      );
    },
    table: 'blog_categories',
    operation: '블로그 카테고리 목록 조회',
    fallbackValue: [],
    staleTime: 10 * 60 * 1000, // 10 minutes (카테고리는 상대적으로 정적)
  });
};

/**
 * Hook to fetch a single blog category by ID
 */
export const useBlogCategory = (id: string) => {
  return useSupabaseQuery<BlogCategory>({
    queryKey: ['blog_categories', id],
    queryFn: async () => {
      return await supabaseQuery(
        async () => {
          const result = await supabase
            .from('blog_categories')
            .select('*')
            .eq('id', id)
            .single();
          return { data: result.data, error: result.error };
        },
        {
          table: 'blog_categories',
          operation: '블로그 카테고리 상세 조회',
          fallbackValue: null,
        }
      );
    },
    table: 'blog_categories',
    operation: '블로그 카테고리 상세 조회',
    fallbackValue: null,
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to fetch a single blog category by slug
 */
export const useBlogCategoryBySlug = (slug: string) => {
  return useSupabaseQuery<BlogCategory>({
    queryKey: ['blog_categories', 'slug', slug],
    queryFn: async () => {
      return await supabaseQuery(
        async () => {
          const result = await supabase
            .from('blog_categories')
            .select('*')
            .eq('slug', slug)
            .single();
          return { data: result.data, error: result.error };
        },
        {
          table: 'blog_categories',
          operation: '블로그 카테고리 slug 조회',
          fallbackValue: null,
        }
      );
    },
    table: 'blog_categories',
    operation: '블로그 카테고리 slug 조회',
    fallbackValue: null,
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to create a new blog category (Admin only)
 */
export const useCreateBlogCategory = () => {
  const queryClient = useQueryClient();

  return useSupabaseMutation<BlogCategory, BlogCategoryInsert>({
    mutationFn: async (category: BlogCategoryInsert) => {
      // Validate hex color code (optional)
      if (category.color && !/^#[0-9A-Fa-f]{6}$/.test(category.color)) {
        throw new Error('Invalid hex color code. Expected format: #RRGGBB');
      }

      const { data, error } = await supabase
        .from('blog_categories')
        .insert([category])
        .select()
        .single();

      if (error) throw error;
      return data as BlogCategory;
    },
    table: 'blog_categories',
    operation: '블로그 카테고리 생성',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog_categories'] });
    },
  });
};

/**
 * Hook to update a blog category (Admin only)
 */
export const useUpdateBlogCategory = () => {
  const queryClient = useQueryClient();

  return useSupabaseMutation<BlogCategory, { id: string; updates: BlogCategoryUpdate }>({
    mutationFn: async ({ id, updates }: { id: string; updates: BlogCategoryUpdate }) => {
      // Validate hex color code (optional)
      if (updates.color && !/^#[0-9A-Fa-f]{6}$/.test(updates.color)) {
        throw new Error('Invalid hex color code. Expected format: #RRGGBB');
      }

      const { data, error } = await supabase
        .from('blog_categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as BlogCategory;
    },
    table: 'blog_categories',
    operation: '블로그 카테고리 수정',
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blog_categories'] });
      queryClient.invalidateQueries({ queryKey: ['blog_categories', data.id] });
      queryClient.invalidateQueries({ queryKey: ['blog_categories', 'slug', data.slug] });
    },
  });
};

/**
 * Hook to delete a blog category (Admin only)
 */
export const useDeleteBlogCategory = () => {
  const queryClient = useQueryClient();

  return useSupabaseMutation<string, string>({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blog_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    table: 'blog_categories',
    operation: '블로그 카테고리 삭제',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog_categories'] });
    },
  });
};

/**
 * Hook to update category post count (Internal use)
 * This is used after blog posts are created/deleted to keep the cache in sync
 */
export const useUpdateCategoryPostCount = () => {
  const queryClient = useQueryClient();

  return useSupabaseMutation<BlogCategory, { id: string; count: number }>({
    mutationFn: async ({ id, count }: { id: string; count: number }) => {
      const { data, error } = await supabase
        .from('blog_categories')
        .update({ post_count: count })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as BlogCategory;
    },
    table: 'blog_categories',
    operation: '카테고리 포스트 개수 업데이트',
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blog_categories'] });
      queryClient.invalidateQueries({ queryKey: ['blog_categories', data.id] });
    },
  });
};
