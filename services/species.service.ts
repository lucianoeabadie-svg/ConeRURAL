import { supabase } from '@/lib/supabase';
import { DEFAULT_SPECIES } from '@/constants/species';
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
    return (data ?? []) as Species[];
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
    const rows = DEFAULT_SPECIES.map((s) => ({
      owner_id: ownerId,
      name: s.name,
      code: s.code,
      icon: s.icon,
      is_active: true,
    }));
    const { error } = await supabase.from('species').upsert(rows, {
      onConflict: 'owner_id,code',
      ignoreDuplicates: true,
    });
    if (error) throw error;
  },
};
