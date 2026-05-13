import React from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { APP_COLORS } from '@/constants/theme';
import { useCreateExpense } from '@/hooks/useExpenses';
import { useAuthStore } from '@/store/useAuthStore';
import { FormField } from '@/components/shared/FormField';
import { EXPENSE_CATEGORIES } from '@/constants/categories';
import { newExpenseSchema } from '@/utils/validators';
import type { z } from 'zod';

type FormData = z.infer<typeof newExpenseSchema>;

export default function NewExpenseScreen() {
  const ownerId = useAuthStore((s) => s.user?.id ?? '');
  const { mutate: createExpense, isPending } = useCreateExpense();

  const { control, handleSubmit, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(newExpenseSchema),
    defaultValues: { expense_date: new Date().toISOString().split('T')[0] },
  });

  const selectedCat = watch('category');

  const onSubmit = (data: FormData) => {
    createExpense(
      {
        owner_id: ownerId,
        amount: Number(data.amount),
        currency: 'ARS',
        category: data.category as any,
        description: data.description,
        expense_date: data.expense_date,
        supplier: data.supplier || null,
        invoice_number: null,
        linked_animal_id: null,
        linked_crop_id: null,
        linked_sector_id: null,
        linked_supply_id: null,
        receipt_url: null,
        notes: data.notes || null,
      },
      { onSuccess: () => router.back() }
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text variant="titleMedium" style={styles.sectionTitle}>Categoría</Text>
          <View style={styles.catGrid}>
            {Object.entries(EXPENSE_CATEGORIES).map(([key, cat]) => {
              const isSelected = selectedCat === key;
              return (
                <TouchableOpacity
                  key={key}
                  style={[styles.catBtn, isSelected && { borderColor: cat.color, backgroundColor: cat.color + '15' }]}
                  onPress={() => setValue('category', key)}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons name={cat.icon as any} size={18} color={isSelected ? cat.color : APP_COLORS.textSecondary} />
                  <Text variant="labelSmall" style={[styles.catLabel, isSelected && { color: cat.color, fontWeight: '700' }]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text variant="titleMedium" style={[styles.sectionTitle, { marginTop: 8 }]}>Detalle</Text>
          <FormField control={control} name="amount" label="Monto ($)" keyboardType="numeric" />
          <FormField control={control} name="description" label="Descripción" />
          <FormField control={control} name="expense_date" label="Fecha (AAAA-MM-DD)" />
          <FormField control={control} name="supplier" label="Proveedor (opcional)" />
          <FormField control={control} name="notes" label="Observaciones" multiline />
        </ScrollView>

        <View style={styles.footer}>
          <Button mode="outlined" onPress={() => router.back()} style={styles.footerBtn}>Cancelar</Button>
          <Button mode="contained" onPress={handleSubmit(onSubmit)} loading={isPending} disabled={isPending} style={[styles.footerBtn, styles.footerBtnMain]}>
            Guardar gasto
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: APP_COLORS.background },
  flex: { flex: 1 },
  container: { padding: 16, gap: 12, paddingBottom: 20 },
  sectionTitle: { fontWeight: '700', color: APP_COLORS.text },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 2, borderColor: APP_COLORS.border, backgroundColor: APP_COLORS.surface },
  catLabel: { color: APP_COLORS.textSecondary },
  footer: { flexDirection: 'row', padding: 16, gap: 12, backgroundColor: APP_COLORS.surface, borderTopWidth: 1, borderTopColor: APP_COLORS.border },
  footerBtn: { flex: 1 },
  footerBtnMain: { flex: 2 },
});
