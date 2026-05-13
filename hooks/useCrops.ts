import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cropsService } from '@/services/crops.service';
import { useAuthStore } from '@/store/useAuthStore';
import type { Crop } from '@/types';

export function useCrops(status?: string) {
  const ownerId = useAuthStore((s) => s.user?.id ?? '');
  return useQuery({
    queryKey: ['crops', ownerId, status],
    queryFn: () => cropsService.list(ownerId, status),
    enabled: !!ownerId,
  });
}

export function useCrop(id: string) {
  return useQuery({
    queryKey: ['crop', id],
    queryFn: () => cropsService.get(id),
    enabled: !!id,
  });
}

export function useCropEvents(cropId: string) {
  return useQuery({
    queryKey: ['crop-events', cropId],
    queryFn: () => cropsService.getEvents(cropId),
    enabled: !!cropId,
  });
}

export function useCreateCrop() {
  const qc = useQueryClient();
  const ownerId = useAuthStore((s) => s.user?.id ?? '');
  return useMutation({
    mutationFn: (crop: Omit<Crop, 'id' | 'created_at' | 'updated_at' | 'sector'>) =>
      cropsService.create(crop),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['crops', ownerId] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useAddCropEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: cropsService.addEvent,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['crop-events', data.crop_id] });
      qc.invalidateQueries({ queryKey: ['crop', data.crop_id] });
    },
  });
}
