import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Card } from '../../packages/components';

// Car images now loaded from Supabase
import { getCarPrimaryImage, getCarImages, getCarVideoUrl } from '../../packages/utils/supabaseImages';

const CarListScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { classId, categoryId, isCommercial, selectedCity = 'your area' } = route.params || {};
  const activeCategoryId = isCommercial ? categoryId : classId;

  const [likedCars, setLikedCars] = useState(new Set());

  // All cars data organized by class - matching RenterHomeScreen
  const allCarsByClass = {
    essential: [
      {
        id: 1,
        name: 'BMW X Series',
        price: 'KSh 15,000/day',
        seats: 5,
        fuel: 'Petrol',
        color: 'White',
        transmission: 'Automatic',
        imageUri: getCarPrimaryImage('x'),
        imageKey: 'x',
        images: getCarImages('x'),
        videoUrl: getCarVideoUrl(),
        rating: 4.8,
        tag: 'Premium SUV',
      },
      {
        id: 2,
        name: 'Audi A6',
        price: 'KSh 12,000/day',
        seats: 5,
        fuel: 'Petrol',
        color: 'Silver',
        transmission: 'Automatic',
        imageUri: getCarPrimaryImage('audi'),
        imageKey: 'audi',
        images: getCarImages('audi'),
        videoUrl: getCarVideoUrl(),
        rating: 4.7,
        tag: 'Executive',
      },
    ],
    executive: [
      {
        id: 4,
        name: 'Porsche 911',
        price: 'KSh 35,000/day',
        seats: 2,
        fuel: 'Petrol',
        color: 'Black',
        transmission: 'Automatic',
        imageUri: getCarPrimaryImage('porsche'),
        imageKey: 'porsche',
        images: getCarImages('porsche'),
        videoUrl: getCarVideoUrl(),
        rating: 4.9,
        tag: 'Boss Vibe',
      },
      {
        id: 5,
        name: 'Mercedes E-Class',
        price: 'KSh 18,000/day',
        seats: 5,
        fuel: 'Petrol',
        color: 'Silver',
        transmission: 'Automatic',
        imageUri: getCarPrimaryImage('mercedes'),
        imageKey: 'mercedes',
        images: getCarImages('mercedes'),
        videoUrl: getCarVideoUrl(),
        rating: 4.8,
        tag: 'Luxury Sedan',
      },
      {
        id: 6,
        name: 'BMW 5 Series',
        price: 'KSh 16,000/day',
        seats: 5,
        fuel: 'Petrol',
        color: 'Black',
        transmission: 'Automatic',
        imageUri: getCarPrimaryImage('i'),
        imageKey: 'i',
        images: getCarImages('i'),
        videoUrl: getCarVideoUrl(),
        rating: 4.8,
        tag: 'Premium',
      },
      {
        id: 11,
        name: 'BMW M5 CSL',
        price: 'KSh 45,000/day',
        seats: 5,
        fuel: 'Petrol',
        color: 'Black',
        transmission: 'Automatic',
        imageUri: getCarPrimaryImage('bmw1'),
        imageKey: 'bmw1',
        images: getCarImages('bmw1'),
        videoUrl: getCarVideoUrl(),
        rating: 4.9,
        tag: 'Track Ready',
      },
      {
        id: 12,
        name: 'BMW M5 Hybrid',
        price: 'KSh 42,000/day',
        seats: 5,
        fuel: 'Hybrid',
        color: 'Blue',
        transmission: 'Automatic',
        imageUri: getCarPrimaryImage('m5'),
        imageKey: 'm5',
        images: getCarImages('m5'),
        videoUrl: getCarVideoUrl(),
        rating: 4.8,
        tag: 'Eco Performance',
      },
    ],
    signature: [
      {
        id: 7,
        name: 'Rolls Royce',
        price: 'KSh 80,000/day',
        seats: 4,
        fuel: 'Petrol',
        color: 'White',
        transmission: 'Automatic',
        imageUri: getCarPrimaryImage('rolls'),
        imageKey: 'rolls',
        images: getCarImages('rolls'),
        videoUrl: getCarVideoUrl(),
        rating: 5.0,
        tag: 'Royal Feel',
      },
      {
        id: 8,
        name: 'Bentley Continental',
        price: 'KSh 65,000/day',
        seats: 4,
        fuel: 'Petrol',
        color: 'White',
        transmission: 'Automatic',
        imageUri: getCarPrimaryImage('bentley'),
        imageKey: 'bentley',
        images: getCarImages('bentley'),
        videoUrl: getCarVideoUrl(),
        rating: 4.9,
        tag: 'Ultra Luxury',
      },
      {
        id: 9,
        name: 'Lamborghini Huracán',
        price: 'KSh 95,000/day',
        seats: 2,
        fuel: 'Petrol',
        color: 'Yellow',
        transmission: 'Automatic',
        imageUri: getCarPrimaryImage('lambo'),
        imageKey: 'lambo',
        images: getCarImages('lambo'),
        videoUrl: getCarVideoUrl(),
        rating: 5.0,
        tag: 'Supercar',
      },
      {
        id: 10,
        name: 'Tesla Model S',
        price: 'KSh 45,000/day',
        seats: 5,
        fuel: 'Electric',
        color: 'Red',
        transmission: 'Automatic',
        imageUri: getCarPrimaryImage('tesla'),
        imageKey: 'tesla',
        images: getCarImages('tesla'),
        videoUrl: getCarVideoUrl(),
        rating: 4.9,
        tag: 'Electric Luxury',
      },
    ],
    pickups: [
      {
        id: 101,
        name: 'Pickup Truck',
        price: 'KSh 8,000/day',
        seats: 5,
        fuel: 'Diesel',
        color: 'White',
        transmission: 'Manual',
        imageUri: getCarPrimaryImage('pickup'),
        imageKey: 'pickup',
        images: getCarImages('pickup'),
        videoUrl: getCarVideoUrl(),
        rating: 4.9,
        tag: 'Best Offroader',
      },
    ],
    vans: [
      {
        id: 201,
        name: 'Van',
        price: 'KSh 10,000/day',
        seats: 14,
        fuel: 'Diesel',
        color: 'White',
        transmission: 'Manual',
        imageUri: getCarPrimaryImage('van'),
        imageKey: 'van',
        images: getCarImages('van'),
        videoUrl: getCarVideoUrl(),
        rating: 4.8,
        tag: 'Spacious',
      },
    ],
    trucks: [
      {
        id: 301,
        name: 'Truck',
        price: 'KSh 15,000/day',
        seats: 3,
        fuel: 'Diesel',
        color: 'White',
        transmission: 'Manual',
        imageUri: getCarPrimaryImage('truck'),
        imageKey: 'truck',
        images: getCarImages('truck'),
        videoUrl: getCarVideoUrl(),
        rating: 4.8,
        tag: 'Heavy Duty',
      },
    ],
  };

  // Create psychologically intriguing titles for each category
  const getCategoryTitle = (categoryId) => {
    const titles = {
      'essential': `Cars available near you in ${selectedCity}`,
      'executive': `Premium vehicles for your special moments`,
      'signature': `Elite collection for unforgettable experiences`,
      'pickups': `Rugged pickups ready for your next adventure`,
      'vans': `Spacious vans perfect for group travel`,
      'trucks': `Heavy-duty trucks for commercial needs`,
    };
    return titles[categoryId] || 'Available Cars';
  };

  const displayedCars = activeCategoryId ? allCarsByClass[activeCategoryId] || [] : Object.values(allCarsByClass).flat();

  useLayoutEffect(() => {
    const title = activeCategoryId ? getCategoryTitle(activeCategoryId) : 'Available Cars';
    navigation.setOptions({
      title,
    });
  }, [navigation, activeCategoryId, selectedCity]);

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
        <View style={styles.carsList}>
          {displayedCars.map((car) => (
            <TouchableOpacity
              key={car.id}
              onPress={() => handleCarPress(car)}
              activeOpacity={0.8}
              style={styles.carCardWrapper}
            >
              <Card style={styles.carCard}>
                <View style={styles.carImageContainer}>
                  <Image source={car.imageUri ? { uri: car.imageUri } : { uri: getCarPrimaryImage('x') }} style={styles.carImage} resizeMode="cover" />
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
  carsList: {
    gap: 16,
  },
  carCardWrapper: {
    width: '100%',
  },
  carCard: {
    width: '100%',
    padding: 0,
    overflow: 'hidden',
    borderWidth: 0,
  },
  carImageContainer: {
    width: '100%',
    height: 240,
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
