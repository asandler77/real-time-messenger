import React, {useRef, useState} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {type ChatMessage} from './socket';
import {useChatSocket} from './useChatSocket';

const socketStatusLabel = {
  connected: 'Realtime connected',
  connecting: 'Realtime connecting',
  disconnected: 'Realtime disconnected',
  error: 'Realtime connection failed',
  idle: 'Realtime idle',
};

type ChatScreenProps = {
  accessToken: string;
  currentUserId?: string;
};

function ChatScreen({accessToken, currentUserId = 'demo-user'}: ChatScreenProps) {
  const [draft, setDraft] = useState('');
  const listRef = useRef<ScrollView>(null);
  const {error, messages, sendMessage, status} = useChatSocket(accessToken);
  const canSend = status === 'connected' && draft.trim().length > 0;

  async function handleSend() {
    const wasSent = await sendMessage(draft);

    if (wasSent) {
      setDraft('');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Real-time Messenger</Text>
      <Text style={styles.status} testID="socket-status">
        {socketStatusLabel[status]}
      </Text>
      {error ? (
        <Text accessibilityRole="alert" style={styles.error} testID="chat-error">
          {error}
        </Text>
      ) : null}

      <ScrollView
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => listRef.current?.scrollToEnd({animated: true})}
        ref={listRef}
        testID="message-list">
        {messages.map(item => (
          <MessageBubble
            key={item.id}
            message={item}
            isOwnMessage={item.userId === currentUserId}
          />
        ))}
      </ScrollView>

      <View style={styles.composer}>
        <TextInput
          editable={status === 'connected'}
          onChangeText={setDraft}
          placeholder="Type a message"
          style={styles.input}
          testID="message-input"
          value={draft}
        />
        <Pressable
          accessibilityRole="button"
          disabled={!canSend}
          onPress={handleSend}
          style={({pressed}) => [
            styles.sendButton,
            !canSend ? styles.sendButtonDisabled : null,
            pressed ? styles.sendButtonPressed : null,
          ]}
          testID="send-button">
          <Text style={styles.sendButtonText}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
}

function MessageBubble({
  isOwnMessage,
  message,
}: {
  isOwnMessage: boolean;
  message: ChatMessage;
}) {
  return (
    <View
      style={[
        styles.messageBubble,
        isOwnMessage ? styles.ownMessage : styles.otherMessage,
      ]}
      testID={isOwnMessage ? 'own-message' : 'other-message'}>
      <Text style={styles.messageSender}>
        {isOwnMessage ? 'You' : message.username}
      </Text>
      <Text style={styles.messageText}>{message.text}</Text>
      <Text style={styles.messageTimestamp} testID="message-timestamp">
        {new Date(message.timestamp).toLocaleTimeString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  status: {
    color: '#6b7280',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  error: {
    color: '#b91c1c',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  messageList: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingVertical: 16,
  },
  messageBubble: {
    borderRadius: 14,
    marginBottom: 10,
    maxWidth: '82%',
    padding: 12,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#dbeafe',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
  },
  messageSender: {
    color: '#4b5563',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  messageText: {
    color: '#111827',
    fontSize: 16,
  },
  messageTimestamp: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 6,
  },
  composer: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#d1d5db',
    borderRadius: 10,
    borderWidth: 1,
    color: '#111827',
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  sendButton: {
    alignItems: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonPressed: {
    opacity: 0.85,
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ChatScreen;
