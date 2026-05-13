import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Surface, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { APP_COLORS } from '@/constants/theme';
import { useSector } from '@/hooks/useSectors';
import { useAnimals } from '@/hooks/useAnimals';
import { SECTOR_TYPES } from '@/constants/categories';
import { AnimalCard } from '@/components/animals/AnimalCard';

export default function SectorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: sector, isLoading, refetch, isRefetching } = useSector(id);
  const { data: animals } = useAnimals({ sectorId: id });

  if (isLoading) return <ActivityIndicator style={{ marginTop: 40 }} color={APP_COLORS.primary} />;
  if (!sector) return null;

  const typeConfig = SECTOR_TYPES.find((t) => t.value === sector.type);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[APP_COLORS.primary]} />
        }
      >
        <Surface style={styles.header} elevation={1}>
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons
              name={(typeConfig?.icon ?? 'map-marker') as any}
              size={32}
              color={APP_COLORS.primary}
            />
          </View>
          <View style={styles.headerInfo}>
            <Text variant="headlineSmall" style={styles.name}>{sector.name}</Text>
            <Text variant="bodyMedium" style={styles.type}>{typeConfig?.label ?? sector.type}</Text>
            {sector.description && (
              <Text variant="bodySmall" style={styles.description}>{sector.description}</Text>
            )}
          </View>
        </Surface>

        {(sector.capacity != null || sector.notes) && (
          <Surface style={styles.infoCard} elevation={1}>
            {sector.capacity != null && (
              <View style={styles.infoRow}>
                <Text variant="labelSmall" style={styles.infoLabel}>Capacidad</Text>
                <Text variant="bodyMedium" style={styles.infoValue}>{sector.capacity} animales</Text>
              </View>
            )}
            {sector.notes && (
              <View style={styles.infoRow}>
                <Text variant="labelSmall" style={styles.infoLabel}>Notas</Text>
                <Text variant="bodyMedium" style={styles.infoValue}>{sector.notes}</Text>
              </View>
            )}
          </Surface>
        )}

        <Text variant="titleSmall" style={styles.sectionTitle}>
          Animales en este sector ({animals?.length ?? 0})
        </Text>

        {animals?.length === 0 && (
          <Text style={styles.emptyText}>Sin animales asignados a este sector</Text>
        )}

        {animals?.map((animal) => (
          <AnimalCard key={animal.id} animal={animal} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: APP_COLORS.background },
  container: { padding: 16, gap: 12, paddingBottom: 32 },
  header: { borderRadius: 16, padding: 16, backgroundColor: APP_COLORS.surface, flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  iconWrap: { width: 64, height: 64, borderRadius: 32, backgroundColor: APP_COLORS.primary + '20', alignItems: 'center', justifyContent: 'center' },
  headerInfo: { flex: 1, gap: 4 },
  name: { fontWeight: '800', color: APP_COLORS.text },
  type: { color: APP_COLORS.textSecondary },
  description: { color: APP_COLORS.textSecondary, marginTop: 4 },
  infoCard: { borderRadius: 16, padding: 16, backgroundColor: APP_COLORS.surface, gap: 8 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: APP_COLORS.border },
  infoLabel: { color: APP_COLORS.textSecondary },
  infoValue: { color: APP_COLORS.text, fontWeight: '500', flex: 1, textAlign: 'right' },
  sectionTitle: { fontWeight: '700', color: APP_COLORS.text },
  emptyText: { color: APP_COLORS.textSecondary, fontStyle: 'italic', textAlign: 'center', paddingVertical: 16 },
});
