import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expensesService } from '@/services/expenses.service';
import { useAuthStore } from '@/store/useAuthStore';
import type { Expense } from '@/types';

export function useExpenses(filters?: { category?: string; dateFrom?: string; dateTo?: string }) {
  const ownerId = useAuthStore((s) => s.user?.id ?? '');
  return useQuery({
    queryKey: ['expenses', ownerId, filters],
    queryFn: () => expensesService.list(ownerId, filters),
    enabled: !!ownerId,
  });
}

export function useMonthlyExpenses() {
  const ownerId = useAuthStore((s) => s.user?.id ?? '');
  return useQuery({
    queryKey: ['expenses-monthly', ownerId],
    queryFn: () => expensesService.getMonthlyTotals(ownerId),
    enabled: !!ownerId,
  });
}

export function useCreateExpense() {
  const qc = useQueryClient();
  const ownerId = useAuthStore((s) => s.user?.id ?? '');
  return useMutation({
    mutationFn: (expense: Omit<Expense, 'id' | 'created_at' | 'animal' | 'crop'>) =>
      expensesService.create(expense),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['expenses', ownerId] });
      qc.invalidateQueries({ queryKey: ['expenses-monthly', ownerId] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useDeleteExpense() {
  const qc = useQueryClient();
  const ownerId = useAuthStore((s) => s.user?.id ?? '');
  return useMutation({
    mutationFn: expensesService.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['expenses', ownerId] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
