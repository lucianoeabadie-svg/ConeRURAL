import React from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { APP_COLORS } from '@/constants/theme';
import { useCreateCrop } from '@/hooks/useCrops';
import { useSectors } from '@/hooks/useSectors';
import { useAuthStore } from '@/store/useAuthStore';
import { FormField } from '@/components/shared/FormField';
import { newCropSchema } from '@/utils/validators';
import type { z } from 'zod';

type FormData = z.infer<typeof newCropSchema>;

export default function NewCropScreen() {
  const ownerId = useAuthStore((s) => s.user?.id ?? '');
  const { data: sectors } = useSectors();
  const { mutate: createCrop, isPending } = useCreateCrop();

  const { control, handleSubmit, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(newCropSchema),
  });

  const selectedSector = watch('sector_id');

  const onSubmit = (data: FormData) => {
    createCrop(
      {
        owner_id: ownerId,
        sector_id: data.sector_id ?? null,
        name: data.name,
        plant_type: data.plant_type,
        variety: data.variety || null,
        seeding_date: data.seeding_date || null,
        expected_harvest_date: data.expected_harvest_date || null,
        actual_harvest_date: null,
        area_m2: data.area_m2 ? Number(data.area_m2) : null,
        row_count: null,
        plant_count: data.plant_count ? Number(data.plant_count) : null,
        status: 'active',
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
          <Text variant="titleMedium" style={styles.sectionTitle}>Información del cultivo</Text>
          <FormField control={control} name="name" label="Nombre del lote / huerta" />
          <FormField control={control} name="plant_type" label="Tipo de cultivo (tomate, maíz, zapallo...)" />
          <FormField control={control} name="variety" label="Variedad (opcional)" />
          <FormField control={control} name="seeding_date" label="Fecha de siembra (AAAA-MM-DD)" />
          <FormField control={control} name="expected_harvest_date" label="Fecha estimada de cosecha (AAAA-MM-DD)" />
          <FormField control={control} name="area_m2" label="Superficie (m²)" keyboardType="numeric" />
          <FormField control={control} name="plant_count" label="Cantidad de plantas" keyboardType="numeric" />

          {sectors && sectors.length > 0 && (
            <>
              <Text variant="titleMedium" style={[styles.sectionTitle, { marginTop: 8 }]}>Sector / Ubicación</Text>
              {sectors.map((sector) => (
                <Button
                  key={sector.id}
                  mode={selectedSector === sector.id ? 'contained' : 'outlined'}
                  onPress={() => setValue('sector_id', sector.id)}
                  style={styles.sectorBtn}
                >
                  {sector.name}
                </Button>
              ))}
            </>
          )}

          <FormField control={control} name="notes" label="Observaciones" multiline />
        </ScrollView>

        <View style={styles.footer}>
          <Button mode="outlined" onPress={() => router.back()} style={styles.footerBtn}>
            Cancelar
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isPending}
            disabled={isPending}
            style={[styles.footerBtn, styles.footerBtnMain]}
          >
            Registrar cultivo
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
  sectorBtn: { marginBottom: 4 },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: APP_COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: APP_COLORS.border,
  },
  footerBtn: { flex: 1 },
  footerBtnMain: { flex: 2 },
});
