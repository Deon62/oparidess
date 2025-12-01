import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, TextInput, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Button } from '../../packages/components';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ServiceProviderStep2Screen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const formData = route.params?.formData || {};

  const [localFormData, setLocalFormData] = useState({
    businessRegistrationDoc: formData.businessRegistrationDoc || null,
    idDocument: formData.idDocument || null,
    businessLicense: formData.businessLicense || null,
    taxPin: formData.taxPin || '',
    profilePhoto: formData.profilePhoto || null,
  });

  const [errors, setErrors] = useState({});

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

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'We need access to your photos to upload documents.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const pickImage = async (fieldName) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setLocalFormData({ ...localFormData, [fieldName]: result.assets[0].uri });
        if (errors[fieldName]) {
          setErrors({ ...errors, [fieldName]: null });
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      console.error('Image picker error:', error);
    }
  };

  const takePhoto = async (fieldName) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'We need access to your camera to take photos.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setLocalFormData({ ...localFormData, [fieldName]: result.assets[0].uri });
        if (errors[fieldName]) {
          setErrors({ ...errors, [fieldName]: null });
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
      console.error('Camera error:', error);
    }
  };

  const showImageOptions = (fieldName) => {
    Alert.alert(
      'Select Document',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: () => takePhoto(fieldName) },
        { text: 'Choose from Gallery', onPress: () => pickImage(fieldName) },
      ],
      { cancelable: true }
    );
  };

  const removeImage = (fieldName) => {
    Alert.alert(
      'Remove Document',
      'Are you sure you want to remove this document?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setLocalFormData({ ...localFormData, [fieldName]: null });
          },
        },
      ]
    );
  };

  const validateForm = () => {
    const newErrors = {};

    // Only profile photo is required, all other documents are optional
    if (!localFormData.profilePhoto) {
      newErrors.profilePhoto = 'Profile photo is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      navigation.navigate('ServiceProviderStep3', {
        formData: { ...formData, ...localFormData },
      });
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const renderDocumentUpload = (fieldName, label, required = true) => {
    const imageUri = localFormData[fieldName];
    const hasError = errors[fieldName];

    return (
      <View style={styles.fieldContainer}>
        <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
          {label} {required && '*'}
        </Text>
        {imageUri ? (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode="cover" />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeImage(fieldName)}
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle" size={24} color="#F44336" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.changeButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => showImageOptions(fieldName)}
              activeOpacity={0.7}
            >
              <Text style={[styles.changeButtonText, { color: theme.colors.white }]}>
                Change
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.uploadButton,
              {
                borderColor: hasError ? '#F44336' : theme.colors.hint,
                backgroundColor: theme.colors.white,
              },
            ]}
            onPress={() => showImageOptions(fieldName)}
            activeOpacity={0.7}
          >
            <Ionicons name="cloud-upload-outline" size={32} color={theme.colors.primary} />
            <Text style={[styles.uploadButtonText, { color: theme.colors.textPrimary }]}>
              Tap to upload
            </Text>
            <Text style={[styles.uploadButtonSubtext, { color: theme.colors.hint }]}>
              Take photo or choose from gallery
            </Text>
          </TouchableOpacity>
        )}
        {hasError && <Text style={styles.errorText}>{hasError}</Text>}
      </View>
    );
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
                    backgroundColor:
                      step <= 2 ? theme.colors.primary : theme.colors.hint + '30',
                  },
                ]}
              >
                {step < 2 ? (
                  <Ionicons name="checkmark" size={16} color={theme.colors.white} />
                ) : (
                  <Text
                    style={[
                      styles.progressStepNumber,
                      { color: step <= 2 ? theme.colors.white : theme.colors.hint },
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
                        step < 2 ? theme.colors.primary : theme.colors.hint + '30',
                    },
                  ]}
                />
              )}
            </View>
          ))}
        </View>
        <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
          Step 2 of 3
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
            Documents & Verification
          </Text>
          <Text style={[styles.stepSubtitle, { color: theme.colors.textSecondary }]}>
            Please upload the required documents for verification
          </Text>

          <View style={styles.formSection}>
            {/* Business Registration Document */}
            {renderDocumentUpload(
              'businessRegistrationDoc',
              'Business Registration Document',
              false
            )}

            {/* ID Document */}
            {renderDocumentUpload('idDocument', 'National ID / Passport', false)}

            {/* Business License (Optional) */}
            {renderDocumentUpload('businessLicense', 'Business License', false)}

            {/* Tax PIN */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
                Tax PIN (Optional)
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: theme.colors.hint,
                    color: theme.colors.textPrimary,
                    backgroundColor: theme.colors.white,
                  },
                ]}
                placeholder="Enter your tax PIN"
                placeholderTextColor={theme.colors.hint}
                value={localFormData.taxPin}
                onChangeText={(text) =>
                  setLocalFormData({ ...localFormData, taxPin: text })
                }
              />
            </View>

            {/* Profile Photo */}
            {renderDocumentUpload('profilePhoto', 'Profile Photo / Logo', true)}
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
          title="Next"
          onPress={handleNext}
          variant="primary"
          style={[styles.actionButton, { flex: 1 }]}
        />
      </View>
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
  formSection: {
    gap: 24,
  },
  fieldContainer: {
    marginBottom: 0,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 8,
  },
  uploadButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
  },
  uploadButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    marginTop: 12,
  },
  uploadButtonSubtext: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    marginTop: 4,
  },
  imagePreviewContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  imagePreview: {
    width: '100%',
    height: 200,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 4,
  },
  changeButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  changeButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
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
});

export default ServiceProviderStep2Screen;

