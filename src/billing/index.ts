import * as InAppPurchases from 'expo-in-app-purchases';
import { createCryptoPayment, checkPaymentStatus, getNetworkFee, getCryptoAddress, CryptoPayment } from './crypto';
import { CryptoBillingState, CryptoCurrency } from './crypto';

const PREMIUM_PRODUCT_ID = 'com.dopiss.premium';

export type BillingState = {
  available: boolean;
  purchased: boolean;
  loading: boolean;
  error: string | null;
};

const initialBillingState: BillingState = {
  available: false,
  purchased: false,
  loading: false,
  error: null,
};

export async function initBilling(): Promise<BillingState> {
  try {
    await InAppPurchases.connectAsync();
    return { ...initialBillingState, available: true };
  } catch (e: any) {
    return { ...initialBillingState, error: e.message };
  }
}

export async function purchasePremium(): Promise<BillingState> {
  try {
    const result = await InAppPurchases.purchaseItemAsync(PREMIUM_PRODUCT_ID);
    return { ...initialBillingState, purchased: true, loading: false };
  } catch (e: any) {
    return { ...initialBillingState, error: e.message, loading: false };
  }
}

export async function restorePurchases(): Promise<BillingState> {
  try {
    await InAppPurchases.getPurchaseHistoryAsync();
    return { ...initialBillingState, purchased: true };
  } catch (e: any) {
    return { ...initialBillingState, error: e.message };
  }
}

export function billingReducer(state: BillingState, action: any): BillingState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: true, error: null };
    case 'SET_AVAILABLE':
      return { ...state, available: action.payload };
    case 'SET_PURCHASED':
      return { ...state, purchased: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

export { createCryptoPayment, checkPaymentStatus, getNetworkFee, getCryptoAddress };
export type { CryptoCurrency, CryptoPayment, CryptoBillingState };