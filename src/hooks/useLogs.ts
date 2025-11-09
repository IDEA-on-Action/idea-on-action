import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Log } from '@/types/v2';

/**
 * Hook to fetch all logs
 */
export const useLogs = (limit?: number) => {
  return useQuery({
    queryKey: ['logs', limit],
    queryFn: async () => {
      let query = supabase
        .from('logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Log[];
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

/**
 * Hook to fetch logs by type
 */
export const useLogsByType = (type?: Log['type'], limit?: number) => {
  return useQuery({
    queryKey: ['logs', 'type', type, limit],
    queryFn: async () => {
      let query = supabase
        .from('logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (type) {
        query = query.eq('type', type);
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Log[];
    },
    staleTime: 1 * 60 * 1000,
  });
};

/**
 * Hook to fetch logs by project
 */
export const useLogsByProject = (projectId: string, limit?: number) => {
  return useQuery({
    queryKey: ['logs', 'project', projectId, limit],
    queryFn: async () => {
      let query = supabase
        .from('logs')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Log[];
    },
    enabled: !!projectId,
    staleTime: 1 * 60 * 1000,
  });
};

/**
 * Hook to create a new log (Admin only)
 */
export const useCreateLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (log: Omit<Log, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('logs')
        .insert([log])
        .select()
        .single();

      if (error) throw error;
      return data as Log;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
  });
};

/**
 * Hook to update a log (Admin only)
 */
export const useUpdateLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Log> }) => {
      const { data, error } = await supabase
        .from('logs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Log;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
  });
};

/**
 * Hook to delete a log (Admin only)
 */
export const useDeleteLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('logs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
  });
};
