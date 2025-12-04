import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useWishlist } from '../../packages/context/WishlistContext';

// Import driver images
const deonOrinaImage = require('../../../assets/drivers/DeonOrina.webp');
const davinMoengaImage = require('../../../assets/drivers/DavinMoenga.webp');
const isaacMuchumaImage = require('../../../assets/drivers/IsaacMuchuma.webp');

// Import mover images
const moverImage1 = require('../../../assets/movers/moverrr.webp');
const moverImage2 = require('../../../assets/movers/moverrrs.webp');
const moverImage3 = require('../../../assets/movers/moverrs.webp');

// Import roadtrip images
const roadtripImage1 = require('../../../assets/roadtrips/road.webp');
const roadtripImage2 = require('../../../assets/roadtrips/roadd.webp');
const roadtripImage3 = require('../../../assets/roadtrips/roads.webp');

// Import roadside assistance images
const roadsideImage1 = require('../../../assets/roadside/assist.webp');
const roadsideImage2 = require('../../../assets/roadside/asssist.webp');
const roadsideImage3 = require('../../../assets/roadside/asssists.webp');

// Import wedding images
const weddingImage1 = require('../../../assets/wedding/wedding.webp');
const weddingImage2 = require('../../../assets/wedding/weddings.webp');
const weddingImage3 = require('../../../assets/wedding/wdding.webp');

// Import detailing images
const detailingImage1 = require('../../../assets/detailing/detailing.webp');
const detailingImage2 = require('../../../assets/detailing/detail.webp');
const detailingImage3 = require('../../../assets/detailing/dettail.webp');

const ServiceListScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { categoryId, selectedCity = 'your area' } = route.params || {};
  const { likedServices, toggleServiceLike } = useWishlist();


  // Services data matching RenterHomeScreen
  const servicesData = {
    roadTrips: [
      { id: 1, name: 'Safari Adventures Kenya', price: 'KSh 15,000/day', image: roadtripImage1, rating: 4.8, location: 'Nairobi' },
      { id: 2, name: 'Coastal Road Trips', price: 'KSh 12,000/day', image: roadtripImage2, rating: 4.6, location: 'Mombasa' },
      { id: 3, name: 'Mountain View Tours', price: 'KSh 18,000/day', image: roadtripImage3, rating: 4.9, location: 'Nakuru' },
    ],
    vipWedding: [
      { id: 1, name: 'Luxury Wedding Fleet', price: 'KSh 50,000/event', image: weddingImage1, rating: 4.9, location: 'Nairobi' },
      { id: 2, name: 'Royal Wedding Cars', price: 'KSh 45,000/event', image: weddingImage2, rating: 4.8, location: 'Nairobi' },
      { id: 3, name: 'Elite Wedding Services', price: 'KSh 55,000/event', image: weddingImage3, rating: 4.9, location: 'Mombasa' },
    ],
    drivers: [
      { id: 1, name: 'Deon Orina', price: 'KSh 2,500/day', image: deonOrinaImage, rating: 4.8, experience: '10 years' },
      { id: 2, name: 'Davin Moenga', price: 'KSh 2,200/day', image: davinMoengaImage, rating: 4.7, experience: '8 years' },
      { id: 3, name: 'Isaac Muchuma', price: 'KSh 2,800/day', image: isaacMuchumaImage, rating: 4.9, experience: '12 years' },
    ],
    movers: [
      { id: 1, name: 'Quick Move Kenya', price: 'KSh 8,000/trip', image: moverImage1, rating: 4.7, location: 'Nairobi' },
      { id: 2, name: 'Reliable Movers', price: 'KSh 7,500/trip', image: moverImage2, rating: 4.6, location: 'Nairobi' },
      { id: 3, name: 'Professional Movers', price: 'KSh 9,000/trip', image: moverImage3, rating: 4.8, location: 'Nairobi' },
    ],
    carDetailing: [
      { id: 1, name: 'Elite Car Spa', price: 'KSh 3,500/service', image: detailingImage1, rating: 4.9, location: 'Nairobi' },
      { id: 2, name: 'Premium Detailing', price: 'KSh 4,000/service', image: detailingImage2, rating: 4.8, location: 'Nairobi' },
      { id: 3, name: 'Luxury Car Care', price: 'KSh 3,800/service', image: detailingImage3, rating: 4.9, location: 'Nairobi' },
    ],
    roadside: [
      { id: 1, name: '24/7 Roadside Help', price: 'KSh 2,000/call', image: roadsideImage1, rating: 4.8, location: 'Nairobi' },
      { id: 2, name: 'Emergency Assist', price: 'KSh 2,200/call', image: roadsideImage2, rating: 4.7, location: 'Nairobi' },
      { id: 3, name: 'Quick Rescue Service', price: 'KSh 1,800/call', image: roadsideImage3, rating: 4.6, location: 'Nairobi' },
    ],
  };

  // Create psychologically intriguing titles for each category
  const getCategoryTitle = (categoryId) => {
    const titles = {
      'roadTrips': `Services available near you in ${selectedCity}`,
      'vipWedding': `Premium wedding fleets for your special day`,
      'drivers': `Professional drivers ready to take the wheel`,
      'movers': `Trusted movers to make relocation easy`,
      'carDetailing': `Premium car detailing to keep your ride shining`,
      'roadside': `Roadside assistance when you need it most`,
    };
    return titles[categoryId] || 'All Services';
  };

  const categoryNames = {
    roadTrips: 'Road Trips Agencies',
    vipWedding: 'VIP Wedding Fleet Hire',
    drivers: 'Hire Professional Drivers',
    movers: 'Movers',
    carDetailing: 'VIP Car Detailing',
    roadside: 'Roadside Assistance',
  };

  const getServiceId = (service, category) => {
    const categoryMap = {
      'roadTrips': 'roadtrips',
      'vipWedding': 'vipwedding',
      'drivers': 'drivers',
      'movers': 'movers',
      'carDetailing': 'cardetailing',
      'roadside': 'roadside',
    };
    const categoryKey = categoryMap[category] || category;
    return `${categoryKey}-${service.id}`;
  };

  const displayedServices = categoryId ? servicesData[categoryId] || [] : Object.values(servicesData).flat();

  useLayoutEffect(() => {
    const title = categoryId ? getCategoryTitle(categoryId) : 'All Services';
    navigation.setOptions({
      title,
    });
  }, [navigation, categoryId, selectedCity]);

  const handleServicePress = (service) => {
    const categoryName = categoryId ? categoryNames[categoryId] : 'Road Trips Agencies';
    navigation.navigate('ServiceDetails', { 
      service, 
      category: categoryName 
    });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {displayedServices.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="briefcase-outline" size={64} color={theme.colors.hint} />
          <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
            No services available
          </Text>
        </View>
      ) : (
        <View style={styles.servicesGrid}>
          {displayedServices.map((service) => {
            const serviceId = getServiceId(service, categoryId || 'roadTrips');
            const isLiked = likedServices.has(serviceId);
            const categoryName = categoryId ? categoryNames[categoryId] : 'Road Trips Agencies';
            
            return (
              <TouchableOpacity
                key={service.id}
                onPress={() => handleServicePress(service)}
                activeOpacity={0.8}
                style={styles.serviceCardWrapper}
              >
                <View style={[styles.serviceCard, { backgroundColor: theme.colors.white }]}>
                  <View style={styles.serviceImageContainer}>
                    <Image 
                      source={service.image} 
                      style={styles.serviceImage} 
                      resizeMode="cover"
                    />
                    <View style={styles.serviceActions}>
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          toggleServiceLike(serviceId);
                        }}
                        style={[styles.actionButton, { backgroundColor: theme.colors.white }]}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name={isLiked ? 'heart' : 'heart-outline'}
                          size={20}
                          color={isLiked ? '#FF3B30' : theme.colors.textPrimary}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.serviceInfo}>
                    <Text style={[styles.serviceName, { color: theme.colors.textPrimary }]} numberOfLines={1}>
                      {service.name}
                    </Text>
                    <View style={styles.serviceDetails}>
                      <View style={styles.serviceDetailItem}>
                        <Ionicons name="star" size={14} color="#FFB800" />
                        <Text style={[styles.serviceDetailText, { color: theme.colors.textSecondary }]}>
                          {service.rating}
                        </Text>
                      </View>
                      {service.location && (
                        <View style={styles.serviceDetailItem}>
                          <Ionicons name="location-outline" size={14} color={theme.colors.hint} />
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
                    <Text style={[styles.servicePrice, { color: theme.colors.primary }]}>
                      {service.price}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
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
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceImageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
    overflow: 'hidden',
  },
  serviceImage: {
    width: '100%',
    height: '100%',
  },
  serviceActions: {
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
  serviceInfo: {
    padding: 16,
  },
  serviceName: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 8,
  },
  serviceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    flexWrap: 'wrap',
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
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
});

export default ServiceListScreen;

