import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';

// Import profile image
const profileImage = require('../../../assets/logo/profile.jpg');

const SettingsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  // Set header with profile picture
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            // TODO: Navigate to profile
            console.log('Profile pressed');
          }}
          style={styles.profileButton}
          activeOpacity={0.7}
        >
          <View style={styles.profileImageContainer}>
            <Image source={profileImage} style={[styles.profileImage, { borderColor: theme.colors.primary }]} resizeMode="cover" />
            <View style={styles.onlineIndicator} />
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation, theme]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
        Settings
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Settings options will appear here
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
    flexGrow: 1,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 22,
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
});

export default SettingsScreen;

