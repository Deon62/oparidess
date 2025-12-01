import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useUser } from '../../packages/context/UserContext';
import { Button } from '../../packages/components';

// Import profile image
const profileImage = require('../../../assets/logo/profile.jpg');

const RenterProfileScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { logout, user, updateUser } = useUser();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Mock user data - in real app, this would come from context/API
  const [personalInfo, setPersonalInfo] = useState({
    first_name: user?.first_name || 'John',
    last_name: user?.last_name || 'Doe',
    phone_number: user?.phone_number || '+254 712 345 678',
    date_of_birth: user?.date_of_birth || '1990-01-15',
    gender: user?.gender || 'Male',
    location: user?.location || 'Nairobi, Kenya',
    address: user?.address || '123 Main Street, Westlands',
    id_number: user?.id_number || '12345678',
    profile_completeness: user?.profile_completeness || 75,
  });

  // Set header title
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'My Profile',
    });
  }, [navigation]);

  // Hide tab bar when screen is focused (including when returning from other screens)
  useFocusEffect(
    React.useCallback(() => {
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: 'none' },
      });
      return () => {
        // Only restore tab bar when navigating away from this screen completely
        // Don't restore it here to prevent flickering when navigating to child screens
      };
    }, [navigation])
  );

  // Restore tab bar when component unmounts (navigating away completely)
  useEffect(() => {
    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
    };
  }, [navigation]);

  const handleUploadDocs = () => {
    navigation.navigate('UploadDocs');
  };

  const handleUpdateProfile = () => {
    navigation.navigate('UpdateProfile', { personalInfo });
  };

  const handleBecomeServiceProvider = () => {
    navigation.navigate('BecomeServiceProvider');
  };

  const handleAddPayment = () => {
    navigation.navigate('AddPayment');
  };

  const handleReferFriends = () => {
    navigation.navigate('HomeTab', {
      screen: 'ReferFriends',
    });
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    // Navigation will happen automatically via MainNavigator
  };

  const getCompletenessColor = (percentage) => {
    if (percentage >= 80) return '#4CAF50';
    if (percentage >= 50) return '#FFA500';
    return '#F44336';
  };

  const InfoRow = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
      <View style={styles.infoRowLeft}>
        <Ionicons name={icon} size={20} color={theme.colors.primary} />
        <View style={styles.infoTextContainer}>
          <Text style={[styles.infoLabel, { color: theme.colors.hint }]}>
            {label}
          </Text>
          <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
            {value || 'Not set'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <View style={[styles.profileHeader, { backgroundColor: theme.colors.white }]}>
        <View style={styles.profileImageContainer}>
          <Image
            source={profileImage}
            style={[styles.profileImage, { borderColor: theme.colors.primary }]}
            resizeMode="cover"
          />
          <View style={styles.onlineIndicator} />
          <TouchableOpacity
            style={[styles.cameraButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleUpdateProfile}
            activeOpacity={0.7}
          >
            <Ionicons name="camera" size={16} color={theme.colors.white} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.profileName, { color: theme.colors.textPrimary }]}>
          {personalInfo.first_name} {personalInfo.last_name}
        </Text>
        <Text style={[styles.profileSubtext, { color: theme.colors.textSecondary }]}>
          {personalInfo.phone_number}
        </Text>

        {/* Profile Completeness */}
        <View style={styles.completenessContainer}>
          <View style={styles.completenessHeader}>
            <Text style={[styles.completenessLabel, { color: theme.colors.textSecondary }]}>
              Profile Completeness
            </Text>
            <Text
              style={[
                styles.completenessPercentage,
                { color: getCompletenessColor(personalInfo.profile_completeness) },
              ]}
            >
              {personalInfo.profile_completeness}%
            </Text>
          </View>
          <View style={[styles.progressBarContainer, { backgroundColor: theme.colors.background }]}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${personalInfo.profile_completeness}%`,
                  backgroundColor: getCompletenessColor(personalInfo.profile_completeness),
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <Button
          title="Upload Docs"
          onPress={handleUploadDocs}
          variant="primary"
          style={styles.actionButton}
        />
        <Button
          title="Update Profile"
          onPress={handleUpdateProfile}
          variant="secondary"
          style={styles.actionButton}
        />
      </View>

      {/* Personal Information */}
      <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Personal Information
        </Text>
        <InfoRow
          icon="person-outline"
          label="First Name"
          value={personalInfo.first_name}
        />
        <InfoRow
          icon="person-outline"
          label="Last Name"
          value={personalInfo.last_name}
        />
        <InfoRow
          icon="call-outline"
          label="Phone Number"
          value={personalInfo.phone_number}
        />
        <InfoRow
          icon="calendar-outline"
          label="Date of Birth"
          value={personalInfo.date_of_birth}
        />
        <InfoRow
          icon="person-circle-outline"
          label="Gender"
          value={personalInfo.gender}
        />
        <InfoRow
          icon="location-outline"
          label="Location"
          value={personalInfo.location}
        />
        <InfoRow
          icon="home-outline"
          label="Address"
          value={personalInfo.address}
        />
        <InfoRow
          icon="card-outline"
          label="ID Number"
          value={personalInfo.id_number}
        />
      </View>

      {/* Additional Actions */}
      <View style={styles.additionalActionsContainer}>
        <TouchableOpacity
          style={[styles.additionalActionButton, { backgroundColor: theme.colors.white }]}
          onPress={handleBecomeServiceProvider}
          activeOpacity={0.7}
        >
          <Ionicons name="business-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.additionalActionText, { color: theme.colors.textPrimary }]}>
            Become Service Provider
          </Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.hint} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.additionalActionButton, { backgroundColor: theme.colors.white }]}
          onPress={handleAddPayment}
          activeOpacity={0.7}
        >
          <Ionicons name="card-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.additionalActionText, { color: theme.colors.textPrimary }]}>
            Add Payment
          </Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.hint} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.additionalActionButton, { backgroundColor: theme.colors.white }]}
          onPress={handleReferFriends}
          activeOpacity={0.7}
        >
          <Ionicons name="people-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.additionalActionText, { color: theme.colors.textPrimary }]}>
            Refer to Friends
          </Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.hint} />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: theme.colors.white }]}
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <Ionicons name="log-out-outline" size={24} color="#F44336" />
        <Text style={[styles.logoutText, { color: '#F44336' }]}>
          Logout
        </Text>
      </TouchableOpacity>

      {/* Bottom Spacing */}
      <View style={{ height: 40 }} />

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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  profileSubtext: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 24,
  },
  completenessContainer: {
    width: '100%',
    marginTop: 8,
  },
  completenessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  completenessLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  completenessPercentage: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
  },
  section: {
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  infoRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  additionalActionsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  additionalActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  additionalActionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginHorizontal: 24,
    borderRadius: 16,
    gap: 12,
  },
  logoutText: {
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

export default RenterProfileScreen;
