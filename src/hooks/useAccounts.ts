import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '@/services/account.service';
import { organizationService } from '@/services/organization.service';
import type { CreateAccountDto, UpdateAccountDto } from '@/types/api';

export function useAccounts() {
  const queryClient = useQueryClient();
  const currentOrgId = organizationService.getCurrentOrgId();

  const { data: accounts = [], isLoading, error } = useQuery({
    queryKey: ['accounts', currentOrgId],
    queryFn: () => accountService.getAll(),
    enabled: !!currentOrgId, // Only run if we have an org selected
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateAccountDto) => accountService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAccountDto }) =>
      accountService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => accountService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  return {
    accounts,
    isLoading,
    error,
    createAccount: createMutation.mutateAsync,
    updateAccount: updateMutation.mutateAsync,
    deleteAccount: deleteMutation.mutateAsync,
  };
}

export function useAccount(id: string) {
  return useQuery({
    queryKey: ['account', id],
    queryFn: () => accountService.getById(id),
    enabled: !!id,
  });
}
