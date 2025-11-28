import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Button, Input } from '../../packages/components';

// Import payment logos
const mpesaLogo = require('../../../assets/images/mpesa.png');
const airtelLogo = require('../../../assets/images/airtel.png');
const visaLogo = require('../../../assets/images/visa.png');
const mastercardLogo = require('../../../assets/images/mastercard.png');

const OwnerAddPaymentScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [selectedMethod, setSelectedMethod] = useState(null); // 'card', 'mpesa', 'airtel'
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Form data for different payment methods
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
  });
  const [mpesaData, setMpesaData] = useState({
    phoneNumber: '',
  });
  const [airtelData, setAirtelData] = useState({
    phoneNumber: '',
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Add Payment Method',
    });
  }, [navigation]);

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : cleaned;
  };

  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const validateForm = () => {
    if (selectedMethod === 'card') {
      if (!cardData.cardNumber || cardData.cardNumber.replace(/\s/g, '').length < 16) {
        Alert.alert('Error', 'Please enter a valid card number');
        return false;
      }
      if (!cardData.cardholderName) {
        Alert.alert('Error', 'Please enter cardholder name');
        return false;
      }
      if (!cardData.expiryDate || cardData.expiryDate.length < 5) {
        Alert.alert('Error', 'Please enter a valid expiry date');
        return false;
      }
      if (!cardData.cvv || cardData.cvv.length < 3) {
        Alert.alert('Error', 'Please enter a valid CVV');
        return false;
      }
    } else if (selectedMethod === 'mpesa') {
      if (!mpesaData.phoneNumber || mpesaData.phoneNumber.length < 10) {
        Alert.alert('Error', 'Please enter a valid M-PESA phone number');
        return false;
      }
    } else if (selectedMethod === 'airtel') {
      if (!airtelData.phoneNumber || airtelData.phoneNumber.length < 10) {
        Alert.alert('Error', 'Please enter a valid Airtel Money phone number');
        return false;
      }
    }
    return true;
  };

  const handleAddPayment = async () => {
    if (!selectedMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual payment method addition
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setShowSuccessModal(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to add payment method. Please try again.');
      console.error('Add payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigation.goBack();
  };

  const PaymentMethodCard = ({ method, title, logo, logos, onPress, isSelected }) => (
    <TouchableOpacity
      style={[
        styles.paymentMethodCard,
        {
          backgroundColor: theme.colors.white,
          borderColor: isSelected ? theme.colors.primary : '#E0E0E0',
          borderWidth: isSelected ? 2 : 1,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.paymentMethodLeft}>
        {logo && <Image source={logo} style={styles.paymentLogo} resizeMode="contain" />}
        {logos && (
          <View style={styles.cardLogosContainer}>
            {logos.map((logoItem, index) => (
              <Image key={index} source={logoItem} style={styles.cardLogo} resizeMode="contain" />
            ))}
          </View>
        )}
        <Text style={[styles.paymentMethodName, { color: theme.colors.textPrimary }]}>
          {title}
        </Text>
      </View>
      {isSelected && (
        <View style={[styles.radioButton, { borderColor: theme.colors.primary }]}>
          <View style={[styles.radioButtonInner, { backgroundColor: theme.colors.primary }]} />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
        Select Payment Method
      </Text>

      {/* Payment Method Selection */}
      <View style={styles.paymentMethodsContainer}>
        <PaymentMethodCard
          method="card"
          title="Credit/Debit Card"
          logos={[visaLogo, mastercardLogo]}
          onPress={() => setSelectedMethod('card')}
          isSelected={selectedMethod === 'card'}
        />
        <PaymentMethodCard
          method="mpesa"
          title="M-PESA"
          logo={mpesaLogo}
          onPress={() => setSelectedMethod('mpesa')}
          isSelected={selectedMethod === 'mpesa'}
        />
        <PaymentMethodCard
          method="airtel"
          title="Airtel Money"
          logo={airtelLogo}
          onPress={() => setSelectedMethod('airtel')}
          isSelected={selectedMethod === 'airtel'}
        />
      </View>

      {/* Form Fields Based on Selection */}
      {selectedMethod === 'card' && (
        <View style={styles.formSection}>
          <Text style={[styles.formSectionTitle, { color: theme.colors.textPrimary }]}>
            Card Details
          </Text>
          <Input
            label="Card Number"
            placeholder="1234 5678 9012 3456"
            value={cardData.cardNumber}
            onChangeText={(value) =>
              setCardData({ ...cardData, cardNumber: formatCardNumber(value) })
            }
            keyboardType="numeric"
            maxLength={19}
          />
          <Input
            label="Cardholder Name"
            placeholder="John Doe"
            value={cardData.cardholderName}
            onChangeText={(value) => setCardData({ ...cardData, cardholderName: value })}
            autoCapitalize="words"
          />
          <View style={styles.cardRow}>
            <View style={styles.cardRowItem}>
              <Input
                label="Expiry Date"
                placeholder="MM/YY"
                value={cardData.expiryDate}
                onChangeText={(value) =>
                  setCardData({ ...cardData, expiryDate: formatExpiryDate(value) })
                }
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
            <View style={styles.cardRowItem}>
              <Input
                label="CVV"
                placeholder="123"
                value={cardData.cvv}
                onChangeText={(value) => setCardData({ ...cardData, cvv: value.replace(/\D/g, '') })}
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
              />
            </View>
          </View>
        </View>
      )}

      {selectedMethod === 'mpesa' && (
        <View style={styles.formSection}>
          <Text style={[styles.formSectionTitle, { color: theme.colors.textPrimary }]}>
            M-PESA Details
          </Text>
          <Input
            label="Phone Number"
            placeholder="0712 345 678"
            value={mpesaData.phoneNumber}
            onChangeText={(value) =>
              setMpesaData({ ...mpesaData, phoneNumber: value.replace(/\D/g, '') })
            }
            keyboardType="phone-pad"
            maxLength={12}
          />
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            Make sure your phone number is registered with M-PESA.
          </Text>
        </View>
      )}

      {selectedMethod === 'airtel' && (
        <View style={styles.formSection}>
          <Text style={[styles.formSectionTitle, { color: theme.colors.textPrimary }]}>
            Airtel Money Details
          </Text>
          <Input
            label="Phone Number"
            placeholder="0712 345 678"
            value={airtelData.phoneNumber}
            onChangeText={(value) =>
              setAirtelData({ ...airtelData, phoneNumber: value.replace(/\D/g, '') })
            }
            keyboardType="phone-pad"
            maxLength={12}
          />
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            Make sure your phone number is registered with Airtel Money.
          </Text>
        </View>
      )}

      {/* Add Payment Button */}
      {selectedMethod && (
        <Button
          title="Add Payment Method"
          onPress={handleAddPayment}
          variant="primary"
          style={styles.addButton}
          loading={loading}
        />
      )}

      {/* Bottom Spacing */}
      <View style={{ height: 40 }} />

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={handleSuccessClose}
      >
        <View style={styles.successModalOverlay}>
          <View style={[styles.successModalContent, { backgroundColor: theme.colors.white }]}>
            <View style={[styles.successIconCircle, { backgroundColor: '#4CAF50' + '20' }]}>
              <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
            </View>
            <Text style={[styles.successModalTitle, { color: theme.colors.textPrimary }]}>
              Payment Method Added!
            </Text>
            <Text style={[styles.successModalMessage, { color: theme.colors.textSecondary }]}>
              Your payment method has been added successfully and is ready to use.
            </Text>
            <TouchableOpacity
              style={[styles.successModalButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleSuccessClose}
              activeOpacity={0.7}
            >
              <Text style={[styles.successModalButtonText, { color: theme.colors.white }]}>
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  paymentMethodsContainer: {
    gap: 12,
    marginBottom: 32,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 0,
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  paymentLogo: {
    width: 60,
    height: 40,
  },
  cardLogosContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  cardLogo: {
    width: 50,
    height: 30,
  },
  paymentMethodName: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    flex: 1,
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
  formSection: {
    marginBottom: 24,
  },
  formSectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 20,
    letterSpacing: -0.3,
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
  addButton: {
    marginTop: 8,
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
  successModalButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  successModalButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
});

export default OwnerAddPaymentScreen;

