import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Button, Input, Card } from '../../packages/components';

// Import payment logos
const mpesaLogo = require('../../../assets/images/mpesa.png');
const airtelLogo = require('../../../assets/images/airtel.png');
const visaLogo = require('../../../assets/images/visa.png');
const mastercardLogo = require('../../../assets/images/mastercard.png');

const WithdrawRequestScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { availableBalance } = route.params || { availableBalance: 0 };

  const [selectedMethod, setSelectedMethod] = useState(null); // 'card', 'mpesa', 'airtel'
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [withdrawalDetails, setWithdrawalDetails] = useState(null);

  // Form data for different payment methods
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardholderName: '',
  });
  const [mpesaData, setMpesaData] = useState({
    phoneNumber: '',
  });
  const [airtelData, setAirtelData] = useState({
    phoneNumber: '',
  });

  // Mock saved payment methods
  const savedMethods = {
    mpesa: { phoneNumber: '0712 345 678', isDefault: true },
    airtel: null,
    card: { last4: '1234', cardholderName: 'John Doe', isDefault: false },
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Withdraw Funds',
    });
  }, [navigation]);

  const formatCurrency = (value) => {
    const cleaned = value.replace(/[^0-9.]/g, '');
    if (cleaned === '') return '';
    const num = parseFloat(cleaned);
    return isNaN(num) ? '' : num.toFixed(2);
  };

  const validateForm = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid withdrawal amount');
      return false;
    }

    const withdrawalAmount = parseFloat(amount);
    if (withdrawalAmount > availableBalance) {
      Alert.alert('Error', `Insufficient balance. Available balance is $${availableBalance.toFixed(2)}`);
      return false;
    }

    if (withdrawalAmount < 10) {
      Alert.alert('Error', 'Minimum withdrawal amount is $10');
      return false;
    }

    if (!selectedMethod) {
      Alert.alert('Error', 'Please select a withdrawal method');
      return false;
    }

    if (selectedMethod === 'card') {
      if (!cardData.cardNumber || cardData.cardNumber.replace(/\s/g, '').length < 16) {
        Alert.alert('Error', 'Please enter a valid card number');
        return false;
      }
      if (!cardData.cardholderName) {
        Alert.alert('Error', 'Please enter cardholder name');
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

  const handleWithdraw = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual withdrawal API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const withdrawalData = {
        amount: parseFloat(amount),
        method: selectedMethod,
        timestamp: new Date().toISOString(),
        reference: 'WD' + Date.now(),
      };

      setWithdrawalDetails(withdrawalData);
      setShowSuccessModal(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to process withdrawal. Please try again.');
      console.error('Withdrawal error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigation.goBack();
  };

  const PaymentMethodCard = ({ method, title, logo, logos, onPress, isSelected, savedInfo }) => (
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
        <View style={styles.paymentMethodInfo}>
          <Text style={[styles.paymentMethodName, { color: theme.colors.textPrimary }]}>
            {title}
          </Text>
          {savedInfo && (
            <Text style={[styles.savedInfoText, { color: theme.colors.textSecondary }]}>
              {method === 'card' 
                ? `•••• ${savedInfo.last4} - ${savedInfo.cardholderName}`
                : savedInfo.phoneNumber}
            </Text>
          )}
        </View>
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
      {/* Available Balance */}
      <Card style={[styles.balanceCard, { backgroundColor: theme.colors.white }]}>
        <Text style={[styles.balanceLabel, { color: theme.colors.textSecondary }]}>
          Available Balance
        </Text>
        <Text style={[styles.balanceAmount, { color: theme.colors.primary }]}>
          ${availableBalance.toFixed(2)}
        </Text>
      </Card>

      {/* Amount Input */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Withdrawal Amount
        </Text>
        <Input
          label="Amount"
          placeholder="0.00"
          value={amount}
          onChangeText={(value) => setAmount(formatCurrency(value))}
          keyboardType="decimal-pad"
          prefix="$"
        />
        <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
          Minimum withdrawal: $10.00
        </Text>
      </View>

      {/* Payment Method Selection */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Select Withdrawal Method
        </Text>
        <View style={styles.paymentMethodsContainer}>
          <PaymentMethodCard
            method="mpesa"
            title="M-PESA"
            logo={mpesaLogo}
            onPress={() => setSelectedMethod('mpesa')}
            isSelected={selectedMethod === 'mpesa'}
            savedInfo={savedMethods.mpesa}
          />
          <PaymentMethodCard
            method="airtel"
            title="Airtel Money"
            logo={airtelLogo}
            onPress={() => setSelectedMethod('airtel')}
            isSelected={selectedMethod === 'airtel'}
            savedInfo={savedMethods.airtel}
          />
          <PaymentMethodCard
            method="card"
            title="Bank Card"
            logos={[visaLogo, mastercardLogo]}
            onPress={() => setSelectedMethod('card')}
            isSelected={selectedMethod === 'card'}
            savedInfo={savedMethods.card}
          />
        </View>
      </View>

      {/* Form Fields Based on Selection */}
      {selectedMethod === 'card' && !savedMethods.card && (
        <View style={styles.formSection}>
          <Text style={[styles.formSectionTitle, { color: theme.colors.textPrimary }]}>
            Card Details
          </Text>
          <Input
            label="Card Number"
            placeholder="1234 5678 9012 3456"
            value={cardData.cardNumber}
            onChangeText={(value) => {
              const cleaned = value.replace(/\D/g, '');
              const match = cleaned.match(/.{1,4}/g);
              const formatted = match ? match.join(' ') : cleaned;
              setCardData({ ...cardData, cardNumber: formatted });
            }}
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
        </View>
      )}

      {selectedMethod === 'mpesa' && !savedMethods.mpesa && (
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

      {selectedMethod === 'airtel' && !savedMethods.airtel && (
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

      {/* Withdraw Button */}
      {selectedMethod && (
        <Button
          title="Request Withdrawal"
          onPress={handleWithdraw}
          variant="primary"
          style={styles.withdrawButton}
          loading={loading}
          disabled={!amount || parseFloat(amount) <= 0}
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
              Withdrawal Request Submitted!
            </Text>
            <Text style={[styles.successModalMessage, { color: theme.colors.textSecondary }]}>
              Your withdrawal request of {withdrawalDetails && `$${withdrawalDetails.amount.toFixed(2)}`} has been submitted successfully.
            </Text>
            
            {withdrawalDetails && (
              <Card style={[styles.detailsCard, { backgroundColor: theme.colors.background }]}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                    Reference Number:
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                    {withdrawalDetails.reference}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                    Method:
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                    {withdrawalDetails.method === 'mpesa' ? 'M-PESA' : 
                     withdrawalDetails.method === 'airtel' ? 'Airtel Money' : 'Bank Card'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                    Status:
                  </Text>
                  <Text style={[styles.detailValue, { color: '#FFA500' }]}>
                    Processing
                  </Text>
                </View>
              </Card>
            )}

            <Text style={[styles.successModalSubtext, { color: theme.colors.textSecondary }]}>
              Funds will be transferred within 1-3 business days.
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
  balanceCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontFamily: 'Nunito_700Bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  paymentMethodsContainer: {
    gap: 12,
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
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 4,
  },
  savedInfoText: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
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
  infoText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    marginTop: 8,
    lineHeight: 20,
  },
  withdrawButton: {
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
    marginBottom: 20,
    lineHeight: 22,
  },
  detailsCard: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  successModalSubtext: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
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

export default WithdrawRequestScreen;

