import { supabase } from '@/lib/supabase';
import type { Sector } from '@/types';

export const sectorsService = {
  async list(ownerId: string) {
    const { data, error } = await supabase
      .from('sectors')
      .select('*')
      .eq('owner_id', ownerId)
      .eq('is_active', true)
      .order('name');
    if (error) throw error;
    return data as Sector[];
  },

  async get(id: string) {
    const { data, error } = await supabase
      .from('sectors')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Sector;
  },

  async create(sector: Omit<Sector, 'id' | 'created_at' | 'updated_at' | 'animal_count'>) {
    const { data, error } = await supabase
      .from('sectors')
      .insert(sector)
      .select()
      .single();
    if (error) throw error;
    return data as Sector;
  },

  async update(id: string, updates: Partial<Sector>) {
    const { data, error } = await supabase
      .from('sectors')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Sector;
  },

  async delete(id: string) {
    const { error } = await supabase.from('sectors').update({ is_active: false }).eq('id', id);
    if (error) throw error;
  },

  async getAnimalsCount(sectorId: string): Promise<number> {
    const { count, error } = await supabase
      .from('animals')
      .select('*', { count: 'exact', head: true })
      .eq('sector_id', sectorId)
      .eq('status', 'active');
    if (error) throw error;
    return count ?? 0;
  },
};
