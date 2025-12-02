import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWishlist } from '../../packages/context/WishlistContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ServiceDetailsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { service, category } = route.params || {};
  const { toggleServiceLike, likedServices } = useWishlist();

  // Default service data if not provided
  const serviceData = service || {
    id: 1,
    name: 'Safari Adventures Kenya',
    price: 'KSh 15,000/day',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    rating: 4.8,
    location: 'Nairobi',
    description: 'Experience the best road trips across Kenya with our professional tour guides. We offer customized safari adventures, coastal road trips, and mountain expeditions.',
    category: 'Road Trips Agencies',
  };

  // Service provider info
  const providerInfo = {
    name: serviceData.providerName || 'John Kamau',
    photo: serviceData.providerPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    rating: serviceData.rating || 4.8,
    servicesCount: serviceData.servicesCount || 47,
    responseTime: serviceData.responseTime || '15 minutes',
    verified: {
      id: true,
      phone: true,
    },
    description: serviceData.providerDescription || 'Experienced service provider with years of expertise. Committed to delivering quality services and excellent customer satisfaction.',
  };

  // Service availability
  const availability = {
    nextAvailable: serviceData.nextAvailable || new Date(Date.now() + 86400000).toISOString().split('T')[0],
    availableDays: serviceData.availableDays || 'All week days',
    responseTime: serviceData.responseTime || 'Within 24 hours',
  };

  // Reviews
  const reviews = serviceData.reviews || [
    {
      id: 1,
      reviewerName: 'Sarah M.',
      reviewerPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Excellent service! Very professional and responsive. Highly recommend!',
    },
    {
      id: 2,
      reviewerName: 'James K.',
      reviewerPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      rating: 5,
      date: '1 month ago',
      comment: 'Great experience! The service was exactly as described. Will definitely use again.',
    },
    {
      id: 3,
      reviewerName: 'Mary W.',
      reviewerPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      rating: 4,
      date: '2 months ago',
      comment: 'Good service overall. Provider was professional and quick to respond.',
    },
  ];

  // Why choose this service
  const whyChoose = [
    'Verified and trusted service provider',
    'Quick response time',
    'Competitive pricing',
    'Quality guaranteed',
    '24/7 customer support',
    'Flexible scheduling',
  ];

  // Safety features
  const safetyFeatures = [
    'Verified provider credentials',
    'Secure payment processing',
    'Insurance coverage',
    'Background checked',
  ];

  const getServiceId = () => {
    const categoryMap = {
      'Road Trips Agencies': 'roadtrips',
      'VIP Wedding Fleet Hire': 'vipwedding',
      'Hire Professional Drivers': 'drivers',
      'Movers': 'movers',
      'Automobile Parts Shop': 'autoparts',
      'VIP Car Detailing': 'cardetailing',
      'Roadside Assistance': 'roadside',
    };
    const categoryKey = categoryMap[serviceData.category] || 'roadtrips';
    return `${categoryKey}-${serviceData.id}`;
  };

  const serviceId = getServiceId();
  const isLiked = likedServices.has(serviceId);

  // Hide bottom tab bar and header on this screen
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

  const handleBookService = () => {
    navigation.navigate('ServiceBooking', {
      service: serviceData,
      category: category || serviceData.category,
    });
  };

  const handleShare = async () => {
    try {
      const message = `Check out ${serviceData.name} on Oparides!\n\n${serviceData.description || 'Professional service provider offering quality services.'}\n\nPrice: ${serviceData.price}\nLocation: ${serviceData.location}\nRating: ${serviceData.rating} ⭐`;
      const result = await Share.share({
        message: message,
        title: `Share ${serviceData.name}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share service. Please try again.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Service Image Container - Full Width at Top */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: serviceData.image }}
            style={styles.serviceImage}
            resizeMode="cover"
          />
          
          {/* Floating Action Buttons */}
          <View style={[styles.floatingButtons, { paddingTop: insets.top + 8 }]}>
            <TouchableOpacity
              style={styles.floatingButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
            </TouchableOpacity>
            
            <View style={styles.floatingButtonsRight}>
              <TouchableOpacity
                style={styles.floatingButton}
                onPress={handleShare}
                activeOpacity={0.8}
              >
                <Ionicons name="share-outline" size={20} color={theme.colors.textPrimary} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => toggleServiceLike(serviceId)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isLiked ? "heart" : "heart-outline"}
                  size={20}
                  color={isLiked ? "#FF3B30" : theme.colors.textPrimary}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Content Container with Curved Top */}
        <View style={[styles.contentContainer, { backgroundColor: theme.colors.background }]}>
        {/* Service Overview */}
        <View style={styles.serviceOverviewSection}>
          <Text style={[styles.serviceName, { color: theme.colors.textPrimary }]}>
            {serviceData.name}
          </Text>
          <View style={[styles.serviceSpecs, { marginTop: 12 }]}>
            <View style={styles.specItem}>
              <Ionicons name="star" size={18} color="#FFB800" />
              <Text style={[styles.specText, { color: theme.colors.textSecondary }]}>
                {serviceData.rating} Rating
              </Text>
            </View>
            <View style={styles.specItem}>
              <Ionicons name="location-outline" size={18} color={theme.colors.hint} />
              <Text style={[styles.specText, { color: theme.colors.textSecondary }]}>
                {serviceData.location}
              </Text>
            </View>
            <View style={styles.specItem}>
              <Ionicons name="business-outline" size={18} color={theme.colors.hint} />
              <Text style={[styles.specText, { color: theme.colors.textSecondary }]}>
                {serviceData.category}
              </Text>
            </View>
          </View>
          <Text style={[styles.serviceDescription, { color: theme.colors.textSecondary }]}>
            {serviceData.description || 'Professional service provider offering quality services with years of experience. Contact us for more details.'}
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
              const serviceImages = serviceData.image ? [{ uri: serviceData.image }] : [];
              navigation.navigate('ImageRepository', {
                images: serviceImages,
                title: `${serviceData.name} - Images`,
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

        {/* Price Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Pricing Information
          </Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Service Price
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
                {serviceData.price || 'KSh 0'}
              </Text>
            </View>
            {serviceData.pricePerHour && (
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                  Per Hour
                </Text>
                <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
                  {serviceData.pricePerHour}
                </Text>
              </View>
            )}
            {serviceData.pricePerEvent && (
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                  Per Event
                </Text>
                <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
                  {serviceData.pricePerEvent}
                </Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Location
              </Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={18} color={theme.colors.primary} />
                <Text style={[styles.locationValue, { color: theme.colors.textPrimary }]}>
                  {serviceData.location}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Availability */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Availability
          </Text>
          <View style={styles.availabilityCard}>
            <View style={styles.availabilityRow}>
              <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
              <View style={styles.availabilityInfo}>
                <Text style={[styles.availabilityLabel, { color: theme.colors.textSecondary }]}>
                  Next Available
                </Text>
                <Text style={[styles.availabilityValue, { color: theme.colors.textPrimary }]}>
                  {new Date(availability.nextAvailable).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric' 
                  })}
                </Text>
              </View>
            </View>
            <View style={styles.availabilityRow}>
              <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
              <View style={styles.availabilityInfo}>
                <Text style={[styles.availabilityLabel, { color: theme.colors.textSecondary }]}>
                  Response Time
                </Text>
                <Text style={[styles.availabilityValue, { color: theme.colors.textPrimary }]}>
                  {availability.responseTime}
                </Text>
              </View>
            </View>
            <View style={styles.availabilityRow}>
              <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
              <View style={styles.availabilityInfo}>
                <Text style={[styles.availabilityLabel, { color: theme.colors.textSecondary }]}>
                  Available Days
                </Text>
                <Text style={[styles.availabilityValue, { color: theme.colors.textPrimary }]}>
                  {availability.availableDays}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* About Service Provider */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            About Service Provider
          </Text>
          <View style={styles.providerCard}>
            <View style={styles.providerHeader}>
              <Image
                source={{ uri: providerInfo.photo }}
                style={styles.providerPhoto}
                resizeMode="cover"
              />
              <View style={styles.providerDetails}>
                <Text style={[styles.providerName, { color: theme.colors.textPrimary }]}>
                  {providerInfo.name}
                </Text>
                <View style={styles.providerRatingRow}>
                  <Ionicons name="star" size={16} color="#FFB800" />
                  <Text style={[styles.providerRating, { color: theme.colors.textSecondary }]}>
                    {providerInfo.rating}
                  </Text>
                  <Text style={[styles.providerServicesCount, { color: theme.colors.textSecondary }]}>
                    • {providerInfo.servicesCount} services
                  </Text>
                </View>
                <View style={styles.providerVerified}>
                  {providerInfo.verified.id && (
                    <View style={styles.verifiedBadge}>
                      <Ionicons name="checkmark-circle" size={14} color={theme.colors.primary} />
                      <Text style={[styles.verifiedText, { color: theme.colors.textSecondary }]}>
                        ID Verified
                      </Text>
                    </View>
                  )}
                  {providerInfo.verified.phone && (
                    <View style={styles.verifiedBadge}>
                      <Ionicons name="checkmark-circle" size={14} color={theme.colors.primary} />
                      <Text style={[styles.verifiedText, { color: theme.colors.textSecondary }]}>
                        Phone Verified
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
            <Text style={[styles.providerDescription, { color: theme.colors.textSecondary }]}>
              {providerInfo.description}
            </Text>
            <View style={styles.providerResponseTime}>
              <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.providerResponseText, { color: theme.colors.textSecondary }]}>
                Usually responds within {providerInfo.responseTime}
              </Text>
            </View>
          </View>
        </View>

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Why Choose This Service */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Why Choose This Service
          </Text>
          <View style={styles.whyChooseCard}>
            {whyChoose.map((item, index) => (
              <View key={index} style={styles.whyChooseItem}>
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
                <Text style={[styles.whyChooseText, { color: theme.colors.textSecondary }]}>
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Safety */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Safety
          </Text>
          <View style={styles.safetyCard}>
            <View style={styles.safetyContent}>
              <Text style={[styles.safetyTitle, { color: theme.colors.textPrimary }]}>
                Safe & Verified
              </Text>
              <Text style={[styles.safetyDescription, { color: theme.colors.textSecondary }]}>
                This service provider has been verified and meets our safety standards.
              </Text>
            </View>
            <View style={styles.safetyFeaturesList}>
              {safetyFeatures.map((feature, index) => (
                <View key={index} style={styles.safetyFeatureItem}>
                  <Ionicons name="checkmark-circle" size={18} color={theme.colors.primary} />
                  <Text style={[styles.safetyFeatureText, { color: theme.colors.textSecondary }]}>
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Reviews */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Reviews ({reviews.length})
          </Text>
          <View style={styles.reviewsCard}>
            {reviews.map((review, index) => (
              <View 
                key={review.id} 
                style={[
                  styles.reviewItem,
                  index === reviews.length - 1 && styles.reviewItemLast
                ]}
              >
                <View style={styles.reviewHeader}>
                  <Image
                    source={{ uri: review.reviewerPhoto }}
                    style={styles.reviewerPhoto}
                    resizeMode="cover"
                  />
                  <View style={styles.reviewerInfo}>
                    <Text style={[styles.reviewerName, { color: theme.colors.textPrimary }]}>
                      {review.reviewerName}
                    </Text>
                    <View style={styles.reviewRating}>
                      {[...Array(5)].map((_, i) => (
                        <Ionicons
                          key={i}
                          name={i < review.rating ? "star" : "star-outline"}
                          size={14}
                          color="#FFB800"
                        />
                      ))}
                    </View>
                  </View>
                  <Text style={[styles.reviewDate, { color: theme.colors.hint }]}>
                    {review.date}
                  </Text>
                </View>
                <Text style={[styles.reviewComment, { color: theme.colors.textSecondary }]}>
                  {review.comment}
                </Text>
              </View>
            ))}
          </View>
        </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.colors.white, paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.priceContainer}>
          <Text style={[styles.priceLabel, { color: theme.colors.hint }]}>Price</Text>
          <Text style={[styles.priceValue, { color: theme.colors.primary }]}>
            {serviceData.price || 'KSh 0'}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.reserveButton, { backgroundColor: '#FF1577' }]}
          onPress={handleBookService}
          activeOpacity={0.8}
        >
          <Text style={[styles.reserveButtonText, { color: theme.colors.white }]}>
            Book Service
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
  imageContainer: {
    width: SCREEN_WIDTH,
    height: 300,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButtons: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  floatingButtonsRight: {
    flexDirection: 'row',
    gap: 8,
  },
  floatingButton: {
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
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  serviceImage: {
    width: '100%',
    height: '100%',
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  serviceOverviewSection: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  sectionSeparator: {
    borderTopWidth: 1,
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 8,
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
  serviceName: {
    fontSize: 28,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 0,
    letterSpacing: -0.5,
  },
  serviceSpecs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  specText: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
  },
  serviceDescription: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 22,
    marginTop: 4,
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
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  locationValue: {
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold',
  },
  availabilityCard: {
    padding: 20,
    gap: 16,
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  availabilityInfo: {
    flex: 1,
  },
  availabilityLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 4,
  },
  availabilityValue: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  providerCard: {
    padding: 24,
    gap: 18,
  },
  providerHeader: {
    flexDirection: 'row',
    gap: 16,
  },
  providerPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  providerDetails: {
    flex: 1,
  },
  providerName: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 8,
  },
  providerRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  providerRating: {
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold',
  },
  providerServicesCount: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
  },
  providerVerified: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: 13,
    fontFamily: 'Nunito_400Regular',
  },
  providerDescription: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 22,
    marginTop: 8,
  },
  providerResponseTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  providerResponseText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  whyChooseCard: {
    padding: 20,
    gap: 16,
  },
  whyChooseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  whyChooseText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 22,
  },
  safetyCard: {
    padding: 20,
    gap: 16,
  },
  safetyContent: {
    flex: 1,
  },
  safetyTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  safetyDescription: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 22,
  },
  safetyFeaturesList: {
    marginTop: 8,
    gap: 12,
  },
  safetyFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  safetyFeatureText: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
  },
  reviewsCard: {
    padding: 20,
    gap: 20,
  },
  reviewItem: {
    gap: 12,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reviewerPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewDate: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  reviewComment: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 22,
    marginTop: 4,
  },
  reviewItemLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 16,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
  },
  reserveButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 20,
  },
  reserveButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
});

export default ServiceDetailsScreen;

