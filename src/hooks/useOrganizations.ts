import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { organizationService } from '@/services/organization.service';
import type { CreateOrganizationDto } from '@/types/api';

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

  const currentOrgId = organizationService.getCurrentOrgId();
  const currentOrg = organizations.find((org) => org.id === currentOrgId);

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
    setCurrentOrg,
    isCreating: createMutation.isPending,
  };
}

export function useOrganization(id: string) {
  return useQuery({
    queryKey: ['organization', id],
    queryFn: () => organizationService.getById(id),
    enabled: !!id,
  });
}
