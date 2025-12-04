import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Modal, Alert, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Button } from '../../packages/components';

const CustomerSupportScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [showTicketForm, setShowTicketForm] = useState(false);
  
  // Create Ticket state
  const [ticketUrgency, setTicketUrgency] = useState('medium');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [showTicketSuccessModal, setShowTicketSuccessModal] = useState(false);

  // Support phone number
  const SUPPORT_PHONE = '0702248984';

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Customer Support',
      statusBarStyle: 'dark',
      statusBarBackgroundColor: 'transparent',
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
        navigation.getParent()?.setOptions({
          tabBarStyle: undefined,
        });
      };
    }, [navigation])
  );

  const handleCallAgent = () => {
    Linking.openURL(`tel:${SUPPORT_PHONE}`);
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

  const renderInitialOptions = () => (
    <View style={styles.initialOptionsContainer}>
      <View style={styles.optionsHeader}>
        <Text style={[styles.optionsTitle, { color: theme.colors.textPrimary }]}>
          How can we help you?
        </Text>
        <Text style={[styles.optionsSubtitle, { color: theme.colors.textSecondary }]}>
          Choose an option to get started
        </Text>
      </View>

      <View style={styles.optionsButtons}>
        <TouchableOpacity
          style={[styles.optionButton, { borderColor: theme.colors.hint + '20' }]}
          onPress={() => setShowTicketForm(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="document-text-outline" size={24} color={theme.colors.textPrimary} />
          <View style={styles.optionButtonContent}>
            <Text style={[styles.optionButtonTitle, { color: theme.colors.textPrimary }]}>
              Create Ticket
            </Text>
            <Text style={[styles.optionButtonDesc, { color: theme.colors.textSecondary }]}>
              Submit a support ticket
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.hint} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionButton, { borderColor: theme.colors.hint + '20' }]}
          onPress={handleCallAgent}
          activeOpacity={0.7}
        >
          <Ionicons name="call-outline" size={24} color={theme.colors.textPrimary} />
          <View style={styles.optionButtonContent}>
            <Text style={[styles.optionButtonTitle, { color: theme.colors.textPrimary }]}>
              Call Our Agent
            </Text>
            <Text style={[styles.optionButtonDesc, { color: theme.colors.textSecondary }]}>
              Speak with our support team
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.hint} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTicketForm = () => (
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

      <View style={styles.formActions}>
        <Button
          title="Cancel"
          onPress={() => setShowTicketForm(false)}
          variant="secondary"
          style={[styles.formButton, { marginRight: 12 }]}
        />
        <Button
          title="Submit Ticket"
          onPress={handleSubmitTicket}
          variant="primary"
          style={[styles.formButton, { flex: 1 }]}
        />
      </View>
    </ScrollView>
  );


  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style="dark" translucent={true} />
      {!showTicketForm ? renderInitialOptions() : renderTicketForm()}

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
              onPress={() => {
                setShowTicketSuccessModal(false);
                setShowTicketForm(false);
              }}
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
  customHeader: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_600SemiBold',
    flex: 1,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  headerTabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 0,
    gap: 24,
  },
  headerTab: {
    paddingBottom: 12,
    position: 'relative',
  },
  headerTabText: {
    fontSize: 15,
  },
  headerTabIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 1,
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
  // Initial Options Styles
  initialOptionsContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  optionsHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  optionsTitle: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  optionsSubtitle: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    lineHeight: 22,
  },
  optionsButtons: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  optionButtonContent: {
    flex: 1,
    marginLeft: 12,
  },
  optionButtonTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 4,
  },
  optionButtonDesc: {
    fontSize: 13,
    fontFamily: 'Nunito_400Regular',
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
  formActions: {
    flexDirection: 'row',
    marginTop: 24,
    marginBottom: 8,
  },
  formButton: {
    flex: 1,
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

