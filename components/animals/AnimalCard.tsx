import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { APP_COLORS } from '@/constants/theme';
import { ANIMAL_STATUSES } from '@/constants/categories';
import { formatWeight, formatAge } from '@/utils/formatters';
import type { Animal } from '@/types';

interface Props {
  animal: Animal;
}

export function AnimalCard({ animal }: Props) {
  const statusConfig = ANIMAL_STATUSES.find((s) => s.value === animal.status);
  const displayName = animal.name || animal.animal_code;

  return (
    <TouchableOpacity
      onPress={() => router.push(`/animals/${animal.id}`)}
      activeOpacity={0.7}
    >
      <Surface style={styles.card} elevation={1}>
        <View style={styles.iconWrap}>
          <Text style={styles.emoji}>{animal.species?.icon ?? '🐾'}</Text>
        </View>
        <View style={styles.info}>
          <View style={styles.row}>
            <Text variant="titleSmall" style={styles.code}>{animal.animal_code}</Text>
            {statusConfig && (
              <View style={[styles.statusDot, { backgroundColor: statusConfig.color + '20' }]}>
                <View style={[styles.dot, { backgroundColor: statusConfig.color }]} />
                <Text variant="labelSmall" style={{ color: statusConfig.color }}>
                  {statusConfig.label}
                </Text>
              </View>
            )}
          </View>
          {animal.name && (
            <Text variant="bodyMedium" style={styles.name} numberOfLines={1}>{animal.name}</Text>
          )}
          <View style={styles.meta}>
            <Text variant="bodySmall" style={styles.metaText}>
              {animal.species?.name ?? 'Animal'}
            </Text>
            {animal.sector && (
              <>
                <Text style={styles.sep}>·</Text>
                <Text variant="bodySmall" style={styles.metaText} numberOfLines={1}>
                  {animal.sector.name}
                </Text>
              </>
            )}
            {animal.birth_date && (
              <>
                <Text style={styles.sep}>·</Text>
                <Text variant="bodySmall" style={styles.metaText}>
                  {formatAge(animal.birth_date)}
                </Text>
              </>
            )}
          </View>
        </View>
        <View style={styles.right}>
          {animal.weight_kg != null && (
            <Text variant="labelMedium" style={styles.weight}>{formatWeight(animal.weight_kg)}</Text>
          )}
          <MaterialCommunityIcons name="chevron-right" size={20} color={APP_COLORS.border} />
        </View>
      </Surface>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 12,
    backgroundColor: APP_COLORS.surface,
    gap: 12,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: APP_COLORS.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 24 },
  info: { flex: 1, gap: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  code: { fontWeight: '700', color: APP_COLORS.primary },
  name: { color: APP_COLORS.text },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' },
  metaText: { color: APP_COLORS.textSecondary },
  sep: { color: APP_COLORS.border },
  statusDot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  right: { alignItems: 'flex-end', gap: 4 },
  weight: { color: APP_COLORS.textSecondary },
});
