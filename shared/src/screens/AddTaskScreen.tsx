import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Task, ChecklistItem } from '../types';
import { Header } from '../components/Header';
import { v4 as uuid } from 'uuid';

interface Props {
  task?: Task;
  onSave: (task: Task) => void;
  onCancel: () => void;
}

export const AddTaskScreen: React.FC<Props> = ({ task, onSave, onCancel }) => {
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [priority, setPriority] = useState<Task['priority']>(task?.priority ?? 'medium');
  const [checklist, setChecklist] = useState<ChecklistItem[]>(task?.checklist ?? []);
  const [tags, setTags] = useState(task?.tags?.join(', ') ?? '');
  const [reminder, setReminder] = useState<string>(task?.reminder ? new Date(task.reminder).toISOString().slice(0, 16) : '');

  const addChecklistItem = () => {
    setChecklist(prev => [...prev, { id: uuid(), text: '', completed: false }]);
  };

  const updateChecklistItem = (id: string, text: string) => {
    setChecklist(prev => prev.map(i => (i.id === id ? { ...i, text } : i)));
  };

  const handleSave = () => {
    if (!title.trim()) return;
    const now = Date.now();
    const t: Task = {
      id: task?.id ?? uuid(),
      title: title.trim(),
      description: description.trim(),
      priority,
      checklist: checklist.filter(i => i.text.trim()),
      createdAt: task?.createdAt ?? now,
      updatedAt: now,
      completed: task?.completed ?? false,
      tags: tags.split(',').map(s => s.trim()).filter(Boolean),
      reminder: reminder ? new Date(reminder).getTime() : null,
    };
    onSave(t);
  };

  return (
    <View style={styles.container}>
      <Header current="addTask" onNavigate={onCancel} isPremium={false} adCount={0} />
      <View style={styles.body}>
        <Text style={styles.label}>Title</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="What needs to be done?" placeholderTextColor="#666" />

        <Text style={styles.label}>Description</Text>
        <TextInput style={[styles.input, styles.multiline]} value={description} onChangeText={setDescription} placeholder="Details..." placeholderTextColor="#666" multiline numberOfLines={3} />

        <Text style={styles.label}>Priority</Text>
        <View style={styles.row}>
          {(['low', 'medium', 'high'] as const).map(p => (
            <TouchableOpacity key={p} style={[styles.pill, priority === p && styles.pillActive]} onPress={() => setPriority(p)}>
              <Text style={[styles.pillText, priority === p && styles.pillTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Checklist</Text>
        {checklist.map(item => (
          <TextInput key={item.id} style={styles.checklistInput} value={item.text} onChangeText={text => updateChecklistItem(item.id, text)} placeholder="Step..." placeholderTextColor="#666" />
        ))}
        <TouchableOpacity style={styles.addItemBtn} onPress={addChecklistItem}>
          <Text style={styles.addItemBtnText}>+ Add item</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Reminder (ISO datetime)</Text>
        <TextInput style={styles.input} value={reminder} onChangeText={setReminder} placeholder="2026-10-10T14:00" placeholderTextColor="#666" />

        <Text style={styles.label}>Tags (comma separated)</Text>
        <TextInput style={styles.input} value={tags} onChangeText={setTags} placeholder="work, urgent" placeholderTextColor="#666" />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>{task ? 'Update' : 'Create'} Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  body: { flex: 1, padding: 16 },
  label: { color: '#888', fontSize: 12, marginTop: 14, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 },
  input: { backgroundColor: '#1a1a2e', color: '#fff', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#333', fontSize: 15 },
  multiline: { height: 80, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: 8 },
  pill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#1a1a2e', borderWidth: 1, borderColor: '#333' },
  pillActive: { backgroundColor: '#7c3aed', borderColor: '#7c3aed' },
  pillText: { color: '#888', fontSize: 13 },
  pillTextActive: { color: '#fff', fontWeight: '600' },
  checklistInput: { backgroundColor: '#1a1a2e', color: '#fff', borderRadius: 8, padding: 10, borderWidth: 1, borderColor: '#333', marginBottom: 6 },
  addItemBtn: { padding: 10, alignItems: 'center' },
  addItemBtnText: { color: '#7c3aed' },
  saveBtn: { backgroundColor: '#4caf50', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 20 },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});