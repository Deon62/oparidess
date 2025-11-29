import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Card, Button } from '../../packages/components';

// Import car images
const carImage1 = require('../../../assets/images/car1.jpg');
const carImage2 = require('../../../assets/images/car2.jpg');
const carImage3 = require('../../../assets/images/car3.jpg');
const carImage4 = require('../../../assets/images/car4.jpg');
const carImage = require('../../../assets/images/car.jpg');

const OwnerCarsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  // Mock owner's cars data
  const [myCars, setMyCars] = useState([
    {
      id: 1,
      name: 'Toyota Corolla',
      price: 'KSh 4,500/day',
      seats: 5,
      fuel: 'Petrol',
      color: 'White',
      transmission: 'Automatic',
      image: carImage1,
      status: 'available', // 'available', 'rented', 'maintenance', 'unavailable'
      location: 'Nairobi CBD',
      rating: 4.8,
      totalBookings: 24,
      totalEarnings: 'KSh 108,000',
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
      status: 'rented',
      location: 'Westlands',
      rating: 4.9,
      totalBookings: 18,
      totalEarnings: 'KSh 86,400',
      currentRenter: 'John Doe',
      returnDate: '2024-01-18',
    },
    {
      id: 3,
      name: 'BMW 5 Series',
      price: 'KSh 12,000/day',
      seats: 5,
      fuel: 'Petrol',
      color: 'Black',
      transmission: 'Automatic',
      image: carImage4,
      status: 'available',
      location: 'Karen',
      rating: 4.7,
      totalBookings: 12,
      totalEarnings: 'KSh 144,000',
    },
    {
      id: 4,
      name: 'Tesla Model S',
      price: 'KSh 20,000/day',
      seats: 5,
      fuel: 'Electric',
      color: 'Red',
      transmission: 'Automatic',
      image: carImage3,
      status: 'maintenance',
      location: 'Kilimani',
      rating: 5.0,
      totalBookings: 8,
      totalEarnings: 'KSh 160,000',
    },
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('CarsTab', {
              screen: 'AddCar',
            });
          }}
          style={styles.addButton}
          activeOpacity={0.7}
        >
          <Ionicons name="add-circle-outline" size={28} color={theme.colors.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, theme]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return '#4CAF50';
      case 'rented':
        return '#FFA500';
      case 'maintenance':
        return '#FF3B30';
      case 'unavailable':
        return '#9E9E9E';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'rented':
        return 'Rented';
      case 'maintenance':
        return 'Maintenance';
      case 'unavailable':
        return 'Unavailable';
      default:
        return 'Unknown';
    }
  };

  const handleEditCar = (car) => {
    // TODO: Navigate to edit car screen
    console.log('Edit car:', car.id);
  };

  const handleDeleteCar = (car) => {
    Alert.alert(
      'Delete Car',
      `Are you sure you want to delete ${car.name}? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setMyCars(myCars.filter((c) => c.id !== car.id));
            Alert.alert('Success', 'Car deleted successfully');
          },
        },
      ]
    );
  };

  const handleViewCar = (car) => {
    // TODO: Navigate to car details/edit screen
    console.log('View car:', car.id);
  };

  const handleToggleStatus = (car) => {
    const newStatus = car.status === 'available' ? 'unavailable' : 'available';
    setMyCars(
      myCars.map((c) => (c.id === car.id ? { ...c, status: newStatus } : c))
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Summary Stats */}
      <View style={styles.summaryContainer}>
        <Card style={[styles.summaryCard, { backgroundColor: '#FF6B35' }]}>
          <Ionicons name="car-outline" size={24} color={theme.colors.white} />
          <Text style={[styles.summaryValue, { color: theme.colors.white }]}>
            {myCars.length}
          </Text>
          <Text style={[styles.summaryLabel, { color: 'rgba(255, 255, 255, 0.9)' }]}>
            Total Cars
          </Text>
        </Card>
        <Card style={[styles.summaryCard, { backgroundColor: '#FFD93D' }]}>
          <Ionicons name="checkmark-circle-outline" size={24} color={theme.colors.white} />
          <Text style={[styles.summaryValue, { color: theme.colors.white }]}>
            {myCars.filter((c) => c.status === 'available').length}
          </Text>
          <Text style={[styles.summaryLabel, { color: 'rgba(255, 255, 255, 0.9)' }]}>
            Available
          </Text>
        </Card>
        <Card style={[styles.summaryCard, { backgroundColor: '#0A1D37' }]}>
          <Ionicons name="time-outline" size={24} color={theme.colors.white} />
          <Text style={[styles.summaryValue, { color: theme.colors.white }]}>
            {myCars.filter((c) => c.status === 'rented').length}
          </Text>
          <Text style={[styles.summaryLabel, { color: 'rgba(255, 255, 255, 0.9)' }]}>
            Rented
          </Text>
        </Card>
      </View>

      {/* Cars List */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          My Cars
        </Text>

        {myCars.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: theme.colors.white }]}>
            <Ionicons name="car-outline" size={64} color={theme.colors.hint} />
            <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
              No cars listed yet
            </Text>
            <Text style={[styles.emptyStateSubtext, { color: theme.colors.hint }]}>
              Add your first car to start earning
            </Text>
            <Button
              title="Add Car"
              onPress={() => {
                navigation.navigate('CarsTab', {
                  screen: 'AddCar',
                });
              }}
              variant="primary"
              style={styles.emptyStateButton}
            />
          </View>
        ) : (
          myCars.map((car) => (
            <Card key={car.id} style={[styles.carCard, { backgroundColor: theme.colors.white }]}>
              <TouchableOpacity
                onPress={() => handleViewCar(car)}
                activeOpacity={0.7}
                style={styles.carContent}
              >
                {/* Car Image and Status */}
                <View style={styles.carImageContainer}>
                  <Image source={car.image} style={styles.carImage} resizeMode="cover" />
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(car.status) + '20' }]}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(car.status) }]} />
                    <Text style={[styles.statusText, { color: getStatusColor(car.status) }]}>
                      {getStatusLabel(car.status)}
                    </Text>
                  </View>
                </View>

                {/* Car Info */}
                <View style={styles.carInfo}>
                  <View style={styles.carHeader}>
                    <View style={styles.carHeaderLeft}>
                      <Text style={[styles.carName, { color: theme.colors.textPrimary }]}>
                        {car.name}
                      </Text>
                      <View style={styles.carRating}>
                        <Ionicons name="star" size={14} color="#FFA500" />
                        <Text style={[styles.ratingText, { color: theme.colors.textSecondary }]}>
                          {car.rating}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.carPrice, { color: theme.colors.primary }]}>
                      {car.price}
                    </Text>
                  </View>

                  {/* Car Details */}
                  <View style={styles.carDetails}>
                    <View style={styles.carDetailItem}>
                      <Ionicons name="people-outline" size={16} color={theme.colors.hint} />
                      <Text style={[styles.carDetailText, { color: theme.colors.textSecondary }]}>
                        {car.seats} seats
                      </Text>
                    </View>
                    <View style={styles.carDetailItem}>
                      <Ionicons name="flash-outline" size={16} color={theme.colors.hint} />
                      <Text style={[styles.carDetailText, { color: theme.colors.textSecondary }]}>
                        {car.fuel}
                      </Text>
                    </View>
                    <View style={styles.carDetailItem}>
                      <Ionicons name="color-palette-outline" size={16} color={theme.colors.hint} />
                      <Text style={[styles.carDetailText, { color: theme.colors.textSecondary }]}>
                        {car.color}
                      </Text>
                    </View>
                    <View style={styles.carDetailItem}>
                      <Ionicons name="settings-outline" size={16} color={theme.colors.hint} />
                      <Text style={[styles.carDetailText, { color: theme.colors.textSecondary }]}>
                        {car.transmission}
                      </Text>
                    </View>
                  </View>

                  {/* Location */}
                  <View style={styles.carLocation}>
                    <Ionicons name="location-outline" size={14} color={theme.colors.hint} />
                    <Text style={[styles.locationText, { color: theme.colors.textSecondary }]}>
                      {car.location}
                    </Text>
                  </View>

                  {/* Stats */}
                  <View style={styles.carStats}>
                    <View style={styles.carStatItem}>
                      <Text style={[styles.carStatValue, { color: theme.colors.textPrimary }]}>
                        {car.totalBookings}
                      </Text>
                      <Text style={[styles.carStatLabel, { color: theme.colors.textSecondary }]}>
                        Bookings
                      </Text>
                    </View>
                    <View style={styles.carStatItem}>
                      <Text style={[styles.carStatValue, { color: '#4CAF50' }]}>
                        {car.totalEarnings}
                      </Text>
                      <Text style={[styles.carStatLabel, { color: theme.colors.textSecondary }]}>
                        Total Earnings
                      </Text>
                    </View>
                  </View>

                  {/* Current Renter Info (if rented) */}
                  {car.status === 'rented' && car.currentRenter && (
                    <View style={[styles.renterInfo, { backgroundColor: theme.colors.background }]}>
                      <Ionicons name="person-outline" size={16} color={theme.colors.primary} />
                      <Text style={[styles.renterText, { color: theme.colors.textSecondary }]}>
                        Rented by {car.currentRenter} • Returns {new Date(car.returnDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>

              {/* Action Buttons */}
              <View style={styles.carActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton, { borderColor: theme.colors.primary }]}
                  onPress={() => handleEditCar(car)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="create-outline" size={18} color={theme.colors.primary} />
                  <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>
                    Edit
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    car.status === 'available' 
                      ? { backgroundColor: theme.colors.hint + '30', borderColor: theme.colors.hint }
                      : { backgroundColor: '#4CAF50' + '20', borderColor: '#4CAF50' }
                  ]}
                  onPress={() => handleToggleStatus(car)}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name={car.status === 'available' ? 'eye-off-outline' : 'eye-outline'} 
                    size={18} 
                    color={car.status === 'available' ? theme.colors.textSecondary : '#4CAF50'} 
                  />
                  <Text style={[
                    styles.actionButtonText, 
                    { color: car.status === 'available' ? theme.colors.textSecondary : '#4CAF50' }
                  ]}>
                    {car.status === 'available' ? 'Make Unavailable' : 'Make Available'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton, { borderColor: '#FF3B30' }]}
                  onPress={() => handleDeleteCar(car)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={18} color="#FF3B30" />
                  <Text style={[styles.actionButtonText, { color: '#FF3B30' }]}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))
        )}
      </View>

      {/* Bottom Spacing */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  addButton: {
    padding: 8,
    marginRight: 8,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 16,
    aspectRatio: 1, // Make cards square
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  summaryValue: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginTop: 8,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontFamily: 'Nunito_600SemiBold',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
  },
  emptyStateButton: {
    marginTop: 8,
  },
  carCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  carContent: {
    padding: 16,
  },
  carImageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  carImage: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
  },
  carInfo: {
    gap: 12,
  },
  carHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  carHeaderLeft: {
    flex: 1,
  },
  carName: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  carRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  carPrice: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
  },
  carDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  carDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  carDetailText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  carLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  carStats: {
    flexDirection: 'row',
    gap: 24,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  carStatItem: {
    flex: 1,
  },
  carStatValue: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  carStatLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  renterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    gap: 8,
    marginTop: 8,
  },
  renterText: {
    fontSize: 13,
    fontFamily: 'Nunito_400Regular',
    flex: 1,
  },
  carActions: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  editButton: {
    backgroundColor: 'transparent',
  },
  deleteButton: {
    backgroundColor: 'transparent',
  },
  actionButtonText: {
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
  },
});

export default OwnerCarsScreen;
