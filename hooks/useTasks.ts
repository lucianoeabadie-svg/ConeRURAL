import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksService } from '@/services/tasks.service';
import { useAuthStore } from '@/store/useAuthStore';
import type { Task } from '@/types';

export function useTasks() {
  const ownerId = useAuthStore((s) => s.user?.id ?? '');
  return useQuery({
    queryKey: ['tasks', ownerId],
    queryFn: () => tasksService.list(ownerId),
    enabled: !!ownerId,
    staleTime: 30000,
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  const ownerId = useAuthStore((s) => s.user?.id ?? '');
  return useMutation({
    mutationFn: (task: Omit<Task, 'id' | 'created_at' | 'sector' | 'completion'>) =>
      tasksService.create(task),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks', ownerId] }),
  });
}

export function useCompleteTask() {
  const qc = useQueryClient();
  const ownerId = useAuthStore((s) => s.user?.id ?? '');
  return useMutation({
    mutationFn: ({ taskId, notes }: { taskId: string; notes?: string }) =>
      tasksService.complete(taskId, ownerId, notes),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks', ownerId] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUncompleteTask() {
  const qc = useQueryClient();
  const ownerId = useAuthStore((s) => s.user?.id ?? '');
  return useMutation({
    mutationFn: (taskId: string) => tasksService.uncomplete(taskId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks', ownerId] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  const ownerId = useAuthStore((s) => s.user?.id ?? '');
  return useMutation({
    mutationFn: tasksService.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks', ownerId] }),
  });
}
