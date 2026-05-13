import { supabase } from '@/lib/supabase';
import type { DashboardMetrics } from '@/types';

export const dashboardService = {
  async getMetrics(ownerId: string): Promise<DashboardMetrics> {
    const { data, error } = await supabase.rpc('get_dashboard_metrics', {
      p_owner_id: ownerId,
    });
    if (error) throw error;
    return data as DashboardMetrics;
  },
};
