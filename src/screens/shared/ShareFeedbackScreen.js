import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Button } from '../../packages/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ShareFeedbackScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const [feedbackCategory, setFeedbackCategory] = useState('general');
  const [feedbackDescription, setFeedbackDescription] = useState('');
  const [showFeedbackSuccessModal, setShowFeedbackSuccessModal] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Help us Improve',
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
        navigation.getParent()?.setOptions({
          tabBarStyle: undefined,
        });
      };
    }, [navigation])
  );

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

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style="dark" translucent={true} />
      
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
              onPress={() => {
                setShowFeedbackSuccessModal(false);
                navigation.goBack();
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
  formTextArea: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    minHeight: 120,
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

export default ShareFeedbackScreen;

