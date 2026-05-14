import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Button, ProgressBar, SegmentedButtons, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Redirect } from 'expo-router';
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
  const session = useAuthStore((s) => s.session);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const ownerId = useAuthStore((s) => s.user?.id ?? '');

  const { data: species, isLoading: speciesLoading, error: speciesError, refetch: refetchSpecies } = useSpecies();
  const { data: sectors } = useSectors();
  const { mutate: createAnimal, isPending } = useCreateAnimal();

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(newAnimalSchema),
    defaultValues: { sex: 'unknown' },
  });

  const selectedSpeciesId = watch('species_id');
  const selectedSectorId = watch('sector_id');

  if (!isHydrated) return <ActivityIndicator style={styles.center} color={APP_COLORS.primary} />;
  if (!session) return <Redirect href="/auth/login" />;

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
      { onSuccess: () => router.back() }
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

          {/* PASO 1: ESPECIE */}
          {step === 0 && (
            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>¿Qué especie es?</Text>

              {speciesLoading && (
                <View style={styles.loadingWrap}>
                  <ActivityIndicator color={APP_COLORS.primary} />
                  <Text variant="bodyMedium" style={styles.loadingText}>Cargando especies...</Text>
                </View>
              )}

              {!speciesLoading && speciesError && (
                <View style={styles.errorWrap}>
                  <Text style={styles.errorText}>Error al cargar especies.</Text>
                  <Button mode="outlined" onPress={() => refetchSpecies()} compact>
                    Reintentar
                  </Button>
                </View>
              )}

              {!speciesLoading && !speciesError && (!species || species.length === 0) && (
                <View style={styles.errorWrap}>
                  <Text style={styles.errorText}>No se encontraron especies para tu cuenta.</Text>
                  <Button mode="outlined" onPress={() => refetchSpecies()} compact>
                    Reintentar
                  </Button>
                </View>
              )}

              {!speciesLoading && species && species.length > 0 && (
                <SpeciesSelector
                  species={species}
                  selected={selectedSpeciesId}
                  onSelect={(id) => setValue('species_id', id)}
                />
              )}

              {errors.species_id && (
                <Text style={styles.fieldError}>{errors.species_id.message}</Text>
              )}
            </View>
          )}

          {/* PASO 2: DATOS */}
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
                        { value: 'unknown', label: 'No sé' },
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

          {/* PASO 3: SECTOR */}
          {step === 2 && (
            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>¿Dónde va a estar?</Text>
              <Button
                mode={!selectedSectorId ? 'contained' : 'outlined'}
                onPress={() => setValue('sector_id', undefined)}
                style={styles.sectorBtn}
              >
                Sin sector asignado
              </Button>
              {sectors?.map((sector) => (
                <Button
                  key={sector.id}
                  mode={selectedSectorId === sector.id ? 'contained' : 'outlined'}
                  onPress={() => setValue('sector_id', sector.id)}
                  style={styles.sectorBtn}
                >
                  {sector.name} · {sector.type}
                </Button>
              ))}
              {!sectors?.length && (
                <Text style={styles.hint}>
                  No tenés sectores creados. Podés asignarlo después desde el menú Sectores.
                </Text>
              )}
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
  center: { flex: 1, justifyContent: 'center' },
  stepBar: { flexDirection: 'row', justifyContent: 'center', padding: 16, gap: 32 },
  stepItem: { alignItems: 'center', gap: 4 },
  stepDot: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: APP_COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  stepNum: { fontWeight: '700', color: APP_COLORS.textSecondary },
  stepLabel: { color: APP_COLORS.textSecondary, fontSize: 11 },
  content: { padding: 16, gap: 12, paddingBottom: 20 },
  section: { gap: 12 },
  sectionTitle: { fontWeight: '700', color: APP_COLORS.text },
  loadingWrap: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  loadingText: { color: APP_COLORS.textSecondary },
  errorWrap: { gap: 8, padding: 8 },
  errorText: { color: APP_COLORS.error, fontWeight: '600' },
  fieldError: { color: APP_COLORS.error, fontSize: 12 },
  segmentWrap: { gap: 6 },
  fieldLabel: { color: APP_COLORS.textSecondary },
  sectorBtn: { marginBottom: 4 },
  hint: { color: APP_COLORS.textSecondary, fontStyle: 'italic', textAlign: 'center', padding: 16 },
  footer: {
    flexDirection: 'row', padding: 16, gap: 12,
    backgroundColor: APP_COLORS.surface,
    borderTopWidth: 1, borderTopColor: APP_COLORS.border,
  },
  footerBtn: { flex: 1 },
  footerBtnMain: { flex: 2 },
});
