/**
 * useRBAC Hook - Phase 10 Week 3
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'
import type { Role, Permission, UserRoleWithDetails } from '@/types/rbac'

const QUERY_KEYS = {
  roles: ['roles'] as const,
  permissions: ['permissions'] as const,
  userRoles: (userId?: string) => ['user_roles', userId] as const,
  userPermissions: (userId?: string) => ['user_permissions', userId] as const,
}

export function useRoles() {
  return useQuery({
    queryKey: QUERY_KEYS.roles,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('name')

      if (error) throw error
      return data as Role[]
    },
  })
}

export function usePermissions() {
  return useQuery({
    queryKey: QUERY_KEYS.permissions,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('resource, action')

      if (error) throw error
      return data as Permission[]
    },
  })
}

export function useUserRoles(userId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.userRoles(userId),
    queryFn: async () => {
      let query = supabase
        .from('user_roles')
        .select(`
          *,
          role:role_id(*),
          user:user_id(id, email)
        `)

      if (userId) {
        query = query.eq('user_id', userId)
      }

      const { data, error } = await query

      if (error) throw error
      return data as UserRoleWithDetails[]
    },
    enabled: !!userId,
  })
}

export function useUserPermissions(userId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.userPermissions(userId),
    queryFn: async () => {
      if (!userId) return []

      const { data, error } = await supabase
        .rpc('get_user_permissions', { p_user_id: userId })

      if (error) throw error
      return data as Array<{ permission_name: string; resource: string; action: string }>
    },
    enabled: !!userId,
  })
}

export function useHasPermission(permissionName: string) {
  const { user } = useAuth()
  const { data: permissions = [] } = useUserPermissions(user?.id)

  return permissions.some(p => p.permission_name === permissionName)
}

export function useAssignRole() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async ({ userId, roleId }: { userId: string; roleId: string }) => {
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role_id: roleId,
          assigned_by: user?.id,
        })

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userRoles() })
    },
  })
}

export function useRevokeRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, roleId }: { userId: string; roleId: string }) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role_id', roleId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userRoles() })
    },
  })
}
