import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import type { LoginDto, RegisterDto } from '@/types/api';

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => authService.getMe(),
    enabled: authService.isAuthenticated(),
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginDto) => authService.login(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterDto) => authService.register(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
  };
}
