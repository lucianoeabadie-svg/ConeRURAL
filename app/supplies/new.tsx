import React from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { APP_COLORS } from '@/constants/theme';
import { useCreateSupply } from '@/hooks/useSupplies';
import { useAuthStore } from '@/store/useAuthStore';
import { FormField } from '@/components/shared/FormField';
import { SUPPLY_CATEGORIES, SUPPLY_UNITS } from '@/constants/categories';
import { newSupplySchema } from '@/utils/validators';
import type { z } from 'zod';

type FormData = z.infer<typeof newSupplySchema>;

export default function NewSupplyScreen() {
  const ownerId = useAuthStore((s) => s.user?.id ?? '');
  const { mutate: createSupply, isPending } = useCreateSupply();

  const { control, handleSubmit, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(newSupplySchema),
    defaultValues: { current_stock: 0, unit: 'kg' },
  });

  const selectedCat = watch('category');
  const selectedUnit = watch('unit');

  const onSubmit = (data: FormData) => {
    createSupply(
      {
        owner_id: ownerId,
        name: data.name,
        category: data.category as any,
        unit: data.unit,
        current_stock: Number(data.current_stock),
        min_stock_alert: data.min_stock_alert ? Number(data.min_stock_alert) : null,
        unit_cost: data.unit_cost ? Number(data.unit_cost) : null,
        supplier: data.supplier || null,
        notes: data.notes || null,
        is_active: true,
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
            {Object.entries(SUPPLY_CATEGORIES).map(([key, cat]) => (
              <TouchableOpacity
                key={key}
                style={[styles.catBtn, selectedCat === key && { borderColor: APP_COLORS.primary, backgroundColor: APP_COLORS.primary + '15' }]}
                onPress={() => setValue('category', key)}
                activeOpacity={0.7}
              >
                <Text variant="labelSmall" style={[styles.catLabel, selectedCat === key && { color: APP_COLORS.primary, fontWeight: '700' }]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text variant="titleMedium" style={[styles.sectionTitle, { marginTop: 8 }]}>Información</Text>
          <FormField control={control} name="name" label="Nombre del insumo" />
          <FormField control={control} name="current_stock" label="Stock inicial" keyboardType="numeric" />
          <FormField control={control} name="min_stock_alert" label="Alerta de stock mínimo (opcional)" keyboardType="numeric" />
          <FormField control={control} name="unit_cost" label="Costo por unidad ($)" keyboardType="numeric" />
          <FormField control={control} name="supplier" label="Proveedor" />

          <Text variant="titleMedium" style={[styles.sectionTitle, { marginTop: 8 }]}>Unidad de medida</Text>
          <View style={styles.unitGrid}>
            {SUPPLY_UNITS.map((u) => (
              <TouchableOpacity
                key={u.value}
                style={[styles.unitBtn, selectedUnit === u.value && { borderColor: APP_COLORS.primary, backgroundColor: APP_COLORS.primary + '15' }]}
                onPress={() => setValue('unit', u.value)}
                activeOpacity={0.7}
              >
                <Text variant="labelSmall" style={[styles.catLabel, selectedUnit === u.value && { color: APP_COLORS.primary, fontWeight: '700' }]}>
                  {u.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <FormField control={control} name="notes" label="Observaciones" multiline />
        </ScrollView>

        <View style={styles.footer}>
          <Button mode="outlined" onPress={() => router.back()} style={styles.footerBtn}>Cancelar</Button>
          <Button mode="contained" onPress={handleSubmit(onSubmit)} loading={isPending} disabled={isPending} style={[styles.footerBtn, styles.footerBtnMain]}>
            Guardar insumo
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
  catBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8, borderWidth: 2, borderColor: APP_COLORS.border, backgroundColor: APP_COLORS.surface },
  unitGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  unitBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8, borderWidth: 2, borderColor: APP_COLORS.border, backgroundColor: APP_COLORS.surface },
  catLabel: { color: APP_COLORS.textSecondary },
  footer: { flexDirection: 'row', padding: 16, gap: 12, backgroundColor: APP_COLORS.surface, borderTopWidth: 1, borderTopColor: APP_COLORS.border },
  footerBtn: { flex: 1 },
  footerBtnMain: { flex: 2 },
});
