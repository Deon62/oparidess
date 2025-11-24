import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../packages/theme/ThemeProvider';

const NotificationsScreen = () => {
  const theme = useTheme();
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

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
      message: 'Payment of $135 has been successfully processed',
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

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'unread') return !notif.isRead;
    if (filter === 'read') return notif.isRead;
    return true;
  });

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

  const handleNotificationPress = (notification) => {
    // TODO: Handle notification press - navigate to relevant screen
    console.log('Notification pressed:', notification);
  };

  const handleMarkAllRead = () => {
    // TODO: Mark all notifications as read
    console.log('Mark all as read');
  };

  const NotificationItem = ({ notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        { backgroundColor: theme.colors.white },
        !notification.isRead && { backgroundColor: theme.colors.primary + '05' },
      ]}
      onPress={() => handleNotificationPress(notification)}
      activeOpacity={0.7}
    >
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={[styles.notificationTitle, { color: theme.colors.textPrimary }]}>
            {notification.title}
          </Text>
          {!notification.isRead && (
            <View style={[styles.unreadDot, { backgroundColor: theme.colors.primary }]} />
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
      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <View style={styles.filterRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === 'all' && [styles.filterButtonActive, { backgroundColor: theme.colors.primary }],
              ]}
              onPress={() => setFilter('all')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: filter === 'all' ? theme.colors.white : theme.colors.textSecondary },
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === 'unread' && [
                  styles.filterButtonActive,
                  { backgroundColor: theme.colors.primary },
                ],
              ]}
              onPress={() => setFilter('unread')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: filter === 'unread' ? theme.colors.white : theme.colors.textSecondary },
                ]}
              >
                Unread
                {unreadCount > 0 && (
                  <Text style={[styles.filterBadge, { color: theme.colors.white }]}>
                    {' '}({unreadCount})
                  </Text>
                )}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === 'read' && [styles.filterButtonActive, { backgroundColor: theme.colors.primary }],
              ]}
              onPress={() => setFilter('read')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: filter === 'read' ? theme.colors.white : theme.colors.textSecondary },
                ]}
              >
                Read
              </Text>
            </TouchableOpacity>
          </ScrollView>
          {unreadCount > 0 && (
            <TouchableOpacity
              style={styles.markAllButton}
              onPress={handleMarkAllRead}
              activeOpacity={0.7}
            >
              <Ionicons name="checkmark-done" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Notifications List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={64} color={theme.colors.hint} />
            <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
              No {filter === 'all' ? '' : filter} notifications
            </Text>
          </View>
        ) : (
          filteredNotifications.map((notification) => (
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
  filterContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterScroll: {
    gap: 12,
    flex: 1,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
  },
  filterButtonActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  filterBadge: {
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
  },
  markAllButton: {
    padding: 8,
    marginLeft: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 12,
  },
  notificationItem: {
    padding: 16,
    borderRadius: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    flex: 1,
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
    marginBottom: 6,
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

