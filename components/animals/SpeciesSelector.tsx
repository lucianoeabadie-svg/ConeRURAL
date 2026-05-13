import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { APP_COLORS } from '@/constants/theme';
import type { Species } from '@/types';

interface Props {
  species: Species[];
  selected?: string;
  onSelect: (id: string) => void;
}

export function SpeciesSelector({ species, selected, onSelect }: Props) {
  return (
    <View style={styles.grid}>
      {species.map((item) => {
        const isSelected = selected === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.itemWrap}
            onPress={() => onSelect(item.id)}
            activeOpacity={0.7}
          >
            <Surface
              style={[styles.item, isSelected && styles.itemSelected]}
              elevation={isSelected ? 3 : 1}
            >
              <Text style={styles.emoji}>{item.icon ?? '🐾'}</Text>
              <Text
                variant="labelSmall"
                style={[styles.name, isSelected && styles.nameSelected]}
                numberOfLines={2}
                textBreakStrategy="simple"
              >
                {item.name}
              </Text>
            </Surface>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  itemWrap: { width: '31%' },
  item: {
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 6,
    backgroundColor: APP_COLORS.surface,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  itemSelected: {
    borderColor: APP_COLORS.primary,
    backgroundColor: APP_COLORS.primary + '10',
  },
  emoji: { fontSize: 28 },
  name: {
    textAlign: 'center',
    color: APP_COLORS.textSecondary,
  },
  nameSelected: {
    color: APP_COLORS.primary,
    fontWeight: '700',
  },
});
