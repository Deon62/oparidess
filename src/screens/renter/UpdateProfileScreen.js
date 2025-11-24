import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useUser } from '../../packages/context/UserContext';
import { Input, Button } from '../../packages/components';

const UpdateProfileScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { user, updateUser } = useUser();

  // Get initial data from route params or user context
  const initialData = route.params?.personalInfo || {
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone_number: user?.phone_number || '',
    date_of_birth: user?.date_of_birth || '',
    gender: user?.gender || '',
    location: user?.location || '',
    address: user?.address || '',
    id_number: user?.id_number || '',
  };

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Set header title
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Update Profile',
    });
  }, [navigation]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Please enter a valid phone number';
    }

    if (!formData.date_of_birth.trim()) {
      newErrors.date_of_birth = 'Date of birth is required';
    } else {
      // Basic date validation (YYYY-MM-DD format)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.date_of_birth)) {
        newErrors.date_of_birth = 'Please use format YYYY-MM-DD';
      }
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.id_number.trim()) {
      newErrors.id_number = 'ID number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields correctly.');
      return;
    }

    setLoading(true);
    try {
      // TODO: Make API call to update profile
      // For now, update the user context
      updateUser(formData);

      // Calculate profile completeness (simplified)
      const filledFields = Object.values(formData).filter(value => value && value.trim()).length;
      const totalFields = Object.keys(formData).length;
      const completeness = Math.round((filledFields / totalFields) * 100);
      
      updateUser({ profile_completeness: completeness });

      Alert.alert(
        'Success',
        'Profile updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
      console.error('Update profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Discard Changes?',
      'Are you sure you want to discard your changes?',
      [
        {
          text: 'Keep Editing',
          style: 'cancel',
        },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];

  const handleGenderSelect = (gender) => {
    updateField('gender', gender);
    setShowGenderModal(false);
  };

  const handleDateSelect = (year, month, day) => {
    const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    updateField('date_of_birth', formattedDate);
    setShowDateModal(false);
  };

  // Simple date picker component (you can replace with a proper date picker library)
  const DatePickerModal = () => {
    const [year, setYear] = useState(new Date().getFullYear() - 25);
    const [month, setMonth] = useState(1);
    const [day, setDay] = useState(1);

    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    return (
      <Modal
        visible={showDateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.white }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
              Select Date of Birth
            </Text>
            <View style={styles.datePickerContainer}>
              <ScrollView style={styles.datePickerColumn}>
                {years.map(y => (
                  <TouchableOpacity
                    key={y}
                    style={[
                      styles.dateOption,
                      year === y && { backgroundColor: theme.colors.primary + '20' },
                    ]}
                    onPress={() => setYear(y)}
                  >
                    <Text
                      style={[
                        styles.dateOptionText,
                        { color: year === y ? theme.colors.primary : theme.colors.textPrimary },
                      ]}
                    >
                      {y}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <ScrollView style={styles.datePickerColumn}>
                {months.map(m => (
                  <TouchableOpacity
                    key={m}
                    style={[
                      styles.dateOption,
                      month === m && { backgroundColor: theme.colors.primary + '20' },
                    ]}
                    onPress={() => setMonth(m)}
                  >
                    <Text
                      style={[
                        styles.dateOptionText,
                        { color: month === m ? theme.colors.primary : theme.colors.textPrimary },
                      ]}
                    >
                      {m}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <ScrollView style={styles.datePickerColumn}>
                {days.map(d => (
                  <TouchableOpacity
                    key={d}
                    style={[
                      styles.dateOption,
                      day === d && { backgroundColor: theme.colors.primary + '20' },
                    ]}
                    onPress={() => setDay(d)}
                  >
                    <Text
                      style={[
                        styles.dateOptionText,
                        { color: day === d ? theme.colors.primary : theme.colors.textPrimary },
                      ]}
                    >
                      {d}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setShowDateModal(false)}
                variant="secondary"
                style={styles.modalButton}
              />
              <Button
                title="Confirm"
                onPress={() => handleDateSelect(year, month, day)}
                variant="primary"
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Personal Information Form */}
      <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Personal Information
        </Text>

        <Input
          label="First Name"
          placeholder="Enter your first name"
          value={formData.first_name}
          onChangeText={(value) => updateField('first_name', value)}
          error={errors.first_name}
        />

        <Input
          label="Last Name"
          placeholder="Enter your last name"
          value={formData.last_name}
          onChangeText={(value) => updateField('last_name', value)}
          error={errors.last_name}
        />

        <Input
          label="Phone Number"
          placeholder="+254 712 345 678"
          value={formData.phone_number}
          onChangeText={(value) => updateField('phone_number', value)}
          keyboardType="phone-pad"
          error={errors.phone_number}
        />

        {/* Date of Birth */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            Date of Birth
          </Text>
          <TouchableOpacity
            style={[
              styles.selectInput,
              {
                borderColor: errors.date_of_birth
                  ? '#FF3B30'
                  : '#E0E0E0',
                backgroundColor: theme.colors.white,
              },
            ]}
            onPress={() => setShowDateModal(true)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.selectInputText,
                {
                  color: formData.date_of_birth
                    ? theme.colors.textPrimary
                    : theme.colors.hint,
                },
              ]}
            >
              {formData.date_of_birth || 'Select date (YYYY-MM-DD)'}
            </Text>
            <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          {errors.date_of_birth && (
            <Text style={styles.errorText}>{errors.date_of_birth}</Text>
          )}
        </View>

        {/* Gender Selector */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            Gender
          </Text>
          <TouchableOpacity
            style={[
              styles.selectInput,
              {
                borderColor: errors.gender ? '#FF3B30' : '#E0E0E0',
                backgroundColor: theme.colors.white,
              },
            ]}
            onPress={() => setShowGenderModal(true)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.selectInputText,
                {
                  color: formData.gender ? theme.colors.textPrimary : theme.colors.hint,
                },
              ]}
            >
              {formData.gender || 'Select gender'}
            </Text>
            <Ionicons name="chevron-down-outline" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
        </View>

        <Input
          label="Location"
          placeholder="City, Country"
          value={formData.location}
          onChangeText={(value) => updateField('location', value)}
          error={errors.location}
        />

        <Input
          label="Address"
          placeholder="Street address"
          value={formData.address}
          onChangeText={(value) => updateField('address', value)}
          multiline
          numberOfLines={2}
          error={errors.address}
        />

        <Input
          label="ID Number"
          placeholder="Enter your ID number"
          value={formData.id_number}
          onChangeText={(value) => updateField('id_number', value)}
          keyboardType="numeric"
          error={errors.id_number}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <Button
          title="Cancel"
          onPress={handleCancel}
          variant="secondary"
          style={styles.actionButton}
        />
        <Button
          title="Save Changes"
          onPress={handleSave}
          variant="primary"
          style={styles.actionButton}
          loading={loading}
        />
      </View>

      {/* Bottom Spacing */}
      <View style={{ height: 40 }} />

      {/* Gender Selection Modal */}
      <Modal
        visible={showGenderModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGenderModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.white }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
              Select Gender
            </Text>
            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.modalOption,
                  formData.gender === option && {
                    backgroundColor: theme.colors.primary + '20',
                  },
                ]}
                onPress={() => handleGenderSelect(option)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    {
                      color:
                        formData.gender === option
                          ? theme.colors.primary
                          : theme.colors.textPrimary,
                    },
                  ]}
                >
                  {option}
                </Text>
                {formData.gender === option && (
                  <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            ))}
            <Button
              title="Cancel"
              onPress={() => setShowGenderModal(false)}
              variant="secondary"
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>

      {/* Date Picker Modal */}
      <DatePickerModal />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  section: {
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 24,
    letterSpacing: -0.3,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 8,
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  selectInputText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    paddingVertical: 12,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Nunito_400Regular',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  modalOptionText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  modalButton: {
    marginTop: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  datePickerContainer: {
    flexDirection: 'row',
    height: 200,
    marginVertical: 20,
  },
  datePickerColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  dateOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
    alignItems: 'center',
  },
  dateOptionText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
});

export default UpdateProfileScreen;

