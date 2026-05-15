import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, KeyboardAvoidingView,
  Platform, TouchableOpacity,
} from 'react-native';
import { Text, Button, SegmentedButtons, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Redirect } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { APP_COLORS } from '@/constants/theme';
import { DEFAULT_SPECIES } from '@/constants/species';
import { useSpecies } from '@/hooks/useSpecies';
import { useSectors } from '@/hooks/useSectors';
import { useCreateAnimal } from '@/hooks/useAnimals';
import { useAuthStore } from '@/store/useAuthStore';
import { speciesService } from '@/services/species.service';
import { FormField } from '@/components/shared/FormField';
import { newAnimalSchema } from '@/utils/validators';
import type { z } from 'zod';

type FormData = z.infer<typeof newAnimalSchema>;

export default function NewAnimalScreen() {
  const session = useAuthStore((s) => s.session);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const ownerId = useAuthStore((s) => s.user?.id ?? '');

  const [selectedCode, setSelectedCode] = useState<string>('');
  const [resolving, setResolving] = useState(false);

  const { data: dbSpecies, refetch } = useSpecies();
  const { data: sectors } = useSectors();
  const { mutate: createAnimal, isPending } = useCreateAnimal();

  const {
    control, handleSubmit, watch, setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(newAnimalSchema),
    defaultValues: { sex: 'unknown' },
  });

  const selectedSectorId = watch('sector_id');

  if (!isHydrated) return <ActivityIndicator style={styles.center} color={APP_COLORS.primary} />;
  if (!session) return <Redirect href="/auth/login" />;

  const handleSelectSpecies = async (code: string) => {
    setSelectedCode(code);

    // Buscar en las especies ya cargadas
    let found = dbSpecies?.find((s) => s.code === code);

    if (!found) {
      // Seedear y volver a buscar
      try {
        setResolving(true);
        await speciesService.seedDefaults(ownerId);
        const fresh = await refetch();
        found = fresh.data?.find((s) => s.code === code);
      } catch {
        // ignorar
      } finally {
        setResolving(false);
      }
    }

    if (found) {
      setValue('species_id', found.id, { shouldValidate: true });
    }
  };

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
        acquisition_date: null,
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

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >

          {/* ── ESPECIE ── */}
          <Text variant="titleMedium" style={styles.sectionTitle}>
            ¿Qué especie es?
          </Text>

          {resolving && (
            <View style={styles.resolveRow}>
              <ActivityIndicator size="small" color={APP_COLORS.primary} />
              <Text style={styles.resolveText}>Guardando especie...</Text>
            </View>
          )}

          <View style={styles.grid}>
            {DEFAULT_SPECIES.map((sp) => {
              const isSelected = selectedCode === sp.code;
              return (
                <TouchableOpacity
                  key={sp.code}
                  style={styles.gridItem}
                  onPress={() => handleSelectSpecies(sp.code)}
                  activeOpacity={0.75}
                >
                  <View style={[styles.card, isSelected && styles.cardSelected]}>
                    <Text style={styles.cardEmoji}>{sp.icon}</Text>
                    <Text
                      style={[styles.cardName, isSelected && styles.cardNameSelected]}
                      numberOfLines={2}
                    >
                      {sp.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {errors.species_id && (
            <Text style={styles.fieldError}>Seleccioná una especie para continuar</Text>
          )}

          {/* ── DATOS ── */}
          <Text variant="titleMedium" style={[styles.sectionTitle, styles.mt16]}>
            Datos del animal
          </Text>

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
          <FormField control={control} name="breed" label="Raza (opcional)" />
          <FormField control={control} name="tag_number" label="Nro de caravana / anillo" />
          <FormField control={control} name="weight_kg" label="Peso inicial (kg)" keyboardType="numeric" />
          <FormField control={control} name="acquisition_cost" label="Costo de adquisición ($)" keyboardType="numeric" />
          <FormField control={control} name="acquisition_source" label="Origen (compra, nacido en finca...)" />
          <FormField control={control} name="notes" label="Observaciones" multiline />

          {/* ── SECTOR ── */}
          <Text variant="titleMedium" style={[styles.sectionTitle, styles.mt16]}>
            Sector (opcional)
          </Text>

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
              No tenés sectores creados. Podés asignarlo después.
            </Text>
          )}

          <View style={styles.bottomPad} />
        </ScrollView>

        <View style={styles.footer}>
          <Button
            mode="outlined"
            onPress={() => router.back()}
            style={styles.footerBtn}
          >
            Cancelar
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isPending || resolving}
            disabled={isPending || resolving || !selectedCode}
            style={[styles.footerBtn, styles.footerBtnMain]}
          >
            Registrar animal
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: APP_COLORS.background },
  flex: { flex: 1 },
  center: { flex: 1, justifyContent: 'center' },
  content: { padding: 16, gap: 10, paddingBottom: 16 },
  mt16: { marginTop: 8 },

  sectionTitle: { fontWeight: '700', color: APP_COLORS.text },

  resolveRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  resolveText: { color: APP_COLORS.textSecondary, fontSize: 13 },

  // grilla de especies — siempre visible desde constante local
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  gridItem: { width: '31%' },
  card: {
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    gap: 5,
    backgroundColor: APP_COLORS.surface,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardSelected: {
    borderColor: APP_COLORS.primary,
    backgroundColor: APP_COLORS.primary + '15',
  },
  cardEmoji: { fontSize: 26 },
  cardName: {
    textAlign: 'center',
    fontSize: 11,
    color: APP_COLORS.textSecondary,
    lineHeight: 14,
  },
  cardNameSelected: {
    color: APP_COLORS.primary,
    fontWeight: '700',
  },

  fieldError: { color: APP_COLORS.error, fontSize: 12, marginTop: -4 },

  segmentWrap: { gap: 6 },
  fieldLabel: { color: APP_COLORS.textSecondary },

  sectorBtn: { marginBottom: 4 },
  hint: {
    color: APP_COLORS.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 8,
    fontSize: 13,
  },
  bottomPad: { height: 8 },

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
