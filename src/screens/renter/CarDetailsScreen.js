import React, { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Alert, Modal, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Toggle } from '../../packages/components';
import { WebView } from 'react-native-webview';
import { formatPricePerDay, formatCurrency } from '../../packages/utils/currency';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getCarImages, getCarVideoUrl } from '../../packages/utils/supabaseImages';

// Car images now loaded from Supabase

// Import profile image
const profileImage = require('../../../assets/logo/profile.jpg');

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CarDetailsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
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
    imageUri: getCarPrimaryImage('x'),
    description: 'A reliable and fuel-efficient sedan perfect for city driving and road trips. This well-maintained Toyota Corolla offers comfort, safety, and excellent value for your rental needs.',
    rating: 4.8,
    tag: 'Fuel Efficient',
    reviewCount: 53,
    location: 'Nairobi, Kenya',
  };

  // Car images for carousel - use Supabase images if available, otherwise fallback to local images
  const { carImages, carImageUris } = useMemo(() => {
    let images = [];
    let imageUris = [];
    
    if (carData.imageKey) {
      // Get images from Supabase using the imageKey (e.g., 'porsche', 'pickup', 'rolls', 'x')
      const supabaseImages = getCarImages(carData.imageKey);
      imageUris = supabaseImages; // Keep as strings for ImageRepository
      images = supabaseImages.map(uri => ({ uri })); // Convert to format React Native Image expects
    } else if (carData.images && Array.isArray(carData.images)) {
      // Use provided images array (already from Supabase)
      imageUris = carData.images; // Keep as strings
      images = carData.images.map(uri => ({ uri }));
    } else {
      // Fallback to Supabase images (use x car as default)
      const fallbackImages = getCarImages('x');
      images = fallbackImages.map(uri => ({ uri }));
      imageUris = fallbackImages; // For Supabase images, pass as-is
    }
    
    return { carImages: images, carImageUris: imageUris };
  }, [carData.imageKey, carData.images]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMoreRules, setShowMoreRules] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(new Set());
  const [previousImageIndex, setPreviousImageIndex] = useState(null);
  const fadeAnimCurrent = useRef(new Animated.Value(1)).current;
  const fadeAnimPrevious = useRef(new Animated.Value(0)).current;

  // Video URL from Supabase - use from car data if available, otherwise default
  const carVideoUrl = carData.videoUrl || getCarVideoUrl();

  // Preload all carousel images in the background for smooth transitions
  useEffect(() => {
    const preloadImages = async () => {
      const loadedSet = new Set();
      
      // Preload all images in parallel
      const preloadPromises = carImages.map(async (imageSource, index) => {
        try {
          if (imageSource.uri) {
            await Image.prefetch(imageSource.uri);
            loadedSet.add(index);
          }
        } catch (error) {
          console.warn(`Failed to preload image ${index}:`, error);
        }
      });

      await Promise.all(preloadPromises);
      setImagesLoaded(loadedSet);
    };

    if (carImages.length > 0) {
      // Reset loaded images when car changes
      setImagesLoaded(new Set());
      // Start preloading immediately
      preloadImages();
    }
  }, [carImages]);

  // HTML for video player
  const videoHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: 100%; height: 100%; overflow: hidden; background: #000; }
        video { 
          width: 100%; 
          height: 100%; 
          object-fit: cover;
        }
      </style>
    </head>
    <body>
      <video 
        src="${carVideoUrl}" 
        controls 
        autoplay 
        loop 
        playsinline
        style="width: 100%; height: 100%; object-fit: cover;"
      ></video>
    </body>
    </html>
  `;

  // Initialize fade animation on mount
  useEffect(() => {
    // Set initial state - current image visible, no previous image
    fadeAnimCurrent.setValue(1);
    fadeAnimPrevious.setValue(0);
  }, []);

  // Smooth cross-fade image transition effect
  useEffect(() => {
    if (previousImageIndex !== currentImageIndex && previousImageIndex !== null) {
      // Reset previous image opacity to 1 and current to 0
      fadeAnimPrevious.setValue(1);
      fadeAnimCurrent.setValue(0);
      
      // Cross-fade: fade out previous, fade in current simultaneously
      Animated.parallel([
        Animated.timing(fadeAnimPrevious, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnimCurrent, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Update previous index after animation completes
        setPreviousImageIndex(currentImageIndex);
      });
    } else if (previousImageIndex === null) {
      // First load - just set the previous index without animation
      setPreviousImageIndex(currentImageIndex);
    }
  }, [currentImageIndex, previousImageIndex, fadeAnimCurrent, fadeAnimPrevious]);

  // Auto-swap images every 3 seconds (only when showing images)
  useEffect(() => {
    if (!showVideo && carImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % carImages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [carImages.length, showVideo]);


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

  const handleReserveCar = () => {
    navigation.navigate('Booking', { 
      car: carData,
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
    phone: '+254 712 345 678',
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
        {/* Image Carousel / Video Player */}
        <View style={styles.carouselContainer}>
          {showVideo ? (
            <View style={styles.videoWrapper}>
              <WebView
                source={{ html: videoHTML }}
                style={styles.videoPlayer}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                allowsInlineMediaPlayback={true}
                mediaPlaybackRequiresUserAction={false}
                originWhitelist={['*']}
                mixedContentMode="always"
                scrollEnabled={false}
                onError={(syntheticEvent) => {
                  const { nativeEvent } = syntheticEvent;
                  console.warn('Video WebView error: ', nativeEvent);
                }}
                onHttpError={(syntheticEvent) => {
                  const { nativeEvent } = syntheticEvent;
                  console.warn('Video WebView HTTP error: ', nativeEvent);
                }}
              />
            </View>
          ) : (
            <View style={styles.carouselImageWrapper}>
              {/* Previous image - fades out */}
              {previousImageIndex !== null && previousImageIndex !== currentImageIndex && (
                <Animated.View style={[styles.carouselImageContainer, { opacity: fadeAnimPrevious }]}>
                  <Image
                    source={carImages[previousImageIndex]}
                    style={styles.carouselImage}
                    resizeMode="cover"
                  />
                </Animated.View>
              )}
              
              {/* Current image - fades in */}
              <Animated.View style={[styles.carouselImageContainer, { opacity: fadeAnimCurrent }]}>
                <Image
                  source={carImages[currentImageIndex]}
                  style={styles.carouselImage}
                  resizeMode="cover"
                  onLoad={() => {
                    // Image loaded, ensure it's visible
                    const newLoaded = new Set(imagesLoaded);
                    newLoaded.add(currentImageIndex);
                    setImagesLoaded(newLoaded);
                    
                    // Ensure image is visible if it just loaded
                    if (!imagesLoaded.has(currentImageIndex)) {
                      fadeAnimCurrent.setValue(1);
                    }
                  }}
                />
              </Animated.View>
              
              {/* Pre-render next images for instant transition */}
              {carImages.length > 1 && (
                <View style={styles.hiddenImageContainer}>
                  {carImages.map((_, index) => (
                    <Image
                      key={index}
                      source={carImages[index]}
                      style={styles.carouselImage}
                      resizeMode="cover"
                    />
                  ))}
                </View>
              )}
            </View>
          )}
          
          {/* Floating Action Buttons */}
          <View style={[styles.floatingButtons, { paddingTop: insets.top + 8 }]}>
            <TouchableOpacity
              style={styles.floatingButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
            </TouchableOpacity>
            
            <View style={styles.rightButtons}>
              {/* Toggle Video/Images Button */}
              <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => {
                  setShowVideo(!showVideo);
                }}
                activeOpacity={0.8}
              >
                <Ionicons 
                  name={showVideo ? "images-outline" : "videocam-outline"} 
                  size={20} 
                  color={theme.colors.textPrimary} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => setIsLiked(!isLiked)}
                activeOpacity={0.8}
              >
                <Ionicons 
                  name={isLiked ? "heart" : "heart-outline"} 
                  size={20} 
                  color={isLiked ? "#FF3B30" : theme.colors.textPrimary} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => {
                  Alert.alert('Share', 'Share this car listing with your friends!');
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="share-outline" size={20} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
          
          {!showVideo && carImages.length > 1 && (
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
          
          {/* Video indicator label */}
          {showVideo && (
            <View style={styles.videoIndicator}>
              <View style={styles.videoLabel}>
                <Ionicons name="videocam" size={14} color={theme.colors.white} />
                <Text style={styles.videoLabelText}>Video</Text>
              </View>
            </View>
          )}
        </View>

        {/* Content Container with Curved Top */}
        <View style={[styles.contentContainer, { backgroundColor: theme.colors.background }]}>
        {/* Car Details & Description - Airbnb Style */}
        <View style={styles.section}>
          <View style={styles.carOverviewCard}>
            {/* Title Row */}
            <View style={styles.titleRow}>
              <View style={styles.titleContainer}>
                <Text style={[styles.carName, { color: theme.colors.textPrimary }]}>
                  {carData.name}
                </Text>
                {carData.tag && (
                  <View style={styles.tagBadge}>
                    <Text style={styles.tagBadgeText}>{carData.tag}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Location and Type */}
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color={theme.colors.hint} />
              <Text style={[styles.locationText, { color: theme.colors.textSecondary }]}>
                {carData.location || 'Nairobi, Kenya'}
              </Text>
            </View>

            {/* Key Specs - Clean Format with Icons */}
            <View style={styles.specsRow}>
              <View style={styles.specItem}>
                <Ionicons name="people-outline" size={14} color={theme.colors.hint} />
                <Text style={[styles.specsText, { color: theme.colors.textSecondary }]}>
                  {carData.seats} seats
                </Text>
              </View>
              <Text style={[styles.specsSeparator, { color: theme.colors.hint }]}>·</Text>
              <View style={styles.specItem}>
                <Ionicons name="car-outline" size={14} color={theme.colors.hint} />
                <Text style={[styles.specsText, { color: theme.colors.textSecondary }]}>
                  {carData.fuel}
                </Text>
              </View>
              <Text style={[styles.specsSeparator, { color: theme.colors.hint }]}>·</Text>
              <View style={styles.specItem}>
                <Ionicons 
                  name={carData.transmission === 'Automatic' ? 'speedometer-outline' : 'git-branch-outline'} 
                  size={14} 
                  color={theme.colors.hint} 
                />
                <Text style={[styles.specsText, { color: theme.colors.textSecondary }]}>
                  {carData.transmission || 'Automatic'}
                </Text>
              </View>
              <Text style={[styles.specsSeparator, { color: theme.colors.hint }]}>·</Text>
              <View style={styles.specItem}>
                <Ionicons name="color-fill-outline" size={14} color={theme.colors.hint} />
                <Text style={[styles.specsText, { color: theme.colors.textSecondary }]}>
                  {carData.color}
                </Text>
              </View>
            </View>

            {/* Rating and Reviews */}
            <View style={styles.ratingRow}>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#000000" />
                <Text style={[styles.ratingText, { color: theme.colors.textPrimary }]}>
                  {carData.rating || 4.8}
                </Text>
                <View style={styles.starsContainer}>
                  {[...Array(5)].map((_, i) => (
                    <Ionicons
                      key={i}
                      name={i < Math.floor(carData.rating || 4.8) ? 'star' : 'star-outline'}
                      size={14}
                      color="#000000"
                      style={styles.starIcon}
                    />
                  ))}
                </View>
              </View>
              {carData.reviewCount && (
                <Text style={[styles.reviewCountText, { color: theme.colors.textSecondary }]}>
                  {carData.reviewCount} Reviews
                </Text>
              )}
            </View>

            {/* Description */}
            <Text style={[styles.carDescription, { color: theme.colors.textSecondary }]}>
              {carData.description || 'A reliable and well-maintained vehicle perfect for your travel needs.'}
            </Text>
          </View>
        </View>

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Check-in Options Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Check-in Options
          </Text>
          <View style={styles.checkInCard}>
            <View style={[styles.checkInOption, { backgroundColor: theme.colors.white }]}>
              <Text style={[styles.checkInTitle, { color: theme.colors.textPrimary }]}>
                Self Check-in
              </Text>
              <Text style={[styles.checkInDescription, { color: theme.colors.textSecondary }]}>
                Get the key from the secure key box and locate your car independently
              </Text>
            </View>
            <View style={[styles.checkInOption, { backgroundColor: theme.colors.white }]}>
              <Text style={[styles.checkInTitle, { color: theme.colors.textPrimary }]}>
                Assisted Check-in
              </Text>
              <Text style={[styles.checkInDescription, { color: theme.colors.textSecondary }]}>
                Meet the owner for a guided walkthrough and car inspection
              </Text>
            </View>
            <Text style={[styles.checkInNote, { color: theme.colors.hint }]}>
              You can select your preferred option during booking
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
                images: carImageUris.length > 0 ? carImageUris : carImages,
                title: `${carData.name} - Images`,
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

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Rental Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Rental Information
          </Text>
          <View style={styles.infoCard}>
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
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Pickup Location
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
                {rentalInfo.pickupLocation}
              </Text>
            </View>
          </View>
        </View>

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Car Availability Section */}
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

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Map Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Pickup Location
          </Text>
          <TouchableOpacity
            style={styles.mapContainer}
            onPress={() => setIsMapFullscreen(true)}
            activeOpacity={0.9}
          >
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
            <View style={styles.expandMapButton}>
              <Ionicons name="expand-outline" size={20} color={theme.colors.textPrimary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Meet Car Owner Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Meet Your Host
          </Text>
          <View style={styles.hostCard}>
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

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Why Choose This Car Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Why Choose This Car
          </Text>
          <View style={styles.whyChooseCard}>
            <View style={styles.whyChooseItem}>
              <View style={[styles.whyChooseNumberBadge, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.whyChooseNumber}>1</Text>
              </View>
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
              <View style={[styles.whyChooseNumberBadge, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.whyChooseNumber}>2</Text>
              </View>
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
              <View style={[styles.whyChooseNumberBadge, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.whyChooseNumber}>3</Text>
              </View>
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
              <View style={[styles.whyChooseNumberBadge, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.whyChooseNumber}>4</Text>
              </View>
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

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Opa Guarantees Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Opa Guarantees
          </Text>
          <View style={styles.guaranteesCard}>
            <View style={styles.guaranteeItem}>
              <View style={[styles.guaranteeBadge, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.guaranteeLabel}>A</Text>
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
              <View style={[styles.guaranteeBadge, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.guaranteeLabel}>B</Text>
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
              <View style={[styles.guaranteeBadge, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.guaranteeLabel}>C</Text>
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
              <View style={[styles.guaranteeBadge, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.guaranteeLabel}>D</Text>
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

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Car Rules Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Car Rules
          </Text>
          <View style={styles.rulesCard}>
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

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Safety Section */}
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
                This listing has been verified and meets our safety standards.
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Dispute', { 
                  car: carData,
                });
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

        {/* Separator Line */}
        <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

        {/* Reviews Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Reviews
          </Text>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.reviewsContainer}
          style={styles.reviewsScrollView}
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


        {/* Bottom spacing for fixed bar */}
        <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.colors.white }]}>
        <View style={styles.priceContainer}>
          <Text style={[styles.priceLabel, { color: theme.colors.hint }]}>Price per day</Text>
          <Text style={[styles.priceValue, { color: theme.colors.primary }]}>
            {rentalInfo.perDay}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.reserveButton, { backgroundColor: '#FF1577' }]}
          onPress={handleReserveCar}
          activeOpacity={0.8}
        >
          <Text style={[styles.reserveButtonText, { color: theme.colors.white }]}>
            Reserve Car
          </Text>
        </TouchableOpacity>
      </View>

      {/* Fullscreen Map Modal */}
      <Modal
        visible={isMapFullscreen}
        animationType="fade"
        transparent={false}
        onRequestClose={() => setIsMapFullscreen(false)}
      >
        <View style={styles.fullscreenMapContainer}>
          <WebView
            source={{ html: mapboxHTML }}
            style={styles.fullscreenMap}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
            scrollEnabled={true}
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
          <TouchableOpacity
            style={[styles.closeMapButton, { top: insets.top + 16 }]}
            onPress={() => setIsMapFullscreen(false)}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </Modal>
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
  contentContainer: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: -12,
    paddingTop: 20,
  },
  carouselContainer: {
    width: SCREEN_WIDTH,
    height: 300,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImageWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  carouselImageContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  hiddenImageContainer: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
    overflow: 'hidden',
  },
  videoWrapper: {
    width: '100%',
    height: '100%',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
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
  rightButtons: {
    flexDirection: 'row',
    gap: 12,
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
  videoIndicator: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  videoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  videoLabelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
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
  carOverviewCard: {
    padding: 0,
    gap: 12,
  },
  titleRow: {
    marginBottom: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  carName: {
    fontSize: 22,
    fontFamily: 'Nunito_700Bold',
    letterSpacing: -0.3,
    flex: 1,
    minWidth: '60%',
  },
  tagBadge: {
    backgroundColor: '#000000',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagBadgeText: {
    fontSize: 11,
    fontFamily: 'Nunito_700Bold',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  specsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 6,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  specsText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  specsSeparator: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    marginHorizontal: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginRight: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  starIcon: {
    marginHorizontal: 0,
  },
  reviewCountText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    textDecorationLine: 'underline',
  },
  carDescription: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 22,
    marginTop: 8,
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
    position: 'relative',
  },
  map: {
    width: '100%',
    height: 200,
    backgroundColor: 'transparent',
  },
  expandMapButton: {
    position: 'absolute',
    top: 12,
    right: 12,
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
    zIndex: 10,
  },
  fullscreenMapContainer: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#000',
  },
  fullscreenMap: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  closeMapButton: {
    position: 'absolute',
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
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
    borderRadius: 20,
    minWidth: 140,
  },
  reserveButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    textAlign: 'center',
  },
  // Host section styles
  hostCard: {
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
    padding: 20,
    gap: 16,
  },
  safetyContent: {
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
  reviewsScrollView: {
    marginTop: -8,
  },
  reviewsContainer: {
    paddingLeft: 24,
    paddingRight: 24,
    gap: 12,
  },
  reviewCard: {
    width: 270,
    borderRadius: 16,
    padding: 20,
    marginRight: 12,
    gap: 14,
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
    padding: 24,
    gap: 24,
  },
  whyChooseItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  whyChooseNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  whyChooseNumber: {
    fontSize: 15,
    fontFamily: 'Nunito_700Bold',
    color: '#FFFFFF',
  },
  whyChooseContent: {
    flex: 1,
    gap: 6,
  },
  whyChooseTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  whyChooseDescription: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  // Opa Guarantees section styles
  guaranteesCard: {
    padding: 24,
    gap: 24,
  },
  guaranteeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  guaranteeBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  guaranteeLabel: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    color: '#FFFFFF',
  },
  guaranteeContent: {
    flex: 1,
    gap: 6,
  },
  guaranteeTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  guaranteeDescription: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  // Check-in Options styles
  checkInCard: {
    gap: 16,
  },
  checkInOption: {
    padding: 16,
    borderRadius: 12,
    gap: 4,
  },
  checkInTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  checkInDescription: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  checkInNote: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    fontStyle: 'italic',
    marginTop: 4,
  },
});

export default CarDetailsScreen;
