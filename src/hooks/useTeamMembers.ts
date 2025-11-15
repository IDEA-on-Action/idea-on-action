import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseQuery, useSupabaseMutation, supabaseQuery } from '@/lib/react-query';
import type { TeamMember, TeamMemberInsert, TeamMemberUpdate } from '@/types/cms.types';

/**
 * Hook to fetch all team members (ordered by priority DESC, then created_at DESC)
 */
export const useTeamMembers = () => {
  return useSupabaseQuery<TeamMember[]>({
    queryKey: ['team-members'],
    queryFn: async () => {
      return await supabaseQuery(
        async () => {
          const result = await supabase
            .from('team_members')
            .select('*')
            .order('priority', { ascending: false })
            .order('created_at', { ascending: false });
          return { data: result.data, error: result.error };
        },
        {
          table: 'team_members',
          operation: '팀원 목록 조회',
          fallbackValue: [],
        }
      );
    },
    table: 'team_members',
    operation: '팀원 목록 조회',
    fallbackValue: [],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a single team member by ID
 */
export const useTeamMember = (id: string) => {
  return useSupabaseQuery<TeamMember>({
    queryKey: ['team-members', id],
    queryFn: async () => {
      return await supabaseQuery(
        async () => {
          const result = await supabase
            .from('team_members')
            .select('*')
            .eq('id', id)
            .single();
          return { data: result.data, error: result.error };
        },
        {
          table: 'team_members',
          operation: '팀원 상세 조회',
          fallbackValue: null,
        }
      );
    },
    table: 'team_members',
    operation: '팀원 상세 조회',
    fallbackValue: null,
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch only active team members (public-facing)
 */
export const useActiveTeamMembers = () => {
  return useSupabaseQuery<TeamMember[]>({
    queryKey: ['team-members', 'active'],
    queryFn: async () => {
      return await supabaseQuery(
        async () => {
          const result = await supabase
            .from('team_members')
            .select('*')
            .eq('active', true)
            .order('priority', { ascending: false })
            .order('created_at', { ascending: false });
          return { data: result.data, error: result.error };
        },
        {
          table: 'team_members',
          operation: '활성 팀원 조회',
          fallbackValue: [],
        }
      );
    },
    table: 'team_members',
    operation: '활성 팀원 조회',
    fallbackValue: [],
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to create a new team member (Admin only)
 */
export const useCreateTeamMember = () => {
  const queryClient = useQueryClient();

  return useSupabaseMutation<TeamMember, TeamMemberInsert>({
    mutationFn: async (member: TeamMemberInsert) => {
      const { data, error } = await supabase
        .from('team_members')
        .insert([member])
        .select()
        .single();

      if (error) throw error;
      return data as TeamMember;
    },
    table: 'team_members',
    operation: '팀원 생성',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
    },
  });
};

/**
 * Hook to update a team member (Admin only)
 */
export const useUpdateTeamMember = () => {
  const queryClient = useQueryClient();

  return useSupabaseMutation<TeamMember, { id: string; updates: TeamMemberUpdate }>({
    mutationFn: async ({ id, updates }: { id: string; updates: TeamMemberUpdate }) => {
      const { data, error } = await supabase
        .from('team_members')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as TeamMember;
    },
    table: 'team_members',
    operation: '팀원 수정',
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      queryClient.invalidateQueries({ queryKey: ['team-members', data.id] });
    },
  });
};

/**
 * Hook to delete a team member (Admin only)
 */
export const useDeleteTeamMember = () => {
  const queryClient = useQueryClient();

  return useSupabaseMutation<string, string>({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    table: 'team_members',
    operation: '팀원 삭제',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
    },
  });
};

/**
 * Hook to toggle team member active status (Admin only)
 */
export const useToggleTeamMemberActive = () => {
  const queryClient = useQueryClient();

  return useSupabaseMutation<TeamMember, { id: string; active: boolean }>({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { data, error } = await supabase
        .from('team_members')
        .update({ active })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as TeamMember;
    },
    table: 'team_members',
    operation: '팀원 활성 상태 토글',
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      queryClient.invalidateQueries({ queryKey: ['team-members', data.id] });
      queryClient.invalidateQueries({ queryKey: ['team-members', 'active'] });
    },
  });
};
