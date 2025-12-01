import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Button } from '../../packages/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ServiceProviderStep1Screen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const formData = route.params?.formData || {};

  const [localFormData, setLocalFormData] = useState({
    providerName: formData.providerName || '',
    serviceType: formData.serviceType || '',
    description: formData.description || '',
    location: formData.location || '',
    email: formData.email || '',
    phone: formData.phone || '',
    priceSetting: formData.priceSetting || '',
    price: formData.price || '',
  });

  const [showServiceTypeModal, setShowServiceTypeModal] = useState(false);
  const [showPriceSettingModal, setShowPriceSettingModal] = useState(false);
  const [errors, setErrors] = useState({});

  const priceSettingOptions = [
    'Fixed Price',
    'Price Range',
    'Contact for Pricing',
  ];

  const serviceTypes = [
    'Road Trips Agencies',
    'VIP Wedding Fleet Hire',
    'Hire Professional Drivers',
    'Movers',
    'Automobile Parts Shop',
    'VIP Car Detailing',
    'Roadside Assistance',
  ];

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

  const validateForm = () => {
    const newErrors = {};
    
    if (!localFormData.providerName.trim()) {
      newErrors.providerName = 'Business name is required';
    }
    if (!localFormData.serviceType) {
      newErrors.serviceType = 'Service type is required';
    }
    if (!localFormData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!localFormData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!localFormData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localFormData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!localFormData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!localFormData.priceSetting) {
      newErrors.priceSetting = 'Price setting is required';
    }
    if (localFormData.priceSetting === 'Fixed Price' || localFormData.priceSetting === 'Price Range') {
      if (!localFormData.price.trim()) {
        newErrors.price = 'Price is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      navigation.navigate('ServiceProviderStep2', {
        formData: { ...formData, ...localFormData },
      });
    }
  };

  const updateField = (field, value) => {
    setLocalFormData({ ...localFormData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

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
                    backgroundColor: step === 1 ? theme.colors.primary : theme.colors.hint + '30',
                  },
                ]}
              >
                <Text style={[styles.progressStepNumber, { color: step === 1 ? theme.colors.white : theme.colors.hint }]}>
                  {step}
                </Text>
              </View>
              {step < 3 && (
                <View
                  style={[
                    styles.progressLine,
                    {
                      backgroundColor: theme.colors.hint + '30',
                    },
                  ]}
                />
              )}
            </View>
          ))}
        </View>
        <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
          Step 1 of 3
        </Text>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          nestedScrollEnabled={true}
          bounces={true}
        >
        <View style={styles.stepContainer}>
          <Text style={[styles.stepTitle, { color: theme.colors.textPrimary }]}>
            Business Information
          </Text>
          <Text style={[styles.stepSubtitle, { color: theme.colors.textSecondary }]}>
            Tell us about your business and the services you provide
          </Text>

          <View style={styles.formSection}>
            {/* Business Name */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
                Business/Service Provider Name *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: errors.providerName ? '#F44336' : theme.colors.hint,
                    color: theme.colors.textPrimary,
                    backgroundColor: theme.colors.white,
                  },
                ]}
                placeholder="Enter your business name"
                placeholderTextColor={theme.colors.hint}
                value={localFormData.providerName}
                onChangeText={(text) => updateField('providerName', text)}
              />
              {errors.providerName && (
                <Text style={styles.errorText}>{errors.providerName}</Text>
              )}
            </View>

            {/* Service Type */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
                Type of Service *
              </Text>
              <TouchableOpacity
                style={[
                  styles.selectField,
                  {
                    borderColor: errors.serviceType ? '#F44336' : theme.colors.hint,
                    backgroundColor: theme.colors.white,
                  },
                ]}
                onPress={() => setShowServiceTypeModal(true)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.selectFieldText,
                    {
                      color: localFormData.serviceType ? theme.colors.textPrimary : theme.colors.hint,
                    },
                  ]}
                >
                  {localFormData.serviceType || 'Select service type'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={theme.colors.hint} />
              </TouchableOpacity>
              {errors.serviceType && (
                <Text style={styles.errorText}>{errors.serviceType}</Text>
              )}
            </View>

            {/* Description */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
                Business Description *
              </Text>
              <TextInput
                style={[
                  styles.textArea,
                  {
                    borderColor: errors.description ? '#F44336' : theme.colors.hint,
                    color: theme.colors.textPrimary,
                    backgroundColor: theme.colors.white,
                  },
                ]}
                placeholder="Describe your business, services, and experience..."
                placeholderTextColor={theme.colors.hint}
                value={localFormData.description}
                onChangeText={(text) => updateField('description', text)}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
              {errors.description && (
                <Text style={styles.errorText}>{errors.description}</Text>
              )}
            </View>

            {/* Location */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
                Business Location *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: errors.location ? '#F44336' : theme.colors.hint,
                    color: theme.colors.textPrimary,
                    backgroundColor: theme.colors.white,
                  },
                ]}
                placeholder="Enter your business address"
                placeholderTextColor={theme.colors.hint}
                value={localFormData.location}
                onChangeText={(text) => updateField('location', text)}
              />
              {errors.location && (
                <Text style={styles.errorText}>{errors.location}</Text>
              )}
            </View>

            {/* Email */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
                Contact Email *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: errors.email ? '#F44336' : theme.colors.hint,
                    color: theme.colors.textPrimary,
                    backgroundColor: theme.colors.white,
                  },
                ]}
                placeholder="business@example.com"
                placeholderTextColor={theme.colors.hint}
                value={localFormData.email}
                onChangeText={(text) => updateField('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* Phone */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
                Contact Phone *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: errors.phone ? '#F44336' : theme.colors.hint,
                    color: theme.colors.textPrimary,
                    backgroundColor: theme.colors.white,
                  },
                ]}
                placeholder="+254 712 345 678"
                placeholderTextColor={theme.colors.hint}
                value={localFormData.phone}
                onChangeText={(text) => updateField('phone', text)}
                keyboardType="phone-pad"
              />
              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone}</Text>
              )}
            </View>

            {/* Price Setting */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
                Price Setting *
              </Text>
              <TouchableOpacity
                style={[
                  styles.selectField,
                  {
                    borderColor: errors.priceSetting ? '#F44336' : theme.colors.hint,
                    backgroundColor: theme.colors.white,
                  },
                ]}
                onPress={() => setShowPriceSettingModal(true)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.selectFieldText,
                    {
                      color: localFormData.priceSetting ? theme.colors.textPrimary : theme.colors.hint,
                    },
                  ]}
                >
                  {localFormData.priceSetting || 'Select price setting'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={theme.colors.hint} />
              </TouchableOpacity>
              {errors.priceSetting && (
                <Text style={styles.errorText}>{errors.priceSetting}</Text>
              )}
            </View>

            {/* Price Input (shown only if Fixed Price or Price Range is selected) */}
            {(localFormData.priceSetting === 'Fixed Price' || localFormData.priceSetting === 'Price Range') && (
              <View style={styles.fieldContainer}>
                <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
                  {localFormData.priceSetting === 'Fixed Price' ? 'Price *' : 'Price Range *'}
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: errors.price ? '#F44336' : theme.colors.hint,
                      color: theme.colors.textPrimary,
                      backgroundColor: theme.colors.white,
                    },
                  ]}
                  placeholder={localFormData.priceSetting === 'Fixed Price' ? 'e.g., KSh 5,000' : 'e.g., KSh 3,000 - KSh 10,000'}
                  placeholderTextColor={theme.colors.hint}
                  value={localFormData.price}
                  onChangeText={(text) => updateField('price', text)}
                  keyboardType="numeric"
                />
                {errors.price && (
                  <Text style={styles.errorText}>{errors.price}</Text>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Action Bar */}
      <View style={[styles.actionBar, { backgroundColor: theme.colors.white }]}>
        <Button
          title="Back"
          onPress={() => navigation.goBack()}
          variant="secondary"
          style={[styles.actionButton, { marginRight: 12 }]}
        />
        <Button
          title="Next"
          onPress={handleNext}
          variant="primary"
          style={[styles.actionButton, { flex: 1 }]}
        />
      </View>

      {/* Service Type Modal */}
      <Modal
        visible={showServiceTypeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowServiceTypeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.white }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
                Select Service Type
              </Text>
              <TouchableOpacity
                onPress={() => setShowServiceTypeModal(false)}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {serviceTypes.map((type, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.modalItem,
                    localFormData.serviceType === type && {
                      backgroundColor: theme.colors.primary + '10',
                    },
                  ]}
                  onPress={() => {
                    updateField('serviceType', type);
                    setShowServiceTypeModal(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      {
                        color:
                          localFormData.serviceType === type
                            ? theme.colors.primary
                            : theme.colors.textPrimary,
                        fontFamily:
                          localFormData.serviceType === type
                            ? 'Nunito_600SemiBold'
                            : 'Nunito_400Regular',
                      },
                    ]}
                  >
                    {type}
                  </Text>
                  {localFormData.serviceType === type && (
                    <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Price Setting Modal */}
      <Modal
        visible={showPriceSettingModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPriceSettingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.white }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
                Select Price Setting
              </Text>
              <TouchableOpacity
                onPress={() => setShowPriceSettingModal(false)}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {priceSettingOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.modalItem,
                    localFormData.priceSetting === option && {
                      backgroundColor: theme.colors.primary + '10',
                    },
                  ]}
                  onPress={() => {
                    updateField('priceSetting', option);
                    if (option === 'Contact for Pricing') {
                      updateField('price', '');
                    }
                    setShowPriceSettingModal(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      {
                        color:
                          localFormData.priceSetting === option
                            ? theme.colors.primary
                            : theme.colors.textPrimary,
                        fontFamily:
                          localFormData.priceSetting === option
                            ? 'Nunito_600SemiBold'
                            : 'Nunito_400Regular',
                      },
                    ]}
                  >
                    {option}
                  </Text>
                  {localFormData.priceSetting === option && (
                    <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
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
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 300,
    paddingTop: 120,
    flexGrow: 1,
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
  formSection: {
    gap: 20,
  },
  fieldContainer: {
    marginBottom: 0,
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
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    minHeight: 120,
  },
  selectField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 50,
  },
  selectFieldText: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    flex: 1,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: '#F44336',
    marginTop: 4,
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalItemText: {
    fontSize: 16,
    flex: 1,
  },
});

export default ServiceProviderStep1Screen;

