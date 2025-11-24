import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Modal, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Button, Card } from '../../packages/components';

// Import default profile image
const defaultProfileImage = require('../../../assets/logo/profile.jpg');

const ActiveRideScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { ride } = route.params || {};

  const [showEndRideModal, setShowEndRideModal] = useState(false);
  const [rideStatus, setRideStatus] = useState('in_progress'); // 'in_progress', 'arrived', 'completed'
  const [processing, setProcessing] = useState(false);

  // Mock ride data if not provided
  const rideData = ride || {
    id: 1,
    clientName: 'John Doe',
    clientAvatar: defaultProfileImage,
    clientPhone: '+254 712 345 678',
    clientRating: 4.8,
    pickupLocation: 'Nairobi CBD',
    dropoffLocation: 'Jomo Kenyatta Airport',
    pickupAddress: 'Nairobi CBD, Moi Avenue, Kenya',
    dropoffAddress: 'Jomo Kenyatta International Airport, Embakasi, Kenya',
    distance: '18 km',
    duration: '45 min',
    price: 25,
    grossPrice: 25,
    commission: 3.75,
    netPrice: 21.25,
    date: '2024-01-15',
    time: '2:30 PM',
    status: 'active',
    specialInstructions: 'Please arrive 10 minutes early',
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Active Ride',
    });
    // Hide tab bar on this screen
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: 'none' },
    });
    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
    };
  }, [navigation]);

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '$0.00';
    const numAmount = typeof amount === 'string' ? parseFloat(amount.replace('$', '')) : amount;
    return `$${Math.abs(numAmount).toFixed(2)}`;
  };

  const handleCallClient = () => {
    if (rideData.clientPhone) {
      Linking.openURL(`tel:${rideData.clientPhone}`).catch((err) =>
        console.error('Failed to open phone:', err)
      );
    }
  };

  const handleMessageClient = () => {
    navigation.navigate('MessagesTab', {
      screen: 'Chat',
      params: {
        userName: rideData.clientName,
        userAvatar: rideData.clientAvatar,
      },
    });
  };

  const handleNavigateToPickup = () => {
    navigation.navigate('Routes', { ride: rideData });
  };

  const handleNavigateToDropoff = () => {
    navigation.navigate('Routes', { ride: rideData });
  };

  const handleArrived = () => {
    setRideStatus('arrived');
    Alert.alert('Arrived', 'You have marked yourself as arrived at the pickup location.');
  };

  const handleStartTrip = () => {
    setRideStatus('in_progress');
    Alert.alert('Trip Started', 'The trip has been started. Safe driving!');
  };

  const handleEndRide = () => {
    setShowEndRideModal(true);
  };

  const confirmEndRide = async () => {
    setProcessing(true);
    try {
      // TODO: Implement API call to end ride
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert(
        'Ride Completed',
        'The ride has been completed successfully. Payment will be processed shortly.',
        [
          {
            text: 'OK',
            onPress: () => {
              setShowEndRideModal(false);
              setProcessing(false);
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to end ride. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Banner */}
        <View style={[styles.statusBanner, { backgroundColor: rideStatus === 'arrived' ? '#FFA500' + '20' : '#4CAF50' + '20' }]}>
          <Ionicons 
            name={rideStatus === 'arrived' ? 'location' : 'car'} 
            size={24} 
            color={rideStatus === 'arrived' ? '#FFA500' : '#4CAF50'} 
          />
          <Text style={[styles.statusBannerText, { color: rideStatus === 'arrived' ? '#FFA500' : '#4CAF50' }]}>
            {rideStatus === 'arrived' ? 'Arrived at Pickup' : 'Ride in Progress'}
          </Text>
        </View>

        {/* Client Information */}
        <Card style={[styles.sectionCard, { backgroundColor: theme.colors.white }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Client Information
          </Text>
          <View style={styles.clientInfo}>
            <Image
              source={rideData.clientAvatar || defaultProfileImage}
              style={[styles.clientAvatar, { borderColor: theme.colors.primary + '30' }]}
              resizeMode="cover"
            />
            <View style={styles.clientDetails}>
              <Text style={[styles.clientName, { color: theme.colors.textPrimary }]}>
                {rideData.clientName}
              </Text>
              <View style={styles.clientRating}>
                <Ionicons name="star" size={16} color="#FFA500" />
                <Text style={[styles.ratingText, { color: theme.colors.textSecondary }]}>
                  {rideData.clientRating || 'N/A'}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.clientActions}>
            <TouchableOpacity
              style={[styles.clientActionButton, { backgroundColor: theme.colors.primary + '20' }]}
              onPress={handleCallClient}
              activeOpacity={0.7}
            >
              <Ionicons name="call" size={20} color={theme.colors.primary} />
              <Text style={[styles.clientActionText, { color: theme.colors.primary }]}>
                Call
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.clientActionButton, { backgroundColor: theme.colors.primary + '20' }]}
              onPress={handleMessageClient}
              activeOpacity={0.7}
            >
              <Ionicons name="chatbubble" size={20} color={theme.colors.primary} />
              <Text style={[styles.clientActionText, { color: theme.colors.primary }]}>
                Message
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Route Information */}
        <Card style={[styles.sectionCard, { backgroundColor: theme.colors.white }]}>
          <View style={styles.routeHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Route
            </Text>
            <TouchableOpacity
              style={[styles.viewRouteButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => navigation.navigate('Routes', { ride: rideData })}
              activeOpacity={0.7}
            >
              <Ionicons name="map-outline" size={16} color={theme.colors.white} />
              <Text style={[styles.viewRouteButtonText, { color: theme.colors.white }]}>
                View Route
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Pickup Location */}
          <View style={styles.routeItem}>
            <View style={[styles.routeIconContainer, { backgroundColor: '#4CAF50' + '20' }]}>
              <Ionicons name="location" size={24} color="#4CAF50" />
            </View>
            <View style={styles.routeContent}>
              <Text style={[styles.routeLabel, { color: theme.colors.textSecondary }]}>
                Pickup Location
              </Text>
              <Text style={[styles.routeText, { color: theme.colors.textPrimary }]}>
                {rideData.pickupLocation}
              </Text>
              {rideData.pickupAddress && (
                <Text style={[styles.routeAddress, { color: theme.colors.hint }]}>
                  {rideData.pickupAddress}
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={[styles.navigateButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleNavigateToPickup}
              activeOpacity={0.7}
            >
              <Ionicons name="navigate" size={20} color={theme.colors.white} />
            </TouchableOpacity>
          </View>

          <View style={[styles.routeDivider, { backgroundColor: theme.colors.hint + '30' }]} />

          {/* Dropoff Location */}
          <View style={styles.routeItem}>
            <View style={[styles.routeIconContainer, { backgroundColor: '#F44336' + '20' }]}>
              <Ionicons name="flag" size={24} color="#F44336" />
            </View>
            <View style={styles.routeContent}>
              <Text style={[styles.routeLabel, { color: theme.colors.textSecondary }]}>
                Dropoff Location
              </Text>
              <Text style={[styles.routeText, { color: theme.colors.textPrimary }]}>
                {rideData.dropoffLocation}
              </Text>
              {rideData.dropoffAddress && (
                <Text style={[styles.routeAddress, { color: theme.colors.hint }]}>
                  {rideData.dropoffAddress}
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={[styles.navigateButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleNavigateToDropoff}
              activeOpacity={0.7}
            >
              <Ionicons name="navigate" size={20} color={theme.colors.white} />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Trip Details */}
        <Card style={[styles.sectionCard, { backgroundColor: theme.colors.white }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Trip Details
          </Text>
          <View style={styles.detailsGrid}>
            <View style={[styles.detailCard, { backgroundColor: theme.colors.background }]}>
              <Ionicons name="navigate-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                {rideData.distance}
              </Text>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Distance
              </Text>
            </View>
            <View style={[styles.detailCard, { backgroundColor: theme.colors.background }]}>
              <Ionicons name="time-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>
                {rideData.duration}
              </Text>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Duration
              </Text>
            </View>
            <View style={[styles.detailCard, { backgroundColor: theme.colors.background }]}>
              <Ionicons name="cash-outline" size={24} color="#4CAF50" />
              <Text style={[styles.detailValue, { color: '#4CAF50' }]}>
                {formatCurrency(rideData.netPrice || ((typeof rideData.price === 'string' ? parseFloat(rideData.price.replace('$', '')) : rideData.price || 0) * 0.85))}
              </Text>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Earnings
              </Text>
            </View>
          </View>
          {rideData.specialInstructions && (
            <View style={[styles.instructionsContainer, { backgroundColor: theme.colors.background }]}>
              <Ionicons name="information-circle-outline" size={18} color={theme.colors.primary} />
              <Text style={[styles.instructionsText, { color: theme.colors.textSecondary }]}>
                {rideData.specialInstructions}
              </Text>
            </View>
          )}
        </Card>

        {/* Bottom Spacing */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={[styles.actionsContainer, { backgroundColor: theme.colors.white, borderTopColor: theme.colors.hint + '20' }]}>
        {rideStatus === 'in_progress' && (
          <>
            <Button
              title="Mark as Arrived"
              onPress={handleArrived}
              variant="secondary"
              style={[styles.actionButton, { borderColor: '#FFA500', borderWidth: 1 }]}
              textStyle={{ color: '#FFA500' }}
              disabled={processing}
            />
            <Button
              title="End Ride"
              onPress={handleEndRide}
              variant="primary"
              style={styles.actionButton}
              disabled={processing}
            />
          </>
        )}
        {rideStatus === 'arrived' && (
          <Button
            title="Start Trip"
            onPress={handleStartTrip}
            variant="primary"
            style={styles.actionButton}
            disabled={processing}
          />
        )}
      </View>

      {/* End Ride Confirmation Modal */}
      <Modal
        visible={showEndRideModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEndRideModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.white }]}>
            <View style={[styles.modalIconContainer, { backgroundColor: '#4CAF50' + '20' }]}>
              <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
            </View>
            <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
              End Ride
            </Text>
            <Text style={[styles.modalMessage, { color: theme.colors.textSecondary }]}>
              Are you sure you want to end this ride? Make sure you have reached the dropoff location and the client has exited the vehicle.
            </Text>
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setShowEndRideModal(false)}
                variant="secondary"
                style={styles.modalButton}
                disabled={processing}
              />
              <Button
                title="End Ride"
                onPress={confirmEndRide}
                variant="primary"
                style={styles.modalButton}
                loading={processing}
                disabled={processing}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 20,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  statusBannerText: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  sectionCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewRouteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  viewRouteButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  clientAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
  },
  clientDetails: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  clientRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  clientActions: {
    flexDirection: 'row',
    gap: 12,
  },
  clientActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  clientActionText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  routeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeContent: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 4,
  },
  routeText: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  routeAddress: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  navigateButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeDivider: {
    height: 1,
    marginVertical: 8,
    marginLeft: 60,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  detailCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  detailValue: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  instructionsContainer: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  instructionsText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  actionButton: {
    flex: 1,
    marginBottom: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
  },
  modalIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    marginBottom: 0,
  },
});

export default ActiveRideScreen;
