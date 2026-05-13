import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Surface, ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { APP_COLORS } from '@/constants/theme';
import { CROP_STATUSES } from '@/constants/categories';
import { formatDate, formatArea } from '@/utils/formatters';
import { differenceInDays, parseISO } from 'date-fns';
import type { Crop } from '@/types';

interface Props {
  crop: Crop;
}

export function CropCard({ crop }: Props) {
  const statusConfig = CROP_STATUSES.find((s) => s.value === crop.status);
  const progress = getHarvestProgress(crop);

  return (
    <TouchableOpacity
      onPress={() => router.push(`/crops/${crop.id}`)}
      activeOpacity={0.7}
    >
      <Surface style={styles.card} elevation={1}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <MaterialCommunityIcons name="sprout" size={20} color={APP_COLORS.primary} />
            <Text variant="titleSmall" style={styles.name}>{crop.name}</Text>
          </View>
          {statusConfig && (
            <View style={[styles.statusBadge, { backgroundColor: statusConfig.color + '20' }]}>
              <Text variant="labelSmall" style={{ color: statusConfig.color }}>
                {statusConfig.label}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.meta}>
          <Text variant="bodySmall" style={styles.metaText}>
            {crop.plant_type}{crop.variety ? ` · ${crop.variety}` : ''}
          </Text>
          {crop.area_m2 && (
            <Text variant="bodySmall" style={styles.metaText}>· {formatArea(crop.area_m2)}</Text>
          )}
        </View>
        {crop.seeding_date && (
          <Text variant="labelSmall" style={styles.date}>
            Siembra: {formatDate(crop.seeding_date)}
            {crop.expected_harvest_date && ` → Cosecha: ${formatDate(crop.expected_harvest_date)}`}
          </Text>
        )}
        {crop.status === 'active' && progress !== null && (
          <View style={styles.progressRow}>
            <ProgressBar progress={progress} color={APP_COLORS.primary} style={styles.progress} />
            <Text variant="labelSmall" style={styles.progressLabel}>
              {Math.round(progress * 100)}%
            </Text>
          </View>
        )}
      </Surface>
    </TouchableOpacity>
  );
}

function getHarvestProgress(crop: Crop): number | null {
  if (!crop.seeding_date || !crop.expected_harvest_date) return null;
  try {
    const start = parseISO(crop.seeding_date);
    const end = parseISO(crop.expected_harvest_date);
    const now = new Date();
    const total = differenceInDays(end, start);
    const elapsed = differenceInDays(now, start);
    if (total <= 0) return null;
    return Math.min(1, Math.max(0, elapsed / total));
  } catch {
    return null;
  }
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 14,
    backgroundColor: APP_COLORS.surface,
    gap: 6,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  name: { fontWeight: '700', color: APP_COLORS.text, flex: 1 },
  statusBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  meta: { flexDirection: 'row', gap: 4 },
  metaText: { color: APP_COLORS.textSecondary },
  date: { color: APP_COLORS.textSecondary },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  progress: { flex: 1, height: 6, borderRadius: 3 },
  progressLabel: { color: APP_COLORS.primary, fontWeight: '700', width: 36 },
});
