import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { suppliesService } from '@/services/supplies.service';
import { useAuthStore } from '@/store/useAuthStore';
import type { Supply, SupplyMovement } from '@/types';

export function useSupplies() {
  const ownerId = useAuthStore((s) => s.user?.id ?? '');
  return useQuery({
    queryKey: ['supplies', ownerId],
    queryFn: () => suppliesService.list(ownerId),
    enabled: !!ownerId,
  });
}

export function useSupply(id: string) {
  return useQuery({
    queryKey: ['supply', id],
    queryFn: () => suppliesService.get(id),
    enabled: !!id,
  });
}

export function useSupplyMovements(supplyId: string) {
  return useQuery({
    queryKey: ['supply-movements', supplyId],
    queryFn: () => suppliesService.getMovements(supplyId),
    enabled: !!supplyId,
  });
}

export function useLowStock() {
  const ownerId = useAuthStore((s) => s.user?.id ?? '');
  return useQuery({
    queryKey: ['low-stock', ownerId],
    queryFn: () => suppliesService.getLowStock(ownerId),
    enabled: !!ownerId,
  });
}

export function useCreateSupply() {
  const qc = useQueryClient();
  const ownerId = useAuthStore((s) => s.user?.id ?? '');
  return useMutation({
    mutationFn: (supply: Omit<Supply, 'id' | 'created_at' | 'updated_at'>) =>
      suppliesService.create(supply),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['supplies', ownerId] }),
  });
}

export function useAddSupplyMovement() {
  const qc = useQueryClient();
  const ownerId = useAuthStore((s) => s.user?.id ?? '');
  return useMutation({
    mutationFn: (movement: Omit<SupplyMovement, 'id' | 'created_at'>) =>
      suppliesService.addMovement(movement),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['supply-movements', data.supply_id] });
      qc.invalidateQueries({ queryKey: ['supplies', ownerId] });
    },
  });
}
