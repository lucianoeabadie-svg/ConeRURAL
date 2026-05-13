import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { APP_COLORS } from '@/constants/theme';

interface Props {
  label: string;
  value: string | number;
  icon: string;
  color?: string;
  onPress?: () => void;
  small?: boolean;
}

export function StatCard({ label, value, icon, color = APP_COLORS.primary, onPress, small }: Props) {
  const Component = onPress ? TouchableOpacity : View;
  return (
    <Component onPress={onPress} style={[styles.container, small && styles.small]}>
      <Surface style={[styles.surface, small && styles.smallSurface]} elevation={1}>
        <View style={[styles.iconWrap, { backgroundColor: color + '20' }]}>
          <MaterialCommunityIcons name={icon as any} size={small ? 20 : 24} color={color} />
        </View>
        <Text
          variant={small ? 'headlineSmall' : 'headlineMedium'}
          style={[styles.value, { color }]}
        >
          {value}
        </Text>
        <Text variant="labelSmall" style={styles.label} numberOfLines={2}>
          {label}
        </Text>
      </Surface>
    </Component>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  small: { flex: undefined },
  surface: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 6,
    backgroundColor: APP_COLORS.surface,
  },
  smallSurface: {
    padding: 12,
    minWidth: 90,
  },
  iconWrap: {
    borderRadius: 20,
    padding: 8,
  },
  value: {
    fontWeight: '700',
  },
  label: {
    color: APP_COLORS.textSecondary,
    textAlign: 'center',
  },
});
