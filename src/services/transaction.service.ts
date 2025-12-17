import { apiClient } from '@/lib/api-client';
import type { Transaction, CreateTransactionDto, UpdateTransactionDto } from '@/types/api';

class TransactionService {
  async create(data: CreateTransactionDto): Promise<Transaction> {
    const response = await apiClient.post<Transaction>('/transactions', data);
    return response.data;
  }

  async getAll(): Promise<Transaction[]> {
    const response = await apiClient.get<Transaction[]>('/transactions');
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
