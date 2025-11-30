import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Toggle } from '../../packages/components';
import { WebView } from 'react-native-webview';
import { formatPricePerDay, formatCurrency } from '../../packages/utils/currency';

// Import car images
const carImage1 = require('../../../assets/images/car1.jpg');
const carImage2 = require('../../../assets/images/car2.jpg');
const carImage3 = require('../../../assets/images/car3.jpg');
const carImage4 = require('../../../assets/images/car4.jpg');

// Import profile image
const profileImage = require('../../../assets/logo/profile.jpg');

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CarDetailsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { car } = route.params || {};
  
  // Default car data if not provided
  const carData = car || {
    id: 1,
    name: 'Toyota Corolla',
    price: 'KSh 4,500/day',
    seats: 5,
    fuel: 'Petrol',
    color: 'White',
    transmission: 'Automatic', // 'Automatic' or 'Manual'
    image: carImage1,
    description: 'A reliable and fuel-efficient sedan perfect for city driving and road trips. This well-maintained Toyota Corolla offers comfort, safety, and excellent value for your rental needs.',
  };

  // Car images for carousel (up to 4)
  const carImages = [
    carData.image || carImage1,
    carImage2,
    carImage3,
    carImage4,
  ].slice(0, 4);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [insuranceEnabled, setInsuranceEnabled] = useState(false);
  const [showMoreRules, setShowMoreRules] = useState(false);

  // Auto-swap images every 3 seconds
  useEffect(() => {
    if (carImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % carImages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [carImages.length]);

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

  const handleReserveCar = () => {
    navigation.navigate('Booking', { 
      car: carData,
      insuranceEnabled,
    });
  };

  // Rental info
  const rentalInfo = {
    perDay: 'KSh 4,500',
    perWeek: 'KSh 28,000',
    perMonth: 'KSh 110,000',
    deposit: 'KSh 20,000',
    minimumDays: 3,
    pickupLocation: 'Nairobi CBD, Kenya',
    pickupCoordinates: { latitude: -1.2921, longitude: 36.8219 }, // Nairobi CBD coordinates
  };

  // Mapbox HTML with GL JS
  const mapboxHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <script src='https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js'></script>
      <link href='https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css' rel='stylesheet' />
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: 100%; height: 100%; overflow: hidden; }
        #map { width: 100%; height: 100%; position: absolute; top: 0; left: 0; }
      </style>
    </head>
    <body>
      <div id='map'></div>
      <script>
        try {
          mapboxgl.accessToken = 'pk.eyJ1IjoiZGVvbmNoaW5lc2UiLCJhIjoiY21odG82dHVuMDQ1eTJpc2RmdDdlZWZ3NiJ9.W0Nbf6fypzPbXgnMcOcoTA';
          const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [${rentalInfo.pickupCoordinates.longitude}, ${rentalInfo.pickupCoordinates.latitude}],
            zoom: 14,
            interactive: true,
            attributionControl: false
          });
          
          map.on('load', function() {
            new mapboxgl.Marker({ color: '#0A1D37' })
              .setLngLat([${rentalInfo.pickupCoordinates.longitude}, ${rentalInfo.pickupCoordinates.latitude}])
              .addTo(map);
          });
          
          map.on('error', function(e) {
            console.error('Mapbox error:', e);
          });
        } catch (error) {
          console.error('Error initializing map:', error);
          document.getElementById('map').innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666;">Map loading error</div>';
        }
      </script>
    </body>
    </html>
  `;

  // Features
  const features = [
    'Air Conditioning',
    'Bluetooth',
    'GPS Navigation',
    'Backup Camera',
    'USB Charging',
    'Leather Seats',
  ];

  // Host information
  const hostInfo = {
    name: 'John Kamau',
    photo: profileImage,
    rating: 4.8,
    tripsCount: 47,
    responseTime: '15 minutes',
    verified: {
      id: true,
      phone: true,
    },
    description: 'Car enthusiast who maintains my vehicles perfectly. I ensure all cars are in excellent condition for your comfort and safety.',
  };

  // Car availability
  const availability = {
    nextAvailable: '2024-01-20',
    availableDaysType: 'All week days', // 'All week days', 'Only weekends', 'Monday to Friday'
    minRentalDays: 3,
    maxRentalDays: 30,
  };

  // Car rules
  const allRules = [
    'No smoking inside the vehicle',
    'Pets are not allowed',
    'The car must be returned with the same fuel level as when picked up',
    'No off-road driving unless the vehicle is specifically designed for it',
    'Driver must be at least 25 years old with a valid driving license',
    'The car should not be used for commercial purposes',
    'All traffic violations are the renter\'s responsibility',
    'Car must be returned on time, late returns incur additional charges',
  ];
  const displayedRules = showMoreRules ? allRules : allRules.slice(0, 3);

  // Reviews
  const reviews = [
    {
      id: 1,
      reviewerName: 'Sarah M.',
      reviewerPhoto: profileImage,
      rating: 5,
      date: '2 weeks ago',
      comment: 'Excellent car in perfect condition! John was very responsive and helpful throughout the trip. Highly recommend!',
    },
    {
      id: 2,
      reviewerName: 'James K.',
      reviewerPhoto: profileImage,
      rating: 5,
      date: '1 month ago',
      comment: 'Great experience! The car was clean, well-maintained, and exactly as described. Will definitely rent again.',
    },
    {
      id: 3,
      reviewerName: 'Mary W.',
      reviewerPhoto: profileImage,
      rating: 4,
      date: '2 months ago',
      comment: 'Good car for city driving. Owner was professional and quick to respond. Minor issue with AC but overall satisfied.',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Carousel */}
        <View style={styles.carouselContainer}>
          <View style={styles.carouselImageWrapper}>
            <Image
              source={carImages[currentImageIndex]}
              style={styles.carouselImage}
              resizeMode="cover"
            />
          </View>
          {carImages.length > 1 && (
            <View style={styles.carouselIndicators}>
              {carImages.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    {
                      backgroundColor: index === currentImageIndex 
                        ? theme.colors.white 
                        : theme.colors.white + '80',
                    },
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        {/* Car Details */}
        <View style={styles.section}>
          <Text style={[styles.carName, { color: theme.colors.textPrimary }]}>
            {carData.name}
          </Text>
          <View style={styles.carSpecs}>
            <View style={styles.specItem}>
              <Ionicons name="people-outline" size={18} color={theme.colors.hint} />
              <Text style={[styles.specText, { color: theme.colors.textSecondary }]}>
                {carData.seats} Seats
              </Text>
            </View>
            <View style={styles.specItem}>
              <Ionicons name="car-outline" size={18} color={theme.colors.hint} />
              <Text style={[styles.specText, { color: theme.colors.textSecondary }]}>
                {carData.fuel}
              </Text>
            </View>
            <View style={styles.specItem}>
              <Ionicons 
                name={carData.transmission === 'Automatic' ? 'speedometer-outline' : 'git-branch-outline'} 
                size={18} 
                color={theme.colors.hint} 
              />
              <Text style={[styles.specText, { color: theme.colors.textSecondary }]}>
                {carData.transmission || 'Automatic'}
              </Text>
            </View>
            <View style={styles.specItem}>
              <Ionicons name="color-fill-outline" size={18} color={theme.colors.hint} />
              <Text style={[styles.specText, { color: theme.colors.textSecondary }]}>
                {carData.color}
              </Text>
            </View>
          </View>
        </View>

        {/* Car Description */}
        <View style={styles.section}>
          <Text style={[styles.carDescription, { color: theme.colors.textSecondary }]}>
            {carData.description || 'A reliable and well-maintained vehicle perfect for your travel needs.'}
          </Text>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Features
          </Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
                <Text style={[styles.featureText, { color: theme.colors.textSecondary }]}>
                  {feature}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Rental Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Rental Information
          </Text>
          <View style={[styles.infoCard, { backgroundColor: theme.colors.white }]}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Per Day
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
                {rentalInfo.perDay}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Per Week
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
                {rentalInfo.perWeek}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Per Month
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
                {rentalInfo.perMonth}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Deposit
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
                {rentalInfo.deposit}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Minimum Rental Days
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
                {rentalInfo.minimumDays} days
              </Text>
            </View>
            <View style={styles.locationContainer}>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={18} color={theme.colors.primary} />
                <Text style={[styles.locationLabel, { color: theme.colors.textSecondary }]}>
                  Pickup
                </Text>
                <Text style={[styles.pickupLocation, { color: theme.colors.textPrimary }]}>
                  {rentalInfo.pickupLocation}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Car Availability Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Availability
          </Text>
          <View style={[styles.availabilityCard, { backgroundColor: theme.colors.white }]}>
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
                  Rental Period
                </Text>
                <Text style={[styles.availabilityValue, { color: theme.colors.textPrimary }]}>
                  {availability.minRentalDays} - {availability.maxRentalDays} days
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
                  {availability.availableDaysType}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Map Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Pickup Location
          </Text>
          <View style={styles.mapContainer}>
            <WebView
              source={{ html: mapboxHTML }}
              style={styles.map}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              scalesPageToFit={true}
              scrollEnabled={false}
              zoomEnabled={true}
              originWhitelist={['*']}
              mixedContentMode="always"
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn('WebView error: ', nativeEvent);
              }}
              onHttpError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn('WebView HTTP error: ', nativeEvent);
              }}
              onLoadEnd={() => {
                console.log('WebView loaded successfully');
              }}
            />
          </View>
        </View>

        {/* Meet Car Owner Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Meet Your Host
          </Text>
          <View style={[styles.hostCard, { backgroundColor: theme.colors.white }]}>
            <View style={styles.hostHeader}>
              <Image source={hostInfo.photo} style={styles.hostPhoto} resizeMode="cover" />
              <View style={styles.hostInfo}>
                <Text style={[styles.hostName, { color: theme.colors.textPrimary }]}>
                  {hostInfo.name}
                </Text>
                <View style={styles.hostRatingRow}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={[styles.hostRating, { color: theme.colors.textPrimary }]}>
                    {hostInfo.rating}
                  </Text>
                  <Text style={[styles.hostTrips, { color: theme.colors.textSecondary }]}>
                    ({hostInfo.tripsCount} trips)
                  </Text>
                </View>
                <View style={styles.hostResponseTime}>
                  <Ionicons name="time-outline" size={14} color={theme.colors.hint} />
                  <Text style={[styles.responseTimeText, { color: theme.colors.textSecondary }]}>
                    Usually responds in {hostInfo.responseTime}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.verificationBadges}>
              {hostInfo.verified.id && (
                <View style={[styles.badge, { backgroundColor: theme.colors.primary + '15' }]}>
                  <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary} />
                  <Text style={[styles.badgeText, { color: theme.colors.primary }]}>
                    ID Verified
                  </Text>
                </View>
              )}
              {hostInfo.verified.phone && (
                <View style={[styles.badge, { backgroundColor: theme.colors.primary + '15' }]}>
                  <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary} />
                  <Text style={[styles.badgeText, { color: theme.colors.primary }]}>
                    Phone Verified
                  </Text>
                </View>
              )}
            </View>
            {hostInfo.description && (
              <Text style={[styles.hostDescription, { color: theme.colors.textSecondary }]}>
                {hostInfo.description}
              </Text>
            )}
          </View>
        </View>

        {/* Why Choose This Car Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Why Choose This Car
          </Text>
          <View style={[styles.whyChooseCard, { backgroundColor: theme.colors.white }]}>
            <View style={styles.whyChooseItem}>
              <Ionicons name="shield-checkmark" size={24} color={theme.colors.primary} />
              <View style={styles.whyChooseContent}>
                <Text style={[styles.whyChooseTitle, { color: theme.colors.textPrimary }]}>
                  Well Maintained
                </Text>
                <Text style={[styles.whyChooseDescription, { color: theme.colors.textSecondary }]}>
                  Regularly serviced and kept in excellent condition
                </Text>
              </View>
            </View>
            <View style={styles.whyChooseItem}>
              <Ionicons name="star" size={24} color={theme.colors.primary} />
              <View style={styles.whyChooseContent}>
                <Text style={[styles.whyChooseTitle, { color: theme.colors.textPrimary }]}>
                  Highly Rated
                </Text>
                <Text style={[styles.whyChooseDescription, { color: theme.colors.textSecondary }]}>
                  Consistently receives 5-star reviews from renters
                </Text>
              </View>
            </View>
            <View style={styles.whyChooseItem}>
              <Ionicons name="location" size={24} color={theme.colors.primary} />
              <View style={styles.whyChooseContent}>
                <Text style={[styles.whyChooseTitle, { color: theme.colors.textPrimary }]}>
                  Convenient Location
                </Text>
                <Text style={[styles.whyChooseDescription, { color: theme.colors.textSecondary }]}>
                  Easy pickup and drop-off in central location
                </Text>
              </View>
            </View>
            <View style={styles.whyChooseItem}>
              <Ionicons name="flash" size={24} color={theme.colors.primary} />
              <View style={styles.whyChooseContent}>
                <Text style={[styles.whyChooseTitle, { color: theme.colors.textPrimary }]}>
                  Fuel Efficient
                </Text>
                <Text style={[styles.whyChooseDescription, { color: theme.colors.textSecondary }]}>
                  Saves you money on fuel during your trip
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Opa Guarantees Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Opa Guarantees
          </Text>
          <View style={[styles.guaranteesCard, { backgroundColor: theme.colors.white }]}>
            <View style={styles.guaranteeItem}>
              <View style={[styles.guaranteeIconContainer, { backgroundColor: theme.colors.primary + '15' }]}>
                <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.guaranteeContent}>
                <Text style={[styles.guaranteeTitle, { color: theme.colors.textPrimary }]}>
                  Verified Vehicles
                </Text>
                <Text style={[styles.guaranteeDescription, { color: theme.colors.textSecondary }]}>
                  All vehicles are verified and meet our quality standards
                </Text>
              </View>
            </View>
            <View style={styles.guaranteeItem}>
              <View style={[styles.guaranteeIconContainer, { backgroundColor: theme.colors.primary + '15' }]}>
                <Ionicons name="lock-closed" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.guaranteeContent}>
                <Text style={[styles.guaranteeTitle, { color: theme.colors.textPrimary }]}>
                  Secure Booking
                </Text>
                <Text style={[styles.guaranteeDescription, { color: theme.colors.textSecondary }]}>
                  Your booking is protected with secure payment processing
                </Text>
              </View>
            </View>
            <View style={styles.guaranteeItem}>
              <View style={[styles.guaranteeIconContainer, { backgroundColor: theme.colors.primary + '15' }]}>
                <Ionicons name="headset" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.guaranteeContent}>
                <Text style={[styles.guaranteeTitle, { color: theme.colors.textPrimary }]}>
                  24/7 Support
                </Text>
                <Text style={[styles.guaranteeDescription, { color: theme.colors.textSecondary }]}>
                  Round-the-clock customer support for your peace of mind
                </Text>
              </View>
            </View>
            <View style={styles.guaranteeItem}>
              <View style={[styles.guaranteeIconContainer, { backgroundColor: theme.colors.primary + '15' }]}>
                <Ionicons name="refresh" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.guaranteeContent}>
                <Text style={[styles.guaranteeTitle, { color: theme.colors.textPrimary }]}>
                  Easy Cancellation
                </Text>
                <Text style={[styles.guaranteeDescription, { color: theme.colors.textSecondary }]}>
                  Flexible cancellation policy for your convenience
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Car Rules Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Car Rules
          </Text>
          <View style={[styles.rulesCard, { backgroundColor: theme.colors.white }]}>
            {displayedRules.map((rule, index) => (
              <View key={index} style={styles.ruleItem}>
                <Ionicons name="remove-circle-outline" size={20} color={theme.colors.hint} />
                <Text style={[styles.ruleText, { color: theme.colors.textSecondary }]}>
                  {rule}
                </Text>
              </View>
            ))}
            {allRules.length > 3 && (
              <TouchableOpacity
                onPress={() => setShowMoreRules(!showMoreRules)}
                style={styles.showMoreButton}
                activeOpacity={0.7}
              >
                <Text style={[styles.showMoreText, { color: theme.colors.primary }]}>
                  {showMoreRules ? 'Show Less' : 'Show More'}
                </Text>
                <Ionicons 
                  name={showMoreRules ? 'chevron-up' : 'chevron-down'} 
                  size={18} 
                  color={theme.colors.primary} 
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Safety Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Safety
          </Text>
          <View style={[styles.safetyCard, { backgroundColor: theme.colors.white }]}>
            <View style={styles.safetyInfo}>
              <Ionicons name="shield-checkmark-outline" size={24} color={theme.colors.primary} />
              <View style={styles.safetyContent}>
                <Text style={[styles.safetyTitle, { color: theme.colors.textPrimary }]}>
                  Safe & Verified
                </Text>
                <Text style={[styles.safetyDescription, { color: theme.colors.textSecondary }]}>
                  This listing has been verified and meets our safety standards.
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                Alert.alert('Report Listing', 'If you believe this listing violates our community guidelines, please report it. Our team will review it promptly.');
              }}
              style={styles.reportButton}
              activeOpacity={0.7}
            >
              <Text style={[styles.reportButtonText, { color: theme.colors.hint }]}>
                Report this listing
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Reviews Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Reviews
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.reviewsContainer}
          >
            {reviews.map((review) => (
              <View key={review.id} style={[styles.reviewCard, { backgroundColor: theme.colors.white }]}>
                <View style={styles.reviewHeader}>
                  <Image source={review.reviewerPhoto} style={styles.reviewerPhoto} resizeMode="cover" />
                  <View style={styles.reviewerInfo}>
                    <Text style={[styles.reviewerName, { color: theme.colors.textPrimary }]}>
                      {review.reviewerName}
                    </Text>
                    <View style={styles.reviewRating}>
                      {[...Array(5)].map((_, i) => (
                        <Ionicons
                          key={i}
                          name={i < review.rating ? 'star' : 'star-outline'}
                          size={14}
                          color="#FFD700"
                        />
                      ))}
                    </View>
                    <Text style={[styles.reviewDate, { color: theme.colors.textSecondary }]}>
                      {review.date}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.reviewComment, { color: theme.colors.textSecondary }]}>
                  {review.comment}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>


        {/* Insurance Toggle */}
        <View style={styles.section}>
          <View style={[styles.insuranceCard, { backgroundColor: theme.colors.white }]}>
            <View style={styles.insuranceInfo}>
              <Text style={[styles.insuranceTitle, { color: theme.colors.textPrimary }]}>
                Additional Insurance
              </Text>
              <Text style={[styles.insuranceDescription, { color: theme.colors.textSecondary }]}>
                Add comprehensive insurance coverage for extra protection (+KSh 1,500/day)
              </Text>
            </View>
            <Toggle
              value={insuranceEnabled}
              onValueChange={setInsuranceEnabled}
            />
          </View>
        </View>

        {/* Bottom spacing for fixed bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.colors.white }]}>
        <View style={styles.priceContainer}>
          <Text style={[styles.priceLabel, { color: theme.colors.hint }]}>Price per day</Text>
          <Text style={[styles.priceValue, { color: theme.colors.primary }]}>
            {rentalInfo.perDay}
            {insuranceEnabled && (
              <Text style={[styles.insurancePrice, { color: theme.colors.textSecondary }]}>
                {' '}+ KSh 1,500
              </Text>
            )}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.reserveButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleReserveCar}
          activeOpacity={0.8}
        >
          <Text style={[styles.reserveButtonText, { color: theme.colors.white }]}>
            Reserve Car
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
  scrollContent: {
    paddingBottom: 20,
  },
  carouselContainer: {
    width: '100%',
    height: 250,
    position: 'relative',
    paddingHorizontal: 24,
    paddingTop: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImageWrapper: {
    width: '100%',
    height: '100%',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  carouselIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  carName: {
    fontSize: 28,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  carDescription: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 22,
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
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  infoCard: {
    borderRadius: 16,
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
  locationContainer: {
    marginTop: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  locationLabel: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
  },
  pickupLocation: {
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold',
  },
  mapContainer: {
    height: 200,
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#E0E0E0',
  },
  map: {
    width: '100%',
    height: 200,
    backgroundColor: 'transparent',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '48%',
  },
  featureText: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    flex: 1,
  },
  insuranceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    padding: 20,
  },
  insuranceInfo: {
    flex: 1,
    marginRight: 16,
  },
  insuranceTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 6,
  },
  insuranceDescription: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
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
  insurancePrice: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
  },
  reserveButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 140,
  },
  reserveButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    textAlign: 'center',
  },
  // Host section styles
  hostCard: {
    borderRadius: 16,
    padding: 24,
    gap: 18,
  },
  hostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  hostPhoto: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  hostInfo: {
    flex: 1,
    gap: 4,
  },
  hostName: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  hostRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hostRating: {
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold',
  },
  hostTrips: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  hostResponseTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  responseTimeText: {
    fontSize: 13,
    fontFamily: 'Nunito_400Regular',
  },
  verificationBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
  },
  hostDescription: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
    marginTop: 4,
  },
  // Availability section styles
  availabilityCard: {
    borderRadius: 16,
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
    gap: 4,
  },
  availabilityLabel: {
    fontSize: 13,
    fontFamily: 'Nunito_400Regular',
  },
  availabilityValue: {
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold',
  },
  // Rules section styles
  rulesCard: {
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  ruleText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
    paddingVertical: 8,
  },
  showMoreText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  // Safety section styles
  safetyCard: {
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  safetyInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  safetyContent: {
    flex: 1,
    gap: 4,
  },
  safetyTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  safetyDescription: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  reportButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
  },
  reportButtonText: {
    fontSize: 13,
    fontFamily: 'Nunito_400Regular',
    textDecorationLine: 'underline',
  },
  // Reviews section styles
  reviewsContainer: {
    paddingRight: 24,
    gap: 16,
  },
  reviewCard: {
    width: 320,
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    gap: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  reviewerPhoto: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  reviewerInfo: {
    flex: 1,
    gap: 4,
  },
  reviewerName: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
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
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  // Why Choose This Car section styles
  whyChooseCard: {
    borderRadius: 16,
    padding: 20,
    gap: 20,
  },
  whyChooseItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  whyChooseContent: {
    flex: 1,
    gap: 4,
  },
  whyChooseTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 4,
  },
  whyChooseDescription: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  // Opa Guarantees section styles
  guaranteesCard: {
    borderRadius: 16,
    padding: 20,
    gap: 20,
  },
  guaranteeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  guaranteeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guaranteeContent: {
    flex: 1,
    gap: 4,
  },
  guaranteeTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 4,
  },
  guaranteeDescription: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
});

export default CarDetailsScreen;
