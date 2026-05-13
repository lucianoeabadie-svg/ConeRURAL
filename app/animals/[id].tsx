import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Text, Surface, Button, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { APP_COLORS } from '@/constants/theme';
import { useAnimal, useAnimalEvents } from '@/hooks/useAnimals';
import { Timeline } from '@/components/shared/Timeline';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { ANIMAL_STATUSES } from '@/constants/categories';
import { formatAge, formatDate, formatWeight } from '@/utils/formatters';

export default function AnimalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: animal, isLoading: loadingAnimal, refetch, isRefetching } = useAnimal(id);
  const { data: events, isLoading: loadingEvents } = useAnimalEvents(id);

  if (loadingAnimal) return <LoadingScreen />;
  if (!animal) return null;

  const statusConfig = ANIMAL_STATUSES.find((s) => s.value === animal.status);

  const QUICK_EVENTS = [
    { type: 'weight', label: 'Pesaje', icon: 'scale', color: '#4CAF50' },
    { type: 'feeding', label: 'Alimento', icon: 'food', color: '#FF9800' },
    { type: 'vaccination', label: 'Vacuna', icon: 'needle', color: '#9C27B0' },
    { type: 'note', label: 'Nota', icon: 'note-text', color: '#607D8B' },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[APP_COLORS.primary]} />
        }
      >
        {/* Header */}
        <Surface style={styles.header} elevation={1}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatar}>{animal.species?.icon ?? '🐾'}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text variant="headlineSmall" style={styles.code}>{animal.animal_code}</Text>
            {animal.name && <Text variant="titleMedium" style={styles.name}>{animal.name}</Text>}
            <View style={styles.chips}>
              {statusConfig && (
                <Chip
                  compact
                  style={{ backgroundColor: statusConfig.color + '20' }}
                  textStyle={{ color: statusConfig.color, fontWeight: '700' }}
                >
                  {statusConfig.label}
                </Chip>
              )}
              {animal.sector && (
                <Chip compact icon="map-marker" style={styles.sectorChip}>
                  {animal.sector.name}
                </Chip>
              )}
            </View>
          </View>
        </Surface>

        {/* Info grid */}
        <Surface style={styles.infoGrid} elevation={1}>
          {[
            { label: 'Especie', value: animal.species?.name ?? '-' },
            { label: 'Raza', value: animal.breed ?? '-' },
            { label: 'Sexo', value: animal.sex === 'M' ? 'Macho' : animal.sex === 'F' ? 'Hembra' : '-' },
            { label: 'Edad', value: formatAge(animal.birth_date) },
            { label: 'Peso actual', value: formatWeight(animal.weight_kg) },
            { label: 'Caravana', value: animal.tag_number ?? '-' },
            { label: 'F. Nacimiento', value: formatDate(animal.birth_date) },
            { label: 'F. Ingreso', value: formatDate(animal.acquisition_date) },
          ].map((item) => (
            <View key={item.label} style={styles.infoItem}>
              <Text variant="labelSmall" style={styles.infoLabel}>{item.label}</Text>
              <Text variant="bodyMedium" style={styles.infoValue}>{item.value}</Text>
            </View>
          ))}
        </Surface>

        {/* Quick actions */}
        <View style={styles.quickRow}>
          {QUICK_EVENTS.map((q) => (
            <TouchableOpacity
              key={q.type}
              style={styles.quickBtn}
              onPress={() => router.push({ pathname: '/animals/events/new', params: { animalId: id, eventType: q.type } })}
              activeOpacity={0.7}
            >
              <View style={[styles.quickIcon, { backgroundColor: q.color + '20' }]}>
                <MaterialCommunityIcons name={q.icon as any} size={20} color={q.color} />
              </View>
              <Text variant="labelSmall" style={styles.quickLabel}>{q.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button
          mode="contained-tonal"
          icon="note-plus"
          onPress={() => router.push({ pathname: '/animals/events/new', params: { animalId: id } })}
          style={styles.eventBtn}
        >
          Registrar evento
        </Button>

        {/* Timeline */}
        <Text variant="titleSmall" style={styles.sectionTitle}>Historial</Text>
        {loadingEvents ? null : <Timeline events={events ?? []} />}

        {animal.notes && (
          <Surface style={styles.notesCard} elevation={0}>
            <Text variant="labelSmall" style={styles.infoLabel}>Observaciones generales</Text>
            <Text variant="bodyMedium">{animal.notes}</Text>
          </Surface>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: APP_COLORS.background },
  container: { padding: 16, gap: 12, paddingBottom: 32 },
  header: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: APP_COLORS.surface,
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  avatarWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: APP_COLORS.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: { fontSize: 36 },
  headerInfo: { flex: 1, gap: 6 },
  code: { fontWeight: '800', color: APP_COLORS.primary },
  name: { color: APP_COLORS.text },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  sectorChip: { backgroundColor: APP_COLORS.surfaceVariant },
  infoGrid: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: APP_COLORS.surface,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 0,
  },
  infoItem: {
    width: '50%',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.border,
  },
  infoLabel: { color: APP_COLORS.textSecondary, marginBottom: 2 },
  infoValue: { color: APP_COLORS.text, fontWeight: '500' },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: APP_COLORS.surface,
    borderRadius: 16,
    padding: 16,
  },
  quickBtn: { alignItems: 'center', gap: 6 },
  quickIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { color: APP_COLORS.textSecondary },
  eventBtn: { borderRadius: 12 },
  sectionTitle: { fontWeight: '700', color: APP_COLORS.text, marginTop: 4 },
  notesCard: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: APP_COLORS.surfaceVariant,
    gap: 4,
  },
});
