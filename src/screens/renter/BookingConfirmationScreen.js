import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { COLORS, SPACING, RADIUS, TYPE } from '../../packages/theme/tokens';
import { Button } from '../../packages/components';
import { formatCurrency } from '../../packages/utils/currency';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getCarPrimaryImage } from '../../packages/utils/supabaseImages';

const BookingConfirmationScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { bookingDetails } = route.params || {};

  // Payment option: 'payNow' (default) or 'payOnSite'
  const [paymentOption, setPaymentOption] = useState('payNow');
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  
  // Commission rate (15%)
  const COMMISSION_RATE = 0.15;
  const totalRentalPrice = bookingDetails?.totalRentalPrice || 0;
  const bookingFee = paymentOption === 'payOnSite' ? totalRentalPrice * COMMISSION_RATE : 0;
  const balanceToPayOnSite = paymentOption === 'payOnSite' ? totalRentalPrice - bookingFee : 0;

  // Get car image
  const carImage = getCarPrimaryImage(bookingDetails?.car?.imageKey || 'x');

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

  // Generate booking ID
  const bookingId = `BK-${Date.now().toString().slice(-8)}`;

  const formatDateShort = (date) => {
    if (!date) return 'N/A';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateRange = () => {
    const pickup = formatDateShort(bookingDetails?.pickupDate);
    const dropoff = formatDateShort(bookingDetails?.dropoffDate);
    return `${pickup} - ${dropoff}`;
  };

  const handleProceedToPayment = () => {
    const paymentAmount = paymentOption === 'payOnSite' ? bookingFee : totalRentalPrice;

    navigation.navigate('Payment', {
      totalPrice: paymentAmount,
      bookingDetails: {
        ...bookingDetails,
        bookingId,
        payOnSite: paymentOption === 'payOnSite',
        bookingFee: paymentOption === 'payOnSite' ? bookingFee : 0,
      },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header with close button */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Title */}
        <Text style={[styles.pageTitle, { color: theme.colors.textPrimary }]}>
          Review and continue
        </Text>

        {/* Car Info Card */}
        <View style={[styles.carCard, { backgroundColor: theme.colors.white, borderColor: theme.colors.hint + '30' }]}>
          <Image
            source={carImage}
            style={styles.carImage}
            resizeMode="cover"
          />
          <View style={styles.carInfo}>
            <Text style={[styles.carName, { color: theme.colors.textPrimary }]} numberOfLines={2}>
              {bookingDetails?.car?.name || 'Car'}
            </Text>
            <View style={styles.carRating}>
              <Ionicons name="star" size={14} color={theme.colors.textPrimary} />
              <Text style={[styles.carRatingText, { color: theme.colors.textPrimary }]}>
                {bookingDetails?.car?.rating || '4.8'} ({bookingDetails?.car?.reviews || '12'})
              </Text>
            </View>
          </View>
        </View>

        {/* Booking Details Section */}
        <View style={[styles.detailsSection, { borderColor: theme.colors.hint + '20' }]}>
          {/* Dates Row */}
          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Text style={[styles.detailLabel, { color: theme.colors.textPrimary }]}>Dates</Text>
              <Text style={[styles.detailValue, { color: theme.colors.textSecondary }]}>
                {formatDateRange()}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.changeButton, { backgroundColor: theme.colors.background, borderColor: theme.colors.hint + '40' }]}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={[styles.changeButtonText, { color: theme.colors.textPrimary }]}>Change</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.detailDivider, { backgroundColor: theme.colors.hint + '20' }]} />

          {/* Times Row */}
          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Text style={[styles.detailLabel, { color: theme.colors.textPrimary }]}>Times</Text>
              <Text style={[styles.detailValue, { color: theme.colors.textSecondary }]}>
                {bookingDetails?.pickupTime || '10:00'} - {bookingDetails?.dropoffTime || '10:00'}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.changeButton, { backgroundColor: theme.colors.background, borderColor: theme.colors.hint + '40' }]}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={[styles.changeButtonText, { color: theme.colors.textPrimary }]}>Change</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.detailDivider, { backgroundColor: theme.colors.hint + '20' }]} />

          {/* Location Row */}
          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Text style={[styles.detailLabel, { color: theme.colors.textPrimary }]}>Location</Text>
              <Text style={[styles.detailValue, { color: theme.colors.textSecondary }]}>
                {bookingDetails?.pickupLocation || 'Nairobi CBD, Kenya'}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.changeButton, { backgroundColor: theme.colors.background, borderColor: theme.colors.hint + '40' }]}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={[styles.changeButtonText, { color: theme.colors.textPrimary }]}>Change</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.detailDivider, { backgroundColor: theme.colors.hint + '20' }]} />

          {/* Total Price Row */}
          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Text style={[styles.detailLabel, { color: theme.colors.textPrimary }]}>Total price</Text>
              <Text style={[styles.priceValue, { color: theme.colors.textPrimary }]}>
                {formatCurrency(totalRentalPrice)}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.changeButton, { backgroundColor: theme.colors.background, borderColor: theme.colors.hint + '40' }]}
              onPress={() => setShowPriceDetails(true)}
              activeOpacity={0.7}
            >
              <Text style={[styles.changeButtonText, { color: theme.colors.textPrimary }]}>Details</Text>
            </TouchableOpacity>
          </View>

          {/* Insurance Badge */}
          {bookingDetails?.insuranceEnabled && (
            <>
              <View style={[styles.detailDivider, { backgroundColor: theme.colors.hint + '20' }]} />
              <View style={styles.insuranceRow}>
                <Ionicons name="shield-checkmark" size={18} color="#4CAF50" />
                <Text style={[styles.insuranceText, { color: '#4CAF50' }]}>
                  Insurance included
                </Text>
              </View>
            </>
          )}

          {/* Cancellation Policy */}
          <View style={[styles.detailDivider, { backgroundColor: theme.colors.hint + '20' }]} />
          <View style={styles.cancellationRow}>
            <Text style={[styles.cancellationTitle, { color: theme.colors.textPrimary }]}>
              Free cancellation
            </Text>
            <Text style={[styles.cancellationText, { color: theme.colors.textSecondary }]}>
              Cancel before pickup for a full refund.{' '}
              <Text 
                style={[styles.policyLink, { color: theme.colors.textPrimary }]}
                onPress={() => navigation.navigate('CancellationPolicy')}
              >
                Full policy
              </Text>
            </Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12, backgroundColor: theme.colors.background }]}>
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: theme.colors.textPrimary }]}
          onPress={handleProceedToPayment}
          activeOpacity={0.9}
        >
          <Text style={[styles.nextButtonText, { color: theme.colors.white }]}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* Price Details Modal */}
      <Modal
        visible={showPriceDetails}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPriceDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.white }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>Price details</Text>
              <TouchableOpacity onPress={() => setShowPriceDetails(false)} activeOpacity={0.7}>
                <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.priceRow}>
                <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>
                  {bookingDetails?.days || 0} {bookingDetails?.days === 1 ? 'day' : 'days'} rental
                </Text>
                <Text style={[styles.priceAmount, { color: theme.colors.textPrimary }]}>
                  {formatCurrency(bookingDetails?.basePrice || 0)}
                </Text>
              </View>

              {bookingDetails?.insuranceEnabled && (
                <View style={styles.priceRow}>
                  <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>Insurance</Text>
                  <Text style={[styles.priceAmount, { color: theme.colors.textPrimary }]}>
                    {formatCurrency(bookingDetails?.insuranceCost || 0)}
                  </Text>
                </View>
              )}

              <View style={styles.priceRow}>
                <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>VAT (16%)</Text>
                <Text style={[styles.priceAmount, { color: theme.colors.textPrimary }]}>
                  {formatCurrency((totalRentalPrice / 1.16) * 0.16)}
                </Text>
              </View>

              <View style={[styles.priceTotalRow, { borderTopColor: theme.colors.hint + '30' }]}>
                <Text style={[styles.priceTotalLabel, { color: theme.colors.textPrimary }]}>Total</Text>
                <Text style={[styles.priceTotalAmount, { color: theme.colors.textPrimary }]}>
                  {formatCurrency(totalRentalPrice)}
                </Text>
              </View>
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
  header: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
  },
  pageTitle: {
    fontSize: 26,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  // Car Card
  carCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    gap: 16,
  },
  carImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  carInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  carName: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 6,
    lineHeight: 22,
  },
  carRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  carRatingText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  // Details Section
  detailsSection: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailLeft: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  detailDivider: {
    height: 1,
    marginVertical: 16,
  },
  changeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  changeButtonText: {
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
  },
  priceValue: {
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold',
  },
  // Insurance Row
  insuranceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  insuranceText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  // Cancellation Row
  cancellationRow: {
    paddingVertical: 4,
  },
  cancellationTitle: {
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 4,
  },
  cancellationText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  policyLink: {
    fontFamily: 'Nunito_600SemiBold',
    textDecorationLine: 'underline',
  },
  // Bottom Bar
  bottomBar: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  nextButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
  },
  modalBody: {
    gap: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
  },
  priceAmount: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
  },
  priceTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 1,
  },
  priceTotalLabel: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  priceTotalAmount: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
});

export default BookingConfirmationScreen;

