import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '../../packages/context/UserContext';
import { useBookings } from '../../packages/context/BookingsContext';
import { Button, Input, Toggle } from '../../packages/components';
import { formatCurrency, formatPricePerDay, parseCurrency } from '../../packages/utils/currency';

const BookingScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const { bookings } = useBookings();
  const { car } = route.params || {};
  
  // Minimum age requirement for car rental (as per car rules)
  const MINIMUM_AGE = 25;

  // Initialize dates to tomorrow and day after tomorrow
  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    return tomorrow;
  };

  const getDayAfterTomorrow = () => {
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    dayAfter.setHours(10, 0, 0, 0);
    return dayAfter;
  };

  const [pickupDate, setPickupDate] = useState(getTomorrow());
  const [dropoffDate, setDropoffDate] = useState(getDayAfterTomorrow());
  const [showPickupDatePicker, setShowPickupDatePicker] = useState(false);
  const [showDropoffDatePicker, setShowDropoffDatePicker] = useState(false);
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [payOnSite, setPayOnSite] = useState(false);
  const [insuranceEnabled, setInsuranceEnabled] = useState(false);
  const [crossCountryTravelEnabled, setCrossCountryTravelEnabled] = useState(false);
  const [checkInPreference, setCheckInPreference] = useState('self'); // 'self' or 'assisted'
  
  // Modal states for age verification
  const [showAgeRequirementModal, setShowAgeRequirementModal] = useState(false);
  const [showUpdateProfileModal, setShowUpdateProfileModal] = useState(false);
  const [showAgeEligibleModal, setShowAgeEligibleModal] = useState(false);
  
  // Time selection
  const [pickupTime, setPickupTime] = useState('10:00');
  const [dropoffTime, setDropoffTime] = useState('10:00');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isSelectingPickupTime, setIsSelectingPickupTime] = useState(true);
  
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

  // Hide bottom tab bar and header on this screen
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

  // Calculate dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Get rental info from car or defaults
  const rentalInfo = {
    perDay: car?.price ? parseCurrency(car.price.replace('/day', '')) : 4500,
    deposit: 20000,
    minimumDays: 3,
  };

  // Age verification functions
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const isAgeEligible = () => {
    if (!user?.date_of_birth) return null; // Return null if date of birth not set
    const age = calculateAge(user.date_of_birth);
    return age !== null ? age >= MINIMUM_AGE : null;
  };

  // Availability check functions
  const getUnavailableDates = () => {
    if (!car?.id) return [];
    
    const unavailableDates = [];
    
    // Get all existing bookings for this car
    const carBookings = bookings.filter(booking => {
      // Check if booking is for this car (match by car id or name)
      const bookingCarId = booking.car?.id || booking.carId;
      const bookingCarName = booking.car?.name || booking.carName;
      const currentCarId = car?.id || car?.carId;
      const currentCarName = car?.name;
      
      return (bookingCarId && bookingCarId === currentCarId) || 
             (bookingCarName && currentCarName && bookingCarName === currentCarName);
    });
    
    // Extract unavailable date ranges from bookings
    carBookings.forEach(booking => {
      if (booking.pickupDate && booking.dropoffDate && booking.status !== 'cancelled') {
        const pickup = new Date(booking.pickupDate);
        const dropoff = new Date(booking.dropoffDate);
        pickup.setHours(0, 0, 0, 0);
        dropoff.setHours(0, 0, 0, 0);
        
        // Add all dates in the range to unavailable dates
        const currentDate = new Date(pickup);
        while (currentDate <= dropoff) {
          unavailableDates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    });
    
    return unavailableDates;
  };

  const isDateUnavailable = (date) => {
    const unavailableDates = getUnavailableDates();
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    return unavailableDates.some(unavailableDate => {
      const unavailable = new Date(unavailableDate);
      unavailable.setHours(0, 0, 0, 0);
      return unavailable.getTime() === checkDate.getTime();
    });
  };

  const isDateRangeAvailable = (startDate, endDate) => {
    const unavailableDates = getUnavailableDates();
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    
    // Check if any date in the range is unavailable
    const currentDate = new Date(start);
    while (currentDate <= end) {
      const checkDate = new Date(currentDate);
      checkDate.setHours(0, 0, 0, 0);
      
      if (unavailableDates.some(unavailableDate => {
        const unavailable = new Date(unavailableDate);
        unavailable.setHours(0, 0, 0, 0);
        return unavailable.getTime() === checkDate.getTime();
      })) {
        return false;
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return true;
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
  const crossCountryTravelCost = crossCountryTravelEnabled ? 5000 * days : 0;
  const basePrice = rentalInfo.perDay * days;
  const totalPrice = basePrice + insuranceCost + crossCountryTravelCost;
  
  // Commission rate (15%)
  const COMMISSION_RATE = 0.15;
  const bookingFee = payOnSite ? totalPrice * COMMISSION_RATE : 0;
  const balanceToPayOnSite = payOnSite ? totalPrice - bookingFee : 0;

  // Date formatting functions
  const formatDateRange = () => {
    if (!pickupDate || !dropoffDate) return 'Select dates';
    
    const pickupFormatted = pickupDate.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    
    const dropoffFormatted = dropoffDate.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    
    // If same month and year, show compact format
    if (
      pickupDate.getMonth() === dropoffDate.getMonth() &&
      pickupDate.getFullYear() === dropoffDate.getFullYear()
    ) {
      return `${pickupDate.getDate()}-${dropoffDate.getDate()} ${pickupDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
    }
    
    return `${pickupFormatted} - ${dropoffFormatted}`;
  };

  const formatDateShort = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const openPickupDatePicker = () => {
    setShowPickupDatePicker(true);
  };

  const openDropoffDatePicker = () => {
    if (!pickupDate) {
      Alert.alert('Select Pickup First', 'Please select pickup date first');
      return;
    }
    setShowDropoffDatePicker(true);
  };

  const handleContinue = () => {
    // Age verification
    const ageEligible = isAgeEligible();
    if (ageEligible === false) {
      setShowAgeRequirementModal(true);
      return;
    }
    
    if (ageEligible === null) {
      setShowUpdateProfileModal(true);
      return;
    }
    
    // Show success modal if user just became eligible (optional enhancement)
    // This could be useful if user updates profile and comes back
    if (ageEligible === true && user?.date_of_birth) {
      const age = calculateAge(user.date_of_birth);
      if (age === MINIMUM_AGE || age === MINIMUM_AGE + 1) {
        // Only show if they're exactly the minimum age or one year older
        // setShowAgeEligibleModal(true);
        // return;
      }
    }

    // Date validation
    if (!pickupDate || !dropoffDate) {
      Alert.alert('Error', 'Please select both pickup and dropoff dates');
      return;
    }
    
    // Availability check
    if (!isDateRangeAvailable(pickupDate, dropoffDate)) {
      Alert.alert(
        'Car Not Available',
        'The car is already booked for one or more of the selected dates. Please choose different dates.'
      );
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
        checkInPreference,
        insuranceEnabled,
        insuranceCost,
        crossCountryTravelEnabled,
        crossCountryTravelCost,
        payOnSite,
        bookingFee: payOnSite ? bookingFee : 0,
        totalRentalPrice: totalPrice,
        basePrice,
        rentalInfo,
      },
    });
  };

  // Single Date Picker Component
  // Single Date Picker Component
  const SingleDatePicker = ({ visible, onClose, selectedDate, onDateSelect, title, minDate, unavailableDates = [] }) => {
    const initialMonth = selectedDate?.getMonth() ?? today.getMonth();
    const initialYear = selectedDate?.getFullYear() ?? today.getFullYear();
    const [currentMonth, setCurrentMonth] = useState(initialMonth);
    const [currentYear, setCurrentYear] = useState(initialYear);
    const [tempSelectedDate, setTempSelectedDate] = useState(selectedDate);
    
    // Sync with parent state when picker opens
    React.useEffect(() => {
      if (visible) {
        setTempSelectedDate(selectedDate);
        if (selectedDate) {
          setCurrentMonth(selectedDate.getMonth());
          setCurrentYear(selectedDate.getFullYear());
        }
      }
    }, [visible, selectedDate]);

    const getDaysInMonth = (month, year) => {
      return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month, year) => {
      return new Date(year, month, 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const monthName = new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const daysArray = [];
    for (let i = 0; i < firstDay; i++) {
      daysArray.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      daysArray.push(day);
    }

    const isDateDisabled = (day) => {
      const date = new Date(currentYear, currentMonth, day);
      date.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Disable past dates
      if (date < today) return true;
      
      // If minDate is provided (for dropoff), disable dates before or equal to minDate
      if (minDate) {
        const min = new Date(minDate);
        min.setHours(0, 0, 0, 0);
        if (date <= min) return true;
      }
      
      // Check if date is unavailable (already booked)
      if (unavailableDates.length > 0) {
        const isUnavailable = unavailableDates.some(unavailableDate => {
          const unavailable = new Date(unavailableDate);
          unavailable.setHours(0, 0, 0, 0);
          return unavailable.getTime() === date.getTime();
        });
        if (isUnavailable) return true;
      }
      
      return false;
    };

    const isDateSelected = (day) => {
      if (!tempSelectedDate || !day) return false;
      const date = new Date(currentYear, currentMonth, day);
      date.setHours(0, 0, 0, 0);
      const selected = new Date(tempSelectedDate);
      selected.setHours(0, 0, 0, 0);
      return date.getTime() === selected.getTime();
    };

    const handleDayPress = (day) => {
      const date = new Date(currentYear, currentMonth, day);
      date.setHours(10, 0, 0, 0);
      setTempSelectedDate(date);
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
        <View style={styles.datePickerModalOverlay}>
          <View style={[styles.datePickerModal, { backgroundColor: theme.colors.white }]}>
            <View style={styles.datePickerHeader}>
              <TouchableOpacity onPress={onClose} style={styles.datePickerCloseButton}>
                <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
              </TouchableOpacity>
              <Text style={[styles.datePickerTitle, { color: theme.colors.textPrimary }]}>
                {title}
              </Text>
              <View style={{ width: 40 }} />
            </View>

            <View style={styles.datePickerMonthHeader}>
              <TouchableOpacity onPress={() => navigateMonth('prev')} style={styles.datePickerNavButton}>
                <Ionicons name="chevron-back" size={20} color={theme.colors.textPrimary} />
              </TouchableOpacity>
              <Text style={[styles.datePickerMonth, { color: theme.colors.textPrimary }]}>
                {monthName}
              </Text>
              <TouchableOpacity onPress={() => navigateMonth('next')} style={styles.datePickerNavButton}>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.datePickerWeekDays}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <Text key={index} style={[styles.datePickerWeekDay, { color: theme.colors.hint }]}>
                  {day}
                </Text>
              ))}
            </View>

            <View style={styles.datePickerGrid}>
              {daysArray.map((day, index) => {
                if (day === null) {
                  return <View key={index} style={styles.datePickerDay} />;
                }
                const disabled = isDateDisabled(day);
                const selected = isDateSelected(day);
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.datePickerDay,
                      disabled && styles.datePickerDayDisabled,
                    ]}
                    onPress={() => !disabled && handleDayPress(day)}
                    disabled={disabled}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.datePickerDayContent,
                        selected && { backgroundColor: theme.colors.primary },
                        disabled && { opacity: 0.3 },
                      ]}
                    >
                      <Text
                        style={[
                          styles.datePickerDayText,
                          { color: disabled ? theme.colors.hint : theme.colors.textPrimary },
                          selected && { color: theme.colors.white, fontFamily: 'Nunito_700Bold' },
                        ]}
                      >
                        {day}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.datePickerActions}>
              <TouchableOpacity
                style={[styles.datePickerCancelButton, { borderColor: theme.colors.hint }]}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={[styles.datePickerCancelText, { color: theme.colors.textPrimary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.datePickerConfirmButton,
                  { backgroundColor: theme.colors.primary },
                  !tempSelectedDate && { opacity: 0.5 }
                ]}
                onPress={() => {
                  if (tempSelectedDate) {
                    onDateSelect(tempSelectedDate);
                    onClose();
                  }
                }}
                activeOpacity={0.7}
                disabled={!tempSelectedDate}
              >
                <Text style={[styles.datePickerConfirmText, { color: theme.colors.white }]}>
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header with Back Button */}
      <View style={[styles.header, { paddingTop: insets.top + 8, paddingBottom: 12 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Age Warning Banner */}
        {user?.date_of_birth && !isAgeEligible() && (
          <View style={[styles.ageWarningBanner, { backgroundColor: '#FFF3CD' + '80' }]}>
            <Ionicons name="warning-outline" size={20} color="#FF9800" />
            <View style={styles.ageWarningContent}>
              <Text style={[styles.ageWarningTitle, { color: theme.colors.textPrimary }]}>
                Age Requirement
              </Text>
              <Text style={[styles.ageWarningText, { color: theme.colors.textSecondary }]}>
                You must be at least {MINIMUM_AGE} years old to rent this car. You are currently {calculateAge(user.date_of_birth)} years old.
              </Text>
            </View>
          </View>
        )}

        {/* Date Selection - Airbnb Style */}
        <View style={styles.section}>
          {/* Pickup Date */}
          <View style={styles.dateSectionRow}>
            <View style={styles.dateSectionContent}>
              <Text style={[styles.dateSectionLabel, { color: theme.colors.textSecondary }]}>
                Pickup Date
              </Text>
              <Text style={[styles.dateSectionValue, { color: theme.colors.textPrimary }]}>
                {pickupDate ? formatDateShort(pickupDate) : 'Select date'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.dateChangeButton}
              onPress={openPickupDatePicker}
              activeOpacity={0.7}
            >
              <Text style={[styles.dateChangeButtonText, { color: theme.colors.primary, textDecorationLine: 'underline' }]}>
                Change
              </Text>
            </TouchableOpacity>
          </View>

          {/* Dropoff Date */}
          <View style={[styles.dateSectionRow, { marginTop: 16 }]}>
            <View style={styles.dateSectionContent}>
              <Text style={[styles.dateSectionLabel, { color: theme.colors.textSecondary }]}>
                Dropoff Date
              </Text>
              <Text style={[styles.dateSectionValue, { color: theme.colors.textPrimary }]}>
                {dropoffDate ? formatDateShort(dropoffDate) : 'Select date'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.dateChangeButton}
              onPress={openDropoffDatePicker}
              activeOpacity={0.7}
              disabled={!pickupDate}
            >
              <Text style={[
                styles.dateChangeButtonText,
                { color: pickupDate ? theme.colors.primary : theme.colors.hint, textDecorationLine: 'underline' }
              ]}>
                Change
              </Text>
            </TouchableOpacity>
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

        {/* Time Selection - Airbnb Style */}
        <View style={styles.section}>
          <View style={styles.dateSectionRow}>
            <View style={styles.dateSectionContent}>
              <Text style={[styles.dateSectionLabel, { color: theme.colors.textSecondary }]}>
                Times
              </Text>
              <Text style={[styles.dateSectionValue, { color: theme.colors.textPrimary }]}>
                {pickupTime} - {dropoffTime}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.dateChangeButton}
              onPress={() => {
                setIsSelectingPickupTime(true);
                setShowTimePicker(true);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.dateChangeButtonText, { color: theme.colors.primary, textDecorationLine: 'underline' }]}>
                Change
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Location Selection - Airbnb Style */}
        <View style={styles.section}>
          <View style={styles.dateSectionRow}>
            <View style={styles.dateSectionContent}>
              <Text style={[styles.dateSectionLabel, { color: theme.colors.textSecondary }]}>
                {sameDropoffLocation ? 'Location' : 'Pickup Location'}
              </Text>
              <Text style={[styles.dateSectionValue, { color: theme.colors.textPrimary }]}>
                {pickupLocation || 'Select location'}
              </Text>
              {!sameDropoffLocation && (
                <>
                  <Text style={[styles.dateSectionLabel, { color: theme.colors.textSecondary, marginTop: 8 }]}>
                    Dropoff Location
                  </Text>
                  <Text style={[styles.dateSectionValue, { color: theme.colors.textPrimary }]}>
                    {dropoffLocation || 'Select location'}
                  </Text>
                </>
              )}
            </View>
            <TouchableOpacity
              style={styles.dateChangeButton}
              onPress={() => {
                setIsSelectingPickupLocation(true);
                setShowLocationPicker(true);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.dateChangeButtonText, { color: theme.colors.primary, textDecorationLine: 'underline' }]}>
                Change
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.dropoffLocationHeader, { marginTop: 12 }]}>
            <View style={styles.dropoffLocationHeaderLeft}>
              <Text style={[styles.dropoffLocationText, { color: theme.colors.textPrimary }]}>
                Same dropoff location
              </Text>
            </View>
            <Toggle value={sameDropoffLocation} onValueChange={setSameDropoffLocation} />
          </View>
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

        {/* Check-in Preference */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Check-in Preference
          </Text>
          <View style={styles.checkInOptionsContainer}>
            <TouchableOpacity
              style={[
                styles.checkInOption,
                checkInPreference === 'self' && { backgroundColor: theme.colors.primary + '15', borderColor: theme.colors.primary },
                { borderWidth: 2, borderColor: theme.colors.hint + '40' }
              ]}
              onPress={() => setCheckInPreference('self')}
              activeOpacity={0.7}
            >
              <View style={styles.checkInOptionContent}>
                <Ionicons 
                  name="key-outline" 
                  size={24} 
                  color={checkInPreference === 'self' ? theme.colors.primary : theme.colors.hint} 
                />
                <View style={styles.checkInOptionText}>
                  <Text style={[
                    styles.checkInOptionTitle, 
                    { color: checkInPreference === 'self' ? theme.colors.textPrimary : theme.colors.textSecondary }
                  ]}>
                    Self Check-in
                  </Text>
                  <Text style={[styles.checkInOptionDesc, { color: theme.colors.textSecondary }]}>
                    Get key from secure box independently
                  </Text>
                </View>
              </View>
              {checkInPreference === 'self' && (
                <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.checkInOption,
                checkInPreference === 'assisted' && { backgroundColor: theme.colors.primary + '15', borderColor: theme.colors.primary },
                { borderWidth: 2, borderColor: theme.colors.hint + '40' }
              ]}
              onPress={() => setCheckInPreference('assisted')}
              activeOpacity={0.7}
            >
              <View style={styles.checkInOptionContent}>
                <Ionicons 
                  name="person-outline" 
                  size={24} 
                  color={checkInPreference === 'assisted' ? theme.colors.primary : theme.colors.hint} 
                />
                <View style={styles.checkInOptionText}>
                  <Text style={[
                    styles.checkInOptionTitle, 
                    { color: checkInPreference === 'assisted' ? theme.colors.textPrimary : theme.colors.textSecondary }
                  ]}>
                    Assisted Check-in
                  </Text>
                  <Text style={[styles.checkInOptionDesc, { color: theme.colors.textSecondary }]}>
                    Meet owner for guided walkthrough
                  </Text>
                </View>
              </View>
              {checkInPreference === 'assisted' && (
                <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Optional Price Add-ons */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Optional Price Add-ons
          </Text>
          
          {/* Insurance Toggle */}
          <View style={styles.insuranceCard}>
            <View style={styles.insuranceInfo}>
              <Text style={[styles.insuranceTitle, { color: theme.colors.textPrimary }]}>
                Additional Insurance
              </Text>
              <Text style={[styles.insuranceDescription, { color: theme.colors.textSecondary }]}>
                Add comprehensive insurance coverage for extra protection (+KSh 1,500/day)
              </Text>
              
              {/* Common Covers List */}
              <View style={styles.coversList}>
                <View style={styles.coverItem}>
                  <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary} />
                  <Text style={[styles.coverText, { color: theme.colors.textSecondary }]}>
                    Collision Damage Waiver
                  </Text>
                </View>
                <View style={styles.coverItem}>
                  <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary} />
                  <Text style={[styles.coverText, { color: theme.colors.textSecondary }]}>
                    Theft Protection
                  </Text>
                </View>
                <View style={styles.coverItem}>
                  <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary} />
                  <Text style={[styles.coverText, { color: theme.colors.textSecondary }]}>
                    Third Party Liability
                  </Text>
                </View>
                <View style={styles.coverItem}>
                  <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary} />
                  <Text style={[styles.coverText, { color: theme.colors.textSecondary }]}>
                    Personal Accident Coverage
                  </Text>
                </View>
              </View>
              
              {/* Read More Link */}
              <TouchableOpacity
                onPress={() => navigation.navigate('InsuranceDetails')}
                activeOpacity={0.7}
                style={styles.readMoreButton}
              >
                <Text style={[styles.readMoreText, { color: theme.colors.primary }]}>
                  Read more
                </Text>
                <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
            <Toggle
              value={insuranceEnabled}
              onValueChange={setInsuranceEnabled}
            />
          </View>

        </View>

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Cross Country Travel Toggle */}
        <View style={styles.section}>
          <View style={styles.crossCountryCard}>
            <View style={styles.crossCountryInfo}>
              <Text style={[styles.crossCountryTitle, { color: theme.colors.textPrimary }]}>
                Cross Country Travel
              </Text>
              <Text style={[styles.crossCountryDescription, { color: theme.colors.textSecondary }]}>
                Enable this option if you plan to travel across different countries or regions (+KSh 5,000/day)
              </Text>
              
              {/* Instructions List */}
              <View style={styles.crossCountryInstructions}>
                <View style={styles.crossCountryInstructionItem}>
                  <Ionicons name="information-circle-outline" size={16} color={theme.colors.primary} />
                  <Text style={[styles.crossCountryInstructionText, { color: theme.colors.textSecondary }]}>
                    Required for travel outside the vehicle's registered country
                  </Text>
                </View>
                <View style={styles.crossCountryInstructionItem}>
                  <Ionicons name="information-circle-outline" size={16} color={theme.colors.primary} />
                  <Text style={[styles.crossCountryInstructionText, { color: theme.colors.textSecondary }]}>
                    Includes border crossing documentation support
                  </Text>
                </View>
                <View style={styles.crossCountryInstructionItem}>
                  <Ionicons name="information-circle-outline" size={16} color={theme.colors.primary} />
                  <Text style={[styles.crossCountryInstructionText, { color: theme.colors.textSecondary }]}>
                    Additional insurance coverage for international travel
                  </Text>
                </View>
                <View style={styles.crossCountryInstructionItem}>
                  <Ionicons name="information-circle-outline" size={16} color={theme.colors.primary} />
                  <Text style={[styles.crossCountryInstructionText, { color: theme.colors.textSecondary }]}>
                    Owner must approve cross-country travel in advance
                  </Text>
                </View>
              </View>
              
              {/* Read More Link */}
              <TouchableOpacity
                onPress={() => {
                  // TODO: Navigate to CrossCountryTravelDetails screen when implemented
                  // navigation.navigate('CrossCountryTravelDetails');
                }}
                activeOpacity={0.7}
                style={styles.readMoreButton}
              >
                <Text style={[styles.readMoreText, { color: theme.colors.primary }]}>
                  Read more
                </Text>
                <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
            <Toggle
              value={crossCountryTravelEnabled}
              onValueChange={setCrossCountryTravelEnabled}
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

      {/* Pickup Date Picker */}
      <SingleDatePicker
        visible={showPickupDatePicker}
        onClose={() => setShowPickupDatePicker(false)}
        selectedDate={pickupDate}
        onDateSelect={(date) => {
          setPickupDate(date);
          // If dropoff is before new pickup, reset dropoff
          if (dropoffDate && dropoffDate <= date) {
            setDropoffDate(null);
          }
        }}
        title="Select Pickup Date"
        unavailableDates={getUnavailableDates()}
      />

      {/* Dropoff Date Picker */}
      <SingleDatePicker
        visible={showDropoffDatePicker}
        onClose={() => setShowDropoffDatePicker(false)}
        selectedDate={dropoffDate}
        onDateSelect={setDropoffDate}
        title="Select Dropoff Date"
        minDate={pickupDate}
        unavailableDates={getUnavailableDates()}
      />

      {/* Combined Time Picker */}
      <TimePicker
        visible={showTimePicker}
        onClose={() => {
          setShowTimePicker(false);
          setIsSelectingPickupTime(true);
        }}
        selectedTime={isSelectingPickupTime ? pickupTime : dropoffTime}
        onTimeSelect={(time) => {
          if (isSelectingPickupTime) {
            setPickupTime(time);
            setIsSelectingPickupTime(false);
          } else {
            setDropoffTime(time);
            setShowTimePicker(false);
            setIsSelectingPickupTime(true);
          }
        }}
        title={isSelectingPickupTime ? "Select Pickup Time" : "Select Dropoff Time"}
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

      {/* Age Requirement Not Met Modal */}
      <Modal
        visible={showAgeRequirementModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAgeRequirementModal(false)}
      >
        <View style={styles.customModalOverlay}>
          <View style={[styles.customModal, { backgroundColor: theme.colors.white }]}>
            <View style={[styles.modalIconContainer, { backgroundColor: '#FF9800' + '20' }]}>
              <Ionicons name="warning" size={48} color="#FF9800" />
            </View>
            <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
              Age Requirement Not Met
            </Text>
            <Text style={[styles.modalMessage, { color: theme.colors.textSecondary }]}>
              You must be at least {MINIMUM_AGE} years old to rent this car.{'\n\n'}
              You are currently {calculateAge(user?.date_of_birth)} years old.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButtonSecondary, { borderColor: theme.colors.hint }]}
                onPress={() => setShowAgeRequirementModal(false)}
                activeOpacity={0.7}
              >
                <Text style={[styles.modalButtonTextSecondary, { color: theme.colors.textPrimary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButtonPrimary, { backgroundColor: theme.colors.primary }]}
                onPress={() => {
                  setShowAgeRequirementModal(false);
                  // UpdateProfile is in the same HomeStack, so we can navigate directly
                  navigation.navigate('UpdateProfile');
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.modalButtonTextPrimary, { color: theme.colors.white }]}>
                  Update Profile
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Update Profile Modal */}
      <Modal
        visible={showUpdateProfileModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowUpdateProfileModal(false)}
      >
        <View style={styles.customModalOverlay}>
          <View style={[styles.customModal, { backgroundColor: theme.colors.white }]}>
            <View style={[styles.modalIconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
              <Ionicons name="person-circle-outline" size={48} color={theme.colors.primary} />
            </View>
            <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
              {user?.date_of_birth ? 'Update Date of Birth' : 'Add Date of Birth'}
            </Text>
            <Text style={[styles.modalMessage, { color: theme.colors.textSecondary }]}>
              {user?.date_of_birth
                ? 'Please update your date of birth in your profile to verify your age eligibility for car rental.'
                : 'Please add your date of birth in your profile to proceed with booking. This is required to verify age eligibility.'}
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButtonSecondary, { borderColor: theme.colors.hint }]}
                onPress={() => setShowUpdateProfileModal(false)}
                activeOpacity={0.7}
              >
                <Text style={[styles.modalButtonTextSecondary, { color: theme.colors.textPrimary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButtonPrimary, { backgroundColor: theme.colors.primary }]}
                onPress={() => {
                  setShowUpdateProfileModal(false);
                  // UpdateProfile is in the same HomeStack, so we can navigate directly
                  navigation.navigate('UpdateProfile');
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.modalButtonTextPrimary, { color: theme.colors.white }]}>
                  Go to Profile
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Age Eligible Success Modal */}
      <Modal
        visible={showAgeEligibleModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAgeEligibleModal(false)}
      >
        <View style={styles.customModalOverlay}>
          <View style={[styles.customModal, { backgroundColor: theme.colors.white }]}>
            <View style={[styles.modalIconContainer, { backgroundColor: '#4CAF50' + '20' }]}>
              <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
            </View>
            <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
              Age Requirement Met!
            </Text>
            <Text style={[styles.modalMessage, { color: theme.colors.textSecondary }]}>
              Great! You meet the age requirement of {MINIMUM_AGE} years old. You can proceed with your booking.
            </Text>
            <TouchableOpacity
              style={[styles.modalButtonPrimary, { backgroundColor: theme.colors.primary, width: '100%' }]}
              onPress={() => setShowAgeEligibleModal(false)}
              activeOpacity={0.7}
            >
              <Text style={[styles.modalButtonTextPrimary, { color: theme.colors.white }]}>
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
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
  checkInOptionsContainer: {
    gap: 12,
  },
  checkInOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  checkInOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  checkInOptionText: {
    flex: 1,
    gap: 4,
  },
  checkInOptionTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  checkInOptionDesc: {
    fontSize: 13,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 18,
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
    marginBottom: 12,
  },
  coversList: {
    marginTop: 12,
    marginBottom: 12,
  },
  coverItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  coverText: {
    fontSize: 13,
    fontFamily: 'Nunito_400Regular',
    flex: 1,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  readMoreText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  crossCountryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  crossCountryInfo: {
    flex: 1,
    marginRight: 16,
  },
  crossCountryTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  crossCountryDescription: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
    marginBottom: 12,
  },
  crossCountryInstructions: {
    marginTop: 8,
    gap: 8,
  },
  crossCountryInstructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  crossCountryInstructionText: {
    fontSize: 13,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 18,
    flex: 1,
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
  // Airbnb-style Date Section
  dateSectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateSectionContent: {
    flex: 1,
  },
  dateSectionLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 4,
  },
  dateSectionValue: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
  },
  dateChangeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  dateChangeButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  ageWarningBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 24,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  ageWarningContent: {
    flex: 1,
  },
  ageWarningTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  ageWarningText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  // Date Range Picker Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  datePickerModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  datePickerModal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '85%',
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  datePickerCloseButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
  },
  datePickerMonthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  datePickerNavButton: {
    padding: 8,
  },
  datePickerMonth: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  datePickerWeekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  datePickerWeekDay: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
    width: '14.28%',
    textAlign: 'center',
  },
  datePickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  datePickerDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  datePickerDayContent: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerDayStart: {
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  datePickerDayEnd: {
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  datePickerDayDisabled: {
    opacity: 0.3,
  },
  datePickerDayText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  datePickerActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  datePickerCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  datePickerCancelText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  datePickerConfirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  datePickerConfirmText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  // Custom Modal Styles
  customModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  customModal: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: 'Nunito_700Bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButtonSecondary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  modalButtonTextSecondary: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  modalButtonPrimary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonTextPrimary: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
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

