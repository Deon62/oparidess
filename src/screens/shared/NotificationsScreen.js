import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NotificationsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // Notifications data - will be fetched from API
  const notifications = [];

  // Set custom header with status bar
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <View style={[styles.customHeader, { backgroundColor: theme.colors.white, paddingTop: insets.top }]}>
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
              Notifications
            </Text>
          </View>
        </View>
      ),
    });
  }, [navigation, theme, insets.top]);

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
            <Text style={[styles.emptyStateTitle, { color: theme.colors.textPrimary }]}>
              No notifications yet
            </Text>
            <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
              When you get notifications about your bookings, messages, and updates, they'll appear here.
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
  customHeader: {
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_600SemiBold',
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
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default NotificationsScreen;

