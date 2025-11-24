import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Card } from '../../packages/components';

// Import profile image
const profileImage = require('../../../assets/logo/profile.jpg');

const OwnerHomeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [isAvailable, setIsAvailable] = useState(true);

  // Mock active bookings data
  const activeBookings = [
    {
      id: 1,
      renterName: 'John Doe',
      renterAvatar: profileImage,
      carName: 'Toyota Corolla',
      carImage: profileImage,
      pickupDate: '2024-01-15',
      dropoffDate: '2024-01-18',
      totalPrice: '$135',
      status: 'active',
      daysRemaining: 2,
    },
    {
      id: 2,
      renterName: 'Sarah Smith',
      renterAvatar: profileImage,
      carName: 'Honda Civic',
      carImage: profileImage,
      pickupDate: '2024-01-16',
      dropoffDate: '2024-01-20',
      totalPrice: '$180',
      status: 'active',
      daysRemaining: 3,
    },
  ];

  // Mock pending requests
  const pendingRequests = [
    {
      id: 3,
      renterName: 'Michael Brown',
      renterAvatar: profileImage,
      carName: 'Toyota Corolla',
      carImage: profileImage,
      pickupDate: '2024-01-20',
      dropoffDate: '2024-01-25',
      totalPrice: '$225',
      status: 'pending',
      requestDate: '2024-01-14',
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
              // TODO: Navigate to profile page (to be created)
              console.log('Profile pressed');
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

  const handleToggleAvailability = () => {
    setIsAvailable(!isAvailable);
    // TODO: Update car availability status in backend
  };

  const handleViewBooking = (booking) => {
    // TODO: Navigate to booking details
    console.log('View booking:', booking);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Availability Status Toggle */}
      <View style={[styles.statusCard, { backgroundColor: theme.colors.white }]}>
        <View style={styles.statusContent}>
          <View style={styles.statusLeft}>
            <View style={[styles.statusIndicator, { backgroundColor: isAvailable ? '#4CAF50' : '#9E9E9E' }]} />
            <View>
              <Text style={[styles.statusText, { color: theme.colors.textPrimary }]}>
                {isAvailable ? 'Cars Available' : 'Cars Unavailable'}
              </Text>
              <Text style={[styles.statusSubtext, { color: theme.colors.textSecondary }]}>
                {isAvailable ? 'Your cars are listed and available for rent' : 'Your cars are not available for rent'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              { backgroundColor: isAvailable ? theme.colors.primary : theme.colors.hint + '30' },
            ]}
            onPress={handleToggleAvailability}
            activeOpacity={0.7}
          >
            <Text style={[styles.toggleButtonText, { color: isAvailable ? theme.colors.white : theme.colors.textSecondary }]}>
              {isAvailable ? 'Make Unavailable' : 'Make Available'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: theme.colors.white }]}>
          <Ionicons name="cash-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>$2,450</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>This Month</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.colors.white }]}>
          <Ionicons name="car-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>3</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Active</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.colors.white }]}>
          <Ionicons name="star" size={24} color="#FFA500" />
          <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>4.9</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Rating</Text>
        </View>
      </View>

      {/* Active Bookings */}
      {activeBookings.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Active Bookings
            </Text>
            <TouchableOpacity
              onPress={() => {
                // TODO: Navigate to all bookings
                console.log('View all bookings');
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>

          {activeBookings.map((booking) => (
            <Card key={booking.id} style={[styles.bookingCard, { backgroundColor: theme.colors.white }]}>
              <View style={styles.bookingHeader}>
                <View style={styles.bookingHeaderLeft}>
                  <Image
                    source={booking.renterAvatar}
                    style={[styles.renterAvatar, { borderColor: theme.colors.primary + '30' }]}
                    resizeMode="cover"
                  />
                  <View style={styles.bookingInfo}>
                    <Text style={[styles.renterName, { color: theme.colors.textPrimary }]}>
                      {booking.renterName}
                    </Text>
                    <Text style={[styles.carName, { color: theme.colors.textSecondary }]}>
                      {booking.carName}
                    </Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: '#4CAF50' + '20' }]}>
                  <Text style={[styles.statusBadgeText, { color: '#4CAF50' }]}>
                    Active
                  </Text>
                </View>
              </View>

              <View style={styles.bookingDetails}>
                <View style={styles.bookingDetailItem}>
                  <Ionicons name="calendar-outline" size={16} color={theme.colors.hint} />
                  <Text style={[styles.bookingDetailText, { color: theme.colors.textSecondary }]}>
                    {formatDate(booking.pickupDate)} - {formatDate(booking.dropoffDate)}
                  </Text>
                </View>
                <View style={styles.bookingDetailItem}>
                  <Ionicons name="time-outline" size={16} color={theme.colors.hint} />
                  <Text style={[styles.bookingDetailText, { color: theme.colors.textSecondary }]}>
                    {booking.daysRemaining} days remaining
                  </Text>
                </View>
              </View>

              <View style={styles.bookingFooter}>
                <Text style={[styles.bookingPrice, { color: theme.colors.primary }]}>
                  {booking.totalPrice}
                </Text>
                <TouchableOpacity
                  style={[styles.viewButton, { borderColor: theme.colors.primary }]}
                  onPress={() => handleViewBooking(booking)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.viewButtonText, { color: theme.colors.primary }]}>
                    View Details
                  </Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))}
        </View>
      )}

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Pending Requests
            </Text>
            <TouchableOpacity
              onPress={() => {
                // TODO: Navigate to all requests
                console.log('View all requests');
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>

          {pendingRequests.map((request) => (
            <Card key={request.id} style={[styles.bookingCard, { backgroundColor: theme.colors.white }]}>
              <View style={styles.bookingHeader}>
                <View style={styles.bookingHeaderLeft}>
                  <Image
                    source={request.renterAvatar}
                    style={[styles.renterAvatar, { borderColor: theme.colors.primary + '30' }]}
                    resizeMode="cover"
                  />
                  <View style={styles.bookingInfo}>
                    <Text style={[styles.renterName, { color: theme.colors.textPrimary }]}>
                      {request.renterName}
                    </Text>
                    <Text style={[styles.carName, { color: theme.colors.textSecondary }]}>
                      {request.carName}
                    </Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: '#FFA500' + '20' }]}>
                  <Text style={[styles.statusBadgeText, { color: '#FFA500' }]}>
                    Pending
                  </Text>
                </View>
              </View>

              <View style={styles.bookingDetails}>
                <View style={styles.bookingDetailItem}>
                  <Ionicons name="calendar-outline" size={16} color={theme.colors.hint} />
                  <Text style={[styles.bookingDetailText, { color: theme.colors.textSecondary }]}>
                    {formatDate(request.pickupDate)} - {formatDate(request.dropoffDate)}
                  </Text>
                </View>
                <View style={styles.bookingDetailItem}>
                  <Ionicons name="time-outline" size={16} color={theme.colors.hint} />
                  <Text style={[styles.bookingDetailText, { color: theme.colors.textSecondary }]}>
                    Requested {formatDate(request.requestDate)}
                  </Text>
                </View>
              </View>

              <View style={styles.bookingFooter}>
                <Text style={[styles.bookingPrice, { color: theme.colors.primary }]}>
                  {request.totalPrice}
                </Text>
                <View style={styles.requestActions}>
                  <TouchableOpacity
                    style={[styles.requestButton, styles.declineButton, { borderColor: theme.colors.hint }]}
                    onPress={() => {
                      // TODO: Decline request
                      console.log('Decline request:', request.id);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.requestButtonText, { color: theme.colors.textSecondary }]}>
                      Decline
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.requestButton, styles.acceptButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => {
                      // TODO: Accept request
                      console.log('Accept request:', request.id);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.requestButtonText, { color: theme.colors.white }]}>
                      Accept
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          ))}
        </View>
      )}

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
  statusCard: {
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  statusSubtext: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  toggleButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    letterSpacing: -0.3,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  bookingCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
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
    gap: 12,
    flex: 1,
  },
  renterAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
  },
  bookingInfo: {
    flex: 1,
  },
  renterName: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  carName: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
  },
  bookingDetails: {
    marginBottom: 16,
    gap: 8,
  },
  bookingDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bookingDetailText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingPrice: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
  },
  viewButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  viewButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  requestActions: {
    flexDirection: 'row',
    gap: 8,
  },
  requestButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  declineButton: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  acceptButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  requestButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
});

export default OwnerHomeScreen;
