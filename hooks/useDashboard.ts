import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';
import { useAuthStore } from '@/store/useAuthStore';

export function useDashboard() {
  const ownerId = useAuthStore((s) => s.user?.id ?? '');
  return useQuery({
    queryKey: ['dashboard', ownerId],
    queryFn: () => dashboardService.getMetrics(ownerId),
    enabled: !!ownerId,
    staleTime: 30000,
  });
}
