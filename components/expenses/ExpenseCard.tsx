import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { APP_COLORS } from '@/constants/theme';
import { EXPENSE_CATEGORIES } from '@/constants/categories';
import { formatCurrency, formatDate } from '@/utils/formatters';
import type { Expense } from '@/types';

interface Props {
  expense: Expense;
  onPress?: () => void;
}

export function ExpenseCard({ expense, onPress }: Props) {
  const catConfig = EXPENSE_CATEGORIES[expense.category as keyof typeof EXPENSE_CATEGORIES] ?? EXPENSE_CATEGORIES.otro;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
      <Surface style={styles.card} elevation={1}>
        <View style={[styles.iconWrap, { backgroundColor: catConfig.color + '20' }]}>
          <MaterialCommunityIcons name={catConfig.icon as any} size={22} color={catConfig.color} />
        </View>
        <View style={styles.info}>
          <Text variant="bodyMedium" style={styles.desc} numberOfLines={1}>
            {expense.description}
          </Text>
          <View style={styles.meta}>
            <Text variant="labelSmall" style={[styles.cat, { color: catConfig.color }]}>
              {catConfig.label}
            </Text>
            <Text style={styles.sep}>·</Text>
            <Text variant="labelSmall" style={styles.date}>{formatDate(expense.expense_date)}</Text>
            {expense.supplier && (
              <>
                <Text style={styles.sep}>·</Text>
                <Text variant="labelSmall" style={styles.date} numberOfLines={1}>{expense.supplier}</Text>
              </>
            )}
          </View>
        </View>
        <Text variant="titleMedium" style={styles.amount}>
          {formatCurrency(expense.amount)}
        </Text>
      </Surface>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 12,
    backgroundColor: APP_COLORS.surface,
    gap: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, gap: 4 },
  desc: { color: APP_COLORS.text, fontWeight: '500' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cat: { fontWeight: '600' },
  sep: { color: APP_COLORS.border },
  date: { color: APP_COLORS.textSecondary },
  amount: { fontWeight: '700', color: APP_COLORS.text },
});
