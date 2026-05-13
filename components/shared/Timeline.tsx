import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { APP_COLORS } from '@/constants/theme';
import { ANIMAL_EVENT_TYPES } from '@/constants/eventTypes';
import { formatDate } from '@/utils/formatters';
import type { AnimalEvent } from '@/types';

interface Props {
  events: AnimalEvent[];
  onEventPress?: (event: AnimalEvent) => void;
}

export function Timeline({ events, onEventPress }: Props) {
  if (events.length === 0) {
    return (
      <View style={styles.empty}>
        <Text variant="bodyMedium" style={{ color: APP_COLORS.textSecondary }}>
          Sin eventos registrados
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <TimelineItem
          event={item}
          isLast={index === events.length - 1}
          onPress={onEventPress ? () => onEventPress(item) : undefined}
        />
      )}
      scrollEnabled={false}
    />
  );
}

function TimelineItem({
  event,
  isLast,
  onPress,
}: {
  event: AnimalEvent;
  isLast: boolean;
  onPress?: () => void;
}) {
  const config = ANIMAL_EVENT_TYPES[event.event_type] ?? ANIMAL_EVENT_TYPES.note;
  const summary = config.summary(event as any);

  return (
    <View style={styles.itemRow}>
      <View style={styles.lineCol}>
        <View style={[styles.dot, { backgroundColor: config.color }]} />
        {!isLast && <View style={styles.line} />}
      </View>
      <Surface style={styles.card} elevation={0} onTouchEnd={onPress}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name={config.icon as any} size={16} color={config.color} />
          <Text variant="labelMedium" style={[styles.typeLabel, { color: config.color }]}>
            {config.label}
          </Text>
          <Text variant="labelSmall" style={styles.date}>{formatDate(event.event_date)}</Text>
        </View>
        <Text variant="bodyMedium" style={styles.summary}>{summary}</Text>
        {event.notes && (
          <Text variant="bodySmall" style={styles.notes} numberOfLines={2}>
            {event.notes}
          </Text>
        )}
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  lineCol: {
    width: 28,
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 14,
    zIndex: 1,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: APP_COLORS.border,
    marginTop: 2,
  },
  card: {
    flex: 1,
    marginLeft: 8,
    marginBottom: 8,
    borderRadius: 10,
    padding: 12,
    backgroundColor: APP_COLORS.surface,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  typeLabel: {
    fontWeight: '600',
    flex: 1,
  },
  date: {
    color: APP_COLORS.textSecondary,
  },
  summary: {
    color: APP_COLORS.text,
    fontWeight: '500',
  },
  notes: {
    color: APP_COLORS.textSecondary,
    marginTop: 2,
  },
});
