// ============================================================
// Domain types for ConeRURAL
// ============================================================

export interface Profile {
  id: string;
  full_name: string | null;
  farm_name: string;
  avatar_url: string | null;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface Species {
  id: string;
  owner_id: string;
  name: string;
  code: string;
  icon: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Sector {
  id: string;
  owner_id: string;
  name: string;
  type: SectorType;
  description: string | null;
  capacity: number | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  animal_count?: number;
}

export type SectorType = 'corral' | 'galpon' | 'potrero' | 'huerta' | 'invernadero' | 'jaula' | 'otro';

export interface Animal {
  id: string;
  owner_id: string;
  species_id: string;
  sector_id: string | null;
  animal_code: string;
  name: string | null;
  sex: AnimalSex;
  birth_date: string | null;
  acquisition_date: string | null;
  acquisition_cost: number | null;
  acquisition_source: string | null;
  breed: string | null;
  color: string | null;
  tag_number: string | null;
  status: AnimalStatus;
  status_date: string | null;
  status_notes: string | null;
  weight_kg: number | null;
  notes: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
  species?: Species;
  sector?: Sector | null;
}

export type AnimalSex = 'M' | 'F' | 'unknown';
export type AnimalStatus = 'active' | 'sold' | 'deceased' | 'transferred';

export interface AnimalEvent {
  id: string;
  owner_id: string;
  animal_id: string;
  event_type: AnimalEventType;
  event_date: string;
  weight_kg: number | null;
  feed_type: string | null;
  feed_amount_kg: number | null;
  feed_cost: number | null;
  diagnosis: string | null;
  treatment: string | null;
  medication: string | null;
  dose: string | null;
  vet_name: string | null;
  next_due_date: string | null;
  value_numeric: number | null;
  value_text: string | null;
  notes: string | null;
  photo_url: string | null;
  created_at: string;
}

export type AnimalEventType =
  | 'weight'
  | 'feeding'
  | 'health_check'
  | 'vaccination'
  | 'medication'
  | 'deworming'
  | 'pregnancy'
  | 'birth'
  | 'sale'
  | 'death'
  | 'transfer'
  | 'sector_change'
  | 'note';

export interface Crop {
  id: string;
  owner_id: string;
  sector_id: string | null;
  name: string;
  plant_type: string;
  variety: string | null;
  seeding_date: string | null;
  expected_harvest_date: string | null;
  actual_harvest_date: string | null;
  area_m2: number | null;
  row_count: number | null;
  plant_count: number | null;
  status: CropStatus;
  notes: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
  sector?: Sector | null;
}

export type CropStatus = 'planned' | 'active' | 'harvested' | 'failed';

export interface CropEvent {
  id: string;
  owner_id: string;
  crop_id: string;
  event_type: CropEventType;
  event_date: string;
  water_liters: number | null;
  duration_min: number | null;
  product_name: string | null;
  amount_kg: number | null;
  amount_l: number | null;
  cost: number | null;
  yield_kg: number | null;
  yield_units: number | null;
  sale_price: number | null;
  notes: string | null;
  photo_url: string | null;
  created_at: string;
}

export type CropEventType =
  | 'irrigation'
  | 'fertilization'
  | 'pesticide'
  | 'pruning'
  | 'harvest'
  | 'observation'
  | 'note';

export interface Task {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  frequency: TaskFrequency;
  frequency_days: number[] | null;
  time_of_day: TaskTimeOfDay;
  category: string | null;
  linked_sector_id: string | null;
  linked_animal_id: string | null;
  linked_crop_id: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  sector?: Sector | null;
  completion?: TaskCompletion | null;
}

export type TaskFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom';
export type TaskTimeOfDay = 'morning' | 'afternoon' | 'evening' | 'anytime';

export interface TaskCompletion {
  id: string;
  owner_id: string;
  task_id: string;
  completed_date: string;
  completed_at: string | null;
  skipped: boolean;
  skip_reason: string | null;
  notes: string | null;
  created_at: string;
}

export interface Expense {
  id: string;
  owner_id: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  description: string;
  expense_date: string;
  supplier: string | null;
  invoice_number: string | null;
  linked_animal_id: string | null;
  linked_crop_id: string | null;
  linked_sector_id: string | null;
  linked_supply_id: string | null;
  receipt_url: string | null;
  notes: string | null;
  created_at: string;
  animal?: Animal | null;
  crop?: Crop | null;
}

export type ExpenseCategory =
  | 'alimentacion'
  | 'veterinaria'
  | 'semillas'
  | 'fertilizantes'
  | 'herramientas'
  | 'combustible'
  | 'mano_obra'
  | 'servicios'
  | 'otro';

export interface Supply {
  id: string;
  owner_id: string;
  name: string;
  category: SupplyCategory;
  unit: string;
  current_stock: number;
  min_stock_alert: number | null;
  unit_cost: number | null;
  supplier: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type SupplyCategory =
  | 'alimento'
  | 'medicamento'
  | 'semilla'
  | 'fertilizante'
  | 'herramienta'
  | 'combustible'
  | 'otro';

export interface SupplyMovement {
  id: string;
  owner_id: string;
  supply_id: string;
  movement_type: 'entrada' | 'salida' | 'ajuste';
  quantity: number;
  unit_cost: number | null;
  total_cost: number | null;
  reason: string | null;
  movement_date: string;
  linked_expense_id: string | null;
  notes: string | null;
  created_at: string;
}

export interface DashboardMetrics {
  total_animals_active: number;
  total_crops_active: number;
  tasks_today_total: number;
  tasks_today_done: number;
  expenses_this_month: number;
  low_stock_count: number;
  animals_by_species: Array<{
    name: string;
    code: string;
    icon: string | null;
    count: number;
  }> | null;
  recent_events: Array<{
    event_type: AnimalEventType;
    event_date: string;
    notes: string | null;
    animal_name: string | null;
    animal_code: string;
    species_icon: string | null;
  }> | null;
}
