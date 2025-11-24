import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Card } from '../../packages/components';

// Import profile image
const profileImage = require('../../../assets/logo/profile.jpg');

// Import car images
const carImage1 = require('../../../assets/images/car1.jpg');
const carImage2 = require('../../../assets/images/car2.jpg');
const carImage3 = require('../../../assets/images/car3.jpg');
const carImage4 = require('../../../assets/images/car4.jpg');

const RenterHomeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [likedCars, setLikedCars] = useState(new Set());
  const [bookmarkedCars, setBookmarkedCars] = useState(new Set());

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
        { id: 1, name: 'Toyota Corolla', price: '$45/day', seats: 5, fuel: 'Petrol', color: 'White', image: carImage1 },
        { id: 2, name: 'Honda Civic', price: '$48/day', seats: 5, fuel: 'Petrol', color: 'Silver', image: carImage2 },
        { id: 3, name: 'Nissan Sentra', price: '$42/day', seats: 5, fuel: 'Petrol', color: 'Black', image: carImage3 },
      ],
    },
    {
      id: 'executive',
      name: 'Executive',
      description: 'Premium comfort and style for business travel',
      cars: [
        { id: 4, name: 'BMW 5 Series', price: '$120/day', seats: 5, fuel: 'Petrol', color: 'Black', image: carImage4 },
        { id: 5, name: 'Mercedes E-Class', price: '$125/day', seats: 5, fuel: 'Petrol', color: 'Silver', image: carImage1 },
        { id: 6, name: 'Audi A6', price: '$118/day', seats: 5, fuel: 'Petrol', color: 'White', image: carImage2 },
      ],
    },
    {
      id: 'signature',
      name: 'Signature',
      description: 'Ultra-luxury vehicles for the ultimate experience',
      cars: [
        { id: 7, name: 'Tesla Model S', price: '$200/day', seats: 5, fuel: 'Electric', color: 'Red', image: carImage3 },
        { id: 8, name: 'Porsche 911', price: '$350/day', seats: 2, fuel: 'Petrol', color: 'Black', image: carImage4 },
        { id: 9, name: 'Bentley Continental', price: '$450/day', seats: 4, fuel: 'Petrol', color: 'White', image: carImage1 },
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

  const toggleBookmark = (carId) => {
    setBookmarkedCars(prev => {
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

  const handleViewAll = (classId) => {
    navigation.navigate('CarList', { classId });
  };

  // Set header icons and search bar
  React.useLayoutEffect(() => {
    navigation.setOptions({
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
                  // TODO: Navigate to notifications
                  console.log('Notifications pressed');
                }}
                style={styles.iconButton}
                activeOpacity={0.7}
              >
                <Ionicons name="notifications-outline" size={24} color={theme.colors.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  // TODO: Navigate to profile
                  console.log('Profile pressed');
                }}
                style={styles.profileButton}
                activeOpacity={0.7}
              >
                <View style={styles.profileImageContainer}>
                  <Image source={profileImage} style={styles.profileImage} resizeMode="cover" />
                  <View style={styles.onlineIndicator} />
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ),
    });
  }, [navigation, theme, showSearch, searchQuery]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Car Classes Sections */}
      {carClasses.map((carClass, index) => (
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
                activeOpacity={0.8}
                style={styles.carCardWrapper}
              >
                <Card style={styles.carCard}>
                  <View style={styles.carImageContainer}>
                    <Image 
                      source={car.image || carImages[car.id] || carImage1} 
                      style={styles.carImage}
                      resizeMode="cover"
                    />
                    {/* Bookmark and Like Icons */}
                    <View style={styles.carActions}>
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          toggleBookmark(car.id);
                        }}
                        style={styles.actionButton}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name={bookmarkedCars.has(car.id) ? "bookmark" : "bookmark-outline"}
                          size={20}
                          color={bookmarkedCars.has(car.id) ? theme.colors.primary : theme.colors.textPrimary}
                        />
                      </TouchableOpacity>
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
      ))}
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
});

export default RenterHomeScreen;
