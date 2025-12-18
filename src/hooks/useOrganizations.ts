import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { organizationService } from '@/services/organization.service';
import type { CreateOrganizationDto } from '@/types/api';
import { useEffect } from 'react';

export function useOrganizations() {
  const queryClient = useQueryClient();

  const { data: organizations = [], isLoading, error } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => organizationService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateOrganizationDto) => organizationService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string } }) =>
      organizationService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });

  const currentOrgId = organizationService.getCurrentOrgId();
  const currentOrg = organizations.find((org) => org.id === currentOrgId);

  // Auto-select first organization if none is selected or if current org is no longer accessible
  useEffect(() => {
    if (!isLoading && organizations.length > 0) {
      if (!currentOrgId) {
        // No org selected, select first one
        organizationService.setCurrentOrg(organizations[0].id);
      } else if (!currentOrg) {
        // Current org not found in the list (user lost access), switch to first available
        organizationService.setCurrentOrg(organizations[0].id);
        // Invalidate all queries to refresh with new org
        queryClient.invalidateQueries();
      }
    }
  }, [organizations, currentOrgId, currentOrg, isLoading, queryClient]);

  // Listen for organization access loss events
  useEffect(() => {
    const handleAccessLoss = () => {
      // Re-fetch organizations to get the current list
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('orgAccessLost', handleAccessLoss);
      return () => window.removeEventListener('orgAccessLost', handleAccessLoss);
    }
  }, [queryClient]);

  const setCurrentOrg = (orgId: string) => {
    organizationService.setCurrentOrg(orgId);
    queryClient.invalidateQueries(); // Invalidate all queries when org changes
  };

  return {
    organizations,
    currentOrg,
    currentOrgId,
    isLoading,
    error,
    createOrganization: createMutation.mutateAsync,
    updateOrganization: updateMutation.mutateAsync,
    setCurrentOrg,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
}

export function useOrganization(id: string) {
  return useQuery({
    queryKey: ['organization', id],
    queryFn: () => organizationService.getById(id),
    enabled: !!id,
  });
}

export function useOrganizationSummary(id: string | null) {
  return useQuery({
    queryKey: ['organization', id, 'summary'],
    queryFn: () => organizationService.getSummary(id!),
    enabled: !!id,
  });
}
