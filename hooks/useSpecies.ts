import { useQuery } from '@tanstack/react-query';
import { speciesService } from '@/services/species.service';
import { useAuthStore } from '@/store/useAuthStore';

export function useSpecies() {
  const ownerId = useAuthStore((s) => s.user?.id ?? '');
  return useQuery({
    queryKey: ['species', ownerId],
    queryFn: () => speciesService.list(ownerId),
    enabled: !!ownerId,
    staleTime: 1000 * 60 * 10,
  });
}
