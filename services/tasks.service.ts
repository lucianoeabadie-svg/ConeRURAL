import { supabase } from '@/lib/supabase';
import type { Task, TaskCompletion } from '@/types';

export const tasksService = {
  async list(ownerId: string) {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        sector:sectors(id, name),
        completion:task_completions!left(
          id, completed_date, completed_at, skipped, skip_reason, notes
        )
      `)
      .eq('owner_id', ownerId)
      .eq('is_active', true)
      .eq('task_completions.completed_date', today)
      .order('sort_order')
      .order('created_at');

    if (error) throw error;

    return (data as Task[]).map((t) => ({
      ...t,
      completion: Array.isArray(t.completion) ? t.completion[0] ?? null : t.completion,
    }));
  },

  async create(task: Omit<Task, 'id' | 'created_at' | 'sector' | 'completion'>) {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single();
    if (error) throw error;
    return data as Task;
  },

  async update(id: string, updates: Partial<Task>) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Task;
  },

  async delete(id: string) {
    const { error } = await supabase.from('tasks').update({ is_active: false }).eq('id', id);
    if (error) throw error;
  },

  async complete(taskId: string, ownerId: string, notes?: string) {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('task_completions')
      .upsert(
        {
          task_id: taskId,
          owner_id: ownerId,
          completed_date: today,
          completed_at: new Date().toISOString(),
          skipped: false,
          notes: notes ?? null,
        },
        { onConflict: 'task_id,completed_date' }
      )
      .select()
      .single();
    if (error) throw error;
    return data as TaskCompletion;
  },

  async uncomplete(taskId: string) {
    const today = new Date().toISOString().split('T')[0];
    const { error } = await supabase
      .from('task_completions')
      .delete()
      .eq('task_id', taskId)
      .eq('completed_date', today);
    if (error) throw error;
  },

  async skip(taskId: string, ownerId: string, reason?: string) {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('task_completions')
      .upsert(
        {
          task_id: taskId,
          owner_id: ownerId,
          completed_date: today,
          skipped: true,
          skip_reason: reason ?? null,
        },
        { onConflict: 'task_id,completed_date' }
      )
      .select()
      .single();
    if (error) throw error;
    return data as TaskCompletion;
  },
};
