import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router, Redirect } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { APP_COLORS } from '@/constants/theme';
import { useAddAnimalEvent } from '@/hooks/useAnimals';
import { useAuthStore } from '@/store/useAuthStore';
import { EventTypeSelector } from '@/components/animals/EventTypeSelector';
import { FormField } from '@/components/shared/FormField';
import { animalEventSchema } from '@/utils/validators';
import { ANIMAL_EVENT_TYPES } from '@/constants/eventTypes';
import type { AnimalEventType } from '@/types';
import type { z } from 'zod';

type FormData = z.infer<typeof animalEventSchema>;

export default function NewAnimalEventScreen() {
  const { animalId, eventType: initialType } = useLocalSearchParams<{
    animalId: string;
    eventType?: string;
  }>();

  const session = useAuthStore((s) => s.session);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const ownerId = useAuthStore((s) => s.user?.id ?? '');

  const [eventType, setEventType] = useState<AnimalEventType>(
    (initialType as AnimalEventType) ?? 'note'
  );

  const { mutate: addEvent, isPending } = useAddAnimalEvent();

  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(animalEventSchema),
    defaultValues: {
      event_type: eventType,
      event_date: new Date().toISOString().split('T')[0],
    },
  });

  if (!isHydrated) return <ActivityIndicator style={styles.center} color={APP_COLORS.primary} />;
  if (!session) return <Redirect href="/auth/login" />;

  const config = ANIMAL_EVENT_TYPES[eventType];
  const fields = config.fields;

  const onSubmit = (data: FormData) => {
    addEvent(
      {
        owner_id: ownerId,
        animal_id: animalId,
        event_type: eventType,
        event_date: data.event_date,
        weight_kg: data.weight_kg ? Number(data.weight_kg) : null,
        feed_type: data.feed_type || null,
        feed_amount_kg: data.feed_amount_kg ? Number(data.feed_amount_kg) : null,
        feed_cost: data.feed_cost ? Number(data.feed_cost) : null,
        diagnosis: data.diagnosis || null,
        treatment: data.treatment || null,
        medication: data.medication || null,
        dose: data.dose || null,
        vet_name: data.vet_name || null,
        next_due_date: data.next_due_date || null,
        value_numeric: data.value_numeric ? Number(data.value_numeric) : null,
        value_text: data.value_text || null,
        notes: data.notes || null,
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
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text variant="titleMedium" style={styles.sectionTitle}>Tipo de evento</Text>
          <EventTypeSelector selected={eventType} onSelect={setEventType} />

          <Text variant="titleMedium" style={[styles.sectionTitle, { marginTop: 8 }]}>
            Detalles
          </Text>

          <FormField control={control} name="event_date" label="Fecha (AAAA-MM-DD)" />

          {fields.includes('weight_kg') && (
            <FormField control={control} name="weight_kg" label="Peso (kg)" keyboardType="numeric" />
          )}
          {fields.includes('feed_type') && (
            <FormField control={control} name="feed_type" label="Tipo de alimento" />
          )}
          {fields.includes('feed_amount_kg') && (
            <FormField control={control} name="feed_amount_kg" label="Cantidad (kg)" keyboardType="numeric" />
          )}
          {fields.includes('feed_cost') && (
            <FormField control={control} name="feed_cost" label="Costo ($)" keyboardType="numeric" />
          )}
          {fields.includes('medication') && (
            <FormField control={control} name="medication" label="Medicamento / Vacuna" />
          )}
          {fields.includes('dose') && (
            <FormField control={control} name="dose" label="Dosis" />
          )}
          {fields.includes('diagnosis') && (
            <FormField control={control} name="diagnosis" label="Diagnóstico" />
          )}
          {fields.includes('treatment') && (
            <FormField control={control} name="treatment" label="Tratamiento" />
          )}
          {fields.includes('vet_name') && (
            <FormField control={control} name="vet_name" label="Veterinario" />
          )}
          {fields.includes('next_due_date') && (
            <FormField control={control} name="next_due_date" label="Próxima fecha (AAAA-MM-DD)" />
          )}
          {fields.includes('value_numeric') && (
            <FormField control={control} name="value_numeric" label="Valor numérico" keyboardType="numeric" />
          )}
          {fields.includes('value_text') && (
            <FormField control={control} name="value_text" label="Valor / Descripción" />
          )}
          <FormField control={control} name="notes" label="Observaciones" multiline />
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
            loading={isPending}
            disabled={isPending}
            style={[styles.footerBtn, styles.footerBtnMain]}
          >
            Guardar evento
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
  container: { padding: 16, gap: 12, paddingBottom: 20 },
  sectionTitle: { fontWeight: '700', color: APP_COLORS.text },
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
