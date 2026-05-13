import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sectorsService } from '@/services/sectors.service';
import { useAuthStore } from '@/store/useAuthStore';
import type { Sector } from '@/types';

export function useSectors() {
  const ownerId = useAuthStore((s) => s.user?.id ?? '');
  return useQuery({
    queryKey: ['sectors', ownerId],
    queryFn: () => sectorsService.list(ownerId),
    enabled: !!ownerId,
  });
}

export function useSector(id: string) {
  return useQuery({
    queryKey: ['sector', id],
    queryFn: () => sectorsService.get(id),
    enabled: !!id,
  });
}

export function useCreateSector() {
  const qc = useQueryClient();
  const ownerId = useAuthStore((s) => s.user?.id ?? '');
  return useMutation({
    mutationFn: (sector: Omit<Sector, 'id' | 'created_at' | 'updated_at' | 'animal_count'>) =>
      sectorsService.create(sector),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sectors', ownerId] }),
  });
}
