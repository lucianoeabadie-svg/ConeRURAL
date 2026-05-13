import { APP_COLORS } from './theme';
import type { AnimalEventType, CropEventType } from '@/types';

interface EventTypeConfig {
  label: string;
  icon: string;
  color: string;
  fields: string[];
  summary: (event: Record<string, unknown>) => string;
}

export const ANIMAL_EVENT_TYPES: Record<AnimalEventType, EventTypeConfig> = {
  weight: {
    label: 'Pesaje',
    icon: 'scale',
    color: APP_COLORS.weight,
    fields: ['weight_kg'],
    summary: (e) => e.weight_kg ? `${e.weight_kg} kg` : 'Sin peso',
  },
  feeding: {
    label: 'Alimentación',
    icon: 'food',
    color: APP_COLORS.feeding,
    fields: ['feed_type', 'feed_amount_kg', 'feed_cost'],
    summary: (e) => e.feed_type ? `${e.feed_type}${e.feed_amount_kg ? ` - ${e.feed_amount_kg}kg` : ''}` : 'Alimentación',
  },
  health_check: {
    label: 'Control Sanitario',
    icon: 'stethoscope',
    color: APP_COLORS.health_check,
    fields: ['diagnosis', 'treatment', 'vet_name'],
    summary: (e) => e.diagnosis as string || 'Control general',
  },
  vaccination: {
    label: 'Vacunación',
    icon: 'needle',
    color: APP_COLORS.vaccination,
    fields: ['medication', 'dose', 'vet_name', 'next_due_date'],
    summary: (e) => e.medication as string || 'Vacuna',
  },
  medication: {
    label: 'Medicación',
    icon: 'pill',
    color: APP_COLORS.medication,
    fields: ['medication', 'dose', 'treatment', 'next_due_date'],
    summary: (e) => e.medication as string || 'Medicamento',
  },
  deworming: {
    label: 'Desparasitación',
    icon: 'bug',
    color: APP_COLORS.deworming,
    fields: ['medication', 'dose', 'next_due_date'],
    summary: (e) => e.medication as string || 'Desparasitación',
  },
  pregnancy: {
    label: 'Preñez',
    icon: 'heart',
    color: APP_COLORS.pregnancy,
    fields: ['notes', 'next_due_date'],
    summary: (e) => e.notes as string || 'Control preñez',
  },
  birth: {
    label: 'Parto / Nacimiento',
    icon: 'baby',
    color: APP_COLORS.birth,
    fields: ['value_numeric', 'notes'],
    summary: (e) => e.value_numeric ? `${e.value_numeric} crías` : 'Nacimiento',
  },
  sale: {
    label: 'Venta',
    icon: 'cash',
    color: '#1565C0',
    fields: ['value_numeric', 'value_text', 'notes'],
    summary: (e) => e.value_numeric ? `$${e.value_numeric}` : 'Vendido',
  },
  death: {
    label: 'Fallecimiento',
    icon: 'cross',
    color: '#616161',
    fields: ['diagnosis', 'notes'],
    summary: (e) => e.diagnosis as string || 'Fallecido',
  },
  transfer: {
    label: 'Traslado',
    icon: 'transfer',
    color: '#6A1B9A',
    fields: ['value_text', 'notes'],
    summary: (e) => e.value_text as string || 'Traslado',
  },
  sector_change: {
    label: 'Cambio de Corral',
    icon: 'home-switch',
    color: '#00838F',
    fields: ['value_text', 'notes'],
    summary: (e) => e.value_text as string || 'Cambio de sector',
  },
  note: {
    label: 'Observación',
    icon: 'note-text',
    color: APP_COLORS.note,
    fields: ['notes'],
    summary: (e) => e.notes as string || 'Sin nota',
  },
};

export const CROP_EVENT_TYPES: Record<CropEventType, EventTypeConfig> = {
  irrigation: {
    label: 'Riego',
    icon: 'water',
    color: '#0277BD',
    fields: ['water_liters', 'duration_min'],
    summary: (e) => e.water_liters ? `${e.water_liters}L` : 'Riego',
  },
  fertilization: {
    label: 'Fertilización',
    icon: 'sprout',
    color: '#558B2F',
    fields: ['product_name', 'amount_kg', 'amount_l', 'cost'],
    summary: (e) => e.product_name as string || 'Fertilizante',
  },
  pesticide: {
    label: 'Fumigación',
    icon: 'spray',
    color: '#E65100',
    fields: ['product_name', 'amount_kg', 'amount_l', 'cost'],
    summary: (e) => e.product_name as string || 'Fumigación',
  },
  pruning: {
    label: 'Poda / Raleo',
    icon: 'content-cut',
    color: '#6D4C41',
    fields: ['notes'],
    summary: () => 'Poda',
  },
  harvest: {
    label: 'Cosecha',
    icon: 'basket',
    color: '#F9A825',
    fields: ['yield_kg', 'yield_units', 'sale_price'],
    summary: (e) => e.yield_kg ? `${e.yield_kg} kg` : e.yield_units ? `${e.yield_units} unidades` : 'Cosecha',
  },
  observation: {
    label: 'Observación',
    icon: 'eye',
    color: '#546E7A',
    fields: ['notes'],
    summary: (e) => e.notes as string || 'Observación',
  },
  note: {
    label: 'Nota',
    icon: 'note-text',
    color: '#78909C',
    fields: ['notes'],
    summary: (e) => e.notes as string || 'Nota',
  },
};
