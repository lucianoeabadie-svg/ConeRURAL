import { supabase } from '@/lib/supabase';
import type { Crop, CropEvent } from '@/types';

export const cropsService = {
  async list(ownerId: string, status?: string) {
    let query = supabase
      .from('crops')
      .select('*, sector:sectors(*)')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) throw error;
    return data as Crop[];
  },

  async get(id: string) {
    const { data, error } = await supabase
      .from('crops')
      .select('*, sector:sectors(*)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Crop;
  },

  async create(crop: Omit<Crop, 'id' | 'created_at' | 'updated_at' | 'sector'>) {
    const { data, error } = await supabase
      .from('crops')
      .insert(crop)
      .select('*, sector:sectors(*)')
      .single();
    if (error) throw error;
    return data as Crop;
  },

  async update(id: string, updates: Partial<Crop>) {
    const { data, error } = await supabase
      .from('crops')
      .update(updates)
      .eq('id', id)
      .select('*, sector:sectors(*)')
      .single();
    if (error) throw error;
    return data as Crop;
  },

  async delete(id: string) {
    const { error } = await supabase.from('crops').delete().eq('id', id);
    if (error) throw error;
  },

  async getEvents(cropId: string) {
    const { data, error } = await supabase
      .from('crop_events')
      .select('*')
      .eq('crop_id', cropId)
      .order('event_date', { ascending: false });
    if (error) throw error;
    return data as CropEvent[];
  },

  async addEvent(event: Omit<CropEvent, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('crop_events')
      .insert(event)
      .select()
      .single();
    if (error) throw error;
    return data as CropEvent;
  },
};
