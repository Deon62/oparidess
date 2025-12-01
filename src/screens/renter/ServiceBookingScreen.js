import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ServiceBookingScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { service, category } = route.params || {};

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [dateInput, setDateInput] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Book Service',
    });
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: 'none' },
    });
    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
    };
  }, [navigation]);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleDateInputChange = (text) => {
    setDateInput(text);
    // Try to parse the date
    const parsed = new Date(text);
    if (!isNaN(parsed.getTime()) && parsed >= new Date()) {
      setSelectedDate(parsed);
    }
  };

  const handleTimeInputChange = (text) => {
    setTimeInput(text);
    // Try to parse time (format: HH:MM AM/PM)
    const timeRegex = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i;
    const match = text.match(timeRegex);
    if (match) {
      let hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      const ampm = match[3].toUpperCase();
      
      if (ampm === 'PM' && hours !== 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
      
      const newTime = new Date();
      newTime.setHours(hours, minutes, 0, 0);
      setSelectedTime(newTime);
    }
  };

  const handleContinue = () => {
    if (!contactPhone.trim()) {
      Alert.alert('Required', 'Please enter your contact phone number');
      return;
    }

    const bookingDetails = {
      service: service,
      category: category,
      date: selectedDate.toISOString(), // Convert to string for navigation
      time: selectedTime.toISOString(), // Convert to string for navigation
      contactPhone: contactPhone.trim(),
      additionalNotes: additionalNotes.trim(),
      serviceDate: formatDate(selectedDate),
      serviceTime: formatTime(selectedTime),
    };

    navigation.navigate('Payment', {
      totalPrice: parsePrice(service?.price || '0'),
      bookingDetails: {
        ...bookingDetails,
        type: 'service',
      },
    });
  };

  const parsePrice = (priceString) => {
    if (!priceString) return 0;
    const numericString = priceString.replace(/[^\d.]/g, '');
    return parseFloat(numericString) || 0;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Service Summary */}
        <View style={[styles.summaryCard, { backgroundColor: theme.colors.white }]}>
          <Text style={[styles.summaryTitle, { color: theme.colors.textPrimary }]}>
            Service Summary
          </Text>
          <Text style={[styles.serviceName, { color: theme.colors.textPrimary }]}>
            {service?.name || 'Service'}
          </Text>
          <Text style={[styles.serviceCategory, { color: theme.colors.textSecondary }]}>
            {category || service?.category || ''}
          </Text>
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>Price:</Text>
            <Text style={[styles.price, { color: theme.colors.primary }]}>
              {service?.price || 'KSh 0'}
            </Text>
          </View>
        </View>

        {/* Date Selection */}
        <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Select Date
          </Text>
          <View style={[styles.dateTimeInputContainer, { borderColor: theme.colors.hint }]}>
            <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
            <TextInput
              style={[styles.dateTimeInput, { color: theme.colors.textPrimary }]}
              placeholder={formatDate(selectedDate)}
              placeholderTextColor={theme.colors.hint}
              value={dateInput}
              onChangeText={handleDateInputChange}
              onFocus={() => {
                if (!dateInput) {
                  setDateInput(formatDate(selectedDate));
                }
              }}
            />
          </View>
          <Text style={[styles.hintText, { color: theme.colors.hint }]}>
            Format: Day, Month DD, YYYY (e.g., Monday, January 15, 2024)
          </Text>
        </View>

        {/* Time Selection */}
        <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Select Time
          </Text>
          <View style={[styles.dateTimeInputContainer, { borderColor: theme.colors.hint }]}>
            <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
            <TextInput
              style={[styles.dateTimeInput, { color: theme.colors.textPrimary }]}
              placeholder={formatTime(selectedTime)}
              placeholderTextColor={theme.colors.hint}
              value={timeInput}
              onChangeText={handleTimeInputChange}
              onFocus={() => {
                if (!timeInput) {
                  setTimeInput(formatTime(selectedTime));
                }
              }}
            />
          </View>
          <Text style={[styles.hintText, { color: theme.colors.hint }]}>
            Format: HH:MM AM/PM (e.g., 02:30 PM)
          </Text>
        </View>

        {/* Contact Phone */}
        <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Contact Phone Number <Text style={{ color: '#FF3B30' }}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, { 
              borderColor: theme.colors.hint,
              color: theme.colors.textPrimary,
              backgroundColor: theme.colors.background
            }]}
            placeholder="Enter your phone number"
            placeholderTextColor={theme.colors.hint}
            value={contactPhone}
            onChangeText={setContactPhone}
            keyboardType="phone-pad"
          />
        </View>

        {/* Additional Notes */}
        <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Additional Notes (Optional)
          </Text>
          <TextInput
            style={[styles.textArea, { 
              borderColor: theme.colors.hint,
              color: theme.colors.textPrimary,
              backgroundColor: theme.colors.background
            }]}
            placeholder="Any special requests or additional information..."
            placeholderTextColor={theme.colors.hint}
            value={additionalNotes}
            onChangeText={setAdditionalNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

      </ScrollView>

      {/* Continue Button */}
      <View style={[styles.footer, { backgroundColor: theme.colors.white, paddingBottom: insets.bottom }]}>
        <TouchableOpacity
          style={[styles.continueButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={[styles.continueButtonText, { color: theme.colors.white }]}>
            Continue to Payment
          </Text>
          <Ionicons name="arrow-forward" size={20} color={theme.colors.white} />
        </TouchableOpacity>
      </View>
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
    padding: 20,
    gap: 16,
  },
  summaryCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  serviceCategory: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceLabel: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
  },
  price: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
  },
  section: {
    padding: 20,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 12,
  },
  dateTimeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  dateTimeInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
  },
  hintText: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    minHeight: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  continueButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  continueButtonText: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
});

export default ServiceBookingScreen;

