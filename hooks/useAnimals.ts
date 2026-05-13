import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { animalsService } from '@/services/animals.service';
import { useAuthStore } from '@/store/useAuthStore';
import type { Animal } from '@/types';

export function useAnimals(filters?: { speciesId?: string; sectorId?: string; status?: string }) {
  const ownerId = useAuthStore((s) => s.user?.id ?? '');
  return useQuery({
    queryKey: ['animals', ownerId, filters],
    queryFn: () => animalsService.list(ownerId, filters),
    enabled: !!ownerId,
  });
}

export function useAnimal(id: string) {
  return useQuery({
    queryKey: ['animal', id],
    queryFn: () => animalsService.get(id),
    enabled: !!id,
  });
}

export function useAnimalEvents(animalId: string) {
  return useQuery({
    queryKey: ['animal-events', animalId],
    queryFn: () => animalsService.getEvents(animalId),
    enabled: !!animalId,
  });
}

export function useAnimalWeightHistory(animalId: string) {
  return useQuery({
    queryKey: ['animal-weights', animalId],
    queryFn: () => animalsService.getWeightHistory(animalId),
    enabled: !!animalId,
  });
}

export function useCreateAnimal() {
  const qc = useQueryClient();
  const ownerId = useAuthStore((s) => s.user?.id ?? '');
  return useMutation({
    mutationFn: (animal: Omit<Animal, 'id' | 'animal_code' | 'created_at' | 'updated_at' | 'species' | 'sector'>) =>
      animalsService.create(animal),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['animals', ownerId] }),
  });
}

export function useUpdateAnimal() {
  const qc = useQueryClient();
  const ownerId = useAuthStore((s) => s.user?.id ?? '');
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Animal> }) =>
      animalsService.update(id, updates),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['animals', ownerId] });
      qc.invalidateQueries({ queryKey: ['animal', data.id] });
    },
  });
}

export function useAddAnimalEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: animalsService.addEvent,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['animal-events', data.animal_id] });
      qc.invalidateQueries({ queryKey: ['animal', data.animal_id] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
