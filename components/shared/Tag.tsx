import React from 'react';
import { StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';

interface Props {
  label: string;
  color?: string;
  icon?: string;
  small?: boolean;
}

export function Tag({ label, color = '#9E9E9E', icon, small }: Props) {
  return (
    <Chip
      mode="flat"
      icon={icon}
      textStyle={[styles.text, small && styles.smallText, { color }]}
      style={[styles.chip, { backgroundColor: color + '20' }]}
      compact={small}
    >
      {label}
    </Chip>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    height: 28,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  smallText: {
    fontSize: 11,
  },
});
