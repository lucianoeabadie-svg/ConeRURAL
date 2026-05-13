import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Circle } from 'react-native-svg';
import { APP_COLORS } from '@/constants/theme';

interface Props {
  done: number;
  total: number;
  size?: number;
}

export function ProgressRing({ done, total, size = 80 }: Props) {
  const percent = total > 0 ? done / total : 0;
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percent);
  const center = size / 2;
  const color = percent === 1 ? APP_COLORS.success : percent > 0.5 ? APP_COLORS.accent : APP_COLORS.primary;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={APP_COLORS.border}
          strokeWidth={8}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={8}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation={-90}
          origin={`${center}, ${center}`}
        />
      </Svg>
      <View style={[styles.label, { width: size, height: size }]}>
        <Text variant="titleMedium" style={[styles.value, { color }]}>
          {done}/{total}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  label: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontWeight: '700',
  },
});
