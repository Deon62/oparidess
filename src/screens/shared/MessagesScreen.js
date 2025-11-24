import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';

// Import profile image
const profileImage = require('../../../assets/logo/profile.jpg');

const MessagesScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  // Mock messages data
  const messages = [
    {
      id: 1,
      name: 'John Smith',
      lastMessage: 'Thanks for the ride! The car was perfect.',
      time: '2h ago',
      unread: 2,
      avatar: require('../../../assets/images/car1.jpg'), // Using car image as placeholder
      isOnline: true,
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      lastMessage: 'Can we reschedule the booking?',
      time: '5h ago',
      unread: 0,
      avatar: require('../../../assets/images/car2.jpg'),
      isOnline: false,
    },
    {
      id: 3,
      name: 'Michael Brown',
      lastMessage: 'The car is ready for pickup.',
      time: '1d ago',
      unread: 1,
      avatar: require('../../../assets/images/car3.jpg'),
      isOnline: true,
    },
    {
      id: 4,
      name: 'Emily Davis',
      lastMessage: 'Thank you for choosing our service!',
      time: '2d ago',
      unread: 0,
      avatar: require('../../../assets/images/car4.jpg'),
      isOnline: false,
    },
    {
      id: 5,
      name: 'David Wilson',
      lastMessage: 'I\'ll be there in 10 minutes.',
      time: '3d ago',
      unread: 0,
      avatar: require('../../../assets/images/car1.jpg'),
      isOnline: true,
    },
  ];

  // Set header with profile picture
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('SettingsTab', { screen: 'RenterProfile' });
              }}
              style={styles.profileButton}
              activeOpacity={0.7}
            >
          <View style={styles.profileImageContainer}>
            <Image source={profileImage} style={[styles.profileImage, { borderColor: theme.colors.primary }]} resizeMode="cover" />
            <View style={styles.profileOnlineIndicator} />
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation, theme]);

  const handleMessagePress = (message) => {
    navigation.navigate('Chat', { 
      chatId: message.id,
      userName: message.name,
      userAvatar: message.avatar,
    });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
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
});

export default MessagesScreen;

