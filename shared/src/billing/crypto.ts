export type CryptoCurrency = 'USDT' | 'BTC' | 'ETH';

export interface CryptoPayment {
  id: string;
  currency: CryptoCurrency;
  amount: number;
  address: string;
  qrCode: string;
  expiresAt: number;
  status: 'pending' | 'confirmed' | 'expired';
  createdAt: number;
}

export type CryptoBillingState = {
  available: boolean;
  payment: CryptoPayment | null;
  loading: boolean;
  error: string | null;
};

const CRYPTO_ADDRESSES = {
  USDT: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD28',
  BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  ETH: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD28',
};

const CRYPTO_NETWORK_FEES = {
  USDT: 1.0,
  BTC: 0.0005,
  ETH: 0.005,
};

export async function createCryptoPayment(currency: CryptoCurrency): Promise<CryptoBillingState> {
  const id = `tx_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const payment: CryptoPayment = {
    id,
    currency,
    amount: 3.99,
    address: CRYPTO_ADDRESSES[currency],
    qrCode: `crypto:${currency.toLowerCase()}:${CRYPTO_ADDRESSES[currency]}?amount=${3.99}`,
    expiresAt: Date.now() + 15 * 60 * 1000,
    status: 'pending',
    createdAt: Date.now(),
  };

  return {
    available: true,
    payment,
    loading: false,
    error: null,
  };
}

export async function checkPaymentStatus(paymentId: string): Promise<'pending' | 'confirmed' | 'expired'> {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return 'confirmed';
}

export function getNetworkFee(currency: CryptoCurrency): number {
  return CRYPTO_NETWORK_FEES[currency];
}

export function getCryptoAddress(currency: CryptoCurrency): string {
  return CRYPTO_ADDRESSES[currency];
}