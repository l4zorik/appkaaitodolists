import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Switch, Alert } from 'react-native';
import { Task, ChecklistItem } from '../types';
import { TaskItem } from '../components/TaskItem';
import { Header } from '../components/Header';
import { v4 as uuid } from 'uuid';

interface Props {
  tasks: Task[];
  isPremium: boolean;
  onAddTask: () => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onPressTask: (task: Task) => void;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export const AIToDoScreen: React.FC<Props> = ({ tasks, isPremium, onAddTask, onToggleTask, onDeleteTask, onPressTask, onSwipeLeft, onSwipeRight }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [tags, setTags] = useState('');
  const [reminder, setReminder] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const handleAI = async () => {
    if (!isPremium) {
      Alert.alert('Premium', 'Upgrade for AI checklist');
      return;
    }
    if (!title.trim()) return;
    setAiLoading(true);
    try {
      const items = await generateChecklistAI({ title, description });
      setChecklist(items);
    } catch (e: any) {
      Alert.alert('AI Error', e.message);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSave = () => {
    if (!title.trim()) return;
    const now = Date.now();
    const t: Task = {
      id: uuid(),
      title: title.trim(),
      description: description.trim(),
      priority,
      checklist: checklist.filter(i => i.text.trim()),
      createdAt: now,
      updatedAt: now,
      completed: false,
      tags: tags.split(',').map(s => s.trim()).filter(Boolean),
      reminder: reminder ? new Date(reminder).getTime() : null,
    };
    onAddTask();
    setTitle('');
    setDescription('');
    setChecklist([]);
    setTags('');
    setReminder('');
  };

  const toggleItem = (itemId: string) => {
    setChecklist(prev => prev.map(i => (i.id === itemId ? { ...i, completed: !i.completed } : i)));
  };

  return (
    <View style={styles.container}>
      <Header current="aiTodo" onNavigate={onSwipeLeft} isPremium={isPremium} adCount={0} />
      <FlatList
        data={tasks}
        keyExtractor={t => t.id}
        renderItem={({ item }) => (
          <TaskItem task={item} onToggle={() => onToggleTask(item.id)} onDelete={() => onDeleteTask(item.id)} onPress={() => onPressTask(item)} />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No tasks yet. Add one below.</Text>}
        contentContainerStyle={styles.list}
      />
      <View style={styles.inputArea}>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Task title..." placeholderTextColor="#666" />
        <TextInput style={[styles.input, styles.multiline]} value={description} onChangeText={setDescription} placeholder="Description..." placeholderTextColor="#666" multiline numberOfLines={2} />
        <View style={styles.row}>
          {(['low', 'medium', 'high'] as const).map(p => (
            <TouchableOpacity key={p} style={[styles.pill, priority === p && styles.pillActive]} onPress={() => setPriority(p)}>
              <Text style={[styles.pillText, priority === p && styles.pillTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput style={styles.input} value={tags} onChangeText={setTags} placeholder="Tags..." placeholderTextColor="#666" />
        <TextInput style={styles.input} value={reminder} onChangeText={setReminder} placeholder="Reminder (ISO)" placeholderTextColor="#666" />
        <TouchableOpacity style={styles.aiBtn} onPress={handleAI} disabled={aiLoading}>
          <Text style={styles.aiBtnText}>{aiLoading ? 'AI thinking...' : '🤖 AI Checklist'}</Text>
        </TouchableOpacity>
        {checklist.length > 0 && (
          <View style={styles.checklist}>
            {checklist.map(item => (
              <TouchableOpacity key={item.id} style={styles.checkItem} onPress={() => toggleItem(item.id)}>
                <Text style={styles.checkText}>{item.completed ? '✅' : '⬜'} {item.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Add Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

async function generateChecklistAI(task: { title: string; description: string }): Promise<ChecklistItem[]> {
  const prompt = `Task: ${task.title}\nDescription: ${task.description}\n\nGenerate 5-8 actionable checklist items.`;
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer sk-demo' },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], temperature: 0.7, max_tokens: 400 }),
    });
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content ?? '';
    return content.split('\n').filter((l: string) => l.trim().startsWith('-')).map((l: string, i: number) => ({
      id: uuid(),
      text: l.trim().replace(/^[-*]\s*/, ''),
      completed: false,
    }));
  } catch {
    return [{ id: uuid(), text: 'Step 1', completed: false }, { id: uuid(), text: 'Step 2', completed: false }];
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  list: { padding: 16 },
  empty: { color: '#555', textAlign: 'center', marginTop: 60, fontSize: 14 },
  inputArea: { padding: 16, borderTopWidth: 1, borderTopColor: '#333' },
  input: { backgroundColor: '#1a1a2e', color: '#fff', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#333', fontSize: 15 },
  multiline: { height: 60, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: 8, marginTop: 8 },
  pill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#1a1a2e', borderWidth: 1, borderColor: '#333' },
  pillActive: { backgroundColor: '#7c3aed', borderColor: '#7c3aed' },
  pillText: { color: '#888', fontSize: 13 },
  pillTextActive: { color: '#fff', fontWeight: '600' },
  aiBtn: { backgroundColor: '#7c3aed', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 12 },
  aiBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  checklist: { marginTop: 12 },
  checkItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  checkText: { color: '#ddd', fontSize: 14 },
  saveBtn: { backgroundColor: '#4caf50', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 16 },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});