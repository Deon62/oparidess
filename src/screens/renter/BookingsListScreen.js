import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Button } from '../../packages/components';
import { useBookings } from '../../packages/context/BookingsContext';

const BookingsListScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { bookings: contextBookings } = useBookings();
  // Only car bookings - no driver/chauffeur functionality
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [ratingText, setRatingText] = useState('');
  const [ratedBookings, setRatedBookings] = useState(new Set()); // Track which bookings have been rated
  const [showMore, setShowMore] = useState(false); // Track if past rentals are expanded

  // Bookings data - populated from context
  const carBookings = contextBookings || [];

  const bookings = carBookings;
  
  // Separate active and past bookings (exclude cancelled)
  const activeBookings = bookings.filter(booking => booking.status === 'active');
  const pastBookings = bookings.filter(booking => booking.status !== 'active' && booking.status !== 'cancelled');
  
  // Sort past bookings by status priority: pending > completed
  const statusPriority = {
    'pending': 1,
    'completed': 2,
  };
  
  const sortedPastBookings = [...pastBookings].sort((a, b) => {
    return (statusPriority[a.status] || 99) - (statusPriority[b.status] || 99);
  });
  
  // Display bookings: active first, then past bookings if showMore is true
  const displayedBookings = showMore 
    ? [...activeBookings, ...sortedPastBookings]
    : activeBookings;

  // Set custom header with notifications and status bar
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <View style={[styles.customHeader, { backgroundColor: theme.colors.white, paddingTop: insets.top }]}>
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
              Past rentals
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('SettingsTab', { screen: 'Notifications' });
              }}
              style={styles.iconButton}
              activeOpacity={0.7}
            >
              <View style={styles.notificationIconContainer}>
                <Ionicons name="notifications-outline" size={24} color={theme.colors.textPrimary} />
                <View style={styles.notificationDot} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      ),
    });
  }, [navigation, theme, insets.top]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#FFA500';
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

  const handleRateBooking = (booking) => {
    setSelectedBooking(booking);
    setRating(0);
    setRatingText('');
    setShowRatingModal(true);
  };

  const handleSubmitRating = () => {
    if (rating === 0) {
      // You could show an alert here
      return;
    }
    
    // Mark booking as rated
    if (selectedBooking) {
      const ratingKey = `car-${selectedBooking.id}`;
      setRatedBookings(prev => new Set(prev).add(ratingKey));
    }
    
    // TODO: Submit rating to backend
    console.log('Rating submitted:', {
      bookingId: selectedBooking?.id,
      rating,
      text: ratingText,
      type: 'car',
    });
    
    // Close modal
    setShowRatingModal(false);
    setSelectedBooking(null);
    setRating(0);
    setRatingText('');
  };

  const handleCloseRatingModal = () => {
    setShowRatingModal(false);
    setSelectedBooking(null);
    setRating(0);
    setRatingText('');
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            activeOpacity={0.7}
            style={styles.starButton}
          >
            <Ionicons
              name={star <= rating ? 'star' : 'star-outline'}
              size={40}
              color={star <= rating ? '#FFA500' : theme.colors.hint}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >

      {/* Bookings List */}
      <View style={styles.bookingsList}>
        {displayedBookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color={theme.colors.hint} />
            <Text style={[styles.emptyStateTitle, { color: theme.colors.textPrimary }]}>
              No rentals yet
            </Text>
            <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
              Your bookings will appear here once you complete a rental
            </Text>
          </View>
        ) : (
          <>
            {displayedBookings.map((booking) => (
            <TouchableOpacity
              key={booking.id}
              onPress={() => {
                if (booking.status === 'active') {
                  // Navigate to booking details screen
                  // Extract days from duration string (e.g., "5 days" -> 5)
                  const extractDays = (duration) => {
                    if (booking.days) return booking.days;
                    const match = duration?.match(/(\d+)/);
                    return match ? parseInt(match[1]) : 1;
                  };

                  const bookingDetails = {
                    car: {
                      name: booking.carName,
                      ownerId: booking.ownerId || '1',
                      ownerName: booking.ownerName || 'Car Owner',
                      ownerAvatar: booking.ownerAvatar || null,
                    },
                    pickupDate: booking.pickupDate || booking.date,
                    dropoffDate: booking.dropoffDate || booking.date,
                    days: extractDays(booking.duration),
                    pickupLocation: booking.pickupLocation || 'Nairobi, Kenya',
                    dropoffLocation: booking.dropoffLocation || 'Nairobi, Kenya',
                  };
                  
                  navigation.navigate('BookingTracking', {
                    bookingDetails,
                    paymentMethod: booking.paymentMethod || 'mpesa',
                    totalPrice: parseFloat(booking.price.replace(/[^\d.]/g, '')) || 0,
                  });
                } else if (booking.status === 'pending') {
                  // Navigate to pending rental details screen
                  navigation.navigate('PendingRentalDetails', {
                    booking: {
                      ...booking,
                      bookingId: booking.id,
                    },
                  });
                } else if (booking.status === 'completed') {
                  // Navigate to past rental details screen
                  navigation.navigate('PastRentalDetails', {
                    booking: {
                      ...booking,
                      bookingId: booking.id,
                    },
                  });
                }
              }}
              activeOpacity={1}
              disabled={booking.status !== 'active' && booking.status !== 'completed' && booking.status !== 'pending'}
            >
              <View style={[styles.bookingCard, { backgroundColor: theme.colors.background }]}>
                {booking.image && (
                  <View style={styles.bookingImageContainer}>
                    <Image source={booking.image} style={styles.bookingImage} resizeMode="cover" />
                  </View>
                )}
                <View style={styles.bookingContent}>
                  <Text style={[styles.bookingTitle, { color: theme.colors.textPrimary }]} numberOfLines={1}>
                    {booking.carName}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            ))}
            
            {/* Show More/Less Link */}
            {pastBookings.length > 0 && (
              <TouchableOpacity
                onPress={() => setShowMore(!showMore)}
                style={styles.showMoreContainer}
                activeOpacity={0.7}
              >
                <Text style={[styles.showMoreText, { color: theme.colors.primary }]}>
                  {showMore ? 'Show less' : 'Show more'}
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      {/* Rating Modal */}
      <Modal
        visible={showRatingModal}
        transparent
        animationType="fade"
        onRequestClose={handleCloseRatingModal}
      >
        <View style={styles.ratingModalOverlay}>
          <View style={[styles.ratingModalContent, { backgroundColor: theme.colors.white }]}>
            <View style={styles.ratingModalHeader}>
              <Text style={[styles.ratingModalTitle, { color: theme.colors.textPrimary }]}>
                Rate Your Experience
              </Text>
              <Text style={[styles.ratingModalSubtitle, { color: theme.colors.textSecondary }]}>
                {selectedBooking && (
                  selectedBooking.carName
                )}
              </Text>
            </View>

            {/* Star Rating */}
            <View style={styles.ratingSection}>
              <Text style={[styles.ratingLabel, { color: theme.colors.textPrimary }]}>
                How would you rate this car?
              </Text>
              {renderStars()}
            </View>

            {/* Optional Text Input */}
            <View style={styles.textInputSection}>
              <Text style={[styles.textInputLabel, { color: theme.colors.textPrimary }]}>
                Share your experience (optional)
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: theme.colors.background,
                    color: theme.colors.textPrimary,
                    borderColor: theme.colors.hint + '40',
                  },
                ]}
                placeholder="Write a review..."
                placeholderTextColor={theme.colors.hint}
                value={ratingText}
                onChangeText={setRatingText}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.ratingModalButtons}>
              <TouchableOpacity
                style={[
                  styles.ratingModalButton,
                  styles.ratingModalButtonCancel,
                  { borderColor: theme.colors.hint },
                ]}
                onPress={handleCloseRatingModal}
                activeOpacity={0.7}
              >
                <Text style={[styles.ratingModalButtonText, { color: theme.colors.textSecondary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.ratingModalButton,
                  styles.ratingModalButtonSubmit,
                  { 
                    backgroundColor: rating > 0 ? theme.colors.primary : theme.colors.hint,
                    opacity: rating > 0 ? 1 : 0.5,
                  },
                ]}
                onPress={handleSubmitRating}
                activeOpacity={0.7}
                disabled={rating === 0}
              >
                <Text style={[styles.ratingModalButtonText, { color: theme.colors.white }]}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  customHeader: {
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_600SemiBold',
    flex: 1,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingRight: 8,
  },
  iconButton: {
    padding: 8,
  },
  typeToggleContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 3,
    gap: 3,
  },
  typeToggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 7,
    gap: 6,
  },
  typeToggleButtonActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  typeToggleText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  bookingsList: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 16,
  },
  bookingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  bookingImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginRight: 16,
  },
  bookingImage: {
    width: '100%',
    height: '100%',
  },
  bookingContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingTitle: {
    fontSize: 17,
    fontFamily: 'Nunito_600SemiBold',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
  },
  // Rating Modal Styles
  ratingModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  ratingModalContent: {
    width: '85%',
    borderRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  ratingModalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  ratingModalTitle: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  ratingModalSubtitle: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    textAlign: 'center',
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  ratingLabel: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 16,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  starButton: {
    padding: 4,
  },
  textInputSection: {
    marginBottom: 24,
  },
  textInputLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    minHeight: 100,
  },
  ratingModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  ratingModalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingModalButtonCancel: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  ratingModalButtonSubmit: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  ratingModalButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_600SemiBold',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  notificationIconContainer: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF1577',
  },
  showMoreContainer: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  showMoreText: {
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold',
  },
});

export default BookingsListScreen;

