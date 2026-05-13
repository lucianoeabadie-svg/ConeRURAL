import 'react-native-reanimated';
import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { queryClient } from '@/lib/queryClient';
import { paperTheme } from '@/constants/theme';
import { useAuthListener } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/useAuthStore';
import { LoadingScreen } from '@/components/shared/LoadingScreen';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={paperTheme}>
          <StatusBar style="auto" />
          <AppContent />
        </PaperProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

function AppContent() {
  useAuthListener();
  const isHydrated = useAuthStore((s) => s.isHydrated);

  if (!isHydrated) return <LoadingScreen message="Iniciando ConeRURAL..." />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="animals/new"
        options={{ headerShown: true, title: 'Nuevo Animal', presentation: 'modal' }}
      />
      <Stack.Screen
        name="animals/[id]"
        options={{ headerShown: true, title: 'Ficha Animal', headerBackTitle: '' }}
      />
      <Stack.Screen
        name="animals/events/new"
        options={{ headerShown: true, title: 'Registrar Evento', presentation: 'modal' }}
      />
      <Stack.Screen
        name="crops/new"
        options={{ headerShown: true, title: 'Nuevo Cultivo', presentation: 'modal' }}
      />
      <Stack.Screen
        name="crops/[id]"
        options={{ headerShown: true, title: 'Cultivo', headerBackTitle: '' }}
      />
      <Stack.Screen
        name="crops/events/new"
        options={{ headerShown: true, title: 'Registrar Evento', presentation: 'modal' }}
      />
      <Stack.Screen
        name="expenses/new"
        options={{ headerShown: true, title: 'Nuevo Gasto', presentation: 'modal' }}
      />
      <Stack.Screen
        name="supplies/index"
        options={{ headerShown: true, title: 'Insumos y Stock' }}
      />
      <Stack.Screen
        name="supplies/new"
        options={{ headerShown: true, title: 'Nuevo Insumo', presentation: 'modal' }}
      />
      <Stack.Screen
        name="supplies/[id]"
        options={{ headerShown: true, title: 'Detalle Insumo' }}
      />
      <Stack.Screen
        name="sectors/index"
        options={{ headerShown: true, title: 'Sectores' }}
      />
      <Stack.Screen
        name="tasks/manage"
        options={{ headerShown: true, title: 'Administrar Tareas' }}
      />
      <Stack.Screen
        name="stats/index"
        options={{ headerShown: true, title: 'Estadísticas' }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
