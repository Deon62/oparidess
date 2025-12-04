import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Button } from '../../packages/components';
import { formatCurrency } from '../../packages/utils/currency';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Car images now loaded from Supabase
import { getCarImages } from '../../packages/utils/supabaseImages';

const PendingRentalDetailsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { booking } = route.params || {};

  // Car images for repository (up to 4) - use Supabase images
  const defaultImages = getCarImages(booking?.imageKey || 'x');
  const carImages = booking?.images || defaultImages;

  // Hide bottom tab bar and header on this screen
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: 'none' },
    });
    return () => {
      navigation.setOptions({
        headerShown: true,
      });
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
    };
  }, [navigation]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleCompletePayment = () => {
    const paymentAmount = booking?.payOnSite 
      ? parseFloat((booking.price || booking.totalPrice || '0').replace(/[^\d.]/g, ''))
      : parseFloat((booking.bookingFee || booking.deposit || '0').replace(/[^\d.]/g, ''));

    navigation.navigate('Payment', {
      totalPrice: paymentAmount,
      bookingDetails: {
        ...booking,
        bookingId: booking.bookingId || booking.id,
      },
    });
  };

  const handleCancelBooking = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement cancel booking logic
            Alert.alert('Success', 'Booking cancelled successfully', [
              {
                text: 'OK',
                onPress: () => navigation.goBack(),
              },
            ]);
          },
        },
      ]
    );
  };

  if (!booking) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.errorContainer, { backgroundColor: theme.colors.white }]}>
          <Text style={[styles.errorText, { color: theme.colors.textSecondary }]}>
            Booking details not found
          </Text>
        </View>
      </View>
    );
  }

  const paymentAmount = booking?.payOnSite 
    ? parseFloat((booking.price || booking.totalPrice || '0').replace(/[^\d.]/g, ''))
    : parseFloat((booking.bookingFee || booking.deposit || '0').replace(/[^\d.]/g, ''));

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.white, paddingTop: insets.top }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            // Navigate back within the same stack
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              // Fallback: navigate to BookingsList screen
              navigation.navigate('BookingsList');
            }
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
          Pending Rental
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Booking Status */}
        <View style={styles.section}>
          <View style={styles.statusContainer}>
            <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.statusText, { color: theme.colors.textPrimary }]}>
              Payment Pending
            </Text>
          </View>
          <Text style={[styles.statusSubtext, { color: theme.colors.textSecondary }]}>
            {booking?.payOnSite 
              ? 'Complete payment to confirm your rental'
              : 'Complete payment to secure your booking'}
          </Text>
        </View>

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Image Repository Link */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Image Repository
          </Text>
          <TouchableOpacity
            style={styles.imageRepositoryCard}
            onPress={() => {
              navigation.navigate('ImageRepository', {
                images: carImages,
                title: `${booking.carName || 'Car'} - Images`,
              });
            }}
            activeOpacity={0.7}
          >
            <View style={styles.imageRepositoryLink}>
              <Ionicons name="images-outline" size={18} color={theme.colors.primary} />
              <Text style={[styles.imageRepositoryLinkText, { color: theme.colors.primary }]}>
                View all images
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Car Details */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Car Details
          </Text>
          <Text style={[styles.carName, { color: theme.colors.textPrimary }]}>
            {booking.carName}
          </Text>
          <View style={styles.carSpecs}>
            {booking.seats && (
              <View style={styles.specItem}>
                <Ionicons name="people-outline" size={18} color={theme.colors.hint} />
                <Text style={[styles.specText, { color: theme.colors.textSecondary }]}>
                  {booking.seats} Seats
                </Text>
              </View>
            )}
            {booking.fuel && (
              <View style={styles.specItem}>
                <Ionicons name="car-outline" size={18} color={theme.colors.hint} />
                <Text style={[styles.specText, { color: theme.colors.textSecondary }]}>
                  {booking.fuel}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Rental Period */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Rental Period
          </Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Pickup Date
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
                {formatDate(booking.pickupDate || booking.date)}
              </Text>
            </View>
            {booking.pickupTime && (
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                  Pickup Time
                </Text>
                <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
                  {booking.pickupTime}
                </Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Dropoff Date
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
                {formatDate(booking.dropoffDate || booking.date)}
              </Text>
            </View>
            {booking.dropoffTime && (
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                  Dropoff Time
                </Text>
                <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
                  {booking.dropoffTime}
                </Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Duration
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
                {booking.duration || `${booking.days || 1} day${(booking.days || 1) > 1 ? 's' : ''}`}
              </Text>
            </View>
          </View>
        </View>

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Locations */}
        {(booking.pickupLocation || booking.dropoffLocation) && (
          <>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                Locations
              </Text>
              <View style={styles.infoCard}>
                {booking.pickupLocation && (
                  <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                      Pickup Location
                    </Text>
                    <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
                      {booking.pickupLocation}
                    </Text>
                  </View>
                )}
                {booking.dropoffLocation && (
                  <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                      Dropoff Location
                    </Text>
                    <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
                      {booking.dropoffLocation}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />
          </>
        )}

        {/* Payment Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Payment Information
          </Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                {booking?.payOnSite ? 'Total Amount' : 'Booking Fee'}
              </Text>
              <Text style={[styles.totalPrice, { color: theme.colors.primary }]}>
                {formatCurrency(paymentAmount)}
              </Text>
            </View>
            {booking.bookingId && (
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                  Booking ID
                </Text>
                <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
                  {booking.bookingId || `BK-${booking.id}`}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Action Buttons */}
        <View style={styles.section}>
          <Button
            title={booking?.payOnSite ? 'Pay Now' : 'Complete Payment'}
            onPress={handleCompletePayment}
            variant="primary"
            style={[styles.paymentButton, { backgroundColor: '#FF1577' }]}
          />
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelBooking}
            activeOpacity={0.7}
          >
            <Text style={[styles.cancelButtonText, { color: theme.colors.textSecondary }]}>
              Cancel Booking
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_600SemiBold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  sectionSeparator: {
    borderTopWidth: 1,
    marginHorizontal: 24,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 18,
    fontFamily: 'Nunito_600SemiBold',
  },
  statusSubtext: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    marginTop: 4,
  },
  imageRepositoryCard: {
    padding: 16,
  },
  imageRepositoryLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  imageRepositoryLinkText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    textDecorationLine: 'underline',
  },
  carName: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 12,
  },
  carSpecs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  specText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  infoCard: {
    padding: 20,
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  totalPrice: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
  },
  paymentButton: {
    marginBottom: 12,
  },
  cancelButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
});

export default PendingRentalDetailsScreen;

