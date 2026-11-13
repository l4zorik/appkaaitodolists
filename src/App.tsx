import React, { useEffect, useReducer, useCallback } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { appReducer, loadState, saveState, initialState } from './store/index';
import { AppState } from './types/dopiss';
import { DualPanelScreen } from './screens/DualPanelScreen';
import { SecurityScreen } from './screens/SecurityScreen';

const Stack = createStackNavigator();

export default function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const handleSendMessage = useCallback((text: string, conversationId: string) => {
    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        id: Date.now().toString(),
        conversationId,
        ciphertext: text,
        nonce: '',
        timestamp: Date.now(),
        type: 'text',
      },
    });
  }, []);

  const handleViewContent = useCallback((contentId: string) => {
    dispatch({
      type: 'ADD_VIEW_EVENT',
      payload: {
        contentId,
        viewerUuidHash: 'hashed_viewer',
        timestamp: Date.now(),
        durationWatched: 3,
      },
    });
  }, []);

  const handleRequestPayout = useCallback(() => {
    dispatch({
      type: 'ADD_REVENUE_SHARE',
      payload: {
        authorUuid: 'user_123',
        amount: 10,
        currency: 'USDT',
        period: '2026-10',
        timestamp: Date.now(),
      },
    });
  }, []);

  const revenueInfo = {
    totalViews: state.viewEvents.length,
    totalEarnings: state.viewEvents.length * 0.001,
    payoutHistory: state.revenueShares,
  };

  return (
    <SafeAreaView style={styles.root}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="DualPanel">
            {() => (
              <DualPanelScreen
                conversations={state.conversations}
                contentFeed={state.contentFeed}
                activeConversation={state.dualPanel.activeConversation}
                activeContentAuthor={state.dualPanel.activeContentAuthor}
                messages={state.messages}
                revenueInfo={revenueInfo}
                onSelectConversation={(id) => dispatch({ type: 'SELECT_CONVERSATION', payload: id })}
                onSelectContentAuthor={(uuid) => dispatch({ type: 'SELECT_CONTENT_AUTHOR', payload: uuid })}
                onSendMessage={handleSendMessage}
                onViewContent={handleViewContent}
                onRequestPayout={handleRequestPayout}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Security">
            {() => <SecurityScreen isPremium={state.isPremium} onBack={() => {}} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0f0f23' },
});