import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Surface, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_COLORS } from '@/constants/theme';
import { useDashboard } from '@/hooks/useDashboard';
import { useExpenses } from '@/hooks/useExpenses';
import { StatCard } from '@/components/shared/StatCard';
import { formatCurrency } from '@/utils/formatters';
import { EXPENSE_CATEGORIES } from '@/constants/categories';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function StatsScreen() {
  const { data: metrics, refetch, isRefetching } = useDashboard();
  const { data: expenses } = useExpenses();

  const totalExpenses = expenses?.reduce((acc, e) => acc + e.amount, 0) ?? 0;

  const expensesByCategory = expenses?.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount;
    return acc;
  }, {} as Record<string, number>) ?? {};

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[APP_COLORS.primary]} />
        }
      >
        <Text variant="titleMedium" style={styles.sectionTitle}>Resumen general</Text>
        <View style={styles.statsRow}>
          <StatCard
            label="Animales activos"
            value={metrics?.total_animals_active ?? '-'}
            icon="cow"
          />
          <StatCard
            label="Cultivos activos"
            value={metrics?.total_crops_active ?? '-'}
            icon="sprout"
            color={APP_COLORS.accent}
          />
        </View>

        <Text variant="titleMedium" style={styles.sectionTitle}>Gastos totales</Text>
        <Surface style={styles.totalCard} elevation={1}>
          <Text variant="displaySmall" style={styles.totalAmount}>{formatCurrency(totalExpenses)}</Text>
          <Text variant="bodySmall" style={styles.totalLabel}>Total registrado</Text>
        </Surface>

        {Object.keys(expensesByCategory).length > 0 && (
          <>
            <Text variant="titleMedium" style={styles.sectionTitle}>Gastos por categoría</Text>
            <Surface style={styles.catCard} elevation={1}>
              {Object.entries(expensesByCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([cat, amount]) => {
                  const catConfig = EXPENSE_CATEGORIES[cat as keyof typeof EXPENSE_CATEGORIES] ?? EXPENSE_CATEGORIES.otro;
                  const pct = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                  return (
                    <View key={cat} style={styles.catRow}>
                      <View style={styles.catLeft}>
                        <MaterialCommunityIcons name={catConfig.icon as any} size={18} color={catConfig.color} />
                        <Text variant="bodyMedium" style={styles.catName}>{catConfig.label}</Text>
                      </View>
                      <View style={styles.catRight}>
                        <Text variant="titleSmall" style={styles.catAmount}>{formatCurrency(amount)}</Text>
                        <View style={styles.barWrap}>
                          <View style={[styles.bar, { width: `${pct}%`, backgroundColor: catConfig.color }]} />
                        </View>
                        <Text variant="labelSmall" style={styles.catPct}>{pct.toFixed(0)}%</Text>
                      </View>
                    </View>
                  );
                })}
            </Surface>
          </>
        )}

        {metrics?.animals_by_species && metrics.animals_by_species.length > 0 && (
          <>
            <Text variant="titleMedium" style={styles.sectionTitle}>Distribución de animales</Text>
            <Surface style={styles.catCard} elevation={1}>
              {metrics.animals_by_species.map((sp) => (
                <View key={sp.code} style={styles.catRow}>
                  <View style={styles.catLeft}>
                    <Text style={{ fontSize: 18 }}>{sp.icon ?? '🐾'}</Text>
                    <Text variant="bodyMedium" style={styles.catName}>{sp.name}</Text>
                  </View>
                  <View style={styles.catRight}>
                    <Text variant="titleSmall" style={[styles.catAmount, { color: APP_COLORS.primary }]}>{sp.count}</Text>
                  </View>
                </View>
              ))}
            </Surface>
          </>
        )}

        {(metrics?.tasks_today_total ?? 0) > 0 && (
          <>
            <Text variant="titleMedium" style={styles.sectionTitle}>Cumplimiento de tareas (hoy)</Text>
            <Surface style={styles.totalCard} elevation={1}>
              <Text variant="displaySmall" style={styles.totalAmount}>
                {metrics?.tasks_today_done ?? 0}/{metrics?.tasks_today_total ?? 0}
              </Text>
              <Text variant="bodySmall" style={styles.totalLabel}>tareas completadas</Text>
            </Surface>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: APP_COLORS.background },
  container: { padding: 16, gap: 12, paddingBottom: 32 },
  sectionTitle: { fontWeight: '700', color: APP_COLORS.text },
  statsRow: { flexDirection: 'row', gap: 12 },
  totalCard: { borderRadius: 16, padding: 20, backgroundColor: APP_COLORS.surface, alignItems: 'center', gap: 4 },
  totalAmount: { fontWeight: '900', color: APP_COLORS.primary },
  totalLabel: { color: APP_COLORS.textSecondary },
  catCard: { borderRadius: 16, padding: 16, backgroundColor: APP_COLORS.surface, gap: 12 },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  catLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, width: 140 },
  catName: { color: APP_COLORS.text, flex: 1 },
  catRight: { flex: 1, alignItems: 'flex-end', gap: 4 },
  catAmount: { fontWeight: '700', color: APP_COLORS.text },
  barWrap: { width: '100%', height: 4, backgroundColor: APP_COLORS.border, borderRadius: 2 },
  bar: { height: 4, borderRadius: 2 },
  catPct: { color: APP_COLORS.textSecondary },
});
