import { useQuery } from '@tanstack/react-query';
import { speciesService } from '@/services/species.service';
import { useAuthStore } from '@/store/useAuthStore';

export function useSpecies() {
  const ownerId = useAuthStore((s) => s.user?.id ?? '');
  return useQuery({
    queryKey: ['species', ownerId],
    queryFn: async () => {
      const data = await speciesService.list(ownerId);
      if (data.length === 0 && ownerId) {
        await speciesService.seedDefaults(ownerId);
        return speciesService.list(ownerId);
      }
      return data;
    },
    enabled: !!ownerId,
    staleTime: 1000 * 60 * 10,
  });
}
