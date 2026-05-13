import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, FAB, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { APP_COLORS } from '@/constants/theme';
import { useTasks, useCompleteTask, useUncompleteTask } from '@/hooks/useTasks';
import { ChecklistItem } from '@/components/tasks/ChecklistItem';
import { ProgressRing } from '@/components/shared/ProgressRing';
import { EmptyState } from '@/components/shared/EmptyState';
import { OfflineBanner } from '@/components/shared/OfflineBanner';
import type { Task } from '@/types';

const TIME_GROUPS = [
  { key: 'morning', label: '🌅 Mañana' },
  { key: 'afternoon', label: '☀️ Tarde' },
  { key: 'evening', label: '🌙 Noche' },
  { key: 'anytime', label: '📋 En cualquier momento' },
];

export default function TasksScreen() {
  const { data: tasks, isLoading, refetch, isRefetching } = useTasks();
  const { mutate: complete } = useCompleteTask();
  const { mutate: uncomplete } = useUncompleteTask();

  const today = format(new Date(), "EEEE d 'de' MMMM", { locale: es });
  const done = tasks?.filter((t) => t.completion && !t.completion.skipped).length ?? 0;
  const total = tasks?.length ?? 0;

  const handleToggle = (task: Task) => {
    if (task.completion && !task.completion.skipped) {
      uncomplete(task.id);
    } else {
      complete({ taskId: task.id });
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <OfflineBanner />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text variant="headlineSmall" style={styles.title}>Tareas de hoy</Text>
          <Text variant="bodySmall" style={styles.date}>{today}</Text>
        </View>
        <ProgressRing done={done} total={total} size={64} />
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} color={APP_COLORS.primary} />
      ) : !tasks?.length ? (
        <EmptyState
          icon="checkbox-marked-circle-outline"
          title="Sin tareas configuradas"
          subtitle="Creá tu primer rutina diaria"
          actionLabel="Configurar tareas"
          onAction={() => router.push('/tasks/manage')}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[APP_COLORS.primary]} />
          }
        >
          {TIME_GROUPS.map(({ key, label }) => {
            const group = tasks.filter((t) => t.time_of_day === key);
            if (group.length === 0) return null;
            return (
              <View key={key} style={styles.group}>
                <Text variant="titleSmall" style={styles.groupLabel}>{label}</Text>
                <View style={styles.groupItems}>
                  {group.map((task) => (
                    <ChecklistItem key={task.id} task={task} onToggle={handleToggle} />
                  ))}
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}

      <FAB
        icon="cog"
        style={styles.fab}
        onPress={() => router.push('/tasks/manage')}
        color="#fff"
        label="Administrar"
        small
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: APP_COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 8,
  },
  headerLeft: { flex: 1, gap: 2 },
  title: { fontWeight: '800', color: APP_COLORS.primary },
  date: { color: APP_COLORS.textSecondary, textTransform: 'capitalize' },
  loader: { marginTop: 40 },
  container: { paddingHorizontal: 16, paddingBottom: 80, gap: 16 },
  group: { gap: 4 },
  groupLabel: { fontWeight: '700', color: APP_COLORS.textSecondary, marginBottom: 4 },
  groupItems: {
    backgroundColor: APP_COLORS.surface,
    borderRadius: 12,
    paddingLeft: 8,
    overflow: 'hidden',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: APP_COLORS.primary,
  },
});
