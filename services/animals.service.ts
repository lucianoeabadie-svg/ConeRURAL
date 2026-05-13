import { supabase } from '@/lib/supabase';
import type { Animal, AnimalEvent } from '@/types';

export const animalsService = {
  async list(ownerId: string, filters?: { speciesId?: string; sectorId?: string; status?: string }) {
    let query = supabase
      .from('animals')
      .select('*, species(*), sector:sectors(*)')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });

    if (filters?.speciesId) query = query.eq('species_id', filters.speciesId);
    if (filters?.sectorId) query = query.eq('sector_id', filters.sectorId);
    if (filters?.status) query = query.eq('status', filters.status);

    const { data, error } = await query;
    if (error) throw error;
    return data as Animal[];
  },

  async get(id: string) {
    const { data, error } = await supabase
      .from('animals')
      .select('*, species(*), sector:sectors(*)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Animal;
  },

  async create(animal: Omit<Animal, 'id' | 'animal_code' | 'created_at' | 'updated_at' | 'species' | 'sector'>) {
    const { data, error } = await supabase
      .from('animals')
      .insert({ ...animal, animal_code: '' })
      .select('*, species(*), sector:sectors(*)')
      .single();
    if (error) throw error;
    return data as Animal;
  },

  async update(id: string, updates: Partial<Animal>) {
    const { data, error } = await supabase
      .from('animals')
      .update(updates)
      .eq('id', id)
      .select('*, species(*), sector:sectors(*)')
      .single();
    if (error) throw error;
    return data as Animal;
  },

  async delete(id: string) {
    const { error } = await supabase.from('animals').delete().eq('id', id);
    if (error) throw error;
  },

  async getEvents(animalId: string) {
    const { data, error } = await supabase
      .from('animal_events')
      .select('*')
      .eq('animal_id', animalId)
      .order('event_date', { ascending: false })
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as AnimalEvent[];
  },

  async addEvent(event: Omit<AnimalEvent, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('animal_events')
      .insert(event)
      .select()
      .single();
    if (error) throw error;
    return data as AnimalEvent;
  },

  async getWeightHistory(animalId: string) {
    const { data, error } = await supabase
      .from('animal_events')
      .select('event_date, weight_kg')
      .eq('animal_id', animalId)
      .eq('event_type', 'weight')
      .not('weight_kg', 'is', null)
      .order('event_date', { ascending: true });
    if (error) throw error;
    return data as Array<{ event_date: string; weight_kg: number }>;
  },
};
