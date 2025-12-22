import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { COLORS, SPACING, RADIUS, TYPE } from '../../packages/theme/tokens';
import { useUser } from '../../packages/context/UserContext';
import { Input, Button } from '../../packages/components';

const UpdateProfileScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { user, updateUser } = useUser();

  // Get initial data from route params or user context
  const getInitialData = () => {
    const params = route.params?.personalInfo;
    const baseData = {
      first_name: params?.first_name || user?.first_name || '',
      last_name: params?.last_name || user?.last_name || '',
      phone_number: params?.phone_number || user?.phone_number || '',
      date_of_birth: params?.date_of_birth || user?.date_of_birth || '',
      gender: params?.gender || user?.gender || '',
      id_number: params?.id_number || user?.id_number || '',
    };
    // Combine first_name and last_name into full_name
    baseData.full_name = baseData.first_name && baseData.last_name 
      ? `${baseData.first_name} ${baseData.last_name}`.trim()
      : baseData.first_name || baseData.last_name || '';
    return baseData;
  };

  const initialData = getInitialData();

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

  // Ensure StatusBar is dark when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content', true);
      return () => {
        // StatusBar will be restored by other screens
      };
    }, [])
  );

  // Restore tab bar when component unmounts (navigating away completely)
  useEffect(() => {
    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
    };
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

    // All fields are optional, but if provided, validate format
    if (formData.phone_number.trim() && !/^\+?[\d\s-()]+$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Please enter a valid phone number';
    }

    if (formData.date_of_birth.trim()) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.date_of_birth)) {
        newErrors.date_of_birth = 'Please use format YYYY-MM-DD';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please correct the errors in the form.');
      return;
    }

    setLoading(true);
    try {
      // Split full_name into first_name and last_name if provided
      const saveData = { ...formData };
      if (saveData.full_name && saveData.full_name.trim()) {
        const nameParts = saveData.full_name.trim().split(' ');
        saveData.first_name = nameParts[0] || '';
        saveData.last_name = nameParts.slice(1).join(' ') || '';
      }
      // Remove full_name from saveData as it's not stored in the backend
      delete saveData.full_name;

      // TODO: Make API call to update profile
      // For now, update the user context
      updateUser(saveData);

      // Calculate profile completeness (simplified)
      const filledFields = Object.values(saveData).filter(value => value && value.trim()).length;
      const totalFields = Object.keys(saveData).length;
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

  const handleDateSelect = (year, month, day, field) => {
    const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    updateField(field, formattedDate);
    if (field === 'date_of_birth') {
      setShowDateModal(false);
    }
  };

  // Simple date picker component (you can replace with a proper date picker library)
  const DatePickerModal = ({ visible, onClose, onConfirm, title, initialDate, allowFutureYears = false }) => {
    const parseDate = (dateString) => {
      if (!dateString) {
        const defaultYear = allowFutureYears ? new Date().getFullYear() : new Date().getFullYear() - 25;
        return { year: defaultYear, month: 1, day: 1 };
      }
      const parts = dateString.split('-');
      const currentYear = new Date().getFullYear();
      return {
        year: parseInt(parts[0]) || (allowFutureYears ? currentYear : currentYear - 25),
        month: parseInt(parts[1]) || 1,
        day: parseInt(parts[2]) || 1,
      };
    };

    const initial = parseDate(initialDate);
    const [year, setYear] = useState(initial.year);
    const [month, setMonth] = useState(initial.month);
    const [day, setDay] = useState(initial.day);

    // Generate years array - allow future years if needed (for expiry dates)
    const currentYear = new Date().getFullYear();
    const years = allowFutureYears
      ? Array.from({ length: 120 }, (_, i) => currentYear - 100 + i) // 100 years back, 20 years forward
      : Array.from({ length: 100 }, (_, i) => currentYear - i); // Only past years
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.white }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
              {title}
            </Text>
            <View style={styles.datePickerContainer}>
              <ScrollView style={styles.datePickerColumn}>
                {years.map(y => (
                  <TouchableOpacity
                    key={y}
                    style={[
                      styles.dateOption,
                      year === y && { backgroundColor: theme.colors.textPrimary + '10' },
                    ]}
                    onPress={() => setYear(y)}
                  >
                    <Text
                      style={[
                        styles.dateOptionText,
                        { color: theme.colors.textPrimary },
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
                      month === m && { backgroundColor: theme.colors.textPrimary + '10' },
                    ]}
                    onPress={() => setMonth(m)}
                  >
                    <Text
                      style={[
                        styles.dateOptionText,
                        { color: theme.colors.textPrimary },
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
                      day === d && { backgroundColor: theme.colors.textPrimary + '10' },
                    ]}
                    onPress={() => setDay(d)}
                  >
                    <Text
                      style={[
                        styles.dateOptionText,
                        { color: theme.colors.textPrimary },
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
                onPress={onClose}
                variant="secondary"
                style={styles.modalButton}
              />
              <Button
                title="Confirm"
                onPress={() => onConfirm(year, month, day)}
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
    <>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
      {/* Personal Information Form */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Personal Information
        </Text>

        <Input
          label="Full Name"
          placeholder="Enter your full name"
          value={formData.full_name}
          onChangeText={(value) => updateField('full_name', value)}
          error={errors.full_name}
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
            <Ionicons name="calendar-outline" size={20} color={theme.colors.textPrimary} />
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
            <Ionicons name="chevron-down-outline" size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
        </View>

        <Input
          label="ID Number (Optional)"
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
                    backgroundColor: theme.colors.textPrimary + '10',
                  },
                ]}
                onPress={() => handleGenderSelect(option)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    {
                      color: theme.colors.textPrimary,
                    },
                  ]}
                >
                  {option}
                </Text>
                {formData.gender === option && (
                  <Ionicons name="checkmark" size={20} color={theme.colors.textPrimary} />
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

      {/* Date Picker Modals */}
      <DatePickerModal
        visible={showDateModal}
        onClose={() => setShowDateModal(false)}
        onConfirm={(year, month, day) => handleDateSelect(year, month, day, 'date_of_birth')}
        title="Select Date of Birth"
        initialDate={formData.date_of_birth}
      />
    </ScrollView>
    </>
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
    marginHorizontal: SPACING.l,
    marginTop: SPACING.l,
  },
  sectionTitle: {
    fontSize: TYPE.title.fontSize,
    fontFamily: TYPE.title.fontFamily,
    marginBottom: SPACING.s,
    letterSpacing: -0.3,
    color: COLORS.text,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 24,
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
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    paddingHorizontal: SPACING.m,
    minHeight: 48,
    backgroundColor: COLORS.bg,
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
    gap: SPACING.m,
    paddingHorizontal: SPACING.l,
    marginTop: SPACING.l,
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
    borderTopLeftRadius: RADIUS.card,
    borderTopRightRadius: RADIUS.card,
    padding: SPACING.l,
    maxHeight: '80%',
    backgroundColor: COLORS.surface,
  },
  modalTitle: {
    fontSize: TYPE.title.fontSize,
    fontFamily: TYPE.title.fontFamily,
    marginBottom: SPACING.l,
    textAlign: 'center',
    color: COLORS.text,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.m,
    borderRadius: RADIUS.card,
    marginBottom: SPACING.s,
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

