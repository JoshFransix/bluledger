import { apiClient } from '@/lib/api-client';
import type { Organization, CreateOrganizationDto } from '@/types/api';

class OrganizationService {
  async create(data: CreateOrganizationDto): Promise<Organization> {
    const response = await apiClient.post<Organization>('/organizations', data);
    return response.data;
  }

  async getAll(): Promise<Organization[]> {
    const response = await apiClient.get<Organization[]>('/organizations');
    return response.data;
  }

  async getById(id: string): Promise<Organization> {
    const response = await apiClient.get<Organization>(`/organizations/${id}`);
    return response.data;
  }

  async update(id: string, data: { name: string }): Promise<Organization> {
    const response = await apiClient.patch<Organization>(`/organizations/${id}`, data);
    return response.data;
  }

  async getSummary(id: string): Promise<{
    id: string;
    name: string;
    accountsCount: number;
    transactionsCount: number;
    membersCount: number;
    totalAssets: number;
    totalLiabilities: number;
    netWorth: number;
  }> {
    const response = await apiClient.get(`/organizations/${id}/summary`);
    return response.data;
  }

  setCurrentOrg(orgId: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentOrgId', orgId);
    }
  }

  getCurrentOrgId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('currentOrgId');
  }

  clearCurrentOrg(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentOrgId');
    }
  }
}

export const organizationService = new OrganizationService();
