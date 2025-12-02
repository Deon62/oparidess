import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../packages/components';

// Location import
let Location = null;
try {
  Location = require('expo-location');
} catch (e) {
  // expo-location not installed
}

const SearchScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  // Get initial values from route params
  const { 
    initialSearchQuery = '',
    initialLocation = 'Nairobi',
    initialFilters = null,
    initialServiceFilters = null,
    activeTab = 'cars',
  } = route.params || {};

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [filterTab, setFilterTab] = useState(activeTab); // 'cars' or 'services'

  // Vehicle filters
  const [filters, setFilters] = useState(initialFilters || {
    priceRange: { min: 0, max: 50000 },
    categories: [],
    fuelTypes: [],
    seatCounts: [],
  });

  // Service filters
  const [serviceFilters, setServiceFilters] = useState(initialServiceFilters || {
    priceRange: { min: 0, max: 60000 },
    categories: [],
    locations: [],
    minRating: 0,
  });

  // All 47 Kenyan Counties
  const counties = [
    'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa',
    'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
    'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu',
    'Machakos', 'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa',
    'Murang\'a', 'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua',
    'Nyeri', 'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi',
    'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot',
  ];

  // Vehicle categories
  const vehicleCategories = [
    { id: 'essential', name: 'Everyday Picks' },
    { id: 'executive', name: 'Premium & Luxury' },
    { id: 'signature', name: 'Elite Collection' },
    { id: 'pickups', name: 'Pickups' },
    { id: 'vans', name: 'Vans' },
    { id: 'trucks', name: 'Trucks' },
  ];

  const serviceCategories = [
    { id: 'roadtrips', name: 'Road Trips Agencies' },
    { id: 'vipwedding', name: 'VIP Wedding Fleet Hire' },
    { id: 'drivers', name: 'Hire Professional Drivers' },
    { id: 'movers', name: 'Movers' },
    { id: 'autoparts', name: 'Automobile Parts Shop' },
    { id: 'cardetailing', name: 'VIP Car Detailing' },
    { id: 'roadside', name: 'Roadside Assistance' },
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: 'none' },
    });
    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
    };
  }, [navigation]);

  const getCurrentLocation = async () => {
    if (!Location) {
      Alert.alert(
        'Location Service Unavailable',
        'Location services require expo-location package.'
      );
      return;
    }

    setIsGettingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required.');
        setIsGettingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (geocode && geocode.length > 0) {
        const city = geocode[0].city || geocode[0].subAdministrativeArea || 'Current Location';
        setCurrentLocation({ latitude, longitude, city });
        setSelectedLocation(city);
      } else {
        setCurrentLocation({ latitude, longitude, city: 'Current Location' });
        setSelectedLocation('Current Location');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get your location. Please try again.');
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleApply = () => {
    // Get the parent navigator to navigate to the HomeTab and update RenterHome params
    const parent = navigation.getParent();
    if (parent) {
      parent.navigate('HomeTab', {
        screen: 'RenterHome',
        params: {
          searchQuery: searchQuery || '',
          location: selectedLocation || '',
          filters: filterTab === 'cars' ? filters : null,
          serviceFilters: filterTab === 'services' ? serviceFilters : null,
          activeTab: filterTab,
          timestamp: Date.now(), // Add timestamp to ensure params are always new
        },
      });
    } else {
      // Fallback: navigate directly if parent is not available
      navigation.navigate('RenterHome', {
        searchQuery: searchQuery || '',
        location: selectedLocation || '',
        filters: filterTab === 'cars' ? filters : null,
        serviceFilters: filterTab === 'services' ? serviceFilters : null,
        activeTab: filterTab,
        timestamp: Date.now(),
      });
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setFilters({
      priceRange: { min: 0, max: 50000 },
      categories: [],
      fuelTypes: [],
      seatCounts: [],
    });
    setServiceFilters({
      priceRange: { min: 0, max: 60000 },
      categories: [],
      locations: [],
      minRating: 0,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Sticky Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={[styles.backButton, { top: insets.top + 12 }]}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
      </TouchableOpacity>

      {/* Location Dropdown Modal */}
      {showLocationDropdown && (
        <View style={styles.dropdownModalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setShowLocationDropdown(false)}
          />
          <View style={[styles.dropdownModal, { backgroundColor: theme.colors.white }]}>
            <View style={styles.dropdownModalHeader}>
              <Text style={[styles.dropdownModalTitle, { color: theme.colors.textPrimary }]}>
                Select County
              </Text>
              <TouchableOpacity
                onPress={() => setShowLocationDropdown(false)}
                activeOpacity={0.7}
              >
                <Ionicons name="close-outline" size={24} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView 
              style={styles.dropdownModalScrollView}
              showsVerticalScrollIndicator={true}
            >
              {counties.map((county) => (
                <TouchableOpacity
                  key={county}
                  style={[
                    styles.dropdownItem,
                    {
                      backgroundColor: selectedLocation === county ? theme.colors.primary + '15' : 'transparent',
                    },
                  ]}
                  onPress={() => {
                    setSelectedLocation(county);
                    setShowLocationDropdown(false);
                    if (county !== 'Current Location') {
                      setCurrentLocation(null);
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="location"
                    size={18}
                    color={selectedLocation === county ? theme.colors.primary : theme.colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.dropdownItemText,
                      {
                        color: selectedLocation === county ? theme.colors.primary : theme.colors.textPrimary,
                        fontFamily: selectedLocation === county ? 'Nunito_600SemiBold' : 'Nunito_400Regular',
                      },
                    ]}
                  >
                    {county}
                  </Text>
                  {selectedLocation === county && (
                    <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!showLocationDropdown}
      >
        {/* Location Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Location
          </Text>
          
          {/* Get Current Location Button */}
          <TouchableOpacity
            style={[styles.getLocationButton, { 
              backgroundColor: theme.colors.primary,
            }]}
            onPress={getCurrentLocation}
            disabled={isGettingLocation}
            activeOpacity={0.7}
          >
            {isGettingLocation ? (
              <Ionicons name="hourglass-outline" size={20} color={theme.colors.white} />
            ) : (
              <Ionicons name="locate-outline" size={20} color={theme.colors.white} />
            )}
            <Text style={[styles.getLocationButtonText, { color: theme.colors.white }]}>
              {isGettingLocation ? 'Getting Location...' : 'Get Current Location'}
            </Text>
          </TouchableOpacity>

          {/* City Dropdown */}
          <TouchableOpacity
            style={[styles.dropdownButton, { 
              backgroundColor: theme.colors.white,
              borderColor: theme.colors.hint + '40',
            }]}
            onPress={() => setShowLocationDropdown(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="location" size={20} color={theme.colors.primary} />
            <Text style={[styles.dropdownButtonText, { color: theme.colors.textPrimary }]}>
              {selectedLocation}
            </Text>
            <Ionicons 
              name="chevron-down" 
              size={20} 
              color={theme.colors.hint} 
            />
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: theme.colors.hint + '40' }]} />

        {/* Filter Tabs */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, marginBottom: 16 }]}>
            Filter By
          </Text>
          <View style={[styles.filterTabsContainer, { backgroundColor: theme.colors.white }]}>
            <TouchableOpacity
              style={[
                styles.filterTab,
                filterTab === 'cars' && { backgroundColor: '#FF1577' },
              ]}
              onPress={() => setFilterTab('cars')}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.filterTabText,
                { color: filterTab === 'cars' ? theme.colors.white : theme.colors.textSecondary },
                filterTab === 'cars' && { fontFamily: 'Nunito_700Bold' },
              ]}>
                Vehicles
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterTab,
                filterTab === 'services' && { backgroundColor: '#FF1577' },
              ]}
              onPress={() => setFilterTab('services')}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.filterTabText,
                { color: filterTab === 'services' ? theme.colors.white : theme.colors.textSecondary },
                filterTab === 'services' && { fontFamily: 'Nunito_700Bold' },
              ]}>
                Services
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: theme.colors.hint + '40' }]} />

        {/* Vehicle Filters */}
        {filterTab === 'cars' && (
          <View style={styles.section}>
            {/* Price Range */}
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Price Range (per day)
            </Text>
            <View style={styles.priceRangeContainer}>
              <View style={styles.priceInputWrapper}>
                <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>Min</Text>
                <TextInput
                  style={[styles.priceInput, { 
                    borderColor: theme.colors.hint + '40',
                    color: theme.colors.textPrimary,
                    backgroundColor: theme.colors.background,
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
              <Text style={[styles.priceSeparator, { color: theme.colors.textSecondary }]}>-</Text>
              <View style={styles.priceInputWrapper}>
                <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>Max</Text>
                <TextInput
                  style={[styles.priceInput, { 
                    borderColor: theme.colors.hint + '40',
                    color: theme.colors.textPrimary,
                    backgroundColor: theme.colors.background,
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
        )}

        {/* Divider */}
        {filterTab === 'cars' && (
          <View style={[styles.divider, { backgroundColor: theme.colors.hint + '40' }]} />
        )}

        {/* Vehicle Categories */}
        {filterTab === 'cars' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Vehicle Categories
            </Text>
            <View style={styles.chipsContainer}>
              {vehicleCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: filters.categories.includes(category.id)
                        ? theme.colors.primary
                        : theme.colors.background,
                      borderColor: filters.categories.includes(category.id)
                        ? theme.colors.primary
                        : theme.colors.hint + '40',
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
                      styles.chipText,
                      {
                        color: filters.categories.includes(category.id)
                          ? theme.colors.white
                          : theme.colors.textPrimary,
                      }
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Divider */}
        {filterTab === 'cars' && (
          <View style={[styles.divider, { backgroundColor: theme.colors.hint + '40' }]} />
        )}

        {/* Fuel Types */}
        {filterTab === 'cars' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Fuel Type
            </Text>
            <View style={styles.chipsContainer}>
              {['Petrol', 'Diesel', 'Electric'].map((fuelType) => (
                <TouchableOpacity
                  key={fuelType}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: filters.fuelTypes.includes(fuelType.toLowerCase())
                        ? theme.colors.primary
                        : theme.colors.background,
                      borderColor: filters.fuelTypes.includes(fuelType.toLowerCase())
                        ? theme.colors.primary
                        : theme.colors.hint + '40',
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
                      styles.chipText,
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
        )}

        {/* Service Filters */}
        {filterTab === 'services' && (
          <>
            <View style={styles.section}>
              {/* Price Range */}
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                Price Range
              </Text>
              <View style={styles.priceRangeContainer}>
                <View style={styles.priceInputWrapper}>
                  <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>Min</Text>
                  <TextInput
                    style={[styles.priceInput, { 
                      borderColor: theme.colors.hint + '40',
                      color: theme.colors.textPrimary,
                      backgroundColor: theme.colors.background,
                    }]}
                    placeholder="0"
                    placeholderTextColor={theme.colors.hint}
                    keyboardType="numeric"
                    value={serviceFilters.priceRange.min > 0 ? serviceFilters.priceRange.min.toString() : ''}
                    onChangeText={(text) => {
                      const value = text === '' ? 0 : parseInt(text) || 0;
                      setServiceFilters(prev => ({
                        ...prev,
                        priceRange: { ...prev.priceRange, min: value }
                      }));
                    }}
                  />
                </View>
                <Text style={[styles.priceSeparator, { color: theme.colors.textSecondary }]}>-</Text>
                <View style={styles.priceInputWrapper}>
                  <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>Max</Text>
                  <TextInput
                    style={[styles.priceInput, { 
                      borderColor: theme.colors.hint + '40',
                      color: theme.colors.textPrimary,
                      backgroundColor: theme.colors.background,
                    }]}
                    placeholder="60000"
                    placeholderTextColor={theme.colors.hint}
                    keyboardType="numeric"
                    value={serviceFilters.priceRange.max < 60000 ? serviceFilters.priceRange.max.toString() : ''}
                    onChangeText={(text) => {
                      const value = text === '' ? 60000 : parseInt(text) || 60000;
                      setServiceFilters(prev => ({
                        ...prev,
                        priceRange: { ...prev.priceRange, max: value }
                      }));
                    }}
                  />
                </View>
              </View>
            </View>

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: theme.colors.hint + '40' }]} />

            {/* Service Categories */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                Service Categories
              </Text>
              <View style={styles.chipsContainer}>
                {serviceCategories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: serviceFilters.categories.includes(category.id)
                          ? theme.colors.primary
                          : theme.colors.background,
                        borderColor: serviceFilters.categories.includes(category.id)
                          ? theme.colors.primary
                          : theme.colors.hint + '40',
                      }
                    ]}
                    onPress={() => {
                      setServiceFilters(prev => {
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
                        styles.chipText,
                        {
                          color: serviceFilters.categories.includes(category.id)
                            ? theme.colors.white
                            : theme.colors.textPrimary,
                        }
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: theme.colors.hint + '40' }]} />

            {/* Minimum Rating */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                Minimum Rating
              </Text>
              <View style={styles.chipsContainer}>
                {[0, 4.0, 4.5, 4.7, 4.8, 4.9].map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: serviceFilters.minRating === rating
                          ? theme.colors.primary
                          : theme.colors.background,
                        borderColor: serviceFilters.minRating === rating
                          ? theme.colors.primary
                          : theme.colors.hint + '40',
                      }
                    ]}
                    onPress={() => {
                      setServiceFilters(prev => ({
                        ...prev,
                        minRating: prev.minRating === rating ? 0 : rating
                      }));
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: serviceFilters.minRating === rating
                            ? theme.colors.white
                            : theme.colors.textPrimary,
                        }
                      ]}
                    >
                      {rating === 0 ? 'Any' : `${rating}+ ⭐`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}

        {/* Bottom Spacing */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={[styles.actionBar, { 
        paddingBottom: insets.bottom + 12,
        backgroundColor: theme.colors.white,
        borderTopColor: theme.colors.hint + '40',
      }]}>
        <TouchableOpacity
          style={[styles.resetButton, { 
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.hint + '40',
          }]}
          onPress={handleReset}
          activeOpacity={0.7}
        >
          <Text style={[styles.resetButtonText, { color: theme.colors.textPrimary }]}>
            Reset
          </Text>
        </TouchableOpacity>
        <Button
          title="Apply"
          onPress={handleApply}
          variant="primary"
          style={[styles.applyButton, { flex: 1 }]}
        />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 1000,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    marginVertical: 0,
  },
  getLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    marginBottom: 16,
  },
  getLocationButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  dropdownButtonText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
  },
  dropdownModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  dropdownModal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  dropdownModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dropdownModalTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
  },
  dropdownModalScrollView: {
    maxHeight: 400,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 12,
  },
  dropdownItemText: {
    flex: 1,
    fontSize: 16,
  },
  filterTabsContainer: {
    flexDirection: 'row',
    borderRadius: 28,
    padding: 4,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTabText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  priceRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceInputWrapper: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 8,
  },
  priceInput: {
    borderWidth: 1,
    borderRadius: 28,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
  },
  priceSeparator: {
    fontSize: 18,
    marginTop: 24,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  actionBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 12,
    borderTopWidth: 1,
  },
  resetButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold',
  },
  applyButton: {
    height: 44,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  locationModal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
  },
  locationOptionsContainer: {
    padding: 20,
    gap: 12,
  },
  locationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  locationOptionText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  countyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 12,
  },
  countyItemText: {
    flex: 1,
    fontSize: 16,
  },
});

export default SearchScreen;
