import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, Surface, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { APP_COLORS } from '@/constants/theme';
import { useDashboard } from '@/hooks/useDashboard';
import { useAuthStore } from '@/store/useAuthStore';
import { StatCard } from '@/components/shared/StatCard';
import { ProgressRing } from '@/components/shared/ProgressRing';
import { OfflineBanner } from '@/components/shared/OfflineBanner';
import { ANIMAL_EVENT_TYPES } from '@/constants/eventTypes';
import { formatCurrency, formatDate } from '@/utils/formatters';

export default function DashboardScreen() {
  const profile = useAuthStore((s) => s.profile);
  const { data: metrics, isLoading, refetch, isRefetching } = useDashboard();

  const today = format(new Date(), "EEEE d 'de' MMMM", { locale: es });
  const farmName = profile?.farm_name ?? 'Mi Chacra';

  return (
    <SafeAreaView style={styles.safe}>
      <OfflineBanner />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[APP_COLORS.primary]} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text variant="headlineSmall" style={styles.farmName}>{farmName}</Text>
            <Text variant="bodyMedium" style={styles.date}>{today}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/stats/index')} style={styles.statsBtn}>
            <MaterialCommunityIcons name="chart-bar" size={24} color={APP_COLORS.primary} />
          </TouchableOpacity>
        </View>

        {metrics && (
          <Surface style={styles.taskCard} elevation={1}>
            <View style={styles.taskRow}>
              <ProgressRing done={metrics.tasks_today_done} total={metrics.tasks_today_total} size={72} />
              <View style={styles.taskInfo}>
                <Text variant="titleMedium" style={styles.taskTitle}>Tareas de hoy</Text>
                <Text variant="bodyMedium" style={styles.taskSubtitle}>
                  {metrics.tasks_today_done} de {metrics.tasks_today_total} completadas
                </Text>
                <Button mode="text" compact onPress={() => router.push('/(tabs)/tasks')} style={styles.taskBtn}>
                  Ver tareas
                </Button>
              </View>
            </View>
          </Surface>
        )}

        <View style={styles.statsRow}>
          <StatCard
            label="Animales activos"
            value={metrics?.total_animals_active ?? '-'}
            icon="cow"
            onPress={() => router.push('/(tabs)/animals')}
          />
          <StatCard
            label="Cultivos activos"
            value={metrics?.total_crops_active ?? '-'}
            icon="sprout"
            color={APP_COLORS.accent}
            onPress={() => router.push('/(tabs)/crops')}
          />
        </View>

        <View style={styles.statsRow}>
          <StatCard
            label="Gasto este mes"
            value={metrics ? formatCurrency(metrics.expenses_this_month) : '-'}
            icon="cash"
            color={APP_COLORS.info}
            onPress={() => router.push('/(tabs)/expenses')}
          />
          {(metrics?.low_stock_count ?? 0) > 0 && (
            <StatCard
              label="Stock bajo"
              value={metrics?.low_stock_count ?? 0}
              icon="alert-circle"
              color={APP_COLORS.error}
              onPress={() => router.push('/supplies/index')}
            />
          )}
        </View>

        {metrics?.animals_by_species && metrics.animals_by_species.length > 0 && (
          <Surface style={styles.section} elevation={1}>
            <Text variant="titleSmall" style={styles.sectionTitle}>Animales por especie</Text>
            {metrics.animals_by_species.map((sp) => (
              <View key={sp.code} style={styles.speciesRow}>
                <Text style={styles.speciesEmoji}>{sp.icon ?? '🐾'}</Text>
                <Text variant="bodyMedium" style={styles.speciesName}>{sp.name}</Text>
                <Text variant="titleSmall" style={styles.speciesCount}>{sp.count}</Text>
              </View>
            ))}
          </Surface>
        )}

        {metrics?.recent_events && metrics.recent_events.length > 0 && (
          <Surface style={styles.section} elevation={1}>
            <Text variant="titleSmall" style={styles.sectionTitle}>Actividad reciente</Text>
            {metrics.recent_events.map((ev, i) => {
              const config = ANIMAL_EVENT_TYPES[ev.event_type] ?? ANIMAL_EVENT_TYPES.note;
              return (
                <View key={i} style={styles.eventRow}>
                  <View style={[styles.eventDot, { backgroundColor: config.color }]} />
                  <View style={styles.eventInfo}>
                    <Text variant="bodySmall" style={styles.eventAnimal}>
                      {ev.species_icon ?? '🐾'} {ev.animal_name ?? ev.animal_code}
                    </Text>
                    <Text variant="labelSmall" style={[styles.eventType, { color: config.color }]}>
                      {config.label}
                    </Text>
                  </View>
                  <Text variant="labelSmall" style={styles.eventDate}>{formatDate(ev.event_date)}</Text>
                </View>
              );
            })}
          </Surface>
        )}

        <Text variant="titleSmall" style={[styles.sectionTitle, { marginTop: 4 }]}>Acciones rápidas</Text>
        <View style={styles.quickActions}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.quickBtn}
              onPress={() => router.push(action.route as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.quickIcon, { backgroundColor: action.color + '20' }]}>
                <MaterialCommunityIcons name={action.icon as any} size={22} color={action.color} />
              </View>
              <Text variant="labelSmall" style={styles.quickLabel} numberOfLines={2}>
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const QUICK_ACTIONS = [
  { label: 'Nuevo animal', icon: 'plus-circle', color: APP_COLORS.primary, route: '/animals/new' },
  { label: 'Nuevo gasto', icon: 'cash-plus', color: APP_COLORS.info, route: '/expenses/new' },
  { label: 'Nuevo cultivo', icon: 'sprout', color: '#558B2F', route: '/crops/new' },
  { label: 'Insumos', icon: 'package-variant', color: '#795548', route: '/supplies/index' },
  { label: 'Sectores', icon: 'map-marker', color: '#00838F', route: '/sectors/index' },
  { label: 'Estadísticas', icon: 'chart-line', color: '#6A1B9A', route: '/stats/index' },
];

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: APP_COLORS.background },
  scroll: { flex: 1 },
  container: { padding: 16, gap: 12, paddingBottom: 32 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  farmName: { fontWeight: '800', color: APP_COLORS.primary },
  date: { color: APP_COLORS.textSecondary, textTransform: 'capitalize' },
  statsBtn: { padding: 8 },
  taskCard: { borderRadius: 16, padding: 16, backgroundColor: APP_COLORS.surface },
  taskRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  taskInfo: { flex: 1, gap: 4 },
  taskTitle: { fontWeight: '700', color: APP_COLORS.text },
  taskSubtitle: { color: APP_COLORS.textSecondary },
  taskBtn: { alignSelf: 'flex-start', marginLeft: -8 },
  statsRow: { flexDirection: 'row', gap: 12 },
  section: { borderRadius: 16, padding: 16, backgroundColor: APP_COLORS.surface, gap: 10 },
  sectionTitle: { fontWeight: '700', color: APP_COLORS.text },
  speciesRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: APP_COLORS.border,
  },
  speciesEmoji: { fontSize: 20 },
  speciesName: { flex: 1, color: APP_COLORS.text },
  speciesCount: { fontWeight: '700', color: APP_COLORS.primary },
  eventRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: APP_COLORS.border,
  },
  eventDot: { width: 10, height: 10, borderRadius: 5 },
  eventInfo: { flex: 1 },
  eventAnimal: { color: APP_COLORS.text, fontWeight: '500' },
  eventType: { fontWeight: '600' },
  eventDate: { color: APP_COLORS.textSecondary },
  quickActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  quickBtn: { width: '30%', alignItems: 'center', gap: 6 },
  quickIcon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { textAlign: 'center', color: APP_COLORS.textSecondary },
});
