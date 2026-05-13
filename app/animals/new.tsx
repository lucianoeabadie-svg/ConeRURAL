import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Button, ProgressBar, SegmentedButtons, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { APP_COLORS } from '@/constants/theme';
import { useSpecies } from '@/hooks/useSpecies';
import { useSectors } from '@/hooks/useSectors';
import { useCreateAnimal } from '@/hooks/useAnimals';
import { useAuthStore } from '@/store/useAuthStore';
import { SpeciesSelector } from '@/components/animals/SpeciesSelector';
import { FormField } from '@/components/shared/FormField';
import { newAnimalSchema } from '@/utils/validators';
import type { z } from 'zod';

type FormData = z.infer<typeof newAnimalSchema>;

const STEPS = ['Especie', 'Datos', 'Ubicación'];

export default function NewAnimalScreen() {
  const [step, setStep] = useState(0);
  const ownerId = useAuthStore((s) => s.user?.id ?? '');
  const { data: species, isLoading: speciesLoading } = useSpecies();
  const { data: sectors } = useSectors();
  const { mutate: createAnimal, isPending } = useCreateAnimal();

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(newAnimalSchema),
    defaultValues: { sex: 'unknown' },
  });

  const selectedSpeciesId = watch('species_id');
  const selectedSectorId = watch('sector_id');

  const onSubmit = (data: FormData) => {
    createAnimal(
      {
        owner_id: ownerId,
        species_id: data.species_id,
        sector_id: data.sector_id ?? null,
        name: data.name || null,
        sex: data.sex ?? 'unknown',
        birth_date: data.birth_date || null,
        breed: data.breed || null,
        color: data.color || null,
        tag_number: data.tag_number || null,
        weight_kg: data.weight_kg ? Number(data.weight_kg) : null,
        acquisition_date: data.acquisition_date || null,
        acquisition_cost: data.acquisition_cost ? Number(data.acquisition_cost) : null,
        acquisition_source: data.acquisition_source || null,
        notes: data.notes || null,
        status: 'active',
        status_date: null,
        status_notes: null,
        photo_url: null,
      },
      {
        onSuccess: () => router.back(),
      }
    );
  };

  const canNext = step === 0 ? !!selectedSpeciesId : true;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Step indicator */}
        <View style={styles.stepBar}>
          {STEPS.map((s, i) => (
            <View key={s} style={styles.stepItem}>
              <View style={[styles.stepDot, i <= step && { backgroundColor: APP_COLORS.primary }]}>
                <Text style={[styles.stepNum, i <= step && { color: '#fff' }]}>{i + 1}</Text>
              </View>
              <Text variant="labelSmall" style={[styles.stepLabel, i === step && { color: APP_COLORS.primary }]}>
                {s}
              </Text>
            </View>
          ))}
        </View>
        <ProgressBar progress={(step + 1) / STEPS.length} color={APP_COLORS.primary} />

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {step === 0 && (
            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>¿Qué especie es?</Text>
              {speciesLoading && (
                <Text style={styles.hint}>Cargando especies...</Text>
              )}
              {!speciesLoading && (!species || species.length === 0) && (
                <Text style={styles.hint}>No se encontraron especies. Recargá la página.</Text>
              )}
              {species && species.length > 0 && (
                <SpeciesSelector
                  species={species}
                  selected={selectedSpeciesId}
                  onSelect={(id) => setValue('species_id', id)}
                />
              )}
              {errors.species_id && (
                <Text style={styles.error}>{errors.species_id.message}</Text>
              )}
            </View>
          )}

          {step === 1 && (
            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>Datos del animal</Text>
              <FormField control={control} name="name" label="Nombre (opcional)" />
              <Controller
                control={control}
                name="sex"
                render={({ field: { value, onChange } }) => (
                  <View style={styles.segmentWrap}>
                    <Text variant="labelMedium" style={styles.fieldLabel}>Sexo</Text>
                    <SegmentedButtons
                      value={value ?? 'unknown'}
                      onValueChange={onChange}
                      buttons={[
                        { value: 'M', label: 'Macho' },
                        { value: 'F', label: 'Hembra' },
                        { value: 'unknown', label: 'Desconocido' },
                      ]}
                    />
                  </View>
                )}
              />
              <FormField control={control} name="birth_date" label="Fecha de nacimiento (AAAA-MM-DD)" />
              <FormField control={control} name="breed" label="Raza" />
              <FormField control={control} name="tag_number" label="Nro de caravana / anillo" />
              <FormField control={control} name="weight_kg" label="Peso inicial (kg)" keyboardType="numeric" />
              <FormField control={control} name="acquisition_cost" label="Costo de adquisición ($)" keyboardType="numeric" />
              <FormField control={control} name="acquisition_source" label="Origen (compra, nacido en finca...)" />
              <FormField control={control} name="notes" label="Observaciones" multiline />
            </View>
          )}

          {step === 2 && (
            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>¿Dónde va a estar?</Text>
              {sectors?.map((sector) => (
                <Button
                  key={sector.id}
                  mode={selectedSectorId === sector.id ? 'contained' : 'outlined'}
                  onPress={() => setValue('sector_id', sector.id)}
                  style={styles.sectorBtn}
                  contentStyle={styles.sectorBtnContent}
                >
                  {sector.name} ({sector.type})
                </Button>
              ))}
              {!sectors?.length && (
                <Text style={styles.hint}>No tenés sectores creados. Podés asignarlo después.</Text>
              )}
              <Button
                mode={!selectedSectorId ? 'contained' : 'outlined'}
                onPress={() => setValue('sector_id', undefined)}
                style={styles.sectorBtn}
              >
                Sin sector asignado
              </Button>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          {step > 0 && (
            <Button mode="outlined" onPress={() => setStep((s) => s - 1)} style={styles.footerBtn}>
              Atrás
            </Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button
              mode="contained"
              onPress={() => canNext && setStep((s) => s + 1)}
              disabled={!canNext}
              style={[styles.footerBtn, styles.footerBtnMain]}
            >
              Siguiente
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              loading={isPending}
              disabled={isPending}
              style={[styles.footerBtn, styles.footerBtnMain]}
            >
              Registrar animal
            </Button>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: APP_COLORS.background },
  flex: { flex: 1 },
  stepBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    gap: 32,
  },
  stepItem: { alignItems: 'center', gap: 4 },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: APP_COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: { fontWeight: '700', color: APP_COLORS.textSecondary },
  stepLabel: { color: APP_COLORS.textSecondary, fontSize: 11 },
  content: { padding: 16, gap: 12, paddingBottom: 20 },
  section: { gap: 12 },
  sectionTitle: { fontWeight: '700', color: APP_COLORS.text },
  segmentWrap: { gap: 6 },
  fieldLabel: { color: APP_COLORS.textSecondary },
  sectorBtn: { marginBottom: 4 },
  sectorBtnContent: { paddingVertical: 4 },
  hint: { color: APP_COLORS.textSecondary, fontStyle: 'italic' },
  error: { color: APP_COLORS.error, fontSize: 12 },
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
