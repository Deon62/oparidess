import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Button, Card, Input } from '../../packages/components';
import { formatCurrency } from '../../packages/utils/currency';

const CancellationScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { bookingDetails } = route.params || {};

  const [cancellationReason, setCancellationReason] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Cancel Booking',
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

  // Calculate time until pickup
  const calculateTimeUntilPickup = () => {
    if (!bookingDetails?.pickupDate) return null;
    
    const pickupDate = typeof bookingDetails.pickupDate === 'string' 
      ? new Date(bookingDetails.pickupDate) 
      : bookingDetails.pickupDate;
    const now = new Date();
    const diffTime = pickupDate.getTime() - now.getTime();
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    return { hours: diffHours, days: diffDays, totalHours: diffHours };
  };

  const timeUntilPickup = calculateTimeUntilPickup();

  // Determine refund eligibility
  const getRefundInfo = () => {
    if (!timeUntilPickup) {
      return { eligible: false, percentage: 0, message: 'Unable to calculate refund' };
    }

    const hours = timeUntilPickup.totalHours;

    if (hours > 48) {
      return {
        eligible: true,
        percentage: 100,
        message: 'Full refund (100%)',
        color: '#4CAF50',
      };
    } else if (hours > 24) {
      return {
        eligible: true,
        percentage: 50,
        message: 'Partial refund (50% of booking fee)',
        color: '#FF9800',
      };
    } else {
      return {
        eligible: false,
        percentage: 0,
        message: 'No refund (less than 24 hours)',
        color: '#F44336',
      };
    }
  };

  const refundInfo = getRefundInfo();

  // Calculate refund amount
  const calculateRefund = () => {
    if (!refundInfo.eligible) return 0;
    
    const bookingFee = bookingDetails?.bookingFee || 0;
    const totalPrice = bookingDetails?.totalRentalPrice || 0;
    
    if (refundInfo.percentage === 100) {
      return bookingFee; // Full refund of booking fee
    } else if (refundInfo.percentage === 50) {
      return bookingFee * 0.5; // 50% of booking fee
    }
    return 0;
  };

  const refundAmount = calculateRefund();

  const cancellationReasons = [
    'Change of plans',
    'Found a better option',
    'Emergency situation',
    'Car owner cancelled',
    'Payment issue',
    'Other',
  ];

  const handleCancel = () => {
    if (!cancellationReason.trim()) {
      Alert.alert('Required', 'Please provide a reason for cancellation');
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmCancellation = async () => {
    setProcessing(true);
    try {
      // TODO: Implement API call to cancel booking
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      setShowConfirmModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel booking. Please try again.');
      setProcessing(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigation.goBack();
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Booking Info */}
        <View style={styles.section}>
          <Card style={[styles.bookingCard, { backgroundColor: theme.colors.white }]}>
            <View style={styles.bookingHeader}>
              <Ionicons name="calendar-outline" size={24} color={theme.colors.primary} />
              <View style={styles.bookingHeaderContent}>
                <Text style={[styles.bookingTitle, { color: theme.colors.textPrimary }]}>
                  Booking Details
                </Text>
                <Text style={[styles.bookingSubtitle, { color: theme.colors.textSecondary }]}>
                  {bookingDetails?.car?.name || 'Car Rental'}
                </Text>
              </View>
            </View>
            <View style={styles.bookingInfo}>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                  Pickup Date
                </Text>
                <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
                  {formatDate(bookingDetails?.pickupDate)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                  Pickup Time
                </Text>
                <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
                  {bookingDetails?.pickupTime || '10:00'}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Time Until Pickup */}
        {timeUntilPickup && (
          <View style={styles.section}>
            <Card style={[styles.timeCard, { backgroundColor: theme.colors.white }]}>
              <View style={styles.timeHeader}>
                <Ionicons name="time-outline" size={24} color={theme.colors.primary} />
                <View style={styles.timeContent}>
                  <Text style={[styles.timeLabel, { color: theme.colors.textSecondary }]}>
                    Time until pickup
                  </Text>
                  <Text style={[styles.timeValue, { color: theme.colors.textPrimary }]}>
                    {timeUntilPickup.days > 0 
                      ? `${timeUntilPickup.days} day${timeUntilPickup.days > 1 ? 's' : ''} and ${timeUntilPickup.hours % 24} hour${(timeUntilPickup.hours % 24) !== 1 ? 's' : ''}`
                      : `${timeUntilPickup.hours} hour${timeUntilPickup.hours !== 1 ? 's' : ''}`
                    }
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        )}

        {/* Refund Information */}
        <View style={styles.section}>
          <Card style={[styles.refundCard, { backgroundColor: theme.colors.white }]}>
            <View style={styles.refundHeader}>
              <Ionicons name="cash-outline" size={24} color={refundInfo.color} />
              <View style={styles.refundHeaderContent}>
                <Text style={[styles.refundTitle, { color: theme.colors.textPrimary }]}>
                  Refund Eligibility
                </Text>
                <Text style={[styles.refundMessage, { color: refundInfo.color }]}>
                  {refundInfo.message}
                </Text>
              </View>
            </View>
            {refundInfo.eligible && (
              <View style={styles.refundAmountContainer}>
                <Text style={[styles.refundAmountLabel, { color: theme.colors.textSecondary }]}>
                  Estimated Refund
                </Text>
                <Text style={[styles.refundAmountValue, { color: refundInfo.color }]}>
                  {formatCurrency(refundAmount)}
                </Text>
                <Text style={[styles.refundNote, { color: theme.colors.textSecondary }]}>
                  Refund will be processed within 5-7 business days
                </Text>
              </View>
            )}
            {!refundInfo.eligible && (
              <View style={styles.noRefundContainer}>
                <Text style={[styles.noRefundText, { color: theme.colors.textSecondary }]}>
                  Cancellations within 24 hours of pickup are not eligible for refunds. You may contact support for special circumstances or file a dispute.
                </Text>
                <TouchableOpacity
                  style={[styles.disputeButton, { borderColor: theme.colors.primary }]}
                  onPress={() => navigation.navigate('Dispute', { bookingDetails })}
                  activeOpacity={0.7}
                >
                  <Ionicons name="alert-circle-outline" size={20} color={theme.colors.primary} />
                  <Text style={[styles.disputeButtonText, { color: theme.colors.primary }]}>
                    File a Dispute
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Card>
        </View>

        {/* Cancellation Reason */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Reason for Cancellation
          </Text>
          <View style={styles.reasonsContainer}>
            {cancellationReasons.map((reason, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.reasonButton,
                  {
                    backgroundColor: cancellationReason === reason 
                      ? theme.colors.primary + '20' 
                      : theme.colors.white,
                    borderColor: cancellationReason === reason 
                      ? theme.colors.primary 
                      : '#E0E0E0',
                  },
                ]}
                onPress={() => setCancellationReason(reason)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.reasonButtonText,
                    {
                      color: cancellationReason === reason 
                        ? theme.colors.primary 
                        : theme.colors.textPrimary,
                      fontFamily: cancellationReason === reason 
                        ? 'Nunito_600SemiBold' 
                        : 'Nunito_400Regular',
                    },
                  ]}
                >
                  {reason}
                </Text>
                {cancellationReason === reason && (
                  <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
          {cancellationReason === 'Other' && (
            <Input
              label="Please specify"
              placeholder="Enter your reason..."
              value={cancellationReason}
              onChangeText={setCancellationReason}
              style={styles.otherReasonInput}
              multiline
              numberOfLines={3}
            />
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.colors.white }]}>
        <Button
          title="Cancel Booking"
          onPress={handleCancel}
          variant="primary"
          style={[styles.cancelButton, { backgroundColor: '#F44336' }]}
          disabled={!cancellationReason.trim() || processing}
        />
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => !processing && setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.white }]}>
            <View style={[styles.modalIconContainer, { backgroundColor: '#F44336' + '20' }]}>
              <Ionicons name="alert-circle" size={64} color="#F44336" />
            </View>
            <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
              Confirm Cancellation
            </Text>
            <Text style={[styles.modalMessage, { color: theme.colors.textSecondary }]}>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </Text>
            {refundInfo.eligible && (
              <View style={[styles.modalRefundInfo, { backgroundColor: refundInfo.color + '10' }]}>
                <Text style={[styles.modalRefundText, { color: refundInfo.color }]}>
                  You will receive a refund of {formatCurrency(refundAmount)}
                </Text>
              </View>
            )}
            <View style={styles.modalButtons}>
              <Button
                title="Keep Booking"
                onPress={() => setShowConfirmModal(false)}
                variant="secondary"
                style={styles.modalButton}
                disabled={processing}
              />
              <Button
                title="Yes, Cancel"
                onPress={confirmCancellation}
                variant="primary"
                style={[styles.modalButton, { backgroundColor: '#F44336' }]}
                loading={processing}
                disabled={processing}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={handleSuccessClose}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.white }]}>
            <View style={[styles.modalIconContainer, { backgroundColor: '#4CAF50' + '20' }]}>
              <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
            </View>
            <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
              Booking Cancelled
            </Text>
            <Text style={[styles.modalMessage, { color: theme.colors.textSecondary }]}>
              Your booking has been cancelled successfully.
            </Text>
            {refundInfo.eligible && (
              <View style={[styles.modalRefundInfo, { backgroundColor: '#4CAF50' + '10' }]}>
                <Text style={[styles.modalRefundText, { color: '#4CAF50' }]}>
                  Refund of {formatCurrency(refundAmount)} will be processed within 5-7 business days
                </Text>
              </View>
            )}
            <Button
              title="Done"
              onPress={handleSuccessClose}
              variant="primary"
              style={styles.modalButton}
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 16,
  },
  bookingCard: {
    padding: 20,
    borderRadius: 16,
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  bookingHeaderContent: {
    flex: 1,
  },
  bookingTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  bookingSubtitle: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  bookingInfo: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  timeCard: {
    padding: 20,
    borderRadius: 16,
  },
  timeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeContent: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  refundCard: {
    padding: 20,
    borderRadius: 16,
  },
  refundHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  refundHeaderContent: {
    flex: 1,
  },
  refundTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  refundMessage: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  refundAmountContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    alignItems: 'center',
  },
  refundAmountLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 8,
  },
  refundAmountValue: {
    fontSize: 32,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 8,
  },
  refundNote: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
  },
  noRefundContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 16,
  },
  noRefundText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  disputeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  disputeButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  reasonsContainer: {
    gap: 12,
  },
  reasonButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  reasonButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
  },
  otherReasonInput: {
    marginTop: 16,
  },
  bottomBar: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  cancelButton: {
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  modalIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  modalRefundInfo: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
  },
  modalRefundText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
  },
});

export default CancellationScreen;


