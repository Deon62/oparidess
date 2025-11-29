import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Button, Input } from '../../packages/components';
import { formatCurrency } from '../../packages/utils/currency';

const OwnerWithdrawRequestScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { availableBalance } = route.params || {};
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Mock payment methods - in real app, fetch from API
  const paymentMethods = [
    { id: 1, type: 'mpesa', name: 'M-PESA', details: '0712 345 678' },
    { id: 2, type: 'card', name: 'Visa Card', details: '**** 1234' },
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Withdraw Funds',
    });
  }, [navigation]);


  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid withdrawal amount');
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (amount > availableBalance) {
      Alert.alert('Error', 'Insufficient balance. You cannot withdraw more than your available balance.');
      return;
    }

    if (!selectedPaymentMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual withdrawal request
      await new Promise((resolve) => setTimeout(resolve, 2000));
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

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Available Balance */}
      <View style={[styles.balanceCard, { backgroundColor: theme.colors.white }]}>
        <Text style={[styles.balanceLabel, { color: theme.colors.textSecondary }]}>
          Available Balance
        </Text>
        <Text style={[styles.balanceAmount, { color: theme.colors.textPrimary }]}>
          {formatCurrency(availableBalance)}
        </Text>
      </View>

      {/* Withdrawal Amount */}
      <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Withdrawal Amount
        </Text>
        <Input
          label="Amount"
          placeholder="0.00"
          value={withdrawAmount}
          onChangeText={(value) => setWithdrawAmount(value.replace(/[^0-9.]/g, ''))}
          keyboardType="decimal-pad"
          prefix="KSh"
        />
        <View style={styles.quickAmounts}>
          <TouchableOpacity
            style={[styles.quickAmountButton, { borderColor: theme.colors.hint + '40' }]}
            onPress={() => setWithdrawAmount((availableBalance * 0.25).toFixed(2))}
            activeOpacity={0.7}
          >
            <Text style={[styles.quickAmountText, { color: theme.colors.textSecondary }]}>
              25%
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickAmountButton, { borderColor: theme.colors.hint + '40' }]}
            onPress={() => setWithdrawAmount((availableBalance * 0.5).toFixed(2))}
            activeOpacity={0.7}
          >
            <Text style={[styles.quickAmountText, { color: theme.colors.textSecondary }]}>
              50%
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickAmountButton, { borderColor: theme.colors.hint + '40' }]}
            onPress={() => setWithdrawAmount((availableBalance * 0.75).toFixed(2))}
            activeOpacity={0.7}
          >
            <Text style={[styles.quickAmountText, { color: theme.colors.textSecondary }]}>
              75%
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickAmountButton, { borderColor: theme.colors.hint + '40' }]}
            onPress={() => setWithdrawAmount(availableBalance.toFixed(2))}
            activeOpacity={0.7}
          >
            <Text style={[styles.quickAmountText, { color: theme.colors.textSecondary }]}>
              All
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Payment Method Selection */}
      <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Select Payment Method
        </Text>
        {paymentMethods.length === 0 ? (
          <View style={styles.noPaymentMethods}>
            <Ionicons name="card-outline" size={48} color={theme.colors.hint} />
            <Text style={[styles.noPaymentMethodsText, { color: theme.colors.textSecondary }]}>
              No payment methods added
            </Text>
            <Text style={[styles.noPaymentMethodsSubtext, { color: theme.colors.hint }]}>
              Add a payment method to withdraw funds
            </Text>
            <Button
              title="Add Payment Method"
              onPress={() => {
                navigation.navigate('FinancesTab', {
                  screen: 'AddPaymentMethod',
                });
              }}
              variant="primary"
              style={styles.addPaymentButton}
            />
          </View>
        ) : (
          <View style={styles.paymentMethodsList}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentMethodCard,
                  {
                    backgroundColor: selectedPaymentMethod === method.id ? theme.colors.primary + '10' : 'transparent',
                    borderColor: selectedPaymentMethod === method.id ? theme.colors.primary : '#E0E0E0',
                  },
                ]}
                onPress={() => setSelectedPaymentMethod(method.id)}
                activeOpacity={0.7}
              >
                <View style={styles.paymentMethodLeft}>
                  <Ionicons
                    name={method.type === 'mpesa' ? 'phone-portrait-outline' : 'card-outline'}
                    size={24}
                    color={selectedPaymentMethod === method.id ? theme.colors.primary : theme.colors.hint}
                  />
                  <View style={styles.paymentMethodInfo}>
                    <Text style={[styles.paymentMethodName, { color: theme.colors.textPrimary }]}>
                      {method.name}
                    </Text>
                    <Text style={[styles.paymentMethodDetails, { color: theme.colors.textSecondary }]}>
                      {method.details}
                    </Text>
                  </View>
                </View>
                {selectedPaymentMethod === method.id && (
                  <View style={[styles.radioButton, { borderColor: theme.colors.primary }]}>
                    <View style={[styles.radioButtonInner, { backgroundColor: theme.colors.primary }]} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Withdraw Button */}
      {withdrawAmount && selectedPaymentMethod && (
        <Button
          title="Request Withdrawal"
          onPress={handleWithdraw}
          variant="primary"
          style={styles.withdrawButton}
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
              Withdrawal Requested!
            </Text>
            <Text style={[styles.successModalMessage, { color: theme.colors.textSecondary }]}>
              Your withdrawal request of {formatCurrency(withdrawAmount)} has been submitted. Funds will be processed within 1-3 business days.
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontFamily: 'Nunito_700Bold',
    letterSpacing: -1,
  },
  section: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  quickAmountButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  quickAmountText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  noPaymentMethods: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noPaymentMethodsText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    marginTop: 16,
    marginBottom: 8,
  },
  noPaymentMethodsSubtext: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 24,
    textAlign: 'center',
  },
  addPaymentButton: {
    marginTop: 8,
  },
  paymentMethodsList: {
    gap: 12,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 4,
  },
  paymentMethodDetails: {
    fontSize: 14,
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

export default OwnerWithdrawRequestScreen;

