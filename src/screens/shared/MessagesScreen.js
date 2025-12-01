import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import profile image
const profileImage = require('../../../assets/logo/profile.jpg');
const opaLogo = require('../../../assets/logo/logo.webp');

const MessagesScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // Mock messages data
  const messages = [
    {
      id: 1,
      name: 'John Smith',
      lastMessage: 'Thanks for the ride! The car was perfect.',
      time: '2h ago',
      unread: 2,
      avatar: require('../../../assets/images/car1.webp'), // Using car image as placeholder
      isOnline: true,
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      lastMessage: 'Can we reschedule the booking?',
      time: '5h ago',
      unread: 0,
      avatar: require('../../../assets/images/car2.webp'),
      isOnline: false,
    },
    {
      id: 3,
      name: 'Michael Brown',
      lastMessage: 'The car is ready for pickup.',
      time: '1d ago',
      unread: 1,
      avatar: require('../../../assets/images/car3.webp'),
      isOnline: true,
    },
    {
      id: 4,
      name: 'Emily Davis',
      lastMessage: 'Thank you for choosing our service!',
      time: '2d ago',
      unread: 0,
      avatar: require('../../../assets/images/car4.webp'),
      isOnline: false,
    },
    {
      id: 5,
      name: 'David Wilson',
      lastMessage: 'I\'ll be there in 10 minutes.',
      time: '3d ago',
      unread: 0,
      avatar: require('../../../assets/images/car1.webp'),
      isOnline: true,
    },
  ];

  // Set custom header with profile picture and status bar
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <View style={[styles.customHeader, { backgroundColor: theme.colors.white, paddingTop: insets.top }]}>
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
              Messages
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('HomeTab', { screen: 'RenterProfile' });
              }}
              style={styles.profileButton}
              activeOpacity={0.7}
            >
              <View style={styles.profileImageContainer}>
                <Image source={profileImage} style={[styles.profileImage, { borderColor: theme.colors.primary }]} resizeMode="cover" />
                <View style={styles.profileOnlineIndicator} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      ),
    });
  }, [navigation, theme, insets.top]);

  const handleMessagePress = (message) => {
    navigation.navigate('Chat', { 
      chatId: message.id,
      userName: message.name,
      userAvatar: message.avatar,
    });
  };

  const handleOpaPress = () => {
    navigation.navigate('Chat', { 
      chatId: 'opa-official',
      userName: 'Opa Support',
      userAvatar: opaLogo,
      isOfficial: true,
    });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Pinned Opa Conversation */}
      <TouchableOpacity
        onPress={handleOpaPress}
        activeOpacity={0.7}
        style={[styles.messageItem, styles.pinnedMessage]}
      >
        <View style={styles.avatarContainer}>
          <Image source={opaLogo} style={styles.avatar} resizeMode="cover" />
          <View style={[styles.onlineIndicator, { backgroundColor: '#4CAF50' }]} />
        </View>
        <View style={styles.messageContent}>
          <View style={styles.messageHeader}>
            <Text style={[styles.messageName, { color: theme.colors.textPrimary }]}>
              Opa Support
            </Text>
            <Ionicons name="pin" size={16} color={theme.colors.primary} style={styles.pinIcon} />
          </View>
          <View style={styles.messageFooter}>
            <Text
              style={[styles.lastMessage, { color: theme.colors.textSecondary }]}
              numberOfLines={1}
            >
              Official support channel - We're here to help!
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: theme.colors.hint }]} />

      {/* Regular Messages */}
      {messages.map((message) => (
        <TouchableOpacity
          key={message.id}
          onPress={() => handleMessagePress(message)}
          activeOpacity={0.7}
          style={styles.messageItem}
        >
          <View style={styles.avatarContainer}>
            <Image source={message.avatar} style={styles.avatar} resizeMode="cover" />
            {message.isOnline && (
              <View style={[styles.onlineIndicator, { backgroundColor: '#4CAF50' }]} />
            )}
          </View>
          <View style={styles.messageContent}>
            <View style={styles.messageHeader}>
              <Text style={[styles.messageName, { color: theme.colors.textPrimary }]}>
                {message.name}
              </Text>
              <Text style={[styles.messageTime, { color: theme.colors.hint }]}>
                {message.time}
              </Text>
            </View>
            <View style={styles.messageFooter}>
              <Text
                style={[
                  styles.lastMessage,
                  { color: message.unread > 0 ? theme.colors.textPrimary : theme.colors.textSecondary },
                  message.unread > 0 && styles.unreadMessage,
                ]}
                numberOfLines={1}
              >
                {message.lastMessage}
              </Text>
              {message.unread > 0 && (
                <View style={[styles.unreadBadge, { backgroundColor: theme.colors.primary }]}>
                  <Text style={[styles.unreadText, { color: theme.colors.white }]}>
                    {message.unread}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
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
  messageItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  messageName: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    flex: 1,
  },
  messageTime: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    marginLeft: 8,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    flex: 1,
    marginRight: 8,
  },
  unreadMessage: {
    fontFamily: 'Nunito_600SemiBold',
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    fontSize: 11,
    fontFamily: 'Nunito_700Bold',
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
  profileOnlineIndicator: {
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
  pinnedMessage: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 8,
  },
  pinIcon: {
    marginLeft: 8,
  },
  divider: {
    height: 1,
    marginVertical: 8,
    opacity: 0.2,
  },
});

export default MessagesScreen;

