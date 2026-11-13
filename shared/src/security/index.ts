export interface SecurityConfig {
  biometricEnabled: boolean;
  apiKeyStored: boolean;
  encryptionEnabled: boolean;
  secureStorage: boolean;
}

export async function checkSecurityStatus(): Promise<SecurityConfig> {
  const { isBiometricEnabled } = await import('./secureStore');
  const { getApiKey } = await import('./secureStore');

  const biometric = await isBiometricEnabled();
  const apiKey = await getApiKey();

  return {
    biometricEnabled: biometric,
    apiKeyStored: !!apiKey,
    encryptionEnabled: true,
    secureStorage: true,
  };
}