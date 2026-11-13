import AsyncStorage from '@react-native-async-storage/async-storage';

const SYNC_KEY = '@dopiss_sync';

export async function syncData(): Promise<{ synced: boolean; timestamp: number }> {
  try {
    const localData = await AsyncStorage.getItem(SYNC_KEY);
    const timestamp = Date.now();

    if (localData) {
      await AsyncStorage.setItem(SYNC_KEY, JSON.stringify({ ...JSON.parse(localData), lastSync: timestamp }));
    }

    return { synced: true, timestamp };
  } catch {
    return { synced: false, timestamp: 0 };
  }
}

export async function startBackgroundSync(): Promise<void> {
  // Background sync not available without expo-task-manager
}

export async function stopBackgroundSync(): Promise<void> {
  // Background sync not available without expo-task-manager
}