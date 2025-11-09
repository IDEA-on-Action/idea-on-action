import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Bounty } from '@/types/v2';

/**
 * Hook to fetch all bounties
 */
export const useBounties = () => {
  return useQuery({
    queryKey: ['bounties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bounties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Bounty[];
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

/**
 * Hook to fetch bounties by status
 */
export const useBountiesByStatus = (status?: Bounty['status']) => {
  return useQuery({
    queryKey: ['bounties', 'status', status],
    queryFn: async () => {
      let query = supabase
        .from('bounties')
        .select('*')
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Bounty[];
    },
    staleTime: 1 * 60 * 1000,
  });
};

/**
 * Hook to fetch a single bounty by ID
 */
export const useBounty = (id: number) => {
  return useQuery({
    queryKey: ['bounties', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bounties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Bounty;
    },
    enabled: !!id,
  });
};

/**
 * Hook to apply to a bounty
 */
export const useApplyToBounty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bountyId: number) => {
      const { data, error } = await supabase.rpc('apply_to_bounty', {
        bounty_id: bountyId,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bounties'] });
    },
  });
};

/**
 * Hook to create a new bounty (Admin only)
 */
export const useCreateBounty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bounty: Omit<Bounty, 'id' | 'created_at' | 'updated_at' | 'applicants'>) => {
      const { data, error } = await supabase
        .from('bounties')
        .insert([{ ...bounty, applicants: [] }])
        .select()
        .single();

      if (error) throw error;
      return data as Bounty;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bounties'] });
    },
  });
};

/**
 * Hook to update a bounty (Admin only)
 */
export const useUpdateBounty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Bounty> }) => {
      const { data, error } = await supabase
        .from('bounties')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Bounty;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bounties'] });
    },
  });
};

/**
 * Hook to delete a bounty (Admin only)
 */
export const useDeleteBounty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('bounties')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bounties'] });
    },
  });
};

/**
 * Hook to assign a bounty (Admin only)
 */
export const useAssignBounty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bountyId, userId }: { bountyId: number; userId: string }) => {
      const { data, error } = await supabase
        .from('bounties')
        .update({
          assignee_id: userId,
          status: 'assigned',
        })
        .eq('id', bountyId)
        .select()
        .single();

      if (error) throw error;
      return data as Bounty;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bounties'] });
    },
  });
};
