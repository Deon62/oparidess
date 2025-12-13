import React, { useCallback, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useUser } from '../../packages/context/UserContext';
import { Input, Button } from '../../packages/components';

const DriversLicenseInfoScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { user, updateUser } = useUser();

  const [dlNumber, setDlNumber] = useState(user?.dl_number || '');
  const [dlCategory, setDlCategory] = useState(user?.dl_category || '');
  const [dlIssueDate, setDlIssueDate] = useState(user?.dl_issue_date || '');
  const [dlExpiryDate, setDlExpiryDate] = useState(user?.dl_expiry_date || '');

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showIssueDateModal, setShowIssueDateModal] = useState(false);
  const [showExpiryDateModal, setShowExpiryDateModal] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Driver's Licence Info",
      headerShown: true,
      statusBarStyle: 'dark',
      statusBarBackgroundColor: 'transparent',
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
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

  const validate = () => {
    const newErrors = {};
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (dlIssueDate.trim() && !dateRegex.test(dlIssueDate.trim())) {
      newErrors.dl_issue_date = 'Please use format YYYY-MM-DD';
    }

    if (dlExpiryDate.trim() && !dateRegex.test(dlExpiryDate.trim())) {
      newErrors.dl_expiry_date = 'Please use format YYYY-MM-DD';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      Alert.alert('Validation Error', 'Please correct the errors in the form.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        dl_number: dlNumber.trim(),
        dl_category: dlCategory.trim(),
        dl_issue_date: dlIssueDate.trim(),
        dl_expiry_date: dlExpiryDate.trim(),
      };

      updateUser(payload);

      Alert.alert('Success', "Driver's licence info updated.", [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Error', "Failed to update driver's licence info. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    Alert.alert(
      'Clear licence info?',
      'This will remove the saved licence information from your profile.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setDlNumber('');
            setDlCategory('');
            setDlIssueDate('');
            setDlExpiryDate('');
            setErrors({});
          },
        },
      ]
    );
  };

  const handleDateSelect = (year, month, day, field) => {
    const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (field === 'dl_issue_date') {
      setDlIssueDate(formattedDate);
      setShowIssueDateModal(false);
    }
    if (field === 'dl_expiry_date') {
      setDlExpiryDate(formattedDate);
      setShowExpiryDateModal(false);
    }
  };

  const DatePickerModal = ({ visible, onClose, onConfirm, title, initialDate, allowFutureYears = false }) => {
    const parseDate = (dateString) => {
      if (!dateString) {
        const defaultYear = allowFutureYears ? new Date().getFullYear() : new Date().getFullYear() - 5;
        return { year: defaultYear, month: 1, day: 1 };
      }
      const parts = dateString.split('-');
      const currentYear = new Date().getFullYear();
      return {
        year: parseInt(parts[0]) || (allowFutureYears ? currentYear : currentYear - 5),
        month: parseInt(parts[1]) || 1,
        day: parseInt(parts[2]) || 1,
      };
    };

    const initial = parseDate(initialDate);
    const [year, setYear] = useState(initial.year);
    const [month, setMonth] = useState(initial.month);
    const [day, setDay] = useState(initial.day);

    const currentYear = new Date().getFullYear();
    const years = allowFutureYears
      ? Array.from({ length: 120 }, (_, i) => currentYear - 100 + i)
      : Array.from({ length: 50 }, (_, i) => currentYear - i);
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
                {years.map((y) => (
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
                {months.map((m) => (
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
                {days.map((d) => (
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="card-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Driver's Licence Information
            </Text>
          </View>

          <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
            Keep this info up to date for self-drive rentals.
          </Text>

          <Input
            label="Licence Number"
            placeholder="Enter your licence number"
            value={dlNumber}
            onChangeText={(v) => {
              setDlNumber(v);
              if (errors.dl_number) setErrors((p) => ({ ...p, dl_number: null }));
            }}
            error={errors.dl_number}
          />

          <Input
            label="Category"
            placeholder="e.g., B, C, D"
            value={dlCategory}
            onChangeText={(v) => {
              setDlCategory(v);
              if (errors.dl_category) setErrors((p) => ({ ...p, dl_category: null }));
            }}
            error={errors.dl_category}
          />

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Issue Date
            </Text>
            <TouchableOpacity
              style={[
                styles.selectInput,
                {
                  borderColor: errors.dl_issue_date ? '#FF3B30' : '#E0E0E0',
                  backgroundColor: theme.colors.white,
                },
              ]}
              onPress={() => setShowIssueDateModal(true)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.selectInputText,
                  {
                    color: dlIssueDate ? theme.colors.textPrimary : theme.colors.hint,
                  },
                ]}
              >
                {dlIssueDate || 'Select issue date (YYYY-MM-DD)'}
              </Text>
              <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
            {errors.dl_issue_date && <Text style={styles.errorText}>{errors.dl_issue_date}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Expiry Date
            </Text>
            <TouchableOpacity
              style={[
                styles.selectInput,
                {
                  borderColor: errors.dl_expiry_date ? '#FF3B30' : '#E0E0E0',
                  backgroundColor: theme.colors.white,
                },
              ]}
              onPress={() => setShowExpiryDateModal(true)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.selectInputText,
                  {
                    color: dlExpiryDate ? theme.colors.textPrimary : theme.colors.hint,
                  },
                ]}
              >
                {dlExpiryDate || 'Select expiry date (YYYY-MM-DD)'}
              </Text>
              <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
            {errors.dl_expiry_date && <Text style={styles.errorText}>{errors.dl_expiry_date}</Text>}
          </View>
        </View>

        <View style={styles.actionButtonsContainer}>
          <Button
            title="Clear"
            onPress={handleClear}
            variant="secondary"
            style={styles.actionButton}
            disabled={loading}
          />
          <Button
            title="Save"
            onPress={handleSave}
            variant="primary"
            style={styles.actionButton}
            loading={loading}
            disabled={loading}
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <DatePickerModal
        visible={showIssueDateModal}
        onClose={() => setShowIssueDateModal(false)}
        onConfirm={(year, month, day) => handleDateSelect(year, month, day, 'dl_issue_date')}
        title="Select Licence Issue Date"
        initialDate={dlIssueDate}
      />

      <DatePickerModal
        visible={showExpiryDateModal}
        onClose={() => setShowExpiryDateModal(false)}
        onConfirm={(year, month, day) => handleDateSelect(year, month, day, 'dl_expiry_date')}
        title="Select Licence Expiry Date"
        initialDate={dlExpiryDate}
        allowFutureYears={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
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
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 18,
    lineHeight: 20,
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
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
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

export default DriversLicenseInfoScreen;
