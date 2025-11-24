import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Card } from '../../packages/components';

// Import profile image
const profileImage = require('../../../assets/logo/profile.jpg');

const BookingsListScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [bookingType, setBookingType] = useState('cars'); // 'cars' or 'chauffeurs'
  const [statusFilter, setStatusFilter] = useState('pending'); // 'pending', 'active', 'completed', 'cancelled'

  // Mock bookings data
  const carBookings = [
    {
      id: 1,
      carName: 'Toyota Corolla',
      date: '2024-01-15',
      duration: '3 days',
      price: '$135',
      status: 'pending',
      image: require('../../../assets/images/car1.jpg'),
    },
    {
      id: 2,
      carName: 'BMW 5 Series',
      date: '2024-01-20',
      duration: '5 days',
      price: '$600',
      status: 'active',
      image: require('../../../assets/images/car2.jpg'),
    },
    {
      id: 3,
      carName: 'Tesla Model S',
      date: '2024-01-10',
      duration: '2 days',
      price: '$400',
      status: 'completed',
      image: require('../../../assets/images/car3.jpg'),
    },
    {
      id: 4,
      carName: 'Honda Civic',
      date: '2024-01-12',
      duration: '1 day',
      price: '$48',
      status: 'cancelled',
      image: require('../../../assets/images/car4.jpg'),
    },
  ];

  const chauffeurBookings = [
    {
      id: 1,
      driverName: 'John Smith',
      date: '2024-01-16',
      duration: '4 hours',
      price: '$120',
      status: 'pending',
      rating: 4.8,
    },
    {
      id: 2,
      driverName: 'Sarah Johnson',
      date: '2024-01-18',
      duration: '6 hours',
      price: '$180',
      status: 'active',
      rating: 4.9,
    },
    {
      id: 3,
      driverName: 'Michael Brown',
      date: '2024-01-08',
      duration: '3 hours',
      price: '$90',
      status: 'completed',
      rating: 4.7,
    },
    {
      id: 4,
      driverName: 'Emily Davis',
      date: '2024-01-14',
      duration: '2 hours',
      price: '$60',
      status: 'cancelled',
      rating: 4.6,
    },
  ];

  const bookings = bookingType === 'cars' ? carBookings : chauffeurBookings;
  const filteredBookings = bookings.filter(booking => booking.status === statusFilter);

  // Set header with notifications and profile picture
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SettingsTab', { screen: 'Notifications' });
            }}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('HomeTab', { screen: 'Bookmarks' });
            }}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Ionicons name="bookmark-outline" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SettingsTab', { screen: 'RenterProfile' });
            }}
            style={styles.profileButton}
            activeOpacity={0.7}
          >
            <View style={styles.profileImageContainer}>
              <Image source={profileImage} style={[styles.profileImage, { borderColor: theme.colors.primary }]} resizeMode="cover" />
              <View style={styles.onlineIndicator} />
            </View>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, theme]);

  const statusOptions = [
    { id: 'pending', label: 'Pending' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#FFA500';
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

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Booking Type Toggle */}
      <View style={styles.typeToggleContainer}>
        <TouchableOpacity
          style={[
            styles.typeToggleButton,
            bookingType === 'cars' && [styles.typeToggleButtonActive, { backgroundColor: theme.colors.primary }],
          ]}
          onPress={() => setBookingType('cars')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={bookingType === 'cars' ? 'car' : 'car-outline'}
            size={18}
            color={bookingType === 'cars' ? theme.colors.white : theme.colors.textPrimary}
          />
          <Text
            style={[
              styles.typeToggleText,
              { color: bookingType === 'cars' ? theme.colors.white : theme.colors.textPrimary },
            ]}
          >
            Cars
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.typeToggleButton,
            bookingType === 'chauffeurs' && [styles.typeToggleButtonActive, { backgroundColor: theme.colors.primary }],
          ]}
          onPress={() => setBookingType('chauffeurs')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={bookingType === 'chauffeurs' ? 'person' : 'person-outline'}
            size={18}
            color={bookingType === 'chauffeurs' ? theme.colors.white : theme.colors.textPrimary}
          />
          <Text
            style={[
              styles.typeToggleText,
              { color: bookingType === 'chauffeurs' ? theme.colors.white : theme.colors.textPrimary },
            ]}
          >
            Chauffeurs
          </Text>
        </TouchableOpacity>
      </View>

      {/* Status Filters */}
      <View style={styles.statusFiltersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statusFiltersScroll}
        >
          {statusOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.statusFilterButton,
                statusFilter === option.id && [
                  styles.statusFilterButtonActive,
                  { backgroundColor: theme.colors.primary },
                ],
                { borderColor: statusFilter === option.id ? theme.colors.primary : theme.colors.hint },
              ]}
              onPress={() => setStatusFilter(option.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.statusFilterText,
                  {
                    color: statusFilter === option.id ? theme.colors.white : theme.colors.textSecondary,
                  },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Bookings List */}
      <View style={styles.bookingsList}>
        {filteredBookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color={theme.colors.hint} />
            <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
              No {statusFilter} {bookingType === 'cars' ? 'car' : 'chauffeur'} bookings found
            </Text>
          </View>
        ) : (
          filteredBookings.map((booking) => (
            <Card key={booking.id} style={styles.bookingCard}>
              {bookingType === 'cars' && booking.image && (
                <View style={styles.bookingImageContainer}>
                  <Image source={booking.image} style={styles.bookingImage} resizeMode="cover" />
                </View>
              )}
              <View style={styles.bookingContent}>
                <View style={styles.bookingHeader}>
                  <Text style={[styles.bookingTitle, { color: theme.colors.textPrimary }]}>
                    {bookingType === 'cars' ? booking.carName : booking.driverName}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Text>
                  </View>
                </View>
                <View style={styles.bookingDetails}>
                  <View style={styles.bookingDetailItem}>
                    <Ionicons name="calendar-outline" size={16} color={theme.colors.hint} />
                    <Text style={[styles.bookingDetailText, { color: theme.colors.textSecondary }]}>
                      {booking.date}
                    </Text>
                  </View>
                  <View style={styles.bookingDetailItem}>
                    <Ionicons name="time-outline" size={16} color={theme.colors.hint} />
                    <Text style={[styles.bookingDetailText, { color: theme.colors.textSecondary }]}>
                      {booking.duration}
                    </Text>
                  </View>
                  {bookingType === 'chauffeurs' && booking.rating && (
                    <View style={styles.bookingDetailItem}>
                      <Ionicons name="star" size={16} color="#FFA500" />
                      <Text style={[styles.bookingDetailText, { color: theme.colors.textSecondary }]}>
                        {booking.rating}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.bookingFooter}>
                  <Text style={[styles.bookingPrice, { color: theme.colors.primary }]}>{booking.price}</Text>
                </View>
              </View>
            </Card>
          ))
        )}
      </View>
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
    gap: 16,
    paddingRight: 8,
  },
  iconButton: {
    padding: 8,
  },
  typeToggleContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 3,
    gap: 3,
  },
  typeToggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 7,
    gap: 6,
  },
  typeToggleButtonActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  typeToggleText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  statusFiltersContainer: {
    marginBottom: 20,
  },
  statusFiltersScroll: {
    paddingLeft: 24,
    paddingRight: 24,
    gap: 12,
  },
  statusFilterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  statusFilterButtonActive: {
    borderWidth: 0,
  },
  statusFilterText: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
  },
  bookingsList: {
    paddingHorizontal: 24,
    gap: 16,
  },
  bookingCard: {
    flexDirection: 'row',
    padding: 0,
    overflow: 'hidden',
    marginBottom: 0,
    alignItems: 'center',
  },
  bookingImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginLeft: 16,
    marginVertical: 16,
  },
  bookingImage: {
    width: '100%',
    height: '100%',
  },
  bookingContent: {
    flex: 1,
    padding: 16,
    paddingLeft: 12,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bookingTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
  },
  bookingDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  bookingDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bookingDetailText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  bookingFooter: {
    marginTop: 'auto',
  },
  bookingPrice: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    marginTop: 16,
    textAlign: 'center',
  },
  profileButton: {
    marginRight: 8,
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
    borderWidth: 2,
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
});

export default BookingsListScreen;

