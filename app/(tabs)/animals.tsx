import React, { useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, FAB, Searchbar, Chip, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { APP_COLORS } from '@/constants/theme';
import { useAnimals } from '@/hooks/useAnimals';
import { useSpecies } from '@/hooks/useSpecies';
import { AnimalCard } from '@/components/animals/AnimalCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { OfflineBanner } from '@/components/shared/OfflineBanner';
import { ANIMAL_STATUSES } from '@/constants/categories';

export default function AnimalsScreen() {
  const [search, setSearch] = useState('');
  const [filterSpecies, setFilterSpecies] = useState<string | undefined>();
  const [filterStatus, setFilterStatus] = useState<string>('active');

  const { data: animals, isLoading, refetch, isRefetching } = useAnimals({
    speciesId: filterSpecies,
    status: filterStatus,
  });
  const { data: species } = useSpecies();

  const filtered = animals?.filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      a.animal_code.toLowerCase().includes(q) ||
      (a.name ?? '').toLowerCase().includes(q) ||
      (a.breed ?? '').toLowerCase().includes(q)
    );
  });

  return (
    <SafeAreaView style={styles.safe}>
      <OfflineBanner />
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>Animales</Text>
        <Text variant="bodySmall" style={styles.subtitle}>
          {animals?.length ?? 0} registrados
        </Text>
      </View>

      <Searchbar
        placeholder="Buscar por código, nombre..."
        value={search}
        onChangeText={setSearch}
        style={styles.search}
        inputStyle={styles.searchInput}
      />

      {/* Status filter */}
      <View style={styles.filterRow}>
        {ANIMAL_STATUSES.map((s) => (
          <Chip
            key={s.value}
            selected={filterStatus === s.value}
            onPress={() => setFilterStatus(filterStatus === s.value ? '' : s.value)}
            style={[styles.chip, filterStatus === s.value && { backgroundColor: s.color + '20' }]}
            textStyle={filterStatus === s.value ? { color: s.color, fontWeight: '700' } : undefined}
            compact
          >
            {s.label}
          </Chip>
        ))}
      </View>

      {/* Species filter */}
      {species && species.length > 0 && (
        <View style={styles.filterRow}>
          {species.map((sp) => (
            <Chip
              key={sp.id}
              selected={filterSpecies === sp.id}
              onPress={() => setFilterSpecies(filterSpecies === sp.id ? undefined : sp.id)}
              style={[styles.chip, filterSpecies === sp.id && { backgroundColor: APP_COLORS.primary + '20' }]}
              compact
            >
              {sp.icon} {sp.name}
            </Chip>
          ))}
        </View>
      )}

      {isLoading ? (
        <ActivityIndicator style={styles.loader} color={APP_COLORS.primary} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AnimalCard animal={item} />}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[APP_COLORS.primary]} />
          }
          ListEmptyComponent={
            <EmptyState
              icon="cow-off"
              title="Sin animales"
              subtitle={search ? 'Probá con otra búsqueda' : 'Registrá tu primer animal'}
              actionLabel={!search ? 'Agregar animal' : undefined}
              onAction={!search ? () => router.push('/animals/new') : undefined}
            />
          }
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/animals/new')}
        color="#fff"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: APP_COLORS.background },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  title: { fontWeight: '800', color: APP_COLORS.primary },
  subtitle: { color: APP_COLORS.textSecondary },
  search: {
    marginHorizontal: 16, marginBottom: 8,
    backgroundColor: APP_COLORS.surface,
  },
  searchInput: { fontSize: 14 },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
    flexWrap: 'wrap',
  },
  chip: { backgroundColor: APP_COLORS.surfaceVariant },
  list: { paddingBottom: 80, paddingTop: 4 },
  loader: { marginTop: 40 },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: APP_COLORS.primary,
  },
});
