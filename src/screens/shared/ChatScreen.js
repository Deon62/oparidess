import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';

const ChatScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { userName, userAvatar } = route.params || {};
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! I have a question about my booking.',
      isSent: false,
      time: '10:30 AM',
    },
    {
      id: 2,
      text: 'Hi! How can I help you?',
      isSent: true,
      time: '10:32 AM',
    },
    {
      id: 3,
      text: 'Can we reschedule the booking for tomorrow?',
      isSent: false,
      time: '10:35 AM',
    },
    {
      id: 4,
      text: 'Sure, I can help you with that. Let me check the availability.',
      isSent: true,
      time: '10:36 AM',
    },
  ]);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message.trim(),
        isSent: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  // Set header with call icon
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            // TODO: Implement call functionality
            console.log('Call pressed');
          }}
          style={styles.callButton}
          activeOpacity={0.7}
        >
          <Ionicons name="call-outline" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, theme]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.isSent ? styles.sentMessage : styles.receivedMessage,
            ]}
          >
            <View
              style={[
                styles.messageContent,
                msg.isSent
                  ? { backgroundColor: theme.colors.primary }
                  : { backgroundColor: theme.colors.white },
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  { color: msg.isSent ? theme.colors.white : theme.colors.textPrimary },
                ]}
              >
                {msg.text}
              </Text>
              <Text
                style={[
                  styles.messageTime,
                  { color: msg.isSent ? theme.colors.white + 'CC' : theme.colors.hint },
                ]}
              >
                {msg.time}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.inputContainer, { backgroundColor: theme.colors.white }]}>
        <TouchableOpacity
          style={styles.attachButton}
          activeOpacity={0.7}
          onPress={() => {
            // TODO: Implement attach functionality
            console.log('Attach pressed');
          }}
        >
          <Ionicons name="attach-outline" size={24} color={theme.colors.hint} />
        </TouchableOpacity>
        <TextInput
          style={[styles.input, { color: theme.colors.textPrimary }]}
          placeholder="Type a message..."
          placeholderTextColor={theme.colors.hint}
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: message.trim() ? theme.colors.primary : theme.colors.hint },
          ]}
          onPress={handleSend}
          activeOpacity={0.7}
          disabled={!message.trim()}
        >
          <Ionicons
            name="send"
            size={20}
            color={theme.colors.white}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
  },
  messageBubble: {
    marginBottom: 12,
    maxWidth: '75%',
  },
  sentMessage: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  messageContent: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 11,
    fontFamily: 'Nunito_400Regular',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 8,
  },
  attachButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    maxHeight: 100,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButton: {
    padding: 8,
    marginRight: 8,
  },
});

export default ChatScreen;

