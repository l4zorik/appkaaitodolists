import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Switch, Alert } from 'react-native';
import { Task, AppScreen } from '../types';
import { TaskItem } from '../components/TaskItem';
import { Header } from '../components/Header';
import { SwipeCard } from '../components/SwipeCard';

interface Props {
  tasks: Task[];
  onAdd: () => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onPress: (task: Task) => void;
  isPremium: boolean;
  adsDisabled: boolean;
  onToggleAds: (disabled: boolean) => void;
  onNavigate: (screen: AppScreen) => void;
}

export const HomeScreen: React.FC<Props> = ({ tasks, onAdd, onToggle, onDelete, onPress, isPremium, adsDisabled, onToggleAds, onNavigate }) => {
  const active = tasks.filter(t => !t.completed);
  const done = tasks.filter(t => t.completed);

  const handleSwipeLeft = () => onNavigate('aiTodo');
  const handleSwipeRight = () => onNavigate('communities');
  const handleDoubleSwipeRight = () => onNavigate('premium');

  return (
    <View style={styles.container}>
      <Header current="home" onNavigate={() => {}} isPremium={isPremium} adCount={adsDisabled ? 0 : 1} />
      <View style={styles.stats}>
        <Stat label="Active" value={active.length} color="#7c3aed" />
        <Stat label="Done" value={done.length} color="#4caf50" />
        <Stat label="Premium" value={isPremium ? 'ON' : 'OFF'} color={isPremium ? '#f59e0b' : '#666'} />
      </View>
      <SwipeCard onSwipeLeft={handleSwipeLeft} onSwipeRight={handleSwipeRight} onDoubleSwipeRight={handleDoubleSwipeRight}>
        <View style={styles.swipeHint}>
          <Text style={styles.swipeText}>← Swipe left for AI ToDo</Text>
          <Text style={styles.swipeText}>Swipe right for Communities →</Text>
          <Text style={styles.swipeText}>Tap to edit task</Text>
        </View>
      </SwipeCard>
      <FlatList
        data={tasks}
        keyExtractor={t => t.id}
        renderItem={({ item }) => (
          <TaskItem task={item} onToggle={() => onToggle(item.id)} onDelete={() => Alert.alert('Delete?', `Delete "${item.title}"?`, [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => onDelete(item.id) }])} onPress={() => onPress(item)} />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No tasks yet. Swipe or tap + to add.</Text>}
        contentContainerStyle={styles.list}
      />
      <View style={styles.bottomBar}>
        {!isPremium && (
          <View style={styles.adsToggle}>
            <Text style={styles.adsToggleText}>Remove ads</Text>
            <Switch value={adsDisabled} onValueChange={onToggleAds} trackColor={{ false: '#555', true: '#4caf50' }} thumbColor={adsDisabled ? '#fff' : '#aaa'} />
          </View>
        )}
        <TouchableOpacity style={styles.fab} onPress={onAdd}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Stat: React.FC<{ label: string; value: string | number; color: string }> = ({ label, value, color }) => (
  <View style={styles.stat}>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  stats: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#333' },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 28, fontWeight: '800' },
  statLabel: { color: '#888', fontSize: 11, marginTop: 2 },
  list: { padding: 16 },
  empty: { color: '#555', textAlign: 'center', marginTop: 60, fontSize: 14 },
  bottomBar: { padding: 16, borderTopWidth: 1, borderTopColor: '#333' },
  adsToggle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  adsToggleText: { color: '#f44336', fontSize: 14 },
  fab: { position: 'absolute', right: 20, bottom: 30, width: 56, height: 56, borderRadius: 28, backgroundColor: '#7c3aed', justifyContent: 'center', alignItems: 'center', elevation: 6, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 28 },
  swipeHint: { padding: 20, alignItems: 'center' },
  swipeText: { color: '#888', fontSize: 14, marginVertical: 4 },
});