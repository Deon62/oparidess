import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Button, Card } from '../../packages/components';

// Import default profile image
const defaultProfileImage = require('../../../assets/logo/profile.jpg');

const DriverBookingDetailsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { ride } = route.params || {};

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showAcceptSuccessModal, setShowAcceptSuccessModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);

  // Mock ride data if not provided
  const bookingData = ride || {
    id: 1,
    clientName: 'John Doe',
    clientAvatar: defaultProfileImage,
    clientPhone: '+254 712 345 678',
    clientRating: 4.8,
    pickupLocation: 'Nairobi CBD',
    dropoffLocation: 'Jomo Kenyatta Airport',
    pickupAddress: 'Nairobi CBD, Moi Avenue, Kenya',
    dropoffAddress: 'Jomo Kenyatta International Airport, Embakasi, Kenya',
    distance: '18 km',
    duration: '45 min',
    price: 25,
    grossPrice: 25,
    commission: 3.75,
    netPrice: 21.25,
    date: '2024-01-15',
    time: '2:30 PM',
    status: 'pending',
    rating: null,
    specialInstructions: 'Please arrive 10 minutes early',
    estimatedFare: 25,
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Booking Details',
    });
  }, [navigation]);

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '$0.00';
    const numAmount = typeof amount === 'string' ? parseFloat(amount.replace('$', '')) : amount;
    return `$${Math.abs(numAmount).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'completed':
        return theme.colors.primary;
      case 'cancelled':
        return '#FF3B30';
      case 'pending':
        return '#FFA500';
      default:
        return theme.colors.hint;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return 'radio-button-on';
      case 'completed':
        return 'checkmark-circle';
      case 'cancelled':
        return 'close-circle';
      case 'pending':
        return 'time-outline';
      default:
        return 'help-circle';
    }
  };

  const handleAccept = async () => {
    setProcessing(true);
    try {
      // TODO: Implement API call to accept booking
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setShowAcceptSuccessModal(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to accept booking. Please try again.');
      setProcessing(false);
    }
  };

  const handleAcceptSuccessClose = () => {
    setShowAcceptSuccessModal(false);
    setProcessing(false);
    navigation.goBack();
  };

  const handleReject = () => {
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!rejectReason.trim()) {
      Alert.alert('Error', 'Please provide a reason for rejecting this booking.');
      return;
    }

    setProcessing(true);
    try {
      // TODO: Implement API call to reject booking
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert(
        'Booking Rejected',
        'You have rejected this booking. The client will be notified.',
        [
          {
            text: 'OK',
            onPress: () => {
              setShowRejectModal(false);
              setRejectReason('');
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to reject booking. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    setProcessing(true);
    try {
      // TODO: Implement API call to cancel booking
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert(
        'Booking Cancelled',
        'You have cancelled this booking. The client will be notified and refunded.',
        [
          {
            text: 'OK',
            onPress: () => {
              setShowCancelModal(false);
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel booking. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleComplete = async () => {
    Alert.alert(
      'Complete Booking',
      'Are you sure you want to mark this booking as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            setProcessing(true);
            try {
              // TODO: Implement API call to complete booking
              await new Promise((resolve) => setTimeout(resolve, 1500));
              Alert.alert(
                'Booking Completed',
                'The booking has been marked as completed. Payment will be processed shortly.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      navigation.goBack();
                    },
                  },
                ]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to complete booking. Please try again.');
            } finally {
              setProcessing(false);
            }
          },
        },
      ]
    );
  };

  const handleCallClient = () => {
    if (bookingData.clientPhone) {
      Alert.alert(
        'Call Client',
        `Call ${bookingData.clientName}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Call',
            onPress: () => {
              // TODO: Implement phone call
              console.log('Calling:', bookingData.clientPhone);
            },
          },
        ]
      );
    }
  };

  const handleMessageClient = () => {
    navigation.navigate('MessagesTab', {
      screen: 'Chat',
      params: {
        userName: bookingData.clientName,
        userAvatar: bookingData.clientAvatar,
      },
    });
  };

  const handleStartRide = () => {
    navigation.navigate('ActiveRide', { ride: bookingData });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Badge */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(bookingData.status) + '20' }]}>
            <Ionicons name={getStatusIcon(bookingData.status)} size={20} color={getStatusColor(bookingData.status)} />
            <Text style={[styles.statusText, { color: getStatusColor(bookingData.status) }]}>
              {bookingData.status?.charAt(0).toUpperCase() + bookingData.status?.slice(1)}
            </Text>
          </View>
        </View>

        {/* Client Information */}
        <Card style={[styles.sectionCard, { backgroundColor: theme.colors.white }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Client Information
          </Text>
          <View style={styles.clientInfo}>
            <Image
              source={bookingData.clientAvatar || defaultProfileImage}
              style={[styles.clientAvatar, { borderColor: theme.colors.primary + '30' }]}
              resizeMode="cover"
            />
            <View style={styles.clientDetails}>
              <Text style={[styles.clientName, { color: theme.colors.textPrimary }]}>
                {bookingData.clientName}
              </Text>
              <View style={styles.clientRating}>
                <Ionicons name="star" size={16} color="#FFA500" />
                <Text style={[styles.ratingText, { color: theme.colors.textSecondary }]}>
                  {bookingData.clientRating || 'N/A'}
                </Text>
              </View>
              {bookingData.clientPhone && (
                <Text style={[styles.clientPhone, { color: theme.colors.textSecondary }]}>
                  {bookingData.clientPhone}
                </Text>
              )}
            </View>
          </View>
          {(bookingData.status === 'pending' || bookingData.status === 'active') && (
            <View style={styles.clientActions}>
              <TouchableOpacity
                style={[styles.clientActionButton, { backgroundColor: theme.colors.primary + '20' }]}
                onPress={handleCallClient}
                activeOpacity={0.7}
              >
                <Ionicons name="call-outline" size={18} color={theme.colors.primary} />
                <Text style={[styles.clientActionText, { color: theme.colors.primary }]}>
                  Call
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.clientActionButton, { backgroundColor: theme.colors.primary + '20' }]}
                onPress={handleMessageClient}
                activeOpacity={0.7}
              >
                <Ionicons name="chatbubble-outline" size={18} color={theme.colors.primary} />
                <Text style={[styles.clientActionText, { color: theme.colors.primary }]}>
                  Message
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Card>

        {/* Route Information */}
        <Card style={[styles.sectionCard, { backgroundColor: theme.colors.white }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Route Information
          </Text>
          <View style={styles.routeContainer}>
            <View style={styles.routeItem}>
              <View style={[styles.routeDot, { backgroundColor: '#4CAF50' }]} />
              <View style={styles.routeContent}>
                <Text style={[styles.routeLabel, { color: theme.colors.textSecondary }]}>
                  Pickup Location
                </Text>
                <Text style={[styles.routeText, { color: theme.colors.textPrimary }]}>
                  {bookingData.pickupLocation}
                </Text>
                {bookingData.pickupAddress && (
                  <Text style={[styles.routeAddress, { color: theme.colors.hint }]}>
                    {bookingData.pickupAddress}
                  </Text>
                )}
                <Text style={[styles.routeTime, { color: theme.colors.textSecondary }]}>
                  {formatDate(bookingData.date)} at {bookingData.time}
                </Text>
              </View>
            </View>
            <View style={[styles.routeLine, { backgroundColor: theme.colors.hint + '30' }]} />
            <View style={styles.routeItem}>
              <View style={[styles.routeDot, { backgroundColor: '#F44336' }]} />
              <View style={styles.routeContent}>
                <Text style={[styles.routeLabel, { color: theme.colors.textSecondary }]}>
                  Dropoff Location
                </Text>
                <Text style={[styles.routeText, { color: theme.colors.textPrimary }]}>
                  {bookingData.dropoffLocation}
                </Text>
                {bookingData.dropoffAddress && (
                  <Text style={[styles.routeAddress, { color: theme.colors.hint }]}>
                    {bookingData.dropoffAddress}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </Card>

        {/* Trip Details */}
        <Card style={[styles.sectionCard, { backgroundColor: theme.colors.white }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Trip Details
          </Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Ionicons name="navigate-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Distance
              </Text>
              <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                {bookingData.distance}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Duration
              </Text>
              <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                {bookingData.duration}
              </Text>
            </View>
          </View>
          {bookingData.specialInstructions && (
            <View style={[styles.instructionsContainer, { backgroundColor: theme.colors.background }]}>
              <Ionicons name="information-circle-outline" size={18} color={theme.colors.primary} />
              <Text style={[styles.instructionsText, { color: theme.colors.textSecondary }]}>
                {bookingData.specialInstructions}
              </Text>
            </View>
          )}
        </Card>

        {/* Pricing Breakdown */}
        <Card style={[styles.sectionCard, { backgroundColor: theme.colors.white }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Earnings Breakdown
          </Text>
          <View style={styles.pricingContainer}>
            <View style={styles.pricingRow}>
              <Text style={[styles.pricingLabel, { color: theme.colors.textSecondary }]}>
                Gross Earnings
              </Text>
              <Text style={[styles.pricingValue, { color: theme.colors.textPrimary }]}>
                {formatCurrency(bookingData.grossPrice || bookingData.price || 0)}
              </Text>
            </View>
            <View style={styles.pricingRow}>
              <Text style={[styles.pricingLabel, { color: theme.colors.textSecondary }]}>
                Commission (15%)
              </Text>
              <Text style={[styles.pricingValue, { color: '#FF3B30' }]}>
                -{formatCurrency(bookingData.commission || ((typeof bookingData.price === 'string' ? parseFloat(bookingData.price.replace('$', '')) : bookingData.price || 0) * 0.15))}
              </Text>
            </View>
            <View style={[styles.pricingDivider, { backgroundColor: theme.colors.hint + '30' }]} />
            <View style={styles.pricingRow}>
              <Text style={[styles.pricingLabel, { color: theme.colors.textPrimary, fontFamily: 'Nunito_700Bold' }]}>
                Net Earnings
              </Text>
              <Text style={[styles.pricingValue, { color: '#4CAF50', fontFamily: 'Nunito_700Bold' }]}>
                {formatCurrency(bookingData.netPrice || ((typeof bookingData.price === 'string' ? parseFloat(bookingData.price.replace('$', '')) : bookingData.price || 0) * 0.85))}
              </Text>
            </View>
          </View>
        </Card>

        {/* Bottom Spacing */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Action Buttons */}
      {bookingData.status === 'pending' && (
        <View style={[styles.actionsContainer, { backgroundColor: theme.colors.white, borderTopColor: theme.colors.hint + '20' }]}>
          <Button
            title="Reject"
            onPress={handleReject}
            variant="secondary"
            style={[styles.actionButton, { borderColor: '#FF3B30', borderWidth: 1 }]}
            textStyle={{ color: '#FF3B30' }}
            disabled={processing}
          />
          <Button
            title="Accept Booking"
            onPress={handleAccept}
            variant="primary"
            style={styles.actionButton}
            loading={processing}
            disabled={processing}
          />
        </View>
      )}

      {bookingData.status === 'active' && (
        <View style={[styles.actionsContainer, { backgroundColor: theme.colors.white, borderTopColor: theme.colors.hint + '20' }]}>
          <Button
            title="Cancel"
            onPress={handleCancel}
            variant="secondary"
            style={[styles.actionButton, { borderColor: '#FF3B30', borderWidth: 1 }]}
            textStyle={{ color: '#FF3B30' }}
            disabled={processing}
          />
          <Button
            title="Start Ride"
            onPress={handleStartRide}
            variant="primary"
            style={styles.actionButton}
            disabled={processing}
          />
          <Button
            title="Complete"
            onPress={handleComplete}
            variant="primary"
            style={styles.actionButton}
            loading={processing}
            disabled={processing}
          />
        </View>
      )}

      {bookingData.status === 'completed' && (
        <View style={[styles.actionsContainer, { backgroundColor: theme.colors.white, borderTopColor: theme.colors.hint + '20' }]}>
          <Button
            title="View Receipt"
            onPress={() => {
              // TODO: Navigate to receipt screen
              Alert.alert('Receipt', 'Receipt feature coming soon');
            }}
            variant="secondary"
            style={styles.actionButton}
          />
        </View>
      )}

      {/* Reject Modal */}
      <Modal
        visible={showRejectModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRejectModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.white }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
              Reject Booking
            </Text>
            <Text style={[styles.modalMessage, { color: theme.colors.textSecondary }]}>
              Please provide a reason for rejecting this booking:
            </Text>
            <View style={[styles.reasonInputContainer, { borderColor: theme.colors.hint + '40' }]}>
              <Text
                style={[styles.reasonInput, { color: theme.colors.textPrimary }]}
                onPress={() => {
                  // TODO: Open text input
                  Alert.alert('Reason', 'Text input will be implemented');
                }}
              >
                {rejectReason || 'Enter reason...'}
              </Text>
            </View>
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                variant="secondary"
                style={styles.modalButton}
              />
              <Button
                title="Reject"
                onPress={confirmReject}
                variant="primary"
                style={[styles.modalButton, { backgroundColor: '#FF3B30' }]}
                loading={processing}
                disabled={processing || !rejectReason.trim()}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Cancel Modal */}
      <Modal
        visible={showCancelModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.white }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
              Cancel Booking
            </Text>
            <Text style={[styles.modalMessage, { color: theme.colors.textSecondary }]}>
              Are you sure you want to cancel this booking? The client will be notified and refunded.
            </Text>
            <View style={styles.modalButtons}>
              <Button
                title="No, Keep It"
                onPress={() => setShowCancelModal(false)}
                variant="secondary"
                style={styles.modalButton}
              />
              <Button
                title="Yes, Cancel"
                onPress={confirmCancel}
                variant="primary"
                style={[styles.modalButton, { backgroundColor: '#FF3B30' }]}
                loading={processing}
                disabled={processing}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Accept Success Modal */}
      <Modal
        visible={showAcceptSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={handleAcceptSuccessClose}
      >
        <View style={styles.successModalOverlay}>
          <View style={[styles.successModalContent, { backgroundColor: theme.colors.white }]}>
            {/* Success Icon */}
            <View style={[styles.successIconContainer, { backgroundColor: '#4CAF50' + '20' }]}>
              <View style={[styles.successIconCircle, { backgroundColor: '#4CAF50' }]}>
                <Ionicons name="checkmark" size={64} color={theme.colors.white} />
              </View>
            </View>

            {/* Success Title */}
            <Text style={[styles.successModalTitle, { color: theme.colors.textPrimary }]}>
              Booking Accepted!
            </Text>

            {/* Success Message */}
            <Text style={[styles.successModalMessage, { color: theme.colors.textSecondary }]}>
              You have successfully accepted this booking. The client has been notified.
            </Text>

            {/* Booking Summary */}
            <View style={[styles.successSummaryCard, { backgroundColor: theme.colors.background }]}>
              <View style={styles.successSummaryRow}>
                <View style={styles.successSummaryLeft}>
                  <Ionicons name="person-outline" size={20} color={theme.colors.primary} />
                  <Text style={[styles.successSummaryLabel, { color: theme.colors.textSecondary }]}>
                    Client
                  </Text>
                </View>
                <Text style={[styles.successSummaryValue, { color: theme.colors.textPrimary }]}>
                  {bookingData.clientName}
                </Text>
              </View>
              <View style={styles.successSummaryRow}>
                <View style={styles.successSummaryLeft}>
                  <Ionicons name="navigate-outline" size={20} color={theme.colors.primary} />
                  <Text style={[styles.successSummaryLabel, { color: theme.colors.textSecondary }]}>
                    Route
                  </Text>
                </View>
                <Text style={[styles.successSummaryValue, { color: theme.colors.textPrimary }]} numberOfLines={1}>
                  {bookingData.pickupLocation} → {bookingData.dropoffLocation}
                </Text>
              </View>
              <View style={styles.successSummaryRow}>
                <View style={styles.successSummaryLeft}>
                  <Ionicons name="cash-outline" size={20} color={theme.colors.primary} />
                  <Text style={[styles.successSummaryLabel, { color: theme.colors.textSecondary }]}>
                    Net Earnings
                  </Text>
                </View>
                <Text style={[styles.successSummaryValue, { color: '#4CAF50', fontFamily: 'Nunito_700Bold' }]}>
                  {formatCurrency(bookingData.netPrice || ((typeof bookingData.price === 'string' ? parseFloat(bookingData.price.replace('$', '')) : bookingData.price || 0) * 0.85))}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.successModalButtons}>
              <Button
                title="View Active Ride"
                onPress={() => {
                  setShowAcceptSuccessModal(false);
                  setProcessing(false);
                  navigation.navigate('ActiveRide', { ride: bookingData });
                }}
                variant="primary"
                style={styles.successModalButton}
              />
              <Button
                title="Back to Home"
                onPress={handleAcceptSuccessClose}
                variant="secondary"
                style={styles.successModalButton}
              />
            </View>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 20,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  sectionCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  clientAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
  },
  clientDetails: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  clientRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  clientPhone: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  clientActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  clientActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 6,
  },
  clientActionText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  routeContainer: {
    paddingLeft: 20,
  },
  routeItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    left: 0,
    top: 4,
  },
  routeContent: {
    marginLeft: 24,
    flex: 1,
  },
  routeLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 4,
  },
  routeText: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  routeAddress: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 4,
  },
  routeTime: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  routeLine: {
    width: 2,
    height: 20,
    marginLeft: 5,
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    marginTop: 8,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  instructionsContainer: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  instructionsText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  pricingContainer: {
    gap: 12,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pricingLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  pricingValue: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  pricingDivider: {
    height: 1,
    marginVertical: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  actionButton: {
    flex: 1,
    marginBottom: 0,
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
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
    marginBottom: 16,
  },
  reasonInputContainer: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    marginBottom: 24,
  },
  reasonInput: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    marginBottom: 0,
  },
  // Success Modal Styles
  successModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successModalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  successModalTitle: {
    fontSize: 28,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  successModalMessage: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  successSummaryCard: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    gap: 12,
  },
  successSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  successSummaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  successSummaryLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  successSummaryValue: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    flex: 1,
    textAlign: 'right',
  },
  successModalButtons: {
    width: '100%',
    gap: 12,
  },
  successModalButton: {
    marginBottom: 0,
  },
});

export default DriverBookingDetailsScreen;

