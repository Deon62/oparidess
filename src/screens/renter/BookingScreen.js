import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Button, Input, Toggle } from '../../packages/components';
import { formatCurrency, formatPricePerDay, parseCurrency } from '../../packages/utils/currency';

const BookingScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { car } = route.params || {};

  const [pickupDate, setPickupDate] = useState(null);
  const [dropoffDate, setDropoffDate] = useState(null);
  const [showPickupCalendar, setShowPickupCalendar] = useState(false);
  const [showDropoffCalendar, setShowDropoffCalendar] = useState(false);
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);
  const [isSelectingPickup, setIsSelectingPickup] = useState(true);
  const [payOnSite, setPayOnSite] = useState(false);
  const [insuranceEnabled, setInsuranceEnabled] = useState(false);
  
  // Time selection
  const [pickupTime, setPickupTime] = useState('10:00');
  const [dropoffTime, setDropoffTime] = useState('10:00');
  const [showPickupTimePicker, setShowPickupTimePicker] = useState(false);
  const [showDropoffTimePicker, setShowDropoffTimePicker] = useState(false);
  
  // Location selection
  const [pickupLocation, setPickupLocation] = useState('Nairobi CBD, Kenya');
  const [dropoffLocation, setDropoffLocation] = useState('Nairobi CBD, Kenya');
  const [sameDropoffLocation, setSameDropoffLocation] = useState(true);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [isSelectingPickupLocation, setIsSelectingPickupLocation] = useState(true);
  
  // Available locations (mock data - in real app, fetch from backend)
  const availableLocations = [
    { id: 1, name: 'Nairobi CBD, Kenya', address: 'Moi Avenue, Nairobi CBD', coordinates: { latitude: -1.2921, longitude: 36.8219 } },
    { id: 2, name: 'Westlands, Nairobi', address: 'Westlands Road, Nairobi', coordinates: { latitude: -1.2634, longitude: 36.8065 } },
    { id: 3, name: 'Karen, Nairobi', address: 'Karen Road, Nairobi', coordinates: { latitude: -1.3197, longitude: 36.7074 } },
    { id: 4, name: 'Kilimani, Nairobi', address: 'Argwings Kodhek Road, Nairobi', coordinates: { latitude: -1.2856, longitude: 36.7819 } },
    { id: 5, name: 'Jomo Kenyatta Airport', address: 'Embakasi, Nairobi', coordinates: { latitude: -1.3192, longitude: 36.9278 } },
  ];

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

  // Calculate dates
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Get rental info from car or defaults
  const rentalInfo = {
    perDay: car?.price ? parseCurrency(car.price.replace('/day', '')) : 4500,
    deposit: 20000,
    minimumDays: 3,
  };

  // Calculate number of days
  const calculateDays = () => {
    if (!pickupDate || !dropoffDate) return 0;
    const diffTime = dropoffDate.getTime() - pickupDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const days = calculateDays();
  const insuranceCost = insuranceEnabled ? 1500 * days : 0;
  const basePrice = rentalInfo.perDay * days;
  const totalPrice = basePrice + insuranceCost;
  
  // Commission rate (15%)
  const COMMISSION_RATE = 0.15;
  const bookingFee = payOnSite ? totalPrice * COMMISSION_RATE : 0;
  const balanceToPayOnSite = payOnSite ? totalPrice - bookingFee : 0;

  // Calendar functions
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (date) => {
    if (!date) return 'Select date';
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDateSelect = (day, month, year) => {
    const selectedDate = new Date(year, month, day);
    if (isSelectingPickup) {
      setPickupDate(selectedDate);
      setShowPickupCalendar(false);
      // If dropoff date is before pickup, clear it
      if (dropoffDate && dropoffDate < selectedDate) {
        setDropoffDate(null);
      }
    } else {
      // Ensure dropoff is after pickup
      if (pickupDate && selectedDate <= pickupDate) {
        return; // Don't allow dropoff before or on pickup date
      }
      setDropoffDate(selectedDate);
      setShowDropoffCalendar(false);
    }
  };

  const openCalendar = (isPickup) => {
    setIsSelectingPickup(isPickup);
    if (isPickup) {
      setShowPickupCalendar(true);
    } else {
      setShowDropoffCalendar(true);
    }
  };

  const handleContinue = () => {
    if (!pickupDate || !dropoffDate) {
      Alert.alert('Error', 'Please select both pickup and dropoff dates');
      return;
    }
    if (days < rentalInfo.minimumDays) {
      Alert.alert(
        'Error',
        `Minimum rental period is ${rentalInfo.minimumDays} ${rentalInfo.minimumDays === 1 ? 'day' : 'days'}`
      );
      return;
    }
    if (!pickupLocation) {
      Alert.alert('Error', 'Please select a pickup location');
      return;
    }
    if (!sameDropoffLocation && !dropoffLocation) {
      Alert.alert('Error', 'Please select a dropoff location');
      return;
    }
    
    // Navigate to confirmation screen
    // Convert Date objects to ISO strings for navigation (React Navigation requires serializable values)
    navigation.navigate('BookingConfirmation', {
      bookingDetails: {
        car,
        pickupDate: pickupDate ? pickupDate.toISOString() : null,
        dropoffDate: dropoffDate ? dropoffDate.toISOString() : null,
        pickupTime,
        dropoffTime,
        pickupLocation: pickupLocation,
        dropoffLocation: sameDropoffLocation ? pickupLocation : dropoffLocation,
        days,
        specialRequirements,
        insuranceEnabled,
        payOnSite,
        bookingFee: payOnSite ? bookingFee : 0,
        totalRentalPrice: totalPrice,
        basePrice,
        insuranceCost,
        rentalInfo,
      },
    });
  };

  // Calendar Component
  const Calendar = ({ visible, onClose, selectedDate, minDate }) => {
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const monthName = new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const daysArray = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      daysArray.push(null);
    }
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      daysArray.push(day);
    }

    const isDateDisabled = (day) => {
      const date = new Date(currentYear, currentMonth, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (date < today) return true; // Past dates disabled
      
      if (isSelectingPickup) {
        return false; // For pickup, only past dates are disabled
      } else {
        // For dropoff, dates before or equal to pickup are disabled
        if (pickupDate) {
          const pickup = new Date(pickupDate);
          pickup.setHours(0, 0, 0, 0);
          return date <= pickup;
        }
        return false;
      }
    };

    const isDateSelected = (day) => {
      if (!selectedDate || !day) return false;
      const date = new Date(currentYear, currentMonth, day);
      return (
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear()
      );
    };

    const navigateMonth = (direction) => {
      if (direction === 'prev') {
        if (currentMonth === 0) {
          setCurrentMonth(11);
          setCurrentYear(currentYear - 1);
        } else {
          setCurrentMonth(currentMonth - 1);
        }
      } else {
        if (currentMonth === 11) {
          setCurrentMonth(0);
          setCurrentYear(currentYear + 1);
        } else {
          setCurrentMonth(currentMonth + 1);
        }
      }
    };

    return (
      <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <View style={styles.calendarModalOverlay}>
          <View style={[styles.calendarModal, { backgroundColor: theme.colors.white }]}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={() => navigateMonth('prev')} style={styles.calendarNavButton}>
                <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
              </TouchableOpacity>
              <Text style={[styles.calendarMonth, { color: theme.colors.textPrimary }]}>
                {monthName}
              </Text>
              <TouchableOpacity onPress={() => navigateMonth('next')} style={styles.calendarNavButton}>
                <Ionicons name="chevron-forward" size={24} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.calendarWeekDays}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <Text key={day} style={[styles.weekDay, { color: theme.colors.hint }]}>
                  {day}
                </Text>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {daysArray.map((day, index) => {
                if (day === null) {
                  return <View key={index} style={styles.calendarDay} />;
                }
                const disabled = isDateDisabled(day);
                const selected = isDateSelected(day);
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.calendarDay,
                      selected && { backgroundColor: theme.colors.primary },
                      disabled && styles.calendarDayDisabled,
                    ]}
                    onPress={() => !disabled && handleDateSelect(day, currentMonth, currentYear)}
                    disabled={disabled}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.calendarDayText,
                        { color: disabled ? theme.colors.hint : theme.colors.textPrimary },
                        selected && { color: theme.colors.white, fontFamily: 'Nunito_700Bold' },
                      ]}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Button
              title="Close"
              onPress={onClose}
              variant="secondary"
              style={styles.calendarCloseButton}
            />
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Select Dates
          </Text>

          <View style={styles.dateRow}>
            <View style={styles.dateInputContainer}>
              <Text style={[styles.dateLabel, { color: theme.colors.textSecondary }]}>
                Pickup Date
              </Text>
              <TouchableOpacity
                style={[styles.dateButton, { borderColor: theme.colors.hint }]}
                onPress={() => openCalendar(true)}
                activeOpacity={0.7}
              >
                <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
                <Text
                  style={[
                    styles.dateButtonText,
                    { color: pickupDate ? theme.colors.textPrimary : theme.colors.hint },
                  ]}
                >
                  {formatDate(pickupDate)}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateInputContainer}>
              <Text style={[styles.dateLabel, { color: theme.colors.textSecondary }]}>
                Dropoff Date
              </Text>
              <TouchableOpacity
                style={[
                  styles.dateButton,
                  { borderColor: theme.colors.hint },
                  !pickupDate && styles.dateButtonDisabled,
                ]}
                onPress={() => pickupDate && openCalendar(false)}
                disabled={!pickupDate}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={pickupDate ? theme.colors.primary : theme.colors.hint}
                />
                <Text
                  style={[
                    styles.dateButtonText,
                    { color: dropoffDate ? theme.colors.textPrimary : theme.colors.hint },
                  ]}
                >
                  {formatDate(dropoffDate)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {days > 0 && (
            <View style={styles.daysInfo}>
              <Text style={[styles.daysText, { color: theme.colors.textSecondary }]}>
                {days} {days === 1 ? 'day' : 'days'} rental
              </Text>
            </View>
          )}
        </View>

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Time Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Select Times
          </Text>

          <View style={styles.dateRow}>
            <View style={styles.dateInputContainer}>
              <Text style={[styles.dateLabel, { color: theme.colors.textSecondary }]}>
                Pickup Time
              </Text>
              <TouchableOpacity
                style={[styles.dateButton, { borderColor: theme.colors.hint }]}
                onPress={() => setShowPickupTimePicker(true)}
                activeOpacity={0.7}
              >
                <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
                <Text style={[styles.dateButtonText, { color: theme.colors.textPrimary }]}>
                  {pickupTime}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateInputContainer}>
              <Text style={[styles.dateLabel, { color: theme.colors.textSecondary }]}>
                Dropoff Time
              </Text>
              <TouchableOpacity
                style={[styles.dateButton, { borderColor: theme.colors.hint }]}
                onPress={() => setShowDropoffTimePicker(true)}
                activeOpacity={0.7}
              >
                <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
                <Text style={[styles.dateButtonText, { color: theme.colors.textPrimary }]}>
                  {dropoffTime}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Location Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Pickup Location
          </Text>
          <TouchableOpacity
            style={[styles.locationButton, { borderColor: theme.colors.hint }]}
            onPress={() => {
              setIsSelectingPickupLocation(true);
              setShowLocationPicker(true);
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="location-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.locationButtonText, { color: theme.colors.textPrimary }]}>
              {pickupLocation || 'Select pickup location'}
            </Text>
            <Ionicons name="chevron-forward-outline" size={20} color={theme.colors.hint} />
          </TouchableOpacity>
        </View>

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Dropoff Location */}
        <View style={styles.section}>
          <View style={styles.dropoffLocationHeader}>
            <View style={styles.dropoffLocationHeaderLeft}>
              <Text style={[styles.dropoffLocationText, { color: theme.colors.textPrimary }]}>
                Same dropoff location
              </Text>
            </View>
            <Toggle value={sameDropoffLocation} onValueChange={setSameDropoffLocation} />
          </View>

          {!sameDropoffLocation && (
            <TouchableOpacity
              style={[styles.locationButton, { borderColor: theme.colors.hint, marginTop: 16 }]}
              onPress={() => {
                setIsSelectingPickupLocation(false);
                setShowLocationPicker(true);
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="location-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.locationButtonText, { color: theme.colors.textPrimary }]}>
                {dropoffLocation || 'Select dropoff location'}
              </Text>
              <Ionicons name="chevron-forward-outline" size={20} color={theme.colors.hint} />
            </TouchableOpacity>
          )}
        </View>

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Special Requirements */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Special Requirements
          </Text>
          <TextInput
            style={[styles.requirementsInput, { color: theme.colors.textPrimary }]}
            placeholder="Any special requests or requirements..."
            placeholderTextColor={theme.colors.hint}
            value={specialRequirements}
            onChangeText={setSpecialRequirements}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Insurance Toggle */}
        <View style={styles.section}>
          <View style={styles.insuranceCard}>
            <View style={styles.insuranceInfo}>
              <Text style={[styles.insuranceTitle, { color: theme.colors.textPrimary }]}>
                Additional Insurance
              </Text>
              <Text style={[styles.insuranceDescription, { color: theme.colors.textSecondary }]}>
                Add comprehensive insurance coverage for extra protection (+KSh 1,500/day)
              </Text>
            </View>
            <Toggle
              value={insuranceEnabled}
              onValueChange={setInsuranceEnabled}
            />
          </View>
        </View>

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Pay on Site Option */}
        <View style={styles.section}>
          <View style={styles.payOnSiteHeader}>
            <View style={styles.payOnSiteHeaderLeft}>
              <Ionicons name="location-outline" size={24} color={theme.colors.primary} />
              <View style={styles.payOnSiteTitleContainer}>
                <Text style={[styles.payOnSiteTitle, { color: theme.colors.textPrimary }]}>
                  Pay on Site
                </Text>
                <Text style={[styles.payOnSiteSubtitle, { color: theme.colors.textSecondary }]}>
                  Reserve now, pay owner at pickup
                </Text>
              </View>
            </View>
            <Toggle value={payOnSite} onValueChange={setPayOnSite} />
          </View>

          {payOnSite && (
            <View style={[styles.payOnSiteInfo, { backgroundColor: theme.colors.primary + '10' }]}>
              <View style={styles.infoRow}>
                <Ionicons name="information-circle-outline" size={20} color={theme.colors.primary} />
                <Text style={[styles.infoText, { color: theme.colors.textPrimary }]}>
                  Reserve your booking by paying the booking fee (platform commission). You'll pay the car owner directly when you pick up the car.
                </Text>
              </View>
              <View style={styles.bookingFeeRow}>
                <Text style={[styles.bookingFeeLabel, { color: theme.colors.textSecondary }]}>
                  Booking Fee
                </Text>
                <Text style={[styles.bookingFeeValue, { color: theme.colors.primary }]}>
                  {formatCurrency(bookingFee)}
                </Text>
              </View>
              <View style={[styles.balanceOnSiteRow, { backgroundColor: '#FF9800' + '15' }]}>
                <View style={styles.balanceOnSiteLeft}>
                  <Ionicons name="cash-outline" size={18} color="#FF9800" />
                  <View style={styles.balanceOnSiteLabelContainer}>
                    <Text style={[styles.balanceOnSiteLabel, { color: theme.colors.textPrimary }]}>
                      Balance to Pay on Site
                    </Text>
                    <Text style={[styles.balanceOnSiteSubtext, { color: theme.colors.textSecondary }]}>
                      Pay directly to owner at pickup
                    </Text>
                  </View>
                </View>
                <Text style={[styles.balanceOnSiteValue, { color: '#FF9800' }]}>
                  {formatCurrency(balanceToPayOnSite)}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Price Summary */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Price Summary
          </Text>

          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>
              Base Price ({days || 0} {days === 1 ? 'day' : 'days'})
            </Text>
            <Text style={[styles.priceValue, { color: theme.colors.textPrimary }]}>
              {formatCurrency(basePrice)}
            </Text>
          </View>

          {insuranceEnabled && (
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>
                Insurance ({days || 0} {days === 1 ? 'day' : 'days'})
              </Text>
              <Text style={[styles.priceValue, { color: theme.colors.textPrimary }]}>
                {formatCurrency(insuranceCost)}
              </Text>
            </View>
          )}

          {payOnSite && (
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>
                Booking Fee
              </Text>
              <Text style={[styles.priceValue, { color: theme.colors.primary }]}>
                {formatCurrency(bookingFee)}
              </Text>
            </View>
          )}

          <View style={[styles.priceRow, styles.priceRowTotal]}>
            <Text style={[styles.priceLabelTotal, { color: theme.colors.textPrimary }]}>
              {payOnSite ? 'Total Rental Price' : 'Total'}
            </Text>
            <Text style={[styles.priceValueTotal, { color: theme.colors.primary }]}>
              {formatCurrency(totalPrice)}
            </Text>
          </View>

          {payOnSite && (
            <>
              <View style={styles.priceSummaryDivider} />
              <View style={[styles.priceRow, styles.priceRowPayNow]}>
                <View style={styles.payNowLabelContainer}>
                  <Text style={[styles.payNowLabel, { color: theme.colors.textPrimary }]}>
                    Amount to Pay Now
                  </Text>
                  <Text style={[styles.payNowSubtext, { color: theme.colors.textSecondary }]}>
                    Booking fee only
                  </Text>
                </View>
                <Text style={[styles.payNowValue, { color: theme.colors.primary }]}>
                  {formatCurrency(bookingFee)}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Payment Bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.colors.white }]}>
        <View style={styles.bottomBarPrice}>
          <Text style={[styles.bottomBarLabel, { color: theme.colors.hint }]}>
            {payOnSite ? 'Booking Fee' : 'Total'}
          </Text>
          <Text style={[styles.bottomBarPriceValue, { color: theme.colors.primary }]}>
            {formatCurrency(payOnSite ? bookingFee : totalPrice)}
          </Text>
        </View>
        <Button
          title="Continue to Review"
          onPress={handleContinue}
          variant="primary"
          style={[styles.payButton, { backgroundColor: '#FF1577' }]}
          disabled={!pickupDate || !dropoffDate || days < rentalInfo.minimumDays || !pickupLocation}
        />
      </View>

      {/* Calendars */}
      <Calendar
        visible={showPickupCalendar}
        onClose={() => setShowPickupCalendar(false)}
        selectedDate={pickupDate}
      />
      <Calendar
        visible={showDropoffCalendar}
        onClose={() => setShowDropoffCalendar(false)}
        selectedDate={dropoffDate}
        minDate={pickupDate}
      />

      {/* Time Pickers */}
      <TimePicker
        visible={showPickupTimePicker}
        onClose={() => setShowPickupTimePicker(false)}
        selectedTime={pickupTime}
        onTimeSelect={setPickupTime}
        title="Select Pickup Time"
      />
      <TimePicker
        visible={showDropoffTimePicker}
        onClose={() => setShowDropoffTimePicker(false)}
        selectedTime={dropoffTime}
        onTimeSelect={setDropoffTime}
        title="Select Dropoff Time"
      />

      {/* Location Picker */}
      <LocationPicker
        visible={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        locations={availableLocations}
        selectedLocation={isSelectingPickupLocation ? pickupLocation : dropoffLocation}
        onLocationSelect={(location) => {
          if (isSelectingPickupLocation) {
            setPickupLocation(location.name);
            if (sameDropoffLocation) {
              setDropoffLocation(location.name);
            }
          } else {
            setDropoffLocation(location.name);
          }
          setShowLocationPicker(false);
        }}
        title={isSelectingPickupLocation ? 'Select Pickup Location' : 'Select Dropoff Location'}
      />
    </View>
  );
};

// Time Picker Component
const TimePicker = ({ visible, onClose, selectedTime, onTimeSelect, title }) => {
  const theme = useTheme();
  const [hours, setHours] = useState(parseInt(selectedTime.split(':')[0]) || 10);
  const [minutes, setMinutes] = useState(parseInt(selectedTime.split(':')[1]) || 0);

  React.useEffect(() => {
    if (selectedTime) {
      const parts = selectedTime.split(':');
      setHours(parseInt(parts[0]) || 10);
      setMinutes(parseInt(parts[1]) || 0);
    }
  }, [selectedTime]);

  const handleConfirm = () => {
    const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    onTimeSelect(timeString);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.timePickerModalOverlay}>
        <View style={[styles.timePickerModal, { backgroundColor: theme.colors.white }]}>
          <Text style={[styles.timePickerTitle, { color: theme.colors.textPrimary }]}>
            {title}
          </Text>
          
          <View style={styles.timePickerContainer}>
            <View style={styles.timePickerColumn}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {Array.from({ length: 24 }, (_, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.timePickerItem,
                      hours === i && { backgroundColor: theme.colors.primary + '10' },
                    ]}
                    onPress={() => setHours(i)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.timePickerItemText,
                        { color: hours === i ? theme.colors.primary : theme.colors.textPrimary },
                        hours === i && { fontFamily: 'Nunito_700Bold' },
                      ]}
                    >
                      {String(i).padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <Text style={[styles.timePickerSeparator, { color: theme.colors.textPrimary }]}>:</Text>
            <View style={styles.timePickerColumn}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {[0, 15, 30, 45].map((min) => (
                  <TouchableOpacity
                    key={min}
                    style={[
                      styles.timePickerItem,
                      minutes === min && { backgroundColor: theme.colors.primary + '10' },
                    ]}
                    onPress={() => setMinutes(min)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.timePickerItemText,
                        { color: minutes === min ? theme.colors.primary : theme.colors.textPrimary },
                        minutes === min && { fontFamily: 'Nunito_700Bold' },
                      ]}
                    >
                      {String(min).padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.timePickerButtons}>
            <TouchableOpacity
              style={[styles.timePickerButton, styles.timePickerButtonSecondary, { borderColor: theme.colors.hint }]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={[styles.timePickerButtonText, { color: theme.colors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.timePickerButton, styles.timePickerButtonPrimary, { backgroundColor: theme.colors.primary }]}
              onPress={handleConfirm}
              activeOpacity={0.7}
            >
              <Text style={[styles.timePickerButtonText, { color: theme.colors.white }]}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Location Picker Component
const LocationPicker = ({ visible, onClose, locations, selectedLocation, onLocationSelect, title }) => {
  const theme = useTheme();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.locationPickerModalOverlay}>
        <View style={[styles.locationPickerModal, { backgroundColor: theme.colors.white }]}>
          <View style={styles.locationPickerHeader}>
            <Text style={[styles.locationPickerTitle, { color: theme.colors.textPrimary }]}>
              {title}
            </Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close-outline" size={28} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {locations.map((location) => (
              <TouchableOpacity
                key={location.id}
                style={[
                  styles.locationItem,
                  { borderColor: selectedLocation === location.name ? theme.colors.primary : '#E0E0E0' },
                  selectedLocation === location.name && { backgroundColor: theme.colors.primary + '10' },
                ]}
                onPress={() => onLocationSelect(location)}
                activeOpacity={0.7}
              >
                <View style={[styles.locationIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                  <Ionicons name="location" size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.locationItemContent}>
                  <Text style={[styles.locationItemName, { color: theme.colors.textPrimary }]}>
                    {location.name}
                  </Text>
                  <Text style={[styles.locationItemAddress, { color: theme.colors.textSecondary }]}>
                    {location.address}
                  </Text>
                </View>
                {selectedLocation === location.name && (
                  <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sectionSeparator: {
    borderTopWidth: 1,
    marginHorizontal: 24,
    marginTop: 16,
  },
  section: {
    marginHorizontal: 24,
    marginTop: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInputContainer: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  dateButtonDisabled: {
    opacity: 0.5,
  },
  dateButtonText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
  },
  daysInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  daysText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  requirementsInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    minHeight: 100,
  },
  insuranceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  insuranceInfo: {
    flex: 1,
    marginRight: 16,
  },
  insuranceTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  insuranceDescription: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  priceRowTotal: {
    marginTop: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    width: '100%',
  },
  priceLabel: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    flex: 1,
    flexShrink: 1,
    marginRight: 12,
  },
  priceValue: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    flexShrink: 0,
    textAlign: 'right',
  },
  priceLabelTotal: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    flex: 1,
    flexShrink: 1,
    marginRight: 12,
  },
  priceValueTotal: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    flexShrink: 0,
    textAlign: 'right',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 16,
  },
  bottomBarPrice: {
    flex: 1,
  },
  bottomBarLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 4,
  },
  bottomBarPriceValue: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
  },
  payButton: {
    minWidth: 140,
  },
  // Calendar Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  calendarModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  calendarModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  calendarNavButton: {
    padding: 8,
  },
  calendarMonth: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
  },
  calendarWeekDays: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 4,
  },
  calendarDayDisabled: {
    opacity: 0.3,
  },
  calendarDayText: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
  },
  calendarCloseButton: {
    marginTop: 8,
  },
  // Pay on Site Styles
  payOnSiteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payOnSiteHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  payOnSiteTitleContainer: {
    flex: 1,
  },
  payOnSiteTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  payOnSiteSubtitle: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  payOnSiteInfo: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  bookingFeeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    width: '100%',
  },
  bookingFeeLabel: {
    flex: 1,
    flexShrink: 1,
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    marginRight: 12,
  },
  bookingFeeValue: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    flexShrink: 0,
    textAlign: 'right',
  },
  priceSummaryDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  priceRowPayNow: {
    marginTop: 8,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payNowLabelContainer: {
    flex: 1,
    flexShrink: 1,
    marginRight: 12,
  },
  payNowLabel: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  payNowSubtext: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  payNowValue: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    flexShrink: 0,
    textAlign: 'right',
  },
  balanceOnSiteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    width: '100%',
  },
  balanceOnSiteLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexShrink: 1,
    gap: 10,
    marginRight: 12,
  },
  balanceOnSiteLabelContainer: {
    flex: 1,
  },
  balanceOnSiteLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 2,
  },
  balanceOnSiteSubtext: {
    fontSize: 11,
    fontFamily: 'Nunito_400Regular',
  },
  balanceOnSiteValue: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    flexShrink: 0,
    textAlign: 'right',
  },
  // Location Selection Styles
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  locationButtonText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
  },
  dropoffLocationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropoffLocationHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  dropoffLocationText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  // Time Picker Modal Styles
  timePickerModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  timePickerModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '70%',
  },
  timePickerTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
    marginBottom: 24,
  },
  timePickerColumn: {
    flex: 1,
    maxHeight: 150,
  },
  timePickerItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 1,
    alignItems: 'center',
  },
  timePickerItemText: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
  },
  timePickerSeparator: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginHorizontal: 8,
  },
  timePickerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  timePickerButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  timePickerButtonSecondary: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  timePickerButtonPrimary: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timePickerButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  // Location Picker Modal Styles
  locationPickerModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  locationPickerModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  locationPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationPickerTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    flex: 1,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationItemContent: {
    flex: 1,
  },
  locationItemName: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 4,
  },
  locationItemAddress: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
});

export default BookingScreen;
