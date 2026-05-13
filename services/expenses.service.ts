import { supabase } from '@/lib/supabase';
import type { Expense } from '@/types';

export const expensesService = {
  async list(ownerId: string, filters?: { category?: string; dateFrom?: string; dateTo?: string }) {
    let query = supabase
      .from('expenses')
      .select('*, animal:animals(id, animal_code, name), crop:crops(id, name)')
      .eq('owner_id', ownerId)
      .order('expense_date', { ascending: false })
      .order('created_at', { ascending: false });

    if (filters?.category) query = query.eq('category', filters.category);
    if (filters?.dateFrom) query = query.gte('expense_date', filters.dateFrom);
    if (filters?.dateTo) query = query.lte('expense_date', filters.dateTo);

    const { data, error } = await query;
    if (error) throw error;
    return data as Expense[];
  },

  async create(expense: Omit<Expense, 'id' | 'created_at' | 'animal' | 'crop'>) {
    const { data, error } = await supabase
      .from('expenses')
      .insert(expense)
      .select()
      .single();
    if (error) throw error;
    return data as Expense;
  },

  async delete(id: string) {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) throw error;
  },

  async getMonthlyTotals(ownerId: string) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const { data, error } = await supabase
      .from('expenses')
      .select('category, amount')
      .eq('owner_id', ownerId)
      .gte('expense_date', startOfMonth.toISOString().split('T')[0]);
    if (error) throw error;
    return data as Array<{ category: string; amount: number }>;
  },
};
