import { format, formatDistanceToNow, differenceInYears, differenceInMonths, differenceInDays, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatCurrency(amount: number, currency = 'ARS'): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatWeight(kg: number | null | undefined): string {
  if (kg == null) return '-';
  return `${kg.toLocaleString('es-AR')} kg`;
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  try {
    return format(parseISO(dateStr), 'dd/MM/yyyy', { locale: es });
  } catch {
    return dateStr;
  }
}

export function formatDateShort(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  try {
    return format(parseISO(dateStr), 'dd MMM', { locale: es });
  } catch {
    return dateStr;
  }
}

export function formatDateRelative(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  try {
    return formatDistanceToNow(parseISO(dateStr), { locale: es, addSuffix: true });
  } catch {
    return dateStr;
  }
}

export function formatAge(birthDate: string | null | undefined): string {
  if (!birthDate) return '-';
  try {
    const date = parseISO(birthDate);
    const years = differenceInYears(new Date(), date);
    if (years >= 1) return `${years} año${years !== 1 ? 's' : ''}`;
    const months = differenceInMonths(new Date(), date);
    if (months >= 1) return `${months} mes${months !== 1 ? 'es' : ''}`;
    const days = differenceInDays(new Date(), date);
    return `${days} día${days !== 1 ? 's' : ''}`;
  } catch {
    return '-';
  }
}

export function formatArea(m2: number | null | undefined): string {
  if (m2 == null) return '-';
  if (m2 >= 10000) return `${(m2 / 10000).toFixed(2)} ha`;
  return `${m2.toLocaleString('es-AR')} m²`;
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
