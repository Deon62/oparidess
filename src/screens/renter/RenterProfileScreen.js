import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useUser } from '../../packages/context/UserContext';
import { Button } from '../../packages/components';

// Import profile image
const profileImage = require('../../../assets/logo/profile.jpg');

const RenterProfileScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { logout, user, updateUser } = useUser();

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

  const handleUploadDocs = () => {
    // TODO: Implement document upload functionality
    Alert.alert(
      'Upload Documents',
      'Document upload feature will be available soon.',
      [{ text: 'OK' }]
    );
  };

  const handleUpdateProfile = () => {
    navigation.navigate('UpdateProfile', { personalInfo });
  };

  const handleAddPayment = () => {
    // TODO: Navigate to add payment method screen
    Alert.alert(
      'Add Payment',
      'Payment method feature will be available soon.',
      [{ text: 'OK' }]
    );
  };

  const handleGetBadge = () => {
    // TODO: Navigate to badge screen
    Alert.alert(
      'Get Badge',
      'Badge feature will be available soon.',
      [{ text: 'OK' }]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => logout(),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
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
          onPress={handleGetBadge}
          activeOpacity={0.7}
        >
          <Ionicons name="trophy-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.additionalActionText, { color: theme.colors.textPrimary }]}>
            Get Badge
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
});

export default RenterProfileScreen;
