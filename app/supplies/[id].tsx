import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, Surface, Button, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { APP_COLORS } from '@/constants/theme';
import { useSupply, useSupplyMovements, useAddSupplyMovement } from '@/hooks/useSupplies';
import { useAuthStore } from '@/store/useAuthStore';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { formatDate, formatCurrency } from '@/utils/formatters';

export default function SupplyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const ownerId = useAuthStore((s) => s.user?.id ?? '');
  const { data: supply, isLoading, refetch, isRefetching } = useSupply(id);
  const { data: movements } = useSupplyMovements(id);
  const { mutate: addMovement, isPending } = useAddSupplyMovement();

  const [movType, setMovType] = useState<'entrada' | 'salida' | 'ajuste'>('entrada');
  const [qty, setQty] = useState('');
  const [showForm, setShowForm] = useState(false);

  if (isLoading) return <LoadingScreen />;
  if (!supply) return null;

  const isLow = supply.min_stock_alert != null && supply.current_stock <= supply.min_stock_alert;

  const handleMovement = () => {
    if (!qty) return;
    addMovement(
      {
        owner_id: ownerId,
        supply_id: id,
        movement_type: movType,
        quantity: Number(qty),
        unit_cost: supply.unit_cost,
        total_cost: supply.unit_cost ? supply.unit_cost * Number(qty) : null,
        reason: null,
        movement_date: new Date().toISOString().split('T')[0],
        linked_expense_id: null,
        notes: null,
      },
      {
        onSuccess: () => {
          setQty('');
          setShowForm(false);
          refetch();
        },
      }
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[APP_COLORS.primary]} />}
      >
        <Surface style={[styles.header, isLow && styles.headerLow]} elevation={1}>
          <Text variant="headlineSmall" style={styles.name}>{supply.name}</Text>
          <View style={styles.stockRow}>
            <Text variant="displaySmall" style={[styles.stock, isLow && { color: APP_COLORS.error }]}>
              {supply.current_stock.toLocaleString('es-AR')}
            </Text>
            <Text variant="titleMedium" style={styles.unit}>{supply.unit}</Text>
          </View>
          {isLow && (
            <View style={styles.alertRow}>
              <MaterialCommunityIcons name="alert-circle" size={16} color={APP_COLORS.error} />
              <Text variant="labelMedium" style={{ color: APP_COLORS.error }}>
                Stock bajo — mínimo: {supply.min_stock_alert} {supply.unit}
              </Text>
            </View>
          )}
          {supply.unit_cost && (
            <Text variant="bodySmall" style={styles.costText}>
              Costo unitario: {formatCurrency(supply.unit_cost)}/{supply.unit}
            </Text>
          )}
        </Surface>

        {!showForm ? (
          <Button mode="contained" icon="plus" onPress={() => setShowForm(true)} style={styles.movBtn}>
            Registrar movimiento
          </Button>
        ) : (
          <Surface style={styles.movForm} elevation={1}>
            <Text variant="titleSmall" style={styles.sectionTitle}>Nuevo movimiento</Text>
            <View style={styles.movTypeRow}>
              {(['entrada', 'salida', 'ajuste'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.movTypeBtn, movType === type && styles.movTypeBtnSelected]}
                  onPress={() => setMovType(type)}
                >
                  <Text style={[styles.movTypeLabel, movType === type && { color: APP_COLORS.primary, fontWeight: '700' }]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              label={`Cantidad (${supply.unit})`}
              value={qty}
              onChangeText={setQty}
              keyboardType="numeric"
              mode="outlined"
            />
            <View style={styles.movButtons}>
              <Button mode="outlined" onPress={() => setShowForm(false)}>Cancelar</Button>
              <Button mode="contained" onPress={handleMovement} loading={isPending} disabled={!qty || isPending}>
                Guardar
              </Button>
            </View>
          </Surface>
        )}

        <Text variant="titleSmall" style={styles.sectionTitle}>Historial de movimientos</Text>
        {movements?.map((mov) => (
          <Surface key={mov.id} style={styles.movCard} elevation={0}>
            <View style={styles.movRow}>
              <MaterialCommunityIcons
                name={mov.movement_type === 'entrada' ? 'arrow-down-circle' : mov.movement_type === 'salida' ? 'arrow-up-circle' : 'sync-circle'}
                size={20}
                color={mov.movement_type === 'entrada' ? APP_COLORS.success : mov.movement_type === 'salida' ? APP_COLORS.error : APP_COLORS.accent}
              />
              <Text variant="bodyMedium" style={styles.movQty}>
                {mov.movement_type === 'salida' ? '-' : '+'}{mov.quantity} {supply.unit}
              </Text>
              <Text variant="labelSmall" style={styles.movDate}>{formatDate(mov.movement_date)}</Text>
            </View>
          </Surface>
        ))}
        {!movements?.length && (
          <Text style={styles.emptyText}>Sin movimientos registrados</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: APP_COLORS.background },
  container: { padding: 16, gap: 12, paddingBottom: 32 },
  header: { borderRadius: 16, padding: 20, backgroundColor: APP_COLORS.surface, gap: 8 },
  headerLow: { borderLeftWidth: 4, borderLeftColor: APP_COLORS.error },
  name: { fontWeight: '800', color: APP_COLORS.text },
  stockRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  stock: { fontWeight: '900', color: APP_COLORS.primary },
  unit: { color: APP_COLORS.textSecondary },
  alertRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  costText: { color: APP_COLORS.textSecondary },
  movBtn: { borderRadius: 12 },
  movForm: { borderRadius: 16, padding: 16, backgroundColor: APP_COLORS.surface, gap: 12 },
  sectionTitle: { fontWeight: '700', color: APP_COLORS.text },
  movTypeRow: { flexDirection: 'row', gap: 8 },
  movTypeBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 2, borderColor: APP_COLORS.border, alignItems: 'center' },
  movTypeBtnSelected: { borderColor: APP_COLORS.primary, backgroundColor: APP_COLORS.primary + '10' },
  movTypeLabel: { color: APP_COLORS.textSecondary },
  movButtons: { flexDirection: 'row', gap: 12, justifyContent: 'flex-end' },
  movCard: { borderRadius: 10, padding: 12, backgroundColor: APP_COLORS.surface, borderWidth: 1, borderColor: APP_COLORS.border },
  movRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  movQty: { flex: 1, fontWeight: '600' },
  movDate: { color: APP_COLORS.textSecondary },
  emptyText: { color: APP_COLORS.textSecondary, fontStyle: 'italic', textAlign: 'center', paddingVertical: 16 },
});
