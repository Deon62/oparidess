import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useUser } from '../../packages/context/UserContext';
import { Button } from '../../packages/components';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import profile image
const profileImage = require('../../../assets/logo/profile.jpg');

const RenterProfileScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { logout, user, updateUser } = useUser();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [profileImageUri, setProfileImageUri] = useState(user?.profile_image_uri || null);

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
    rating: user?.rating || 4.8,
    totalReviews: user?.totalReviews || 24,
  });

  // Update profile image URI when user context changes
  useEffect(() => {
    if (user?.profile_image_uri) {
      setProfileImageUri(user.profile_image_uri);
    }
  }, [user?.profile_image_uri]);

  // Hide header and show only back button
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleUploadDocs = () => {
    navigation.navigate('UploadDocs');
  };

  const handleUpdateProfile = () => {
    navigation.navigate('UpdateProfile', { personalInfo });
  };

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'We need access to your photos to update your profile picture.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setProfileImageUri(imageUri);
        // Update user context with profile image
        updateUser({ profile_image_uri: imageUri });
        Alert.alert('Success', 'Profile picture updated successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      console.error('Image picker error:', error);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'We need access to your camera to take a photo.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setProfileImageUri(imageUri);
        // Update user context with profile image
        updateUser({ profile_image_uri: imageUri });
        Alert.alert('Success', 'Profile picture updated successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
      console.error('Camera error:', error);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Update Profile Picture',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Gallery', onPress: pickImage },
      ],
      { cancelable: true }
    );
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

  // Render star rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <View style={styles.starsContainer}>
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return (
              <Ionicons
                key={i}
                name="star"
                size={16}
                color="#FFB800"
              />
            );
          } else if (i === fullStars && hasHalfStar) {
            return (
              <Ionicons
                key={i}
                name="star-half"
                size={16}
                color="#FFB800"
              />
            );
          } else {
            return (
              <Ionicons
                key={i}
                name="star-outline"
                size={16}
                color="#FFB800"
              />
            );
          }
        })}
      </View>
    );
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Floating Back Button */}
      <View style={[styles.backButtonContainer, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.colors.white }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
      {/* Profile Header */}
      <View style={[styles.profileHeader, { backgroundColor: theme.colors.white }]}>
        <View style={styles.profileImageContainer}>
          <Image
            source={profileImageUri ? { uri: profileImageUri } : profileImage}
            style={[styles.profileImage, { borderColor: theme.colors.primary }]}
            resizeMode="cover"
          />
          <View style={styles.onlineIndicator} />
          <TouchableOpacity
            style={[styles.cameraButton, { backgroundColor: theme.colors.primary }]}
            onPress={showImageOptions}
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

        {/* User Rating */}
        <View style={styles.ratingContainer}>
          {renderStars(personalInfo.rating)}
          <Text style={[styles.ratingValue, { color: theme.colors.textPrimary }]}>
            {personalInfo.rating.toFixed(1)}
          </Text>
          <Text style={[styles.ratingCount, { color: theme.colors.textSecondary }]}>
            ({personalInfo.totalReviews} reviews)
          </Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
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
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingValue: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
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
