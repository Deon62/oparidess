import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Card } from '../../packages/components';

// Import profile image
const profileImage = require('../../../assets/logo/profile.jpg');

const DriverHomeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [isOnline, setIsOnline] = useState(false);

  // Mock available rides data
  const availableRides = [
    {
      id: 1,
      clientName: 'John Doe',
      pickupLocation: 'Nairobi CBD',
      dropoffLocation: 'Jomo Kenyatta Airport',
      distance: '18 km',
      duration: '45 min',
      price: '$25',
      time: '2:30 PM',
      status: 'pending',
    },
    {
      id: 2,
      clientName: 'Sarah Smith',
      pickupLocation: 'Westlands',
      dropoffLocation: 'Karen',
      distance: '12 km',
      duration: '30 min',
      price: '$20',
      time: '3:15 PM',
      status: 'pending',
    },
    {
      id: 3,
      clientName: 'Michael Brown',
      pickupLocation: 'Parklands',
      dropoffLocation: 'Kilimani',
      distance: '8 km',
      duration: '20 min',
      price: '$15',
      time: '4:00 PM',
      status: 'pending',
    },
  ];

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
              navigation.navigate('DriverProfile');
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

  const handleToggleOnline = () => {
    setIsOnline(!isOnline);
    // TODO: Update driver online status in backend
  };

  const handleAcceptRide = (ride) => {
    // TODO: Accept ride and navigate to active ride screen
    navigation.navigate('ActiveRide', { ride });
  };

  const handleViewRideDetails = (ride) => {
    // TODO: Navigate to ride details
    console.log('View ride details:', ride);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Online Status Toggle */}
      <View style={[styles.statusCard, { backgroundColor: theme.colors.white }]}>
        <View style={styles.statusContent}>
          <View style={styles.statusLeft}>
            <View style={[styles.statusIndicator, { backgroundColor: isOnline ? '#4CAF50' : '#9E9E9E' }]} />
            <View>
              <Text style={[styles.statusText, { color: theme.colors.textPrimary }]}>
                {isOnline ? 'Online' : 'Offline'}
              </Text>
              <Text style={[styles.statusSubtext, { color: theme.colors.textSecondary }]}>
                {isOnline ? 'You are available for rides' : 'Turn on to receive ride requests'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              { backgroundColor: isOnline ? theme.colors.primary : theme.colors.hint + '30' },
            ]}
            onPress={handleToggleOnline}
            activeOpacity={0.7}
          >
            <Text style={[styles.toggleButtonText, { color: isOnline ? theme.colors.white : theme.colors.textSecondary }]}>
              {isOnline ? 'Go Offline' : 'Go Online'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: theme.colors.white }]}>
          <Ionicons name="calendar-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>12</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Today</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.colors.white }]}>
          <Ionicons name="cash-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>$320</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Earnings</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.colors.white }]}>
          <Ionicons name="star" size={24} color="#FFA500" />
          <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>4.8</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Rating</Text>
        </View>
      </View>

      {/* Available Rides */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Available Rides
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AvailableRides')}
            activeOpacity={0.7}
          >
            <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>View All</Text>
          </TouchableOpacity>
        </View>

        {!isOnline ? (
          <View style={[styles.emptyState, { backgroundColor: theme.colors.white }]}>
            <Ionicons name="power-outline" size={48} color={theme.colors.hint} />
            <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
              Go online to see available rides
            </Text>
            <Text style={[styles.emptyStateSubtext, { color: theme.colors.hint }]}>
              Turn on your availability to start receiving ride requests
            </Text>
          </View>
        ) : availableRides.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: theme.colors.white }]}>
            <Ionicons name="car-outline" size={48} color={theme.colors.hint} />
            <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
              No rides available at the moment
            </Text>
            <Text style={[styles.emptyStateSubtext, { color: theme.colors.hint }]}>
              Check back later for new ride requests
            </Text>
          </View>
        ) : (
          availableRides.map((ride) => (
            <Card key={ride.id} style={styles.rideCard}>
              <View style={styles.rideHeader}>
                <View style={styles.rideHeaderLeft}>
                  <View style={[styles.rideIconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                    <Ionicons name="person" size={20} color={theme.colors.primary} />
                  </View>
                  <View>
                    <Text style={[styles.rideClientName, { color: theme.colors.textPrimary }]}>
                      {ride.clientName}
                    </Text>
                    <Text style={[styles.rideTime, { color: theme.colors.textSecondary }]}>
                      {ride.time}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.ridePrice, { color: theme.colors.primary }]}>
                  {ride.price}
                </Text>
              </View>

              <View style={styles.rideRoute}>
                <View style={styles.routeItem}>
                  <View style={[styles.routeDot, { backgroundColor: '#4CAF50' }]} />
                  <Text style={[styles.routeText, { color: theme.colors.textPrimary }]}>
                    {ride.pickupLocation}
                  </Text>
                </View>
                <View style={styles.routeLine} />
                <View style={styles.routeItem}>
                  <View style={[styles.routeDot, { backgroundColor: '#F44336' }]} />
                  <Text style={[styles.routeText, { color: theme.colors.textPrimary }]}>
                    {ride.dropoffLocation}
                  </Text>
                </View>
              </View>

              <View style={styles.rideDetails}>
                <View style={styles.rideDetailItem}>
                  <Ionicons name="navigate-outline" size={16} color={theme.colors.hint} />
                  <Text style={[styles.rideDetailText, { color: theme.colors.textSecondary }]}>
                    {ride.distance}
                  </Text>
                </View>
                <View style={styles.rideDetailItem}>
                  <Ionicons name="time-outline" size={16} color={theme.colors.hint} />
                  <Text style={[styles.rideDetailText, { color: theme.colors.textSecondary }]}>
                    {ride.duration}
                  </Text>
                </View>
              </View>

              <View style={styles.rideActions}>
                <TouchableOpacity
                  style={[styles.rideActionButton, styles.declineButton, { borderColor: theme.colors.hint }]}
                  onPress={() => handleViewRideDetails(ride)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.rideActionText, { color: theme.colors.textSecondary }]}>
                    Details
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.rideActionButton, styles.acceptButton, { backgroundColor: theme.colors.primary }]}
                  onPress={() => handleAcceptRide(ride)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.rideActionText, { color: theme.colors.white }]}>
                    Accept
                  </Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity
          style={[styles.quickActionButton, { backgroundColor: theme.colors.white }]}
          onPress={() => navigation.navigate('DriverHistory')}
          activeOpacity={0.7}
        >
          <Ionicons name="time-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.quickActionText, { color: theme.colors.textPrimary }]}>
            Ride History
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.quickActionButton, { backgroundColor: theme.colors.white }]}
          onPress={() => navigation.navigate('DriverProfile')}
          activeOpacity={0.7}
        >
          <Ionicons name="person-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.quickActionText, { color: theme.colors.textPrimary }]}>
            Profile
          </Text>
        </TouchableOpacity>
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
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
    marginBottom: 16,
    padding: 16,
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
  rideIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rideClientName: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  rideTime: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  ridePrice: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  rideRoute: {
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
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    left: 0,
  },
  routeText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    marginLeft: 20,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: '#E0E0E0',
    marginLeft: 5,
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
  rideActions: {
    flexDirection: 'row',
    gap: 12,
  },
  rideActionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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
  rideActionText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginTop: 24,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
});

export default DriverHomeScreen;
