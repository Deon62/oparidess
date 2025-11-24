import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useUser } from '../../packages/context/UserContext';
import { Toggle, Button } from '../../packages/components';

// Import profile image
const profileImage = require('../../../assets/logo/profile.jpg');

const SettingsScreen = () => {
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
              navigation.navigate('HomeTab', { screen: 'RenterProfile' });
            }}
            style={styles.profileButton}
            activeOpacity={0.7}
          >
            <View style={styles.profileImageContainer}>
              <Image source={profileImage} style={[styles.profileImage, { borderColor: theme.colors.primary }]} resizeMode="cover" />
              <View style={styles.onlineIndicator} />
            </View>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, theme]);

  const handleAccountEdit = () => {
    // TODO: Navigate to account editing screen
    console.log('Account edit pressed');
  };

  const handleCustomerSupport = () => {
    navigation.navigate('CustomerSupport');
  };

  const handlePrivacy = () => {
    navigation.navigate('Privacy');
  };

  const handleNotificationPreference = () => {
    navigation.navigate('NotificationPreferences');
  };

  const handleLanguage = () => {
    navigation.navigate('Language', {
      currentLanguage: selectedLanguage,
      onLanguageSelect: (language) => {
        setSelectedLanguage(language);
      },
    });
  };

  const handleAbout = () => {
    navigation.navigate('About');
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmText.toLowerCase() === 'delete') {
      // TODO: Implement account deletion
      console.log('Account deletion confirmed');
      setShowDeleteModal(false);
      setDeleteConfirmText('');
      Alert.alert('Account Deleted', 'Your account has been permanently deleted.');
    } else {
      Alert.alert('Invalid Confirmation', 'Please type "delete" exactly to confirm.');
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDeleteConfirmText('');
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    // Navigation will happen automatically via MainNavigator
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

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.logoutModalOverlay}>
          <View style={[styles.logoutModalContent, { backgroundColor: theme.colors.white }]}>
            <View style={[styles.logoutIconCircle, { backgroundColor: '#F44336' + '20' }]}>
              <Ionicons name="log-out-outline" size={64} color="#F44336" />
            </View>
            <Text style={[styles.logoutModalTitle, { color: theme.colors.textPrimary }]}>
              Logout
            </Text>
            <Text style={[styles.logoutModalMessage, { color: theme.colors.textSecondary }]}>
              Are you sure you want to log out? You'll need to sign in again to access your account.
            </Text>
            <View style={styles.logoutModalButtons}>
              <TouchableOpacity
                style={[styles.logoutModalButton, styles.logoutModalButtonCancel, { borderColor: theme.colors.hint }]}
                onPress={() => setShowLogoutModal(false)}
                activeOpacity={0.7}
              >
                <Text style={[styles.logoutModalButtonText, { color: theme.colors.textSecondary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.logoutModalButton, styles.logoutModalButtonLogout, { backgroundColor: '#F44336' }]}
                onPress={handleConfirmLogout}
                activeOpacity={0.7}
              >
                <Text style={[styles.logoutModalButtonText, { color: theme.colors.white }]}>
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={handleDeleteCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.white }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
              Delete Account
            </Text>
            <Text style={[styles.modalMessage, { color: theme.colors.textSecondary }]}>
              Type "delete" to confirm account deletion. This action cannot be undone.
            </Text>
            <TextInput
              style={[styles.modalInput, { 
                color: theme.colors.textPrimary,
                borderColor: theme.colors.hint,
              }]}
              placeholder="Type 'delete' to confirm"
              placeholderTextColor={theme.colors.hint}
              value={deleteConfirmText}
              onChangeText={setDeleteConfirmText}
              autoCapitalize="none"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={handleDeleteCancel}
                activeOpacity={0.7}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.textSecondary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton, 
                  styles.modalButtonDelete, 
                  { backgroundColor: '#F44336' },
                  deleteConfirmText.toLowerCase() !== 'delete' && { opacity: 0.5 }
                ]}
                onPress={handleDeleteConfirm}
                activeOpacity={0.7}
                disabled={deleteConfirmText.toLowerCase() !== 'delete'}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.white }]}>
                  Delete
                </Text>
              </TouchableOpacity>
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
    marginLeft: 4,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 22,
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#F0F0F0',
  },
  modalButtonDelete: {
    opacity: 1,
  },
  modalButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  // Logout Modal Styles
  logoutModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  logoutModalContent: {
    width: '85%',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
  },
  logoutIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoutModalTitle: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  logoutModalMessage: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  logoutModalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  logoutModalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutModalButtonCancel: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  logoutModalButtonLogout: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  logoutModalButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
});

export default SettingsScreen;

