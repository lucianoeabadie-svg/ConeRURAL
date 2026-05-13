import React, { useState } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, FAB, Surface, Button, IconButton, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_COLORS } from '@/constants/theme';
import { useTasks, useCreateTask, useDeleteTask } from '@/hooks/useTasks';
import { useSectors } from '@/hooks/useSectors';
import { useAuthStore } from '@/store/useAuthStore';
import { EmptyState } from '@/components/shared/EmptyState';
import { TASK_CATEGORIES } from '@/constants/categories';
import type { Task } from '@/types';

const TIME_LABELS: Record<string, string> = {
  morning: '🌅 Mañana',
  afternoon: '☀️ Tarde',
  evening: '🌙 Noche',
  anytime: '📋 Cualquier momento',
};

export default function ManageTasksScreen() {
  const ownerId = useAuthStore((s) => s.user?.id ?? '');
  const { data: tasks } = useTasks();
  const { data: sectors } = useSectors();
  const { mutate: createTask, isPending } = useCreateTask();
  const { mutate: deleteTask } = useDeleteTask();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [timeOfDay, setTimeOfDay] = useState<Task['time_of_day']>('anytime');

  const handleCreate = () => {
    if (!title.trim()) return;
    createTask(
      {
        owner_id: ownerId,
        title: title.trim(),
        description: null,
        frequency: 'daily',
        frequency_days: null,
        time_of_day: timeOfDay,
        category: null,
        linked_sector_id: null,
        linked_animal_id: null,
        linked_crop_id: null,
        is_active: true,
        sort_order: tasks?.length ?? 0,
      },
      {
        onSuccess: () => {
          setTitle('');
          setShowForm(false);
        },
      }
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !showForm ? (
            <EmptyState
              icon="checkbox-blank-circle-outline"
              title="Sin tareas configuradas"
              subtitle="Creá tu primera rutina diaria"
            />
          ) : null
        }
        ListHeaderComponent={
          showForm ? (
            <Surface style={styles.form} elevation={1}>
              <Text variant="titleSmall" style={styles.formTitle}>Nueva tarea</Text>
              <TextInput
                label="Título de la tarea"
                value={title}
                onChangeText={setTitle}
                mode="outlined"
                style={styles.input}
              />
              <Text variant="labelMedium" style={styles.label}>Momento del día</Text>
              <View style={styles.timeRow}>
                {Object.entries(TIME_LABELS).map(([key, label]) => (
                  <Button
                    key={key}
                    mode={timeOfDay === key ? 'contained' : 'outlined'}
                    onPress={() => setTimeOfDay(key as Task['time_of_day'])}
                    compact
                    style={styles.timeBtn}
                  >
                    {label}
                  </Button>
                ))}
              </View>
              <View style={styles.formBtns}>
                <Button mode="outlined" onPress={() => setShowForm(false)}>Cancelar</Button>
                <Button mode="contained" onPress={handleCreate} loading={isPending} disabled={!title.trim() || isPending}>
                  Crear tarea
                </Button>
              </View>
            </Surface>
          ) : null
        }
        renderItem={({ item }) => (
          <Surface style={styles.taskItem} elevation={1}>
            <View style={styles.taskInfo}>
              <Text variant="bodyLarge" style={styles.taskTitle}>{item.title}</Text>
              <Text variant="labelSmall" style={styles.taskMeta}>
                {TIME_LABELS[item.time_of_day]} · {item.frequency === 'daily' ? 'Diaria' : item.frequency}
              </Text>
            </View>
            <IconButton
              icon="delete"
              size={20}
              iconColor={APP_COLORS.error}
              onPress={() => deleteTask(item.id)}
            />
          </Surface>
        )}
      />

      {!showForm && (
        <FAB
          icon="plus"
          label="Nueva tarea"
          style={styles.fab}
          onPress={() => setShowForm(true)}
          color="#fff"
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: APP_COLORS.background },
  list: { padding: 16, paddingBottom: 80, gap: 8 },
  form: { borderRadius: 16, padding: 16, backgroundColor: APP_COLORS.surface, marginBottom: 8, gap: 12 },
  formTitle: { fontWeight: '700', color: APP_COLORS.text },
  input: {},
  label: { color: APP_COLORS.textSecondary },
  timeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  timeBtn: {},
  formBtns: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    backgroundColor: APP_COLORS.surface,
  },
  taskInfo: { flex: 1 },
  taskTitle: { color: APP_COLORS.text, fontWeight: '500' },
  taskMeta: { color: APP_COLORS.textSecondary },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: APP_COLORS.primary },
});
