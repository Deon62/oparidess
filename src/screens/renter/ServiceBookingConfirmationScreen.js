import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ServiceBookingConfirmationScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { bookingDetails, paymentMethod } = route.params || {};

  const service = bookingDetails?.service || {};
  const bookingId = bookingDetails?.bookingId || `SRV-${Date.now().toString().slice(-8)}`;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Booking Confirmed',
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

  const handleContactProvider = () => {
    // Navigate to chat with service provider
    navigation.navigate('Chat', {
      userId: service.providerId || 'provider-123',
      userName: service.name || 'Service Provider',
      userImage: service.image,
      bookingId: bookingId,
    });
  };

  const handleViewBookings = () => {
    navigation.navigate('BookingsTab', {
      screen: 'BookingsList',
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <View style={styles.successContainer}>
          <View style={[styles.successIcon, { backgroundColor: theme.colors.primary + '15' }]}>
            <Ionicons name="checkmark-circle" size={80} color={theme.colors.primary} />
          </View>
          <Text style={[styles.successTitle, { color: theme.colors.textPrimary }]}>
            Service Booked Successfully!
          </Text>
          <Text style={[styles.successSubtitle, { color: theme.colors.textSecondary }]}>
            Your booking has been confirmed
          </Text>
        </View>

        {/* Booking Details Card */}
        <View style={[styles.detailsCard, { backgroundColor: theme.colors.white }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
            Booking Details
          </Text>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Booking ID:
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
              {bookingId}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Service:
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
              {service.name || 'Service'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Category:
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
              {bookingDetails?.category || service.category || ''}
            </Text>
          </View>

          {bookingDetails?.serviceDate && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Date:
              </Text>
              <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                {bookingDetails.serviceDate}
              </Text>
            </View>
          )}

          {bookingDetails?.serviceTime && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Time:
              </Text>
              <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                {bookingDetails.serviceTime}
              </Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Amount Paid:
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.primary }]}>
              {service.price || 'KSh 0'}
            </Text>
          </View>

          {paymentMethod && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Payment Method:
              </Text>
              <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                {paymentMethod === 'mpesa' ? 'M-PESA' : paymentMethod === 'airtel' ? 'Airtel Money' : 'Card'}
              </Text>
            </View>
          )}
        </View>

        {/* Service Provider Info */}
        <View style={[styles.providerCard, { backgroundColor: theme.colors.white }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
            Service Provider
          </Text>
          <View style={styles.providerInfo}>
            {service.image && (
              <Image
                source={{ uri: service.image }}
                style={styles.providerImage}
                resizeMode="cover"
              />
            )}
            <View style={styles.providerDetails}>
              <Text style={[styles.providerName, { color: theme.colors.textPrimary }]}>
                {service.name || 'Service Provider'}
              </Text>
              {service.location && (
                <View style={styles.providerLocation}>
                  <Ionicons name="location" size={16} color={theme.colors.textSecondary} />
                  <Text style={[styles.providerLocationText, { color: theme.colors.textSecondary }]}>
                    {service.location}
                  </Text>
                </View>
              )}
              {service.rating && (
                <View style={styles.providerRating}>
                  <Ionicons name="star" size={16} color="#FFB800" />
                  <Text style={[styles.providerRatingText, { color: theme.colors.textSecondary }]}>
                    {service.rating}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Next Steps */}
        <View style={[styles.nextStepsCard, { backgroundColor: theme.colors.white }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
            What's Next?
          </Text>
          <View style={styles.stepsList}>
            <View style={styles.stepItem}>
              <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={[styles.stepText, { color: theme.colors.textSecondary }]}>
                You will receive a confirmation message
              </Text>
            </View>
            <View style={styles.stepItem}>
              <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={[styles.stepText, { color: theme.colors.textSecondary }]}>
                Contact the service provider to confirm details
              </Text>
            </View>
            <View style={styles.stepItem}>
              <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={[styles.stepText, { color: theme.colors.textSecondary }]}>
                Service will be provided on the scheduled date
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={[styles.footer, { backgroundColor: theme.colors.white, paddingBottom: insets.bottom }]}>
        <TouchableOpacity
          style={[styles.contactButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleContactProvider}
          activeOpacity={0.8}
        >
          <Ionicons name="chatbubble-ellipses" size={20} color={theme.colors.white} />
          <Text style={[styles.contactButtonText, { color: theme.colors.white }]}>
            Contact Provider
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewBookingsButton, { borderColor: theme.colors.primary }]}
          onPress={handleViewBookings}
          activeOpacity={0.7}
        >
          <Text style={[styles.viewBookingsButtonText, { color: theme.colors.primary }]}>
            View My Bookings
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    gap: 16,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
  },
  detailsCard: {
    padding: 20,
    borderRadius: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
  },
  detailValue: {
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold',
    flex: 1,
    textAlign: 'right',
  },
  providerCard: {
    padding: 20,
    borderRadius: 16,
  },
  providerInfo: {
    flexDirection: 'row',
    gap: 16,
  },
  providerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  providerDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  providerName: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 8,
  },
  providerLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  providerLocationText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  providerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  providerRatingText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  nextStepsCard: {
    padding: 20,
    borderRadius: 16,
  },
  stepsList: {
    gap: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 12,
  },
  contactButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  contactButtonText: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  viewBookingsButton: {
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  viewBookingsButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
});

export default ServiceBookingConfirmationScreen;

