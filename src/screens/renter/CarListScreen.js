import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Card } from '../../packages/components';

// Import car images
const carImage1 = require('../../../assets/images/car1.jpg');
const carImage2 = require('../../../assets/images/car2.jpg');
const carImage3 = require('../../../assets/images/car3.jpg');
const carImage4 = require('../../../assets/images/car4.jpg');

const CarListScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { classId } = route.params || {};

  const [likedCars, setLikedCars] = useState(new Set());

  // All cars data organized by class
  const allCarsByClass = {
    essential: [
      {
        id: 1,
        name: 'Toyota Corolla',
        price: 'KSh 4,500/day',
        seats: 5,
        fuel: 'Petrol',
        color: 'White',
        transmission: 'Automatic',
        image: carImage1,
      },
      {
        id: 2,
        name: 'Honda Civic',
        price: 'KSh 4,800/day',
        seats: 5,
        fuel: 'Petrol',
        color: 'Silver',
        transmission: 'Automatic',
        image: carImage2,
      },
      {
        id: 3,
        name: 'Nissan Sentra',
        price: 'KSh 4,200/day',
        seats: 5,
        fuel: 'Petrol',
        color: 'Black',
        transmission: 'Manual',
        image: carImage3,
      },
      {
        id: 10,
        name: 'Mazda 3',
        price: 'KSh 4,600/day',
        seats: 5,
        fuel: 'Petrol',
        color: 'Blue',
        transmission: 'Automatic',
        image: carImage4,
      },
    ],
    executive: [
      {
        id: 4,
        name: 'BMW 5 Series',
        price: 'KSh 12,000/day',
        seats: 5,
        fuel: 'Petrol',
        color: 'Black',
        transmission: 'Automatic',
        image: carImage4,
      },
      {
        id: 5,
        name: 'Mercedes E-Class',
        price: 'KSh 12,500/day',
        seats: 5,
        fuel: 'Petrol',
        color: 'Silver',
        transmission: 'Automatic',
        image: carImage1,
      },
      {
        id: 6,
        name: 'Audi A6',
        price: 'KSh 11,800/day',
        seats: 5,
        fuel: 'Petrol',
        color: 'White',
        transmission: 'Automatic',
        image: carImage2,
      },
      {
        id: 11,
        name: 'Lexus ES',
        price: 'KSh 13,000/day',
        seats: 5,
        fuel: 'Petrol',
        color: 'Black',
        transmission: 'Automatic',
        image: carImage3,
      },
    ],
    signature: [
      {
        id: 7,
        name: 'Tesla Model S',
        price: 'KSh 20,000/day',
        seats: 5,
        fuel: 'Electric',
        color: 'Red',
        transmission: 'Automatic',
        image: carImage3,
      },
      {
        id: 8,
        name: 'Porsche 911',
        price: 'KSh 35,000/day',
        seats: 2,
        fuel: 'Petrol',
        color: 'Black',
        transmission: 'Manual',
        image: carImage4,
      },
      {
        id: 9,
        name: 'Bentley Continental',
        price: 'KSh 45,000/day',
        seats: 4,
        fuel: 'Petrol',
        color: 'White',
        transmission: 'Automatic',
        image: carImage1,
      },
      {
        id: 12,
        name: 'Lamborghini Huracán',
        price: 'KSh 50,000/day',
        seats: 2,
        fuel: 'Petrol',
        color: 'Yellow',
        transmission: 'Automatic',
        image: carImage2,
      },
    ],
  };

  const classNames = {
    essential: 'Essential',
    executive: 'Executive',
    signature: 'Signature',
  };

  const displayedCars = classId ? allCarsByClass[classId] || [] : Object.values(allCarsByClass).flat();

  useLayoutEffect(() => {
    const title = classId ? `${classNames[classId]} Cars` : 'Available Cars';
    navigation.setOptions({
      title,
    });
  }, [navigation, classId]);

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
      {displayedCars.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="car-outline" size={64} color={theme.colors.hint} />
          <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
            No cars available
          </Text>
        </View>
      ) : (
        <View style={styles.carsGrid}>
          {displayedCars.map((car) => (
            <TouchableOpacity
              key={car.id}
              onPress={() => handleCarPress(car)}
              activeOpacity={0.8}
              style={styles.carCardWrapper}
            >
              <Card style={styles.carCard}>
                <View style={styles.carImageContainer}>
                  <Image source={car.image} style={styles.carImage} resizeMode="cover" />
                  <View style={styles.carActions}>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        toggleLike(car.id);
                      }}
                      style={[styles.actionButton, { backgroundColor: theme.colors.white }]}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={likedCars.has(car.id) ? 'heart' : 'heart-outline'}
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

export default CarListScreen;
