import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '@/services/transaction.service';
import { organizationService } from '@/services/organization.service';
import type { CreateTransactionDto, UpdateTransactionDto } from '@/types/api';

export function useTransactions() {
  const queryClient = useQueryClient();
  const currentOrgId = organizationService.getCurrentOrgId();

  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ['transactions', currentOrgId],
    queryFn: () => transactionService.getAll(),
    enabled: !!currentOrgId, // Only run if we have an org selected
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateTransactionDto) => transactionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] }); // Refresh accounts due to balance changes
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTransactionDto }) =>
      transactionService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => transactionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  const refetch = async () => {
    await queryClient.refetchQueries({ queryKey: ['transactions'] });
  };

  return {
    transactions,
    isLoading,
    error,
    refetch,
    createTransaction: createMutation.mutateAsync,
    updateTransaction: updateMutation.mutateAsync,
    deleteTransaction: deleteMutation.mutateAsync,
  };
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: ['transaction', id],
    queryFn: () => transactionService.getById(id),
    enabled: !!id,
  });
}
