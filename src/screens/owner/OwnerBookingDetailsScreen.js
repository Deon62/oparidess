import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Modal, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Button, Card } from '../../packages/components';

// Import default profile image
const defaultProfileImage = require('../../../assets/logo/profile.jpg');

const OwnerBookingDetailsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { booking } = route.params || {};

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Mock booking data if not provided
  const bookingData = booking || {
    id: 1,
    renterName: 'John Doe',
    renterAvatar: defaultProfileImage,
    renterRating: 4.8,
    renterPhone: '+254 712 345 678',
    renterEmail: 'john.doe@example.com',
    carName: 'Toyota Corolla',
    carImage: require('../../../assets/images/car1.jpg'),
    pickupDate: '2024-01-15',
    dropoffDate: '2024-01-18',
    pickupLocation: 'Nairobi, Kenya',
    dropoffLocation: 'Nairobi, Kenya',
    pickupAddress: 'Nairobi CBD, Moi Avenue, Kenya',
    dropoffAddress: 'Nairobi CBD, Moi Avenue, Kenya',
    totalPrice: 'KSh 13,500',
    dailyRate: 'KSh 4,500',
    days: 3,
    deposit: 'KSh 20,000',
    status: 'active',
    daysRemaining: 2,
    requestDate: '2024-01-10',
    paymentMethod: 'Credit Card',
    bookingNumber: 'BK-2024-001',
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Booking Details',
    });
    // Hide tab bar on this screen
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: 'none' },
    });
    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
    };
  }, [navigation]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#FF9800';
      case 'active':
        return '#4CAF50';
      case 'completed':
        return '#2196F3';
      case 'cancelled':
        return '#F44336';
      default:
        return theme.colors.hint;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'active':
        return 'Active';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const handleCallRenter = () => {
    if (bookingData.renterPhone) {
      Linking.openURL(`tel:${bookingData.renterPhone}`).catch((err) =>
        console.error('Failed to open phone:', err)
      );
    }
  };

  const handleMessageRenter = () => {
    navigation.navigate('MessagesTab', {
      screen: 'Chat',
      params: {
        userName: bookingData.renterName,
        userAvatar: bookingData.renterAvatar,
      },
    });
  };

  const handleCancelBooking = () => {
    setShowCancelModal(true);
  };

  const confirmCancelBooking = async () => {
    setProcessing(true);
    try {
      // TODO: Implement API call to cancel booking
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert(
        'Booking Cancelled',
        'The booking has been cancelled successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              setShowCancelModal(false);
              setProcessing(false);
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel booking. Please try again.');
      setProcessing(false);
    }
  };

  const InfoRow = ({ icon, label, value, onPress }) => (
    <TouchableOpacity
      style={styles.infoRow}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={styles.infoRowLeft}>
        <Ionicons name={icon} size={20} color={theme.colors.primary} />
        <View style={styles.infoTextContainer}>
          <Text style={[styles.infoLabel, { color: theme.colors.hint }]}>
            {label}
          </Text>
          <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
            {value || 'Not set'}
          </Text>
        </View>
      </View>
      {onPress && (
        <Ionicons name="chevron-forward" size={20} color={theme.colors.hint} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Banner */}
        <View style={[styles.statusBanner, { backgroundColor: getStatusColor(bookingData.status) + '20' }]}>
          <Ionicons 
            name={bookingData.status === 'active' ? 'car' : bookingData.status === 'pending' ? 'time' : bookingData.status === 'completed' ? 'checkmark-circle' : 'close-circle'} 
            size={24} 
            color={getStatusColor(bookingData.status)} 
          />
          <Text style={[styles.statusBannerText, { color: getStatusColor(bookingData.status) }]}>
            {getStatusLabel(bookingData.status)}
          </Text>
          {bookingData.status === 'active' && bookingData.daysRemaining && (
            <Text style={[styles.daysRemainingBanner, { color: getStatusColor(bookingData.status) }]}>
              • {bookingData.daysRemaining} day{bookingData.daysRemaining !== 1 ? 's' : ''} remaining
            </Text>
          )}
        </View>

        {/* Renter Information */}
        <Card style={[styles.sectionCard, { backgroundColor: theme.colors.white }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Renter Information
          </Text>
          <View style={styles.renterInfo}>
            <Image
              source={bookingData.renterAvatar || defaultProfileImage}
              style={[styles.renterAvatar, { borderColor: theme.colors.primary + '30' }]}
              resizeMode="cover"
            />
            <View style={styles.renterDetails}>
              <Text style={[styles.renterName, { color: theme.colors.textPrimary }]}>
                {bookingData.renterName}
              </Text>
              <View style={styles.renterRating}>
                <Ionicons name="star" size={16} color="#FFB800" />
                <Text style={[styles.ratingText, { color: theme.colors.textSecondary }]}>
                  {bookingData.renterRating || 'N/A'}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.renterActions}>
            <TouchableOpacity
              style={[styles.renterActionButton, { backgroundColor: theme.colors.primary + '20' }]}
              onPress={handleCallRenter}
              activeOpacity={0.7}
            >
              <Ionicons name="call" size={20} color={theme.colors.primary} />
              <Text style={[styles.renterActionText, { color: theme.colors.primary }]}>
                Call
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.renterActionButton, { backgroundColor: theme.colors.primary + '20' }]}
              onPress={handleMessageRenter}
              activeOpacity={0.7}
            >
              <Ionicons name="chatbubble" size={20} color={theme.colors.primary} />
              <Text style={[styles.renterActionText, { color: theme.colors.primary }]}>
                Message
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Car Information */}
        <Card style={[styles.sectionCard, { backgroundColor: theme.colors.white }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Car Information
          </Text>
          <View style={styles.carSection}>
            <Image
              source={bookingData.carImage}
              style={styles.carImage}
              resizeMode="cover"
            />
            <View style={styles.carInfo}>
              <Text style={[styles.carName, { color: theme.colors.textPrimary }]}>
                {bookingData.carName}
              </Text>
              <Text style={[styles.carPrice, { color: theme.colors.primary }]}>
                {bookingData.dailyRate || bookingData.totalPrice} per day
              </Text>
            </View>
          </View>
        </Card>

        {/* Booking Details */}
        <Card style={[styles.sectionCard, { backgroundColor: theme.colors.white }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Booking Details
          </Text>
          <InfoRow
            icon="calendar-outline"
            label="Pickup Date"
            value={formatDate(bookingData.pickupDate)}
          />
          <InfoRow
            icon="calendar-outline"
            label="Dropoff Date"
            value={formatDate(bookingData.dropoffDate)}
          />
          <InfoRow
            icon="time-outline"
            label="Rental Period"
            value={bookingData.days ? `${bookingData.days} day${bookingData.days !== 1 ? 's' : ''}` : 'N/A'}
          />
          <InfoRow
            icon="location-outline"
            label="Pickup Location"
            value={bookingData.pickupLocation}
          />
          {bookingData.pickupAddress && (
            <InfoRow
              icon="map-outline"
              label="Pickup Address"
              value={bookingData.pickupAddress}
            />
          )}
          <InfoRow
            icon="flag-outline"
            label="Dropoff Location"
            value={bookingData.dropoffLocation}
          />
          {bookingData.dropoffAddress && (
            <InfoRow
              icon="map-outline"
              label="Dropoff Address"
              value={bookingData.dropoffAddress}
            />
          )}
          <InfoRow
            icon="receipt-outline"
            label="Booking Number"
            value={bookingData.bookingNumber || `BK-${bookingData.id}`}
          />
          <InfoRow
            icon="time-outline"
            label="Request Date"
            value={formatDateTime(bookingData.requestDate)}
          />
        </Card>

        {/* Payment Information */}
        <Card style={[styles.sectionCard, { backgroundColor: theme.colors.white }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Payment Information
          </Text>
          <View style={styles.paymentGrid}>
            <View style={[styles.paymentCard, { backgroundColor: theme.colors.background }]}>
              <Text style={[styles.paymentLabel, { color: theme.colors.textSecondary }]}>
                Total Price
              </Text>
              <Text style={[styles.paymentValue, { color: theme.colors.textPrimary }]}>
                {bookingData.totalPrice}
              </Text>
            </View>
            {bookingData.dailyRate && (
              <View style={[styles.paymentCard, { backgroundColor: theme.colors.background }]}>
                <Text style={[styles.paymentLabel, { color: theme.colors.textSecondary }]}>
                  Daily Rate
                </Text>
                <Text style={[styles.paymentValue, { color: theme.colors.textPrimary }]}>
                  {bookingData.dailyRate}
                </Text>
              </View>
            )}
            {bookingData.deposit && (
              <View style={[styles.paymentCard, { backgroundColor: theme.colors.background }]}>
                <Text style={[styles.paymentLabel, { color: theme.colors.textSecondary }]}>
                  Deposit
                </Text>
                <Text style={[styles.paymentValue, { color: theme.colors.textPrimary }]}>
                  {bookingData.deposit}
                </Text>
              </View>
            )}
            {bookingData.paymentMethod && (
              <View style={[styles.paymentCard, { backgroundColor: theme.colors.background }]}>
                <Text style={[styles.paymentLabel, { color: theme.colors.textSecondary }]}>
                  Payment Method
                </Text>
                <Text style={[styles.paymentValue, { color: theme.colors.textPrimary }]}>
                  {bookingData.paymentMethod}
                </Text>
              </View>
            )}
          </View>
        </Card>

        {/* Bottom Spacing */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Action Buttons */}
      {bookingData.status === 'active' && (
        <View style={[styles.actionsContainer, { backgroundColor: theme.colors.white, borderTopColor: theme.colors.hint + '20' }]}>
          <Button
            title="Cancel Booking"
            onPress={handleCancelBooking}
            variant="secondary"
            style={[styles.actionButton, { borderColor: '#F44336', borderWidth: 1 }]}
            textStyle={{ color: '#F44336' }}
            disabled={processing}
          />
        </View>
      )}

      {/* Cancel Booking Confirmation Modal */}
      <Modal
        visible={showCancelModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.white }]}>
            <View style={[styles.modalIconContainer, { backgroundColor: '#F44336' + '20' }]}>
              <Ionicons name="alert-circle" size={64} color="#F44336" />
            </View>
            <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
              Cancel Booking
            </Text>
            <Text style={[styles.modalMessage, { color: theme.colors.textSecondary }]}>
              Are you sure you want to cancel this booking? This action cannot be undone and may affect your rating.
            </Text>
            <View style={styles.modalButtons}>
              <Button
                title="No, Keep Booking"
                onPress={() => setShowCancelModal(false)}
                variant="secondary"
                style={styles.modalButton}
                disabled={processing}
              />
              <Button
                title="Yes, Cancel"
                onPress={confirmCancelBooking}
                variant="primary"
                style={[styles.modalButton, { backgroundColor: '#F44336' }]}
                loading={processing}
                disabled={processing}
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
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
    flexWrap: 'wrap',
  },
  statusBannerText: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  daysRemainingBanner: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
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
  renterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  renterAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
  },
  renterDetails: {
    flex: 1,
  },
  renterName: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  renterRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  renterActions: {
    flexDirection: 'row',
    gap: 12,
  },
  renterActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  renterActionText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  carSection: {
    flexDirection: 'row',
    gap: 12,
  },
  carImage: {
    width: 120,
    height: 90,
    borderRadius: 12,
  },
  carInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  carName: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 8,
  },
  carPrice: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  infoRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
    paddingLeft: 4,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  paymentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  paymentCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  paymentLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 8,
    textAlign: 'center',
  },
  paymentValue: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    textAlign: 'center',
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
  },
  modalIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
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
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    marginBottom: 0,
  },
});

export default OwnerBookingDetailsScreen;

