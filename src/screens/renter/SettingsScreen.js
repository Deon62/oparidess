import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useUser } from '../../packages/context/UserContext';
import { Toggle } from '../../packages/components';

// Import profile image
const profileImage = require('../../../assets/logo/profile.jpg');

const SettingsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { logout } = useUser();
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

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

  const handleAccountEdit = () => {
    // TODO: Navigate to account editing screen
    console.log('Account edit pressed');
  };

  const handleCustomerSupport = () => {
    // TODO: Navigate to customer support screen
    console.log('Customer support pressed');
  };

  const handlePrivacy = () => {
    // TODO: Navigate to privacy screen
    console.log('Privacy pressed');
  };

  const handleNotificationPreference = () => {
    // TODO: Navigate to notification preferences screen
    console.log('Notification preference pressed');
  };

  const handleLanguage = () => {
    // TODO: Show language selection modal
    console.log('Language pressed');
  };

  const handleAbout = () => {
    // TODO: Navigate to about screen
    console.log('About pressed');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement account deletion
            console.log('Account deletion confirmed');
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: () => {
            logout();
            // Navigation will happen automatically via MainNavigator
          },
        },
      ]
    );
  };

  const SettingItem = ({ icon, title, onPress, rightComponent, showArrow = true }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.settingItemLeft}>
        <Ionicons name={icon} size={22} color={theme.colors.textPrimary} />
        <Text style={[styles.settingItemTitle, { color: theme.colors.textPrimary }]}>
          {title}
        </Text>
      </View>
      <View style={styles.settingItemRight}>
        {rightComponent}
        {showArrow && onPress && (
          <Ionicons name="chevron-forward" size={20} color={theme.colors.hint} />
        )}
      </View>
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }) => (
    <Text style={[styles.sectionHeader, { color: theme.colors.hint }]}>{title}</Text>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Account Section */}
      <SectionHeader title="Account" />
      <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
        <SettingItem
          icon="person-outline"
          title="Edit Account"
          onPress={handleAccountEdit}
        />
        <SettingItem
          icon="finger-print-outline"
          title="Biometrics Login"
          onPress={null}
          showArrow={false}
          rightComponent={
            <Toggle
              value={biometricsEnabled}
              onValueChange={setBiometricsEnabled}
            />
          }
        />
      </View>

      {/* Preferences Section */}
      <SectionHeader title="Preferences" />
      <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
        <SettingItem
          icon="notifications-outline"
          title="Notification Preferences"
          onPress={handleNotificationPreference}
        />
        <SettingItem
          icon="language-outline"
          title="Language"
          onPress={handleLanguage}
          rightComponent={
            <Text style={[styles.settingItemValue, { color: theme.colors.hint }]}>
              {selectedLanguage}
            </Text>
          }
        />
      </View>

      {/* Support & Info Section */}
      <SectionHeader title="Support & Information" />
      <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
        <SettingItem
          icon="help-circle-outline"
          title="Customer Support"
          onPress={handleCustomerSupport}
        />
        <SettingItem
          icon="shield-checkmark-outline"
          title="Privacy"
          onPress={handlePrivacy}
        />
        <SettingItem
          icon="information-circle-outline"
          title="About"
          onPress={handleAbout}
        />
      </View>

      {/* Danger Zone */}
      <SectionHeader title="Account Actions" />
      <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
        <SettingItem
          icon="trash-outline"
          title="Delete Account"
          onPress={handleDeleteAccount}
          rightComponent={
            <Ionicons name="trash-outline" size={20} color="#F44336" />
          }
        />
        <SettingItem
          icon="log-out-outline"
          title="Logout"
          onPress={handleLogout}
          rightComponent={
            <Ionicons name="log-out-outline" size={20} color={theme.colors.primary} />
          }
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  sectionHeader: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 24,
  },
  section: {
    marginHorizontal: 24,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  settingItemTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingItemValue: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
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

