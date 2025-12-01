import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Card, Button } from '../../packages/components';

// Import profile image
const profileImage = require('../../../assets/logo/profile.jpg');

const OwnerBookingsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'active', 'completed', 'cancelled'

  // Mock bookings data
  const bookings = [
    {
      id: 1,
      renterName: 'John Doe',
      renterAvatar: profileImage,
      renterRating: 4.8,
      carName: 'Toyota Corolla',
      carImage: require('../../../assets/images/car1.webp'),
      pickupDate: '2024-01-15',
      dropoffDate: '2024-01-18',
      pickupLocation: 'Nairobi, Kenya',
      dropoffLocation: 'Nairobi, Kenya',
      totalPrice: 'KSh 13,500',
      status: 'active',
      daysRemaining: 2,
      requestDate: '2024-01-10',
    },
    {
      id: 2,
      renterName: 'Sarah Smith',
      renterAvatar: profileImage,
      renterRating: 4.9,
      carName: 'Honda Civic',
      carImage: require('../../../assets/images/car2.webp'),
      pickupDate: '2024-01-20',
      dropoffDate: '2024-01-25',
      pickupLocation: 'Westlands, Nairobi',
      dropoffLocation: 'Karen, Nairobi',
      totalPrice: 'KSh 22,500',
      status: 'pending',
      requestDate: '2024-01-14',
    },
    {
      id: 3,
      renterName: 'Michael Brown',
      renterAvatar: profileImage,
      renterRating: 4.7,
      carName: 'BMW 5 Series',
      carImage: require('../../../assets/images/car3.webp'),
      pickupDate: '2024-01-10',
      dropoffDate: '2024-01-12',
      pickupLocation: 'Nairobi CBD',
      dropoffLocation: 'Jomo Kenyatta Airport',
      totalPrice: 'KSh 40,000',
      status: 'completed',
      requestDate: '2024-01-08',
    },
    {
      id: 4,
      renterName: 'Emily Davis',
      renterAvatar: profileImage,
      renterRating: 4.6,
      carName: 'Tesla Model S',
      carImage: require('../../../assets/images/car4.webp'),
      pickupDate: '2024-01-22',
      dropoffDate: '2024-01-24',
      pickupLocation: 'Karen, Nairobi',
      dropoffLocation: 'Westlands, Nairobi',
      totalPrice: 'KSh 48,000',
      status: 'pending',
      requestDate: '2024-01-16',
    },
    {
      id: 5,
      renterName: 'David Wilson',
      renterAvatar: profileImage,
      renterRating: 4.5,
      carName: 'Toyota Corolla',
      carImage: require('../../../assets/images/car1.webp'),
      pickupDate: '2024-01-05',
      dropoffDate: '2024-01-08',
      pickupLocation: 'Nairobi, Kenya',
      dropoffLocation: 'Nairobi, Kenya',
      totalPrice: 'KSh 13,500',
      status: 'completed',
      requestDate: '2024-01-01',
    },
    {
      id: 6,
      renterName: 'Lisa Anderson',
      renterAvatar: profileImage,
      renterRating: 4.4,
      carName: 'Honda Civic',
      carImage: require('../../../assets/images/car2.webp'),
      pickupDate: '2024-01-18',
      dropoffDate: '2024-01-20',
      pickupLocation: 'Nairobi CBD',
      dropoffLocation: 'Nairobi CBD',
      totalPrice: 'KSh 9,000',
      status: 'cancelled',
      requestDate: '2024-01-12',
    },
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Notifications');
            }}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Messages');
            }}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chatbubble-outline" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('OwnerProfile');
            }}
            style={styles.profileButton}
            activeOpacity={0.7}
          >
            <Image source={profileImage} style={[styles.profileImage, { borderColor: theme.colors.primary }]} resizeMode="cover" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, theme]);

  // Filter bookings based on status
  const filteredBookings = statusFilter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === statusFilter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#FF9800';
      case 'active':
        return '#4CAF50';
      case 'completed':
        return '#2196F3';
      case 'cancelled':
        return '#F44336';
      default:
        return theme.colors.hint;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'active':
        return 'Active';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleBookingPress = (booking) => {
    navigation.navigate('OwnerBookingDetails', { booking });
  };

  const handleAccept = (booking) => {
    // TODO: Implement accept booking logic
    console.log('Accept booking:', booking.id);
  };

  const handleReject = (booking) => {
    // TODO: Implement reject booking logic
    console.log('Reject booking:', booking.id);
  };

  const statusFilters = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

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
                borderColor: statusFilter === filter.key ? theme.colors.primary : theme.colors.hint + '40',
              },
            ]}
            onPress={() => setStatusFilter(filter.key)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterButtonText,
                {
                  color: statusFilter === filter.key ? theme.colors.white : theme.colors.textPrimary,
                  fontFamily: statusFilter === filter.key ? 'Nunito_700Bold' : 'Nunito_600SemiBold',
                },
              ]}
            >
              {filter.label}
            </Text>
            {statusFilter === filter.key && (
              <View style={[styles.filterCount, { backgroundColor: theme.colors.white + '30' }]}>
                <Text style={[styles.filterCountText, { color: theme.colors.white }]}>
                  {filter.key === 'all' ? bookings.length : bookings.filter(b => b.status === filter.key).length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bookings List */}
      <ScrollView
        style={styles.bookingsList}
        contentContainerStyle={styles.bookingsContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredBookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color={theme.colors.hint} />
            <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
              No {statusFilter === 'all' ? '' : statusFilter} bookings found
            </Text>
            <Text style={[styles.emptyStateSubtext, { color: theme.colors.hint }]}>
              {statusFilter === 'all' 
                ? 'You don\'t have any bookings yet'
                : `You don't have any ${statusFilter} bookings`}
            </Text>
          </View>
        ) : (
          filteredBookings.map((booking) => (
            <Card key={booking.id} style={[styles.bookingCard, { backgroundColor: theme.colors.white }]}>
              {/* Booking Header */}
              <View style={styles.bookingHeader}>
                <View style={styles.bookingHeaderLeft}>
                  <Image
                    source={booking.renterAvatar}
                    style={[styles.renterAvatar, { borderColor: theme.colors.primary + '30' }]}
                    resizeMode="cover"
                  />
                  <View style={styles.renterInfo}>
                    <Text style={[styles.renterName, { color: theme.colors.textPrimary }]}>
                      {booking.renterName}
                    </Text>
                    <View style={styles.renterRating}>
                      <Ionicons name="star" size={14} color="#FFB800" />
                      <Text style={[styles.renterRatingText, { color: theme.colors.textSecondary }]}>
                        {booking.renterRating}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + '20' }]}>
                  <Text style={[styles.statusBadgeText, { color: getStatusColor(booking.status) }]}>
                    {getStatusLabel(booking.status)}
                  </Text>
                </View>
              </View>

              {/* Car Image and Info */}
              <View style={styles.carSection}>
                <Image
                  source={booking.carImage}
                  style={styles.carImage}
                  resizeMode="cover"
                />
                <View style={styles.carInfo}>
                  <Text style={[styles.carName, { color: theme.colors.textPrimary }]}>
                    {booking.carName}
                  </Text>
                  <View style={styles.bookingDates}>
                    <View style={styles.dateItem}>
                      <Ionicons name="calendar-outline" size={14} color={theme.colors.textSecondary} />
                      <Text style={[styles.dateText, { color: theme.colors.textSecondary }]}>
                        {formatDate(booking.pickupDate)}
                      </Text>
                    </View>
                    <Ionicons name="arrow-forward" size={14} color={theme.colors.hint} />
                    <View style={styles.dateItem}>
                      <Ionicons name="calendar-outline" size={14} color={theme.colors.textSecondary} />
                      <Text style={[styles.dateText, { color: theme.colors.textSecondary }]}>
                        {formatDate(booking.dropoffDate)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.locationInfo}>
                    <Ionicons name="location-outline" size={14} color={theme.colors.textSecondary} />
                    <Text style={[styles.locationText, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                      {booking.pickupLocation} → {booking.dropoffLocation}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Booking Details */}
              <View style={[styles.bookingDetails, { borderTopColor: theme.colors.hint + '20' }]}>
                <View style={styles.priceSection}>
                  <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>Total Price</Text>
                  <Text style={[styles.priceValue, { color: theme.colors.textPrimary }]}>
                    {booking.totalPrice}
                  </Text>
                </View>
                {booking.status === 'active' && booking.daysRemaining && (
                  <View style={styles.daysRemaining}>
                    <Ionicons name="time-outline" size={14} color={theme.colors.primary} />
                    <Text style={[styles.daysRemainingText, { color: theme.colors.primary }]}>
                      {booking.daysRemaining} day{booking.daysRemaining !== 1 ? 's' : ''} remaining
                    </Text>
                  </View>
                )}
                {booking.status === 'pending' && (
                  <View style={styles.requestDate}>
                    <Ionicons name="time-outline" size={14} color={theme.colors.hint} />
                    <Text style={[styles.requestDateText, { color: theme.colors.hint }]}>
                      Requested {formatDate(booking.requestDate)}
                    </Text>
                  </View>
                )}
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                {booking.status === 'pending' ? (
                  <>
                    <Button
                      title="Reject"
                      onPress={() => handleReject(booking)}
                      variant="secondary"
                      style={[styles.actionButton, styles.rejectButton]}
                    />
                    <Button
                      title="Accept"
                      onPress={() => handleAccept(booking)}
                      variant="primary"
                      style={styles.actionButton}
                    />
                  </>
                ) : (
                  <Button
                    title="View Details"
                    onPress={() => handleBookingPress(booking)}
                    variant="primary"
                    style={styles.actionButton}
                  />
                )}
              </View>
            </Card>
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
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingRight: 8,
  },
  iconButton: {
    padding: 8,
  },
  profileButton: {
    marginRight: 8,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
  },
  filtersContainer: {
    maxHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingTop: 16,
  },
  filtersContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterButtonText: {
    fontSize: 14,
  },
  filterCount: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  filterCountText: {
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
  },
  bookingsList: {
    flex: 1,
  },
  bookingsContent: {
    padding: 16,
    paddingBottom: 32,
  },
  bookingCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  bookingHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  renterAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
  },
  renterInfo: {
    flex: 1,
  },
  renterName: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  renterRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  renterRatingText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
    textTransform: 'uppercase',
  },
  carSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  carImage: {
    width: 100,
    height: 80,
    borderRadius: 12,
  },
  carInfo: {
    flex: 1,
    gap: 8,
  },
  carName: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  bookingDates: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    flex: 1,
  },
  bookingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 1,
  },
  priceSection: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
  },
  daysRemaining: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  daysRemainingText: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
  },
  requestDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  requestDateText: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    marginBottom: 0,
  },
  rejectButton: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default OwnerBookingsScreen;
