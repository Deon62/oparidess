import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Card } from '../../packages/components';

// Import profile image
const profileImage = require('../../../assets/logo/profile.jpg');

const DriverHistoryScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'completed', 'cancelled'

  // Mock rides data
  const rides = [
    {
      id: 1,
      clientName: 'John Doe',
      clientAvatar: profileImage,
      pickupLocation: 'Nairobi CBD',
      dropoffLocation: 'Jomo Kenyatta Airport',
      distance: '18 km',
      duration: '45 min',
      price: 25,
      grossPrice: 25,
      commission: 3.75,
      netPrice: 21.25,
      date: '2024-01-15',
      time: '2:30 PM',
      status: 'completed',
      rating: 5,
      clientRating: 4.8,
    },
    {
      id: 2,
      clientName: 'Sarah Smith',
      clientAvatar: profileImage,
      pickupLocation: 'Westlands',
      dropoffLocation: 'Karen',
      distance: '12 km',
      duration: '30 min',
      price: 20,
      grossPrice: 20,
      commission: 3.00,
      netPrice: 17.00,
      date: '2024-01-15',
      time: '3:15 PM',
      status: 'completed',
      rating: 5,
      clientRating: 4.9,
    },
    {
      id: 3,
      clientName: 'Michael Brown',
      clientAvatar: profileImage,
      pickupLocation: 'Parklands',
      dropoffLocation: 'Kilimani',
      distance: '8 km',
      duration: '20 min',
      price: 15,
      grossPrice: 15,
      commission: 2.25,
      netPrice: 12.75,
      date: '2024-01-14',
      time: '4:00 PM',
      status: 'completed',
      rating: 4,
      clientRating: 4.7,
    },
    {
      id: 4,
      clientName: 'Emily Davis',
      clientAvatar: profileImage,
      pickupLocation: 'Karen',
      dropoffLocation: 'Westlands',
      distance: '12 km',
      duration: '30 min',
      price: 20,
      grossPrice: 20,
      commission: 3.00,
      netPrice: 17.00,
      date: '2024-01-14',
      time: '11:30 AM',
      status: 'active',
      rating: null,
      clientRating: 4.8,
    },
    {
      id: 5,
      clientName: 'David Wilson',
      clientAvatar: profileImage,
      pickupLocation: 'Kilimani',
      dropoffLocation: 'Nairobi CBD',
      distance: '6 km',
      duration: '15 min',
      price: 12,
      grossPrice: 12,
      commission: 1.80,
      netPrice: 10.20,
      date: '2024-01-13',
      time: '9:00 AM',
      status: 'completed',
      rating: 5,
      clientRating: 4.6,
    },
    {
      id: 6,
      clientName: 'Lisa Anderson',
      clientAvatar: profileImage,
      pickupLocation: 'Nairobi CBD',
      dropoffLocation: 'Westlands',
      distance: '10 km',
      duration: '25 min',
      price: 18,
      grossPrice: 18,
      commission: 2.70,
      netPrice: 15.30,
      date: '2024-01-12',
      time: '1:45 PM',
      status: 'cancelled',
      rating: null,
      clientRating: 4.5,
    },
  ];

  const statusFilters = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  const filteredRides = statusFilter === 'all' 
    ? rides 
    : rides.filter(ride => ride.status === statusFilter);

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'completed':
        return theme.colors.primary;
      case 'cancelled':
        return '#FF3B30';
      default:
        return theme.colors.hint;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return 'radio-button-on';
      case 'completed':
        return 'checkmark-circle';
      case 'cancelled':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const handleRidePress = (ride) => {
    if (ride.status === 'active') {
      navigation.navigate('ActiveRide', { ride });
    } else {
      // TODO: Navigate to ride details screen
      console.log('View ride details:', ride);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Status Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {statusFilters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              {
                backgroundColor: statusFilter === filter.key ? theme.colors.primary : theme.colors.white,
              },
            ]}
            onPress={() => setStatusFilter(filter.key)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterButtonText,
                {
                  color: statusFilter === filter.key ? theme.colors.white : theme.colors.textSecondary,
                  fontFamily: statusFilter === filter.key ? 'Nunito_700Bold' : 'Nunito_600SemiBold',
                },
              ]}
            >
              {filter.label}
            </Text>
            {statusFilter === filter.key && (
              <View style={[styles.filterBadge, { backgroundColor: theme.colors.white + '30' }]}>
                <Text style={[styles.filterBadgeText, { color: theme.colors.white }]}>
                  {rides.filter(r => filter.key === 'all' ? true : r.status === filter.key).length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Rides List */}
      <ScrollView
        style={styles.ridesList}
        contentContainerStyle={styles.ridesListContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredRides.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="car-outline" size={64} color={theme.colors.hint} />
            <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
              No {statusFilter !== 'all' ? statusFilter : ''} rides found
            </Text>
            <Text style={[styles.emptyStateSubtext, { color: theme.colors.hint }]}>
              {statusFilter === 'active' 
                ? 'You don\'t have any active rides at the moment'
                : 'Check back later for new rides'}
            </Text>
          </View>
        ) : (
          filteredRides.map((ride) => (
            <TouchableOpacity
              key={ride.id}
              onPress={() => handleRidePress(ride)}
              activeOpacity={ride.status === 'active' ? 0.7 : 1}
              disabled={ride.status !== 'active'}
            >
              <Card style={[styles.rideCard, { backgroundColor: theme.colors.white }]}>
                {/* Ride Header */}
                <View style={styles.rideHeader}>
                  <View style={styles.rideHeaderLeft}>
                    <Image
                      source={ride.clientAvatar}
                      style={[styles.clientAvatar, { borderColor: theme.colors.primary + '30' }]}
                      resizeMode="cover"
                    />
                    <View style={styles.rideHeaderInfo}>
                      <Text style={[styles.clientName, { color: theme.colors.textPrimary }]}>
                        {ride.clientName}
                      </Text>
                      <View style={styles.rideMeta}>
                        <Text style={[styles.rideDate, { color: theme.colors.textSecondary }]}>
                          {formatDate(ride.date)} • {ride.time}
                        </Text>
                        <View style={styles.ratingContainer}>
                          <Ionicons name="star" size={12} color="#FFA500" />
                          <Text style={[styles.ratingText, { color: theme.colors.textSecondary }]}>
                            {ride.clientRating}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ride.status) + '20' }]}>
                    <Ionicons name={getStatusIcon(ride.status)} size={16} color={getStatusColor(ride.status)} />
                    <Text style={[styles.statusText, { color: getStatusColor(ride.status) }]}>
                      {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                    </Text>
                  </View>
                </View>

                {/* Route */}
                <View style={styles.routeContainer}>
                  <View style={styles.routeItem}>
                    <View style={[styles.routeDot, { backgroundColor: '#4CAF50' }]} />
                    <Text style={[styles.routeText, { color: theme.colors.textPrimary }]} numberOfLines={1}>
                      {ride.pickupLocation}
                    </Text>
                  </View>
                  <View style={[styles.routeLine, { backgroundColor: theme.colors.hint + '30' }]} />
                  <View style={styles.routeItem}>
                    <View style={[styles.routeDot, { backgroundColor: '#F44336' }]} />
                    <Text style={[styles.routeText, { color: theme.colors.textPrimary }]} numberOfLines={1}>
                      {ride.dropoffLocation}
                    </Text>
                  </View>
                </View>

                {/* Ride Details */}
                <View style={styles.rideDetails}>
                  <View style={styles.rideDetailItem}>
                    <Ionicons name="navigate-outline" size={14} color={theme.colors.hint} />
                    <Text style={[styles.rideDetailText, { color: theme.colors.textSecondary }]}>
                      {ride.distance}
                    </Text>
                  </View>
                  <View style={styles.rideDetailItem}>
                    <Ionicons name="time-outline" size={14} color={theme.colors.hint} />
                    <Text style={[styles.rideDetailText, { color: theme.colors.textSecondary }]}>
                      {ride.duration}
                    </Text>
                  </View>
                  {ride.rating && (
                    <View style={styles.rideDetailItem}>
                      <Ionicons name="star" size={14} color="#FFA500" />
                      <Text style={[styles.rideDetailText, { color: theme.colors.textSecondary }]}>
                        Rated {ride.rating}/5
                      </Text>
                    </View>
                  )}
                </View>

                {/* Price Breakdown */}
                <View style={[styles.priceBreakdown, { backgroundColor: theme.colors.background }]}>
                  <View style={styles.priceRow}>
                    <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>
                      Gross Earnings
                    </Text>
                    <Text style={[styles.priceValue, { color: theme.colors.textPrimary }]}>
                      {formatCurrency(ride.grossPrice)}
                    </Text>
                  </View>
                  <View style={styles.priceRow}>
                    <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>
                      Commission (15%)
                    </Text>
                    <Text style={[styles.priceValue, { color: '#FF3B30' }]}>
                      -{formatCurrency(ride.commission)}
                    </Text>
                  </View>
                  <View style={[styles.priceDivider, { backgroundColor: theme.colors.hint + '30' }]} />
                  <View style={styles.priceRow}>
                    <Text style={[styles.priceLabel, { color: theme.colors.textPrimary, fontFamily: 'Nunito_700Bold' }]}>
                      Net Earnings
                    </Text>
                    <Text style={[styles.priceValue, { color: '#4CAF50', fontFamily: 'Nunito_700Bold' }]}>
                      {formatCurrency(ride.netPrice)}
                    </Text>
                  </View>
                </View>

                {/* Action Button for Active Rides */}
                {ride.status === 'active' && (
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => handleRidePress(ride)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="navigate" size={18} color={theme.colors.white} />
                    <Text style={[styles.actionButtonText, { color: theme.colors.white }]}>
                      View Active Ride
                    </Text>
                  </TouchableOpacity>
                )}
              </Card>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filtersContainer: {
    maxHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  filtersContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  filterButtonText: {
    fontSize: 14,
  },
  filterBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  filterBadgeText: {
    fontSize: 11,
    fontFamily: 'Nunito_700Bold',
  },
  ridesList: {
    flex: 1,
  },
  ridesListContent: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
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
    textAlign: 'center',
  },
  rideCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  rideHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  clientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
  },
  rideHeaderInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  rideMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rideDate: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
  },
  routeContainer: {
    marginBottom: 16,
    paddingLeft: 20,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  routeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
    left: 0,
  },
  routeText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    marginLeft: 18,
    flex: 1,
  },
  routeLine: {
    width: 2,
    height: 16,
    marginLeft: 4,
    marginBottom: 8,
  },
  rideDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
    paddingLeft: 20,
  },
  rideDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rideDetailText: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  priceBreakdown: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 13,
    fontFamily: 'Nunito_400Regular',
  },
  priceValue: {
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
  },
  priceDivider: {
    height: 1,
    marginVertical: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
});

export default DriverHistoryScreen;
