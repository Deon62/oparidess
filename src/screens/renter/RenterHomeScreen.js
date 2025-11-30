import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Animated, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Card } from '../../packages/components';
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

const RenterHomeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
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

  // Get all cars from all classes
  const allCars = carClasses.flatMap(carClass => carClass.cars);
  
  // Filter cars based on search query
  const filteredCars = searchQuery.trim() 
    ? filterCarsBySearch(allCars, searchQuery)
    : null;

  // Filter car classes to show only classes with matching cars when searching
  const filteredCarClasses = searchQuery.trim()
    ? carClasses.map(carClass => ({
        ...carClass,
        cars: filterCarsBySearch(carClass.cars, searchQuery)
      })).filter(carClass => carClass.cars.length > 0)
    : carClasses;

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
      title: '', // Hide the title since we have location icon
      headerLeft: () => (
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
      ),
      headerRight: () => (
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
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('SettingsTab', { screen: 'Notifications' });
                }}
                style={styles.iconButton}
                activeOpacity={0.7}
              >
                <Ionicons name="notifications-outline" size={24} color={theme.colors.textPrimary} />
              </TouchableOpacity>
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
      ),
    });
  }, [navigation, theme, showSearch, searchQuery, selectedCity]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
      {/* Search Results */}
      {searchQuery.trim() && (
        <View style={styles.searchResultsHeader}>
          <Text style={[styles.searchResultsText, { color: theme.colors.textPrimary }]}>
            {filteredCars?.length || 0} {filteredCars?.length === 1 ? 'car' : 'cars'} found for "{searchQuery}" in {selectedCity}
          </Text>
        </View>
      )}

      {/* Car Classes Sections */}
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
      {commercialVehicles.length > 0 ? (
        commercialVehicles.map((category, index) => (
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
  headerLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    gap: 6,
    maxWidth: 150,
  },
  headerLocationText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    flex: 1,
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
});

export default RenterHomeScreen;
