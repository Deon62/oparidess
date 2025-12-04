import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Modal, StatusBar, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
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
  const [showNameEditModal, setShowNameEditModal] = useState(false);
  const [showNameSuccessModal, setShowNameSuccessModal] = useState(false);
  const [editedFirstName, setEditedFirstName] = useState('');
  const [editedLastName, setEditedLastName] = useState('');

  // Mock user data - in real app, this would come from context/API
  const [personalInfo, setPersonalInfo] = useState({
    first_name: user?.first_name || 'John',
    last_name: user?.last_name || 'Doe',
    email: user?.email || 'john.doe@example.com',
    phone_number: user?.phone_number || '+254 712 345 678',
    date_of_birth: user?.date_of_birth || '1990-01-15',
    gender: user?.gender || 'Male',
    location: user?.location || 'Nairobi, Kenya',
    address: user?.address || '123 Main Street, Westlands',
    id_number: user?.id_number || '12345678',
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

  // Ensure StatusBar is visible when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      // StatusBar will be shown via the component
    }, [])
  );

  const handleUploadDocs = () => {
    navigation.navigate('UploadDocs');
  };

  const handleUpdateProfile = () => {
    navigation.navigate('UpdateProfile', { personalInfo });
  };

  const handleEditName = () => {
    setEditedFirstName(personalInfo.first_name);
    setEditedLastName(personalInfo.last_name);
    setShowNameEditModal(true);
  };

  const handleSaveName = () => {
    if (editedFirstName.trim() && editedLastName.trim()) {
      setPersonalInfo(prev => ({
        ...prev,
        first_name: editedFirstName.trim(),
        last_name: editedLastName.trim(),
      }));
      // Update user context
      updateUser({
        first_name: editedFirstName.trim(),
        last_name: editedLastName.trim(),
      });
      setShowNameEditModal(false);
      setShowNameSuccessModal(true);
    } else {
      Alert.alert('Error', 'Please enter both first and last name.');
    }
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

  const handleOpaHostApp = () => {
    navigation.navigate('OpaHostApp');
  };

  const handleAddPayment = () => {
    navigation.navigate('AddPayment');
  };

  const handleReferFriends = () => {
    navigation.navigate('ReferFriends');
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    // Navigation will happen automatically via MainNavigator
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
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      {/* Floating Back Button and Settings Icon */}
      <View style={[styles.topButtonsContainer, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.colors.white }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.settingsButton, { backgroundColor: theme.colors.white }]}
          onPress={() => navigation.navigate('Settings')}
          activeOpacity={0.8}
        >
          <Ionicons name="settings-outline" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
      {/* Profile Header */}
      <View style={styles.profileHeader}>
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
        <View style={styles.profileNameContainer}>
          <Text style={[styles.profileName, { color: theme.colors.textPrimary }]}>
            {personalInfo.first_name} {personalInfo.last_name}
          </Text>
          <TouchableOpacity
            onPress={handleEditName}
            style={styles.nameEditIcon}
            activeOpacity={0.7}
          >
            <Ionicons name="create-outline" size={18} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.profileSubtext, { color: theme.colors.textSecondary }]}>
          {personalInfo.email}
        </Text>
      </View>

      {/* Separator Line */}
      <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

      {/* Personal Information */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Personal Information
          </Text>
          <TouchableOpacity
            onPress={handleUpdateProfile}
            style={styles.updateProfileIcon}
            activeOpacity={0.7}
          >
            <Ionicons name="create-outline" size={22} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
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
          icon="card-outline"
          label="ID Number"
          value={personalInfo.id_number}
        />
      </View>

      {/* Separator Line */}
      <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

      {/* Account Actions */}
      <View style={styles.additionalActionsContainer}>
        <View style={styles.accountActionsHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, marginBottom: 12 }]}>
            Account Actions
          </Text>
        </View>
        <TouchableOpacity
          style={styles.additionalActionButton}
          onPress={handleOpaHostApp}
          activeOpacity={0.7}
        >
          <Ionicons name="business-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.additionalActionText, { color: theme.colors.textPrimary }]}>
            List car & services
          </Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.hint} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.additionalActionButton}
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
          style={styles.additionalActionButton}
          onPress={handleUploadDocs}
          activeOpacity={0.7}
        >
          <Ionicons name="document-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.additionalActionText, { color: theme.colors.textPrimary }]}>
            Upload Docs
          </Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.hint} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.additionalActionButton}
          onPress={handleReferFriends}
          activeOpacity={0.7}
        >
          <Ionicons name="people-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.additionalActionText, { color: theme.colors.textPrimary }]}>
            Refer to Friends
          </Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.hint} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.additionalActionButton}
          onPress={() => navigation.navigate('WriteBlog')}
          activeOpacity={0.7}
        >
          <Ionicons name="create-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.additionalActionText, { color: theme.colors.textPrimary }]}>
            Write Opa Blog
          </Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.hint} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.additionalActionButton}
          onPress={() => navigation.navigate('ShareFeedback')}
          activeOpacity={0.7}
        >
          <Ionicons name="chatbubble-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.additionalActionText, { color: theme.colors.textPrimary }]}>
            Help us Improve
          </Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.hint} />
        </TouchableOpacity>
      </View>

      {/* Separator Line */}
      <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
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

      {/* Name Edit Modal */}
      <Modal
        visible={showNameEditModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNameEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.nameEditModalContent, { backgroundColor: theme.colors.white }]}>
            <Text style={[styles.nameEditModalTitle, { color: theme.colors.textPrimary }]}>
              Edit Name
            </Text>
            <View style={styles.nameEditInputContainer}>
              <Text style={[styles.nameEditLabel, { color: theme.colors.textSecondary }]}>
                First Name
              </Text>
              <TextInput
                style={[styles.nameEditInput, { 
                  color: theme.colors.textPrimary,
                  borderColor: theme.colors.hint + '40',
                  backgroundColor: theme.colors.background,
                }]}
                value={editedFirstName}
                onChangeText={setEditedFirstName}
                placeholder="Enter first name"
                placeholderTextColor={theme.colors.hint}
                autoCapitalize="words"
              />
            </View>
            <View style={styles.nameEditInputContainer}>
              <Text style={[styles.nameEditLabel, { color: theme.colors.textSecondary }]}>
                Last Name
              </Text>
              <TextInput
                style={[styles.nameEditInput, { 
                  color: theme.colors.textPrimary,
                  borderColor: theme.colors.hint + '40',
                  backgroundColor: theme.colors.background,
                }]}
                value={editedLastName}
                onChangeText={setEditedLastName}
                placeholder="Enter last name"
                placeholderTextColor={theme.colors.hint}
                autoCapitalize="words"
              />
            </View>
            <View style={styles.nameEditModalButtons}>
              <TouchableOpacity
                style={[styles.nameEditModalButton, styles.nameEditModalButtonCancel, { borderColor: theme.colors.hint }]}
                onPress={() => setShowNameEditModal(false)}
                activeOpacity={0.7}
              >
                <Text style={[styles.nameEditModalButtonText, { color: theme.colors.textSecondary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.nameEditModalButton, styles.nameEditModalButtonSave, { backgroundColor: theme.colors.primary }]}
                onPress={handleSaveName}
                activeOpacity={0.7}
              >
                <Text style={[styles.nameEditModalButtonText, { color: theme.colors.white }]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Name Update Success Modal */}
      <Modal
        visible={showNameSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNameSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.nameSuccessModalContent, { backgroundColor: theme.colors.white }]}>
            <View style={[styles.nameSuccessIconCircle, { backgroundColor: '#4CAF50' + '20' }]}>
              <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
            </View>
            <Text style={[styles.nameSuccessModalTitle, { color: theme.colors.textPrimary }]}>
              Name Updated!
            </Text>
            <Text style={[styles.nameSuccessModalMessage, { color: theme.colors.textSecondary }]}>
              Your name has been updated successfully.
            </Text>
            <TouchableOpacity
              style={[styles.nameSuccessModalButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => setShowNameSuccessModal(false)}
              activeOpacity={0.7}
            >
              <Text style={[styles.nameSuccessModalButtonText, { color: theme.colors.white }]}>
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  topButtonsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    alignItems: 'center',
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
  settingsButton: {
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
    paddingTop: 60,
    marginBottom: 24,
  },
  sectionSeparator: {
    borderTopWidth: 1,
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 8,
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
  profileNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    gap: 8,
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    textAlign: 'center',
  },
  nameEditIcon: {
    padding: 4,
  },
  profileSubtext: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 12,
  },
  section: {
    marginHorizontal: 0,
    paddingHorizontal: 24,
    paddingVertical: 20,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    letterSpacing: -0.3,
  },
  updateProfileIcon: {
    padding: 4,
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
    marginBottom: 8,
    gap: 0,
  },
  accountActionsHeader: {
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  additionalActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingHorizontal: 24,
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
    gap: 12,
    marginTop: 8,
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
  // Name Edit Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  nameEditModalContent: {
    width: '85%',
    borderRadius: 24,
    padding: 24,
  },
  nameEditModalTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  nameEditInputContainer: {
    marginBottom: 16,
  },
  nameEditLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 8,
  },
  nameEditInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
  },
  nameEditModalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  nameEditModalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameEditModalButtonCancel: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  nameEditModalButtonSave: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  nameEditModalButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  // Name Success Modal Styles
  nameSuccessModalContent: {
    width: '85%',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
  },
  nameSuccessIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  nameSuccessModalTitle: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  nameSuccessModalMessage: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  nameSuccessModalButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  nameSuccessModalButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
});

export default RenterProfileScreen;
