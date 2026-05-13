import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { APP_COLORS } from '@/constants/theme';
import { useAddCropEvent } from '@/hooks/useCrops';
import { useAuthStore } from '@/store/useAuthStore';
import { FormField } from '@/components/shared/FormField';
import { CROP_EVENT_TYPES } from '@/constants/eventTypes';
import { cropEventSchema } from '@/utils/validators';
import type { CropEventType } from '@/types';
import type { z } from 'zod';

type FormData = z.infer<typeof cropEventSchema>;

const EVENT_ORDER: CropEventType[] = ['irrigation', 'fertilization', 'pesticide', 'pruning', 'harvest', 'observation', 'note'];

export default function NewCropEventScreen() {
  const { cropId } = useLocalSearchParams<{ cropId: string }>();
  const [eventType, setEventType] = useState<CropEventType>('irrigation');
  const ownerId = useAuthStore((s) => s.user?.id ?? '');
  const { mutate: addEvent, isPending } = useAddCropEvent();

  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(cropEventSchema),
    defaultValues: { event_date: new Date().toISOString().split('T')[0] },
  });

  const config = CROP_EVENT_TYPES[eventType];
  const fields = config.fields;

  const onSubmit = (data: FormData) => {
    addEvent(
      {
        owner_id: ownerId,
        crop_id: cropId,
        event_type: eventType,
        event_date: data.event_date,
        water_liters: data.water_liters ? Number(data.water_liters) : null,
        duration_min: data.duration_min ? Number(data.duration_min) : null,
        product_name: data.product_name || null,
        amount_kg: data.amount_kg ? Number(data.amount_kg) : null,
        amount_l: data.amount_l ? Number(data.amount_l) : null,
        cost: data.cost ? Number(data.cost) : null,
        yield_kg: data.yield_kg ? Number(data.yield_kg) : null,
        yield_units: data.yield_units ? Number(data.yield_units) : null,
        sale_price: data.sale_price ? Number(data.sale_price) : null,
        notes: data.notes || null,
        photo_url: null,
      },
      { onSuccess: () => router.back() }
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text variant="titleMedium" style={styles.sectionTitle}>Tipo de evento</Text>
          <View style={styles.typeGrid}>
            {EVENT_ORDER.map((type) => {
              const c = CROP_EVENT_TYPES[type];
              const isSelected = eventType === type;
              return (
                <TouchableOpacity
                  key={type}
                  style={[styles.typeBtn, isSelected && { borderColor: c.color, backgroundColor: c.color + '15' }]}
                  onPress={() => setEventType(type)}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons name={c.icon as any} size={20} color={c.color} />
                  <Text variant="labelSmall" style={[styles.typeLabel, isSelected && { color: c.color }]}>
                    {c.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text variant="titleMedium" style={[styles.sectionTitle, { marginTop: 8 }]}>Detalles</Text>
          <FormField control={control} name="event_date" label="Fecha (AAAA-MM-DD)" />
          {fields.includes('water_liters') && <FormField control={control} name="water_liters" label="Agua (litros)" keyboardType="numeric" />}
          {fields.includes('duration_min') && <FormField control={control} name="duration_min" label="Duración (minutos)" keyboardType="numeric" />}
          {fields.includes('product_name') && <FormField control={control} name="product_name" label="Producto" />}
          {fields.includes('amount_kg') && <FormField control={control} name="amount_kg" label="Cantidad (kg)" keyboardType="numeric" />}
          {fields.includes('amount_l') && <FormField control={control} name="amount_l" label="Cantidad (litros)" keyboardType="numeric" />}
          {fields.includes('cost') && <FormField control={control} name="cost" label="Costo ($)" keyboardType="numeric" />}
          {fields.includes('yield_kg') && <FormField control={control} name="yield_kg" label="Cosecha (kg)" keyboardType="numeric" />}
          {fields.includes('yield_units') && <FormField control={control} name="yield_units" label="Cosecha (unidades)" keyboardType="numeric" />}
          {fields.includes('sale_price') && <FormField control={control} name="sale_price" label="Precio de venta ($)" keyboardType="numeric" />}
          <FormField control={control} name="notes" label="Observaciones" multiline />
        </ScrollView>

        <View style={styles.footer}>
          <Button mode="outlined" onPress={() => router.back()} style={styles.footerBtn}>Cancelar</Button>
          <Button mode="contained" onPress={handleSubmit(onSubmit)} loading={isPending} disabled={isPending} style={[styles.footerBtn, styles.footerBtnMain]}>
            Guardar
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
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: APP_COLORS.border,
    backgroundColor: APP_COLORS.surface,
  },
  typeLabel: { color: APP_COLORS.textSecondary },
  footer: { flexDirection: 'row', padding: 16, gap: 12, backgroundColor: APP_COLORS.surface, borderTopWidth: 1, borderTopColor: APP_COLORS.border },
  footerBtn: { flex: 1 },
  footerBtnMain: { flex: 2 },
});
