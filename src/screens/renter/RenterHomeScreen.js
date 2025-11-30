import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Animated, Modal, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Card } from '../../packages/components';
import { parseCurrency } from '../../packages/utils/currency';
// Location import - will use expo-location if available
let Location = null;
try {
  Location = require('expo-location');
} catch (e) {
  // expo-location not installed, will show alert
}

// Import profile image
const profileImage = require('../../../assets/logo/profile.jpg');

// Import car images
const carImage1 = require('../../../assets/images/car1.jpg');
const carImage2 = require('../../../assets/images/car2.jpg');
const carImage3 = require('../../../assets/images/car3.jpg');
const carImage4 = require('../../../assets/images/car4.jpg');

// Import commercial vehicle images
const car5 = require('../../../assets/images/car5.png');
const car6 = require('../../../assets/images/car6.png');
const car7 = require('../../../assets/images/car7.png');
const car8 = require('../../../assets/images/car8.png');
const car9 = require('../../../assets/images/car9.png');
const car10 = require('../../../assets/images/car10.png');
const car11 = require('../../../assets/images/car11.png');
const car12 = require('../../../assets/images/car12.png');
const car13 = require('../../../assets/images/car13.png');

// Import service images
const roadtripsImage = require('../../../assets/images/roadtrips.png');
const convoyImage = require('../../../assets/images/convoy.png');
const driverImage = require('../../../assets/images/driver.png');
const moversImage = require('../../../assets/images/movers.png');
const mechanicsImage = require('../../../assets/images/mechanics.png');
const partsImage = require('../../../assets/images/parts.png');
const detailingImage = require('../../../assets/images/detailing.png');
const roadsideImage = require('../../../assets/images/roadside.png');

// Import destination images
const mombasaImage = require('../../../assets/images/mombasa.png');
const nakuruImage = require('../../../assets/images/lNakuru.png');
const egertonImage = require('../../../assets/images/LEgerton.png');
const hellsgateImage = require('../../../assets/images/hellsgate.png');
const pejetaImage = require('../../../assets/images/pejeta.png');
const eventsImage = require('../../../assets/images/events.png');
const events1Image = require('../../../assets/images/events1.png');
const events2Image = require('../../../assets/images/events2.png');
const events3Image = require('../../../assets/images/events3.png');

const RenterHomeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [likedCars, setLikedCars] = useState(new Set());
  const [showNoFeesMessage, setShowNoFeesMessage] = useState(true);
  const fadeAnim = useState(new Animated.Value(1))[0];
  
  // City and location state
  const [selectedCity, setSelectedCity] = useState('Nairobi');
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  
  // Toggle state for Vehicles, Services, and Discover
  const [activeTab, setActiveTab] = useState('cars'); // 'cars', 'services', or 'discover'
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollViewRef = useRef(null);
  
  // Filter state
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 50000 },
    categories: [],
    fuelTypes: [],
    seatCounts: [],
  });
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  
  
  // All 47 Kenyan Counties
  const counties = [
    'Baringo',
    'Bomet',
    'Bungoma',
    'Busia',
    'Elgeyo-Marakwet',
    'Embu',
    'Garissa',
    'Homa Bay',
    'Isiolo',
    'Kajiado',
    'Kakamega',
    'Kericho',
    'Kiambu',
    'Kilifi',
    'Kirinyaga',
    'Kisii',
    'Kisumu',
    'Kitui',
    'Kwale',
    'Laikipia',
    'Lamu',
    'Machakos',
    'Makueni',
    'Mandera',
    'Marsabit',
    'Meru',
    'Migori',
    'Mombasa',
    'Murang\'a',
    'Nairobi',
    'Nakuru',
    'Nandi',
    'Narok',
    'Nyamira',
    'Nyandarua',
    'Nyeri',
    'Samburu',
    'Siaya',
    'Taita-Taveta',
    'Tana River',
    'Tharaka-Nithi',
    'Trans Nzoia',
    'Turkana',
    'Uasin Gishu',
    'Vihiga',
    'Wajir',
    'West Pokot',
  ];

  // Map car images to IDs
  const carImages = {
    1: carImage1,
    2: carImage2,
    3: carImage3,
    4: carImage4,
  };

  const carClasses = [
    {
      id: 'essential',
      name: 'Essential',
      description: 'Affordable and reliable cars for everyday use',
      cars: [
        { id: 1, name: 'Toyota Corolla', price: 'KSh 4,500/day', seats: 5, fuel: 'Petrol', color: 'White', image: carImage1 },
        { id: 2, name: 'Honda Civic', price: 'KSh 4,800/day', seats: 5, fuel: 'Petrol', color: 'Silver', image: carImage2 },
        { id: 3, name: 'Nissan Sentra', price: 'KSh 4,200/day', seats: 5, fuel: 'Petrol', color: 'Black', image: carImage3 },
      ],
    },
    {
      id: 'executive',
      name: 'Executive',
      description: 'Premium comfort and style for business travel',
      cars: [
        { id: 4, name: 'BMW 5 Series', price: 'KSh 12,000/day', seats: 5, fuel: 'Petrol', color: 'Black', image: carImage4 },
        { id: 5, name: 'Mercedes E-Class', price: 'KSh 12,500/day', seats: 5, fuel: 'Petrol', color: 'Silver', image: carImage1 },
        { id: 6, name: 'Audi A6', price: 'KSh 11,800/day', seats: 5, fuel: 'Petrol', color: 'White', image: carImage2 },
      ],
    },
    {
      id: 'signature',
      name: 'Signature',
      description: 'Ultra-luxury vehicles for the ultimate experience',
      cars: [
        { id: 7, name: 'Tesla Model S', price: 'KSh 20,000/day', seats: 5, fuel: 'Electric', color: 'Red', image: carImage3 },
        { id: 8, name: 'Porsche 911', price: 'KSh 35,000/day', seats: 2, fuel: 'Petrol', color: 'Black', image: carImage4 },
        { id: 9, name: 'Bentley Continental', price: 'KSh 45,000/day', seats: 4, fuel: 'Petrol', color: 'White', image: carImage1 },
      ],
    },
  ];

  // Commercial vehicles
  const commercialVehicles = [
    {
      id: 'pickups',
      name: 'Pickups',
      description: 'Rugged and versatile for work and adventure',
      vehicles: [
        { id: 101, name: 'Toyota Hilux', price: 'KSh 8,000/day', seats: 5, fuel: 'Diesel', color: 'White', image: car12 },
        { id: 102, name: 'Ford Ranger', price: 'KSh 8,500/day', seats: 5, fuel: 'Diesel', color: 'Black', image: car5 },
        { id: 103, name: 'Nissan Navara', price: 'KSh 7,500/day', seats: 5, fuel: 'Diesel', color: 'Silver', image: car6 },
      ],
    },
    {
      id: 'vans',
      name: 'Vans',
      description: 'Spacious and practical for groups and cargo',
      vehicles: [
        { id: 201, name: 'Toyota Hiace', price: 'KSh 10,000/day', seats: 14, fuel: 'Diesel', color: 'White', image: car9 },
        { id: 202, name: 'Nissan Urvan', price: 'KSh 9,500/day', seats: 15, fuel: 'Diesel', color: 'White', image: car10 },
        { id: 203, name: 'Mercedes Sprinter', price: 'KSh 12,000/day', seats: 16, fuel: 'Diesel', color: 'White', image: car11 },
      ],
    },
    {
      id: 'trucks',
      name: 'Trucks',
      description: 'Heavy-duty vehicles for commercial transport',
      vehicles: [
        { id: 301, name: 'Isuzu N-Series', price: 'KSh 15,000/day', seats: 3, fuel: 'Diesel', color: 'White', image: car7 },
        { id: 302, name: 'Mitsubishi Fuso', price: 'KSh 16,000/day', seats: 3, fuel: 'Diesel', color: 'White', image: car8 },
        { id: 303, name: 'Hino Truck', price: 'KSh 18,000/day', seats: 3, fuel: 'Diesel', color: 'White', image: car13 },
      ],
    },
  ];

  const toggleLike = (carId) => {
    setLikedCars(prev => {
      const newSet = new Set(prev);
      if (newSet.has(carId)) {
        newSet.delete(carId);
      } else {
        newSet.add(carId);
      }
      return newSet;
    });
  };

  const handleCarPress = (car) => {
    navigation.navigate('CarDetails', { car });
  };

  const handleViewAll = (classId, isCommercial = false) => {
    if (isCommercial) {
      // Navigate to commercial vehicle list
      navigation.navigate('CarList', { categoryId: classId, isCommercial: true });
    } else {
      navigation.navigate('CarList', { classId });
    }
  };

  // Filter cars based on search query
  const filterCarsBySearch = (cars, query) => {
    if (!query.trim()) return cars;
    const lowerQuery = query.toLowerCase().trim();
    return cars.filter(car => 
      car.name.toLowerCase().includes(lowerQuery) ||
      car.color.toLowerCase().includes(lowerQuery) ||
      car.fuel.toLowerCase().includes(lowerQuery)
    );
  };

  // Extract price number from price string (e.g., "KSh 4,500/day" -> 4500)
  const getPriceFromString = (priceString) => {
    if (!priceString) return 0;
    return parseCurrency(priceString.replace('/day', ''));
  };

  // Filter cars based on all filters (price, categories, fuel, seats)
  const filterCarsByFilters = (cars) => {
    let filtered = cars;

    // Filter by price range
    if (filters.priceRange.min > 0 || filters.priceRange.max < 50000) {
      filtered = filtered.filter(car => {
        const price = getPriceFromString(car.price);
        return price >= filters.priceRange.min && price <= filters.priceRange.max;
      });
    }

    // Filter by categories (if any selected)
    if (filters.categories.length > 0) {
      filtered = filtered.filter(car => {
        // Find which category this car belongs to
        for (const carClass of carClasses) {
          if (filters.categories.includes(carClass.id) && carClass.cars.some(c => c.id === car.id)) {
            return true;
          }
        }
        // Check commercial vehicles
        for (const category of commercialVehicles) {
          if (filters.categories.includes(category.id) && category.vehicles.some(v => v.id === car.id)) {
            return true;
          }
        }
        return false;
      });
    }

    // Filter by fuel types
    if (filters.fuelTypes.length > 0) {
      filtered = filtered.filter(car => 
        filters.fuelTypes.includes(car.fuel.toLowerCase())
      );
    }

    // Filter by seat counts
    if (filters.seatCounts.length > 0) {
      filtered = filtered.filter(car => 
        filters.seatCounts.includes(car.seats.toString())
      );
    }

    return filtered;
  };

  // Check if filters are active
  useEffect(() => {
    const hasFilters = 
      filters.priceRange.min > 0 || 
      filters.priceRange.max < 50000 ||
      filters.categories.length > 0 ||
      filters.fuelTypes.length > 0 ||
      filters.seatCounts.length > 0;
    setHasActiveFilters(hasFilters);
  }, [filters]);

  // Get all cars from all classes
  const allCars = carClasses.flatMap(carClass => carClass.cars);
  
  // Filter cars based on search query
  const filteredCars = searchQuery.trim() 
    ? filterCarsBySearch(allCars, searchQuery)
    : null;

  // Filter car classes to show only classes with matching cars when searching or filtering
  const filteredCarClasses = (() => {
    let classes = carClasses;
    
    // Apply search filter first
    if (searchQuery.trim()) {
      classes = classes.map(carClass => ({
        ...carClass,
        cars: filterCarsBySearch(carClass.cars, searchQuery)
      })).filter(carClass => carClass.cars.length > 0);
    }
    
    // Then apply other filters
    if (hasActiveFilters) {
      classes = classes.map(carClass => ({
        ...carClass,
        cars: filterCarsByFilters(carClass.cars)
      })).filter(carClass => carClass.cars.length > 0);
    }
    
    return classes;
  })();

  // Filter commercial vehicles
  const filteredCommercialVehicles = (() => {
    let vehicles = commercialVehicles;
    
    // Apply search filter first
    if (searchQuery.trim()) {
      vehicles = vehicles.map(category => ({
        ...category,
        vehicles: filterCarsBySearch(category.vehicles, searchQuery)
      })).filter(category => category.vehicles.length > 0);
    }
    
    // Then apply other filters
    if (hasActiveFilters) {
      vehicles = vehicles.map(category => ({
        ...category,
        vehicles: filterCarsByFilters(category.vehicles)
      })).filter(category => category.vehicles.length > 0);
    }
    
    return vehicles;
  })();

  // Get current location
  const getCurrentLocation = async () => {
    if (!Location) {
      Alert.alert(
        'Location Service Unavailable',
        'Location services require expo-location package. Please install it using: npx expo install expo-location',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsGettingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to use your current location. Please enable it in settings.',
          [{ text: 'OK' }]
        );
        setIsGettingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      // Reverse geocode to get city name
      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (geocode && geocode.length > 0) {
        const city = geocode[0].city || geocode[0].subAdministrativeArea || 'Current Location';
        setCurrentLocation({ latitude, longitude, city });
        setSelectedCity(city);
      } else {
        setCurrentLocation({ latitude, longitude, city: 'Current Location' });
        setSelectedCity('Current Location');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get your location. Please try again.');
      console.error('Location error:', error);
    } finally {
      setIsGettingLocation(false);
    }
  };

  // Auto-hide banner after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setShowNoFeesMessage(false);
      });
    }, 5000); // Hide after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  // Set header icons and search bar
  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <View style={[styles.customHeader, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
          {/* Top Row: Location and Action Icons */}
          <View style={styles.headerTopRow}>
            <TouchableOpacity
              onPress={() => setShowLocationModal(true)}
              style={styles.headerLocationButton}
              activeOpacity={0.7}
            >
              <Ionicons name="location" size={24} color={theme.colors.primary} />
              <Text 
                style={[styles.headerLocationText, { color: theme.colors.textPrimary }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {selectedCity}
              </Text>
            </TouchableOpacity>

            <View style={styles.headerRightContainer}>
              {showSearch ? (
                <View style={[styles.headerSearchContainer, { backgroundColor: theme.colors.white }]}>
                  <TextInput
                    style={[styles.headerSearchInput, { color: theme.colors.textPrimary }]}
                    placeholder="Search cars..."
                    placeholderTextColor={theme.colors.hint}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoFocus
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setShowSearch(false);
                      setSearchQuery('');
                    }}
                    style={styles.headerCloseButton}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close" size={20} color={theme.colors.textPrimary} />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.headerIcons}>
                  <TouchableOpacity
                    onPress={() => setShowSearch(true)}
                    style={styles.iconButton}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="search-outline" size={24} color={theme.colors.textPrimary} />
                  </TouchableOpacity>
                  {activeTab === 'cars' && (
                    <TouchableOpacity
                      onPress={() => setShowFilterModal(true)}
                      style={[styles.iconButton, hasActiveFilters && styles.filterIconActive]}
                      activeOpacity={0.7}
                    >
                      <Ionicons 
                        name="filter-outline" 
                        size={24} 
                        color={hasActiveFilters ? theme.colors.primary : theme.colors.textPrimary} 
                      />
                      {hasActiveFilters && (
                        <View style={[styles.filterBadge, { backgroundColor: theme.colors.primary }]} />
                      )}
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('RenterProfile');
                    }}
                    style={styles.profileButton}
                    activeOpacity={0.7}
                  >
                    <View style={styles.profileImageContainer}>
                      <Image source={profileImage} style={[styles.profileImage, { borderColor: theme.colors.primary }]} resizeMode="cover" />
                      <View style={styles.onlineIndicator} />
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* Bottom Row: Toggle Buttons */}
          <View style={[styles.headerBottomRow, isScrolled && styles.headerBottomRowSmall]}>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setActiveTab('cars')}
              activeOpacity={0.7}
            >
              <View style={styles.toggleContent}>
                {!isScrolled && <Text style={styles.toggleEmoji}>🚗</Text>}
                <Text style={[
                  styles.toggleText, 
                  { 
                    color: activeTab === 'cars' ? theme.colors.primary : theme.colors.textPrimary,
                    fontWeight: activeTab === 'cars' ? '700' : '400',
                    fontSize: activeTab === 'cars' ? (isScrolled ? 15 : 18) : (isScrolled ? 13 : 16),
                    fontFamily: activeTab === 'cars' ? 'Nunito_700Bold' : 'Nunito_400Regular'
                  }
                ]}>
                  Vehicles
                </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setActiveTab('services')}
              activeOpacity={0.7}
            >
              <View style={styles.toggleContent}>
                {!isScrolled && <Text style={styles.toggleEmoji}>🛠️</Text>}
                <Text 
                  style={[
                    styles.toggleText, 
                    { 
                      color: activeTab === 'services' ? theme.colors.primary : theme.colors.textPrimary,
                      fontWeight: activeTab === 'services' ? '700' : '400',
                      fontSize: activeTab === 'services' ? (isScrolled ? 15 : 18) : (isScrolled ? 13 : 16),
                      fontFamily: activeTab === 'services' ? 'Nunito_700Bold' : 'Nunito_400Regular'
                    }
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Services
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setActiveTab('discover')}
              activeOpacity={0.7}
            >
              <View style={styles.toggleContent}>
                {!isScrolled && <Text style={styles.toggleEmoji}>🔍</Text>}
                <Text style={[
                  styles.toggleText, 
                  { 
                    color: activeTab === 'discover' ? theme.colors.primary : theme.colors.textPrimary,
                    fontWeight: activeTab === 'discover' ? '700' : '400',
                    fontSize: activeTab === 'discover' ? (isScrolled ? 15 : 18) : (isScrolled ? 13 : 16),
                    fontFamily: activeTab === 'discover' ? 'Nunito_700Bold' : 'Nunito_400Regular'
                  }
                ]}>
                  Discover
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      ),
    });
  }, [navigation, theme, showSearch, searchQuery, selectedCity, activeTab, isScrolled, insets.top, hasActiveFilters]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        onScroll={(event) => {
          const scrollY = event.nativeEvent.contentOffset.y;
          setIsScrolled(scrollY > 50);
        }}
        scrollEventThrottle={16}
      >
      {/* Search Results */}
      {searchQuery.trim() && activeTab === 'cars' && (
        <View style={styles.searchResultsHeader}>
          <Text style={[styles.searchResultsText, { color: theme.colors.textPrimary }]}>
            {filteredCars?.length || 0} {filteredCars?.length === 1 ? 'car' : 'cars'} found for "{searchQuery}" in {selectedCity}
          </Text>
        </View>
      )}

      {/* Services Section */}
      {activeTab === 'services' && (
        <View style={styles.servicesSection}>
          <View style={styles.servicesGrid}>
            {/* Road Trips Card */}
            <TouchableOpacity
              style={[styles.serviceCard, { backgroundColor: theme.colors.white }]}
              activeOpacity={0.8}
              onPress={() => {
                // Navigate to road trips screen
                navigation.navigate('CarList', { categoryId: 'roadtrips' });
              }}
            >
              <View style={styles.serviceImageContainer}>
                <Image source={roadtripsImage} style={styles.serviceImage} resizeMode="cover" />
              </View>
              <View style={styles.serviceContent}>
                <Text style={[styles.serviceTitle, { color: theme.colors.textPrimary }]}>
                  Road Trips
                </Text>
                <Text style={[styles.serviceDescription, { color: theme.colors.textSecondary }]}>
                  Plan your perfect adventure with our road trip packages
                </Text>
              </View>
            </TouchableOpacity>

            {/* VIP Wedding Fleet Hire Card */}
            <TouchableOpacity
              style={[styles.serviceCard, { backgroundColor: theme.colors.white }]}
              activeOpacity={0.8}
              onPress={() => {
                // Navigate to VIP wedding fleet screen
                Alert.alert('Coming Soon', 'VIP wedding fleet hire will be available soon.');
              }}
            >
              <View style={styles.serviceImageContainer}>
                <Image source={convoyImage} style={styles.serviceImage} resizeMode="cover" />
              </View>
              <View style={styles.serviceContent}>
                <Text style={[styles.serviceTitle, { color: theme.colors.textPrimary }]}>
                  VIP Wedding Fleet Hire
                </Text>
                <Text style={[styles.serviceDescription, { color: theme.colors.textSecondary }]}>
                  Luxury vehicle convoy for your special day
                </Text>
              </View>
            </TouchableOpacity>

            {/* Professional Drivers Card */}
            <TouchableOpacity
              style={[styles.serviceCard, { backgroundColor: theme.colors.white }]}
              activeOpacity={0.8}
              onPress={() => {
                // Navigate to drivers screen
                Alert.alert('Coming Soon', 'Professional drivers booking will be available soon.');
              }}
            >
              <View style={styles.serviceImageContainer}>
                <Image source={driverImage} style={styles.serviceImage} resizeMode="cover" />
              </View>
              <View style={styles.serviceContent}>
                <Text style={[styles.serviceTitle, { color: theme.colors.textPrimary }]}>
                  Hire Professional Drivers
                </Text>
                <Text style={[styles.serviceDescription, { color: theme.colors.textSecondary }]}>
                  Get experienced drivers for your rental vehicle
                </Text>
              </View>
            </TouchableOpacity>

            {/* Movers Card */}
            <TouchableOpacity
              style={[styles.serviceCard, { backgroundColor: theme.colors.white }]}
              activeOpacity={0.8}
              onPress={() => {
                // Navigate to movers screen
                Alert.alert('Coming Soon', 'Moving services will be available soon.');
              }}
            >
              <View style={styles.serviceImageContainer}>
                <Image source={moversImage} style={styles.serviceImage} resizeMode="cover" />
              </View>
              <View style={styles.serviceContent}>
                <Text style={[styles.serviceTitle, { color: theme.colors.textPrimary }]}>
                  Movers
                </Text>
                <Text style={[styles.serviceDescription, { color: theme.colors.textSecondary }]}>
                  Professional moving and relocation services
                </Text>
              </View>
            </TouchableOpacity>

            {/* Mechanic Services Card */}
            <TouchableOpacity
              style={[styles.serviceCard, { backgroundColor: theme.colors.white }]}
              activeOpacity={0.8}
              onPress={() => {
                // Navigate to mechanic services screen
                Alert.alert('Coming Soon', 'Mechanic services will be available soon.');
              }}
            >
              <View style={styles.serviceImageContainer}>
                <Image source={mechanicsImage} style={styles.serviceImage} resizeMode="cover" />
              </View>
              <View style={styles.serviceContent}>
                <Text style={[styles.serviceTitle, { color: theme.colors.textPrimary }]}>
                  Mechanic Services
                </Text>
                <Text style={[styles.serviceDescription, { color: theme.colors.textSecondary }]}>
                  Professional automotive repair and maintenance services
                </Text>
              </View>
            </TouchableOpacity>

            {/* Automobile Parts Shop Card */}
            <TouchableOpacity
              style={[styles.serviceCard, { backgroundColor: theme.colors.white }]}
              activeOpacity={0.8}
              onPress={() => {
                // Navigate to parts shop screen
                Alert.alert('Coming Soon', 'Automobile parts shop will be available soon.');
              }}
            >
              <View style={styles.serviceImageContainer}>
                <Image source={partsImage} style={styles.serviceImage} resizeMode="cover" />
              </View>
              <View style={styles.serviceContent}>
                <Text style={[styles.serviceTitle, { color: theme.colors.textPrimary }]}>
                  Automobile Parts Shop
                </Text>
                <Text style={[styles.serviceDescription, { color: theme.colors.textSecondary }]}>
                  Quality auto parts and accessories for your vehicle
                </Text>
              </View>
            </TouchableOpacity>

            {/* VIP Car Detailing Card */}
            <TouchableOpacity
              style={[styles.serviceCard, { backgroundColor: theme.colors.white }]}
              activeOpacity={0.8}
              onPress={() => {
                // Navigate to car detailing screen
                Alert.alert('Coming Soon', 'VIP car detailing services will be available soon.');
              }}
            >
              <View style={styles.serviceImageContainer}>
                <Image source={detailingImage} style={styles.serviceImage} resizeMode="cover" />
              </View>
              <View style={styles.serviceContent}>
                <Text style={[styles.serviceTitle, { color: theme.colors.textPrimary }]}>
                  VIP Car Detailing
                </Text>
                <Text style={[styles.serviceDescription, { color: theme.colors.textSecondary }]}>
                  Premium car cleaning and detailing services
                </Text>
              </View>
            </TouchableOpacity>

            {/* Roadside Assistance Card */}
            <TouchableOpacity
              style={[styles.serviceCard, { backgroundColor: theme.colors.white }]}
              activeOpacity={0.8}
              onPress={() => {
                // Navigate to roadside assistance screen
                Alert.alert('Coming Soon', 'Roadside assistance services will be available soon.');
              }}
            >
              <View style={styles.serviceImageContainer}>
                <Image source={roadsideImage} style={styles.serviceImage} resizeMode="cover" />
              </View>
              <View style={styles.serviceContent}>
                <Text style={[styles.serviceTitle, { color: theme.colors.textPrimary }]}>
                  Roadside Assistance
                </Text>
                <Text style={[styles.serviceDescription, { color: theme.colors.textSecondary }]}>
                  24/7 emergency support and vehicle recovery services
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Discover Section */}
      {activeTab === 'discover' && (
        <View style={styles.discoverSection}>
          {/* Special Offers Section */}
          <View style={styles.discoverSubsection}>
            <Text style={[styles.discoverSectionTitle, { color: theme.colors.textPrimary }]}>
              Special Offers
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.offersContainer}>
              <TouchableOpacity
                style={[styles.offerCard, { backgroundColor: theme.colors.primary }]}
                activeOpacity={0.8}
                onPress={() => {
                  navigation.navigate('CarList', { categoryId: 'special-offer' });
                }}
              >
                <View style={styles.offerContent}>
                  <Text style={[styles.offerTitle, { color: theme.colors.white }]}>
                    Weekend Special
                  </Text>
                  <Text style={[styles.offerDescription, { color: theme.colors.white }]}>
                    Get 20% off on weekend rentals
                  </Text>
                  <Text style={[styles.offerCode, { color: theme.colors.white }]}>
                    Use code: WEEKEND20
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.offerCard, { backgroundColor: theme.colors.textPrimary }]}
                activeOpacity={0.8}
                onPress={() => {
                  navigation.navigate('CarList', { categoryId: 'long-term' });
                }}
              >
                <View style={styles.offerContent}>
                  <Text style={[styles.offerTitle, { color: theme.colors.white }]}>
                    Long Term Deal
                  </Text>
                  <Text style={[styles.offerDescription, { color: theme.colors.white }]}>
                    Save up to 30% on monthly rentals
                  </Text>
                  <Text style={[styles.offerCode, { color: theme.colors.white }]}>
                    Book 30+ days
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.offerCard, { backgroundColor: '#4CAF50' }]}
                activeOpacity={0.8}
                onPress={() => {
                  navigation.navigate('CarList', { categoryId: 'first-time' });
                }}
              >
                <View style={styles.offerContent}>
                  <Text style={[styles.offerTitle, { color: theme.colors.white }]}>
                    First Time User
                  </Text>
                  <Text style={[styles.offerDescription, { color: theme.colors.white }]}>
                    Get 15% off your first booking
                  </Text>
                  <Text style={[styles.offerCode, { color: theme.colors.white }]}>
                    New users only
                  </Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Popular Destinations Section */}
          <View style={styles.discoverSubsection}>
            <Text style={[styles.discoverSectionTitle, { color: theme.colors.textPrimary }]}>
              Popular Destinations
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.destinationsContainer}>
              <TouchableOpacity
                style={[styles.destinationCard, { backgroundColor: theme.colors.white }]}
                activeOpacity={0.8}
                onPress={() => {
                  navigation.navigate('CarList', { categoryId: 'mombasa' });
                }}
              >
                <View style={styles.destinationImageContainer}>
                  <Image source={mombasaImage} style={styles.destinationImage} resizeMode="cover" />
                  <View style={styles.destinationOverlay} />
                </View>
                <View style={styles.destinationContent}>
                  <Text style={[styles.destinationName, { color: theme.colors.textPrimary }]}>
                    Mombasa Beaches
                  </Text>
                  <Text style={[styles.destinationDescription, { color: theme.colors.textSecondary }]}>
                    Coastal paradise with beautiful beaches
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.destinationCard, { backgroundColor: theme.colors.white }]}
                activeOpacity={0.8}
                onPress={() => {
                  navigation.navigate('CarList', { categoryId: 'lake-nakuru' });
                }}
              >
                <View style={styles.destinationImageContainer}>
                  <Image source={nakuruImage} style={styles.destinationImage} resizeMode="cover" />
                  <View style={styles.destinationOverlay} />
                </View>
                <View style={styles.destinationContent}>
                  <Text style={[styles.destinationName, { color: theme.colors.textPrimary }]}>
                    Lake Nakuru
                  </Text>
                  <Text style={[styles.destinationDescription, { color: theme.colors.textSecondary }]}>
                    Wildlife and scenic lake views
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.destinationCard, { backgroundColor: theme.colors.white }]}
                activeOpacity={0.8}
                onPress={() => {
                  navigation.navigate('CarList', { categoryId: 'egerton-castle' });
                }}
              >
                <View style={styles.destinationImageContainer}>
                  <Image source={egertonImage} style={styles.destinationImage} resizeMode="cover" />
                  <View style={styles.destinationOverlay} />
                </View>
                <View style={styles.destinationContent}>
                  <Text style={[styles.destinationName, { color: theme.colors.textPrimary }]}>
                    Lord Egerton Castle
                  </Text>
                  <Text style={[styles.destinationDescription, { color: theme.colors.textSecondary }]}>
                    Historic castle with stunning architecture
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.destinationCard, { backgroundColor: theme.colors.white }]}
                activeOpacity={0.8}
                onPress={() => {
                  navigation.navigate('CarList', { categoryId: 'hells-gate' });
                }}
              >
                <View style={styles.destinationImageContainer}>
                  <Image source={hellsgateImage} style={styles.destinationImage} resizeMode="cover" />
                  <View style={styles.destinationOverlay} />
                </View>
                <View style={styles.destinationContent}>
                  <Text style={[styles.destinationName, { color: theme.colors.textPrimary }]}>
                    Hell's Gate
                  </Text>
                  <Text style={[styles.destinationDescription, { color: theme.colors.textSecondary }]}>
                    Spectacular canyon and geothermal park
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.destinationCard, { backgroundColor: theme.colors.white }]}
                activeOpacity={0.8}
                onPress={() => {
                  navigation.navigate('CarList', { categoryId: 'ol-pejeta' });
                }}
              >
                <View style={styles.destinationImageContainer}>
                  <Image source={pejetaImage} style={styles.destinationImage} resizeMode="cover" />
                  <View style={styles.destinationOverlay} />
                </View>
                <View style={styles.destinationContent}>
                  <Text style={[styles.destinationName, { color: theme.colors.textPrimary }]}>
                    Ol Pejeta Conservancy
                  </Text>
                  <Text style={[styles.destinationDescription, { color: theme.colors.textSecondary }]}>
                    Wildlife conservation and safari experience
                  </Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Car Events Near Me Section */}
          <View style={styles.discoverSubsection}>
            <Text style={[styles.discoverSectionTitle, { color: theme.colors.textPrimary }]}>
              Car Events Near Me
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carEventsContainer}>
              <TouchableOpacity
                style={[styles.carEventsCard, { backgroundColor: theme.colors.white }]}
                activeOpacity={0.8}
                onPress={() => {
                  Alert.alert('Nairobi Auto Show', 'Join us for the biggest automotive exhibition in the region!');
                }}
              >
                <View style={styles.carEventsImageContainer}>
                  <Image source={eventsImage} style={styles.carEventsImage} resizeMode="cover" />
                  <View style={styles.carEventsOverlay} />
                </View>
                <View style={styles.carEventsContent}>
                  <Text style={[styles.carEventsTitle, { color: theme.colors.textPrimary }]}>
                    Nairobi Auto Show
                  </Text>
                  <Text style={[styles.carEventsDescription, { color: theme.colors.textSecondary }]}>
                    Biggest automotive exhibition in the region
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.carEventsCard, { backgroundColor: theme.colors.white }]}
                activeOpacity={0.8}
                onPress={() => {
                  Alert.alert('Classic Car Exhibition', 'Explore vintage and classic vehicles from different eras!');
                }}
              >
                <View style={styles.carEventsImageContainer}>
                  <Image source={events1Image} style={styles.carEventsImage} resizeMode="cover" />
                  <View style={styles.carEventsOverlay} />
                </View>
                <View style={styles.carEventsContent}>
                  <Text style={[styles.carEventsTitle, { color: theme.colors.textPrimary }]}>
                    Classic Car Exhibition
                  </Text>
                  <Text style={[styles.carEventsDescription, { color: theme.colors.textSecondary }]}>
                    Vintage and classic vehicles showcase
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.carEventsCard, { backgroundColor: theme.colors.white }]}
                activeOpacity={0.8}
                onPress={() => {
                  Alert.alert('Supercar Rally', 'Experience high-performance supercars up close!');
                }}
              >
                <View style={styles.carEventsImageContainer}>
                  <Image source={events2Image} style={styles.carEventsImage} resizeMode="cover" />
                  <View style={styles.carEventsOverlay} />
                </View>
                <View style={styles.carEventsContent}>
                  <Text style={[styles.carEventsTitle, { color: theme.colors.textPrimary }]}>
                    Supercar Rally
                  </Text>
                  <Text style={[styles.carEventsDescription, { color: theme.colors.textSecondary }]}>
                    High-performance supercars showcase
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.carEventsCard, { backgroundColor: theme.colors.white }]}
                activeOpacity={0.8}
                onPress={() => {
                  Alert.alert('Motor Expo', 'Discover the latest innovations in automotive technology!');
                }}
              >
                <View style={styles.carEventsImageContainer}>
                  <Image source={events3Image} style={styles.carEventsImage} resizeMode="cover" />
                  <View style={styles.carEventsOverlay} />
                </View>
                <View style={styles.carEventsContent}>
                  <Text style={[styles.carEventsTitle, { color: theme.colors.textPrimary }]}>
                    Motor Expo
                  </Text>
                  <Text style={[styles.carEventsDescription, { color: theme.colors.textSecondary }]}>
                    Latest automotive technology and innovations
                  </Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Opa Blogs Section */}
          <View style={styles.discoverSubsection}>
            <Text style={[styles.discoverSectionTitle, { color: theme.colors.textPrimary }]}>
              Opa Blogs
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.blogsContainer}>
              <TouchableOpacity
                style={[styles.blogCard, { backgroundColor: theme.colors.white }]}
                activeOpacity={0.8}
                onPress={() => {
                  Alert.alert('Blog Post', 'Read full blog post coming soon!');
                }}
              >
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400' }}
                  style={styles.blogImage}
                  resizeMode="cover"
                />
                <View style={styles.blogContent}>
                  <Text style={[styles.blogTitle, { color: theme.colors.textPrimary }]}>
                    Top 10 Road Trip Destinations in Kenya
                  </Text>
                  <Text style={[styles.blogDescription, { color: theme.colors.textSecondary }]}>
                    Discover the most breathtaking destinations perfect for your next road trip adventure.
                  </Text>
                  <Text style={[styles.blogDate, { color: theme.colors.hint }]}>
                    2 days ago
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.blogCard, { backgroundColor: theme.colors.white }]}
                activeOpacity={0.8}
                onPress={() => {
                  Alert.alert('Blog Post', 'Read full blog post coming soon!');
                }}
              >
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400' }}
                  style={styles.blogImage}
                  resizeMode="cover"
                />
                <View style={styles.blogContent}>
                  <Text style={[styles.blogTitle, { color: theme.colors.textPrimary }]}>
                    Car Maintenance Tips for Long Trips
                  </Text>
                  <Text style={[styles.blogDescription, { color: theme.colors.textSecondary }]}>
                    Essential maintenance tips to keep your rental car running smoothly during long journeys.
                  </Text>
                  <Text style={[styles.blogDate, { color: theme.colors.hint }]}>
                    5 days ago
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.blogCard, { backgroundColor: theme.colors.white }]}
                activeOpacity={0.8}
                onPress={() => {
                  Alert.alert('Blog Post', 'Read full blog post coming soon!');
                }}
              >
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400' }}
                  style={styles.blogImage}
                  resizeMode="cover"
                />
                <View style={styles.blogContent}>
                  <Text style={[styles.blogTitle, { color: theme.colors.textPrimary }]}>
                    Best Time to Visit Kenya's National Parks
                  </Text>
                  <Text style={[styles.blogDescription, { color: theme.colors.textSecondary }]}>
                    Plan your safari adventure with our guide to the best times for wildlife viewing.
                  </Text>
                  <Text style={[styles.blogDate, { color: theme.colors.hint }]}>
                    1 week ago
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.blogCard, { backgroundColor: theme.colors.white }]}
                activeOpacity={0.8}
                onPress={() => {
                  Alert.alert('Blog Post', 'Read full blog post coming soon!');
                }}
              >
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400' }}
                  style={styles.blogImage}
                  resizeMode="cover"
                />
                <View style={styles.blogContent}>
                  <Text style={[styles.blogTitle, { color: theme.colors.textPrimary }]}>
                    Coastal Getaways: A Complete Guide
                  </Text>
                  <Text style={[styles.blogDescription, { color: theme.colors.textSecondary }]}>
                    Explore Kenya's stunning coastline with our comprehensive travel guide.
                  </Text>
                  <Text style={[styles.blogDate, { color: theme.colors.hint }]}>
                    2 weeks ago
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.blogCard, { backgroundColor: theme.colors.white }]}
                activeOpacity={0.8}
                onPress={() => {
                  Alert.alert('Blog Post', 'Read full blog post coming soon!');
                }}
              >
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400' }}
                  style={styles.blogImage}
                  resizeMode="cover"
                />
                <View style={styles.blogContent}>
                  <Text style={[styles.blogTitle, { color: theme.colors.textPrimary }]}>
                    Safety Tips for Driving in Kenya
                  </Text>
                  <Text style={[styles.blogDescription, { color: theme.colors.textSecondary }]}>
                    Important safety guidelines and driving tips for navigating Kenya's roads confidently.
                  </Text>
                  <Text style={[styles.blogDate, { color: theme.colors.hint }]}>
                    3 weeks ago
                  </Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      )}

      {/* Car Classes Sections */}
      {activeTab === 'cars' && (
        <>
        {filteredCarClasses.length > 0 ? (
        filteredCarClasses.map((carClass, index) => (
        <View key={carClass.id} style={[styles.classSection, index === 0 && styles.firstSection]}>
          <View style={[styles.classHeader, index === 0 && styles.firstHeader]}>
            <View>
              <Text style={[styles.className, { color: theme.colors.textPrimary }]}>
                {carClass.name}
              </Text>
              <Text style={[styles.classDescription, { color: theme.colors.textSecondary }]}>
                {carClass.description}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleViewAll(carClass.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carsContainer}
          >
            {carClass.cars.map((car) => (
              <TouchableOpacity
                key={car.id}
                onPress={() => handleCarPress(car)}
                activeOpacity={1}
                style={styles.carCardWrapper}
              >
                <Card style={styles.carCard}>
                  <View style={styles.carImageContainer}>
                    <Image 
                      source={car.image || carImages[car.id] || carImage1} 
                      style={styles.carImage}
                      resizeMode="cover"
                    />
                    {/* Like Icon */}
                    <View style={styles.carActions}>
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          toggleLike(car.id);
                        }}
                        style={styles.actionButton}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name={likedCars.has(car.id) ? "heart" : "heart-outline"}
                          size={20}
                          color={likedCars.has(car.id) ? '#FF3B30' : theme.colors.textPrimary}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.carInfo}>
                    <Text style={[styles.carName, { color: theme.colors.textPrimary }]}>
                      {car.name}
                    </Text>
                    <Text style={[styles.carPrice, { color: theme.colors.primary }]}>
                      {car.price}
                    </Text>
                    {/* Car Details Icons */}
                    <View style={styles.carDetails}>
                      <View style={styles.carDetailItem}>
                        <Ionicons name="people-outline" size={16} color={theme.colors.hint} />
                        <Text style={[styles.carDetailText, { color: theme.colors.hint }]}>
                          {car.seats}
                        </Text>
                      </View>
                      <View style={styles.carDetailItem}>
                        <Ionicons name="car-outline" size={16} color={theme.colors.hint} />
                        <Text style={[styles.carDetailText, { color: theme.colors.hint }]}>
                          {car.fuel}
                        </Text>
                      </View>
                      <View style={styles.carDetailItem}>
                        <Ionicons name="color-palette-outline" size={16} color={theme.colors.hint} />
                        <Text style={[styles.carDetailText, { color: theme.colors.hint }]}>
                          {car.color}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ))
      ) : null}

        {/* Commercial Vehicles Sections */}
        {filteredCommercialVehicles.length > 0 ? (
          filteredCommercialVehicles.map((category, index) => (
          <View key={category.id} style={[styles.classSection, index === 0 && styles.firstSection]}>
            <View style={[styles.classHeader, index === 0 && styles.firstHeader]}>
              <View>
                <Text style={[styles.className, { color: theme.colors.textPrimary }]}>
                  {category.name}
                </Text>
                <Text style={[styles.classDescription, { color: theme.colors.textSecondary }]}>
                  {category.description}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleViewAll(category.id, true)}
                activeOpacity={0.7}
              >
                <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carsContainer}
            >
              {category.vehicles.map((vehicle) => (
                <TouchableOpacity
                  key={vehicle.id}
                  onPress={() => handleCarPress(vehicle)}
                  activeOpacity={1}
                  style={styles.carCardWrapper}
                >
                  <Card style={styles.carCard}>
                    <View style={styles.carImageContainer}>
                      <Image 
                        source={vehicle.image} 
                        style={styles.carImage}
                        resizeMode="cover"
                      />
                      {/* Like Icon */}
                      <View style={styles.carActions}>
                        <TouchableOpacity
                          onPress={(e) => {
                            e.stopPropagation();
                            toggleLike(vehicle.id);
                          }}
                          style={styles.actionButton}
                          activeOpacity={0.7}
                        >
                          <Ionicons
                            name={likedCars.has(vehicle.id) ? "heart" : "heart-outline"}
                            size={20}
                            color={likedCars.has(vehicle.id) ? '#FF3B30' : theme.colors.textPrimary}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.carInfo}>
                      <Text style={[styles.carName, { color: theme.colors.textPrimary }]}>
                        {vehicle.name}
                      </Text>
                      <Text style={[styles.carPrice, { color: theme.colors.primary }]}>
                        {vehicle.price}
                      </Text>
                      {/* Vehicle Details Icons */}
                      <View style={styles.carDetails}>
                        <View style={styles.carDetailItem}>
                          <Ionicons name="people-outline" size={16} color={theme.colors.hint} />
                          <Text style={[styles.carDetailText, { color: theme.colors.hint }]}>
                            {vehicle.seats}
                          </Text>
                        </View>
                        <View style={styles.carDetailItem}>
                          <Ionicons name="car-outline" size={16} color={theme.colors.hint} />
                          <Text style={[styles.carDetailText, { color: theme.colors.hint }]}>
                            {vehicle.fuel}
                          </Text>
                        </View>
                        <View style={styles.carDetailItem}>
                          <Ionicons name="color-palette-outline" size={16} color={theme.colors.hint} />
                          <Text style={[styles.carDetailText, { color: theme.colors.hint }]}>
                            {vehicle.color}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          ))
        ) : null}

        {/* Search Results / No Results */}
        {searchQuery.trim() ? (
          <View style={styles.noResultsContainer}>
            <Ionicons name="search-outline" size={64} color={theme.colors.hint} />
            <Text style={[styles.noResultsText, { color: theme.colors.textSecondary }]}>
              No vehicles found matching "{searchQuery}"
            </Text>
            <Text style={[styles.noResultsSubtext, { color: theme.colors.hint }]}>
              Try searching with a different term
            </Text>
          </View>
        ) : null}
        </>
      )}
      </ScrollView>

      {/* No Hidden Fees Message Banner - Bottom Above Navbar */}
      {showNoFeesMessage && (
        <Animated.View
          style={[
            styles.noFeesBanner,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={styles.noFeesContent}>
            <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
            <Text style={styles.noFeesText}>
              No hidden fees, unless personal insurance
            </Text>
          </View>
        </Animated.View>
      )}

      {/* Location Options Modal */}
      <Modal
        visible={showLocationModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLocationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.locationModal, { backgroundColor: theme.colors.white }]}>
            <View style={styles.locationModalHeader}>
              <Text style={[styles.locationModalTitle, { color: theme.colors.textPrimary }]}>
                Choose Location
              </Text>
              <TouchableOpacity
                onPress={() => setShowLocationModal(false)}
                activeOpacity={0.7}
              >
                <Ionicons name="close-outline" size={28} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.locationOptionsContainer}>
              {/* Current Location Button */}
              <TouchableOpacity
                style={[styles.locationOptionButton, {
                  backgroundColor: theme.colors.primary,
                  borderColor: theme.colors.primary,
                }]}
                onPress={async () => {
                  await getCurrentLocation();
                  setShowLocationModal(false);
                }}
                disabled={isGettingLocation}
                activeOpacity={0.7}
              >
                {isGettingLocation ? (
                  <Ionicons name="hourglass-outline" size={24} color={theme.colors.white} />
                ) : (
                  <Ionicons name="locate-outline" size={24} color={theme.colors.white} />
                )}
                <Text style={[styles.locationOptionText, { color: theme.colors.white }]}>
                  {isGettingLocation ? 'Getting Location...' : 'Use Current Location'}
                </Text>
              </TouchableOpacity>

              {/* Select County Button */}
              <TouchableOpacity
                style={[styles.locationOptionButton, {
                  backgroundColor: theme.colors.white,
                  borderColor: theme.colors.primary,
                  borderWidth: 2,
                }]}
                onPress={() => {
                  setShowLocationModal(false);
                  setShowCityPicker(true);
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="location-outline" size={24} color={theme.colors.primary} />
                <Text style={[styles.locationOptionText, { color: theme.colors.primary }]}>
                  Select County
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* County Picker Modal */}
      <Modal
        visible={showCityPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCityPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.cityPickerModal, { backgroundColor: theme.colors.white }]}>
            <View style={styles.cityPickerHeader}>
              <Text style={[styles.cityPickerTitle, { color: theme.colors.textPrimary }]}>
                Select County
              </Text>
              <TouchableOpacity
                onPress={() => setShowCityPicker(false)}
                activeOpacity={0.7}
              >
                <Ionicons name="close-outline" size={28} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {counties.map((county) => (
                <TouchableOpacity
                  key={county}
                  style={[
                    styles.cityItem,
                    {
                      backgroundColor: selectedCity === county ? theme.colors.primary + '15' : 'transparent',
                      borderColor: selectedCity === county ? theme.colors.primary : '#E0E0E0',
                    },
                  ]}
                  onPress={() => {
                    setSelectedCity(county);
                    setShowCityPicker(false);
                    if (county !== 'Current Location') {
                      setCurrentLocation(null);
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="location"
                    size={20}
                    color={selectedCity === county ? theme.colors.primary : theme.colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.cityItemText,
                      {
                        color: selectedCity === county ? theme.colors.primary : theme.colors.textPrimary,
                        fontFamily: selectedCity === county ? 'Nunito_600SemiBold' : 'Nunito_400Regular',
                      },
                    ]}
                  >
                    {county}
                  </Text>
                  {selectedCity === county && (
                    <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.filterModalOverlay}>
          <View style={[styles.filterModalContainer, { backgroundColor: theme.colors.white }]}>
            <View style={styles.filterModalHeader}>
              <Text style={[styles.filterModalTitle, { color: theme.colors.textPrimary }]}>
                Filter Vehicles
              </Text>
              <TouchableOpacity
                onPress={() => setShowFilterModal(false)}
                activeOpacity={0.7}
              >
                <Ionicons name="close-outline" size={28} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView 
              showsVerticalScrollIndicator={false}
              style={styles.filterModalScrollView}
              contentContainerStyle={styles.filterModalContentContainer}
            >
              {/* Price Range Section */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { color: theme.colors.textPrimary }]}>
                  Price Range (per day)
                </Text>
                <View style={styles.priceRangeContainer}>
                  <View style={styles.priceInputContainer}>
                    <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>Min</Text>
                    <TextInput
                      style={[styles.priceInput, { 
                        borderColor: theme.colors.hint,
                        color: theme.colors.textPrimary,
                        backgroundColor: theme.colors.background
                      }]}
                      placeholder="0"
                      placeholderTextColor={theme.colors.hint}
                      keyboardType="numeric"
                      value={filters.priceRange.min > 0 ? filters.priceRange.min.toString() : ''}
                      onChangeText={(text) => {
                        const value = text === '' ? 0 : parseInt(text) || 0;
                        setFilters(prev => ({
                          ...prev,
                          priceRange: { ...prev.priceRange, min: value }
                        }));
                      }}
                    />
                  </View>
                  <Text style={[styles.priceRangeSeparator, { color: theme.colors.textSecondary }]}>-</Text>
                  <View style={styles.priceInputContainer}>
                    <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>Max</Text>
                    <TextInput
                      style={[styles.priceInput, { 
                        borderColor: theme.colors.hint,
                        color: theme.colors.textPrimary,
                        backgroundColor: theme.colors.background
                      }]}
                      placeholder="50000"
                      placeholderTextColor={theme.colors.hint}
                      keyboardType="numeric"
                      value={filters.priceRange.max < 50000 ? filters.priceRange.max.toString() : ''}
                      onChangeText={(text) => {
                        const value = text === '' ? 50000 : parseInt(text) || 50000;
                        setFilters(prev => ({
                          ...prev,
                          priceRange: { ...prev.priceRange, max: value }
                        }));
                      }}
                    />
                  </View>
                </View>
              </View>

              {/* Categories Section */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { color: theme.colors.textPrimary }]}>
                  Vehicle Categories
                </Text>
                <View style={styles.filterChipsContainer}>
                  {[
                    ...carClasses.map(c => ({ id: c.id, name: c.name })),
                    ...commercialVehicles.map(c => ({ id: c.id, name: c.name }))
                  ].map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.filterChip,
                        {
                          backgroundColor: filters.categories.includes(category.id)
                            ? theme.colors.primary
                            : theme.colors.background,
                          borderColor: filters.categories.includes(category.id)
                            ? theme.colors.primary
                            : theme.colors.hint,
                        }
                      ]}
                      onPress={() => {
                        setFilters(prev => {
                          const newCategories = prev.categories.includes(category.id)
                            ? prev.categories.filter(id => id !== category.id)
                            : [...prev.categories, category.id];
                          return { ...prev, categories: newCategories };
                        });
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          {
                            color: filters.categories.includes(category.id)
                              ? theme.colors.white
                              : theme.colors.textPrimary,
                          }
                        ]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Fuel Types Section */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { color: theme.colors.textPrimary }]}>
                  Fuel Type
                </Text>
                <View style={styles.filterChipsContainer}>
                  {['Petrol', 'Diesel', 'Electric'].map((fuelType) => (
                    <TouchableOpacity
                      key={fuelType}
                      style={[
                        styles.filterChip,
                        {
                          backgroundColor: filters.fuelTypes.includes(fuelType.toLowerCase())
                            ? theme.colors.primary
                            : theme.colors.background,
                          borderColor: filters.fuelTypes.includes(fuelType.toLowerCase())
                            ? theme.colors.primary
                            : theme.colors.hint,
                        }
                      ]}
                      onPress={() => {
                        setFilters(prev => {
                          const newFuelTypes = prev.fuelTypes.includes(fuelType.toLowerCase())
                            ? prev.fuelTypes.filter(ft => ft !== fuelType.toLowerCase())
                            : [...prev.fuelTypes, fuelType.toLowerCase()];
                          return { ...prev, fuelTypes: newFuelTypes };
                        });
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          {
                            color: filters.fuelTypes.includes(fuelType.toLowerCase())
                              ? theme.colors.white
                              : theme.colors.textPrimary,
                          }
                        ]}
                      >
                        {fuelType}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Filter Modal Footer */}
              <View style={styles.filterModalFooter}>
                <TouchableOpacity
                  style={[styles.filterResetButton, { borderColor: theme.colors.hint }]}
                  onPress={() => {
                    setFilters({
                      priceRange: { min: 0, max: 50000 },
                      categories: [],
                      fuelTypes: [],
                      seatCounts: [],
                    });
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.filterResetText, { color: theme.colors.textPrimary }]}>
                    Reset
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterApplyButton, { backgroundColor: theme.colors.primary }]}
                  onPress={() => setShowFilterModal(false)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.filterApplyText, { color: theme.colors.white }]}>
                    Apply Filters
                  </Text>
              </TouchableOpacity>
            </View>
            </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  noFeesBanner: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  noFeesContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  noFeesText: {
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
    color: '#4CAF50',
    textAlign: 'center',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 8,
  },
  profileButton: {
    marginLeft: 4,
  },
  profileImageContainer: {
    position: 'relative',
    width: 36,
    height: 36,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  headerSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    minWidth: 200,
    maxWidth: 280,
  },
  headerSearchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    paddingVertical: 0,
    marginRight: 8,
  },
  headerCloseButton: {
    padding: 4,
  },
  classSection: {
    marginTop: 0,
    marginBottom: 24,
  },
  firstSection: {
    marginTop: 0,
  },
  firstHeader: {
    paddingTop: 16,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    marginBottom: 16,
    paddingTop: 24,
  },
  className: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  classDescription: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    marginTop: 4,
  },
  carsContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  carCardWrapper: {
    marginRight: 16,
  },
  carCard: {
    width: 200,
    padding: 0,
    overflow: 'hidden',
    borderWidth: 0,
  },
  carImageContainer: {
    width: '100%',
    height: 120,
    position: 'relative',
    overflow: 'hidden',
  },
  carImage: {
    width: '100%',
    height: '100%',
  },
  carActions: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  carInfo: {
    padding: 16,
  },
  carName: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 8,
  },
  carPrice: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 12,
  },
  carDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  carDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  carDetailText: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  searchResultsHeader: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchResultsText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  noResultsText: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginTop: 16,
    textAlign: 'center',
  },
  noResultsSubtext: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    marginTop: 8,
    textAlign: 'center',
  },
  customHeader: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
  },
  headerLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    maxWidth: 150,
  },
  headerLocationText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    flex: 1,
  },
  headerBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 4,
    paddingHorizontal: 8,
    paddingBottom: 8,
    alignItems: 'center',
    width: '100%',
  },
  headerBottomRowSmall: {
    paddingTop: 2,
    paddingBottom: 4,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    maxWidth: '33.33%',
  },
  toggleContent: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  toggleIndicator: {
    width: 40,
    height: 3,
    borderRadius: 2,
    marginTop: 4,
    alignSelf: 'center',
    position: 'relative',
  },
  toggleTextSmall: {
    fontSize: 12,
  },
  locationModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '40%',
  },
  locationModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  locationModalTitle: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
  },
  locationOptionsContainer: {
    gap: 16,
  },
  locationOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 12,
  },
  locationOptionText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  cityPickerModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '70%',
  },
  cityPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cityPickerTitle: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
    gap: 12,
  },
  cityItemText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  toggleEmoji: {
    fontSize: 20,
  },
  toggleText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  servicesSection: {
    paddingTop: 24,
    paddingBottom: 40,
  },
  servicesGrid: {
    paddingHorizontal: 24,
    gap: 16,
  },
  serviceCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  serviceImageContainer: {
    width: '100%',
    height: 180,
    overflow: 'hidden',
  },
  serviceImage: {
    width: '100%',
    height: '100%',
  },
  serviceIconContainer: {
    width: '100%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  serviceIconEmoji: {
    fontSize: 64,
  },
  serviceContent: {
    padding: 20,
  },
  serviceTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  discoverSection: {
    paddingTop: 24,
    paddingBottom: 40,
  },
  discoverSubsection: {
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  discoverSectionTitle: {
    fontSize: 22,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 16,
  },
  offersContainer: {
    paddingRight: 24,
    gap: 16,
  },
  offerCard: {
    width: 280,
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  offerContent: {
    gap: 8,
  },
  offerTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
  },
  offerDescription: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  offerCode: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
    marginTop: 4,
    opacity: 0.9,
  },
  destinationsContainer: {
    paddingRight: 24,
    gap: 16,
  },
  destinationCard: {
    width: 280,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  destinationImageContainer: {
    width: '100%',
    height: 160,
    position: 'relative',
    overflow: 'hidden',
  },
  destinationImage: {
    width: '100%',
    height: '100%',
  },
  destinationOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  destinationContent: {
    padding: 16,
  },
  destinationName: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  destinationDescription: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  carEventsContainer: {
    paddingRight: 24,
    gap: 16,
  },
  carEventsCard: {
    width: 280,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  carEventsImageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
    overflow: 'hidden',
  },
  carEventsImage: {
    width: '100%',
    height: '100%',
  },
  carEventsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  carEventsContent: {
    padding: 16,
  },
  carEventsTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  carEventsDescription: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  blogsContainer: {
    paddingRight: 24,
    gap: 16,
  },
  blogCard: {
    width: 320,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  blogImage: {
    width: '100%',
    height: 180,
  },
  blogContent: {
    padding: 16,
    gap: 8,
  },
  blogTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  blogDescription: {
    fontSize: 13,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 18,
    marginBottom: 4,
  },
  blogDate: {
    fontSize: 11,
    fontFamily: 'Nunito_400Regular',
  },
  filterIconActive: {
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  filterModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'flex-end',
  },
  filterModalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '75%',
    minHeight: '60%',
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  filterModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    flexShrink: 0,
  },
  filterModalTitle: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
  },
  filterModalScrollView: {
    flex: 1,
  },
  filterModalContentContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 17,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 14,
  },
  priceRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceInputContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 8,
  },
  priceInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
  },
  priceRangeSeparator: {
    fontSize: 18,
    fontFamily: 'Nunito_600SemiBold',
    marginTop: 24,
  },
  filterChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'flex-start',
  },
  filterChip: {
    width: '31%',
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  filterModalFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    flexShrink: 0,
  },
  filterResetButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterResetText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  filterApplyButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterApplyText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
});

export default RenterHomeScreen;
