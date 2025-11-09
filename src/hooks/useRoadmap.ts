import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Roadmap } from '@/types/v2';

/**
 * Hook to fetch all roadmap items
 */
export const useRoadmap = () => {
  return useQuery({
    queryKey: ['roadmap'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roadmap')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) throw error;
      return data as Roadmap[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a single roadmap item by quarter
 */
export const useRoadmapByQuarter = (quarter: string) => {
  return useQuery({
    queryKey: ['roadmap', quarter],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roadmap')
        .select('*')
        .eq('quarter', quarter)
        .single();

      if (error) throw error;
      return data as Roadmap;
    },
    enabled: !!quarter,
  });
};

/**
 * Hook to create a new roadmap item (Admin only)
 */
export const useCreateRoadmap = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roadmap: Omit<Roadmap, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('roadmap')
        .insert([roadmap])
        .select()
        .single();

      if (error) throw error;
      return data as Roadmap;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap'] });
    },
  });
};

/**
 * Hook to update a roadmap item (Admin only)
 */
export const useUpdateRoadmap = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Roadmap> }) => {
      const { data, error } = await supabase
        .from('roadmap')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Roadmap;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['roadmap'] });
      queryClient.invalidateQueries({ queryKey: ['roadmap', data.quarter] });
    },
  });
};

/**
 * Hook to delete a roadmap item (Admin only)
 */
export const useDeleteRoadmap = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('roadmap')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap'] });
    },
  });
};
