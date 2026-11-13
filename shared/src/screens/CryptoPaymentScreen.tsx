import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { Header } from '../components/Header';
import { createCryptoPayment, checkPaymentStatus, CryptoCurrency, CryptoPayment } from '../billing';

interface Props {
  isPremium: boolean;
  onPaymentSuccess: () => void;
  onBack: () => void;
}

export const CryptoPaymentScreen: React.FC<Props> = ({ isPremium, onPaymentSuccess, onBack }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<CryptoCurrency>('USDT');
  const [payment, setPayment] = useState<CryptoPayment | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<string>('');

  const handleCreatePayment = async () => {
    setLoading(true);
    try {
      const result = await createCryptoPayment(selectedCurrency);
      if (result.payment) {
        setPayment(result.payment);
        setStatus('Payment created. Send funds to the address.');
      }
    } catch (e: any) {
      setStatus('Error: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    if (!payment) return;
    setChecking(true);
    const result = await checkPaymentStatus(payment.id);
    setStatus(`Status: ${result}`);
    if (result === 'confirmed') {
      onPaymentSuccess();
    }
    setChecking(false);
  };

  return (
    <View style={styles.container}>
      <Header current="premium" onNavigate={onBack} isPremium={isPremium} adCount={0} />
      <ScrollView style={styles.body}>
        <Text style={styles.heading}>💳 Crypto Payment</Text>
        <Text style={styles.price}>$3.99</Text>

        <View style={styles.currencyRow}>
          {(['USDT', 'BTC', 'ETH'] as CryptoCurrency[]).map(c => (
            <TouchableOpacity key={c} style={[styles.currencyBtn, selectedCurrency === c && styles.currencyBtnActive]} onPress={() => setSelectedCurrency(c)}>
              <Text style={[styles.currencyBtnText, selectedCurrency === c && styles.currencyBtnTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.payBtn} onPress={handleCreatePayment} disabled={loading}>
          <Text style={styles.payBtnText}>{loading ? 'Creating...' : 'Pay with Crypto'}</Text>
        </TouchableOpacity>

        {payment && (
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentLabel}>Currency: {payment.currency}</Text>
            <Text style={styles.paymentLabel}>Amount: {payment.amount} {payment.currency}</Text>
            <Text style={styles.addressLabel}>Address:</Text>
            <Text style={styles.address}>{payment.address}</Text>
            <Text style={styles.qrCode}>📱 {payment.qrCode}</Text>
            <Text style={styles.expiry}>Expires: {new Date(payment.expiresAt).toLocaleTimeString()}</Text>
            <Text style={styles.status}>Status: {payment.status}</Text>

            <TouchableOpacity style={styles.checkBtn} onPress={handleCheckStatus} disabled={checking}>
              <Text style={styles.checkBtnText}>{checking ? 'Checking...' : 'Check Payment'}</Text>
            </TouchableOpacity>
          </View>
        )}

        {status ? <Text style={styles.statusText}>{status}</Text> : null}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  body: { padding: 20 },
  heading: { color: '#fff', fontSize: 24, fontWeight: '800', textAlign: 'center', marginTop: 20 },
  price: { color: '#f59e0b', fontSize: 42, fontWeight: '900', textAlign: 'center', marginTop: 12 },
  currencyRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 20 },
  currencyBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: '#1a1a2e', borderWidth: 1, borderColor: '#333' },
  currencyBtnActive: { backgroundColor: '#7c3aed', borderColor: '#7c3aed' },
  currencyBtnText: { color: '#888', fontSize: 14 },
  currencyBtnTextActive: { color: '#fff', fontWeight: '700' },
  payBtn: { backgroundColor: '#4caf50', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 20 },
  payBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  paymentInfo: { marginTop: 24, backgroundColor: '#1a1a2e', borderRadius: 12, padding: 16 },
  paymentLabel: { color: '#ccc', fontSize: 14 },
  addressLabel: { color: '#888', fontSize: 12, marginTop: 8 },
  address: { color: '#7c3aed', fontSize: 12, fontFamily: 'monospace' },
  qrCode: { color: '#4caf50', fontSize: 14, marginTop: 8 },
  expiry: { color: '#888', fontSize: 12, marginTop: 4 },
  status: { color: '#f59e0b', fontSize: 12, marginTop: 4 },
  checkBtn: { backgroundColor: '#7c3aed', borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 12 },
  checkBtnText: { color: '#fff', fontWeight: '700' },
  statusText: { color: '#fff', textAlign: 'center', marginTop: 16, fontSize: 14 },
});