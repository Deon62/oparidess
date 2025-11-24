import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Button, Input } from '../../packages/components';
import * as ImagePicker from 'expo-image-picker';

const AddCarScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [loading, setLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    // Step 1: Basic Car Info
    make: '',
    model: '',
    year: '',
    plate_number: '',
    color: '',
    vehicle_type: '',
    seating_capacity: '',
    fuel_type: '',
    transmission: '',
    mileage: '',
    car_class: '',
    vin_number: '',
    engine_capacity: '',
    description: '',
    // Step 2: Documents
    registration_doc: null,
    insurance_doc: null,
    // Step 3: Photos
    car_photos: [], // Array of up to 5 photo URIs
  });

  // Options for dropdowns
  const vehicleTypes = ['Saloon', 'SUV', 'Van', 'Pickup', 'Hatchback', 'Coupe', 'Convertible'];
  const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
  const transmissionTypes = ['Manual', 'Automatic'];
  const carClasses = ['Essential', 'Executive', 'Signature'];
  const colors = ['White', 'Black', 'Silver', 'Gray', 'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Brown', 'Other'];

  const [showVehicleTypeModal, setShowVehicleTypeModal] = useState(false);
  const [showFuelTypeModal, setShowFuelTypeModal] = useState(false);
  const [showTransmissionModal, setShowTransmissionModal] = useState(false);
  const [showCarClassModal, setShowCarClassModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Add Car',
    });
  }, [navigation]);

  const updateFormData = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateStep1 = () => {
    const requiredFields = [
      'make',
      'model',
      'year',
      'plate_number',
      'color',
      'vehicle_type',
      'seating_capacity',
      'fuel_type',
      'transmission',
      'mileage',
      'car_class',
    ];

    for (const field of requiredFields) {
      if (!formData[field] || formData[field].trim() === '') {
        Alert.alert('Validation Error', `Please fill in ${field.replace('_', ' ')}`);
        return false;
      }
    }

    // Validate year
    const year = parseInt(formData.year);
    const currentYear = new Date().getFullYear();
    if (isNaN(year) || year < 1900 || year > currentYear + 1) {
      Alert.alert('Validation Error', 'Please enter a valid year');
      return false;
    }

    // Validate seating capacity
    const seats = parseInt(formData.seating_capacity);
    if (isNaN(seats) || seats < 2 || seats > 50) {
      Alert.alert('Validation Error', 'Please enter a valid seating capacity (2-50)');
      return false;
    }

    // Validate mileage
    const mileage = parseInt(formData.mileage);
    if (isNaN(mileage) || mileage < 0) {
      Alert.alert('Validation Error', 'Please enter a valid mileage');
      return false;
    }

    return true;
  };

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'We need access to your photos to upload documents and images.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const pickImage = async (type) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: type === 'photo',
        aspect: type === 'photo' ? [4, 3] : undefined,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        if (type === 'registration') {
          updateFormData('registration_doc', result.assets[0].uri);
        } else if (type === 'insurance') {
          updateFormData('insurance_doc', result.assets[0].uri);
        } else if (type === 'photo') {
          if (formData.car_photos.length < 5) {
            updateFormData('car_photos', [...formData.car_photos, result.assets[0].uri]);
          } else {
            Alert.alert('Limit Reached', 'You can only upload up to 5 photos');
          }
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      console.error('Image picker error:', error);
    }
  };

  const takePhoto = async (type) => {
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
        allowsEditing: type === 'photo',
        aspect: type === 'photo' ? [4, 3] : undefined,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        if (type === 'registration') {
          updateFormData('registration_doc', result.assets[0].uri);
        } else if (type === 'insurance') {
          updateFormData('insurance_doc', result.assets[0].uri);
        } else if (type === 'photo') {
          if (formData.car_photos.length < 5) {
            updateFormData('car_photos', [...formData.car_photos, result.assets[0].uri]);
          } else {
            Alert.alert('Limit Reached', 'You can only upload up to 5 photos');
          }
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
      console.error('Camera error:', error);
    }
  };

  const showImageOptions = (type) => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: () => takePhoto(type) },
        { text: 'Choose from Gallery', onPress: () => pickImage(type) },
      ],
      { cancelable: true }
    );
  };

  const removeDocument = (type) => {
    Alert.alert(
      'Remove Document',
      'Are you sure you want to remove this document?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            if (type === 'registration') {
              updateFormData('registration_doc', null);
            } else if (type === 'insurance') {
              updateFormData('insurance_doc', null);
            }
          },
        },
      ]
    );
  };

  const removePhoto = (index) => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const newPhotos = formData.car_photos.filter((_, i) => i !== index);
            updateFormData('car_photos', newPhotos);
          },
        },
      ]
    );
  };

  const validateStep2 = () => {
    if (!formData.registration_doc) {
      Alert.alert('Validation Error', 'Please upload the registration document');
      return false;
    }
    if (!formData.insurance_doc) {
      Alert.alert('Validation Error', 'Please upload the insurance document');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (formData.car_photos.length === 0) {
      Alert.alert('Validation Error', 'Please upload at least one photo of your car');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateStep1()) {
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!validateStep2()) {
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!validateStep3()) {
        return;
      }
      setCurrentStep(4);
      // TODO: Step 4 will be implemented next
      Alert.alert('Next Step', 'Step 4 will be implemented next');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const SelectField = ({ label, value, onPress, placeholder, required }) => (
    <View style={styles.fieldContainer}>
      <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
        {label} {required && <Text style={{ color: '#FF3B30' }}>*</Text>}
      </Text>
      <TouchableOpacity
        style={[
          styles.selectField,
          {
            backgroundColor: theme.colors.background,
            borderColor: value ? theme.colors.primary : theme.colors.hint + '40',
            borderWidth: value ? 2 : 1,
          },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={[styles.selectFieldText, { color: value ? theme.colors.textPrimary : theme.colors.hint }]}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={theme.colors.hint} />
      </TouchableOpacity>
    </View>
  );

  const SelectionModal = ({ visible, onClose, title, options, onSelect, selectedValue }) => (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.white }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>{title}</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalOptions}>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.modalOption,
                  {
                    backgroundColor: selectedValue === option ? theme.colors.primary + '10' : 'transparent',
                  },
                ]}
                onPress={() => {
                  onSelect(option);
                  onClose();
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    {
                      color: selectedValue === option ? theme.colors.primary : theme.colors.textPrimary,
                      fontFamily: selectedValue === option ? 'Nunito_700Bold' : 'Nunito_400Regular',
                    },
                  ]}
                >
                  {option}
                </Text>
                {selectedValue === option && (
                  <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          {[1, 2, 3, 4].map((step) => (
            <View key={step} style={styles.progressStepContainer}>
              <View
                style={[
                  styles.progressStep,
                  {
                    backgroundColor: step <= currentStep ? theme.colors.primary : theme.colors.hint + '30',
                  },
                ]}
              >
                {step < currentStep ? (
                  <Ionicons name="checkmark" size={16} color={theme.colors.white} />
                ) : (
                  <Text style={[styles.progressStepNumber, { color: step <= currentStep ? theme.colors.white : theme.colors.hint }]}>
                    {step}
                  </Text>
                )}
              </View>
              {step < totalSteps && (
                <View
                  style={[
                    styles.progressLine,
                    {
                      backgroundColor: step < currentStep ? theme.colors.primary : theme.colors.hint + '30',
                    },
                  ]}
                />
              )}
            </View>
          ))}
        </View>
        <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
          Step {currentStep} of {totalSteps}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Step 1: Basic Car Info */}
        {currentStep === 1 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: theme.colors.textPrimary }]}>
              Basic Car Information
            </Text>
            <Text style={[styles.stepSubtitle, { color: theme.colors.textSecondary }]}>
              Provide the essential details about your vehicle
            </Text>

            <View style={styles.formSection}>
              <View style={styles.row}>
                <View style={[styles.rowItem, { flex: 1 }]}>
                  <Input
                    label="Make *"
                    placeholder="e.g., Toyota"
                    value={formData.make}
                    onChangeText={(value) => updateFormData('make', value)}
                    autoCapitalize="words"
                  />
                </View>
                <View style={[styles.rowItem, { flex: 1 }]}>
                  <Input
                    label="Model *"
                    placeholder="e.g., Corolla"
                    value={formData.model}
                    onChangeText={(value) => updateFormData('model', value)}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.rowItem, { flex: 1 }]}>
                  <Input
                    label="Year *"
                    placeholder="e.g., 2020"
                    value={formData.year}
                    onChangeText={(value) => updateFormData('year', value.replace(/\D/g, ''))}
                    keyboardType="numeric"
                    maxLength={4}
                  />
                </View>
                <View style={[styles.rowItem, { flex: 1 }]}>
                  <Input
                    label="Plate Number *"
                    placeholder="e.g., KCA 123A"
                    value={formData.plate_number}
                    onChangeText={(value) => updateFormData('plate_number', value.toUpperCase())}
                    autoCapitalize="characters"
                  />
                </View>
              </View>

              <SelectField
                label="Car Class *"
                value={formData.car_class}
                onPress={() => setShowCarClassModal(true)}
                placeholder="Select car class"
                required
              />

              <SelectField
                label="Vehicle Type *"
                value={formData.vehicle_type}
                onPress={() => setShowVehicleTypeModal(true)}
                placeholder="Select vehicle type"
                required
              />

              <View style={styles.row}>
                <View style={[styles.rowItem, { flex: 1 }]}>
                  <SelectField
                    label="Color *"
                    value={formData.color}
                    onPress={() => setShowColorModal(true)}
                    placeholder="Select color"
                    required
                  />
                </View>
                <View style={[styles.rowItem, { flex: 1 }]}>
                  <Input
                    label="Seating Capacity *"
                    placeholder="e.g., 5"
                    value={formData.seating_capacity}
                    onChangeText={(value) => updateFormData('seating_capacity', value.replace(/\D/g, ''))}
                    keyboardType="numeric"
                    maxLength={2}
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.rowItem, { flex: 1 }]}>
                  <SelectField
                    label="Fuel Type *"
                    value={formData.fuel_type}
                    onPress={() => setShowFuelTypeModal(true)}
                    placeholder="Select fuel type"
                    required
                  />
                </View>
                <View style={[styles.rowItem, { flex: 1 }]}>
                  <SelectField
                    label="Transmission *"
                    value={formData.transmission}
                    onPress={() => setShowTransmissionModal(true)}
                    placeholder="Select transmission"
                    required
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.rowItem, { flex: 1 }]}>
                  <Input
                    label="Mileage *"
                    placeholder="e.g., 50000"
                    value={formData.mileage}
                    onChangeText={(value) => updateFormData('mileage', value.replace(/\D/g, ''))}
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.rowItem, { flex: 1 }]}>
                  <Input
                    label="Engine Capacity"
                    placeholder="e.g., 1.8L"
                    value={formData.engine_capacity}
                    onChangeText={(value) => updateFormData('engine_capacity', value)}
                  />
                </View>
              </View>

              <Input
                label="VIN Number"
                placeholder="Vehicle Identification Number (optional)"
                value={formData.vin_number}
                onChangeText={(value) => updateFormData('vin_number', value.toUpperCase())}
                autoCapitalize="characters"
              />

              <Input
                label="Description"
                placeholder="Add any additional notes about your car (optional)"
                value={formData.description}
                onChangeText={(value) => updateFormData('description', value)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                style={styles.textArea}
              />
            </View>
          </View>
        )}

        {/* Step 2: Upload Documents */}
        {currentStep === 2 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: theme.colors.textPrimary }]}>
              Upload Documents
            </Text>
            <Text style={[styles.stepSubtitle, { color: theme.colors.textSecondary }]}>
              Upload required documents for your vehicle
            </Text>

            {/* Info Card */}
            <View style={[styles.infoCard, { backgroundColor: theme.colors.white }]}>
              <Ionicons name="information-circle-outline" size={24} color={theme.colors.primary} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoTitle, { color: theme.colors.textPrimary }]}>
                  Upload Requirements
                </Text>
                <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                  • Ensure documents are clear and all text is visible{'\n'}
                  • Use good lighting when taking photos{'\n'}
                  • Make sure the entire document is within the frame{'\n'}
                  • Avoid glare and shadows
                </Text>
              </View>
            </View>

            {/* Registration Document */}
            <View style={[styles.uploadCard, { backgroundColor: theme.colors.white }]}>
              <View style={styles.uploadCardHeader}>
                <Ionicons name="document-text-outline" size={32} color={theme.colors.primary} />
                <Text style={[styles.uploadCardTitle, { color: theme.colors.textPrimary }]}>
                  Registration Document *
                </Text>
              </View>

              {formData.registration_doc ? (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: formData.registration_doc }} style={styles.imagePreview} resizeMode="cover" />
                  <TouchableOpacity
                    style={[styles.removeImageButton, { backgroundColor: '#F44336' }]}
                    onPress={() => removeDocument('registration')}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash-outline" size={20} color={theme.colors.white} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.changeImageButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => showImageOptions('registration')}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="camera-outline" size={18} color={theme.colors.white} />
                    <Text style={[styles.changeImageText, { color: theme.colors.white }]}>
                      Change
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.uploadButton, { borderColor: theme.colors.primary }]}
                  onPress={() => showImageOptions('registration')}
                  activeOpacity={0.7}
                >
                  <Ionicons name="camera-outline" size={48} color={theme.colors.primary} />
                  <Text style={[styles.uploadButtonText, { color: theme.colors.primary }]}>
                    Tap to Upload
                  </Text>
                  <Text style={[styles.uploadButtonSubtext, { color: theme.colors.hint }]}>
                    Take a photo or choose from gallery
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Insurance Document */}
            <View style={[styles.uploadCard, { backgroundColor: theme.colors.white }]}>
              <View style={styles.uploadCardHeader}>
                <Ionicons name="shield-outline" size={32} color={theme.colors.primary} />
                <Text style={[styles.uploadCardTitle, { color: theme.colors.textPrimary }]}>
                  Insurance Document *
                </Text>
              </View>

              {formData.insurance_doc ? (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: formData.insurance_doc }} style={styles.imagePreview} resizeMode="cover" />
                  <TouchableOpacity
                    style={[styles.removeImageButton, { backgroundColor: '#F44336' }]}
                    onPress={() => removeDocument('insurance')}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash-outline" size={20} color={theme.colors.white} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.changeImageButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => showImageOptions('insurance')}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="camera-outline" size={18} color={theme.colors.white} />
                    <Text style={[styles.changeImageText, { color: theme.colors.white }]}>
                      Change
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.uploadButton, { borderColor: theme.colors.primary }]}
                  onPress={() => showImageOptions('insurance')}
                  activeOpacity={0.7}
                >
                  <Ionicons name="camera-outline" size={48} color={theme.colors.primary} />
                  <Text style={[styles.uploadButtonText, { color: theme.colors.primary }]}>
                    Tap to Upload
                  </Text>
                  <Text style={[styles.uploadButtonSubtext, { color: theme.colors.hint }]}>
                    Take a photo or choose from gallery
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Step 3: Upload Car Photos */}
        {currentStep === 3 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: theme.colors.textPrimary }]}>
              Upload Car Photos
            </Text>
            <Text style={[styles.stepSubtitle, { color: theme.colors.textSecondary }]}>
              Upload up to 5 photos of your car (at least 1 required)
            </Text>

            {/* Photos Grid */}
            <View style={styles.photosGrid}>
              {formData.car_photos.map((photo, index) => (
                <View key={index} style={styles.photoItem}>
                  <Image source={{ uri: photo }} style={styles.photoImage} resizeMode="cover" />
                  <TouchableOpacity
                    style={[styles.removePhotoButton, { backgroundColor: '#F44336' }]}
                    onPress={() => removePhoto(index)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close" size={16} color={theme.colors.white} />
                  </TouchableOpacity>
                </View>
              ))}
              {formData.car_photos.length < 5 && (
                <TouchableOpacity
                  style={[styles.addPhotoButton, { borderColor: theme.colors.primary }]}
                  onPress={() => showImageOptions('photo')}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" size={32} color={theme.colors.primary} />
                  <Text style={[styles.addPhotoText, { color: theme.colors.primary }]}>
                    Add Photo
                  </Text>
                  <Text style={[styles.addPhotoSubtext, { color: theme.colors.hint }]}>
                    {formData.car_photos.length}/5
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {formData.car_photos.length === 0 && (
              <View style={[styles.emptyPhotosCard, { backgroundColor: theme.colors.white }]}>
                <Ionicons name="images-outline" size={48} color={theme.colors.hint} />
                <Text style={[styles.emptyPhotosText, { color: theme.colors.textSecondary }]}>
                  No photos uploaded yet
                </Text>
                <Text style={[styles.emptyPhotosSubtext, { color: theme.colors.hint }]}>
                  Add at least one photo of your car
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Placeholder for step 4 */}
        {currentStep === 4 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: theme.colors.textPrimary }]}>
              Step 4
            </Text>
            <Text style={[styles.stepSubtitle, { color: theme.colors.textSecondary }]}>
              This step will be implemented next
            </Text>
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={[styles.actionsContainer, { backgroundColor: theme.colors.white, borderTopColor: theme.colors.hint + '20' }]}>
        <Button
          title={currentStep === 1 ? 'Cancel' : 'Back'}
          onPress={handleBack}
          variant="secondary"
          style={styles.actionButton}
        />
        <Button
          title={currentStep === totalSteps ? 'Submit' : 'Next'}
          onPress={handleNext}
          variant="primary"
          style={styles.actionButton}
          loading={loading}
        />
      </View>

      {/* Selection Modals */}
      <SelectionModal
        visible={showVehicleTypeModal}
        onClose={() => setShowVehicleTypeModal(false)}
        title="Select Vehicle Type"
        options={vehicleTypes}
        onSelect={(value) => updateFormData('vehicle_type', value)}
        selectedValue={formData.vehicle_type}
      />
      <SelectionModal
        visible={showFuelTypeModal}
        onClose={() => setShowFuelTypeModal(false)}
        title="Select Fuel Type"
        options={fuelTypes}
        onSelect={(value) => updateFormData('fuel_type', value)}
        selectedValue={formData.fuel_type}
      />
      <SelectionModal
        visible={showTransmissionModal}
        onClose={() => setShowTransmissionModal(false)}
        title="Select Transmission"
        options={transmissionTypes}
        onSelect={(value) => updateFormData('transmission', value)}
        selectedValue={formData.transmission}
      />
      <SelectionModal
        visible={showCarClassModal}
        onClose={() => setShowCarClassModal(false)}
        title="Select Car Class"
        options={carClasses}
        onSelect={(value) => updateFormData('car_class', value)}
        selectedValue={formData.car_class}
      />
      <SelectionModal
        visible={showColorModal}
        onClose={() => setShowColorModal(false)}
        title="Select Color"
        options={colors}
        onSelect={(value) => updateFormData('color', value)}
        selectedValue={formData.color}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: 'transparent',
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
    width: 40,
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
  scrollContent: {
    paddingBottom: 20,
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
    gap: 16,
  },
  fieldContainer: {
    marginBottom: 0,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 8,
  },
  selectField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    minHeight: 50,
  },
  selectFieldText: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowItem: {
    flex: 1,
  },
  textArea: {
    minHeight: 100,
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  actionButton: {
    flex: 1,
    marginBottom: 0,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
  },
  modalOptions: {
    padding: 8,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginVertical: 4,
  },
  modalOptionText: {
    fontSize: 16,
  },
  // Step 2 & 3 Styles
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    gap: 12,
    marginBottom: 24,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  uploadCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  uploadCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  uploadCardTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  imagePreviewContainer: {
    position: 'relative',
    width: '100%',
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeImageButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  changeImageText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  uploadButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 48,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 250,
  },
  uploadButtonText: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginTop: 16,
  },
  uploadButtonSubtext: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    marginTop: 8,
    textAlign: 'center',
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  photoItem: {
    position: 'relative',
    width: '47%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoButton: {
    width: '47%',
    aspectRatio: 1,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addPhotoText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  addPhotoSubtext: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  emptyPhotosCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 16,
  },
  emptyPhotosText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyPhotosSubtext: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default AddCarScreen;
