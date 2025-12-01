import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Button } from '../../packages/components';

const BecomeServiceProviderScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    providerName: '',
    serviceType: '',
    details: '',
  });

  const serviceTypes = [
    'Road Trips Agencies',
    'VIP Wedding Fleet Hire',
    'Hire Professional Drivers',
    'Movers',
    'Automobile Parts Shop',
    'VIP Car Detailing',
    'Roadside Assistance',
  ];

  const [showServiceTypeDropdown, setShowServiceTypeDropdown] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Become Service Provider',
    });
  }, [navigation]);

  const handleSubmit = async () => {
    if (!formData.providerName.trim()) {
      alert('Please enter your proposed service provider name');
      return;
    }
    if (!formData.serviceType) {
      alert('Please select a service type');
      return;
    }
    if (!formData.details.trim()) {
      alert('Please provide some details about your service');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual API call to submit service provider application
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setShowSuccessModal(true);
    } catch (error) {
      alert('Failed to submit application. Please try again.');
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigation.goBack();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Beta Notice */}
      <View style={[styles.betaNotice, { backgroundColor: theme.colors.primary + '15', borderColor: theme.colors.primary + '30' }]}>
        <Ionicons name="information-circle" size={24} color={theme.colors.primary} />
        <View style={styles.betaNoticeContent}>
          <Text style={[styles.betaNoticeTitle, { color: theme.colors.primary }]}>
            Services in Beta
          </Text>
          <Text style={[styles.betaNoticeText, { color: theme.colors.textSecondary }]}>
            Our service provider features are currently in beta. We greatly appreciate your interest in providing services on our platform! Your application will be reviewed, and we'll contact you once the features are fully enabled.
          </Text>
        </View>
      </View>

      {/* Form */}
      <View style={[styles.formSection, { backgroundColor: theme.colors.white }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Service Provider Details
        </Text>

        {/* Provider Name */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
            Proposed Service Provider Name *
          </Text>
          <TextInput
            style={[styles.input, { 
              borderColor: theme.colors.hint,
              color: theme.colors.textPrimary,
              backgroundColor: theme.colors.background
            }]}
            placeholder="Enter your business/service name"
            placeholderTextColor={theme.colors.hint}
            value={formData.providerName}
            onChangeText={(text) => setFormData({ ...formData, providerName: text })}
          />
        </View>

        {/* Service Type Dropdown */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
            Type of Service *
          </Text>
          <TouchableOpacity
            style={[styles.dropdown, { 
              borderColor: theme.colors.hint,
              backgroundColor: theme.colors.background
            }]}
            onPress={() => setShowServiceTypeDropdown(!showServiceTypeDropdown)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.dropdownText,
              { color: formData.serviceType ? theme.colors.textPrimary : theme.colors.hint }
            ]}>
              {formData.serviceType || 'Select service type'}
            </Text>
            <Ionicons 
              name={showServiceTypeDropdown ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color={theme.colors.hint} 
            />
          </TouchableOpacity>
          
          {showServiceTypeDropdown && (
            <View style={[styles.dropdownList, { backgroundColor: theme.colors.white, borderColor: theme.colors.hint }]}>
              {serviceTypes.map((type, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dropdownItem,
                    formData.serviceType === type && { backgroundColor: theme.colors.primary + '10' }
                  ]}
                  onPress={() => {
                    setFormData({ ...formData, serviceType: type });
                    setShowServiceTypeDropdown(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    { 
                      color: formData.serviceType === type ? theme.colors.primary : theme.colors.textPrimary 
                    }
                  ]}>
                    {type}
                  </Text>
                  {formData.serviceType === type && (
                    <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Details */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
            Additional Details *
          </Text>
          <TextInput
            style={[styles.textArea, { 
              borderColor: theme.colors.hint,
              color: theme.colors.textPrimary,
              backgroundColor: theme.colors.background
            }]}
            placeholder="Tell us about your service, experience, location, etc."
            placeholderTextColor={theme.colors.hint}
            value={formData.details}
            onChangeText={(text) => setFormData({ ...formData, details: text })}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        <Button
          title="Submit Application"
          onPress={handleSubmit}
          variant="primary"
          loading={loading}
          style={styles.submitButton}
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
              Thank you for your interest in becoming a service provider. We've received your application and will contact you once the service provider features are fully enabled.
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  betaNotice: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  betaNoticeContent: {
    flex: 1,
  },
  betaNoticeTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 8,
  },
  betaNoticeText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  formSection: {
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 24,
    letterSpacing: -0.3,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    flex: 1,
  },
  dropdownList: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    maxHeight: 300,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemText: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    flex: 1,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    minHeight: 120,
  },
  submitButton: {
    marginTop: 8,
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

export default BecomeServiceProviderScreen;

