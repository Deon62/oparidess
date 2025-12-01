import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Modal, Alert, Keyboard, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Button } from '../../packages/components';

const CustomerSupportScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('chat'); // 'chat', 'ticket', 'feedback'
  
  // Chat with AI state
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      text: 'Hello! I\'m your AI assistant. How can I help you today?',
      isSent: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef(null);
  const translateY = useRef(new Animated.Value(0)).current;

  // Create Ticket state
  const [ticketUrgency, setTicketUrgency] = useState('medium');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [showTicketSuccessModal, setShowTicketSuccessModal] = useState(false);

  // Share Feedback state
  const [feedbackCategory, setFeedbackCategory] = useState('general');
  const [feedbackDescription, setFeedbackDescription] = useState('');
  const [showFeedbackSuccessModal, setShowFeedbackSuccessModal] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Customer Support',
    });
  }, [navigation]);

  // Hide bottom tab bar when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: 'none' },
      });
      return () => {
        // Restore tab bar when leaving this screen
      };
    }, [navigation])
  );

  // Restore tab bar when component unmounts (navigating away completely)
  useEffect(() => {
    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
    };
  }, [navigation]);

  // Handle keyboard show/hide - Android specific
  useEffect(() => {
    if (Platform.OS === 'android') {
      const keyboardDidShow = Keyboard.addListener('keyboardDidShow', (e) => {
        const height = e.endCoordinates.height;
        setKeyboardHeight(height);
        Animated.timing(translateY, {
          toValue: -height,
          duration: 250,
          useNativeDriver: true,
        }).start();
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      });

      const keyboardDidHide = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboardHeight(0);
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      });

      return () => {
        keyboardDidShow.remove();
        keyboardDidHide.remove();
      };
    } else {
      // iOS - use KeyboardAvoidingView
      const keyboardWillShow = Keyboard.addListener('keyboardWillShow', () => {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      });

      return () => {
        keyboardWillShow.remove();
      };
    }
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (activeTab === 'chat' && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [chatMessages, activeTab]);

  const handleSendChatMessage = () => {
    if (!chatMessage.trim()) return;

    const newMessage = {
      id: chatMessages.length + 1,
      text: chatMessage,
      isSent: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages([...chatMessages, newMessage]);
    setChatMessage('');

    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => {
        const aiResponse = {
          id: prev.length + 1,
          text: 'Thank you for your message. I\'m here to help! For more specific assistance, please create a support ticket or share your feedback.',
          isSent: false,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        return [...prev, aiResponse];
      });
    }, 1000);
  };

  const handleSubmitTicket = () => {
    if (!ticketSubject.trim()) {
      Alert.alert('Required Field', 'Please enter a subject for your ticket.');
      return;
    }
    if (!ticketDescription.trim()) {
      Alert.alert('Required Field', 'Please enter a description for your ticket.');
      return;
    }

    // TODO: Submit ticket to backend
    console.log('Ticket submitted:', {
      urgency: ticketUrgency,
      subject: ticketSubject,
      description: ticketDescription,
    });

    setShowTicketSuccessModal(true);
    // Reset form
    setTicketSubject('');
    setTicketDescription('');
    setTicketUrgency('medium');
  };

  const handleSubmitFeedback = () => {
    if (!feedbackDescription.trim()) {
      Alert.alert('Required Field', 'Please enter your feedback description.');
      return;
    }

    // TODO: Submit feedback to backend
    console.log('Feedback submitted:', {
      category: feedbackCategory,
      description: feedbackDescription,
    });

    setShowFeedbackSuccessModal(true);
    // Reset form
    setFeedbackDescription('');
    setFeedbackCategory('general');
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'low':
        return '#4CAF50';
      case 'medium':
        return '#FFA500';
      case 'high':
        return '#F44336';
      default:
        return theme.colors.hint;
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      general: 'General',
      bug_report: 'Bug Report',
      feature_request: 'Feature Request',
      service_quality: 'Service Quality',
      payment_issue: 'Payment Issue',
    };
    return labels[category] || category;
  };

  const renderChatTab = () => {
    // For Android, use Animated.View to move input up
    const InputContainer = Platform.OS === 'android' ? Animated.View : View;

    return (
      <View style={styles.chatContainer}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatMessagesContainer}
          contentContainerStyle={[
            styles.chatMessagesContent,
            { paddingBottom: Platform.OS === 'android' && keyboardHeight > 0 ? keyboardHeight + 80 : 100 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          {chatMessages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.chatMessage,
                message.isSent ? styles.chatMessageSent : styles.chatMessageReceived,
              ]}
            >
              <View
                style={[
                  styles.chatBubble,
                  {
                    backgroundColor: message.isSent
                      ? theme.colors.primary
                      : theme.colors.white,
                    borderColor: message.isSent ? 'transparent' : theme.colors.hint + '30',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chatMessageText,
                    {
                      color: message.isSent ? theme.colors.white : theme.colors.textPrimary,
                    },
                  ]}
                >
                  {message.text}
                </Text>
                <Text
                  style={[
                    styles.chatMessageTime,
                    {
                      color: message.isSent
                        ? theme.colors.white + 'CC'
                        : theme.colors.hint,
                    },
                  ]}
                >
                  {message.time}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Input Container - Separated from bottom nav, moves up with keyboard on Android */}
        {Platform.OS === 'android' ? (
          <InputContainer
            style={[
              styles.chatInputContainer,
              {
                backgroundColor: theme.colors.white,
                borderTopColor: theme.colors.hint + '20',
                paddingBottom: 12,
                transform: [{ translateY }],
              },
            ]}
          >
            <TextInput
              style={[
                styles.chatInput,
                {
                  backgroundColor: theme.colors.background,
                  color: theme.colors.textPrimary,
                  borderColor: theme.colors.hint + '40',
                },
              ]}
              placeholder="Type your message..."
              placeholderTextColor={theme.colors.hint}
              value={chatMessage}
              onChangeText={setChatMessage}
              multiline
              textAlignVertical="center"
            />
            <TouchableOpacity
              style={[
                styles.chatSendButton,
                { backgroundColor: chatMessage.trim() ? theme.colors.primary : theme.colors.hint },
              ]}
              onPress={handleSendChatMessage}
              activeOpacity={0.7}
              disabled={!chatMessage.trim()}
            >
              <Ionicons name="send" size={20} color={theme.colors.white} />
            </TouchableOpacity>
          </InputContainer>
        ) : (
          <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={90}
          >
            <View
              style={[
                styles.chatInputContainer,
                {
                  backgroundColor: theme.colors.white,
                  borderTopColor: theme.colors.hint + '20',
                  paddingBottom: insets.bottom + 8,
                },
              ]}
            >
              <TextInput
                style={[
                  styles.chatInput,
                  {
                    backgroundColor: theme.colors.background,
                    color: theme.colors.textPrimary,
                    borderColor: theme.colors.hint + '40',
                  },
                ]}
                placeholder="Type your message..."
                placeholderTextColor={theme.colors.hint}
                value={chatMessage}
                onChangeText={setChatMessage}
                multiline
                textAlignVertical="center"
              />
              <TouchableOpacity
                style={[
                  styles.chatSendButton,
                  { backgroundColor: chatMessage.trim() ? theme.colors.primary : theme.colors.hint },
                ]}
                onPress={handleSendChatMessage}
                activeOpacity={0.7}
                disabled={!chatMessage.trim()}
              >
                <Ionicons name="send" size={20} color={theme.colors.white} />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}
      </View>
    );
  };

  const renderTicketTab = () => (
    <ScrollView
      style={styles.formContainer}
      contentContainerStyle={styles.formContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.formSection, { backgroundColor: theme.colors.white }]}>
        <Text style={[styles.formSectionTitle, { color: theme.colors.textPrimary }]}>
          Urgency Level
        </Text>
        <View style={styles.urgencyButtonsContainer}>
          {['low', 'medium', 'high'].map((urgency) => (
            <TouchableOpacity
              key={urgency}
              style={[
                styles.urgencyButton,
                ticketUrgency === urgency && [
                  styles.urgencyButtonActive,
                  { backgroundColor: getUrgencyColor(urgency) },
                ],
                {
                  borderColor:
                    ticketUrgency === urgency
                      ? getUrgencyColor(urgency)
                      : theme.colors.hint + '40',
                },
              ]}
              onPress={() => setTicketUrgency(urgency)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.urgencyButtonText,
                  {
                    color:
                      ticketUrgency === urgency
                        ? theme.colors.white
                        : theme.colors.textSecondary,
                  },
                ]}
              >
                {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.formSection, { backgroundColor: theme.colors.white }]}>
        <Text style={[styles.formLabel, { color: theme.colors.textPrimary }]}>
          Subject <Text style={{ color: '#F44336' }}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.formInput,
            {
              backgroundColor: theme.colors.background,
              color: theme.colors.textPrimary,
              borderColor: theme.colors.hint + '40',
            },
          ]}
          placeholder="Enter ticket subject"
          placeholderTextColor={theme.colors.hint}
          value={ticketSubject}
          onChangeText={setTicketSubject}
        />
      </View>

      <View style={[styles.formSection, { backgroundColor: theme.colors.white }]}>
        <Text style={[styles.formLabel, { color: theme.colors.textPrimary }]}>
          Description <Text style={{ color: '#F44336' }}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.formTextArea,
            {
              backgroundColor: theme.colors.background,
              color: theme.colors.textPrimary,
              borderColor: theme.colors.hint + '40',
            },
          ]}
          placeholder="Describe your issue or request..."
          placeholderTextColor={theme.colors.hint}
          value={ticketDescription}
          onChangeText={setTicketDescription}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
      </View>

      <Button
        title="Submit Ticket"
        onPress={handleSubmitTicket}
        variant="primary"
        style={styles.submitButton}
      />
    </ScrollView>
  );

  const renderFeedbackTab = () => (
    <ScrollView
      style={styles.formContainer}
      contentContainerStyle={styles.formContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.formSection, { backgroundColor: theme.colors.white }]}>
        <Text style={[styles.formSectionTitle, { color: theme.colors.textPrimary }]}>
          Feedback Category
        </Text>
        <View style={styles.categoryButtonsContainer}>
          {[
            'general',
            'bug_report',
            'feature_request',
            'service_quality',
            'payment_issue',
          ].map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                feedbackCategory === category && [
                  styles.categoryButtonActive,
                  { backgroundColor: theme.colors.primary },
                ],
                {
                  borderColor:
                    feedbackCategory === category
                      ? theme.colors.primary
                      : theme.colors.hint + '40',
                },
              ]}
              onPress={() => setFeedbackCategory(category)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  {
                    color:
                      feedbackCategory === category
                        ? theme.colors.white
                        : theme.colors.textSecondary,
                  },
                ]}
              >
                {getCategoryLabel(category)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.formSection, { backgroundColor: theme.colors.white }]}>
        <Text style={[styles.formLabel, { color: theme.colors.textPrimary }]}>
          Feedback Description <Text style={{ color: '#F44336' }}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.formTextArea,
            {
              backgroundColor: theme.colors.background,
              color: theme.colors.textPrimary,
              borderColor: theme.colors.hint + '40',
            },
          ]}
          placeholder="Share your feedback, suggestions, or report issues..."
          placeholderTextColor={theme.colors.hint}
          value={feedbackDescription}
          onChangeText={setFeedbackDescription}
          multiline
          numberOfLines={8}
          textAlignVertical="top"
        />
      </View>

      <Button
        title="Submit Feedback"
        onPress={handleSubmitFeedback}
        variant="primary"
        style={styles.submitButton}
      />
    </ScrollView>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Tab Selector */}
      <View style={[styles.tabContainer, { backgroundColor: theme.colors.white }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'chat' && [styles.tabActive, { backgroundColor: theme.colors.primary }],
          ]}
          onPress={() => setActiveTab('chat')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'chat' ? 'chatbubbles' : 'chatbubbles-outline'}
            size={20}
            color={activeTab === 'chat' ? theme.colors.white : theme.colors.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'chat' ? theme.colors.white : theme.colors.textSecondary,
              },
            ]}
          >
            Chat with AI
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'ticket' && [styles.tabActive, { backgroundColor: theme.colors.primary }],
          ]}
          onPress={() => setActiveTab('ticket')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'ticket' ? 'ticket' : 'ticket-outline'}
            size={20}
            color={activeTab === 'ticket' ? theme.colors.white : theme.colors.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'ticket' ? theme.colors.white : theme.colors.textSecondary,
              },
            ]}
          >
            Create Ticket
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'feedback' && [
              styles.tabActive,
              { backgroundColor: theme.colors.primary },
            ],
          ]}
          onPress={() => setActiveTab('feedback')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'feedback' ? 'star' : 'star-outline'}
            size={20}
            color={activeTab === 'feedback' ? theme.colors.white : theme.colors.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'feedback' ? theme.colors.white : theme.colors.textSecondary,
              },
            ]}
          >
            Share Feedback
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'chat' && renderChatTab()}
      {activeTab === 'ticket' && renderTicketTab()}
      {activeTab === 'feedback' && renderFeedbackTab()}

      {/* Ticket Success Modal */}
      <Modal
        visible={showTicketSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTicketSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.white }]}>
            <View style={[styles.modalIconContainer, { backgroundColor: '#4CAF50' + '20' }]}>
              <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
            </View>
            <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
              Ticket Created!
            </Text>
            <Text style={[styles.modalMessage, { color: theme.colors.textSecondary }]}>
              Your support ticket has been submitted successfully. We'll get back to you soon.
            </Text>
            <Button
              title="OK"
              onPress={() => setShowTicketSuccessModal(false)}
              variant="primary"
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>

      {/* Feedback Success Modal */}
      <Modal
        visible={showFeedbackSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFeedbackSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.white }]}>
            <View style={[styles.modalIconContainer, { backgroundColor: '#4CAF50' + '20' }]}>
              <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
            </View>
            <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
              Feedback Submitted!
            </Text>
            <Text style={[styles.modalMessage, { color: theme.colors.textSecondary }]}>
              Thank you for your feedback. We appreciate your input!
            </Text>
            <Button
              title="OK"
              onPress={() => setShowFeedbackSuccessModal(false)}
              variant="primary"
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  tabActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
  },
  // Chat Styles
  chatContainer: {
    flex: 1,
    position: 'relative',
  },
  chatMessagesContainer: {
    flex: 1,
  },
  chatMessagesContent: {
    padding: 16,
  },
  chatMessage: {
    marginBottom: 16,
  },
  chatMessageSent: {
    alignItems: 'flex-end',
  },
  chatMessageReceived: {
    alignItems: 'flex-start',
  },
  chatBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  chatMessageText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 4,
  },
  chatMessageTime: {
    fontSize: 10,
    fontFamily: 'Nunito_400Regular',
    alignSelf: 'flex-end',
  },
  chatInputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 12,
    zIndex: 1000,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chatInput: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    minHeight: 40,
    maxHeight: 100,
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  chatSendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Form Styles
  formContainer: {
    flex: 1,
  },
  formContent: {
    padding: 16,
    paddingBottom: 40,
  },
  formSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  formSectionTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 12,
  },
  formLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 8,
  },
  formInput: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  formTextArea: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    minHeight: 120,
  },
  urgencyButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  urgencyButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  urgencyButtonActive: {
    borderWidth: 0,
  },
  urgencyButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  categoryButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryButtonActive: {
    borderWidth: 0,
  },
  categoryButtonText: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
  },
  submitButton: {
    marginTop: 8,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '85%',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  modalIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButton: {
    width: '100%',
  },
});

export default CustomerSupportScreen;

