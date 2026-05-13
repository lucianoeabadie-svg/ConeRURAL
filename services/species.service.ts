import { supabase } from '@/lib/supabase';
import type { Species } from '@/types';

export const speciesService = {
  async list(ownerId: string) {
    const { data, error } = await supabase
      .from('species')
      .select('*')
      .eq('owner_id', ownerId)
      .eq('is_active', true)
      .order('name');
    if (error) throw error;
    return data as Species[];
  },

  async create(species: Omit<Species, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('species')
      .insert(species)
      .select()
      .single();
    if (error) throw error;
    return data as Species;
  },

  async seedDefaults(ownerId: string) {
    const { error } = await supabase.rpc('seed_default_species', {
      p_owner_id: ownerId,
    });
    if (error) throw error;
  },
};
