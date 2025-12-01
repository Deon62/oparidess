import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Modal, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Button, Toggle } from '../../packages/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ServiceProviderStep3Screen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const formData = route.params?.formData || {};

  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // Hide tab bar when screen is focused (including when returning from other screens)
  useFocusEffect(
    React.useCallback(() => {
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: 'none' },
      });
      return () => {
        // Only restore tab bar when navigating away from this screen completely
        // Don't restore it here to prevent flickering when navigating to child screens
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

  const handleSubmit = async () => {
    if (!agreeToTerms) {
      Alert.alert('Required', 'Please accept the terms and conditions to continue.');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual API call to submit service provider application
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setShowSuccessModal(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit application. Please try again.');
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    // Restore tab bar before navigating away
    navigation.getParent()?.setOptions({
      tabBarStyle: undefined,
    });
    // Navigate back to profile or home
    navigation.getParent()?.navigate('HomeTab', { screen: 'RenterProfile' });
  };

  const InfoRow = ({ label, value, icon }) => (
    <View style={styles.infoRow}>
      <View style={styles.infoRowLeft}>
        {icon && <Ionicons name={icon} size={20} color={theme.colors.primary} />}
        <View style={styles.infoTextContainer}>
          <Text style={[styles.infoLabel, { color: theme.colors.hint }]}>{label}</Text>
          <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>{value}</Text>
        </View>
      </View>
    </View>
  );

  const DocumentPreview = ({ label, uri }) => (
    <View style={styles.documentPreview}>
      <Text style={[styles.documentLabel, { color: theme.colors.textSecondary }]}>{label}</Text>
      {uri ? (
        <Image source={{ uri }} style={styles.documentImage} resizeMode="cover" />
      ) : (
        <View style={[styles.documentPlaceholder, { backgroundColor: theme.colors.background }]}>
          <Ionicons name="document-outline" size={32} color={theme.colors.hint} />
          <Text style={[styles.documentPlaceholderText, { color: theme.colors.hint }]}>
            Not provided
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} />
      {/* Progress Indicator - Top Bar (extends to top including status bar) */}
      <View style={[styles.progressContainer, { backgroundColor: theme.colors.white, paddingTop: insets.top + 8 }]}>
        <View style={styles.progressBar}>
          {[1, 2, 3].map((step) => (
            <View key={step} style={styles.progressStepContainer}>
              <View
                style={[
                  styles.progressStep,
                  {
                    backgroundColor:
                      step <= 3 ? theme.colors.primary : theme.colors.hint + '30',
                  },
                ]}
              >
                {step < 3 ? (
                  <Ionicons name="checkmark" size={16} color={theme.colors.white} />
                ) : (
                  <Text
                    style={[
                      styles.progressStepNumber,
                      { color: step <= 3 ? theme.colors.white : theme.colors.hint },
                    ]}
                  >
                    {step}
                  </Text>
                )}
              </View>
              {step < 3 && (
                <View
                  style={[
                    styles.progressLine,
                    {
                      backgroundColor:
                        step < 3 ? theme.colors.primary : theme.colors.hint + '30',
                    },
                  ]}
                />
              )}
            </View>
          ))}
        </View>
        <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
          Step 3 of 3
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.stepContainer}>
          <Text style={[styles.stepTitle, { color: theme.colors.textPrimary }]}>
            Review Your Application
          </Text>
          <Text style={[styles.stepSubtitle, { color: theme.colors.textSecondary }]}>
            Please review all information before submitting
          </Text>

          {/* Business Information Summary */}
          <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Business Information
            </Text>
            <InfoRow
              label="Business Name"
              value={formData.providerName || 'Not provided'}
              icon="business-outline"
            />
            <InfoRow
              label="Service Type"
              value={formData.serviceType || 'Not provided'}
              icon="briefcase-outline"
            />
            <InfoRow
              label="Location"
              value={formData.location || 'Not provided'}
              icon="location-outline"
            />
            <InfoRow
              label="Email"
              value={formData.email || 'Not provided'}
              icon="mail-outline"
            />
            <InfoRow
              label="Phone"
              value={formData.phone || 'Not provided'}
              icon="call-outline"
            />
            {formData.description && (
              <View style={styles.descriptionContainer}>
                <Text style={[styles.descriptionLabel, { color: theme.colors.hint }]}>
                  Description
                </Text>
                <Text style={[styles.descriptionText, { color: theme.colors.textPrimary }]}>
                  {formData.description}
                </Text>
              </View>
            )}
          </View>

          {/* Documents Summary */}
          <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Documents
            </Text>
            <DocumentPreview
              label="Business Registration"
              uri={formData.businessRegistrationDoc}
            />
            <DocumentPreview label="ID Document" uri={formData.idDocument} />
            {formData.businessLicense && (
              <DocumentPreview label="Business License" uri={formData.businessLicense} />
            )}
            {formData.taxPin && (
              <InfoRow
                label="Tax PIN"
                value={formData.taxPin}
                icon="card-outline"
              />
            )}
            <DocumentPreview label="Profile Photo" uri={formData.profilePhoto} />
          </View>

          {/* Terms and Conditions */}
          <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
            <View style={styles.termsRow}>
              <Toggle
                value={agreeToTerms}
                onValueChange={setAgreeToTerms}
              />
              <View style={styles.termsTextContainer}>
                <Text style={[styles.termsText, { color: theme.colors.textPrimary }]}>
                  I agree to the{' '}
                  <Text
                    style={[styles.termsLink, { color: theme.colors.primary }]}
                    onPress={() => {
                      // TODO: Navigate to terms and conditions
                      Alert.alert('Terms & Conditions', 'Terms and conditions will be shown here.');
                    }}
                  >
                    Terms and Conditions
                  </Text>
                  {' '}and{' '}
                  <Text
                    style={[styles.termsLink, { color: theme.colors.primary }]}
                    onPress={() => {
                      // TODO: Navigate to privacy policy
                      Alert.alert('Privacy Policy', 'Privacy policy will be shown here.');
                    }}
                  >
                    Privacy Policy
                  </Text>
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={[styles.actionBar, { backgroundColor: theme.colors.white }]}>
        <Button
          title="Back"
          onPress={handleBack}
          variant="secondary"
          style={[styles.actionButton, { marginRight: 12 }]}
        />
        <Button
          title="Submit Application"
          onPress={handleSubmit}
          variant="primary"
          loading={loading}
          disabled={!agreeToTerms}
          style={[styles.actionButton, { flex: 1 }]}
        />
      </View>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={handleSuccessClose}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.white }]}>
            <View style={[styles.successIconCircle, { backgroundColor: '#4CAF50' + '20' }]}>
              <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
            </View>
            <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
              Application Submitted!
            </Text>
            <Text style={[styles.modalMessage, { color: theme.colors.textSecondary }]}>
              Thank you for your interest in becoming a service provider. We've received your
              application and will review it. You'll be contacted within 3-5 business days.
            </Text>
            <Button
              title="Got it"
              onPress={handleSuccessClose}
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
  progressContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  progressStepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressStep: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressStepNumber: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  progressLine: {
    width: 60,
    height: 3,
    marginHorizontal: 4,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 120,
    paddingTop: 120,
  },
  stepContainer: {
    paddingHorizontal: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  stepSubtitle: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 24,
    lineHeight: 22,
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  descriptionContainer: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  descriptionLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  documentPreview: {
    marginBottom: 16,
  },
  documentLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  documentImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  documentPlaceholder: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentPlaceholderText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    marginTop: 8,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  termsTextContainer: {
    flex: 1,
  },
  termsText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  termsLink: {
    fontFamily: 'Nunito_600SemiBold',
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  actionButton: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '85%',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
  },
  successIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
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

export default ServiceProviderStep3Screen;

