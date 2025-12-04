import React, { useLayoutEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ServiceBookingConfirmationScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { bookingDetails, totalPrice } = route.params || {};

  const service = bookingDetails?.service || {};
  const category = bookingDetails?.category || '';
  const categoryStr = (category || '').toLowerCase();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Review Booking',
    });
  }, [navigation]);

  // Hide tab bar when screen is focused
  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: 'none' },
      });
      return () => {
        // Don't restore here to prevent flickering
      };
    }, [navigation])
  );

  const handleProceedToPayment = () => {
    navigation.navigate('Payment', {
      totalPrice: totalPrice || 0,
      bookingDetails: {
        ...bookingDetails,
        type: 'service',
      },
    });
  };

  // Render road trips specific content
  const renderRoadTripsContent = () => {
    return (
      <>
        {/* Booking Details Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeaderTitle, { color: theme.colors.textPrimary }]}>
            Booking Details
          </Text>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Date
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
              {bookingDetails?.serviceDate || 'Not set'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Time
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
              {bookingDetails?.serviceTime || 'Not set'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Pickup Location
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
              {bookingDetails?.pickupLocation || 'Not set'}
            </Text>
          </View>
        </View>

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Trip Information Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeaderTitle, { color: theme.colors.textPrimary }]}>
            Trip Information
          </Text>
          
          {bookingDetails?.areasOfVisit && bookingDetails.areasOfVisit.length > 0 && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Areas of Visit
              </Text>
              <View style={styles.areasContainer}>
                {bookingDetails.areasOfVisit.map((area, index) => (
                  <View key={index} style={[styles.areaChip, { backgroundColor: theme.colors.primary + '15' }]}>
                    <Text style={[styles.areaChipText, { color: theme.colors.textPrimary }]}>
                      {area}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {bookingDetails?.numberOfPassengers && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Number of Passengers
              </Text>
              <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                {bookingDetails.numberOfPassengers}
              </Text>
            </View>
          )}

          {bookingDetails?.duration && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Duration
              </Text>
              <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                {bookingDetails.duration}
              </Text>
            </View>
          )}
        </View>

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Contact Information Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeaderTitle, { color: theme.colors.textPrimary }]}>
            Contact Information
          </Text>
          
          {bookingDetails?.contactPhone && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Phone Number
              </Text>
              <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                {bookingDetails.contactPhone}
              </Text>
            </View>
          )}

          {bookingDetails?.additionalNotes && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Additional Notes
              </Text>
              <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                {bookingDetails.additionalNotes}
              </Text>
            </View>
          )}
        </View>
      </>
    );
  };

  // Render default content for other service types
  const renderDefaultContent = () => {
    return (
      <>
        <View style={styles.section}>
          <Text style={[styles.sectionHeaderTitle, { color: theme.colors.textPrimary }]}>
            Booking Details
          </Text>
          
          {bookingDetails?.serviceDate && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Date
              </Text>
              <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                {bookingDetails.serviceDate}
              </Text>
            </View>
          )}

          {bookingDetails?.serviceTime && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Time
              </Text>
              <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                {bookingDetails.serviceTime}
              </Text>
            </View>
          )}

          {bookingDetails?.contactPhone && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Phone Number
              </Text>
              <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                {bookingDetails.contactPhone}
              </Text>
            </View>
          )}
        </View>
      </>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Service Summary */}
        <View style={[styles.summaryCard, { backgroundColor: theme.colors.white }]}>
          <View style={styles.summaryHeader}>
            {service.image && (
              <View style={styles.serviceImageContainer}>
                <Ionicons name="car-outline" size={32} color={theme.colors.primary} />
              </View>
            )}
            <View style={styles.summaryTextContainer}>
              <Text style={[styles.serviceName, { color: theme.colors.textPrimary }]}>
                {service.name || 'Service'}
              </Text>
              <Text style={[styles.serviceCategory, { color: theme.colors.textSecondary }]}>
                {category || service.category || ''}
              </Text>
            </View>
          </View>
        </View>

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Dynamic Content Based on Service Type */}
        {categoryStr.includes('road trips') || categoryStr.includes('hire professional drivers') || categoryStr.includes('drivers')
          ? renderRoadTripsContent()
          : renderDefaultContent()}

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Price Summary */}
        <View style={styles.section}>
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>
              Total Amount
            </Text>
            <Text style={[styles.priceValue, { color: theme.colors.primary }]}>
              {service?.price || `KSh ${totalPrice || 0}`}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar with Proceed to Payment Button */}
      <View style={[styles.footer, { backgroundColor: theme.colors.white, paddingBottom: Math.max(insets.bottom, 20) }]}>
        <TouchableOpacity
          style={[styles.proceedButton, { backgroundColor: '#FF1577' }]}
          onPress={handleProceedToPayment}
          activeOpacity={0.8}
        >
          <Text style={[styles.proceedButtonText, { color: theme.colors.white }]}>
            Proceed to Payment
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
  },
  summaryCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  serviceImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryTextContainer: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  serviceCategory: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  sectionSeparator: {
    borderTopWidth: 1,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
  },
  section: {
    padding: 16,
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 16,
  },
  detailRow: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 6,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  areasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  areaChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  areaChipText: {
    fontSize: 14,
    fontFamily: 'Nunito_500Medium',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  priceLabel: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  priceValue: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  proceedButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proceedButtonText: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
});

export default ServiceBookingConfirmationScreen;
