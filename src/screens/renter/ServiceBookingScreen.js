import React, { useState, useLayoutEffect, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform, KeyboardAvoidingView, Modal, ActivityIndicator, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Location import - will use expo-location if available
let Location = null;
try {
  Location = require('expo-location');
} catch (e) {
  // expo-location not installed
}

const ServiceBookingScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { service, category: routeCategory } = route.params || {};
  // Use route category or fall back to service category
  const category = routeCategory || service?.category || '';

  // Initialize date to tomorrow
  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    return tomorrow;
  };

  const [selectedDate, setSelectedDate] = useState(getTomorrow());
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showJobTypePicker, setShowJobTypePicker] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  
  // Conditional fields based on service category
  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState(''); // For other categories (movers, etc.)
  const [areasOfVisit, setAreasOfVisit] = useState([]); // For road trips - changed from destination to areas of visit
  const [areaInput, setAreaInput] = useState(''); // Input for adding areas
  const [numberOfPassengers, setNumberOfPassengers] = useState('');
  const [duration, setDuration] = useState('');
  const [jobType, setJobType] = useState(''); // For hire professional drivers: 'longterm' or 'quickjob'
  const [eventLocation, setEventLocation] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState('');
  const [numberOfItems, setNumberOfItems] = useState('');
  const [partName, setPartName] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [vehicleLocation, setVehicleLocation] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [issueType, setIssueType] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Book Service',
    });
  }, [navigation]);

  // Hide tab bar when screen is focused (including when returning from other screens)
  useFocusEffect(
    useCallback(() => {
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

  const formatDateShort = (date) => {
    if (!date) {
      // Return tomorrow's date as default
      return formatDateShort(getTomorrow());
    }
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    return timeString || '10:00 AM';
  };

  // Available locations (mock data - in real app, fetch from backend)
  const availableLocations = [
    { id: 1, name: 'Nairobi CBD, Kenya', address: 'Moi Avenue, Nairobi CBD' },
    { id: 2, name: 'Westlands, Nairobi', address: 'Westlands Road, Nairobi' },
    { id: 3, name: 'Karen, Nairobi', address: 'Karen Road, Nairobi' },
    { id: 4, name: 'Kilimani, Nairobi', address: 'Argwings Kodhek Road, Nairobi' },
    { id: 5, name: 'Jomo Kenyatta Airport', address: 'Embakasi, Nairobi' },
  ];

  // Add area of visit
  const handleAddArea = () => {
    if (areaInput.trim()) {
      setAreasOfVisit([...areasOfVisit, areaInput.trim()]);
      setAreaInput('');
    }
  };

  // Remove area of visit
  const handleRemoveArea = (index) => {
    setAreasOfVisit(areasOfVisit.filter((_, i) => i !== index));
  };

  // Get current location for roadside assistance
  const handleGetCurrentLocation = async () => {
    if (!Location) {
      Alert.alert('Error', 'Location services are not available. Please enter your location manually.');
      return;
    }

    setIsGettingLocation(true);
    try {
      // Request permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to get your current location.');
        setIsGettingLocation(false);
        return;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Reverse geocode to get address
      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // Format address
      const addressParts = [];
      if (address.street) addressParts.push(address.street);
      if (address.district) addressParts.push(address.district);
      if (address.city) addressParts.push(address.city);
      if (address.region) addressParts.push(address.region);
      if (address.country) addressParts.push(address.country);

      const formattedAddress = addressParts.length > 0 
        ? addressParts.join(', ')
        : `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`;

      setCurrentLocation(formattedAddress);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get your current location. Please enter it manually.');
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleContinue = () => {
    if (!contactPhone.trim()) {
      Alert.alert('Required', 'Please enter your contact phone number');
      return;
    }

    // Validate category-specific required fields
    const categoryStr = (category || '').toLowerCase();
    const isRoadsideAssistance = categoryStr.includes('roadside');
    
    if (categoryStr.includes('hire professional drivers') || (categoryStr.includes('drivers') && !categoryStr.includes('road trips'))) {
      if (!jobType.trim()) {
        Alert.alert('Required', 'Please select job type');
        return;
      }
    } else if (categoryStr.includes('road trips')) {
      if (!pickupLocation.trim()) {
        Alert.alert('Required', 'Please select pickup location');
        return;
      }
      if (areasOfVisit.length === 0) {
        Alert.alert('Required', 'Please add at least one area of visit');
        return;
      }
    } else if (categoryStr.includes('wedding') || categoryStr.includes('vip wedding')) {
      if (!eventLocation.trim()) {
        Alert.alert('Required', 'Please enter event location');
        return;
      }
    } else if (categoryStr.includes('movers')) {
      if (!pickupLocation.trim()) {
        Alert.alert('Required', 'Please enter pickup location');
        return;
      }
      if (!destination.trim()) {
        Alert.alert('Required', 'Please enter destination');
        return;
      }
    } else if (categoryStr.includes('parts') || categoryStr.includes('automobile parts')) {
      if (!partName.trim()) {
        Alert.alert('Required', 'Please enter part name');
        return;
      }
      if (!deliveryAddress.trim()) {
        Alert.alert('Required', 'Please enter delivery address');
        return;
      }
    } else if (categoryStr.includes('detailing') || categoryStr.includes('car detailing')) {
      if (!vehicleLocation.trim()) {
        Alert.alert('Required', 'Please enter vehicle location');
        return;
      }
    } else if (isRoadsideAssistance) {
      if (!currentLocation.trim()) {
        Alert.alert('Required', 'Please send your current location');
        return;
      }
      if (!issueType.trim()) {
        Alert.alert('Required', 'Please select issue type');
        return;
      }
    }
    
    // Ensure we always have date and time values (use defaults if not set) - except for roadside assistance
    const finalDate = isRoadsideAssistance ? null : (selectedDate || getTomorrow());
    const finalTime = isRoadsideAssistance ? null : (selectedTime || '10:00 AM');

    const bookingDetails = {
      service: service,
      category: category,
      date: finalDate ? finalDate.toISOString() : null, // Convert to string for navigation
      time: finalTime, // selectedTime is now a string, not a Date
      contactPhone: contactPhone.trim(),
      additionalNotes: additionalNotes.trim(),
      serviceDate: finalDate ? formatDateShort(finalDate) : null,
      serviceTime: finalTime ? formatTime(finalTime) : null,
      // Category-specific fields
      pickupLocation: pickupLocation.trim(),
      destination: destination.trim(), // For other categories (movers, etc.)
      areasOfVisit: areasOfVisit, // For road trips - changed from destination
      numberOfPassengers: numberOfPassengers.trim(),
      duration: duration.trim(),
      jobType: jobType.trim(), // For hire professional drivers
      eventLocation: eventLocation.trim(),
      numberOfGuests: numberOfGuests.trim(),
      numberOfItems: numberOfItems.trim(),
      partName: partName.trim(),
      vehicleModel: vehicleModel.trim(),
      deliveryAddress: deliveryAddress.trim(),
      vehicleLocation: vehicleLocation.trim(),
      serviceType: serviceType.trim(),
      vehicleType: vehicleType.trim(),
      currentLocation: currentLocation.trim(),
      issueType: issueType.trim(),
    };

    navigation.navigate('ServiceBookingConfirmation', {
      bookingDetails: {
        ...bookingDetails,
        type: 'service',
      },
      totalPrice: parsePrice(service?.price || '0'),
    });
  };

  const parsePrice = (priceString) => {
    if (!priceString) return 0;
    const numericString = priceString.replace(/[^\d.]/g, '');
    return parseFloat(numericString) || 0;
  };

  // Check if all required fields are filled
  // Memoize form completion check to ensure it re-evaluates when dependencies change
  const isFormComplete = useMemo(() => {
    // Contact phone is always required
    if (!contactPhone || !contactPhone.trim()) {
      return false;
    }

    const categoryStr = (category || '').toLowerCase();
    
    // Hire Professional Drivers (separate from road trips)
    if (categoryStr.includes('hire professional drivers') || (categoryStr.includes('drivers') && !categoryStr.includes('road trips'))) {
      if (!jobType || !jobType.trim()) {
        return false;
      }
    }
    // Road Trips
    else if (categoryStr.includes('road trips')) {
      if (!pickupLocation || !pickupLocation.trim() || areasOfVisit.length === 0) {
        return false;
      }
    }
    // VIP Wedding
    else if (categoryStr.includes('wedding') || categoryStr.includes('vip wedding')) {
      if (!eventLocation || !eventLocation.trim()) {
        return false;
      }
    }
    // Movers
    else if (categoryStr.includes('movers')) {
      if (!pickupLocation || !pickupLocation.trim() || !destination || !destination.trim()) {
        return false;
      }
    }
    // Auto Parts
    else if (categoryStr.includes('parts') || categoryStr.includes('automobile parts')) {
      if (!partName || !partName.trim() || !deliveryAddress || !deliveryAddress.trim()) {
        return false;
      }
    }
    // Car Detailing
    else if (categoryStr.includes('detailing') || categoryStr.includes('car detailing')) {
      if (!vehicleLocation || !vehicleLocation.trim()) {
        return false;
      }
    }
    // Roadside Assistance
    else if (categoryStr.includes('roadside')) {
      if (!currentLocation || !currentLocation.trim() || !issueType || !issueType.trim()) {
        return false;
      }
    }

    return true;
  }, [contactPhone, category, jobType, pickupLocation, areasOfVisit, eventLocation, destination, partName, deliveryAddress, vehicleLocation, currentLocation, issueType]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Service Summary */}
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryTitle, { color: theme.colors.textPrimary }]}>
            Service Summary
          </Text>
          <View style={[styles.summaryDivider, { backgroundColor: theme.colors.hint + '40' }]} />
          <View style={styles.summaryContent}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryIconContainer}>
                <Ionicons name="business-outline" size={18} color={theme.colors.primary} />
              </View>
              <View style={styles.summaryTextContainer}>
                <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                  Service Name
                </Text>
                <Text style={[styles.serviceName, { color: theme.colors.textPrimary }]}>
                  {service?.name || 'Service'}
                </Text>
              </View>
            </View>
            <View style={styles.summaryRow}>
              <View style={styles.summaryIconContainer}>
                <Ionicons name="pricetag-outline" size={18} color={theme.colors.primary} />
              </View>
              <View style={styles.summaryTextContainer}>
                <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                  Category
                </Text>
                <Text style={[styles.serviceCategory, { color: theme.colors.textPrimary }]}>
                  {category || service?.category || ''}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Booking Details Section - Hidden for roadside assistance */}
        {(() => {
          const categoryStr = (category || '').toLowerCase();
          const isRoadsideAssistance = categoryStr.includes('roadside');
          
          if (isRoadsideAssistance) {
            return null; // Don't show booking details for roadside assistance
          }
          
          return (
            <View style={styles.section}>
              <Text style={[styles.sectionHeaderTitle, { color: theme.colors.textPrimary }]}>
                Booking Details
              </Text>
              
              {(() => {
                const isDriverService = categoryStr.includes('hire professional drivers') || (categoryStr.includes('drivers') && !categoryStr.includes('road trips'));
                
                // For drivers, show only Job Type
                if (isDriverService) {
              return (
                <View style={styles.dateSectionRow}>
                  <View style={styles.dateSectionContent}>
                    <Text style={[styles.dateSectionLabel, { color: theme.colors.textSecondary }]}>
                      Job Type <Text style={{ color: '#FF3B30' }}>*</Text>
                    </Text>
                    <Text style={[styles.dateSectionValue, { color: theme.colors.textPrimary }]}>
                      {jobType === 'longterm' ? 'Longterm' : jobType === 'quickjob' ? 'Quick Job' : 'Select job type'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.dateChangeButton}
                    onPress={() => setShowJobTypePicker(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.dateChangeButtonText, { color: theme.colors.primary, textDecorationLine: 'underline' }]}>
                      Change
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }
            
            // For other services, show date/time/location
            return (
              <>
                {/* Date Selection - Airbnb Style */}
                <View style={styles.dateSectionRow}>
                  <View style={styles.dateSectionContent}>
                    <Text style={[styles.dateSectionLabel, { color: theme.colors.textSecondary }]}>
                      Date
                    </Text>
                    <Text style={[styles.dateSectionValue, { color: theme.colors.textPrimary }]}>
                      {formatDateShort(selectedDate || getTomorrow())}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.dateChangeButton}
                    onPress={() => setShowDatePicker(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.dateChangeButtonText, { color: theme.colors.primary, textDecorationLine: 'underline' }]}>
                      Change
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Time Selection - Airbnb Style */}
                <View style={[styles.dateSectionRow, { marginTop: 16 }]}>
                  <View style={styles.dateSectionContent}>
                    <Text style={[styles.dateSectionLabel, { color: theme.colors.textSecondary }]}>
                      Time
                    </Text>
                    <Text style={[styles.dateSectionValue, { color: theme.colors.textPrimary }]}>
                      {formatTime(selectedTime || '10:00 AM')}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.dateChangeButton}
                    onPress={() => setShowTimePicker(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.dateChangeButtonText, { color: theme.colors.primary, textDecorationLine: 'underline' }]}>
                      Change
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Location for Road Trips only */}
                {categoryStr.includes('road trips') && (
                  <View style={[styles.dateSectionRow, { marginTop: 16 }]}>
                    <View style={styles.dateSectionContent}>
                      <Text style={[styles.dateSectionLabel, { color: theme.colors.textSecondary }]}>
                        Pickup Location <Text style={{ color: '#FF3B30' }}>*</Text>
                      </Text>
                      <Text style={[styles.dateSectionValue, { color: theme.colors.textPrimary }]}>
                        {pickupLocation || 'Select location'}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.dateChangeButton}
                      onPress={() => setShowLocationPicker(true)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.dateChangeButtonText, { color: theme.colors.primary, textDecorationLine: 'underline' }]}>
                        Change
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            );
          })()}
            </View>
          );
        })()}

        {/* Conditional Fields Based on Service Category */}
        {(() => {
          const categoryStr = (category || '').toLowerCase();
          
          // Hire Professional Drivers (separate from road trips)
          if (categoryStr.includes('hire professional drivers') || (categoryStr.includes('drivers') && !categoryStr.includes('road trips'))) {
            return (
              <>
                {/* Separator Line */}
                <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

                {/* More Info Section */}
                <View style={styles.section}>
                  <Text style={[styles.sectionHeaderTitle, { color: theme.colors.textPrimary }]}>
                    More Info
                  </Text>
                  
                  {/* Contact Phone */}
                  <View style={{ marginTop: 16 }}>
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
                </View>
              </>
            );
          }
          
          // Road Trips
          if (categoryStr.includes('road trips')) {
            return (
              <>
                {/* Separator Line */}
                <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

                {/* More Info Section */}
                <View style={styles.section}>
                  <Text style={[styles.sectionHeaderTitle, { color: theme.colors.textPrimary }]}>
                    More Info
                  </Text>
                  
                  {/* Areas of Visit */}
                  <View style={{ marginTop: 16 }}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                      Areas of Visit <Text style={{ color: '#FF3B30' }}>*</Text>
                    </Text>
                    <View style={[styles.areaInputContainer, { borderColor: theme.colors.hint }]}>
                      <TextInput
                        style={[styles.areaInput, { color: theme.colors.textPrimary }]}
                        placeholder="Enter area to visit"
                        placeholderTextColor={theme.colors.hint}
                        value={areaInput}
                        onChangeText={setAreaInput}
                        onSubmitEditing={handleAddArea}
                      />
                      <TouchableOpacity
                        onPress={handleAddArea}
                        style={[styles.addAreaButton, { backgroundColor: theme.colors.primary }]}
                        activeOpacity={0.7}
                        disabled={!areaInput.trim()}
                      >
                        <Ionicons name="add" size={20} color={theme.colors.white} />
                      </TouchableOpacity>
                    </View>
                    {areasOfVisit.length > 0 && (
                      <View style={styles.areasList}>
                        {areasOfVisit.map((area, index) => (
                          <View key={index} style={[styles.areaTag, { backgroundColor: theme.colors.primary + '15', borderColor: theme.colors.primary + '40' }]}>
                            <Text style={[styles.areaTagText, { color: theme.colors.textPrimary }]}>
                              {area}
                            </Text>
                            <TouchableOpacity
                              onPress={() => handleRemoveArea(index)}
                              style={styles.removeAreaButton}
                              activeOpacity={0.7}
                            >
                              <Ionicons name="close-circle" size={18} color={theme.colors.primary} />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Number of Passengers */}
                  <View style={{ marginTop: 20 }}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                      Number of Passengers
                    </Text>
                    <TextInput
                      style={[styles.input, { 
                        borderColor: theme.colors.hint,
                        color: theme.colors.textPrimary,
                        backgroundColor: theme.colors.background
                      }]}
                      placeholder="Enter number of passengers"
                      placeholderTextColor={theme.colors.hint}
                      value={numberOfPassengers}
                      onChangeText={setNumberOfPassengers}
                      keyboardType="numeric"
                    />
                  </View>

                  {/* Duration */}
                  <View style={{ marginTop: 20 }}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                      Duration
                    </Text>
                    <TextInput
                      style={[styles.input, { 
                        borderColor: theme.colors.hint,
                        color: theme.colors.textPrimary,
                        backgroundColor: theme.colors.background
                      }]}
                      placeholder="e.g., 2 hours, 1 day, 3 days"
                      placeholderTextColor={theme.colors.hint}
                      value={duration}
                      onChangeText={setDuration}
                    />
                  </View>

                  {/* Contact Phone */}
                  <View style={{ marginTop: 20 }}>
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
                  <View style={{ marginTop: 20 }}>
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
                </View>
              </>
            );
          }
          
          // VIP Wedding
          if (categoryStr.includes('wedding') || categoryStr.includes('vip wedding')) {
            return (
              <>
                {/* Event Location - Airbnb Style (part of Booking Details) */}
                <View style={styles.section}>
                  <View style={[styles.dateSectionRow, { marginTop: 0 }]}>
                    <View style={styles.dateSectionContent}>
                      <Text style={[styles.dateSectionLabel, { color: theme.colors.textSecondary }]}>
                        Event Location <Text style={{ color: '#FF3B30' }}>*</Text>
                      </Text>
                      <Text style={[styles.dateSectionValue, { color: theme.colors.textPrimary }]}>
                        {eventLocation || 'Select location'}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.dateChangeButton}
                      onPress={() => setShowLocationPicker(true)}
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

                {/* More Info Section */}
                <View style={styles.section}>
                  <Text style={[styles.sectionHeaderTitle, { color: theme.colors.textPrimary }]}>
                    More Info
                  </Text>
                  
                  {/* Number of Guests */}
                  <View style={{ marginTop: 16 }}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                      Number of Guests
                    </Text>
                    <TextInput
                      style={[styles.input, { 
                        borderColor: theme.colors.hint,
                        color: theme.colors.textPrimary,
                        backgroundColor: theme.colors.background
                      }]}
                      placeholder="Enter expected number of guests"
                      placeholderTextColor={theme.colors.hint}
                      value={numberOfGuests}
                      onChangeText={setNumberOfGuests}
                      keyboardType="numeric"
                    />
                  </View>

                  {/* Contact Phone */}
                  <View style={{ marginTop: 20 }}>
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
                  <View style={{ marginTop: 20 }}>
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
                </View>
              </>
            );
          }
          
          // Movers
          if (categoryStr.includes('movers')) {
            return (
              <>
                {/* Separator Line */}
                <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                    Pickup Location <Text style={{ color: '#FF3B30' }}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, { 
                      borderColor: theme.colors.hint,
                      color: theme.colors.textPrimary,
                      backgroundColor: theme.colors.background
                    }]}
                    placeholder="Enter pickup location"
                    placeholderTextColor={theme.colors.hint}
                    value={pickupLocation}
                    onChangeText={setPickupLocation}
                  />
                </View>
                {/* Separator Line */}
                <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                    Destination <Text style={{ color: '#FF3B30' }}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, { 
                      borderColor: theme.colors.hint,
                      color: theme.colors.textPrimary,
                      backgroundColor: theme.colors.background
                    }]}
                    placeholder="Enter destination"
                    placeholderTextColor={theme.colors.hint}
                    value={destination}
                    onChangeText={setDestination}
                  />
                </View>
                {/* Separator Line */}
                <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                    Number of Items/Rooms
                  </Text>
                  <TextInput
                    style={[styles.input, { 
                      borderColor: theme.colors.hint,
                      color: theme.colors.textPrimary,
                      backgroundColor: theme.colors.background
                    }]}
                    placeholder="e.g., 2 bedrooms, 10 boxes"
                    placeholderTextColor={theme.colors.hint}
                    value={numberOfItems}
                    onChangeText={setNumberOfItems}
                  />
                </View>
                {/* Separator Line */}
                <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />
                <View style={styles.section}>
                  {/* Contact Phone */}
                  <View>
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
                  <View style={{ marginTop: 20 }}>
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
                </View>
              </>
            );
          }
          
          // Auto Parts
          if (categoryStr.includes('parts') || categoryStr.includes('automobile parts')) {
            return (
              <>
                {/* Separator Line */}
                <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                    Part Name <Text style={{ color: '#FF3B30' }}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, { 
                      borderColor: theme.colors.hint,
                      color: theme.colors.textPrimary,
                      backgroundColor: theme.colors.background
                    }]}
                    placeholder="Enter part name"
                    placeholderTextColor={theme.colors.hint}
                    value={partName}
                    onChangeText={setPartName}
                  />
                </View>
                {/* Separator Line */}
                <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                    Vehicle Model
                  </Text>
                  <TextInput
                    style={[styles.input, { 
                      borderColor: theme.colors.hint,
                      color: theme.colors.textPrimary,
                      backgroundColor: theme.colors.background
                    }]}
                    placeholder="e.g., Toyota Corolla 2018"
                    placeholderTextColor={theme.colors.hint}
                    value={vehicleModel}
                    onChangeText={setVehicleModel}
                  />
                </View>
                {/* Separator Line */}
                <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                    Delivery Address <Text style={{ color: '#FF3B30' }}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, { 
                      borderColor: theme.colors.hint,
                      color: theme.colors.textPrimary,
                      backgroundColor: theme.colors.background
                    }]}
                    placeholder="Enter delivery address"
                    placeholderTextColor={theme.colors.hint}
                    value={deliveryAddress}
                    onChangeText={setDeliveryAddress}
                  />
                </View>
                {/* Separator Line */}
                <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />
                <View style={styles.section}>
                  {/* Contact Phone */}
                  <View>
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
                  <View style={{ marginTop: 20 }}>
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
                </View>
              </>
            );
          }
          
          // Car Detailing
          if (categoryStr.includes('detailing') || categoryStr.includes('car detailing')) {
            return (
              <>
                {/* Separator Line */}
                <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                    Vehicle Location <Text style={{ color: '#FF3B30' }}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, { 
                      borderColor: theme.colors.hint,
                      color: theme.colors.textPrimary,
                      backgroundColor: theme.colors.background
                    }]}
                    placeholder="Enter vehicle location"
                    placeholderTextColor={theme.colors.hint}
                    value={vehicleLocation}
                    onChangeText={setVehicleLocation}
                  />
                </View>
                {/* Separator Line */}
                <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                    Service Type
                  </Text>
                  <TextInput
                    style={[styles.input, { 
                      borderColor: theme.colors.hint,
                      color: theme.colors.textPrimary,
                      backgroundColor: theme.colors.background
                    }]}
                    placeholder="e.g., Interior, Exterior, Both"
                    placeholderTextColor={theme.colors.hint}
                    value={serviceType}
                    onChangeText={setServiceType}
                  />
                </View>
                {/* Separator Line */}
                <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                    Vehicle Type
                  </Text>
                  <TextInput
                    style={[styles.input, { 
                      borderColor: theme.colors.hint,
                      color: theme.colors.textPrimary,
                      backgroundColor: theme.colors.background
                    }]}
                    placeholder="e.g., Sedan, SUV, Hatchback"
                    placeholderTextColor={theme.colors.hint}
                    value={vehicleType}
                    onChangeText={setVehicleType}
                  />
                </View>
                {/* Separator Line */}
                <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />
                <View style={styles.section}>
                  {/* Contact Phone */}
                  <View>
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
                  <View style={{ marginTop: 20 }}>
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
                </View>
              </>
            );
          }
          
          // Roadside Assistance
          if (categoryStr.includes('roadside')) {
            return (
              <>
                {/* Separator Line */}
                <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                    Current Location <Text style={{ color: '#FF3B30' }}>*</Text>
                  </Text>
                  <TouchableOpacity
                    style={[styles.input, { 
                      borderColor: theme.colors.primary,
                      backgroundColor: theme.colors.background,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingVertical: 14,
                    }]}
                    onPress={handleGetCurrentLocation}
                    disabled={isGettingLocation}
                    activeOpacity={0.7}
                  >
                    {isGettingLocation ? (
                      <>
                        <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginRight: 8 }} />
                        <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
                          Getting Location...
                        </Text>
                      </>
                    ) : (
                      <>
                        <Ionicons name="location" size={20} color={theme.colors.primary} style={{ marginRight: 8 }} />
                        <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
                          Send Current Location
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                  {currentLocation ? (
                    <View style={{ marginTop: 12, padding: 12, backgroundColor: theme.colors.background, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.hint + '40' }}>
                      <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, fontSize: 12, marginBottom: 4 }]}>
                        Location Set:
                      </Text>
                      <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary, fontSize: 14 }]}>
                        {currentLocation}
                      </Text>
                    </View>
                  ) : null}
                </View>
                {/* Separator Line */}
                <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                    Issue Type <Text style={{ color: '#FF3B30' }}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, { 
                      borderColor: theme.colors.hint,
                      color: theme.colors.textPrimary,
                      backgroundColor: theme.colors.background
                    }]}
                    placeholder="e.g., Flat tire, Battery dead, Out of fuel, Engine trouble"
                    placeholderTextColor={theme.colors.hint}
                    value={issueType}
                    onChangeText={setIssueType}
                  />
                </View>
                {/* Separator Line */}
                <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                    Vehicle Type
                  </Text>
                  <TextInput
                    style={[styles.input, { 
                      borderColor: theme.colors.hint,
                      color: theme.colors.textPrimary,
                      backgroundColor: theme.colors.background
                    }]}
                    placeholder="e.g., Sedan, SUV, Truck"
                    placeholderTextColor={theme.colors.hint}
                    value={vehicleType}
                    onChangeText={setVehicleType}
                  />
                </View>
                {/* Separator Line */}
                <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />
                <View style={styles.section}>
                  {/* Contact Phone */}
                  <View>
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
                </View>
              </>
            );
          }
          
          return null;
        })()}

        {/* Bottom Spacing - Extra space for keyboard and bottom bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
      </KeyboardAvoidingView>

      {/* Date Picker Modal */}
      <DatePickerModal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        selectedDate={selectedDate}
        onDateSelect={(date) => {
          setSelectedDate(date);
          setShowDatePicker(false);
        }}
        title="Select Date"
        minDate={getTomorrow()}
      />

      {/* Time Picker Modal */}
      <TimePickerModal
        visible={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        selectedTime={selectedTime}
        onTimeSelect={(time) => {
          setSelectedTime(time);
          setShowTimePicker(false);
        }}
        title="Select Time"
      />

      {/* Location Picker Modal */}
      <LocationPickerModal
        visible={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        locations={availableLocations}
        selectedLocation={(() => {
          const categoryStr = (category || '').toLowerCase();
          if (categoryStr.includes('wedding') || categoryStr.includes('vip wedding')) {
            return eventLocation;
          }
          return pickupLocation;
        })()}
        onLocationSelect={(location) => {
          const categoryStr = (category || '').toLowerCase();
          if (categoryStr.includes('wedding') || categoryStr.includes('vip wedding')) {
            setEventLocation(location.name);
          } else {
            setPickupLocation(location.name);
          }
          setShowLocationPicker(false);
        }}
        title={(() => {
          const categoryStr = (category || '').toLowerCase();
          if (categoryStr.includes('wedding') || categoryStr.includes('vip wedding')) {
            return 'Select Event Location';
          }
          return 'Select Pickup Location';
        })()}
      />

      {/* Job Type Picker Modal */}
      <JobTypePickerModal
        visible={showJobTypePicker}
        onClose={() => setShowJobTypePicker(false)}
        selectedJobType={jobType}
        onJobTypeSelect={(type) => {
          setJobType(type);
          setShowJobTypePicker(false);
        }}
        title="Select Job Type"
      />

      {/* Bottom Bar with Price and Button - Fixed at bottom */}
      <View style={[styles.footer, { backgroundColor: theme.colors.white, paddingBottom: Math.max(insets.bottom, 12) }]}>
        {(() => {
          const categoryStr = (category || '').toLowerCase();
          const isDriverService = categoryStr.includes('hire professional drivers') || (categoryStr.includes('drivers') && !categoryStr.includes('road trips'));
          const isRoadsideAssistance = categoryStr.includes('roadside');
          
          if (isDriverService || isRoadsideAssistance) {
            // For drivers and roadside assistance, no price shown, just centered button
            return (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity
                  style={[
                    styles.payNowButton, 
                    { 
                      backgroundColor: isFormComplete ? '#FF1577' : theme.colors.hint,
                      opacity: isFormComplete ? 1 : 0.6,
                      minWidth: 200,
                    }
                  ]}
                  onPress={handleContinue}
                  activeOpacity={isFormComplete ? 0.8 : 1}
                  disabled={!isFormComplete}
                >
                  <Text style={[styles.payNowButtonText, { color: theme.colors.white }]}>
                    Review Request
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }
          
          // For other services (including movers), show price and Pay Now button
          return (
            <>
              <View style={styles.bottomBarPrice}>
                <Text style={[styles.bottomBarLabel, { color: theme.colors.hint }]}>Total</Text>
                <Text style={[styles.bottomBarPriceValue, { color: theme.colors.primary }]}>
                  {service?.price || 'KSh 0'}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.payNowButton, 
                  { 
                    backgroundColor: isFormComplete ? '#FF1577' : theme.colors.hint,
                    opacity: isFormComplete ? 1 : 0.6,
                  }
                ]}
                onPress={handleContinue}
                activeOpacity={isFormComplete ? 0.8 : 1}
                disabled={!isFormComplete}
              >
                <Text style={[styles.payNowButtonText, { color: theme.colors.white }]}>
                  Pay Now
                </Text>
              </TouchableOpacity>
            </>
          );
        })()}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  summaryCard: {
    padding: 16,
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 12,
  },
  summaryDivider: {
    height: 1,
    marginBottom: 12,
  },
  summaryContent: {
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  summaryIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  summaryTextContainer: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  serviceCategory: {
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold',
  },
  section: {
    padding: 16,
    marginTop: 8,
  },
  sectionSeparator: {
    borderTopWidth: 1,
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 10,
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 16,
  },
  dateTimeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 10,
  },
  dateTimeInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  hintText: {
    fontSize: 11,
    fontFamily: 'Nunito_400Regular',
    marginTop: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    minHeight: 80,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  bottomBarPrice: {
    flex: 1,
  },
  bottomBarLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 2,
  },
  bottomBarPriceValue: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
  },
  payNowButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 20,
    maxWidth: 200,
  },
  payNowButtonText: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  // Airbnb-style date section
  dateSectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dateSectionContent: {
    flex: 1,
  },
  dateSectionLabel: {
    fontSize: 11,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 3,
  },
  dateSectionValue: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  dateChangeButton: {
    paddingVertical: 4,
  },
  dateChangeButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  // Areas of visit styles
  areaInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    gap: 8,
  },
  areaInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  addAreaButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  areasList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  areaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  areaTagText: {
    fontSize: 14,
    fontFamily: 'Nunito_500Medium',
  },
  removeAreaButton: {
    padding: 2,
  },
  // Job Type styles
  jobTypeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  jobTypeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  jobTypeText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
});

