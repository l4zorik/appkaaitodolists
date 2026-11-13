import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { Header } from '../components/Header';
import { checkSecurityStatus, SecurityConfig } from '../security';
import { storeApiKey, getApiKey, deleteApiKey, enableBiometric, disableBiometric, isBiometricEnabled } from '../security/secureStore';

interface Props {
  isPremium: boolean;
  onBack: () => void;
}

export const SecurityScreen: React.FC<Props> = ({ isPremium, onBack }) => {
  const [security, setSecurity] = useState<SecurityConfig>({
    biometricEnabled: false,
    apiKeyStored: false,
    encryptionEnabled: true,
    secureStorage: true,
  });
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    checkSecurityStatus().then(setSecurity);
    getApiKey().then(key => {
      if (key) setApiKey(key.slice(0, 8) + '...');
    });
  }, []);

  const handleToggleBiometric = async (enabled: boolean) => {
    if (enabled) {
      await enableBiometric();
    } else {
      await disableBiometric();
    }
    setSecurity(prev => ({ ...prev, biometricEnabled: enabled }));
  };

  const handleStoreApiKey = async () => {
    if (!apiKey) return;
    await storeApiKey(apiKey);
    setSecurity(prev => ({ ...prev, apiKeyStored: true }));
    Alert.alert('Saved', 'API key stored securely');
  };

  const handleDeleteApiKey = async () => {
    await deleteApiKey();
    setApiKey('');
    setSecurity(prev => ({ ...prev, apiKeyStored: false }));
    Alert.alert('Deleted', 'API key removed');
  };

  return (
    <View style={styles.container}>
      <Header current="security" onNavigate={onBack} isPremium={isPremium} adCount={0} />
      <View style={styles.body}>
        <Text style={styles.heading}>🔒 Security</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Protection</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Encryption</Text>
            <Text style={[styles.value, { color: '#4caf50' }]}>ON</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Secure Storage</Text>
            <Text style={[styles.value, { color: '#4caf50' }]}>ON</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Biometric Lock</Text>
          <Switch value={security.biometricEnabled} onValueChange={handleToggleBiometric} trackColor={{ false: '#555', true: '#4caf50' }} thumbColor={security.biometricEnabled ? '#fff' : '#aaa'} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>API Key</Text>
          <TextInput style={styles.input} value={apiKey} onChangeText={setApiKey} placeholder="Enter API key" placeholderTextColor="#666" secureTextEntry />
          <View style={styles.row}>
            <TouchableOpacity style={styles.saveBtn} onPress={handleStoreApiKey}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
            {security.apiKeyStored && (
              <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteApiKey}>
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security Score</Text>
          <Text style={styles.scoreText}>
            {(security.biometricEnabled ? 40 : 0) + (security.apiKeyStored ? 30 : 0) + 30}/100
          </Text>
        </View>
      </View>
    </View>
  );
};

const TextInput = require('react-native').TextInput;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  body: { padding: 20 },
  heading: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 16 },
  section: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#333' },
  sectionTitle: { color: '#7c3aed', fontSize: 14, fontWeight: '700', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  label: { color: '#ccc', fontSize: 14 },
  value: { fontSize: 14, fontWeight: '600' },
  input: { backgroundColor: '#1a1a2e', color: '#fff', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#333', marginTop: 8 },
  saveBtn: { backgroundColor: '#4caf50', borderRadius: 8, padding: 10, alignItems: 'center', flex: 1, marginRight: 8 },
  saveBtnText: { color: '#fff', fontWeight: '700' },
  deleteBtn: { backgroundColor: '#f44336', borderRadius: 8, padding: 10, alignItems: 'center', flex: 1, marginLeft: 8 },
  deleteBtnText: { color: '#fff', fontWeight: '700' },
  scoreText: { color: '#f59e0b', fontSize: 28, fontWeight: '900' },
});