import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, Surface, FAB, Button, TextInput, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { APP_COLORS } from '@/constants/theme';
import { useSectors, useCreateSector } from '@/hooks/useSectors';
import { useAuthStore } from '@/store/useAuthStore';
import { EmptyState } from '@/components/shared/EmptyState';
import { SECTOR_TYPES } from '@/constants/categories';
import type { SectorType } from '@/types';

export default function SectorsScreen() {
  const ownerId = useAuthStore((s) => s.user?.id ?? '');
  const { data: sectors, isLoading, refetch, isRefetching } = useSectors();
  const { mutate: createSector, isPending } = useCreateSector();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<string>('corral');

  const handleCreate = () => {
    if (!name.trim()) return;
    createSector(
      {
        owner_id: ownerId,
        name: name.trim(),
        type: type as SectorType,
        description: null,
        capacity: null,
        notes: null,
        is_active: true,
      },
      {
        onSuccess: () => {
          setName('');
          setShowForm(false);
        },
      }
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {isLoading ? (
        <ActivityIndicator style={styles.loader} color={APP_COLORS.primary} />
      ) : (
        <FlatList
          data={sectors}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[APP_COLORS.primary]} />
          }
          ListHeaderComponent={
            showForm ? (
              <Surface style={styles.form} elevation={1}>
                <Text variant="titleSmall" style={styles.formTitle}>Nuevo sector</Text>
                <TextInput label="Nombre" value={name} onChangeText={setName} mode="outlined" />
                <Text variant="labelMedium" style={styles.label}>Tipo</Text>
                <View style={styles.typeGrid}>
                  {SECTOR_TYPES.map((st) => (
                    <TouchableOpacity
                      key={st.value}
                      style={[styles.typeBtn, type === st.value && { borderColor: APP_COLORS.primary, backgroundColor: APP_COLORS.primary + '15' }]}
                      onPress={() => setType(st.value)}
                    >
                      <Text variant="labelSmall" style={[type === st.value && { color: APP_COLORS.primary, fontWeight: '700' }]}>
                        {st.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.formBtns}>
                  <Button mode="outlined" onPress={() => setShowForm(false)}>Cancelar</Button>
                  <Button mode="contained" onPress={handleCreate} loading={isPending} disabled={!name.trim() || isPending}>
                    Crear
                  </Button>
                </View>
              </Surface>
            ) : null
          }
          ListEmptyComponent={
            !showForm ? (
              <EmptyState
                icon="map-marker-outline"
                title="Sin sectores creados"
                subtitle="Creá corrales, galpones y potreros para organizar tus animales"
                actionLabel="Crear sector"
                onAction={() => setShowForm(true)}
              />
            ) : null
          }
          renderItem={({ item }) => {
            const typeConfig = SECTOR_TYPES.find((t) => t.value === item.type);
            return (
              <Surface style={styles.sectorCard} elevation={1}>
                <MaterialCommunityIcons
                  name={(typeConfig?.icon ?? 'map-marker') as any}
                  size={24}
                  color={APP_COLORS.primary}
                />
                <View style={styles.sectorInfo}>
                  <Text variant="titleSmall" style={styles.sectorName}>{item.name}</Text>
                  <Text variant="bodySmall" style={styles.sectorType}>{typeConfig?.label ?? item.type}</Text>
                </View>
              </Surface>
            );
          }}
        />
      )}

      {!showForm && (
        <FAB icon="plus" style={styles.fab} onPress={() => setShowForm(true)} color="#fff" />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: APP_COLORS.background },
  loader: { marginTop: 40 },
  list: { padding: 16, paddingBottom: 80, gap: 8 },
  form: { borderRadius: 16, padding: 16, backgroundColor: APP_COLORS.surface, marginBottom: 8, gap: 12 },
  formTitle: { fontWeight: '700', color: APP_COLORS.text },
  label: { color: APP_COLORS.textSecondary },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 2, borderColor: APP_COLORS.border, backgroundColor: APP_COLORS.surface },
  formBtns: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  sectorCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 12, padding: 14, backgroundColor: APP_COLORS.surface },
  sectorInfo: { flex: 1 },
  sectorName: { fontWeight: '700', color: APP_COLORS.text },
  sectorType: { color: APP_COLORS.textSecondary },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: APP_COLORS.primary },
});
