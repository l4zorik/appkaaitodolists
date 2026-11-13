import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Community } from '../types';
import { Header } from '../components/Header';

interface Props {
  communities: Community[];
  isPremium: boolean;
  onSubscribe: (community: Community) => void;
  onUnsubscribe: (communityId: string) => void;
  onBack: () => void;
}

export const CommunitiesScreen: React.FC<Props> = ({ communities, isPremium, onSubscribe, onUnsubscribe, onBack }) => {
  const lockedCommunities = communities.filter(c => c.price >= 5);
  const regularCommunities = communities.filter(c => c.price < 5);

  const renderCommunity = ({ item }: { item: Community }) => (
    <View style={[styles.card, item.price >= 5 && styles.lockedCard]}>
      {item.price >= 5 && <Text style={styles.lockedBadge}>🔒 LOCKED</Text>}
      <Text style={styles.icon}>{item.icon}</Text>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.desc}>{item.description}</Text>
      <View style={styles.meta}>
        <Text style={styles.metaText}>👥 {item.members}</Text>
        <Text style={styles.metaText}>⭐ {item.rating}</Text>
      </View>
      <View style={styles.priceRow}>
        <Text style={styles.priceText}>{item.plans.monthly} {item.currency}/mo</Text>
        <Text style={styles.yearlyText}>or {item.plans.yearly} {item.currency}/yr</Text>
      </View>
      <View style={styles.features}>
        {item.features.map((f, i) => (
          <Text key={i} style={styles.feature}>• {f}</Text>
        ))}
      </View>
      <View style={styles.btnRow}>
        <TouchableOpacity
          style={[styles.subscribeBtn, item.isSubscribed && styles.unsubscribeBtn]}
          onPress={() => {
            if (item.isSubscribed) {
              onUnsubscribe(item.id);
            } else {
              onSubscribe(item);
            }
          }}
        >
          <Text style={styles.subscribeBtnText}>{item.isSubscribed ? 'Unsubscribe' : 'Subscribe Monthly'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.yearlyBtn}
          onPress={() => {
            if (item.isSubscribed) {
              onUnsubscribe(item.id);
            } else {
              onSubscribe(item);
            }
          }}
        >
          <Text style={styles.yearlyBtnText}>Subscribe Yearly — {item.plans.yearly} {item.currency}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header current="communities" onNavigate={onBack} isPremium={isPremium} adCount={0} />
      <Text style={styles.sectionTitle}>🔓 Regular Communities</Text>
      <FlatList
        data={regularCommunities}
        keyExtractor={c => c.id}
        renderItem={renderCommunity}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No regular communities.</Text>}
      />
      <Text style={styles.sectionTitle}>🔒 Premium Communities (Double-swipe right)</Text>
      <FlatList
        data={lockedCommunities}
        keyExtractor={c => c.id}
        renderItem={renderCommunity}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No premium communities.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  list: { padding: 16 },
  empty: { color: '#555', textAlign: 'center', marginTop: 60, fontSize: 14 },
  card: { backgroundColor: '#1e1e2e', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#333' },
  lockedCard: { borderColor: '#f59e0b', borderWidth: 2, opacity: 0.8 },
  lockedBadge: { color: '#f59e0b', fontSize: 12, fontWeight: '700', marginBottom: 4 },
  icon: { fontSize: 32, marginBottom: 8 },
  name: { color: '#fff', fontSize: 18, fontWeight: '700' },
  desc: { color: '#888', fontSize: 13, marginTop: 4 },
  meta: { flexDirection: 'row', gap: 12, marginTop: 8 },
  metaText: { color: '#aaa', fontSize: 12 },
  features: { marginTop: 8 },
  feature: { color: '#ccc', fontSize: 12, marginLeft: 8 },
  subscribeBtn: { backgroundColor: '#7c3aed', borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 12, flex: 1 },
  unsubscribeBtn: { backgroundColor: '#f44336' },
  subscribeBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  yearlyBtn: { backgroundColor: '#f59e0b', borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 12, flex: 1 },
  yearlyBtnText: { color: '#000', fontWeight: '700', fontSize: 14 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  priceText: { color: '#aaa', fontSize: 12 },
  yearlyText: { color: '#f59e0b', fontSize: 12, fontWeight: '600' },
  btnRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  sectionTitle: { color: '#7c3aed', fontSize: 16, fontWeight: '800', marginTop: 16, marginBottom: 8 },
});