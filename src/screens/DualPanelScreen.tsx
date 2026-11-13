import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Dimensions, TextInput } from 'react-native';

const { width, height } = Dimensions.get('window');
const PANEL_WIDTH = width * 0.4;
const CONTENT_WIDTH = width * 0.6;
const AD_INTERVAL = 5;

interface Conversation {
  id: string;
  lastMessage?: string;
  timestamp?: number;
  unread?: number;
}

interface ContentItem {
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

import { RevenueInfo } from '../types/dopiss';

interface DualPanelScreenProps {
  conversations: Conversation[];
  contentFeed: ContentItem[];
  activeConversation: string | null;
  activeContentAuthor: string | null;
  messages: Record<string, any[]>;
  revenueInfo: RevenueInfo;
  onSelectConversation: (id: string | null) => void;
  onSelectContentAuthor: (uuid: string | null) => void;
  onSendMessage: (text: string, conversationId: string) => void;
  onViewContent: (contentId: string) => void;
  onRequestPayout: () => void;
}

export function DualPanelScreen({
  conversations,
  contentFeed,
  activeConversation,
  activeContentAuthor,
  messages,
  revenueInfo,
  onSelectConversation,
  onSelectContentAuthor,
  onSendMessage,
  onViewContent,
  onRequestPayout,
}: DualPanelScreenProps) {
  const [inputText, setInputText] = useState('');
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [showRevenue, setShowRevenue] = useState(false);

  useEffect(() => {
    const item = contentFeed[visibleIndex];
    if (item) {
      onViewContent(item.id);
    }
  }, [visibleIndex, contentFeed, onViewContent]);

  const handleSend = useCallback(() => {
    if (inputText.trim() && activeConversation) {
      onSendMessage(inputText.trim(), activeConversation);
      setInputText('');
    }
  }, [inputText, activeConversation, onSendMessage]);

  const renderChatItem = useCallback(({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => onSelectConversation(item.id)}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.id.slice(0, 2).toUpperCase()}</Text>
      </View>
      <View style={styles.chatInfo}>
        <Text style={styles.chatName}>{item.id.slice(0, 8)}...</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage || 'No messages'}
        </Text>
      </View>
      {item.unread ? <View style={styles.badge} /> : null}
    </TouchableOpacity>
  ), [onSelectConversation]);

  const renderContentItem = useCallback(({ item, index }: { item: ContentItem; index: number }) => {
    const isAd = item.isAd;
    return (
      <TouchableOpacity
        style={[styles.contentItem, isAd && styles.adItem]}
        onPress={() => onSelectContentAuthor(item.authorUuid)}
      >
        {isAd && (
          <View style={styles.adBadge}>
            <Text style={styles.adBadgeText}>Sponsored</Text>
          </View>
        )}
        <View style={styles.mediaPlaceholder}>
          <Text style={styles.mediaText}>
            {item.duration ? '🎬' : '📷'}
          </Text>
        </View>
        <Text style={styles.caption}>{item.caption}</Text>
        <Text style={styles.author}>@{item.authorUuid.slice(0, 8)}</Text>
        <Text style={styles.viewCount}>👁 {item.viewCount} views</Text>
      </TouchableOpacity>
    );
  }, [onSelectContentAuthor]);

  const renderRevenueDashboard = useCallback(() => (
    <View style={styles.revenueDashboard}>
      <Text style={styles.revenueTitle}>Revenue Dashboard</Text>
      <Text style={styles.revenueText}>Total Views: {revenueInfo.totalViews}</Text>
      <Text style={styles.revenueText}>Total Earnings: ${revenueInfo.totalEarnings.toFixed(2)}</Text>
      <Text style={styles.revenueSubtitle}>Payout History:</Text>
      {revenueInfo.payoutHistory.map((payout, i) => (
        <Text key={i} style={styles.revenueText}>
          {payout.amount} {payout.currency} - {new Date(payout.timestamp).toLocaleDateString()}
        </Text>
      ))}
      <TouchableOpacity style={styles.payoutButton} onPress={onRequestPayout}>
        <Text style={styles.payoutButtonText}>Request Payout</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.closeButton} onPress={() => setShowRevenue(false)}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  ), [revenueInfo, onRequestPayout]);

  const activeMessages = activeConversation ? (messages[activeConversation] || []) : [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.leftPanel}>
        <Text style={styles.panelTitle}>Chats</Text>
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={renderChatItem}
        />
        <TouchableOpacity
          style={styles.botItem}
          onPress={() => onSelectConversation('ai-bot')}
        >
          <View style={[styles.avatar, styles.botAvatar]}>
            <Text style={styles.avatarText}>🤖</Text>
          </View>
          <Text style={styles.chatName}>Dopiss Bot</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.revenueButton}
          onPress={() => setShowRevenue(true)}
        >
          <Text style={styles.revenueButtonText}>💰 Revenue</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.rightPanel}>
        {showRevenue ? (
          renderRevenueDashboard()
        ) : activeConversation ? (
          <View style={styles.chatView}>
            <View style={styles.chatHeader}>
              <Text style={styles.chatHeaderTitle}>
                {activeConversation === 'ai-bot' ? 'Dopiss Bot' : activeConversation.slice(0, 8)}
              </Text>
            </View>
            <FlatList
              data={activeMessages}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.messageBubble}>
                  <Text style={styles.messageText}>{item.text}</Text>
                </View>
              )}
              style={styles.messageList}
            />
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type a message..."
                placeholderTextColor="#666"
                onSubmitEditing={handleSend}
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <FlatList
            data={contentFeed}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => renderContentItem({ item, index })}
            pagingEnabled
            snapToInterval={height}
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const offset = e.nativeEvent.contentOffset.y;
              const newIndex = Math.round(offset / height);
              setVisibleIndex(newIndex);
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#0f0f23',
  },
  leftPanel: {
    width: PANEL_WIDTH,
    backgroundColor: '#1a1a2e',
    paddingTop: 20,
  },
  rightPanel: {
    width: CONTENT_WIDTH,
    backgroundColor: '#0f0f23',
  },
  panelTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  botAvatar: {
    backgroundColor: '#0ea5e9',
  },
  avatarText: {
    color: '#fff',
    fontSize: 14,
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  lastMessage: {
    color: '#888',
    fontSize: 12,
  },
  badge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0ea5e9',
  },
  botItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  contentItem: {
    width: CONTENT_WIDTH,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adItem: {
    backgroundColor: '#1a1a3e',
  },
  adBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 10,
  },
  adBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  mediaPlaceholder: {
    width: 300,
    height: 400,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaText: {
    fontSize: 60,
  },
  caption: {
    color: '#fff',
    marginTop: 12,
    fontSize: 14,
  },
  author: {
    color: '#0ea5e9',
    marginTop: 4,
    fontSize: 12,
  },
  viewCount: {
    color: '#888',
    marginTop: 2,
    fontSize: 11,
  },
  chatView: {
    flex: 1,
  },
  chatHeader: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  chatHeaderTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageList: {
    flex: 1,
    padding: 12,
  },
  messageBubble: {
    backgroundColor: '#1a1a2e',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    maxWidth: '80%',
  },
  messageText: {
    color: '#fff',
    fontSize: 14,
  },
  inputRow: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: '#fff',
    fontSize: 14,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#0ea5e9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  revenueButton: {
    backgroundColor: '#0ea5e9',
    padding: 12,
    margin: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  revenueButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  revenueDashboard: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1a1a2e',
  },
  revenueTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  revenueText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
  },
  revenueSubtitle: {
    color: '#0ea5e9',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  payoutButton: {
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  payoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#f44336',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});