import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useWishlist } from '../../packages/context/WishlistContext';

const ServiceListScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { categoryId } = route.params || {};
  const { likedServices, toggleServiceLike } = useWishlist();

  // Services data matching RenterHomeScreen
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
    const title = categoryId ? categoryNames[categoryId] : 'All Services';
    navigation.setOptions({
      title,
    });
  }, [navigation, categoryId]);

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
                    <Image source={{ uri: service.image }} style={styles.serviceImage} resizeMode="cover" />
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