// Date Picker Modal Component
const DatePickerModal = ({ visible, onClose, selectedDate, onDateSelect, title, minDate }) => {
  const theme = useTheme();
  const [currentMonth, setCurrentMonth] = useState(selectedDate ? selectedDate.getMonth() : new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDate ? selectedDate.getFullYear() : new Date().getFullYear());
  const [tempSelectedDate, setTempSelectedDate] = useState(selectedDate);

  useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(selectedDate.getMonth());
      setCurrentYear(selectedDate.getFullYear());
      setTempSelectedDate(selectedDate);
    }
  }, [selectedDate, visible]);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthName = monthNames[currentMonth];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const isDateDisabled = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (minDate) {
      const min = new Date(minDate);
      min.setHours(0, 0, 0, 0);
      return date < min;
    }
    return date < today;
  };

  const isDateSelected = (day) => {
    if (!tempSelectedDate) return false;
    return (
      tempSelectedDate.getDate() === day &&
      tempSelectedDate.getMonth() === currentMonth &&
      tempSelectedDate.getFullYear() === currentYear
    );
  };

  const handleDayPress = (day) => {
    const date = new Date(currentYear, currentMonth, day);
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

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const daysArray = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    daysArray.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    daysArray.push(day);
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={pickerStyles.modalOverlay}>
        <View style={[pickerStyles.modal, { backgroundColor: theme.colors.white }]}>
          <View style={pickerStyles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={pickerStyles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
            </TouchableOpacity>
            <Text style={[pickerStyles.modalTitle, { color: theme.colors.textPrimary }]}>
              {title}
            </Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={pickerStyles.monthHeader}>
            <TouchableOpacity onPress={() => navigateMonth('prev')} style={pickerStyles.navButton}>
              <Ionicons name="chevron-back" size={20} color={theme.colors.textPrimary} />
            </TouchableOpacity>
            <Text style={[pickerStyles.monthText, { color: theme.colors.textPrimary }]}>
              {monthName} {currentYear}
            </Text>
            <TouchableOpacity onPress={() => navigateMonth('next')} style={pickerStyles.navButton}>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={pickerStyles.weekDays}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <Text key={index} style={[pickerStyles.weekDay, { color: theme.colors.hint }]}>
                {day}
              </Text>
            ))}
          </View>

          <View style={pickerStyles.daysGrid}>
            {daysArray.map((day, index) => {
              if (day === null) {
                return <View key={index} style={pickerStyles.dayCell} />;
              }
              const disabled = isDateDisabled(day);
              const selected = isDateSelected(day);
              
              return (
                <TouchableOpacity
                  key={index}
                  style={pickerStyles.dayCell}
                  onPress={() => !disabled && handleDayPress(day)}
                  disabled={disabled}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      pickerStyles.dayContent,
                      selected && { backgroundColor: theme.colors.primary },
                      disabled && { opacity: 0.3 },
                    ]}
                  >
                    <Text
                      style={[
                        pickerStyles.dayText,
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

          <View style={pickerStyles.modalActions}>
            <TouchableOpacity
              style={[pickerStyles.cancelButton, { borderColor: theme.colors.hint }]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={[pickerStyles.cancelText, { color: theme.colors.textPrimary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                pickerStyles.confirmButton,
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
              <Text style={[pickerStyles.confirmText, { color: theme.colors.white }]}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Time Picker Modal Component
const TimePickerModal = ({ visible, onClose, selectedTime, onTimeSelect, title }) => {
  const theme = useTheme();
  const [displayHour, setDisplayHour] = useState(10);
  const [minutes, setMinutes] = useState(0);
  const [ampm, setAmpm] = useState('AM');

  useEffect(() => {
    if (selectedTime && visible) {
      const timeMatch = selectedTime.match(/(\d{1,2}):(\d{2})\s?(AM|PM)/i);
      if (timeMatch) {
        let h = parseInt(timeMatch[1]);
        const m = parseInt(timeMatch[2]);
        const ap = timeMatch[3].toUpperCase();
        
        // Convert to 24-hour format for internal use
        let hour24 = h;
        if (ap === 'PM' && h !== 12) hour24 = h + 12;
        if (ap === 'AM' && h === 12) hour24 = 0;
        
        // Convert back to 12-hour display format
        if (hour24 === 0) {
          setDisplayHour(12);
          setAmpm('AM');
        } else if (hour24 === 12) {
          setDisplayHour(12);
          setAmpm('PM');
        } else if (hour24 > 12) {
          setDisplayHour(hour24 - 12);
          setAmpm('PM');
        } else {
          setDisplayHour(hour24);
          setAmpm('AM');
        }
        setMinutes(m);
      }
    }
  }, [selectedTime, visible]);

  const handleConfirm = () => {
    const timeString = `${displayHour}:${String(minutes).padStart(2, '0')} ${ampm}`;
    onTimeSelect(timeString);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={pickerStyles.modalOverlay}>
        <View style={[pickerStyles.modal, { backgroundColor: theme.colors.white }]}>
          <View style={pickerStyles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={pickerStyles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
            </TouchableOpacity>
            <Text style={[pickerStyles.modalTitle, { color: theme.colors.textPrimary }]}>
              {title}
            </Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={pickerStyles.timePickerContainer}>
            <View style={pickerStyles.timePickerRow}>
              <ScrollView style={pickerStyles.timeScrollView} showsVerticalScrollIndicator={false}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => {
                  const isSelected = displayHour === h;
                  return (
                    <TouchableOpacity
                      key={h}
                      style={[
                        pickerStyles.timeOption,
                        isSelected && { backgroundColor: theme.colors.primary + '20' }
                      ]}
                      onPress={() => setDisplayHour(h)}
                    >
                      <Text style={[
                        pickerStyles.timeOptionText,
                        { color: theme.colors.textPrimary },
                        isSelected && { color: theme.colors.primary, fontFamily: 'Nunito_700Bold' }
                      ]}>
                        {String(h).padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <Text style={[pickerStyles.timeSeparator, { color: theme.colors.textPrimary }]}>:</Text>
              <ScrollView style={pickerStyles.timeScrollView} showsVerticalScrollIndicator={false}>
                {Array.from({ length: 60 }, (_, i) => i).map((m) => {
                  const isSelected = minutes === m;
                  return (
                    <TouchableOpacity
                      key={m}
                      style={[
                        pickerStyles.timeOption,
                        isSelected && { backgroundColor: theme.colors.primary + '20' }
                      ]}
                      onPress={() => setMinutes(m)}
                    >
                      <Text style={[
                        pickerStyles.timeOptionText,
                        { color: theme.colors.textPrimary },
                        isSelected && { color: theme.colors.primary, fontFamily: 'Nunito_700Bold' }
                      ]}>
                        {String(m).padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <View style={pickerStyles.ampmContainer}>
                <TouchableOpacity
                  style={[
                    pickerStyles.ampmButton,
                    ampm === 'AM' && { backgroundColor: theme.colors.primary }
                  ]}
                  onPress={() => setAmpm('AM')}
                >
                  <Text style={[
                    pickerStyles.ampmText,
                    { color: ampm === 'AM' ? theme.colors.white : theme.colors.textPrimary }
                  ]}>
                    AM
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    pickerStyles.ampmButton,
                    ampm === 'PM' && { backgroundColor: theme.colors.primary }
                  ]}
                  onPress={() => setAmpm('PM')}
                >
                  <Text style={[
                    pickerStyles.ampmText,
                    { color: ampm === 'PM' ? theme.colors.white : theme.colors.textPrimary }
                  ]}>
                    PM
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={pickerStyles.modalActions}>
            <TouchableOpacity
              style={[pickerStyles.cancelButton, { borderColor: theme.colors.hint }]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={[pickerStyles.cancelText, { color: theme.colors.textPrimary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[pickerStyles.confirmButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleConfirm}
              activeOpacity={0.7}
            >
              <Text style={[pickerStyles.confirmText, { color: theme.colors.white }]}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Location Picker Modal Component
const LocationPickerModal = ({ visible, onClose, locations, selectedLocation, onLocationSelect, title }) => {
  const theme = useTheme();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={pickerStyles.modalOverlay}>
        <View style={[pickerStyles.modal, { backgroundColor: theme.colors.white }]}>
          <View style={pickerStyles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={pickerStyles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
            </TouchableOpacity>
            <Text style={[pickerStyles.modalTitle, { color: theme.colors.textPrimary }]}>
              {title}
            </Text>
            <View style={{ width: 40 }} />
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false} style={pickerStyles.locationScrollView}>
            {locations.map((location) => (
              <TouchableOpacity
                key={location.id}
                style={[
                  pickerStyles.locationItem,
                  { borderColor: selectedLocation === location.name ? theme.colors.primary : '#E0E0E0' },
                  selectedLocation === location.name && { backgroundColor: theme.colors.primary + '10' },
                ]}
                onPress={() => onLocationSelect(location)}
                activeOpacity={0.7}
              >
                <View style={[pickerStyles.locationIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                  <Ionicons name="location" size={20} color={theme.colors.primary} />
                </View>
                <View style={pickerStyles.locationItemContent}>
                  <Text style={[pickerStyles.locationItemName, { color: theme.colors.textPrimary }]}>
                    {location.name}
                  </Text>
                  {location.address && (
                    <Text style={[pickerStyles.locationItemAddress, { color: theme.colors.textSecondary }]}>
                      {location.address}
                    </Text>
                  )}
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

// Job Type Picker Modal Component
const JobTypePickerModal = ({ visible, onClose, selectedJobType, onJobTypeSelect, title }) => {
  const theme = useTheme();
  const [tempSelectedJobType, setTempSelectedJobType] = useState(selectedJobType);

  useEffect(() => {
    if (visible) {
      setTempSelectedJobType(selectedJobType);
    }
  }, [visible, selectedJobType]);

  const jobTypes = [
    {
      id: 'longterm',
      name: 'Longterm',
      description: 'Long-term driver hire arrangement',
      icon: 'calendar-outline',
    },
    {
      id: 'quickjob',
      name: 'Quick Job',
      description: 'Short-term or one-time driver service',
      icon: 'time-outline',
    },
  ];

  const handleConfirm = () => {
    if (tempSelectedJobType) {
      onJobTypeSelect(tempSelectedJobType);
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={pickerStyles.modalOverlay}>
        <View style={[pickerStyles.modal, { backgroundColor: theme.colors.white }]}>
          <View style={pickerStyles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={pickerStyles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
            </TouchableOpacity>
            <Text style={[pickerStyles.modalTitle, { color: theme.colors.textPrimary }]}>
              {title}
            </Text>
            <View style={{ width: 40 }} />
          </View>
          
          <View style={pickerStyles.jobTypeContainer}>
            {jobTypes.map((jobType) => (
              <TouchableOpacity
                key={jobType.id}
                style={[
                  pickerStyles.jobTypeItem,
                  { 
                    borderColor: tempSelectedJobType === jobType.id ? theme.colors.primary : '#E0E0E0',
                    backgroundColor: tempSelectedJobType === jobType.id ? theme.colors.primary + '10' : 'transparent',
                  },
                ]}
                onPress={() => setTempSelectedJobType(jobType.id)}
                activeOpacity={0.7}
              >
                <View style={[
                  pickerStyles.jobTypeIconContainer, 
                  { backgroundColor: tempSelectedJobType === jobType.id ? theme.colors.primary + '20' : theme.colors.hint + '20' }
                ]}>
                  <Ionicons 
                    name={jobType.icon} 
                    size={24} 
                    color={tempSelectedJobType === jobType.id ? theme.colors.primary : theme.colors.textSecondary} 
                  />
                </View>
                <View style={pickerStyles.jobTypeContent}>
                  <Text style={[
                    pickerStyles.jobTypeName, 
                    { color: tempSelectedJobType === jobType.id ? theme.colors.primary : theme.colors.textPrimary }
                  ]}>
                    {jobType.name}
                  </Text>
                  <Text style={[
                    pickerStyles.jobTypeDescription, 
                    { color: theme.colors.textSecondary }
                  ]}>
                    {jobType.description}
                  </Text>
                </View>
                {tempSelectedJobType === jobType.id && (
                  <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={pickerStyles.modalActions}>
            <TouchableOpacity
              style={[pickerStyles.cancelButton, { borderColor: theme.colors.hint }]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={[pickerStyles.cancelText, { color: theme.colors.textPrimary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                pickerStyles.confirmButton,
                { backgroundColor: theme.colors.primary },
                !tempSelectedJobType && { opacity: 0.5 }
              ]}
              onPress={handleConfirm}
              activeOpacity={0.7}
              disabled={!tempSelectedJobType}
            >
              <Text style={[pickerStyles.confirmText, { color: theme.colors.white }]}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const pickerStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  navButton: {
    padding: 8,
  },
  monthText: {
    fontSize: 18,
    fontFamily: 'Nunito_600SemiBold',
  },
  weekDays: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 4,
  },
  dayContent: {
    flex: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 14,
    fontFamily: 'Nunito_500Medium',
  },
  timePickerContainer: {
    padding: 20,
    maxHeight: 300,
  },
  timePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  timeScrollView: {
    maxHeight: 200,
  },
  timeOption: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 2,
  },
  timeOptionText: {
    fontSize: 18,
    fontFamily: 'Nunito_500Medium',
    textAlign: 'center',
  },
  timeSeparator: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
  },
  ampmContainer: {
    gap: 8,
  },
  ampmButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  ampmText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  locationScrollView: {
    maxHeight: 400,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
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
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: '#FFFFFF',
  },
  jobTypeContainer: {
    padding: 20,
    gap: 16,
  },
  jobTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    gap: 16,
  },
  jobTypeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobTypeContent: {
    flex: 1,
  },
  jobTypeName: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  jobTypeDescription: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
});

export default ServiceBookingScreen;

