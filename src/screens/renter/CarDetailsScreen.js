import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
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

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Fixed Image Carousel */}
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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

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
    width: SCREEN_WIDTH,
    height: 250,
    position: 'relative',
    paddingHorizontal: 24,
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
});

export default CarDetailsScreen;
