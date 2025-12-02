import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Card, Button } from '../../packages/components';
import { formatCurrency } from '../../packages/utils/currency';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Import profile image for host
const profileImage = require('../../../assets/logo/profile.jpg');
// Import car images
const carImage1 = require('../../../assets/images/car1.webp');
const carImage2 = require('../../../assets/images/car2.webp');
const carImage3 = require('../../../assets/images/car3.webp');
const carImage4 = require('../../../assets/images/car4.webp');

const PastRentalDetailsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { booking } = route.params || {};

  // Car images for repository (up to 4)
  const carImages = [
    booking?.image || carImage1,
    carImage2,
    carImage3,
    carImage4,
  ].slice(0, 4);

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingText, setRatingText] = useState('');
  const [isRated, setIsRated] = useState(false);

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
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleRateBooking = () => {
    setShowRatingModal(true);
  };

  const handleSubmitRating = () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    // Here you would typically submit the rating to your backend
    Alert.alert('Success', 'Thank you for your rating!', [
      {
        text: 'OK',
        onPress: () => {
          setIsRated(true);
          setShowRatingModal(false);
          setRating(0);
          setRatingText('');
        },
      },
    ]);
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

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.white, paddingTop: insets.top }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
          Rental Details
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
            <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
            <Text style={[styles.statusText, { color: theme.colors.textPrimary }]}>
              Rental Completed
            </Text>
          </View>
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
        {(booking.pickupLocation || booking.dropoffLocation) && (
          <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />
        )}

        {/* Locations */}
        {(booking.pickupLocation || booking.dropoffLocation) && (
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
        )}

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Payment Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Payment Information
          </Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Total Paid
              </Text>
              <Text style={[styles.totalPrice, { color: theme.colors.primary }]}>
                {booking.price || 'KSh 0'}
              </Text>
            </View>
            {booking.paymentMethod && (
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                  Payment Method
                </Text>
                <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
                  {booking.paymentMethod === 'mpesa' ? 'M-PESA' : booking.paymentMethod === 'airtel' ? 'Airtel Money' : booking.paymentMethod === 'card' ? 'Card' : booking.paymentMethod}
                </Text>
              </View>
            )}
            {booking.bookingId && (
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                  Booking ID
                </Text>
                <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
                  {booking.bookingId}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Separator Line */}
        {!isRated && (
          <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />
        )}

        {/* Rate Button */}
        {!isRated && (
          <View style={styles.section}>
            <TouchableOpacity
              style={[styles.rateButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleRateBooking}
              activeOpacity={0.8}
            >
              <Ionicons name="star-outline" size={24} color={theme.colors.white} />
              <Text style={[styles.rateButtonText, { color: theme.colors.white }]}>
                Rate Your Experience
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {isRated && (
          <>
            <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />
            <View style={styles.section}>
              <View style={[styles.ratedCard, { backgroundColor: theme.colors.hint + '30' }]}>
                <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                <Text style={[styles.ratedText, { color: theme.colors.textSecondary }]}>
                  Thank you for your rating!
                </Text>
              </View>
            </View>
          </>
        )}

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Rating Modal */}
      <Modal
        visible={showRatingModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRatingModal(false)}
      >
        <View style={styles.ratingModalOverlay}>
          <View style={[styles.ratingModalContent, { backgroundColor: theme.colors.white }]}>
            <View style={styles.ratingModalHeader}>
              <Text style={[styles.ratingModalTitle, { color: theme.colors.textPrimary }]}>
                Rate Your Experience
              </Text>
              <Text style={[styles.ratingModalSubtitle, { color: theme.colors.textSecondary }]}>
                How would you rate this rental?
              </Text>
            </View>

            <View style={styles.ratingSection}>
              <Text style={[styles.ratingLabel, { color: theme.colors.textPrimary }]}>
                Your Rating
              </Text>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRating(star)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={star <= rating ? 'star' : 'star-outline'}
                      size={40}
                      color={star <= rating ? '#FFB800' : theme.colors.hint}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.commentSection}>
              <Text style={[styles.commentLabel, { color: theme.colors.textPrimary }]}>
                Your Review (Optional)
              </Text>
              <TextInput
                style={[styles.commentInput, { 
                  backgroundColor: theme.colors.background, 
                  color: theme.colors.textPrimary,
                  borderColor: theme.colors.hint,
                }]}
                placeholder="Share your experience..."
                placeholderTextColor={theme.colors.hint}
                value={ratingText}
                onChangeText={setRatingText}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.ratingModalButtons}>
              <TouchableOpacity
                style={[styles.ratingModalButton, styles.ratingModalButtonCancel, { borderColor: theme.colors.hint }]}
                onPress={() => {
                  setShowRatingModal(false);
                  setRating(0);
                  setRatingText('');
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.ratingModalButtonText, { color: theme.colors.textSecondary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.ratingModalButton, styles.ratingModalButtonSubmit, { backgroundColor: theme.colors.primary }]}
                onPress={handleSubmitRating}
                activeOpacity={0.7}
              >
                <Text style={[styles.ratingModalButtonText, { color: theme.colors.white }]}>
                  Submit
                </Text>
              </TouchableOpacity>
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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 18,
    fontFamily: 'Nunito_600SemiBold',
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
  rateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 12,
  },
  rateButtonText: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  ratedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  ratedText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
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
    fontFamily: 'Nunito_400Regular',
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
  },
  commentSection: {
    marginBottom: 24,
  },
  commentLabel: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 12,
  },
  commentInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
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
    // backgroundColor is set inline
  },
  ratingModalButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
});

export default PastRentalDetailsScreen;

