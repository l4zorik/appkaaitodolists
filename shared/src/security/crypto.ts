import * as Crypto from 'expo-crypto';

export async function hashString(input: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, input);
}

export async function generateSalt(): Promise<string> {
  const bytes = new Uint8Array(16);
  Crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function secureHash(password: string, salt: string): Promise<string> {
  return hashString(password + salt);
}