export interface User {
  id: string;
  publicKey: string;
  displayNameHash: string;
  createdAt: number;
}

export interface Conversation {
  id: string;
  participants: string[];
  ratchetState: Record<string, unknown>;
  createdAt: number;
}

export interface Message {
  id: string;
  conversationId: string;
  ciphertext: string;
  nonce: string;
  timestamp: number;
  type: 'text' | 'file' | 'readReceipt';
}

export interface ContentItem {
  id: string;
  authorUuid: string;
  mediaUrl: string;
  caption: string;
  duration: number | null;
  createdAt: number;
  viewCount: number;
  isAd: boolean;
  adSponsorUuid: string | null;
}

export interface ViewEvent {
  contentId: string;
  viewerUuidHash: string;
  timestamp: number;
  durationWatched: number;
}

export interface AdImpression {
  adId: string;
  viewerUuidHash: string;
  timestamp: number;
}

export interface RevenueShare {
  authorUuid: string;
  amount: number;
  currency: string;
  period: string;
  timestamp: number;
}

export interface RevenueInfo {
  totalViews: number;
  totalEarnings: number;
  payoutHistory: RevenueShare[];
}

export interface AnonymousLike {
  contentId: string;
  voterUuidHash: string;
  timestamp: number;
}

export interface AnonymousFollow {
  followerUuidHash: string;
  followeeUuid: string;
  timestamp: number;
}

export type AppScreen = 'dualPanel' | 'chat' | 'content' | 'aiBot' | 'settings' | 'security';

export interface DualPanelState {
  leftScreen: 'chatList' | 'aiBot';
  rightScreen: 'contentFeed' | 'chat';
  activeConversation: string | null;
  activeContentAuthor: string | null;
  swipeDirection: 'left' | 'right' | 'up' | 'down' | null;
}

export interface AppState {
  dualPanel: DualPanelState;
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  contentFeed: ContentItem[];
  likes: AnonymousLike[];
  follows: AnonymousFollow[];
  viewEvents: ViewEvent[];
  adImpressions: AdImpression[];
  revenueShares: RevenueShare[];
  isPremium: boolean;
  adsDisabled: boolean;
}

export type AppAction =
  | { type: 'SET_SCREEN'; payload: AppScreen }
  | { type: 'SET_LEFT_SCREEN'; payload: 'chatList' | 'aiBot' }
  | { type: 'SET_RIGHT_SCREEN'; payload: 'contentFeed' | 'chat' }
  | { type: 'SELECT_CONVERSATION'; payload: string | null }
  | { type: 'SELECT_CONTENT_AUTHOR'; payload: string | null }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'ADD_CONTENT'; payload: ContentItem }
  | { type: 'ADD_LIKE'; payload: AnonymousLike }
  | { type: 'ADD_FOLLOW'; payload: AnonymousFollow }
  | { type: 'ADD_VIEW_EVENT'; payload: ViewEvent }
  | { type: 'ADD_AD_IMRESSION'; payload: AdImpression }
  | { type: 'ADD_REVENUE_SHARE'; payload: RevenueShare }
  | { type: 'SET_SWIPE_DIRECTION'; payload: 'left' | 'right' | 'up' | 'down' | null }
  | { type: 'SET_PREMIUM'; payload: boolean }
  | { type: 'SET_ADS_DISABLED'; payload: boolean }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> };