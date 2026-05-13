import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Surface, Button, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { APP_COLORS } from '@/constants/theme';
import { useCrop, useCropEvents } from '@/hooks/useCrops';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { CROP_STATUSES } from '@/constants/categories';
import { CROP_EVENT_TYPES } from '@/constants/eventTypes';
import { formatDate, formatArea } from '@/utils/formatters';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function CropDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: crop, isLoading, refetch, isRefetching } = useCrop(id);
  const { data: events } = useCropEvents(id);

  if (isLoading) return <LoadingScreen />;
  if (!crop) return null;

  const statusConfig = CROP_STATUSES.find((s) => s.value === crop.status);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[APP_COLORS.primary]} />
        }
      >
        <Surface style={styles.header} elevation={1}>
          <View style={styles.headerTop}>
            <View style={styles.iconWrap}>
              <MaterialCommunityIcons name="sprout" size={32} color={APP_COLORS.primary} />
            </View>
            <View style={styles.headerInfo}>
              <Text variant="headlineSmall" style={styles.name}>{crop.name}</Text>
              <Text variant="bodyMedium" style={styles.type}>
                {crop.plant_type}{crop.variety ? ` · ${crop.variety}` : ''}
              </Text>
              {statusConfig && (
                <Chip compact style={{ backgroundColor: statusConfig.color + '20', alignSelf: 'flex-start' }}
                  textStyle={{ color: statusConfig.color }}>
                  {statusConfig.label}
                </Chip>
              )}
            </View>
          </View>
        </Surface>

        <Surface style={styles.infoGrid} elevation={1}>
          {[
            { label: 'Siembra', value: formatDate(crop.seeding_date) },
            { label: 'Cosecha estimada', value: formatDate(crop.expected_harvest_date) },
            { label: 'Cosecha real', value: formatDate(crop.actual_harvest_date) },
            { label: 'Superficie', value: formatArea(crop.area_m2) },
            { label: 'Plantas', value: crop.plant_count?.toString() ?? '-' },
            { label: 'Sector', value: crop.sector?.name ?? '-' },
          ].map((item) => (
            <View key={item.label} style={styles.infoItem}>
              <Text variant="labelSmall" style={styles.infoLabel}>{item.label}</Text>
              <Text variant="bodyMedium" style={styles.infoValue}>{item.value}</Text>
            </View>
          ))}
        </Surface>

        <Button
          mode="contained-tonal"
          icon="note-plus"
          onPress={() => router.push({ pathname: '/crops/events/new', params: { cropId: id } })}
          style={styles.eventBtn}
        >
          Registrar evento
        </Button>

        <Text variant="titleSmall" style={styles.sectionTitle}>Historial</Text>
        {events?.length === 0 && (
          <Text style={styles.emptyText}>Sin eventos registrados</Text>
        )}
        {events?.map((ev) => {
          const config = CROP_EVENT_TYPES[ev.event_type] ?? CROP_EVENT_TYPES.note;
          return (
            <Surface key={ev.id} style={styles.eventCard} elevation={0}>
              <View style={styles.eventHeader}>
                <MaterialCommunityIcons name={config.icon as any} size={16} color={config.color} />
                <Text variant="labelMedium" style={{ color: config.color, fontWeight: '700' }}>{config.label}</Text>
                <Text variant="labelSmall" style={styles.eventDate}>{formatDate(ev.event_date)}</Text>
              </View>
              <Text variant="bodyMedium">{config.summary(ev as any)}</Text>
              {ev.notes && <Text variant="bodySmall" style={styles.eventNotes}>{ev.notes}</Text>}
            </Surface>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: APP_COLORS.background },
  container: { padding: 16, gap: 12, paddingBottom: 32 },
  header: { borderRadius: 16, padding: 16, backgroundColor: APP_COLORS.surface, gap: 12 },
  headerTop: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  iconWrap: { width: 64, height: 64, borderRadius: 32, backgroundColor: APP_COLORS.primary + '20', alignItems: 'center', justifyContent: 'center' },
  headerInfo: { flex: 1, gap: 6 },
  name: { fontWeight: '800', color: APP_COLORS.text },
  type: { color: APP_COLORS.textSecondary },
  infoGrid: { borderRadius: 16, padding: 16, backgroundColor: APP_COLORS.surface, flexDirection: 'row', flexWrap: 'wrap' },
  infoItem: { width: '50%', paddingVertical: 8, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: APP_COLORS.border },
  infoLabel: { color: APP_COLORS.textSecondary, marginBottom: 2 },
  infoValue: { color: APP_COLORS.text, fontWeight: '500' },
  eventBtn: { borderRadius: 12 },
  sectionTitle: { fontWeight: '700', color: APP_COLORS.text },
  emptyText: { color: APP_COLORS.textSecondary, fontStyle: 'italic', textAlign: 'center', paddingVertical: 16 },
  eventCard: { borderRadius: 10, padding: 12, backgroundColor: APP_COLORS.surface, borderWidth: 1, borderColor: APP_COLORS.border, gap: 4 },
  eventHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  eventDate: { color: APP_COLORS.textSecondary, marginLeft: 'auto' },
  eventNotes: { color: APP_COLORS.textSecondary },
});
