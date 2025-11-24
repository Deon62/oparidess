import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';

// Import profile image
const profileImage = require('../../../assets/logo/profile.jpg');

const OwnerBookingsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          <TouchableOpacity
            onPress={() => {
              // TODO: Navigate to notifications
              console.log('Notifications pressed');
            }}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // TODO: Navigate to messages
              console.log('Messages pressed');
            }}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chatbubble-outline" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // TODO: Navigate to profile
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

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
        Bookings
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        View and manage all your car rental bookings
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
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
});

export default OwnerBookingsScreen;
