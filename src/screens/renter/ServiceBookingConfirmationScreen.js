import React, { useLayoutEffect, useCallback, useState } from 'react';
import { useFocusEffect, CommonActions } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Modal, StatusBar } from 'react-native';
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDriverSuccessModal, setShowDriverSuccessModal] = useState(false);

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

  // Ensure StatusBar is dark when screen is focused
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content', true);
      return () => {
        // StatusBar will be restored by other screens
      };
    }, [])
  );

  const handleProceedToPayment = () => {
    const categoryStr = (category || '').toLowerCase();
    const isDriverService = categoryStr.includes('hire professional drivers') || (categoryStr.includes('drivers') && !categoryStr.includes('road trips'));
    const isRoadsideAssistance = categoryStr.includes('roadside');
    
    if (isDriverService) {
      // For drivers, send request (no payment)
      setShowDriverSuccessModal(true);
    } else if (isRoadsideAssistance) {
      // For roadside assistance, send request (no payment)
      setShowSuccessModal(true);
    } else {
      // For other services, proceed to payment
      navigation.navigate('Payment', {
        totalPrice: totalPrice || 0,
        bookingDetails: {
          ...bookingDetails,
          type: 'service',
        },
      });
    }
  };

  // Render hire professional drivers specific content
  const renderDriversContent = () => {
    return (
      <>
        {/* Booking Details Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeaderTitle, { color: theme.colors.textPrimary }]}>
            Booking Details
          </Text>
          
          {bookingDetails?.jobType && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Job Type
              </Text>
              <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                {bookingDetails.jobType === 'longterm' ? 'Longterm' : bookingDetails.jobType === 'quickjob' ? 'Quick Job' : bookingDetails.jobType}
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

  // Render movers specific content
  const renderMoversContent = () => {
    return (
      <>
        {/* Booking Details Section */}
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

          {bookingDetails?.pickupLocation && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Pickup Location
              </Text>
              <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                {bookingDetails.pickupLocation}
              </Text>
            </View>
          )}

          {bookingDetails?.destination && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Destination
              </Text>
              <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                {bookingDetails.destination}
              </Text>
            </View>
          )}
        </View>

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* More Info Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeaderTitle, { color: theme.colors.textPrimary }]}>
            More Info
          </Text>
          
          {bookingDetails?.numberOfItems && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Number of Items/Rooms
              </Text>
              <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                {bookingDetails.numberOfItems}
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

  // Render roadside assistance specific content
  const renderRoadsideContent = () => {
    return (
      <>
        {/* Request Details Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeaderTitle, { color: theme.colors.textPrimary }]}>
            Request Details
          </Text>
          
          {bookingDetails?.currentLocation && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Current Location
              </Text>
              <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                {bookingDetails.currentLocation}
              </Text>
            </View>
          )}

          {bookingDetails?.issueType && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Issue Type
              </Text>
              <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                {bookingDetails.issueType}
              </Text>
            </View>
          )}

          {bookingDetails?.vehicleType && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Vehicle Type
              </Text>
              <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                {bookingDetails.vehicleType}
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
    <>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
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
        {(() => {
          if (categoryStr.includes('hire professional drivers') || (categoryStr.includes('drivers') && !categoryStr.includes('road trips'))) {
            return renderDriversContent();
          } else if (categoryStr.includes('road trips')) {
            return renderRoadTripsContent();
          } else if (categoryStr.includes('movers')) {
            return renderMoversContent();
          } else if (categoryStr.includes('roadside')) {
            return renderRoadsideContent();
          } else {
            return renderDefaultContent();
          }
        })()}

        {/* Price Summary - Only show for services that require payment */}
        {(() => {
          const isDriverService = categoryStr.includes('hire professional drivers') || (categoryStr.includes('drivers') && !categoryStr.includes('road trips'));
          const isRoadsideAssistance = categoryStr.includes('roadside');
          if (!isDriverService && !isRoadsideAssistance) {
            return (
              <>
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
              </>
            );
          }
          return null;
        })()}
      </ScrollView>

      {/* Bottom Bar with Button */}
      <View style={[styles.footer, { backgroundColor: theme.colors.white, paddingBottom: Math.max(insets.bottom, 10) }]}>
        <TouchableOpacity
          style={[styles.proceedButton, { backgroundColor: '#FF1577' }]}
          onPress={handleProceedToPayment}
          activeOpacity={0.8}
        >
          <Text style={[styles.proceedButtonText, { color: theme.colors.white }]}>
            {(() => {
              const isDriverService = categoryStr.includes('hire professional drivers') || (categoryStr.includes('drivers') && !categoryStr.includes('road trips'));
              const isRoadsideAssistance = categoryStr.includes('roadside');
              if (isDriverService || isRoadsideAssistance) {
                return 'Send Request';
              }
              return 'Proceed to Payment';
            })()}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Success Modal for Roadside Assistance */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowSuccessModal(false);
          // Reset the HomeStack (current navigator) to only have RenterHome
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'RenterHome' }],
            })
          );
          
          // Then navigate to BookingsTab
          const tabNavigator = navigation.getParent();
          if (tabNavigator) {
            setTimeout(() => {
              tabNavigator.navigate('BookingsTab', {
                screen: 'BookingsList',
              });
            }, 100);
          }
        }}
        statusBarTranslucent={true}
      >
        <View style={styles.successModalOverlay}>
          <View style={[styles.successModalContent, { backgroundColor: theme.colors.white }]}>
            <View style={[styles.successIconCircle, { backgroundColor: '#4CAF50' + '20' }]}>
              <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
            </View>
            <Text style={[styles.successModalTitle, { color: theme.colors.textPrimary }]}>
              Request Sent!
            </Text>
            <Text style={[styles.successModalMessage, { color: theme.colors.textSecondary }]}>
              Your roadside assistance request has been sent successfully. Help is on the way!
            </Text>
            <TouchableOpacity
              style={[styles.successModalButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => {
                setShowSuccessModal(false);
                // Reset the HomeStack (current navigator) to only have RenterHome
                // This clears ServiceBookingConfirmation, ServiceBooking, etc. from the stack
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'RenterHome' }],
                  })
                );
                
                // Then navigate to BookingsTab
                const tabNavigator = navigation.getParent();
                if (tabNavigator) {
                  setTimeout(() => {
                    tabNavigator.navigate('BookingsTab', {
                      screen: 'BookingsList',
                    });
                  }, 100);
                }
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.successModalButtonText, { color: theme.colors.white }]}>
                View Bookings
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Success Modal for Driver Service */}
      <Modal
        visible={showDriverSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowDriverSuccessModal(false);
          // Reset the HomeStack (current navigator) to only have RenterHome
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'RenterHome' }],
            })
          );
          
          // Then navigate to BookingsTab
          const tabNavigator = navigation.getParent();
          if (tabNavigator) {
            setTimeout(() => {
              tabNavigator.navigate('BookingsTab', {
                screen: 'BookingsList',
              });
            }, 100);
          }
        }}
        statusBarTranslucent={true}
      >
        <View style={styles.successModalOverlay}>
          <View style={[styles.successModalContent, { backgroundColor: theme.colors.white }]}>
            <View style={[styles.successIconCircle, { backgroundColor: '#4CAF50' + '20' }]}>
              <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
            </View>
            <Text style={[styles.successModalTitle, { color: theme.colors.textPrimary }]}>
              Request Sent!
            </Text>
            <Text style={[styles.successModalMessage, { color: theme.colors.textSecondary }]}>
              Your driver request has been sent successfully. The service provider will contact you soon.
            </Text>
            <TouchableOpacity
              style={[styles.successModalButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => {
                setShowDriverSuccessModal(false);
                // Reset the HomeStack (current navigator) to only have RenterHome
                // This clears ServiceBookingConfirmation, ServiceBooking, etc. from the stack
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'RenterHome' }],
                  })
                );
                
                // Then navigate to BookingsTab (Past Rentals page)
                const tabNavigator = navigation.getParent();
                if (tabNavigator) {
                  setTimeout(() => {
                    tabNavigator.navigate('BookingsTab', {
                      screen: 'BookingsList',
                    });
                  }, 100);
                }
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.successModalButtonText, { color: theme.colors.white }]}>
                View Bookings
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </View>
    </>
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
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 11,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 3,
  },
  detailValue: {
    fontSize: 15,
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
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  proceedButton: {
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proceedButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  // Success Modal styles
  successModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 20,
  },
  successModalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
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
  },
  successModalButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
});

export default ServiceBookingConfirmationScreen;
