import React, { useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, FAB, Chip, ActivityIndicator, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { APP_COLORS } from '@/constants/theme';
import { useExpenses } from '@/hooks/useExpenses';
import { ExpenseCard } from '@/components/expenses/ExpenseCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { OfflineBanner } from '@/components/shared/OfflineBanner';
import { EXPENSE_CATEGORIES } from '@/constants/categories';
import { formatCurrency } from '@/utils/formatters';

export default function ExpensesScreen() {
  const [filterCat, setFilterCat] = useState<string>('');
  const { data: expenses, isLoading, refetch, isRefetching } = useExpenses({
    category: filterCat || undefined,
  });

  const total = expenses?.reduce((acc, e) => acc + e.amount, 0) ?? 0;

  return (
    <SafeAreaView style={styles.safe}>
      <OfflineBanner />
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>Gastos</Text>
        <Text variant="bodySmall" style={styles.subtitle}>
          {expenses?.length ?? 0} registros
        </Text>
      </View>

      {total > 0 && (
        <Surface style={styles.totalCard} elevation={1}>
          <Text variant="bodySmall" style={styles.totalLabel}>Total filtrado</Text>
          <Text variant="headlineMedium" style={styles.totalAmount}>{formatCurrency(total)}</Text>
        </Surface>
      )}

      <View style={styles.filterRow}>
        <Chip
          selected={!filterCat}
          onPress={() => setFilterCat('')}
          style={styles.chip}
          compact
        >
          Todos
        </Chip>
        {Object.entries(EXPENSE_CATEGORIES).map(([key, cat]) => (
          <Chip
            key={key}
            selected={filterCat === key}
            onPress={() => setFilterCat(filterCat === key ? '' : key)}
            style={[styles.chip, filterCat === key && { backgroundColor: cat.color + '20' }]}
            textStyle={filterCat === key ? { color: cat.color, fontWeight: '700' } : undefined}
            compact
          >
            {cat.label}
          </Chip>
        ))}
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} color={APP_COLORS.primary} />
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ExpenseCard expense={item} />}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[APP_COLORS.primary]} />
          }
          ListEmptyComponent={
            <EmptyState
              icon="cash-remove"
              title="Sin gastos registrados"
              subtitle="Registrá tu primer gasto"
              actionLabel="Agregar gasto"
              onAction={() => router.push('/expenses/new')}
            />
          }
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/expenses/new')}
        color="#fff"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: APP_COLORS.background },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  title: { fontWeight: '800', color: APP_COLORS.primary },
  subtitle: { color: APP_COLORS.textSecondary },
  totalCard: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    backgroundColor: APP_COLORS.surface,
    alignItems: 'center',
  },
  totalLabel: { color: APP_COLORS.textSecondary },
  totalAmount: { fontWeight: '800', color: APP_COLORS.primary },
  filterRow: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 8, gap: 8, flexWrap: 'wrap' },
  chip: { backgroundColor: APP_COLORS.surfaceVariant },
  list: { paddingBottom: 80, paddingTop: 4 },
  loader: { marginTop: 40 },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: APP_COLORS.primary },
});
