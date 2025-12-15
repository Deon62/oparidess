import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBookings } from '../../packages/context/BookingsContext';
import { getCarPrimaryImage } from '../../packages/utils/supabaseImages';

import CompletedIcon from '../../../assets/icons/completed.svg';

const CompletedRentalsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { bookings: contextBookings } = useBookings();

  const bookings = contextBookings || [];
  const completedBookings = bookings.filter(
    (booking) => booking.status === 'completed' || booking.status === 'past' || booking.status === 'done'
  );

  const showEmptyState = false;
  const sampleBooking = {
    id: 'sample-completed',
    status: 'completed',
    carName: 'Porsche 911',
    pickupLocation: 'Nairobi, Kenya',
    startDate: '12 Dec 2025',
    imageKey: 'porsche',
  };
  const visibleBookings = completedBookings.length > 0 ? completedBookings : [sampleBooking];

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <View style={[styles.customHeader, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
              Completed rentals
            </Text>
            <View style={styles.headerRightSpacer} />
          </View>
        </View>
      ),
    });

    navigation.getParent()?.setOptions({
      tabBarStyle: { display: 'none' },
    });

    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
    };
  }, [navigation, theme, insets.top]);

  const handleBookingPress = (booking) => {
    navigation.navigate('PastRentalDetails', { booking });
  };

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
      {showEmptyState && completedBookings.length === 0 ? (
        <View style={styles.emptyState}>
          <CompletedIcon width={220} height={220} />
          <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>No completed rentals</Text>
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            Your completed rentals will appear here.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {visibleBookings.map((booking) => (
            <TouchableOpacity
              key={booking.id}
              activeOpacity={0.8}
              onPress={() => handleBookingPress(booking)}
              style={[styles.card, { backgroundColor: theme.colors.white }]}
            >
              <View style={styles.imageWrap}>
                <Image
                  source={{ uri: booking.imageUri || getCarPrimaryImage(booking.imageKey || 'x') }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>

              <View style={styles.content}>
                <View style={styles.titleRow}>
                  <Text style={[styles.title, { color: theme.colors.textPrimary }]} numberOfLines={1}>
                    {booking.carName || booking.car?.name || 'Rental'}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + '22' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
                      {(booking.status || 'completed').toUpperCase()}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.meta, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                  {booking.pickupLocation || booking.location || 'Pickup location'}
                </Text>
                <Text style={[styles.meta, { color: theme.colors.hint }]} numberOfLines={1}>
                  {booking.startDate || booking.date || ''}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  customHeader: {
    position: 'relative',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    borderBottomWidth: 0,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 12,
    minHeight: 48,
  },
  backButton: {
    padding: 6,
    marginLeft: -6,
  },
  headerRightSpacer: {
    width: 30,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Nunito_600SemiBold',
    flex: 1,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_600SemiBold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  list: {
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  imageWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginRight: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontFamily: 'Nunito_600SemiBold',
    flex: 1,
  },
  meta: {
    fontSize: 13,
    fontFamily: 'Nunito_400Regular',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    flexShrink: 0,
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Nunito_700Bold',
  },
});

export default CompletedRentalsScreen;
