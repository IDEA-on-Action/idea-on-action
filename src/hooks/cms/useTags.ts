import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseQuery, useSupabaseMutation, supabaseQuery } from '@/lib/react-query';
import type { Tag, TagInsert, TagUpdate } from '@/types/cms.types';

/**
 * Hook to fetch all tags (sorted by usage_count DESC)
 */
export const useTags = () => {
  return useSupabaseQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: async () => {
      return await supabaseQuery(
        async () => {
          const result = await supabase
            .from('tags')
            .select('*')
            .order('usage_count', { ascending: false })
            .order('created_at', { ascending: false });
          return { data: result.data, error: result.error };
        },
        {
          table: 'tags',
          operation: '태그 목록 조회',
          fallbackValue: [],
        }
      );
    },
    table: 'tags',
    operation: '태그 목록 조회',
    fallbackValue: [],
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch a single tag by ID
 */
export const useTag = (id: string) => {
  return useSupabaseQuery<Tag>({
    queryKey: ['tags', id],
    queryFn: async () => {
      return await supabaseQuery(
        async () => {
          const result = await supabase
            .from('tags')
            .select('*')
            .eq('id', id)
            .single();
          return { data: result.data, error: result.error };
        },
        {
          table: 'tags',
          operation: '태그 상세 조회',
          fallbackValue: null,
        }
      );
    },
    table: 'tags',
    operation: '태그 상세 조회',
    fallbackValue: null,
    enabled: !!id,
  });
};

/**
 * Hook to fetch a single tag by slug
 */
export const useTagBySlug = (slug: string) => {
  return useSupabaseQuery<Tag>({
    queryKey: ['tags', 'slug', slug],
    queryFn: async () => {
      return await supabaseQuery(
        async () => {
          const result = await supabase
            .from('tags')
            .select('*')
            .eq('slug', slug)
            .single();
          return { data: result.data, error: result.error };
        },
        {
          table: 'tags',
          operation: '태그 slug 조회',
          fallbackValue: null,
        }
      );
    },
    table: 'tags',
    operation: '태그 slug 조회',
    fallbackValue: null,
    enabled: !!slug,
  });
};

/**
 * Hook to fetch popular tags (by usage_count, with limit)
 */
export const usePopularTags = (limit: number = 10) => {
  return useSupabaseQuery<Tag[]>({
    queryKey: ['tags', 'popular', limit],
    queryFn: async () => {
      return await supabaseQuery(
        async () => {
          const result = await supabase
            .from('tags')
            .select('*')
            .order('usage_count', { ascending: false })
            .limit(limit);
          return { data: result.data, error: result.error };
        },
        {
          table: 'tags',
          operation: '인기 태그 조회',
          fallbackValue: [],
        }
      );
    },
    table: 'tags',
    operation: '인기 태그 조회',
    fallbackValue: [],
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to create a new tag (Admin only)
 */
export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useSupabaseMutation<Tag, TagInsert>({
    mutationFn: async (tag: TagInsert) => {
      // Validate unique constraints will be enforced by DB
      const { data, error } = await supabase
        .from('tags')
        .insert([tag])
        .select()
        .single();

      if (error) throw error;
      return data as Tag;
    },
    table: 'tags',
    operation: '태그 생성',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};

/**
 * Hook to update a tag (Admin only)
 */
export const useUpdateTag = () => {
  const queryClient = useQueryClient();

  return useSupabaseMutation<Tag, { id: string; updates: TagUpdate }>({
    mutationFn: async ({ id, updates }: { id: string; updates: TagUpdate }) => {
      const { data, error } = await supabase
        .from('tags')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Tag;
    },
    table: 'tags',
    operation: '태그 수정',
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      queryClient.invalidateQueries({ queryKey: ['tags', data.id] });
      queryClient.invalidateQueries({ queryKey: ['tags', 'slug', data.slug] });
    },
  });
};

/**
 * Hook to delete a tag (Admin only)
 */
export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  return useSupabaseMutation<string, string>({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    table: 'tags',
    operation: '태그 삭제',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};

/**
 * Hook to increment tag usage count (Internal use)
 * This should be called when a tag is associated with new content
 */
export const useIncrementTagUsage = () => {
  const queryClient = useQueryClient();

  return useSupabaseMutation<Tag, string>({
    mutationFn: async (tagId: string) => {
      // Increment usage_count by 1
      const { data, error } = await supabase.rpc('increment_tag_usage', {
        tag_id: tagId,
      });

      if (error) {
        // Fallback: manual increment if RPC doesn't exist
        const { data: currentTag, error: fetchError } = await supabase
          .from('tags')
          .select('usage_count')
          .eq('id', tagId)
          .single();

        if (fetchError) throw fetchError;

        const { data: updatedTag, error: updateError } = await supabase
          .from('tags')
          .update({ usage_count: (currentTag?.usage_count || 0) + 1 })
          .eq('id', tagId)
          .select()
          .single();

        if (updateError) throw updateError;
        return updatedTag as Tag;
      }

      return data as Tag;
    },
    table: 'tags',
    operation: '태그 사용 횟수 증가',
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      queryClient.invalidateQueries({ queryKey: ['tags', data.id] });
      queryClient.invalidateQueries({ queryKey: ['tags', 'popular'] });
    },
  });
};
