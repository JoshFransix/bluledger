import { apiClient } from '@/lib/api-client';
import type { Account, CreateAccountDto, UpdateAccountDto } from '@/types/api';

interface AccountFilters {
  type?: string;
  isActive?: boolean;
  currency?: string;
}

class AccountService {
  async create(data: CreateAccountDto): Promise<Account> {
    const response = await apiClient.post<Account>('/accounts', data);
    return response.data;
  }

  async getAll(filters?: AccountFilters): Promise<Account[]> {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
    if (filters?.currency) params.append('currency', filters.currency);
    
    const queryString = params.toString();
    const url = queryString ? `/accounts?${queryString}` : '/accounts';
    const response = await apiClient.get<Account[]>(url);
    return response.data;
  }

  async getById(id: string): Promise<Account> {
    const response = await apiClient.get<Account>(`/accounts/${id}`);
    return response.data;
  }

  async update(id: string, data: UpdateAccountDto): Promise<Account> {
    const response = await apiClient.patch<Account>(`/accounts/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/accounts/${id}`);
  }
}

export const accountService = new AccountService();
