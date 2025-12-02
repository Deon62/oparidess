import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert, Modal, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect, CommonActions } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Button, Input } from '../../packages/components';
import { formatCurrency } from '../../packages/utils/currency';
import { useBookings } from '../../packages/context/BookingsContext';

// Import payment logos
const mpesaLogo = require('../../../assets/images/mpesa.png');
const visaLogo = require('../../../assets/images/visa.png');
const mastercardLogo = require('../../../assets/images/mastercard.png');

const PaymentScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { addBooking } = useBookings();
  const { totalPrice, bookingDetails } = route.params || {};
  const { payOnSite, bookingFee, totalRentalPrice } = bookingDetails || {};

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [cardType, setCardType] = useState(null); // 'visa' or 'mastercard'
  const [cardError, setCardError] = useState(null); // Error message for invalid card
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  
  const scrollViewRef = useRef(null);
  const cardNumberInputRef = useRef(null);
  const expiryInputRef = useRef(null);
  const cvvInputRef = useRef(null);
  const mpesaPhoneInputRef = useRef(null);
  const cardholderNameInputRef = useRef(null);
  const inputPositionsRef = useRef({});

  // Form data for different payment methods
  const [mpesaData, setMpesaData] = useState({
    phoneNumber: '',
  });
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
  });

  // Hide header and tab bar
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

  const paymentMethods = [
    {
      id: 'mpesa',
      name: 'Mpesa',
      logo: mpesaLogo,
    },
    {
      id: 'card',
      name: 'Card',
      logos: [visaLogo, mastercardLogo],
    },
  ];

  const validateForm = () => {
    if (!selectedMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return false;
    }

    if (selectedMethod === 'mpesa') {
      if (!mpesaData.phoneNumber.trim()) {
        Alert.alert('Error', 'Please enter your M-PESA phone number');
        return false;
      }
      const cleaned = mpesaData.phoneNumber.replace(/\s/g, '').replace(/^\+/, '');
      // If starts with 07 or 01, should be exactly 10 digits
      if (cleaned.startsWith('07') || cleaned.startsWith('01')) {
        if (cleaned.length !== 10 || !/^0[17]\d{8}$/.test(cleaned)) {
          Alert.alert('Error', 'Phone number starting with 07 or 01 must be exactly 10 digits');
          return false;
        }
      } 
      // If starts with 254, should be exactly 12 digits (254 + 9 digits)
      else if (cleaned.startsWith('254')) {
        if (cleaned.length !== 12 || !/^254[17]\d{9}$/.test(cleaned)) {
          Alert.alert('Error', 'Phone number starting with 254 must be in format: 254 7XXX XXXXX');
          return false;
        }
      } else {
        Alert.alert('Error', 'Phone number must start with 07, 01, or 254');
        return false;
      }
    }

    if (selectedMethod === 'card') {
      if (!cardData.cardNumber.trim()) {
        Alert.alert('Error', 'Please enter card number');
        return false;
      }
      if (cardData.cardNumber.replace(/\s/g, '').length < 16) {
        Alert.alert('Error', 'Please enter a valid card number');
        return false;
      }
      if (!cardData.cardholderName.trim()) {
        Alert.alert('Error', 'Please enter cardholder name');
        return false;
      }
      if (!cardData.expiryDate.trim()) {
        Alert.alert('Error', 'Please enter expiry date');
        return false;
      }
      if (!/^\d{2}\/\d{2}$/.test(cardData.expiryDate)) {
        Alert.alert('Error', 'Please enter expiry date in MM/YY format');
        return false;
      }
      if (!cardData.cvv.trim()) {
        Alert.alert('Error', `Please enter ${cardType === 'visa' ? 'CVC' : 'CVV'}`);
        return false;
      }
      if (cardData.cvv.length !== 3) {
        Alert.alert('Error', `Please enter a valid ${cardType === 'visa' ? 'CVC' : 'CVV'} (3 digits)`);
        return false;
      }
    }

    return true;
  };

  // Check if all required fields are filled for the selected payment method
  const isFormComplete = () => {
    if (!selectedMethod) {
      return false;
    }

    if (selectedMethod === 'mpesa') {
      const phone = mpesaData.phoneNumber.trim();
      if (!phone) return false;
      const cleaned = phone.replace(/\s/g, '').replace(/^\+/, '');
      // If starts with 07 or 01, should be exactly 10 digits
      if (cleaned.startsWith('07') || cleaned.startsWith('01')) {
        return cleaned.length === 10 && /^0[17]\d{8}$/.test(cleaned);
      }
      // If starts with 254, should be exactly 12 digits (254 + 9 digits)
      if (cleaned.startsWith('254')) {
        return cleaned.length === 12 && /^254[17]\d{9}$/.test(cleaned);
      }
      return false;
    }

    if (selectedMethod === 'card') {
      const cardNumber = cardData.cardNumber.replace(/\s/g, '');
      const expiryDate = cardData.expiryDate.trim();
      const cvv = cardData.cvv.trim();
      const cardholderName = cardData.cardholderName.trim();

      return (
        cardNumber.length >= 16 &&
        cardholderName.length > 0 &&
        expiryDate.length === 5 &&
        /^\d{2}\/\d{2}$/.test(expiryDate) &&
        cvv.length === 3
      );
    }

    return false;
  };

  const handleInitiatePayment = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual payment processing
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Save booking to context after successful payment
      if (bookingDetails) {
        const bookingToSave = {
          id: bookingDetails.bookingId || `BK-${Date.now()}`,
          carName: bookingDetails.car?.name || 'Car',
          image: bookingDetails.car?.image || require('../../../assets/images/car1.webp'),
          date: bookingDetails.pickupDate || new Date().toISOString(),
          pickupDate: bookingDetails.pickupDate || new Date().toISOString(),
          dropoffDate: bookingDetails.dropoffDate || new Date().toISOString(),
          pickupTime: bookingDetails.pickupTime || '10:00',
          dropoffTime: bookingDetails.dropoffTime || '10:00',
          days: bookingDetails.days || 1,
          duration: `${bookingDetails.days || 1} day${(bookingDetails.days || 1) > 1 ? 's' : ''}`,
          price: formatCurrency(totalPrice || 0),
          pickupLocation: bookingDetails.pickupLocation || 'Nairobi CBD, Kenya',
          dropoffLocation: bookingDetails.dropoffLocation || bookingDetails.pickupLocation || 'Nairobi CBD, Kenya',
          paymentMethod: selectedMethod || 'mpesa',
          status: bookingDetails.payOnSite ? 'pending' : 'active', // Pay on site bookings are pending, full payments are active
          payOnSite: bookingDetails.payOnSite || false,
          bookingId: bookingDetails.bookingId || `BK-${Date.now()}`,
          car: bookingDetails.car,
        };
        addBooking(bookingToSave);
      }

      setShowSuccessModal(true);
    } catch (error) {
      Alert.alert('Error', 'Payment failed. Please try again.');
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  const detectCardType = (cardNumber) => {
    // Remove spaces for detection
    const cleaned = cardNumber.replace(/\s/g, '');
    if (cleaned.length === 0) {
      setCardType(null);
      setCardError(null);
      return null;
    }
    
    const firstDigit = cleaned[0];
    if (firstDigit === '4') {
      setCardType('visa');
      setCardError(null);
      return 'visa';
    } else if (firstDigit === '5') {
      setCardType('mastercard');
      setCardError(null);
      return 'mastercard';
    } else {
      // Invalid card type - show error immediately
      setCardType(null);
      setCardError('Card number must start with 4 (Visa) or 5 (Mastercard)');
      return null;
    }
  };

  const formatCardNumber = (text) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    // Detect card type
    detectCardType(cleaned);
    // Add spaces every 4 digits
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted;
  };
  
  // Keyboard listeners to handle scroll when keyboard appears
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        const height = e.endCoordinates.height;
        setKeyboardHeight(height);
        // Don't auto-scroll here - let handleInputFocus handle it
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleInputFocus = (inputRef, inputKey) => {
    // Store input reference for scrolling
    if (inputKey && inputRef) {
      inputPositionsRef.current[inputKey] = inputRef;
    }
    // Don't auto-scroll - let KeyboardAvoidingView handle it naturally
    // This prevents the extra scrolling issue
  };

  const formatExpiryDate = (text) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    // Format as MM/YY
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Sticky Back Button */}
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 8 }]}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
      </TouchableOpacity>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
          scrollEnabled={true}
        >
        {/* Payment Methods */}
        <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Select Payment Method
          </Text>

          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethodCard,
                {
                  backgroundColor: selectedMethod === method.id ? theme.colors.primary + '10' : 'transparent',
                  borderColor: selectedMethod === method.id ? theme.colors.primary : '#E0E0E0',
                },
              ]}
              onPress={() => {
                setSelectedMethod(method.id);
                if (method.id !== 'card') {
                  setCardType(null);
                  setCardError(null);
                  setCardData({
                    cardNumber: '',
                    cardholderName: '',
                    expiryDate: '',
                    cvv: '',
                  });
                }
              }}
              activeOpacity={0.7}
            >
              <View style={styles.paymentMethodLeft}>
                {method.logo ? (
                  <Image source={method.logo} style={styles.paymentLogo} resizeMode="contain" />
                ) : method.logos ? (
                  <View style={styles.cardLogosContainer}>
                    {method.logos.map((logo, index) => (
                      <Image
                        key={index}
                        source={logo}
                        style={[styles.paymentLogo, styles.cardLogo]}
                        resizeMode="contain"
                      />
                    ))}
                  </View>
                ) : null}
                <View style={styles.paymentMethodInfo}>
                  <Text style={[styles.paymentMethodName, { color: theme.colors.textPrimary }]}>
                    {method.name}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.radioButton,
                  {
                    borderColor: selectedMethod === method.id ? theme.colors.primary : theme.colors.hint,
                  },
                ]}
              >
                {selectedMethod === method.id && (
                  <View style={[styles.radioButtonInner, { backgroundColor: theme.colors.primary }]} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Details Forms */}
        {selectedMethod === 'mpesa' && (
          <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              M-PESA Details
            </Text>
            <Input
              ref={mpesaPhoneInputRef}
              label="Phone Number"
              placeholder="+254 712 345 678"
              value={mpesaData.phoneNumber}
              onChangeText={(value) => {
                // Remove all non-digits, but allow + at the start
                const hasPlus = value.startsWith('+');
                let digitsOnly = value.replace(/[^\d]/g, '');
                
                // Limit based on format
                if (digitsOnly.startsWith('254')) {
                  // Limit to 12 digits for 254 format
                  digitsOnly = digitsOnly.slice(0, 12);
                  // Format as: 254 712 345 678
                  let formatted = digitsOnly;
                  if (formatted.length > 3) {
                    formatted = '254 ' + formatted.slice(3);
                    if (formatted.length > 7) {
                      formatted = formatted.slice(0, 7) + ' ' + formatted.slice(7);
                      if (formatted.length > 11) {
                        formatted = formatted.slice(0, 11) + ' ' + formatted.slice(11);
                      }
                    }
                  }
                  setMpesaData({ ...mpesaData, phoneNumber: (hasPlus ? '+' : '') + formatted });
                } else if (digitsOnly.startsWith('07') || digitsOnly.startsWith('01')) {
                  // Limit to 10 digits for 07/01 format
                  digitsOnly = digitsOnly.slice(0, 10);
                  // Format as: 07022 48 984 (5 digits, space, 2 digits, space, 3 digits)
                  let formatted = digitsOnly;
                  if (formatted.length > 5) {
                    formatted = formatted.slice(0, 5) + ' ' + formatted.slice(5);
                    if (formatted.length > 8) {
                      formatted = formatted.slice(0, 8) + ' ' + formatted.slice(8);
                    }
                  }
                  setMpesaData({ ...mpesaData, phoneNumber: formatted });
                } else if (digitsOnly.startsWith('0')) {
                  // If starts with 0, limit to 10 (will be 07 or 01)
                  digitsOnly = digitsOnly.slice(0, 10);
                  // Format as: 07022 48 984
                  let formatted = digitsOnly;
                  if (formatted.length > 5) {
                    formatted = formatted.slice(0, 5) + ' ' + formatted.slice(5);
                    if (formatted.length > 8) {
                      formatted = formatted.slice(0, 8) + ' ' + formatted.slice(8);
                    }
                  }
                  setMpesaData({ ...mpesaData, phoneNumber: formatted });
                } else {
                  // Otherwise, limit to 12 (might be typing 254)
                  digitsOnly = digitsOnly.slice(0, 12);
                  // Format as: 254 712 345 678
                  let formatted = digitsOnly;
                  if (formatted.length > 3) {
                    formatted = '254 ' + formatted.slice(3);
                    if (formatted.length > 7) {
                      formatted = formatted.slice(0, 7) + ' ' + formatted.slice(7);
                      if (formatted.length > 11) {
                        formatted = formatted.slice(0, 11) + ' ' + formatted.slice(11);
                      }
                    }
                  }
                  setMpesaData({ ...mpesaData, phoneNumber: (hasPlus ? '+' : '') + formatted });
                }
              }}
              keyboardType="phone-pad"
              onFocus={() => handleInputFocus(mpesaPhoneInputRef, 'mpesaPhone')}
            />
            <Text style={[styles.infoText, { color: theme.colors.hint }]}>
              You will receive an M-PESA prompt on your phone to complete the payment.
            </Text>
          </View>
        )}

        {selectedMethod === 'card' && (
          <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Card Details
            </Text>
            <View>
              <Input
                ref={cardNumberInputRef}
                label="Card Number"
                placeholder="1234 5678 9012 3456"
                value={cardData.cardNumber}
                onChangeText={(value) =>
                  setCardData({ ...cardData, cardNumber: formatCardNumber(value) })
                }
                keyboardType="numeric"
                maxLength={19}
                onFocus={() => handleInputFocus(cardNumberInputRef, 'cardNumber')}
                error={cardError}
                suffix={
                  cardData.cardNumber.replace(/\s/g, '').length > 0 && cardType ? (
                    <Image
                      source={cardType === 'visa' ? visaLogo : mastercardLogo}
                      style={styles.cardIcon}
                      resizeMode="contain"
                    />
                  ) : null
                }
              />
            </View>
            <Input
              ref={cardholderNameInputRef}
              label="Cardholder Name"
              placeholder="John Doe"
              value={cardData.cardholderName}
              onChangeText={(value) => setCardData({ ...cardData, cardholderName: value })}
              autoCapitalize="words"
              onFocus={() => handleInputFocus(cardholderNameInputRef, 'cardholderName')}
            />
            <View style={styles.cardRow}>
              <View style={styles.cardRowItem}>
                <Input
                  ref={expiryInputRef}
                  label="Expiry Date"
                  placeholder="MM/YY"
                  value={cardData.expiryDate}
                  onChangeText={(value) =>
                    setCardData({ ...cardData, expiryDate: formatExpiryDate(value) })
                  }
                  keyboardType="numeric"
                  maxLength={5}
                  onFocus={() => handleInputFocus(expiryInputRef, 'expiryDate')}
                />
              </View>
              <View style={styles.cardRowItem}>
                <Input
                  ref={cvvInputRef}
                  label={cardType === 'visa' ? 'CVC' : 'CVV'}
                  placeholder={cardType === 'visa' ? '123' : '123'}
                  value={cardData.cvv}
                  onChangeText={(value) => {
                    const cleaned = value.replace(/\D/g, '').slice(0, 3);
                    setCardData({ ...cardData, cvv: cleaned });
                  }}
                  keyboardType="numeric"
                  secureTextEntry
                  maxLength={3}
                  onFocus={() => handleInputFocus(cvvInputRef, 'cvv')}
                />
              </View>
            </View>
          </View>
        )}

        {/* Bottom Spacing - Extra space for keyboard and bottom bar */}
        <View style={{ height: 120 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Payment Bar - Fixed at bottom */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <View style={styles.bottomBarPrice}>
          <Text style={[styles.bottomBarLabel, { color: theme.colors.hint }]}>Total</Text>
          <Text style={[styles.bottomBarPriceValue, { color: theme.colors.primary }]}>
            {formatCurrency(totalPrice || 0)}
          </Text>
        </View>
        <Button
          title="Initiate Payment"
          onPress={handleInitiatePayment}
          variant="primary"
          style={[styles.payButton, { backgroundColor: '#FF1577' }]}
          loading={loading}
          disabled={!isFormComplete() || loading}
        />
      </View>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.successModalOverlay}>
          <View style={[styles.successModalContent, { backgroundColor: theme.colors.white }]}>
            <View style={[styles.successIconCircle, { backgroundColor: '#4CAF50' + '20' }]}>
              <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
            </View>
            <Text style={[styles.successModalTitle, { color: theme.colors.textPrimary }]}>
              Payment Successful!
            </Text>
            <Text style={[styles.successModalMessage, { color: theme.colors.textSecondary }]}>
              {payOnSite 
                ? `Your booking fee of ${formatCurrency(totalPrice || 0)} has been processed. Your booking is confirmed! You'll pay the remaining ${formatCurrency((totalRentalPrice || 0) - (bookingFee || 0))} directly to the car owner at pickup.`
                : `Your payment of ${formatCurrency(totalPrice || 0)} has been processed successfully.`
              }
            </Text>
            <View style={styles.successModalDetails}>
              <View style={styles.successDetailRow}>
                <Text style={[styles.successDetailLabel, { color: theme.colors.hint }]}>
                  Payment Method
                </Text>
                <Text style={[styles.successDetailValue, { color: theme.colors.textPrimary }]}>
                  {selectedMethod === 'mpesa' ? 'Mpesa' : 'Card'}
                </Text>
              </View>
              <View style={styles.successDetailRow}>
                <Text style={[styles.successDetailLabel, { color: theme.colors.hint }]}>
                  Amount Paid
                </Text>
                <Text style={[styles.successDetailValue, { color: theme.colors.primary }]}>
                  {formatCurrency(totalPrice || 0)}
                </Text>
              </View>
            </View>
            <Button
              title="View My Bookings"
              onPress={() => {
                setShowSuccessModal(false);
                // Reset the HomeTab stack (current navigator) to only have RenterHome
                // This clears Payment, BookingConfirmation, Booking, etc. from the stack
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'RenterHome' }],
                  })
                );
                
                // Then navigate to BookingsTab
                const tabNavigator = navigation.getParent();
                if (tabNavigator) {
                  setTimeout(() => {
                    tabNavigator.navigate('BookingsTab', {
                      screen: 'BookingsList',
                    });
                  }, 100);
                }
              }}
              variant="primary"
              style={styles.successModalButton}
            />
          </View>
        </View>
      </Modal>
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
  scrollContent: {
    paddingBottom: 200, // Add extra padding for fixed bottom bar and keyboard
    paddingTop: 80, // Add top padding for back button
    flexGrow: 1,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  amountCard: {
    marginHorizontal: 24,
    marginTop: 24,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amountValue: {
    fontSize: 36,
    fontFamily: 'Nunito_700Bold',
  },
  payOnSiteNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 8,
    width: '100%',
  },
  payOnSiteNoteText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 16,
  },
  section: {
    marginHorizontal: 24,
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 10,
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  paymentLogo: {
    width: 50,
    height: 35,
  },
  cardLogosContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  cardLogo: {
    width: 50,
    height: 30,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cardRowItem: {
    flex: 1,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    marginTop: 8,
    lineHeight: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 16,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
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
    minWidth: 160,
  },
  // Success Modal Styles
  successModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  successModalContent: {
    width: '85%',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
  },
  successIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successModalTitle: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  successModalMessage: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  successModalDetails: {
    width: '100%',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 24,
    gap: 16,
  },
  successDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  successDetailLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  successDetailValue: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  successModalButton: {
    width: '100%',
  },
  cardIcon: {
    width: 40,
    height: 25,
  },
});

export default PaymentScreen;

