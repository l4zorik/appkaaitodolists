import * as SecureStore from 'expo-secure-store';

const API_KEY_KEY = '@tudodo_api_key';
const BIOMETRIC_KEY = '@tudodo_biometric';

export async function storeApiKey(key: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(API_KEY_KEY, key);
  } catch {}
}

export async function getApiKey(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(API_KEY_KEY);
  } catch {
    return null;
  }
}

export async function deleteApiKey(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(API_KEY_KEY);
  } catch {}
}

export async function enableBiometric(): Promise<void> {
  await SecureStore.setItemAsync(BIOMETRIC_KEY, 'true');
}

export async function disableBiometric(): Promise<void> {
  await SecureStore.deleteItemAsync(BIOMETRIC_KEY);
}

export async function isBiometricEnabled(): Promise<boolean> {
  try {
    return (await SecureStore.getItemAsync(BIOMETRIC_KEY)) === 'true';
  } catch {
    return false;
  }
}