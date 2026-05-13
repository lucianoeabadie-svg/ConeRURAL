import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Surface, ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { APP_COLORS } from '@/constants/theme';
import { SUPPLY_CATEGORIES } from '@/constants/categories';
import type { Supply } from '@/types';

interface Props {
  supply: Supply;
}

export function SupplyCard({ supply }: Props) {
  const catConfig = SUPPLY_CATEGORIES[supply.category as keyof typeof SUPPLY_CATEGORIES] ?? SUPPLY_CATEGORIES.otro;
  const isLow = supply.min_stock_alert != null && supply.current_stock <= supply.min_stock_alert;
  const stockPct = supply.min_stock_alert ? Math.min(1, supply.current_stock / (supply.min_stock_alert * 2)) : 1;

  return (
    <TouchableOpacity onPress={() => router.push(`/supplies/${supply.id}`)} activeOpacity={0.7}>
      <Surface style={[styles.card, isLow && styles.cardLow]} elevation={1}>
        <View style={styles.header}>
          <MaterialCommunityIcons name={catConfig.icon as any} size={20} color={isLow ? APP_COLORS.error : APP_COLORS.primary} />
          <Text variant="titleSmall" style={styles.name} numberOfLines={1}>{supply.name}</Text>
          {isLow && <MaterialCommunityIcons name="alert-circle" size={18} color={APP_COLORS.error} />}
        </View>
        <View style={styles.row}>
          <Text variant="headlineSmall" style={[styles.stock, isLow && { color: APP_COLORS.error }]}>
            {supply.current_stock.toLocaleString('es-AR')}
          </Text>
          <Text variant="bodyMedium" style={styles.unit}>{supply.unit}</Text>
        </View>
        {supply.min_stock_alert != null && (
          <View style={styles.alertRow}>
            <ProgressBar
              progress={stockPct}
              color={isLow ? APP_COLORS.error : APP_COLORS.success}
              style={styles.progress}
            />
            <Text variant="labelSmall" style={styles.alertText}>
              Mín: {supply.min_stock_alert} {supply.unit}
            </Text>
          </View>
        )}
      </Surface>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 14,
    backgroundColor: APP_COLORS.surface,
    gap: 6,
  },
  cardLow: { borderLeftWidth: 4, borderLeftColor: APP_COLORS.error },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { flex: 1, fontWeight: '600', color: APP_COLORS.text },
  row: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  stock: { fontWeight: '700', color: APP_COLORS.primary },
  unit: { color: APP_COLORS.textSecondary },
  alertRow: { gap: 4 },
  progress: { height: 4, borderRadius: 2 },
  alertText: { color: APP_COLORS.textSecondary },
});
