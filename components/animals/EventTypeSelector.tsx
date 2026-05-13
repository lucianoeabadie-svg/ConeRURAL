import React from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ANIMAL_EVENT_TYPES } from '@/constants/eventTypes';
import { APP_COLORS } from '@/constants/theme';
import type { AnimalEventType } from '@/types';

interface Props {
  selected?: AnimalEventType;
  onSelect: (type: AnimalEventType) => void;
}

const EVENT_ORDER: AnimalEventType[] = [
  'weight', 'feeding', 'vaccination', 'medication', 'deworming',
  'health_check', 'pregnancy', 'birth', 'sector_change', 'sale', 'death', 'note',
];

export function EventTypeSelector({ selected, onSelect }: Props) {
  return (
    <FlatList
      data={EVENT_ORDER}
      numColumns={3}
      keyExtractor={(item) => item}
      renderItem={({ item }) => {
        const config = ANIMAL_EVENT_TYPES[item];
        const isSelected = selected === item;
        return (
          <TouchableOpacity
            style={styles.itemWrap}
            onPress={() => onSelect(item)}
            activeOpacity={0.7}
          >
            <View style={[styles.item, isSelected && { borderColor: config.color, backgroundColor: config.color + '15' }]}>
              <View style={[styles.iconWrap, { backgroundColor: config.color + '20' }]}>
                <MaterialCommunityIcons name={config.icon as any} size={20} color={config.color} />
              </View>
              <Text
                variant="labelSmall"
                style={[styles.label, isSelected && { color: config.color, fontWeight: '700' }]}
                numberOfLines={2}
                textBreakStrategy="simple"
              >
                {config.label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      }}
      columnWrapperStyle={styles.row}
      scrollEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  row: { gap: 8, marginBottom: 8 },
  itemWrap: { flex: 1 },
  item: {
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    gap: 6,
    backgroundColor: APP_COLORS.surface,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    textAlign: 'center',
    color: APP_COLORS.textSecondary,
  },
});
