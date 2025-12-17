import { apiClient } from '@/lib/api-client';
import type { LoginDto, RegisterDto, AuthResponse, User } from '@/types/api';

class AuthService {
  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    return response.data;
  }

  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    return response.data;
  }

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('currentOrgId');
    }
  }

  async refresh(): Promise<{ accessToken: string }> {
    const response = await apiClient.post('/auth/refresh');
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    return response.data;
  }

  async getMe(): Promise<User> {
    const response = await apiClient.get<User>('/users/me');
    return response.data;
  }

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('accessToken');
  }

  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }
}

export const authService = new AuthService();
