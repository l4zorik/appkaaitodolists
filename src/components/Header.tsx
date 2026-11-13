import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AppScreen } from '../types';

interface Props {
  current: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  isPremium: boolean;
  adCount: number;
}

export const Header: React.FC<Props> = ({ current, onNavigate, isPremium, adCount }) => (
  <View style={styles.bar}>
    <Text style={styles.logo}>tudodo</Text>
    <View style={styles.right}>
      {isPremium && <Text style={styles.badge}>PRO</Text>}
      {adCount > 0 && !isPremium && <Text style={styles.adBadge}>ads</Text>}
      {current !== 'home' && (
        <TouchableOpacity onPress={() => onNavigate('home')} style={styles.back}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#16213e', borderBottomWidth: 1, borderBottomColor: '#333' },
  logo: { color: '#7c3aed', fontSize: 22, fontWeight: '800', letterSpacing: 1 },
  right: { flexDirection: 'row', alignItems: 'center' },
  badge: { backgroundColor: '#f59e0b', color: '#000', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, fontWeight: '700', fontSize: 11, overflow: 'hidden' },
  adBadge: { backgroundColor: '#f44336', color: '#fff', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, fontWeight: '700', fontSize: 11, marginRight: 8 },
  back: { marginLeft: 12 },
  backText: { color: '#7c3aed' },
});