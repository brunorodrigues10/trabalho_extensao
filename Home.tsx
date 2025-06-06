import React, { useState, useEffect } from 'react';
import {View,Text,TextInput,TouchableOpacity,FlatList,Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types/Task';
import { TaskItem } from '../components/TaskItem';
import { styles } from './styles';




export function Home() {
  const TASKS_KEY = '@myapp:tasks';
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);

  async function saveTasksToStorage(tasksToSave: Task[]) {
  try {
    const jsonValue = JSON.stringify(tasksToSave);
    await AsyncStorage.setItem(TASKS_KEY, jsonValue);
  } catch (e) {
    console.error('Erro ao salvar tarefas:', e);
  }
}

async function loadTasksFromStorage() {
  try {
    const jsonValue = await AsyncStorage.getItem(TASKS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Erro ao carregar tarefas:', e);
    return [];
  }
}

useEffect(() => {
  loadTasksFromStorage().then((loadedTasks) => {
    setTasks(loadedTasks);
  });
}, []);

useEffect(() => {
  saveTasksToStorage(tasks);
}, [tasks]);


  function handleAddTask() {
    if (!task.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: task.trim(),
      done: false,
    };

    setTasks(prev => [newTask, ...prev]);
    setTask('');
  }

  function handleToggleDone(id: string) {
    setTasks(prev =>
      prev.map(t =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  }

  function handleRemoveTask(id: string) {
    Alert.alert('Remover', 'Deseja remover essa tarefa?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () =>
          setTasks(prev => prev.filter(t => t.id !== id)),
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tarefas do Dia</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nova tarefa..."
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggleDone={() => handleToggleDone(item.id)}
            onRemove={() => handleRemoveTask(item.id)}
          />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma tarefa</Text>}
      />
    </View>
  );
}
