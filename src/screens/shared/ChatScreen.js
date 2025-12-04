import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Animated,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';

const ChatScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { userName, userAvatar } = route.params || {};
  const [message, setMessage] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
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

  const flatListRef = useRef(null);
  const translateY = useRef(new Animated.Value(0)).current;

  // Handle keyboard on Android - manually move input up
  useEffect(() => {
    if (Platform.OS === 'android') {
      const keyboardWillShow = Keyboard.addListener('keyboardDidShow', (e) => {
        const height = e.endCoordinates.height;
        setKeyboardHeight(height);
        Animated.timing(translateY, {
          toValue: -height,
          duration: 250,
          useNativeDriver: true,
        }).start();
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      });

      const keyboardWillHide = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboardHeight(0);
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      });

      return () => {
        keyboardWillShow.remove();
        keyboardWillHide.remove();
      };
    } else {
      // iOS - use KeyboardAvoidingView
      const keyboardWillShow = Keyboard.addListener('keyboardWillShow', () => {
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      });

      return () => {
        keyboardWillShow.remove();
      };
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

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

  // Ensure StatusBar is dark when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content', true);
      return () => {
        // StatusBar will be restored by other screens
      };
    }, [])
  );

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.isSent ? styles.sentMessage : styles.receivedMessage,
      ]}
    >
      <View
        style={[
          styles.messageContent,
          item.isSent
            ? { backgroundColor: theme.colors.primary }
            : { backgroundColor: theme.colors.white },
        ]}
      >
        <Text
          style={[
            styles.messageText,
            { color: item.isSent ? theme.colors.white : theme.colors.textPrimary },
          ]}
        >
          {item.text}
        </Text>
        <Text
          style={[
            styles.messageTime,
            { color: item.isSent ? 'rgba(255, 255, 255, 0.7)' : theme.colors.hint },
          ]}
        >
          {item.time}
        </Text>
      </View>
    </View>
  );

  // For Android, use Animated.View to move input up
  const InputContainer = Platform.OS === 'android' ? Animated.View : View;

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/* Messages List */}
        <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
          styles.messagesContent,
          { paddingBottom: Platform.OS === 'android' && keyboardHeight > 0 ? keyboardHeight + 80 : 20 },
        ]}
        style={styles.messagesList}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      />

      {/* Input Container - Separated from bottom nav, moves up with keyboard on Android */}
      {Platform.OS === 'android' ? (
        <InputContainer
          style={[
            styles.inputContainer,
            {
              backgroundColor: theme.colors.white,
              paddingBottom: 12,
              borderTopColor: theme.colors.hint + '20',
              transform: [{ translateY }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.attachButton}
            activeOpacity={0.7}
            onPress={() => {
              console.log('Attach pressed');
            }}
          >
            <Ionicons name="attach-outline" size={22} color={theme.colors.hint} />
          </TouchableOpacity>

          <View
            style={[
              styles.inputWrapper,
              {
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.hint + '30',
              },
            ]}
          >
            <TextInput
              style={[styles.input, { color: theme.colors.textPrimary }]}
              placeholder="Type a message..."
              placeholderTextColor={theme.colors.hint}
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
              textAlignVertical="center"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: message.trim()
                  ? theme.colors.primary
                  : theme.colors.hint + '40',
              },
            ]}
            onPress={handleSend}
            activeOpacity={0.7}
            disabled={!message.trim()}
          >
            <Ionicons
              name="send"
              size={18}
              color={message.trim() ? theme.colors.white : theme.colors.hint}
            />
          </TouchableOpacity>
        </InputContainer>
      ) : (
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={90}
        >
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: theme.colors.white,
                paddingBottom: insets.bottom + 8,
                borderTopColor: theme.colors.hint + '20',
              },
            ]}
          >
            <TouchableOpacity
              style={styles.attachButton}
              activeOpacity={0.7}
              onPress={() => {
                console.log('Attach pressed');
              }}
            >
              <Ionicons name="attach-outline" size={22} color={theme.colors.hint} />
            </TouchableOpacity>

            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.hint + '30',
                },
              ]}
            >
              <TextInput
                style={[styles.input, { color: theme.colors.textPrimary }]}
                placeholder="Type a message..."
                placeholderTextColor={theme.colors.hint}
                value={message}
                onChangeText={setMessage}
                multiline
                maxLength={500}
                textAlignVertical="center"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.sendButton,
                {
                  backgroundColor: message.trim()
                    ? theme.colors.primary
                    : theme.colors.hint + '40',
                },
              ]}
              onPress={handleSend}
              activeOpacity={0.7}
              disabled={!message.trim()}
            >
              <Ionicons
                name="send"
                size={18}
                color={message.trim() ? theme.colors.white : theme.colors.hint}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingTop: 16,
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
    marginTop: 2,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 8,
    zIndex: 1000,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  attachButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    minHeight: 40,
    maxHeight: 100,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 40,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  callButton: {
    padding: 8,
    marginRight: 8,
  },
});

export default ChatScreen;
