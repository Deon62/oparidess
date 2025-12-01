import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../packages/theme/ThemeProvider';

const NotificationsScreen = () => {
  const theme = useTheme();

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: 'booking',
      title: 'Booking Confirmed',
      message: 'Your booking for Toyota Corolla has been confirmed for Jan 15, 2024',
      time: '2 hours ago',
      isRead: false,
      icon: 'checkmark-circle',
      iconColor: '#4CAF50',
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of KSh 13,500 has been successfully processed',
      time: '5 hours ago',
      isRead: false,
      icon: 'card',
      iconColor: '#2196F3',
    },
    {
      id: 3,
      type: 'reminder',
      title: 'Pickup Reminder',
      message: 'Don\'t forget! Your car rental pickup is scheduled for tomorrow at 10:00 AM',
      time: '1 day ago',
      isRead: true,
      icon: 'time',
      iconColor: '#FFA500',
    },
    {
      id: 4,
      type: 'message',
      title: 'New Message',
      message: 'You have a new message from John Smith',
      time: '2 days ago',
      isRead: true,
      icon: 'chatbubble',
      iconColor: '#0A1D37',
    },
    {
      id: 5,
      type: 'promotion',
      title: 'Special Offer',
      message: 'Get 20% off on your next booking! Use code SAVE20',
      time: '3 days ago',
      isRead: true,
      icon: 'gift',
      iconColor: '#E91E63',
    },
    {
      id: 6,
      type: 'system',
      title: 'Profile Update',
      message: 'Your profile has been successfully updated',
      time: '4 days ago',
      isRead: true,
      icon: 'person',
      iconColor: '#6D6D6D',
    },
  ];

  const handleNotificationPress = (notification) => {
    // TODO: Handle notification press - navigate to relevant screen
    console.log('Notification pressed:', notification);
  };

  const NotificationItem = ({ notification }) => (
    <TouchableOpacity
      style={styles.notificationItem}
      onPress={() => handleNotificationPress(notification)}
      activeOpacity={0.7}
    >
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={[
            styles.notificationTitle, 
            { color: theme.colors.textPrimary },
            !notification.isRead && styles.unreadTitle
          ]}>
            {notification.title}
          </Text>
          {!notification.isRead && (
            <View style={[styles.unreadDot, { backgroundColor: '#FF1577' }]} />
          )}
        </View>
        <Text style={[styles.notificationMessage, { color: theme.colors.textSecondary }]}>
          {notification.message}
        </Text>
        <Text style={[styles.notificationTime, { color: theme.colors.hint }]}>
          {notification.time}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={64} color={theme.colors.hint} />
            <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
              No notifications
            </Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  notificationItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold',
    flex: 1,
  },
  unreadTitle: {
    fontFamily: 'Nunito_700Bold',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default NotificationsScreen;

