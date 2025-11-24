import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useUser } from '../../packages/context/UserContext';
import { Toggle, Button } from '../../packages/components';

// Import profile image
const profileImage = require('../../../assets/logo/profile.jpg');

const DriverSettingsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { logout } = useUser();
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Set header with notifications and profile picture
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Notifications');
            }}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('DriverProfile');
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

  const handleAccountEdit = () => {
    navigation.navigate('UpdateProfile');
  };

  const handleNotificationPreference = () => {
    navigation.navigate('NotificationPreferences');
  };

  const handleLanguage = () => {
    navigation.navigate('Language');
  };

  const handleCustomerSupport = () => {
    navigation.navigate('CustomerSupport');
  };

  const handlePrivacy = () => {
    navigation.navigate('Privacy');
  };

  const handleAbout = () => {
    navigation.navigate('About');
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = () => {
    if (deleteConfirmText.toLowerCase() === 'delete') {
      setShowDeleteModal(false);
      setDeleteConfirmText('');
      // TODO: Implement account deletion
      Alert.alert('Account Deleted', 'Your account has been permanently deleted.');
      logout();
    } else {
      Alert.alert('Error', 'Please type "DELETE" to confirm account deletion.');
    }
  };

  const SettingItem = ({ icon, title, onPress, showArrow = true, rightComponent }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.settingItemLeft}>
        <Ionicons name={icon} size={24} color={theme.colors.primary} />
        <Text style={[styles.settingItemTitle, { color: theme.colors.textPrimary }]}>
          {title}
        </Text>
      </View>
      {rightComponent || (showArrow && onPress && (
        <Ionicons name="chevron-forward" size={20} color={theme.colors.hint} />
      ))}
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }) => (
    <Text style={[styles.sectionHeader, { color: theme.colors.textSecondary }]}>
      {title}
    </Text>
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
          title="Privacy Policy"
          onPress={handlePrivacy}
        />
        <SettingItem
          icon="information-circle-outline"
          title="About"
          onPress={handleAbout}
        />
      </View>

      {/* Actions Section */}
      <SectionHeader title="Actions" />
      <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
        <SettingItem
          icon="log-out-outline"
          title="Logout"
          onPress={handleLogout}
        />
        <SettingItem
          icon="trash-outline"
          title="Delete Account"
          onPress={handleDeleteAccount}
        />
      </View>

      {/* Bottom Spacing */}
      <View style={{ height: 40 }} />

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.white }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
              Logout
            </Text>
            <Text style={[styles.modalMessage, { color: theme.colors.textSecondary }]}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setShowLogoutModal(false)}
                variant="secondary"
                style={styles.modalButton}
              />
              <Button
                title="Logout"
                onPress={confirmLogout}
                variant="primary"
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Account Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.white }]}>
            <Text style={[styles.modalTitle, { color: '#FF3B30' }]}>
              Delete Account
            </Text>
            <Text style={[styles.modalMessage, { color: theme.colors.textSecondary }]}>
              This action cannot be undone. This will permanently delete your account and all associated data.
            </Text>
            <Text style={[styles.modalWarning, { color: theme.colors.textSecondary }]}>
              Type "DELETE" to confirm:
            </Text>
            <TextInput
              style={[
                styles.deleteInput,
                {
                  borderColor: theme.colors.hint + '40',
                  color: theme.colors.textPrimary,
                },
              ]}
              value={deleteConfirmText}
              onChangeText={setDeleteConfirmText}
              placeholder="Type DELETE"
              placeholderTextColor={theme.colors.hint}
            />
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText('');
                }}
                variant="secondary"
                style={styles.modalButton}
              />
              <Button
                title="Delete Account"
                onPress={confirmDeleteAccount}
                variant="primary"
                style={[styles.modalButton, { backgroundColor: '#FF3B30' }]}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
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
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingItemTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  settingItemValue: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
    marginBottom: 16,
  },
  modalWarning: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 8,
  },
  deleteInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
});

export default DriverSettingsScreen;

