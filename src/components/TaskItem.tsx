import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Task } from '../types';

interface Props {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onPress: () => void;
}

const priorityColors = {
  low: '#4caf50',
  medium: '#ff9800',
  high: '#f44336',
};

export const TaskItem: React.FC<Props> = ({ task, onToggle, onDelete, onPress }) => {
  const completedCount = task.checklist.filter(i => i.completed).length;
  const totalCount = task.checklist.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.row}>
        <Switch
          value={task.completed}
          onValueChange={onToggle}
          trackColor={{ false: '#555', true: '#4caf50' }}
          thumbColor={task.completed ? '#fff' : '#aaa'}
        />
        <View style={styles.content}>
          <Text style={[styles.title, task.completed && styles.completed]}>{task.title}</Text>
          <Text style={styles.meta}>
            {completedCount}/{totalCount} · {task.priority}
            {task.reminder ? ' · ⏰' : ''}
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: priorityColors[task.priority] }]} />
          </View>
        </View>
        <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
          <Text style={styles.deleteText}>✕</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e1e2e',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  content: { flex: 1, marginLeft: 10 },
  title: { color: '#fff', fontSize: 16, fontWeight: '600' },
  completed: { textDecorationLine: 'line-through', color: '#888' },
  meta: { color: '#888', fontSize: 12, marginTop: 4 },
  progressBar: { height: 4, backgroundColor: '#333', borderRadius: 2, marginTop: 8 },
  progressFill: { height: '100%', borderRadius: 2 },
  deleteBtn: { padding: 6 },
  deleteText: { color: '#f44336', fontSize: 18 },
});