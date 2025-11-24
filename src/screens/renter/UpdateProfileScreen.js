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
    dl_number: user?.dl_number || '',
    dl_category: user?.dl_category || '',
    dl_issue_date: user?.dl_issue_date || '',
    dl_expiry_date: user?.dl_expiry_date || '',
  };

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showDlIssueDateModal, setShowDlIssueDateModal] = useState(false);
  const [showDlExpiryDateModal, setShowDlExpiryDateModal] = useState(false);
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

    if (formData.dl_issue_date.trim()) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.dl_issue_date)) {
        newErrors.dl_issue_date = 'Please use format YYYY-MM-DD';
      }
    }

    if (formData.dl_expiry_date.trim()) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.dl_expiry_date)) {
        newErrors.dl_expiry_date = 'Please use format YYYY-MM-DD';
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

  const handleDateSelect = (year, month, day, field) => {
    const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    updateField(field, formattedDate);
    if (field === 'date_of_birth') {
      setShowDateModal(false);
    } else if (field === 'dl_issue_date') {
      setShowDlIssueDateModal(false);
    } else if (field === 'dl_expiry_date') {
      setShowDlExpiryDateModal(false);
    }
  };

  // Simple date picker component (you can replace with a proper date picker library)
  const DatePickerModal = ({ visible, onClose, onConfirm, title, initialDate }) => {
    const parseDate = (dateString) => {
      if (!dateString) return { year: new Date().getFullYear() - 25, month: 1, day: 1 };
      const parts = dateString.split('-');
      return {
        year: parseInt(parts[0]) || new Date().getFullYear() - 25,
        month: parseInt(parts[1]) || 1,
        day: parseInt(parts[2]) || 1,
      };
    };

    const initial = parseDate(initialDate);
    const [year, setYear] = useState(initial.year);
    const [month, setMonth] = useState(initial.month);
    const [day, setDay] = useState(initial.day);

    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
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
          label="First Name (Optional)"
          placeholder="Enter your first name"
          value={formData.first_name}
          onChangeText={(value) => updateField('first_name', value)}
          error={errors.first_name}
        />

        <Input
          label="Last Name (Optional)"
          placeholder="Enter your last name"
          value={formData.last_name}
          onChangeText={(value) => updateField('last_name', value)}
          error={errors.last_name}
        />

        <Input
          label="Phone Number (Optional)"
          placeholder="+254 712 345 678"
          value={formData.phone_number}
          onChangeText={(value) => updateField('phone_number', value)}
          keyboardType="phone-pad"
          error={errors.phone_number}
        />

        {/* Date of Birth */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            Date of Birth (Optional)
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
            Gender (Optional)
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
          label="Location (Optional)"
          placeholder="City, Country"
          value={formData.location}
          onChangeText={(value) => updateField('location', value)}
          error={errors.location}
        />

        <Input
          label="Address (Optional)"
          placeholder="Street address"
          value={formData.address}
          onChangeText={(value) => updateField('address', value)}
          multiline
          numberOfLines={2}
          error={errors.address}
        />

        <Input
          label="ID Number (Optional)"
          placeholder="Enter your ID number"
          value={formData.id_number}
          onChangeText={(value) => updateField('id_number', value)}
          keyboardType="numeric"
          error={errors.id_number}
        />
      </View>

      {/* Driving License Information Section */}
      <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Driving License Information
        </Text>
        <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
          Optional - for self-drive car rental
        </Text>

        <Input
          label="Driving License Number"
          placeholder="Enter your driving license number"
          value={formData.dl_number}
          onChangeText={(value) => updateField('dl_number', value)}
          error={errors.dl_number}
        />

        <Input
          label="Driving License Category"
          placeholder="e.g., B, C, D"
          value={formData.dl_category}
          onChangeText={(value) => updateField('dl_category', value)}
          error={errors.dl_category}
        />

        {/* DL Issue Date */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            Driving License Issue Date
          </Text>
          <TouchableOpacity
            style={[
              styles.selectInput,
              {
                borderColor: errors.dl_issue_date
                  ? '#FF3B30'
                  : '#E0E0E0',
                backgroundColor: theme.colors.white,
              },
            ]}
            onPress={() => setShowDlIssueDateModal(true)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.selectInputText,
                {
                  color: formData.dl_issue_date
                    ? theme.colors.textPrimary
                    : theme.colors.hint,
                },
              ]}
            >
              {formData.dl_issue_date || 'Select issue date (YYYY-MM-DD)'}
            </Text>
            <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          {errors.dl_issue_date && (
            <Text style={styles.errorText}>{errors.dl_issue_date}</Text>
          )}
        </View>

        {/* DL Expiry Date */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            Driving License Expiry Date
          </Text>
          <TouchableOpacity
            style={[
              styles.selectInput,
              {
                borderColor: errors.dl_expiry_date
                  ? '#FF3B30'
                  : '#E0E0E0',
                backgroundColor: theme.colors.white,
              },
            ]}
            onPress={() => setShowDlExpiryDateModal(true)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.selectInputText,
                {
                  color: formData.dl_expiry_date
                    ? theme.colors.textPrimary
                    : theme.colors.hint,
                },
              ]}
            >
              {formData.dl_expiry_date || 'Select expiry date (YYYY-MM-DD)'}
            </Text>
            <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          {errors.dl_expiry_date && (
            <Text style={styles.errorText}>{errors.dl_expiry_date}</Text>
          )}
        </View>
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

      {/* Date Picker Modals */}
      <DatePickerModal
        visible={showDateModal}
        onClose={() => setShowDateModal(false)}
        onConfirm={(year, month, day) => handleDateSelect(year, month, day, 'date_of_birth')}
        title="Select Date of Birth"
        initialDate={formData.date_of_birth}
      />
      <DatePickerModal
        visible={showDlIssueDateModal}
        onClose={() => setShowDlIssueDateModal(false)}
        onConfirm={(year, month, day) => handleDateSelect(year, month, day, 'dl_issue_date')}
        title="Select License Issue Date"
        initialDate={formData.dl_issue_date}
      />
      <DatePickerModal
        visible={showDlExpiryDateModal}
        onClose={() => setShowDlExpiryDateModal(false)}
        onConfirm={(year, month, day) => handleDateSelect(year, month, day, 'dl_expiry_date')}
        title="Select License Expiry Date"
        initialDate={formData.dl_expiry_date}
      />
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
    marginBottom: 8,
    letterSpacing: -0.3,
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

