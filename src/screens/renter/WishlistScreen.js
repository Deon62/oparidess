import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Card } from '../../packages/components';

// Import car images
const carImage1 = require('../../../assets/images/car1.jpg');
const carImage2 = require('../../../assets/images/car2.jpg');
const carImage3 = require('../../../assets/images/car3.jpg');
const carImage4 = require('../../../assets/images/car4.jpg');

const WishlistScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [likedCars, setLikedCars] = useState(new Set([1, 4, 7])); // Mock liked car IDs

  // Mock liked cars data
  const allCars = [
    {
      id: 1,
      name: 'Toyota Corolla',
      price: '$45/day',
      seats: 5,
      fuel: 'Petrol',
      color: 'White',
      transmission: 'Automatic',
      image: carImage1,
      class: 'Essential',
    },
    {
      id: 4,
      name: 'BMW 5 Series',
      price: '$120/day',
      seats: 5,
      fuel: 'Petrol',
      color: 'Black',
      transmission: 'Automatic',
      image: carImage4,
      class: 'Executive',
    },
    {
      id: 7,
      name: 'Tesla Model S',
      price: '$200/day',
      seats: 5,
      fuel: 'Electric',
      color: 'Red',
      transmission: 'Automatic',
      image: carImage3,
      class: 'Signature',
    },
  ];

  const likedCarsList = allCars.filter((car) => likedCars.has(car.id));

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Wishlist',
    });
  }, [navigation]);

  const toggleLike = (carId) => {
    setLikedCars((prev) => {
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

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {likedCarsList.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={64} color={theme.colors.hint} />
          <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
            No liked cars yet
          </Text>
          <Text style={[styles.emptyStateSubtext, { color: theme.colors.hint }]}>
            Start liking cars you're interested in to find them easily later
          </Text>
        </View>
      ) : (
        <View style={styles.carsGrid}>
          {likedCarsList.map((car) => (
            <TouchableOpacity
              key={car.id}
              onPress={() => handleCarPress(car)}
              activeOpacity={0.8}
              style={styles.carCardWrapper}
            >
              <Card style={styles.carCard}>
                <View style={styles.carImageContainer}>
                  <Image source={car.image} style={styles.carImage} resizeMode="cover" />
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleLike(car.id);
                    }}
                    style={[styles.likeButton, { backgroundColor: theme.colors.white }]}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="heart"
                      size={20}
                      color="#FF3B30"
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.carInfo}>
                  <Text style={[styles.carName, { color: theme.colors.textPrimary }]}>
                    {car.name}
                  </Text>
                  <Text style={[styles.carPrice, { color: theme.colors.primary }]}>
                    {car.price}
                  </Text>
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
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyStateText: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginTop: 24,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  carsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  carCardWrapper: {
    width: '48%',
    minWidth: 160,
  },
  carCard: {
    width: '100%',
    padding: 0,
    overflow: 'hidden',
    borderWidth: 0,
  },
  carImageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
    overflow: 'hidden',
  },
  carImage: {
    width: '100%',
    height: '100%',
  },
  likeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  carInfo: {
    padding: 18,
  },
  carName: {
    fontSize: 17,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 8,
  },
  carPrice: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 12,
  },
  carDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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

export default WishlistScreen;

