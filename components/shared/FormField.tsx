import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { APP_COLORS } from '@/constants/theme';

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  secureTextEntry?: boolean;
  right?: React.ReactNode;
}

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  multiline,
  keyboardType = 'default',
  secureTextEntry,
  right,
}: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View>
          <TextInput
            label={label}
            value={value?.toString() ?? ''}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            multiline={multiline}
            numberOfLines={multiline ? 3 : 1}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            mode="outlined"
            error={!!error}
            right={right}
            style={multiline ? styles.multiline : undefined}
          />
          {error && (
            <HelperText type="error" visible={!!error}>
              {error.message}
            </HelperText>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  multiline: {
    minHeight: 80,
  },
});
