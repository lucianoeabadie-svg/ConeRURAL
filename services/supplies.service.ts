import { supabase } from '@/lib/supabase';
import type { Supply, SupplyMovement } from '@/types';

export const suppliesService = {
  async list(ownerId: string) {
    const { data, error } = await supabase
      .from('supplies')
      .select('*')
      .eq('owner_id', ownerId)
      .eq('is_active', true)
      .order('name');
    if (error) throw error;
    return data as Supply[];
  },

  async get(id: string) {
    const { data, error } = await supabase
      .from('supplies')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Supply;
  },

  async create(supply: Omit<Supply, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('supplies')
      .insert(supply)
      .select()
      .single();
    if (error) throw error;
    return data as Supply;
  },

  async update(id: string, updates: Partial<Supply>) {
    const { data, error } = await supabase
      .from('supplies')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Supply;
  },

  async getLowStock(ownerId: string) {
    const { data, error } = await supabase
      .from('supplies')
      .select('*')
      .eq('owner_id', ownerId)
      .eq('is_active', true)
      .not('min_stock_alert', 'is', null);
    if (error) throw error;
    return (data as Supply[]).filter((s) => s.current_stock <= (s.min_stock_alert ?? 0));
  },

  async getMovements(supplyId: string) {
    const { data, error } = await supabase
      .from('supply_movements')
      .select('*')
      .eq('supply_id', supplyId)
      .order('movement_date', { ascending: false });
    if (error) throw error;
    return data as SupplyMovement[];
  },

  async addMovement(movement: Omit<SupplyMovement, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('supply_movements')
      .insert(movement)
      .select()
      .single();
    if (error) throw error;
    return data as SupplyMovement;
  },
};
