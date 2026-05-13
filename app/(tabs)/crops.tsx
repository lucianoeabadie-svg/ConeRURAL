import React, { useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, FAB, Chip, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { APP_COLORS } from '@/constants/theme';
import { useCrops } from '@/hooks/useCrops';
import { CropCard } from '@/components/crops/CropCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { OfflineBanner } from '@/components/shared/OfflineBanner';
import { CROP_STATUSES } from '@/constants/categories';

export default function CropsScreen() {
  const [filterStatus, setFilterStatus] = useState<string>('active');
  const { data: crops, isLoading, refetch, isRefetching } = useCrops(filterStatus || undefined);

  return (
    <SafeAreaView style={styles.safe}>
      <OfflineBanner />
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>Huerta y Cultivos</Text>
        <Text variant="bodySmall" style={styles.subtitle}>{crops?.length ?? 0} lotes</Text>
      </View>

      <View style={styles.filterRow}>
        <Chip
          selected={!filterStatus}
          onPress={() => setFilterStatus('')}
          style={styles.chip}
          compact
        >
          Todos
        </Chip>
        {CROP_STATUSES.map((s) => (
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

      {isLoading ? (
        <ActivityIndicator style={styles.loader} color={APP_COLORS.primary} />
      ) : (
        <FlatList
          data={crops}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CropCard crop={item} />}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[APP_COLORS.primary]} />
          }
          ListEmptyComponent={
            <EmptyState
              icon="sprout-outline"
              title="Sin cultivos"
              subtitle="Registrá tu primera huerta o cultivo"
              actionLabel="Nuevo cultivo"
              onAction={() => router.push('/crops/new')}
            />
          }
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/crops/new')}
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
  filterRow: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 8, gap: 8, flexWrap: 'wrap' },
  chip: { backgroundColor: APP_COLORS.surfaceVariant },
  list: { paddingBottom: 80, paddingTop: 4 },
  loader: { marginTop: 40 },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: APP_COLORS.primary },
});
