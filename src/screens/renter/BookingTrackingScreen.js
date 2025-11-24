import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Button } from '../../packages/components';

const BookingTrackingScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { bookingDetails, paymentMethod, totalPrice } = route.params || {};

  const [daysUntilPickup, setDaysUntilPickup] = useState(0);
  const [hoursUntilPickup, setHoursUntilPickup] = useState(0);
  const [minutesUntilPickup, setMinutesUntilPickup] = useState(0);

  // Hide bottom tab bar on this screen
  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: 'none' },
    });
    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
    };
  }, [navigation]);

  // Calculate countdown to pickup
  useEffect(() => {
    if (!bookingDetails?.pickupDate) return;

    const updateCountdown = () => {
      const now = new Date();
      const pickup = new Date(bookingDetails.pickupDate);
      pickup.setHours(10, 0, 0, 0); // Set pickup time to 10:00 AM

      const diff = pickup.getTime() - now.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        setDaysUntilPickup(days);
        setHoursUntilPickup(hours);
        setMinutesUntilPickup(minutes);
      } else {
        setDaysUntilPickup(0);
        setHoursUntilPickup(0);
        setMinutesUntilPickup(0);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [bookingDetails?.pickupDate]);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDownloadReceipt = () => {
    Alert.alert(
      'Download Receipt',
      'Your receipt will be downloaded and saved to your device.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Download',
          onPress: () => {
            // TODO: Implement actual receipt download
            Alert.alert('Success', 'Receipt downloaded successfully!');
          },
        },
      ]
    );
  };

  const handleContactSupport = () => {
    Linking.openURL('tel:+254702248984').catch((err) =>
      console.error('Failed to open phone:', err)
    );
  };

  const InfoCard = ({ icon, title, value, onPress }) => (
    <TouchableOpacity
      style={[styles.infoCard, { backgroundColor: theme.colors.white }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.infoCardLeft}>
        <Ionicons name={icon} size={24} color={theme.colors.primary} />
        <View style={styles.infoCardText}>
          <Text style={[styles.infoCardLabel, { color: theme.colors.hint }]}>{title}</Text>
          <Text style={[styles.infoCardValue, { color: theme.colors.textPrimary }]}>{value}</Text>
        </View>
      </View>
      {onPress && <Ionicons name="chevron-forward" size={20} color={theme.colors.hint} />}
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Success Header */}
      <View style={[styles.successHeader, { backgroundColor: theme.colors.white }]}>
        <View style={[styles.successIconContainer, { backgroundColor: '#4CAF50' + '20' }]}>
          <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
        </View>
        <Text style={[styles.successTitle, { color: theme.colors.textPrimary }]}>
          Booking Confirmed!
        </Text>
        <Text style={[styles.successSubtitle, { color: theme.colors.textSecondary }]}>
          Your payment has been processed successfully
        </Text>
      </View>

      {/* Countdown Timer */}
      <View style={[styles.countdownCard, { backgroundColor: theme.colors.white }]}>
        <Text style={[styles.countdownTitle, { color: theme.colors.textPrimary }]}>
          Pickup in
        </Text>
        <View style={styles.countdownContainer}>
          <View style={styles.countdownItem}>
            <Text style={[styles.countdownValue, { color: theme.colors.primary }]}>
              {daysUntilPickup}
            </Text>
            <Text style={[styles.countdownLabel, { color: theme.colors.textSecondary }]}>
              Days
            </Text>
          </View>
          <View style={styles.countdownSeparator}>
            <Text style={[styles.countdownSeparatorText, { color: theme.colors.hint }]}>:</Text>
          </View>
          <View style={styles.countdownItem}>
            <Text style={[styles.countdownValue, { color: theme.colors.primary }]}>
              {hoursUntilPickup}
            </Text>
            <Text style={[styles.countdownLabel, { color: theme.colors.textSecondary }]}>
              Hours
            </Text>
          </View>
          <View style={styles.countdownSeparator}>
            <Text style={[styles.countdownSeparatorText, { color: theme.colors.hint }]}>:</Text>
          </View>
          <View style={styles.countdownItem}>
            <Text style={[styles.countdownValue, { color: theme.colors.primary }]}>
              {minutesUntilPickup}
            </Text>
            <Text style={[styles.countdownLabel, { color: theme.colors.textSecondary }]}>
              Minutes
            </Text>
          </View>
        </View>
      </View>

      {/* Booking Details */}
      <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Booking Details
        </Text>
        <InfoCard
          icon="car-outline"
          title="Car"
          value={bookingDetails?.car?.name || 'N/A'}
        />
        <InfoCard
          icon="calendar-outline"
          title="Pickup Date"
          value={formatDate(bookingDetails?.pickupDate)}
        />
        <InfoCard
          icon="calendar-outline"
          title="Dropoff Date"
          value={formatDate(bookingDetails?.dropoffDate)}
        />
        <InfoCard
          icon="time-outline"
          title="Duration"
          value={`${bookingDetails?.days || 0} ${bookingDetails?.days === 1 ? 'day' : 'days'}`}
        />
        <InfoCard
          icon="cash-outline"
          title="Total Amount"
          value={`$${totalPrice?.toFixed(2) || '0.00'}`}
        />
      </View>

      {/* Pickup Instructions */}
      <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Pickup Instructions
        </Text>
        <View style={styles.instructionsList}>
          <View style={styles.instructionItem}>
            <View style={[styles.instructionNumber, { backgroundColor: theme.colors.primary }]}>
              <Text style={[styles.instructionNumberText, { color: theme.colors.white }]}>1</Text>
            </View>
            <View style={styles.instructionContent}>
              <Text style={[styles.instructionTitle, { color: theme.colors.textPrimary }]}>
                Arrive at Pickup Location
              </Text>
              <Text style={[styles.instructionText, { color: theme.colors.textSecondary }]}>
                Nairobi CBD, Kenya - Please arrive 15 minutes before your scheduled pickup time.
              </Text>
            </View>
          </View>

          <View style={styles.instructionItem}>
            <View style={[styles.instructionNumber, { backgroundColor: theme.colors.primary }]}>
              <Text style={[styles.instructionNumberText, { color: theme.colors.white }]}>2</Text>
            </View>
            <View style={styles.instructionContent}>
              <Text style={[styles.instructionTitle, { color: theme.colors.textPrimary }]}>
                Bring Required Documents
              </Text>
              <Text style={[styles.instructionText, { color: theme.colors.textSecondary }]}>
                Valid driver's license, ID card, and booking confirmation.
              </Text>
            </View>
          </View>

          <View style={styles.instructionItem}>
            <View style={[styles.instructionNumber, { backgroundColor: theme.colors.primary }]}>
              <Text style={[styles.instructionNumberText, { color: theme.colors.white }]}>3</Text>
            </View>
            <View style={styles.instructionContent}>
              <Text style={[styles.instructionTitle, { color: theme.colors.textPrimary }]}>
                Vehicle Inspection
              </Text>
              <Text style={[styles.instructionText, { color: theme.colors.textSecondary }]}>
                Inspect the vehicle for any existing damage and report it before driving.
              </Text>
            </View>
          </View>

          <View style={styles.instructionItem}>
            <View style={[styles.instructionNumber, { backgroundColor: theme.colors.primary }]}>
              <Text style={[styles.instructionNumberText, { color: theme.colors.white }]}>4</Text>
            </View>
            <View style={styles.instructionContent}>
              <Text style={[styles.instructionTitle, { color: theme.colors.textPrimary }]}>
                Complete Check-in
              </Text>
              <Text style={[styles.instructionText, { color: theme.colors.textSecondary }]}>
                Sign the rental agreement and receive the vehicle keys.
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Rules & Guidelines */}
      <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Rules & Guidelines
        </Text>
        <View style={styles.rulesList}>
          <View style={styles.ruleItem}>
            <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
            <Text style={[styles.ruleText, { color: theme.colors.textSecondary }]}>
              Minimum age requirement: 21 years
            </Text>
          </View>
          <View style={styles.ruleItem}>
            <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
            <Text style={[styles.ruleText, { color: theme.colors.textSecondary }]}>
              Valid driver's license required
            </Text>
          </View>
          <View style={styles.ruleItem}>
            <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
            <Text style={[styles.ruleText, { color: theme.colors.textSecondary }]}>
              No smoking inside the vehicle
            </Text>
          </View>
          <View style={styles.ruleItem}>
            <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
            <Text style={[styles.ruleText, { color: theme.colors.textSecondary }]}>
              Return vehicle with same fuel level
            </Text>
          </View>
          <View style={styles.ruleItem}>
            <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
            <Text style={[styles.ruleText, { color: theme.colors.textSecondary }]}>
              Late return fees apply after dropoff time
            </Text>
          </View>
          <View style={styles.ruleItem}>
            <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
            <Text style={[styles.ruleText, { color: theme.colors.textSecondary }]}>
              Report any accidents or damages immediately
            </Text>
          </View>
        </View>
      </View>

      {/* Important Information */}
      <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Important Information
        </Text>
        <View style={styles.infoList}>
          <View style={styles.infoListItem}>
            <Ionicons name="information-circle-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.infoListText, { color: theme.colors.textSecondary }]}>
              Booking ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </Text>
          </View>
          <View style={styles.infoListItem}>
            <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.infoListText, { color: theme.colors.textSecondary }]}>
              Pickup Time: 10:00 AM
            </Text>
          </View>
          <View style={styles.infoListItem}>
            <Ionicons name="location-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.infoListText, { color: theme.colors.textSecondary }]}>
              Pickup Location: Nairobi CBD, Kenya
            </Text>
          </View>
          {bookingDetails?.specialRequirements && (
            <View style={styles.infoListItem}>
              <Ionicons name="document-text-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.infoListText, { color: theme.colors.textSecondary }]}>
                Special Requirements: {bookingDetails.specialRequirements}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <Button
          title="Download Receipt"
          onPress={handleDownloadReceipt}
          variant="secondary"
          style={styles.actionButton}
        />
        <Button
          title="Contact Support"
          onPress={handleContactSupport}
          variant="primary"
          style={styles.actionButton}
        />
      </View>

      {/* Bottom Spacing */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  successHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  successIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 28,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
  },
  countdownCard: {
    marginHorizontal: 24,
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  countdownTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 20,
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownItem: {
    alignItems: 'center',
    minWidth: 60,
  },
  countdownValue: {
    fontSize: 36,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  countdownLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  countdownSeparator: {
    marginHorizontal: 8,
    paddingTop: 8,
  },
  countdownSeparatorText: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
  },
  section: {
    marginHorizontal: 24,
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  infoCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  infoCardText: {
    flex: 1,
  },
  infoCardLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoCardValue: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  instructionsList: {
    gap: 20,
  },
  instructionItem: {
    flexDirection: 'row',
    gap: 16,
  },
  instructionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionNumberText: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  instructionContent: {
    flex: 1,
  },
  instructionTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 6,
  },
  instructionText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  rulesList: {
    gap: 12,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  ruleText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 22,
  },
  infoList: {
    gap: 12,
  },
  infoListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoListText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 22,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
  },
});

export default BookingTrackingScreen;

