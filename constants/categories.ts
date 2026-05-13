import type { ExpenseCategory, SupplyCategory } from '@/types';

export const EXPENSE_CATEGORIES: Record<ExpenseCategory, { label: string; icon: string; color: string }> = {
  alimentacion: { label: 'Alimentación', icon: 'food', color: '#FF9800' },
  veterinaria: { label: 'Veterinaria', icon: 'medical-bag', color: '#F44336' },
  semillas: { label: 'Semillas', icon: 'seed', color: '#4CAF50' },
  fertilizantes: { label: 'Fertilizantes', icon: 'sprout', color: '#8BC34A' },
  herramientas: { label: 'Herramientas', icon: 'hammer', color: '#795548' },
  combustible: { label: 'Combustible', icon: 'gas-station', color: '#607D8B' },
  mano_obra: { label: 'Mano de Obra', icon: 'account-hard-hat', color: '#3F51B5' },
  servicios: { label: 'Servicios', icon: 'lightning-bolt', color: '#9C27B0' },
  otro: { label: 'Otro', icon: 'dots-horizontal', color: '#9E9E9E' },
};

export const SUPPLY_CATEGORIES: Record<SupplyCategory, { label: string; icon: string }> = {
  alimento: { label: 'Alimento', icon: 'food' },
  medicamento: { label: 'Medicamento', icon: 'pill' },
  semilla: { label: 'Semilla', icon: 'seed' },
  fertilizante: { label: 'Fertilizante', icon: 'sprout' },
  herramienta: { label: 'Herramienta', icon: 'hammer' },
  combustible: { label: 'Combustible', icon: 'gas-station' },
  otro: { label: 'Otro', icon: 'package-variant' },
};

export const SECTOR_TYPES = [
  { value: 'corral', label: 'Corral', icon: 'fence' },
  { value: 'galpon', label: 'Galpón', icon: 'warehouse' },
  { value: 'potrero', label: 'Potrero', icon: 'grass' },
  { value: 'huerta', label: 'Huerta', icon: 'sprout' },
  { value: 'invernadero', label: 'Invernadero', icon: 'greenhouse' },
  { value: 'jaula', label: 'Jaula', icon: 'bird-cage' },
  { value: 'otro', label: 'Otro', icon: 'map-marker' },
];

export const ANIMAL_STATUSES = [
  { value: 'active', label: 'Activo', color: '#2E7D32' },
  { value: 'sold', label: 'Vendido', color: '#1565C0' },
  { value: 'deceased', label: 'Fallecido', color: '#616161' },
  { value: 'transferred', label: 'Transferido', color: '#6A1B9A' },
];

export const CROP_STATUSES = [
  { value: 'planned', label: 'Planificado', color: '#1565C0' },
  { value: 'active', label: 'En crecimiento', color: '#2E7D32' },
  { value: 'harvested', label: 'Cosechado', color: '#F9A825' },
  { value: 'failed', label: 'Perdido', color: '#B00020' },
];

export const TASK_CATEGORIES = [
  { value: 'alimentacion', label: 'Alimentación', icon: 'food' },
  { value: 'salud', label: 'Salud', icon: 'medical-bag' },
  { value: 'riego', label: 'Riego', icon: 'water' },
  { value: 'limpieza', label: 'Limpieza', icon: 'broom' },
  { value: 'mantenimiento', label: 'Mantenimiento', icon: 'tools' },
  { value: 'cosecha', label: 'Cosecha', icon: 'basket' },
  { value: 'otro', label: 'Otro', icon: 'checkbox-marked-circle' },
];

export const SUPPLY_UNITS = [
  { value: 'kg', label: 'Kilogramos (kg)' },
  { value: 'g', label: 'Gramos (g)' },
  { value: 'l', label: 'Litros (L)' },
  { value: 'ml', label: 'Mililitros (ml)' },
  { value: 'unidad', label: 'Unidad' },
  { value: 'bolsa', label: 'Bolsa' },
  { value: 'caja', label: 'Caja' },
  { value: 'rollo', label: 'Rollo' },
];
