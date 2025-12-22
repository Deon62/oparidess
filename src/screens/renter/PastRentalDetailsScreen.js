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
// Car images now loaded from Supabase
import { getCarImages } from '../../packages/utils/supabaseImages';

const PastRentalDetailsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { booking } = route.params || {};

  // Car images for repository (up to 4) - use Supabase images
  const defaultImages = getCarImages(booking?.imageKey || 'x');
  const carImages = booking?.images || defaultImages;
  const previewImages = Array.isArray(carImages) ? carImages.slice(0, 4) : [];

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

  const renderInfoRow = ({ icon, label, value, valueStyle }) => {
    if (!value) return null;

    return (
      <View style={styles.infoRow}>
        <View style={styles.infoRowLeft}>
          <View style={styles.infoRowIconWrap}>
            <Ionicons name={icon} size={18} color={theme.colors.hint} />
          </View>
          <Text style={[styles.infoLabel, styles.infoRowLabel, { color: theme.colors.textSecondary }]}>
            {label}
          </Text>
        </View>
        <Text style={[styles.infoValue, styles.infoRowValue, { color: theme.colors.textPrimary }, valueStyle]}>
          {value}
        </Text>
      </View>
    );
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
      <TouchableOpacity
        style={[styles.floatingBackButton, { top: insets.top + 10, backgroundColor: theme.colors.white }]}
        onPress={() => navigation.goBack()}
        activeOpacity={0.85}
      >
        <Ionicons name="arrow-back" size={22} color={theme.colors.textPrimary} />
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 60 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Car Summary Card */}
        <View style={styles.carSummaryCard}>
          <View style={styles.carImageWrapper}>
            {previewImages.length > 0 ? (
              <Image
                source={{ uri: previewImages[0] }}
                style={styles.carCircularImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.carCircularImage, { backgroundColor: theme.colors.hint + '30' }]}>
                <Ionicons name="car" size={40} color={theme.colors.hint} />
              </View>
            )}
          </View>
          <View style={styles.carSummaryInfo}>
            <Text style={[styles.carSummaryName, { color: theme.colors.textPrimary }]}>
              {booking.carName}
            </Text>
            <View style={styles.carSummarySpecs}>
              {booking.seats && (
                <Text style={[styles.carSummarySpec, { color: theme.colors.textSecondary }]}>
                  {booking.seats} Seats
                </Text>
              )}
              {booking.seats && booking.fuel && (
                <Text style={[styles.carSummaryDot, { color: theme.colors.hint }]}>•</Text>
              )}
              {booking.fuel && (
                <Text style={[styles.carSummarySpec, { color: theme.colors.textSecondary }]}>
                  {booking.fuel}
                </Text>
              )}
            </View>
            <Text style={[styles.carSummaryPrice, { color: theme.colors.textPrimary }]}>
              {booking.price || 'KSh 0'}
            </Text>
          </View>
        </View>

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Booking Details */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Booking Details
          </Text>
          <View style={styles.detailsGrid}>
            {renderInfoRow({
              icon: 'calendar-outline',
              label: 'Pickup',
              value: formatDate(booking.pickupDate || booking.date),
            })}
            {renderInfoRow({
              icon: 'calendar-outline',
              label: 'Dropoff',
              value: formatDate(booking.dropoffDate || booking.date),
            })}
            {renderInfoRow({
              icon: 'timer-outline',
              label: 'Duration',
              value: booking.duration || `${booking.days || 1} day${(booking.days || 1) > 1 ? 's' : ''}`,
            })}
            {renderInfoRow({
              icon: 'location-outline',
              label: 'Location',
              value: booking.pickupLocation,
            })}
          </View>
        </View>

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Payment Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Payment
          </Text>
          <View style={styles.detailsGrid}>
            {renderInfoRow({
              icon: 'card-outline',
              label: 'Method',
              value: booking.paymentMethod
                ? booking.paymentMethod === 'mpesa'
                  ? 'M-PESA'
                  : booking.paymentMethod === 'airtel'
                    ? 'Airtel Money'
                    : booking.paymentMethod === 'card'
                      ? 'Card'
                      : booking.paymentMethod
                : 'N/A',
            })}
            {renderInfoRow({
              icon: 'barcode-outline',
              label: 'Booking ID',
              value: booking.bookingId,
            })}
          </View>
        </View>

        {/* Rated confirmation */}
        {isRated && (
          <>
            <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />
            <View style={styles.section}>
              <View style={[styles.ratedCard, { backgroundColor: theme.colors.hint + '20' }]}>
                <Ionicons name="checkmark-circle" size={24} color={theme.colors.textPrimary} />
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

      <View style={[styles.bottomActionBar, { backgroundColor: theme.colors.background, paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={[
            styles.bottomActionButton,
            styles.bottomActionButtonSecondary,
            { borderColor: theme.colors.hint + '50' },
            isRated ? { opacity: 0.6 } : null,
          ]}
          onPress={() => {
            if (!isRated) handleRateBooking();
          }}
          activeOpacity={0.8}
          disabled={isRated}
        >
          <Text style={[styles.bottomActionButtonText, { color: theme.colors.textPrimary }]}>
            {isRated ? 'Rated' : 'Rate'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bottomActionButton, { backgroundColor: '#FF1577' }]}
          onPress={() => navigation.navigate('ReturnVerification', { booking })}
          activeOpacity={0.8}
        >
          <Text style={[styles.bottomActionButtonText, { color: theme.colors.white }]}>
            Verify condition
          </Text>
        </TouchableOpacity>
      </View>

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
                style={[styles.ratingModalButton, styles.ratingModalButtonSubmit, { backgroundColor: '#FF1577' }]}
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
    paddingBottom: 140,
  },
  heroImageWrap: {
    width: '100%',
    height: 280,
    backgroundColor: '#F2F2F2',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroImagePlaceholder: {
    flex: 1,
    backgroundColor: '#F2F2F2',
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
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  carSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 16,
  },
  carImageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: '#F2F2F2',
  },
  carCircularImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carSummaryInfo: {
    flex: 1,
    gap: 4,
  },
  carSummaryName: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    letterSpacing: -0.3,
  },
  carSummarySpecs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  carSummarySpec: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  carSummaryDot: {
    fontSize: 14,
  },
  carSummaryPrice: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginTop: 4,
  },
  detailsGrid: {
    gap: 14,
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
    paddingVertical: 8,
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  infoRowIconWrap: {
    width: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoRowLabel: {
    flexShrink: 1,
  },
  infoRowValue: {
    flexShrink: 1,
    textAlign: 'right',
    maxWidth: '55%',
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
  floatingBackButton: {
    position: 'absolute',
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  bottomActionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  bottomActionButton: {
    flex: 1,
    height: 52,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  bottomActionButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  bottomActionButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
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

