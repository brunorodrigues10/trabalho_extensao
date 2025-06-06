import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Task } from '../types/Task';
import { styles } from '../components/styles';
import { Feather } from '@expo/vector-icons';

interface Props {
  task: Task;
  onToggleDone: () => void;
  onRemove: () => void;
}

export function TaskItem({ task, onToggleDone, onRemove }: Props) {
  return (
     <View style={[styles.taskItem, task.done && styles.taskItemDone]}>
      <TouchableOpacity onPress={onToggleDone} style={styles.taskContent}>
        <Text style={[styles.taskText, task.done && styles.taskDone]}>
          {task.title}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onRemove}>
        <Feather name="trash-2" size={20} color="#FF5555" />
      </TouchableOpacity>
    </View>
  );
}
