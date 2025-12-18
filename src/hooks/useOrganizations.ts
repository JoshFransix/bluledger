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

  // Auto-select first organization if none is selected
  useEffect(() => {
    if (!isLoading && organizations.length > 0 && !currentOrgId) {
      organizationService.setCurrentOrg(organizations[0].id);
    }
  }, [organizations, currentOrgId, isLoading]);

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
