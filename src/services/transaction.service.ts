import { apiClient } from '@/lib/api-client';
import type { Transaction, CreateTransactionDto, UpdateTransactionDto } from '@/types/api';

interface TransactionFilters {
  accountId?: string;
  type?: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  startDate?: string;
  endDate?: string;
  category?: string;
  search?: string;
}

class TransactionService {
  async create(data: CreateTransactionDto): Promise<Transaction> {
    const response = await apiClient.post<Transaction>('/transactions', data);
    return response.data;
  }

  async getAll(filters?: TransactionFilters): Promise<Transaction[]> {
    const params = new URLSearchParams();
    if (filters?.accountId) params.append('accountId', filters.accountId);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.category) params.append('category', filters.category);
    
    const queryString = params.toString();
    const url = queryString ? `/transactions?${queryString}` : '/transactions';
    const response = await apiClient.get<Transaction[]>(url);
    return response.data;
  }

  async getById(id: string): Promise<Transaction> {
    const response = await apiClient.get<Transaction>(`/transactions/${id}`);
    return response.data;
  }

  async update(id: string, data: UpdateTransactionDto): Promise<Transaction> {
    const response = await apiClient.patch<Transaction>(`/transactions/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/transactions/${id}`);
  }
}

export const transactionService = new TransactionService();
