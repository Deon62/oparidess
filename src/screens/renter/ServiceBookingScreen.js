import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform, KeyboardAvoidingView } from 'react-native';
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
  
  // Conditional fields based on service category
  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [numberOfPassengers, setNumberOfPassengers] = useState('');
  const [duration, setDuration] = useState('');
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

    // Validate category-specific required fields
    const categoryStr = (category || '').toLowerCase();
    if (categoryStr.includes('road trips') || categoryStr.includes('hire professional drivers') || categoryStr.includes('drivers')) {
      if (!pickupLocation.trim()) {
        Alert.alert('Required', 'Please enter pickup location');
        return;
      }
      if (!destination.trim()) {
        Alert.alert('Required', 'Please enter destination');
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
    } else if (categoryStr.includes('roadside')) {
      if (!currentLocation.trim()) {
        Alert.alert('Required', 'Please enter current location');
        return;
      }
      if (!issueType.trim()) {
        Alert.alert('Required', 'Please select issue type');
        return;
      }
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
      // Category-specific fields
      pickupLocation: pickupLocation.trim(),
      destination: destination.trim(),
      numberOfPassengers: numberOfPassengers.trim(),
      duration: duration.trim(),
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
        <View style={[styles.summaryCard, { backgroundColor: theme.colors.white }]}>
          <Text style={[styles.summaryTitle, { color: theme.colors.textPrimary }]}>
            Service Summary
          </Text>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryContent}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryIconContainer}>
                <Ionicons name="business-outline" size={20} color={theme.colors.primary} />
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
                <Ionicons name="pricetag-outline" size={20} color={theme.colors.primary} />
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

        {/* Conditional Fields Based on Service Category */}
        {(() => {
          const categoryStr = (category || '').toLowerCase();
          
          // Drivers & Road Trips
          if (categoryStr.includes('road trips') || categoryStr.includes('hire professional drivers') || categoryStr.includes('drivers')) {
            return (
              <>
                <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
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
                <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
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
                <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
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
                <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
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
              </>
            );
          }
          
          // VIP Wedding
          if (categoryStr.includes('wedding') || categoryStr.includes('vip wedding')) {
            return (
              <>
                <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                    Event Location <Text style={{ color: '#FF3B30' }}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, { 
                      borderColor: theme.colors.hint,
                      color: theme.colors.textPrimary,
                      backgroundColor: theme.colors.background
                    }]}
                    placeholder="Enter event location"
                    placeholderTextColor={theme.colors.hint}
                    value={eventLocation}
                    onChangeText={setEventLocation}
                  />
                </View>
                <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
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
              </>
            );
          }
          
          // Movers
          if (categoryStr.includes('movers')) {
            return (
              <>
                <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
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
                <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
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
                <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
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
              </>
            );
          }
          
          // Auto Parts
          if (categoryStr.includes('parts') || categoryStr.includes('automobile parts')) {
            return (
              <>
                <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
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
                <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
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
                <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
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
              </>
            );
          }
          
          // Car Detailing
          if (categoryStr.includes('detailing') || categoryStr.includes('car detailing')) {
            return (
              <>
                <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
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
                <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
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
                <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
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
              </>
            );
          }
          
          // Roadside Assistance
          if (categoryStr.includes('roadside')) {
            return (
              <>
                <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                    Current Location <Text style={{ color: '#FF3B30' }}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, { 
                      borderColor: theme.colors.hint,
                      color: theme.colors.textPrimary,
                      backgroundColor: theme.colors.background
                    }]}
                    placeholder="Enter your current location"
                    placeholderTextColor={theme.colors.hint}
                    value={currentLocation}
                    onChangeText={setCurrentLocation}
                  />
                </View>
                <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
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
                <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
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
              </>
            );
          }
          
          return null;
        })()}

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

        {/* Bottom Spacing - Extra space for keyboard and bottom bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Bar with Price and Pay Now Button - Fixed at bottom */}
      <View style={[styles.footer, { backgroundColor: theme.colors.white, paddingBottom: Math.max(insets.bottom, 20) }]}>
        <View style={styles.bottomBarPrice}>
          <Text style={[styles.bottomBarLabel, { color: theme.colors.hint }]}>Total</Text>
          <Text style={[styles.bottomBarPriceValue, { color: theme.colors.primary }]}>
            {service?.price || 'KSh 0'}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.payNowButton, { backgroundColor: '#FF1577' }]}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={[styles.payNowButtonText, { color: theme.colors.white }]}>
            Pay Now
          </Text>
        </TouchableOpacity>
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
    gap: 16,
  },
  summaryCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 16,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: 16,
  },
  summaryContent: {
    gap: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  summaryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    marginBottom: 4,
  },
  bottomBarPriceValue: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
  },
  payNowButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    maxWidth: 200,
  },
  payNowButtonText: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
});

export default ServiceBookingScreen;

