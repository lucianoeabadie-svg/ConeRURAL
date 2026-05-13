import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

export const registerSchema = z.object({
  full_name: z.string().min(2, 'Ingresá tu nombre'),
  farm_name: z.string().min(2, 'Ingresá el nombre de tu chacra'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

export const newAnimalSchema = z.object({
  species_id: z.string().min(1, 'Seleccioná una especie'),
  name: z.string().optional(),
  sex: z.enum(['M', 'F', 'unknown']).default('unknown'),
  birth_date: z.string().optional(),
  breed: z.string().optional(),
  color: z.string().optional(),
  tag_number: z.string().optional(),
  weight_kg: z.coerce.number().positive('Debe ser mayor a 0').optional().or(z.literal('')),
  sector_id: z.string().optional(),
  acquisition_date: z.string().optional(),
  acquisition_cost: z.coerce.number().min(0).optional().or(z.literal('')),
  acquisition_source: z.string().optional(),
  notes: z.string().optional(),
});

export const animalEventSchema = z.object({
  event_type: z.string().min(1, 'Seleccioná un tipo'),
  event_date: z.string().default(() => new Date().toISOString().split('T')[0]),
  weight_kg: z.coerce.number().positive().optional().or(z.literal('')),
  feed_type: z.string().optional(),
  feed_amount_kg: z.coerce.number().positive().optional().or(z.literal('')),
  feed_cost: z.coerce.number().min(0).optional().or(z.literal('')),
  medication: z.string().optional(),
  dose: z.string().optional(),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
  vet_name: z.string().optional(),
  next_due_date: z.string().optional(),
  value_numeric: z.coerce.number().optional().or(z.literal('')),
  value_text: z.string().optional(),
  notes: z.string().optional(),
});

export const newCropSchema = z.object({
  name: z.string().min(1, 'Ingresá un nombre'),
  plant_type: z.string().min(1, 'Ingresá el tipo de cultivo'),
  variety: z.string().optional(),
  sector_id: z.string().optional(),
  seeding_date: z.string().optional(),
  expected_harvest_date: z.string().optional(),
  area_m2: z.coerce.number().positive().optional().or(z.literal('')),
  plant_count: z.coerce.number().int().positive().optional().or(z.literal('')),
  notes: z.string().optional(),
});

export const cropEventSchema = z.object({
  event_type: z.string().min(1, 'Seleccioná un tipo'),
  event_date: z.string().default(() => new Date().toISOString().split('T')[0]),
  water_liters: z.coerce.number().positive().optional().or(z.literal('')),
  duration_min: z.coerce.number().int().positive().optional().or(z.literal('')),
  product_name: z.string().optional(),
  amount_kg: z.coerce.number().positive().optional().or(z.literal('')),
  amount_l: z.coerce.number().positive().optional().or(z.literal('')),
  cost: z.coerce.number().min(0).optional().or(z.literal('')),
  yield_kg: z.coerce.number().positive().optional().or(z.literal('')),
  yield_units: z.coerce.number().int().positive().optional().or(z.literal('')),
  sale_price: z.coerce.number().min(0).optional().or(z.literal('')),
  notes: z.string().optional(),
});

export const newExpenseSchema = z.object({
  amount: z.coerce.number().positive('Monto inválido'),
  category: z.string().min(1, 'Seleccioná una categoría'),
  description: z.string().min(1, 'Ingresá una descripción'),
  expense_date: z.string().default(() => new Date().toISOString().split('T')[0]),
  supplier: z.string().optional(),
  linked_animal_id: z.string().optional(),
  linked_crop_id: z.string().optional(),
  notes: z.string().optional(),
});

export const newSupplySchema = z.object({
  name: z.string().min(1, 'Ingresá un nombre'),
  category: z.string().min(1, 'Seleccioná una categoría'),
  unit: z.string().min(1, 'Seleccioná una unidad'),
  current_stock: z.coerce.number().min(0).default(0),
  min_stock_alert: z.coerce.number().min(0).optional().or(z.literal('')),
  unit_cost: z.coerce.number().min(0).optional().or(z.literal('')),
  supplier: z.string().optional(),
  notes: z.string().optional(),
});

export const newTaskSchema = z.object({
  title: z.string().min(1, 'Ingresá un título'),
  description: z.string().optional(),
  frequency: z.enum(['daily', 'weekly', 'biweekly', 'monthly', 'custom']).default('daily'),
  time_of_day: z.enum(['morning', 'afternoon', 'evening', 'anytime']).default('anytime'),
  category: z.string().optional(),
  linked_sector_id: z.string().optional(),
});

export const newSectorSchema = z.object({
  name: z.string().min(1, 'Ingresá un nombre'),
  type: z.string().min(1, 'Seleccioná un tipo'),
  description: z.string().optional(),
  capacity: z.coerce.number().int().positive().optional().or(z.literal('')),
  notes: z.string().optional(),
});
