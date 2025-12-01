import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '../../packages/components';
import { useWishlist } from '../../packages/context/WishlistContext';

// Import car images
const carImage1 = require('../../../assets/images/car1.webp');
const carImage2 = require('../../../assets/images/car2.webp');
const carImage3 = require('../../../assets/images/car3.webp');
const carImage4 = require('../../../assets/images/car4.webp');
const car5 = require('../../../assets/images/car5.webp');
const car6 = require('../../../assets/images/car6.webp');
const car7 = require('../../../assets/images/car7.webp');
const car8 = require('../../../assets/images/car8.webp');
const car9 = require('../../../assets/images/car9.webp');
const car10 = require('../../../assets/images/car10.webp');
const car11 = require('../../../assets/images/car11.webp');
const car12 = require('../../../assets/images/car12.webp');
const car13 = require('../../../assets/images/car13.webp');

// Import destination images
const mombasaImage = require('../../../assets/images/mombasa.webp');
const nakuruImage = require('../../../assets/images/lNakuru.webp');
const egertonImage = require('../../../assets/images/LEgerton.webp');
const hellsgateImage = require('../../../assets/images/hellsgate.webp');
const pejetaImage = require('../../../assets/images/pejeta.webp');
const eventsImage = require('../../../assets/images/events.webp');
const events1Image = require('../../../assets/images/events1.webp');
const events2Image = require('../../../assets/images/events2.webp');
const events3Image = require('../../../assets/images/events3.webp');

const WishlistScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { likedCars, likedServices, likedDiscover, toggleCarLike, toggleServiceLike, toggleDiscoverLike } = useWishlist();

  // All cars data (matching RenterHomeScreen structure)
  const carClasses = [
    {
      id: 'essential',
      name: 'Essential',
      cars: [
        { id: 1, name: 'Toyota Corolla', price: 'KSh 4,500/day', seats: 5, fuel: 'Petrol', color: 'White', image: carImage1 },
        { id: 2, name: 'Honda Civic', price: 'KSh 4,800/day', seats: 5, fuel: 'Petrol', color: 'Silver', image: carImage2 },
        { id: 3, name: 'Nissan Sentra', price: 'KSh 4,200/day', seats: 5, fuel: 'Petrol', color: 'Black', image: carImage3 },
      ],
    },
    {
      id: 'executive',
      name: 'Executive',
      cars: [
        { id: 4, name: 'BMW 5 Series', price: 'KSh 12,000/day', seats: 5, fuel: 'Petrol', color: 'Black', image: carImage4 },
        { id: 5, name: 'Mercedes E-Class', price: 'KSh 12,500/day', seats: 5, fuel: 'Petrol', color: 'Silver', image: carImage1 },
        { id: 6, name: 'Audi A6', price: 'KSh 11,800/day', seats: 5, fuel: 'Petrol', color: 'White', image: carImage2 },
      ],
    },
    {
      id: 'signature',
      name: 'Signature',
      cars: [
        { id: 7, name: 'Tesla Model S', price: 'KSh 20,000/day', seats: 5, fuel: 'Electric', color: 'Red', image: carImage3 },
        { id: 8, name: 'Porsche 911', price: 'KSh 35,000/day', seats: 2, fuel: 'Petrol', color: 'Black', image: carImage4 },
        { id: 9, name: 'Bentley Continental', price: 'KSh 45,000/day', seats: 4, fuel: 'Petrol', color: 'White', image: carImage1 },
      ],
    },
  ];

  const commercialVehicles = [
    {
      id: 'pickups',
      name: 'Pickups',
      vehicles: [
        { id: 101, name: 'Toyota Hilux', price: 'KSh 8,000/day', seats: 5, fuel: 'Diesel', color: 'White', image: car12 },
        { id: 102, name: 'Ford Ranger', price: 'KSh 8,500/day', seats: 5, fuel: 'Diesel', color: 'Black', image: car5 },
        { id: 103, name: 'Nissan Navara', price: 'KSh 7,500/day', seats: 5, fuel: 'Diesel', color: 'Silver', image: car6 },
      ],
    },
    {
      id: 'vans',
      name: 'Vans',
      vehicles: [
        { id: 201, name: 'Toyota Hiace', price: 'KSh 10,000/day', seats: 14, fuel: 'Diesel', color: 'White', image: car9 },
        { id: 202, name: 'Nissan Urvan', price: 'KSh 9,500/day', seats: 15, fuel: 'Diesel', color: 'White', image: car10 },
        { id: 203, name: 'Mercedes Sprinter', price: 'KSh 12,000/day', seats: 16, fuel: 'Diesel', color: 'White', image: car11 },
      ],
    },
    {
      id: 'trucks',
      name: 'Trucks',
      vehicles: [
        { id: 301, name: 'Isuzu N-Series', price: 'KSh 15,000/day', seats: 3, fuel: 'Diesel', color: 'White', image: car7 },
        { id: 302, name: 'Mitsubishi Fuso', price: 'KSh 16,000/day', seats: 3, fuel: 'Diesel', color: 'White', image: car8 },
        { id: 303, name: 'Hino Truck', price: 'KSh 18,000/day', seats: 3, fuel: 'Diesel', color: 'White', image: car13 },
      ],
    },
  ];

  // Services data
  const servicesData = {
    roadTrips: [
      { id: 1, name: 'Safari Adventures Kenya', price: 'KSh 15,000/day', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', rating: 4.8, location: 'Nairobi' },
      { id: 2, name: 'Coastal Road Trips', price: 'KSh 12,000/day', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400', rating: 4.6, location: 'Mombasa' },
      { id: 3, name: 'Mountain View Tours', price: 'KSh 18,000/day', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400', rating: 4.9, location: 'Nakuru' },
      { id: 4, name: 'Wildlife Explorer', price: 'KSh 20,000/day', image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400', rating: 4.7, location: 'Nairobi' },
    ],
    vipWedding: [
      { id: 1, name: 'Luxury Wedding Fleet', price: 'KSh 50,000/event', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400', rating: 4.9, location: 'Nairobi' },
      { id: 2, name: 'Royal Wedding Cars', price: 'KSh 45,000/event', image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400', rating: 4.8, location: 'Nairobi' },
      { id: 3, name: 'Elite Wedding Services', price: 'KSh 55,000/event', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400', rating: 4.9, location: 'Mombasa' },
      { id: 4, name: 'Premium Wedding Convoys', price: 'KSh 48,000/event', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400', rating: 4.7, location: 'Nairobi' },
    ],
    drivers: [
      { id: 1, name: 'John Kamau', price: 'KSh 2,500/day', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', rating: 4.8, experience: '10 years' },
      { id: 2, name: 'Peter Ochieng', price: 'KSh 2,200/day', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', rating: 4.7, experience: '8 years' },
      { id: 3, name: 'David Mwangi', price: 'KSh 2,800/day', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', rating: 4.9, experience: '12 years' },
      { id: 4, name: 'James Kariuki', price: 'KSh 2,400/day', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', rating: 4.6, experience: '7 years' },
    ],
    movers: [
      { id: 1, name: 'Quick Move Kenya', price: 'KSh 8,000/trip', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', rating: 4.7, location: 'Nairobi' },
      { id: 2, name: 'Reliable Movers', price: 'KSh 7,500/trip', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400', rating: 4.6, location: 'Nairobi' },
      { id: 3, name: 'Professional Movers', price: 'KSh 9,000/trip', image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?w=400', rating: 4.8, location: 'Nairobi' },
      { id: 4, name: 'Express Moving Services', price: 'KSh 8,500/trip', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400', rating: 4.7, location: 'Nairobi' },
    ],
    autoParts: [
      { id: 1, name: 'Auto Parts Hub', price: 'Various', image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400', rating: 4.6, location: 'Nairobi' },
      { id: 2, name: 'Car Parts Express', price: 'Various', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400', rating: 4.7, location: 'Nairobi' },
      { id: 3, name: 'Premium Auto Parts', price: 'Various', image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400', rating: 4.8, location: 'Nairobi' },
      { id: 4, name: 'Quality Parts Store', price: 'Various', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400', rating: 4.5, location: 'Nairobi' },
    ],
    carDetailing: [
      { id: 1, name: 'Elite Car Spa', price: 'KSh 3,500/service', image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400', rating: 4.9, location: 'Nairobi' },
      { id: 2, name: 'Premium Detailing', price: 'KSh 4,000/service', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400', rating: 4.8, location: 'Nairobi' },
      { id: 3, name: 'Luxury Car Care', price: 'KSh 3,800/service', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400', rating: 4.9, location: 'Nairobi' },
      { id: 4, name: 'VIP Auto Detailing', price: 'KSh 4,200/service', image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400', rating: 4.7, location: 'Nairobi' },
    ],
    roadside: [
      { id: 1, name: '24/7 Roadside Help', price: 'KSh 2,000/call', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', rating: 4.8, location: 'Nairobi' },
      { id: 2, name: 'Emergency Assist', price: 'KSh 2,200/call', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400', rating: 4.7, location: 'Nairobi' },
      { id: 3, name: 'Quick Rescue Service', price: 'KSh 1,800/call', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400', rating: 4.6, location: 'Nairobi' },
      { id: 4, name: 'Reliable Roadside', price: 'KSh 2,100/call', image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400', rating: 4.8, location: 'Nairobi' },
    ],
  };

  // Discover items data
  const discoverData = {
    destinations: [
      { id: 'mombasa', name: 'Mombasa Beaches', description: 'Coastal paradise with beautiful beaches', image: mombasaImage },
      { id: 'nakuru', name: 'Lake Nakuru', description: 'Wildlife and scenic lake views', image: nakuruImage },
      { id: 'egerton', name: 'Lord Egerton Castle', description: 'Historic castle with stunning architecture', image: egertonImage },
      { id: 'hellsgate', name: "Hell's Gate", description: 'Spectacular canyon and geothermal park', image: hellsgateImage },
      { id: 'pejeta', name: 'Ol Pejeta Conservancy', description: 'Wildlife conservation and safari experience', image: pejetaImage },
    ],
    events: [
      { id: 'nairobi', name: 'Nairobi Auto Show', description: 'Biggest automotive exhibition in the region', image: eventsImage },
      { id: 'classic', name: 'Classic Car Exhibition', description: 'Vintage and classic vehicles showcase', image: events1Image },
      { id: 'supercar', name: 'Supercar Rally', description: 'High-performance supercars showcase', image: events2Image },
      { id: 'motor', name: 'Motor Expo', description: 'Latest automotive technology and innovations', image: events3Image },
    ],
    blogs: [
      { id: 'roadtrip', name: 'Top 10 Road Trip Destinations in Kenya', description: 'Discover the most breathtaking destinations perfect for your next road trip adventure.', date: '2 days ago', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400' },
      { id: 'maintenance', name: 'Car Maintenance Tips for Long Trips', description: 'Essential maintenance tips to keep your rental car running smoothly during long journeys.', date: '5 days ago', image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400' },
      { id: 'parks', name: "Best Time to Visit Kenya's National Parks", description: 'Plan your safari adventure with our guide to the best times for wildlife viewing.', date: '1 week ago', image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400' },
      { id: 'coastal', name: 'Coastal Getaways: A Complete Guide', description: "Explore Kenya's stunning coastline with our comprehensive travel guide.", date: '2 weeks ago', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400' },
      { id: 'safety', name: 'Safety Tips for Driving in Kenya', description: "Important safety guidelines and driving tips for navigating Kenya's roads confidently.", date: '3 weeks ago', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400' },
    ],
  };

  // Get all vehicles
  const allVehicles = [
    ...carClasses.flatMap(carClass => carClass.cars),
    ...commercialVehicles.flatMap(category => category.vehicles),
  ];

  // Filter liked items
  const likedVehicles = allVehicles.filter(vehicle => likedCars.has(vehicle.id));
  
  const likedServicesList = [
    ...servicesData.roadTrips.filter(b => likedServices.has(`roadtrips-${b.id}`)).map(b => ({ ...b, category: 'Road Trips Agencies' })),
    ...servicesData.vipWedding.filter(b => likedServices.has(`vipwedding-${b.id}`)).map(b => ({ ...b, category: 'VIP Wedding Fleet Hire' })),
    ...servicesData.drivers.filter(b => likedServices.has(`drivers-${b.id}`)).map(b => ({ ...b, category: 'Hire Professional Drivers' })),
    ...servicesData.movers.filter(b => likedServices.has(`movers-${b.id}`)).map(b => ({ ...b, category: 'Movers' })),
    ...servicesData.autoParts.filter(b => likedServices.has(`autoparts-${b.id}`)).map(b => ({ ...b, category: 'Automobile Parts Shop' })),
    ...servicesData.carDetailing.filter(b => likedServices.has(`cardetailing-${b.id}`)).map(b => ({ ...b, category: 'VIP Car Detailing' })),
    ...servicesData.roadside.filter(b => likedServices.has(`roadside-${b.id}`)).map(b => ({ ...b, category: 'Roadside Assistance' })),
  ];

  const likedDiscoverList = {
    destinations: discoverData.destinations.filter(d => likedDiscover.has(`destination-${d.id}`)),
    events: discoverData.events.filter(e => likedDiscover.has(`event-${e.id}`)),
    blogs: discoverData.blogs.filter(b => likedDiscover.has(`blog-${b.id}`)),
  };

  const totalLiked = likedVehicles.length + likedServicesList.length + 
    likedDiscoverList.destinations.length + likedDiscoverList.events.length + likedDiscoverList.blogs.length;

  // Set custom header with status bar
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <View style={[styles.customHeader, { backgroundColor: theme.colors.white, paddingTop: insets.top }]}>
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
              Wishlist
            </Text>
          </View>
        </View>
      ),
    });
  }, [navigation, theme, insets.top]);

  const handleCarPress = (car) => {
    navigation.navigate('CarDetails', { car });
  };

  const handleServicePress = (service) => {
    navigation.navigate('ComingSoon');
  };

  const handleDiscoverPress = (item) => {
    navigation.navigate('ComingSoon');
  };

  const getServiceId = (service) => {
    if (service.category === 'Road Trips Agencies') return `roadtrips-${service.id}`;
    if (service.category === 'VIP Wedding Fleet Hire') return `vipwedding-${service.id}`;
    if (service.category === 'Hire Professional Drivers') return `drivers-${service.id}`;
    if (service.category === 'Movers') return `movers-${service.id}`;
    if (service.category === 'Automobile Parts Shop') return `autoparts-${service.id}`;
    if (service.category === 'VIP Car Detailing') return `cardetailing-${service.id}`;
    if (service.category === 'Roadside Assistance') return `roadside-${service.id}`;
    return '';
  };

  const getDiscoverId = (type, item) => {
    if (type === 'destination') return `destination-${item.id}`;
    if (type === 'event') return `event-${item.id}`;
    if (type === 'blog') return `blog-${item.id}`;
    return '';
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {totalLiked === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={64} color={theme.colors.hint} />
          <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
            Your wishlist is empty
          </Text>
          <Text style={[styles.emptyStateSubtext, { color: theme.colors.hint }]}>
            Start liking vehicles, services, and discover items you're interested in to find them easily later
          </Text>
        </View>
      ) : (
        <>
          {/* Vehicles Section */}
          {likedVehicles.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                Vehicles ({likedVehicles.length})
              </Text>
              <View style={styles.carsGrid}>
                {likedVehicles.map((vehicle) => (
                  <TouchableOpacity
                    key={vehicle.id}
                    onPress={() => handleCarPress(vehicle)}
                    activeOpacity={0.8}
                    style={styles.carCardWrapper}
                  >
                    <Card style={styles.carCard}>
                      <View style={styles.carImageContainer}>
                        <Image source={vehicle.image} style={styles.carImage} resizeMode="cover" />
                        <TouchableOpacity
                          onPress={(e) => {
                            e.stopPropagation();
                            toggleCarLike(vehicle.id);
                          }}
                          style={[styles.likeButton, { backgroundColor: theme.colors.white }]}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="heart" size={20} color="#FF3B30" />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.carInfo}>
                        <Text style={[styles.carName, { color: theme.colors.textPrimary }]}>
                          {vehicle.name}
                        </Text>
                        <Text style={[styles.carPrice, { color: theme.colors.primary }]}>
                          {vehicle.price}
                        </Text>
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
              </View>
            </View>
          )}

          {/* Services Section */}
          {likedServicesList.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                Services ({likedServicesList.length})
              </Text>
              <View style={styles.servicesGrid}>
                {likedServicesList.map((service, index) => (
                  <TouchableOpacity
                    key={`${service.category}-${service.id}-${index}`}
                    onPress={() => handleServicePress(service)}
                    activeOpacity={0.8}
                    style={styles.serviceCardWrapper}
                  >
                    <Card style={styles.serviceCard}>
                      <View style={styles.serviceImageContainer}>
                        <Image source={{ uri: service.image }} style={styles.serviceImage} resizeMode="cover" />
                        <TouchableOpacity
                          onPress={(e) => {
                            e.stopPropagation();
                            toggleServiceLike(getServiceId(service));
                          }}
                          style={[styles.likeButton, { backgroundColor: theme.colors.white }]}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="heart" size={20} color="#FF3B30" />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.serviceInfo}>
                        <Text style={[styles.serviceName, { color: theme.colors.textPrimary }]} numberOfLines={1}>
                          {service.name}
                        </Text>
                        <Text style={[styles.serviceCategory, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                          {service.category}
                        </Text>
                        <View style={styles.serviceDetails}>
                          {service.rating && (
                            <View style={styles.serviceDetailItem}>
                              <Ionicons name="star" size={14} color="#FFB800" />
                              <Text style={[styles.serviceDetailText, { color: theme.colors.textSecondary }]}>
                                {service.rating}
                              </Text>
                            </View>
                          )}
                          {service.location && (
                            <View style={styles.serviceDetailItem}>
                              <Ionicons name="location" size={14} color={theme.colors.hint} />
                              <Text style={[styles.serviceDetailText, { color: theme.colors.hint }]} numberOfLines={1}>
                                {service.location}
                              </Text>
                            </View>
                          )}
                          {service.experience && (
                            <Text style={[styles.serviceDetailText, { color: theme.colors.hint }]}>
                              {service.experience}
                            </Text>
                          )}
                        </View>
                        {service.price && service.price !== 'Various' && (
                          <Text style={[styles.servicePrice, { color: theme.colors.primary }]}>
                            {service.price}
                          </Text>
                        )}
                      </View>
                    </Card>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Discover Section */}
          {(likedDiscoverList.destinations.length > 0 || likedDiscoverList.events.length > 0 || likedDiscoverList.blogs.length > 0) && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                Discover ({likedDiscoverList.destinations.length + likedDiscoverList.events.length + likedDiscoverList.blogs.length})
              </Text>

              {/* Destinations */}
              {likedDiscoverList.destinations.length > 0 && (
                <View style={styles.discoverSubsection}>
                  <Text style={[styles.subsectionTitle, { color: theme.colors.textPrimary }]}>
                    Destinations
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.discoverScrollContainer}>
                    {likedDiscoverList.destinations.map((destination) => (
                      <TouchableOpacity
                        key={destination.id}
                        style={[styles.discoverCard, { backgroundColor: theme.colors.white }]}
                        activeOpacity={0.8}
                        onPress={() => handleDiscoverPress(destination)}
                      >
                        <View style={styles.discoverImageContainer}>
                          <Image source={destination.image} style={styles.discoverImage} resizeMode="cover" />
                          <View style={styles.discoverOverlay} />
                          <TouchableOpacity
                            onPress={(e) => {
                              e.stopPropagation();
                              toggleDiscoverLike(getDiscoverId('destination', destination));
                            }}
                            style={[styles.discoverLikeButton, { backgroundColor: theme.colors.white }]}
                            activeOpacity={0.7}
                          >
                            <Ionicons name="heart" size={18} color="#FF3B30" />
                          </TouchableOpacity>
                        </View>
                        <View style={styles.discoverContent}>
                          <Text style={[styles.discoverName, { color: theme.colors.textPrimary }]}>
                            {destination.name}
                          </Text>
                          <Text style={[styles.discoverDescription, { color: theme.colors.textSecondary }]}>
                            {destination.description}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Events */}
              {likedDiscoverList.events.length > 0 && (
                <View style={styles.discoverSubsection}>
                  <Text style={[styles.subsectionTitle, { color: theme.colors.textPrimary }]}>
                    Car Events
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.discoverScrollContainer}>
                    {likedDiscoverList.events.map((event) => (
                      <TouchableOpacity
                        key={event.id}
                        style={[styles.discoverCard, { backgroundColor: theme.colors.white }]}
                        activeOpacity={0.8}
                        onPress={() => handleDiscoverPress(event)}
                      >
                        <View style={styles.discoverImageContainer}>
                          <Image source={event.image} style={styles.discoverImage} resizeMode="cover" />
                          <View style={styles.discoverOverlay} />
                          <TouchableOpacity
                            onPress={(e) => {
                              e.stopPropagation();
                              toggleDiscoverLike(getDiscoverId('event', event));
                            }}
                            style={[styles.discoverLikeButton, { backgroundColor: theme.colors.white }]}
                            activeOpacity={0.7}
                          >
                            <Ionicons name="heart" size={18} color="#FF3B30" />
                          </TouchableOpacity>
                        </View>
                        <View style={styles.discoverContent}>
                          <Text style={[styles.discoverName, { color: theme.colors.textPrimary }]}>
                            {event.name}
                          </Text>
                          <Text style={[styles.discoverDescription, { color: theme.colors.textSecondary }]}>
                            {event.description}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Blogs */}
              {likedDiscoverList.blogs.length > 0 && (
                <View style={styles.discoverSubsection}>
                  <Text style={[styles.subsectionTitle, { color: theme.colors.textPrimary }]}>
                    Blogs
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.discoverScrollContainer}>
                    {likedDiscoverList.blogs.map((blog) => (
                      <TouchableOpacity
                        key={blog.id}
                        style={[styles.discoverCard, { backgroundColor: theme.colors.white }]}
                        activeOpacity={0.8}
                        onPress={() => handleDiscoverPress(blog)}
                      >
                        <View style={styles.discoverImageContainer}>
                          <Image source={{ uri: blog.image }} style={styles.discoverImage} resizeMode="cover" />
                          <TouchableOpacity
                            onPress={(e) => {
                              e.stopPropagation();
                              toggleDiscoverLike(getDiscoverId('blog', blog));
                            }}
                            style={[styles.discoverLikeButton, { backgroundColor: theme.colors.white }]}
                            activeOpacity={0.7}
                          >
                            <Ionicons name="heart" size={18} color="#FF3B30" />
                          </TouchableOpacity>
                        </View>
                        <View style={styles.discoverContent}>
                          <Text style={[styles.discoverName, { color: theme.colors.textPrimary }]} numberOfLines={2}>
                            {blog.name}
                          </Text>
                          <Text style={[styles.discoverDescription, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                            {blog.description}
                          </Text>
                          <Text style={[styles.blogDate, { color: theme.colors.hint }]}>
                            {blog.date}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  customHeader: {
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_600SemiBold',
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  subsectionTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 12,
    marginTop: 8,
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
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  serviceCardWrapper: {
    width: '48%',
    minWidth: 160,
  },
  serviceCard: {
    width: '100%',
    padding: 0,
    overflow: 'hidden',
    borderWidth: 0,
  },
  serviceImageContainer: {
    width: '100%',
    height: 140,
    position: 'relative',
    overflow: 'hidden',
  },
  serviceImage: {
    width: '100%',
    height: '100%',
  },
  serviceInfo: {
    padding: 12,
  },
  serviceName: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  serviceCategory: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 8,
  },
  serviceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  serviceDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  serviceDetailText: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  servicePrice: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  discoverSubsection: {
    marginBottom: 24,
  },
  discoverScrollContainer: {
    paddingRight: 20,
    gap: 16,
  },
  discoverCard: {
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
  discoverImageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
    overflow: 'hidden',
  },
  discoverImage: {
    width: '100%',
    height: '100%',
  },
  discoverOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  discoverLikeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 20,
  },
  discoverContent: {
    padding: 16,
  },
  discoverName: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  discoverDescription: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  blogDate: {
    fontSize: 11,
    fontFamily: 'Nunito_400Regular',
    marginTop: 8,
  },
});

export default WishlistScreen;
