import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity,
} from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_COLORS } from '@/constants/theme';
import { loginSchema } from '@/utils/validators';
import { FormField } from '@/components/shared/FormField';
import { signIn } from '@/hooks/useAuth';
import { speciesService } from '@/services/species.service';
import type { z } from 'zod';

type FormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: FormData) => {
    setError('');
    setLoading(true);
    try {
      const userId = await signIn(data.email, data.password);
      if (userId) {
        // Seedear especies en background, sin bloquear la navegación
        speciesService.seedDefaults(userId).catch(() => {});
      }
      router.replace('/(tabs)');
    } catch (e: any) {
      setError('Email o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.logo}>🌿</Text>
            <Text variant="headlineLarge" style={styles.title}>ConeRURAL</Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Gestión inteligente de tu chacra
            </Text>
          </View>

          <View style={styles.form}>
            <Text variant="titleLarge" style={styles.formTitle}>Iniciar sesión</Text>
            <FormField
              control={control}
              name="email"
              label="Email"
              keyboardType="email-address"
            />
            <FormField
              control={control}
              name="password"
              label="Contraseña"
              secureTextEntry
            />
            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}
            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              disabled={loading}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Ingresar
            </Button>
          </View>

          <TouchableOpacity onPress={() => router.push('/auth/register')} style={styles.link}>
            <Text variant="bodyMedium" style={styles.linkText}>
              ¿No tenés cuenta?{' '}
              <Text style={styles.linkBold}>Registrate</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: APP_COLORS.background },
  flex: { flex: 1 },
  container: { flexGrow: 1, padding: 24, justifyContent: 'center', gap: 32 },
  header: { alignItems: 'center', gap: 8 },
  logo: { fontSize: 64 },
  title: { fontWeight: '800', color: APP_COLORS.primary },
  subtitle: { color: APP_COLORS.textSecondary, textAlign: 'center' },
  form: { gap: 16 },
  formTitle: { fontWeight: '700', color: APP_COLORS.text },
  errorText: { color: APP_COLORS.error, fontSize: 14 },
  button: { marginTop: 8 },
  buttonContent: { paddingVertical: 6 },
  link: { alignItems: 'center' },
  linkText: { color: APP_COLORS.textSecondary },
  linkBold: { color: APP_COLORS.primary, fontWeight: '700' },
});
