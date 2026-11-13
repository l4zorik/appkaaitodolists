import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, AppAction } from '../types/dopiss';

const STORAGE_KEY = '@dopiss_state';

const initialState: AppState = {
  dualPanel: {
    leftScreen: 'chatList',
    rightScreen: 'contentFeed',
    activeConversation: null,
    activeContentAuthor: null,
    swipeDirection: null,
  },
  conversations: [],
  messages: {},
  contentFeed: [],
  likes: [],
  follows: [],
  viewEvents: [],
  adImpressions: [],
  revenueShares: [],
  isPremium: false,
  adsDisabled: false,
};

export { initialState };

export function appReducer(state = initialState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, dualPanel: { ...state.dualPanel, leftScreen: action.payload as any } };
    case 'SET_LEFT_SCREEN':
      return {
        ...state,
        dualPanel: { ...state.dualPanel, leftScreen: action.payload },
      };
    case 'SET_RIGHT_SCREEN':
      return {
        ...state,
        dualPanel: { ...state.dualPanel, rightScreen: action.payload },
      };
    case 'SELECT_CONVERSATION':
      return {
        ...state,
        dualPanel: {
          ...state.dualPanel,
          activeConversation: action.payload,
          rightScreen: action.payload ? 'chat' : 'contentFeed',
        },
      };
    case 'SELECT_CONTENT_AUTHOR':
      return {
        ...state,
        dualPanel: { ...state.dualPanel, activeContentAuthor: action.payload },
      };
    case 'ADD_MESSAGE': {
      const msg = action.payload;
      const existing = state.messages[msg.conversationId] || [];
      return {
        ...state,
        messages: { ...state.messages, [msg.conversationId]: [...existing, msg] },
      };
    }
    case 'ADD_CONTENT':
      return {
        ...state,
        contentFeed: [action.payload, ...state.contentFeed],
      };
    case 'ADD_LIKE':
      return {
        ...state,
        likes: [...state.likes, action.payload],
      };
    case 'ADD_FOLLOW':
      return {
        ...state,
        follows: [...state.follows, action.payload],
      };
    case 'ADD_VIEW_EVENT':
      return {
        ...state,
        viewEvents: [...state.viewEvents, action.payload],
      };
    case 'ADD_AD_IMRESSION':
      return {
        ...state,
        adImpressions: [...state.adImpressions, action.payload],
      };
    case 'ADD_REVENUE_SHARE':
      return {
        ...state,
        revenueShares: [...state.revenueShares, action.payload],
      };
    case 'SET_SWIPE_DIRECTION':
      return {
        ...state,
        dualPanel: { ...state.dualPanel, swipeDirection: action.payload },
      };
    case 'SET_PREMIUM':
      return { ...state, isPremium: action.payload };
    case 'SET_ADS_DISABLED':
      return { ...state, adsDisabled: action.payload };
    case 'LOAD_STATE':
      return { ...initialState, ...action.payload };
    default:
      return state;
  }
}

export async function loadState(): Promise<AppState> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json) return { ...initialState, ...JSON.parse(json) };
  } catch {}
  return initialState;
}

export async function saveState(state: AppState): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}