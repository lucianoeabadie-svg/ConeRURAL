import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Checkbox } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { APP_COLORS } from '@/constants/theme';
import type { Task } from '@/types';

interface Props {
  task: Task;
  onToggle: (task: Task) => void;
}

export function ChecklistItem({ task, onToggle }: Props) {
  const isCompleted = !!(task.completion && !task.completion.skipped);
  const isSkipped = !!(task.completion?.skipped);

  return (
    <TouchableOpacity
      onPress={() => onToggle(task)}
      activeOpacity={0.7}
      style={[styles.container, isCompleted && styles.completed, isSkipped && styles.skipped]}
    >
      <Checkbox
        status={isCompleted ? 'checked' : 'unchecked'}
        color={APP_COLORS.primary}
        uncheckedColor={APP_COLORS.border}
      />
      <View style={styles.content}>
        <Text
          variant="bodyLarge"
          style={[styles.title, (isCompleted || isSkipped) && styles.doneText]}
          numberOfLines={2}
        >
          {task.title}
        </Text>
        {task.description && (
          <Text variant="bodySmall" style={styles.desc} numberOfLines={1}>
            {task.description}
          </Text>
        )}
        {task.sector && (
          <View style={styles.tag}>
            <MaterialCommunityIcons name="map-marker" size={12} color={APP_COLORS.textSecondary} />
            <Text variant="labelSmall" style={styles.tagText}>{task.sector.name}</Text>
          </View>
        )}
      </View>
      {isSkipped && (
        <Text variant="labelSmall" style={styles.skipLabel}>Omitida</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingRight: 16,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.border,
    minHeight: 60,
  },
  completed: {
    backgroundColor: APP_COLORS.primary + '08',
  },
  skipped: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: APP_COLORS.text,
  },
  doneText: {
    textDecorationLine: 'line-through',
    color: APP_COLORS.textSecondary,
  },
  desc: {
    color: APP_COLORS.textSecondary,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  tagText: {
    color: APP_COLORS.textSecondary,
  },
  skipLabel: {
    color: APP_COLORS.textSecondary,
    fontStyle: 'italic',
  },
});
