import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Button, Card, Toggle } from '../../packages/components';
import { formatCurrency, formatPricePerDay } from '../../packages/utils/currency';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BookingConfirmationScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { bookingDetails } = route.params || {};

  // Payment option: 'payNow' (default) or 'payOnSite'
  const [paymentOption, setPaymentOption] = useState('payNow');
  
  // Commission rate (15%)
  const COMMISSION_RATE = 0.15;
  const totalRentalPrice = bookingDetails?.totalRentalPrice || 0;
  const bookingFee = paymentOption === 'payOnSite' ? totalRentalPrice * COMMISSION_RATE : 0;
  const balanceToPayOnSite = paymentOption === 'payOnSite' ? totalRentalPrice - bookingFee : 0;

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

  const formatDate = (date) => {
    if (!date) return 'N/A';
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
      {/* Sticky Back Button */}
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 8 }]}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
      {/* Booking Details */}
      <View style={[styles.section, styles.firstSection]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Booking Details
        </Text>

        <Card style={[styles.detailCard, { backgroundColor: theme.colors.white }]}>
          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Ionicons name="car-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Car
              </Text>
            </View>
            <View style={styles.detailRight}>
              <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                {bookingDetails?.car?.name || 'Toyota Corolla'}
              </Text>
            </View>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Pickup
              </Text>
            </View>
            <View style={styles.detailRight}>
              <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                {formatDate(bookingDetails?.pickupDate)}
              </Text>
              <Text style={[styles.detailSubtext, { color: theme.colors.textSecondary }]}>
                {bookingDetails?.pickupTime || '10:00'}
              </Text>
            </View>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Dropoff
              </Text>
            </View>
            <View style={styles.detailRight}>
              <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                {formatDate(bookingDetails?.dropoffDate)}
              </Text>
              <Text style={[styles.detailSubtext, { color: theme.colors.textSecondary }]}>
                {bookingDetails?.dropoffTime || '10:00'}
              </Text>
            </View>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Ionicons name="location-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Pickup Location
              </Text>
            </View>
            <View style={styles.detailRight}>
              <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                {bookingDetails?.pickupLocation || 'Nairobi CBD, Kenya'}
              </Text>
            </View>
          </View>

          {bookingDetails?.dropoffLocation && bookingDetails?.dropoffLocation !== bookingDetails?.pickupLocation && (
            <>
              <View style={styles.detailDivider} />
              <View style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <Ionicons name="location-outline" size={20} color={theme.colors.primary} />
                  <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                    Dropoff Location
                  </Text>
                </View>
                <View style={styles.detailRight}>
                  <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                    {bookingDetails.dropoffLocation}
                  </Text>
                </View>
              </View>
            </>
          )}

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Duration
              </Text>
            </View>
            <View style={styles.detailRight}>
              <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                {bookingDetails?.days || 0} {bookingDetails?.days === 1 ? 'day' : 'days'}
              </Text>
            </View>
          </View>

          {bookingDetails?.insuranceEnabled && (
            <>
              <View style={styles.detailDivider} />
              <View style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <Ionicons name="shield-checkmark-outline" size={20} color="#4CAF50" />
                  <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                    Insurance
                  </Text>
                </View>
                <View style={styles.detailRight}>
                  <Text style={[styles.detailValue, { color: '#4CAF50' }]}>
                    Included
                  </Text>
                </View>
              </View>
            </>
          )}

          {bookingDetails?.specialRequirements && (
            <>
              <View style={styles.detailDivider} />
              <View style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <Ionicons name="document-text-outline" size={20} color={theme.colors.primary} />
                  <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                    Special Requirements
                  </Text>
                </View>
                <View style={styles.detailRight}>
                  <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                    {bookingDetails.specialRequirements}
                  </Text>
                </View>
              </View>
            </>
          )}
        </Card>
      </View>

      {/* Price Summary */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Price Summary
        </Text>

        <Card style={[styles.priceCard, { backgroundColor: theme.colors.white }]}>
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>
              Base Price ({bookingDetails?.days || 0} {bookingDetails?.days === 1 ? 'day' : 'days'})
            </Text>
            <Text style={[styles.priceValue, { color: theme.colors.textPrimary }]}>
              {formatCurrency(bookingDetails?.basePrice || 0)}
            </Text>
          </View>

          {bookingDetails?.insuranceEnabled && (
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>
                Insurance
              </Text>
              <Text style={[styles.priceValue, { color: theme.colors.textPrimary }]}>
                {formatCurrency(bookingDetails?.insuranceCost || 0)}
              </Text>
            </View>
          )}

          {(() => {
            // Calculate VAT breakdown from the total (VAT is already included)
            const totalRentalPrice = bookingDetails?.totalRentalPrice || 0;
            const subtotalBeforeVAT = totalRentalPrice / 1.16;
            const vatAmount = totalRentalPrice - subtotalBeforeVAT;
            
            return (
              <>
                <View style={styles.priceRow}>
                  <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>
                    Subtotal
                  </Text>
                  <Text style={[styles.priceValue, { color: theme.colors.textPrimary }]}>
                    {formatCurrency(subtotalBeforeVAT)}
                  </Text>
                </View>

                <View style={styles.priceRow}>
                  <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>
                    VAT (16%)
                  </Text>
                  <Text style={[styles.priceValue, { color: theme.colors.textPrimary }]}>
                    {formatCurrency(vatAmount)}
                  </Text>
                </View>
              </>
            );
          })()}

          <View style={[styles.priceRow, styles.priceRowTotal]}>
            <Text style={[styles.priceLabelTotal, { color: theme.colors.textPrimary }]}>
              {paymentOption === 'payOnSite' ? 'Total Rental Price' : 'Total'}
            </Text>
            <Text style={[styles.priceValueTotal, { color: theme.colors.primary }]}>
              {formatCurrency(totalRentalPrice)}
            </Text>
          </View>

          {paymentOption === 'payOnSite' && (
            <>
              <View style={styles.priceDivider} />
              <View style={[styles.priceRow, styles.priceRowPayNow]}>
                <View style={styles.payNowLabelContainer}>
                  <Text style={[styles.payNowLabel, { color: theme.colors.textPrimary }]}>
                    Amount to Pay Now
                  </Text>
                  <Text style={[styles.payNowSubtext, { color: theme.colors.textSecondary }]}>
                    Booking fee only
                  </Text>
                </View>
                <Text style={[styles.payNowValue, { color: theme.colors.primary }]}>
                  {formatCurrency(bookingFee)}
                </Text>
              </View>
            </>
          )}
        </Card>
      </View>

      {/* Payment Options */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Payment Options
        </Text>
        <Card style={[styles.paymentOptionsCard, { backgroundColor: theme.colors.white }]}>
          {/* Pay Now Option */}
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentOption === 'payNow' && { backgroundColor: theme.colors.primary + '15', borderColor: theme.colors.primary },
              { borderWidth: 2, borderColor: theme.colors.hint + '40' }
            ]}
            onPress={() => setPaymentOption('payNow')}
            activeOpacity={0.7}
          >
            <View style={styles.paymentOptionContent}>
              <Ionicons 
                name="card-outline" 
                size={24} 
                color={paymentOption === 'payNow' ? theme.colors.primary : theme.colors.hint} 
              />
              <View style={styles.paymentOptionText}>
                <Text style={[
                  styles.paymentOptionTitle, 
                  { color: paymentOption === 'payNow' ? theme.colors.textPrimary : theme.colors.textSecondary }
                ]}>
                  Pay Now
                </Text>
                <Text style={[styles.paymentOptionDesc, { color: theme.colors.textSecondary }]}>
                  Pay the full amount now
                </Text>
              </View>
            </View>
            {paymentOption === 'payNow' && (
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
            )}
          </TouchableOpacity>

          {/* Pay on Site Option */}
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentOption === 'payOnSite' && { backgroundColor: theme.colors.primary + '15', borderColor: theme.colors.primary },
              { borderWidth: 2, borderColor: theme.colors.hint + '40', marginTop: 12 }
            ]}
            onPress={() => setPaymentOption('payOnSite')}
            activeOpacity={0.7}
          >
            <View style={styles.paymentOptionContent}>
              <Ionicons 
                name="location-outline" 
                size={24} 
                color={paymentOption === 'payOnSite' ? theme.colors.primary : theme.colors.hint} 
              />
              <View style={styles.paymentOptionText}>
                <Text style={[
                  styles.paymentOptionTitle, 
                  { color: paymentOption === 'payOnSite' ? theme.colors.textPrimary : theme.colors.textSecondary }
                ]}>
                  Pay on Site
                </Text>
                <Text style={[styles.paymentOptionDesc, { color: theme.colors.textSecondary }]}>
                  Reserve now, pay owner at pickup
                </Text>
              </View>
            </View>
            {paymentOption === 'payOnSite' && (
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
            )}
          </TouchableOpacity>

          {paymentOption === 'payOnSite' && (
            <View style={[styles.payOnSiteInfo, { backgroundColor: theme.colors.primary + '10', marginTop: 16 }]}>
              <View style={styles.infoRow}>
                <Ionicons name="information-circle-outline" size={20} color={theme.colors.primary} />
                <Text style={[styles.infoText, { color: theme.colors.textPrimary }]}>
                  Reserve your booking by paying the booking fee (platform commission). You'll pay the car owner directly when you pick up the car.
                </Text>
              </View>
              <View style={[styles.bookingFeeRow, { borderTopColor: theme.colors.hint + '30' }]}>
                <Text style={[styles.bookingFeeLabel, { color: theme.colors.textSecondary }]}>
                  Booking Fee
                </Text>
                <Text style={[styles.bookingFeeValue, { color: theme.colors.primary }]}>
                  {formatCurrency(bookingFee)}
                </Text>
              </View>
              <View style={[styles.balanceOnSiteRow, { backgroundColor: '#FF9800' + '15' }]}>
                <View style={styles.balanceOnSiteLeft}>
                  <Ionicons name="cash-outline" size={18} color="#FF9800" />
                  <View style={styles.balanceOnSiteLabelContainer}>
                    <Text style={[styles.balanceOnSiteLabel, { color: theme.colors.textPrimary }]}>
                      Balance to Pay on Site
                    </Text>
                    <Text style={[styles.balanceOnSiteSubtext, { color: theme.colors.textSecondary }]}>
                      Pay directly to owner at pickup
                    </Text>
                  </View>
                </View>
                <Text style={[styles.balanceOnSiteValue, { color: '#FF9800' }]}>
                  {formatCurrency(balanceToPayOnSite)}
                </Text>
              </View>
            </View>
          )}
        </Card>
      </View>

      {/* Separator Line */}
      <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

      {/* Cancellation Policy */}
      <View style={styles.section}>
        <Card style={[styles.policyCard, { backgroundColor: theme.colors.white }]}>
          <View style={styles.policyHeader}>
            <Ionicons name="time-outline" size={24} color={theme.colors.primary} />
            <Text style={[styles.policyTitle, { color: theme.colors.textPrimary }]}>
              Cancellation Policy
            </Text>
          </View>
          <View style={styles.policyContent}>
            <View style={styles.policyItem}>
              <View style={[styles.policyBadge, { backgroundColor: '#4CAF50' + '20' }]}>
                <Text style={[styles.policyBadgeText, { color: '#4CAF50' }]}>Free</Text>
              </View>
              <View style={styles.policyItemContent}>
                <Text style={[styles.policyItemTitle, { color: theme.colors.textPrimary }]}>
                  More than 48 hours before pickup
                </Text>
                <Text style={[styles.policyItemDesc, { color: theme.colors.textSecondary }]}>
                  Full refund (100%)
                </Text>
              </View>
            </View>
            <View style={styles.policyItem}>
              <View style={[styles.policyBadge, { backgroundColor: '#FF9800' + '20' }]}>
                <Text style={[styles.policyBadgeText, { color: '#FF9800' }]}>50%</Text>
              </View>
              <View style={styles.policyItemContent}>
                <Text style={[styles.policyItemTitle, { color: theme.colors.textPrimary }]}>
                  24-48 hours before pickup
                </Text>
                <Text style={[styles.policyItemDesc, { color: theme.colors.textSecondary }]}>
                  Partial refund (50% of booking fee)
                </Text>
              </View>
            </View>
            <View style={styles.policyItem}>
              <View style={[styles.policyBadge, { backgroundColor: '#F44336' + '20' }]}>
                <Text style={[styles.policyBadgeText, { color: '#F44336' }]}>No</Text>
              </View>
              <View style={styles.policyItemContent}>
                <Text style={[styles.policyItemTitle, { color: theme.colors.textPrimary }]}>
                  Less than 24 hours before pickup
                </Text>
                <Text style={[styles.policyItemDesc, { color: theme.colors.textSecondary }]}>
                  No refund (contact support for disputes)
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.viewPolicyButton}
            onPress={() => navigation.navigate('CancellationPolicy', { fromBookingConfirmation: true })}
            activeOpacity={0.7}
          >
            <Text style={[styles.viewPolicyText, { color: theme.colors.primary }]}>
              View Full Policy
            </Text>
            <Ionicons name="chevron-forward-outline" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </Card>
      </View>

      {/* Important Notes */}
      <View style={styles.section}>
        <View style={[styles.notesCard, { backgroundColor: '#FF9800' + '10' }]}>
          <View style={styles.notesHeader}>
            <Ionicons name="information-circle-outline" size={24} color="#FF9800" />
            <Text style={[styles.notesTitle, { color: theme.colors.textPrimary }]}>
              Important Information
            </Text>
          </View>
          <View style={styles.notesList}>
            <View style={styles.noteItem}>
              <Text style={[styles.noteBullet, { color: '#FF9800' }]}>•</Text>
              <Text style={[styles.noteText, { color: theme.colors.textSecondary }]}>
                Please bring a valid driver's license and ID when picking up the car
              </Text>
            </View>
            <View style={styles.noteItem}>
              <Text style={[styles.noteBullet, { color: '#FF9800' }]}>•</Text>
              <Text style={[styles.noteText, { color: theme.colors.textSecondary }]}>
                Arrive 15 minutes before your scheduled pickup time
              </Text>
            </View>
            <View style={styles.noteItem}>
              <Text style={[styles.noteBullet, { color: '#FF9800' }]}>•</Text>
              <Text style={[styles.noteText, { color: theme.colors.textSecondary }]}>
                Late returns may incur additional charges
              </Text>
            </View>
          {paymentOption === 'payOnSite' && (
            <View style={styles.noteItem}>
              <Text style={[styles.noteBullet, { color: '#FF9800' }]}>•</Text>
              <Text style={[styles.noteText, { color: theme.colors.textSecondary }]}>
                You'll pay the remaining balance directly to the car owner at pickup
              </Text>
            </View>
          )}
          </View>
        </View>
      </View>

      {/* Terms Statement */}
      <View style={styles.section}>
        <Card style={[styles.termsCard, { backgroundColor: theme.colors.white }]}>
          <Text style={[styles.termsStatement, { color: theme.colors.textSecondary }]}>
            By proceeding, you agree to all{' '}
            <Text 
              style={[styles.termsLink, { color: theme.colors.primary }]}
              onPress={() => navigation.navigate('CancellationPolicy')}
            >
              Terms and Conditions
            </Text>
          </Text>
        </Card>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>

    {/* Bottom Action Bar */}
    <View style={[styles.bottomBar, { backgroundColor: theme.colors.white }]}>
      <View style={styles.bottomBarPrice}>
        <Text style={[styles.bottomBarLabel, { color: theme.colors.hint }]}>
          {paymentOption === 'payOnSite' ? 'Booking Fee' : 'Total'}
        </Text>
        <Text style={[styles.bottomBarPriceValue, { color: theme.colors.primary }]}>
          {formatCurrency(paymentOption === 'payOnSite' ? bookingFee : totalRentalPrice)}
        </Text>
      </View>
      <Button
        title="Proceed to Payment"
        onPress={handleProceedToPayment}
        variant="primary"
        style={[styles.proceedButton, { backgroundColor: '#FF1577' }]}
      />
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
    paddingTop: 60,
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  firstSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  detailCard: {
    padding: 20,
    borderRadius: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  detailRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    textAlign: 'right',
    marginBottom: 4,
  },
  detailSubtext: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'right',
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 8,
  },
  priceCard: {
    padding: 20,
    borderRadius: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  priceLabel: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    flex: 1,
    marginRight: 8,
  },
  priceValue: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    flexShrink: 0,
    textAlign: 'right',
  },
  priceRowTotal: {
    marginTop: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  priceLabelTotal: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    flex: 1,
    marginRight: 8,
  },
  priceValueTotal: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    flexShrink: 0,
    textAlign: 'right',
  },
  priceDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  priceRowPayNow: {
    marginTop: 8,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payNowLabelContainer: {
    flex: 1,
    flexShrink: 1,
    marginRight: 12,
  },
  payNowLabel: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  payNowSubtext: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  payNowValue: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    flexShrink: 0,
    textAlign: 'right',
  },
  termsCard: {
    padding: 20,
    borderRadius: 16,
  },
  termsStatement: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
    textAlign: 'center',
    paddingVertical: 8,
  },
  termsLink: {
    fontFamily: 'Nunito_600SemiBold',
  },
  paymentOptionsCard: {
    padding: 20,
    borderRadius: 16,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  paymentOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  paymentOptionText: {
    flex: 1,
  },
  paymentOptionTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 4,
  },
  paymentOptionDesc: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  payOnSiteInfo: {
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  bookingFeeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  bookingFeeLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  bookingFeeValue: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  balanceOnSiteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  balanceOnSiteLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  balanceOnSiteLabelContainer: {
    flex: 1,
  },
  balanceOnSiteLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 2,
  },
  balanceOnSiteSubtext: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  balanceOnSiteValue: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  notesCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  notesTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  notesList: {
    gap: 12,
  },
  noteItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  noteBullet: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginTop: -2,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  policyCard: {
    padding: 20,
    borderRadius: 16,
  },
  policyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  policyTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
  },
  policyContent: {
    gap: 16,
    marginBottom: 16,
  },
  policyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  policyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 50,
    alignItems: 'center',
  },
  policyBadgeText: {
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
  },
  policyItemContent: {
    flex: 1,
  },
  policyItemTitle: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 4,
  },
  policyItemDesc: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  viewPolicyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 8,
  },
  viewPolicyText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 16,
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
  proceedButton: {
    minWidth: 160,
  },
  sectionSeparator: {
    height: 1,
    borderTopWidth: 1,
    marginHorizontal: 24,
    marginTop: 24,
  },
});

export default BookingConfirmationScreen;

