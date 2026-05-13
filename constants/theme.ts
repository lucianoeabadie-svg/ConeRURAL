import { MD3LightTheme } from 'react-native-paper';

export const APP_COLORS = {
  primary: '#5D8A3C',
  primaryDark: '#3d5c27',
  primaryLight: '#8ab86a',
  accent: '#C8873A',
  accentLight: '#e8a85a',
  background: '#F5F0E8',
  surface: '#FFFFFF',
  surfaceVariant: '#EEE8DC',
  error: '#B00020',
  success: '#2E7D32',
  warning: '#F57F17',
  info: '#0277BD',
  text: '#1C1B1F',
  textSecondary: '#6B6B6B',
  border: '#D8D0C4',
  disabled: '#BDBDBD',
  // Status colors
  active: '#2E7D32',
  sold: '#1565C0',
  deceased: '#616161',
  transferred: '#6A1B9A',
  // Event type colors
  weight: '#4CAF50',
  feeding: '#FF9800',
  health_check: '#2196F3',
  vaccination: '#9C27B0',
  medication: '#F44336',
  deworming: '#795548',
  pregnancy: '#E91E63',
  birth: '#FF5722',
  note: '#607D8B',
};

export const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: APP_COLORS.primary,
    onPrimary: '#FFFFFF',
    primaryContainer: '#C5E8A0',
    secondary: APP_COLORS.accent,
    onSecondary: '#FFFFFF',
    background: APP_COLORS.background,
    surface: APP_COLORS.surface,
    surfaceVariant: APP_COLORS.surfaceVariant,
    error: APP_COLORS.error,
  },
};
