import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Proposal, ProposalFormValues } from '@/types/v2';

/**
 * Hook to fetch all proposals (Admin only)
 */
export const useProposals = () => {
  return useQuery({
    queryKey: ['proposals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Proposal[];
    },
  });
};

/**
 * Hook to fetch user's own proposals
 */
export const useMyProposals = () => {
  return useQuery({
    queryKey: ['proposals', 'me'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Proposal[];
    },
  });
};

/**
 * Hook to fetch proposals by status (Admin only)
 */
export const useProposalsByStatus = (status?: Proposal['status']) => {
  return useQuery({
    queryKey: ['proposals', 'status', status],
    queryFn: async () => {
      let query = supabase
        .from('proposals')
        .select('*')
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Proposal[];
    },
  });
};

/**
 * Hook to submit a new proposal
 */
export const useSubmitProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (proposal: ProposalFormValues) => {
      const { data, error } = await supabase
        .from('proposals')
        .insert([{ ...proposal, status: 'pending' }])
        .select()
        .single();

      if (error) throw error;
      return data as Proposal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
    },
  });
};

/**
 * Hook to update proposal status (Admin only)
 */
export const useUpdateProposalStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      admin_notes
    }: {
      id: number;
      status: Proposal['status'];
      admin_notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('proposals')
        .update({ status, admin_notes })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Proposal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
    },
  });
};

/**
 * Hook to delete a proposal (Admin only)
 */
export const useDeleteProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('proposals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
    },
  });
};
