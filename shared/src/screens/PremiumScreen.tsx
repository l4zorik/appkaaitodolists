import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Header } from '../components/Header';
import { purchasePremium, restorePurchases, BillingState } from '../billing';

interface Props {
  isPremium: boolean;
  billingState: BillingState;
  onPurchase: () => Promise<void>;
  onRestore: () => Promise<void>;
  onPurchaseCrypto: (currency: string) => void;
  onBack: () => void;
}

export const PremiumScreen: React.FC<Props> = ({ isPremium, billingState, onPurchase, onRestore, onPurchaseCrypto, onBack }) => (
  <View style={styles.container}>
    <Header current="premium" onNavigate={onBack} isPremium={isPremium} adCount={0} />
    <View style={styles.body}>
      <Text style={styles.heading}>🚀 Upgrade to Premium</Text>
      <Text style={styles.price}>$3.99</Text>
      <Text style={styles.features}>
        ✅ Unlimited tasks{'\n'}
        ✅ Priority tagging{'\n'}
        ✅ Reminders{'\n'}
        ✅ Tags{'\n'}
        ✅ No ads{'\n'}
        ✅ Cloud backup
      </Text>

      <TouchableOpacity style={styles.buyBtn} onPress={onPurchase} disabled={billingState.loading}>
        <Text style={styles.buyBtnText}>{billingState.loading ? 'Processing...' : 'Buy Premium — $3.99'}</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>— or —</Text>

      <TouchableOpacity style={styles.cryptoBtn} onPress={() => onPurchaseCrypto('USDT')}>
        <Text style={styles.cryptoBtnText}>💰 USDT</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cryptoBtn} onPress={() => onPurchaseCrypto('BTC')}>
        <Text style={styles.cryptoBtnText}>₿ BTC</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cryptoBtn} onPress={() => onPurchaseCrypto('ETH')}>
        <Text style={styles.cryptoBtnText}>Ξ ETH</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.restoreBtn} onPress={onRestore}>
        <Text style={styles.restoreBtnText}>Restore Purchase</Text>
      </TouchableOpacity>

      {isPremium && (
        <Text style={styles.active}>✅ Premium active</Text>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  body: { padding: 20 },
  heading: { color: '#fff', fontSize: 24, fontWeight: '800', textAlign: 'center', marginTop: 20 },
  price: { color: '#f59e0b', fontSize: 42, fontWeight: '900', textAlign: 'center', marginTop: 12 },
  features: { color: '#ccc', fontSize: 14, marginTop: 16, lineHeight: 22, textAlign: 'center' },
  buyBtn: { backgroundColor: '#7c3aed', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 24 },
  buyBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  orText: { color: '#888', textAlign: 'center', marginTop: 16, fontSize: 13 },
  cryptoBtn: { backgroundColor: '#2a5a2a', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 8 },
  cryptoBtnText: { color: '#4caf50', fontSize: 15, fontWeight: '700' },
  restoreBtn: { padding: 14, alignItems: 'center', marginTop: 10 },
  restoreBtnText: { color: '#7c3aed', fontSize: 14 },
  active: { color: '#4caf50', textAlign: 'center', marginTop: 16, fontWeight: '600' },
});