import React, { useMemo, useRef, useState, useLayoutEffect, useEffect } from 'react';
import { Animated, View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Modal, StatusBar, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { logout, user, updateUser } = useUser();
  const PREVIEW_VERIFIED_PROFILE_KEY = '@oparides:preview_verified_profile';
  const [previewVerified, setPreviewVerified] = useState(route?.params?.previewVerified === true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [profileImageUri, setProfileImageUri] = useState(user?.profile_image_uri || null);
  const [showNameEditModal, setShowNameEditModal] = useState(false);
  const [showNameSuccessModal, setShowNameSuccessModal] = useState(false);
  const [editedFirstName, setEditedFirstName] = useState('');
  const [editedLastName, setEditedLastName] = useState('');
  const flipAnim = useRef(new Animated.Value(0)).current;
  const flipSideRef = useRef(0);
  const isFlippingRef = useRef(false);
  const hintPulse = useRef(new Animated.Value(0)).current;

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

  // Driver's license information
  const dlInfo = {
    dl_number: user?.dl_number || '',
    dl_category: user?.dl_category || '',
    dl_issue_date: user?.dl_issue_date || '',
    dl_expiry_date: user?.dl_expiry_date || '',
  };

  // Check if user has driver's license information
  const hasDlInfo = dlInfo.dl_number || dlInfo.dl_category || dlInfo.dl_issue_date || dlInfo.dl_expiry_date;

  const memberSince = useMemo(() => {
    const raw = user?.created_at || user?.member_since || user?.createdAt;
    if (!raw) return 'Jan 2025';
    try {
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) return '—';
      return d.toLocaleDateString('en-KE', { month: 'short', year: 'numeric' });
    } catch {
      return '—';
    }
  }, [user?.created_at, user?.member_since, user?.createdAt]);

  const rentalsCount = useMemo(() => {
    const raw = user?.rentals_count ?? user?.rentalsCount ?? user?.total_rentals ?? user?.totalRentals;
    if (raw === undefined || raw === null || raw === '') return 12;
    const num = Number(raw);
    if (Number.isFinite(num)) return num;
    return 0;
  }, [user?.rentals_count, user?.rentalsCount, user?.total_rentals, user?.totalRentals]);

  const ratingValue = useMemo(() => {
    const raw = user?.rating ?? user?.avg_rating ?? user?.average_rating;
    if (raw === undefined || raw === null || raw === '') return '4.8';
    const num = Number(raw);
    if (Number.isFinite(num)) return num.toFixed(1);
    return '4.8';
  }, [user?.rating, user?.avg_rating, user?.average_rating]);

  const verificationRows = useMemo(() => {
    const hasPhone = !!(personalInfo.phone_number && String(personalInfo.phone_number).trim());
    const hasId = !!(personalInfo.id_number && String(personalInfo.id_number).trim());
    const hasAvatar = !!profileImageUri;
    const profileCompleteness = Number(user?.profile_completeness);
    const isProfileComplete = Number.isFinite(profileCompleteness) ? profileCompleteness >= 80 : hasPhone;

    return [
      { label: 'Profile details', ok: isProfileComplete },
      { label: 'ID number', ok: hasId },
      { label: 'Driver’s license', ok: !!hasDlInfo },
      { label: 'Profile photo', ok: hasAvatar },
    ];
  }, [personalInfo.phone_number, personalInfo.id_number, hasDlInfo, profileImageUri, user?.profile_completeness]);

  const displayVerificationRows = useMemo(() => {
    if (!previewVerified) return verificationRows;
    return verificationRows.map((r) => ({ ...r, ok: true }));
  }, [previewVerified, verificationRows]);

  const verificationProgress = useMemo(() => {
    const total = displayVerificationRows.length || 1;
    const done = displayVerificationRows.filter((r) => r.ok).length;
    return {
      total,
      done,
      ratio: Math.min(1, Math.max(0, done / total)),
    };
  }, [displayVerificationRows]);

  const missingDocsText = useMemo(() => {
    if (previewVerified) return '';
    const missing = verificationRows
      .filter((r) => !r.ok)
      .map((r) => {
        if (r.label === 'Profile details') return 'complete profile details';
        if (r.label === 'ID number') return 'add your ID number';
        if (r.label === 'Driver’s license') return 'upload your driver’s license';
        if (r.label === 'Profile photo') return 'add a profile photo';
        return r.label;
      });

    if (missing.length === 0) return '';
    if (missing.length === 1) return missing[0];
    if (missing.length === 2) return `${missing[0]} and ${missing[1]}`;
    return `${missing.slice(0, -1).join(', ')}, and ${missing[missing.length - 1]}`;
  }, [previewVerified, verificationRows]);

  const handleFlipVerificationCard = () => {
    if (isFlippingRef.current) return;
    isFlippingRef.current = true;

    const toValue = flipSideRef.current === 1 ? 0 : 1;
    flipSideRef.current = toValue;

    Animated.timing(flipAnim, {
      toValue,
      duration: 450,
      useNativeDriver: true,
    }).start(() => {
      isFlippingRef.current = false;
    });
  };

  // Update profile image URI when user context changes
  useEffect(() => {
    if (user?.profile_image_uri) {
      setProfileImageUri(user.profile_image_uri);
    }
  }, [user?.profile_image_uri]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(hintPulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(hintPulse, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [hintPulse]);

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

  useFocusEffect(
    React.useCallback(() => {
      let mounted = true;
      const loadPreviewVerified = async () => {
        try {
          const value = await AsyncStorage.getItem(PREVIEW_VERIFIED_PROFILE_KEY);
          const storedEnabled = value === 'true';
          const routeEnabled = route?.params?.previewVerified === true;
          if (mounted) setPreviewVerified(storedEnabled || routeEnabled);
        } catch {
          const routeEnabled = route?.params?.previewVerified === true;
          if (mounted) setPreviewVerified(routeEnabled);
        }
      };

      loadPreviewVerified();
      return () => {
        mounted = false;
      };
    }, [route?.params?.previewVerified])
  );

  const handleUploadDocs = () => {
    navigation.navigate('UploadDocs');
  };

  const handleUpdateProfile = () => {
    navigation.navigate('UpdateProfile', { personalInfo });
  };

  const handleDriversLicenseInfo = () => {
    navigation.navigate('DriversLicenseInfo');
  };

  const handleReferHost = () => {
    navigation.navigate('ReferHost');
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

  const handleJoinOpaPremium = () => {
    navigation.navigate('OpaPremium');
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
        <View style={styles.topRightButtons}>
          <TouchableOpacity
            style={[styles.settingsButton, { backgroundColor: theme.colors.white }]}
            onPress={handleJoinOpaPremium}
            activeOpacity={0.8}
          >
            <Ionicons name="ribbon-outline" size={20} color="#FF1577" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.settingsButton, { backgroundColor: theme.colors.white }]}
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.8}
          >
            <Ionicons name="settings-outline" size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 90 }]}
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
        </View>
        <Text style={[styles.profileSubtext, { color: theme.colors.textSecondary }]}>
          {personalInfo.email}
        </Text>

        <TouchableOpacity
          style={styles.flipCardOuter}
          onPress={handleFlipVerificationCard}
          activeOpacity={0.9}
        >
          <View style={[styles.flipCard, { backgroundColor: theme.colors.white }]}> 
            <Animated.View
              style={[
                styles.flipFace,
                {
                  transform: [
                    { perspective: 800 },
                    {
                      rotateY: flipAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '180deg'],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.summaryTopRow}>
                <View style={styles.summaryCell}>
                  <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Member since</Text>
                  <Text style={[styles.summaryValue, { color: theme.colors.textPrimary }]}>{memberSince}</Text>
                </View>
                <View style={[styles.summaryDivider, { backgroundColor: theme.colors.hint + '25' }]} />
                <View style={styles.summaryCell}>
                  <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Rentals</Text>
                  <Text style={[styles.summaryValue, { color: theme.colors.textPrimary }]}>{rentalsCount}</Text>
                </View>
                <View style={[styles.summaryDivider, { backgroundColor: theme.colors.hint + '25' }]} />
                <View style={styles.summaryCell}>
                  <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Rating</Text>
                  <Text style={[styles.summaryValue, { color: theme.colors.textPrimary }]}>{ratingValue}</Text>
                </View>
              </View>
              <View style={styles.summaryHintRow}>
                <Animated.View
                  style={[
                    styles.summaryHintPill,
                    {
                      backgroundColor: '#FF1577',
                      borderColor: '#FF1577',
                      transform: [
                        {
                          scale: hintPulse.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.05],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Ionicons name="hand-left-outline" size={16} color={theme.colors.white} />
                  <Text style={[styles.summaryHintPillText, { color: theme.colors.white }]}>Tap to flip</Text>
                  <Ionicons name="chevron-forward" size={16} color={theme.colors.white} />
                </Animated.View>
              </View>
            </Animated.View>

            <Animated.View
              style={[
                styles.flipFace,
                styles.flipBackFace,
                {
                  transform: [
                    { perspective: 800 },
                    {
                      rotateY: flipAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['180deg', '360deg'],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.verificationProgressWrap}>
                {verificationProgress.ratio === 1 ? (
                  <View style={[styles.verifiedPremiumWrap, { borderColor: '#0B1B3A' }]}>
                    <View style={styles.verifiedSparksLayer} pointerEvents="none">
                      <View style={[styles.sparkDot, styles.sparkDotPink, styles.spark1]} />
                      <View style={[styles.sparkDot, styles.sparkDotNavy, styles.spark2]} />
                      <View style={[styles.sparkDot, styles.sparkDotPink, styles.spark3]} />
                      <View style={[styles.sparkDot, styles.sparkDotNavy, styles.spark4]} />
                      <View style={[styles.sparkDot, styles.sparkDotPink, styles.spark5]} />
                      <View style={[styles.sparkDot, styles.sparkDotNavy, styles.spark6]} />
                      <View style={[styles.sparkDot, styles.sparkDotPink, styles.spark7]} />
                      <View style={[styles.sparkDot, styles.sparkDotNavy, styles.spark8]} />
                      <View style={[styles.sparkDot, styles.sparkDotPink, styles.spark9]} />
                      <View style={[styles.sparkDot, styles.sparkDotNavy, styles.spark10]} />
                      <View style={[styles.sparkDot, styles.sparkDotPink, styles.spark11]} />
                      <View style={[styles.sparkDot, styles.sparkDotNavy, styles.spark12]} />
                    </View>

                    <View style={styles.verifiedBackIconWrap} pointerEvents="none">
                      <Ionicons name="return-up-back" size={16} color={theme.colors.white} />
                    </View>

                    <View style={styles.verifiedPremiumContent}>
                      <View style={styles.verifiedPremiumTopRow}>
                        <View style={styles.verifiedBadge}>
                          <Ionicons name="checkmark" size={12} color={theme.colors.white} />
                        </View>
                        <Text style={[styles.verifiedPremiumTitle, { color: theme.colors.white }]}>Verified</Text>
                      </View>
                      <Text style={[styles.verifiedPremiumSubtitle, { color: theme.colors.white }]}>
                        Your profile is complete.
                      </Text>
                      <Text style={[styles.verifiedPremiumDisclaimer, { color: theme.colors.white }]}>
                        A verified profile does not guarantee someone is who they claim to be. We use secure third‑party services to help verify user information.
                      </Text>
                    </View>
                  </View>
                ) : (
                  <>
                    <View style={styles.unverifiedHeaderRow}>
                      <Text style={[styles.unverifiedTitle, { color: theme.colors.textPrimary }]}>Get verified</Text>
                      <View style={styles.unverifiedBackIconWrap} pointerEvents="none">
                        <Ionicons name="return-up-back" size={16} color={theme.colors.hint} />
                      </View>
                    </View>

                    <Text style={[styles.unverifiedSubtitle, { color: theme.colors.textSecondary }]}>
                      Complete these steps to verify your profile.
                    </Text>

                    <View style={styles.requirementsList}>
                      {displayVerificationRows.map((row) => (
                        <View key={row.label} style={styles.requirementRow}>
                          <Ionicons
                            name={row.ok ? 'checkmark-circle' : 'ellipse-outline'}
                            size={18}
                            color={row.ok ? '#21C55D' : theme.colors.hint}
                          />
                          <Text
                            style={[
                              styles.requirementText,
                              { color: row.ok ? theme.colors.textPrimary : theme.colors.textSecondary },
                            ]}
                            numberOfLines={1}
                          >
                            {row.label}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </>
                )}
              </View>
            </Animated.View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Separator Line */}
      {/* <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} /> */}

      {/* Personal Information */}
      <View style={styles.additionalActionsContainer}>
        <TouchableOpacity
          style={styles.additionalActionButton}
          onPress={handleUpdateProfile}
          activeOpacity={0.7}
        >
          <Ionicons name="person-circle-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.additionalActionText, { color: theme.colors.textPrimary }]}>
            Personal info
          </Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.hint} />
        </TouchableOpacity>
      </View>

      {/* Driving License Information - Only show if user has DL info */}
      {hasDlInfo && (
        <>
          <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />
          <View style={[styles.section, styles.plainSection, styles.compactSection]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                Driving License Information
              </Text>
              <TouchableOpacity
                onPress={handleDriversLicenseInfo}
                style={styles.updateProfileIcon}
                activeOpacity={0.7}
              >
                <Ionicons name="create-outline" size={22} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
            {dlInfo.dl_number && (
              <InfoRow
                icon="card-outline"
                label="License Number"
                value={dlInfo.dl_number}
              />
            )}
            {dlInfo.dl_category && (
              <InfoRow
                icon="list-outline"
                label="Category"
                value={dlInfo.dl_category}
              />
            )}
            {dlInfo.dl_issue_date && (
              <InfoRow
                icon="calendar-outline"
                label="Issue Date"
                value={dlInfo.dl_issue_date}
              />
            )}
            {dlInfo.dl_expiry_date && (
              <InfoRow
                icon="time-outline"
                label="Expiry Date"
                value={dlInfo.dl_expiry_date}
              />
            )}
          </View>
        </>
      )}

      {/* Separator Line */}
      <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />

      {/* Account Actions */}
      <View style={styles.additionalActionsContainer}>
        <View style={styles.accountActionsHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, marginBottom: 12 }]}>
            Monetize and Grow
          </Text>
        </View>
        <TouchableOpacity
          style={styles.additionalActionButton}
          onPress={handleReferHost}
          activeOpacity={0.7}
        >
          <Ionicons name="person-add-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.additionalActionText, { color: theme.colors.textPrimary }]}>
            Refer a host
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
          onPress={handleOpaHostApp}
          activeOpacity={0.7}
        >
          <Ionicons name="business-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.additionalActionText, { color: theme.colors.textPrimary }]}>
            List car & services
          </Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.hint} />
        </TouchableOpacity>

        <View style={styles.accountActionsHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, marginBottom: 12, marginTop: 18 }]}>
            Account Actions
          </Text>
        </View>
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
          onPress={handleDriversLicenseInfo}
          activeOpacity={0.7}
        >
          <Ionicons name="card-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.additionalActionText, { color: theme.colors.textPrimary }]}>
            Drivers licence info
          </Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.hint} />
        </TouchableOpacity>

        <View style={styles.accountActionsHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, marginBottom: 12, marginTop: 18 }]}>
            Community and Support
          </Text>
        </View>

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
  topRightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    textAlign: 'center',
  },
  profileSubtext: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    marginTop: 4,
  },
  flipCardOuter: {
    width: '100%',
    marginTop: 16,
  },
  flipCard: {
    width: '100%',
    height: 170,
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  flipFace: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backfaceVisibility: 'hidden',
  },
  flipBackFace: {
    // kept for semantic clarity; rotation is handled in Animated.View transform
  },
  summaryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  summaryCell: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 36,
    marginHorizontal: 10,
    borderRadius: 1,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
    letterSpacing: 0,
  },
  summaryHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'center',
  },
  summaryHintPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
  },
  summaryHintPillText: {
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
    letterSpacing: -0.1,
  },
  verificationHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  verificationTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  verificationHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verificationHintText: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
  },
  verificationProgressWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: 10,
    borderRadius: 999,
  },
  unverifiedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  unverifiedBackIconWrap: {
    opacity: 0.9,
  },
  unverifiedTitle: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    letterSpacing: -0.1,
  },
  unverifiedSubtitle: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 10,
  },
  requirementsList: {
    gap: 10,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  requirementText: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
    flex: 1,
  },
  verifiedPremiumWrap: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: '#0B1B3A',
    overflow: 'hidden',
  },
  verifiedBackIconWrap: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 3,
    opacity: 0.95,
  },
  verifiedSparksLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  verifiedPremiumContent: {
    position: 'relative',
    zIndex: 2,
    paddingTop: 6,
  },
  verifiedPremiumTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  sparkDot: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.95,
  },
  sparkDotPink: {
    backgroundColor: '#FF1577',
  },
  sparkDotNavy: {
    backgroundColor: '#162B5A',
  },
  spark1: { top: 10, left: 14, width: 6, height: 6 },
  spark2: { top: 18, right: 18, width: 4, height: 4 },
  spark3: { top: 40, left: 44, width: 5, height: 5 },
  spark4: { top: 52, right: 56, width: 7, height: 7, opacity: 0.3 },
  spark5: { top: 66, left: 20, width: 4, height: 4 },
  spark6: { top: 72, right: 24, width: 5, height: 5 },
  spark7: { bottom: 18, left: 30, width: 7, height: 7, opacity: 0.35 },
  spark8: { bottom: 12, right: 22, width: 4, height: 4 },
  spark9: { bottom: 40, left: 64, width: 5, height: 5 },
  spark10: { bottom: 34, right: 68, width: 6, height: 6, opacity: 0.35 },
  spark11: { top: 28, left: 110, width: 3, height: 3 },
  spark12: { bottom: 22, left: 140, width: 3, height: 3 },
  verifiedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF1577',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedPremiumTitle: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    letterSpacing: -0.1,
  },
  verifiedPremiumSubtitle: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  verifiedPremiumDisclaimer: {
    fontSize: 11,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 16,
    marginTop: 10,
    opacity: 0.85,
  },
  verificationSubtitle: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
    marginTop: 10,
  },
  missingDocsText: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 18,
    marginTop: 6,
  },
  section: {
    marginHorizontal: 24,
    marginTop: 8,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 8,
  },
  plainSection: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },
  compactSection: {
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
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
    paddingVertical: 12,
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
