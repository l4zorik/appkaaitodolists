export interface Task {
  id: string;
  title: string;
  description: string;
  checklist: ChecklistItem[];
  createdAt: number;
  updatedAt: number;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  reminder: number | null;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  members: number;
  rating: number;
  icon: string;
  isSubscribed: boolean;
  features: string[];
  plans: { monthly: number; yearly: number };
}

export type AppScreen = 'home' | 'addTask' | 'dualPanel' | 'aiTodo' | 'communities' | 'premium' | 'settings' | 'security' | 'codeReview' | 'cryptoPayment';

export interface AppState {
  tasks: Task[];
  currentScreen: AppScreen;
  isPremium: boolean;
  adsDisabled: boolean;
  communities: Community[];
  activeCommunity: string | null;
  swipeDirection: 'left' | 'right' | null;
}

export type AppAction =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'TOGGLE_CHECKLIST_ITEM'; payload: { taskId: string; itemId: string } }
  | { type: 'SET_SCREEN'; payload: AppScreen }
  | { type: 'SET_PREMIUM'; payload: boolean }
  | { type: 'SET_ADS_DISABLED'; payload: boolean }
  | { type: 'SET_COMMUNITIES'; payload: Community[] }
  | { type: 'SET_ACTIVE_COMMUNITY'; payload: string | null }
  | { type: 'SET_SWIPE_DIRECTION'; payload: 'left' | 'right' | null }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> };