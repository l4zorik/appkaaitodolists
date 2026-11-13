import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Header } from '../components/Header';

interface Props {
  isPremium: boolean;
  adsDisabled: boolean;
  onToggleAds: (disabled: boolean) => void;
  onBack: () => void;
  onNavigate: (screen: any) => void;
}

export const SettingsScreen: React.FC<Props> = ({ isPremium, adsDisabled, onToggleAds, onBack, onNavigate }) => (
  <View style={styles.container}>
    <Header current="settings" onNavigate={onBack} isPremium={isPremium} adCount={adsDisabled ? 0 : 1} />
    <View style={styles.body}>
      <Text style={styles.section}>Settings</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Disable ads</Text>
        <Switch value={adsDisabled} onValueChange={onToggleAds} trackColor={{ false: '#555', true: '#4caf50' }} thumbColor={adsDisabled ? '#fff' : '#aaa'} />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Premium</Text>
        <Text style={[styles.value, isPremium ? { color: '#f59e0b' } : { color: '#666' }]}>{isPremium ? 'Active' : 'Inactive'}</Text>
      </View>

      <TouchableOpacity style={styles.navBtn} onPress={() => onNavigate('security')}>
        <Text style={styles.navBtnText}>🔒 Security</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navBtn} onPress={() => onNavigate('codeReview')}>
        <Text style={styles.navBtnText}>🤖 Code Review</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navBtn} onPress={() => onBack()}>
        <Text style={styles.navBtnText}>← Back to Home</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  body: { padding: 20 },
  section: { color: '#7c3aed', fontSize: 18, fontWeight: '800', marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#333' },
  label: { color: '#ccc', fontSize: 15 },
  value: { fontSize: 15, fontWeight: '600' },
  navBtn: { marginTop: 20, padding: 14, backgroundColor: '#7c3aed', borderRadius: 10, alignItems: 'center' },
  navBtnText: { color: '#fff', fontWeight: '700' },
});