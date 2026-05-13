import React from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, FAB, ActivityIndicator, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { APP_COLORS } from '@/constants/theme';
import { useSupplies, useLowStock } from '@/hooks/useSupplies';
import { SupplyCard } from '@/components/supplies/SupplyCard';
import { EmptyState } from '@/components/shared/EmptyState';

export default function SuppliesScreen() {
  const { data: supplies, isLoading, refetch, isRefetching } = useSupplies();
  const { data: lowStock } = useLowStock();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>Insumos y Stock</Text>
        <Text variant="bodySmall" style={styles.subtitle}>{supplies?.length ?? 0} insumos</Text>
      </View>

      {lowStock && lowStock.length > 0 && (
        <Surface style={styles.alertBanner} elevation={1}>
          <MaterialCommunityIcons name="alert-circle" size={18} color={APP_COLORS.error} />
          <Text variant="labelMedium" style={{ color: APP_COLORS.error, flex: 1 }}>
            {lowStock.length} insumo{lowStock.length !== 1 ? 's' : ''} con stock bajo
          </Text>
        </Surface>
      )}

      {isLoading ? (
        <ActivityIndicator style={styles.loader} color={APP_COLORS.primary} />
      ) : (
        <FlatList
          data={supplies}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SupplyCard supply={item} />}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[APP_COLORS.primary]} />
          }
          ListEmptyComponent={
            <EmptyState
              icon="package-variant-closed"
              title="Sin insumos registrados"
              subtitle="Registrá tu primer insumo o producto"
              actionLabel="Agregar insumo"
              onAction={() => router.push('/supplies/new')}
            />
          }
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/supplies/new')}
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
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10,
    padding: 12,
    gap: 10,
    backgroundColor: APP_COLORS.error + '10',
  },
  loader: { marginTop: 40 },
  list: { paddingBottom: 80, paddingTop: 4 },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: APP_COLORS.primary },
});
