import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Share, Platform, Modal, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useUser } from '../../packages/context/UserContext';
import { Button, Card } from '../../packages/components';

const ReferFriendsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { user } = useUser();

  // Generate referral code from user email or use a simple ID
  const generateReferralCode = () => {
    if (user?.email) {
      // Simple code: first 3 letters of email + random 4 digits
      const emailPrefix = user.email.split('@')[0].substring(0, 3).toUpperCase();
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      return `${emailPrefix}${randomNum}`;
    }
    // Fallback code
    return `REF${Math.floor(10000 + Math.random() * 90000)}`;
  };

  const [referralCode] = useState(generateReferralCode());
  const [showCopyModal, setShowCopyModal] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Refer Friends',
    });
  }, [navigation]);

  // Hide bottom tab bar when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: 'none' },
      });
      return () => {
        // Restore tab bar when leaving this screen
      };
    }, [navigation])
  );

  // Ensure StatusBar is dark when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content', true);
      return () => {
        // StatusBar will be restored by other screens
      };
    }, [])
  );

  // Restore tab bar when component unmounts (navigating away completely)
  useEffect(() => {
    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
    };
  }, [navigation]);

  const copyToClipboard = async () => {
    try {
      // Try to copy to clipboard
      if (Platform.OS === 'web' && navigator.clipboard) {
        await navigator.clipboard.writeText(referralCode);
      } else {
        // For mobile, we'll show the modal and let user manually copy or share
        setShowCopyModal(true);
        return;
      }
      setShowCopyModal(true);
    } catch (error) {
      // Fallback: show modal
      setShowCopyModal(true);
    }
  };

  const shareReferralCode = async () => {
    try {
      const message = `Join Oparides using my referral code: ${referralCode}\n\nGet great deals on car rentals! Download the app and use my code when you sign up.`;
      const result = await Share.share({
        message: message,
        title: 'Refer Oparides to Friends',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share referral code');
    }
  };

  const shareReferralLink = async () => {
    try {
      // In production, this would be a deep link or web URL
      const referralLink = `https://oparides.app/signup?ref=${referralCode}`;
      const message = `Join Oparides using my referral link: ${referralLink}\n\nGet great deals on car rentals!`;
      const result = await Share.share({
        message: message,
        title: 'Refer Oparides to Friends',
        url: referralLink,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share referral link');
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
      {/* Header Card */}
      <Card style={[styles.headerCard, { backgroundColor: theme.colors.primary }]}>
        <View style={styles.headerContent}>
          <View style={[styles.iconCircle, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
            <Ionicons name="gift-outline" size={28} color={theme.colors.white} />
          </View>
          <Text style={[styles.headerTitle, { color: theme.colors.white }]}>
            Refer & Earn
          </Text>
          <Text style={[styles.headerSubtitle, { color: 'rgba(255, 255, 255, 0.9)' }]}>
            Share with friends and earn rewards when they sign up!
          </Text>
        </View>
      </Card>

      {/* Referral Code Card */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Your Referral Code
        </Text>
        <Card style={[styles.codeCard, { backgroundColor: theme.colors.white }]}>
          <View style={styles.codeContainer}>
            <Text style={[styles.referralCode, { color: theme.colors.primary }]}>
              {referralCode}
            </Text>
            <TouchableOpacity
              style={[styles.copyButton, { backgroundColor: theme.colors.primary + '20' }]}
              onPress={copyToClipboard}
              activeOpacity={0.7}
            >
              <Ionicons name="copy-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.copyButtonText, { color: theme.colors.primary }]}>
                Copy
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      </View>

      {/* Share Options */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Share Your Code
        </Text>
        <View style={styles.shareButtons}>
          <TouchableOpacity
            style={[styles.shareButton, { backgroundColor: theme.colors.white, borderColor: theme.colors.primary }]}
            onPress={shareReferralCode}
            activeOpacity={0.7}
          >
            <Ionicons name="share-social-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.shareButtonText, { color: theme.colors.primary }]}>
              Share Code
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.shareButton, { backgroundColor: theme.colors.primary }]}
            onPress={shareReferralLink}
            activeOpacity={0.7}
          >
            <Ionicons name="link-outline" size={20} color={theme.colors.white} />
            <Text style={[styles.shareButtonText, { color: theme.colors.white }]}>
              Share Link
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Rewards Info */}
      <View style={styles.section}>
        <View style={[styles.rewardsCard, { backgroundColor: '#4CAF50' + '10' }]}>
          <Ionicons name="trophy-outline" size={24} color="#4CAF50" />
          <Text style={[styles.rewardsTitle, { color: theme.colors.textPrimary }]}>
            Rewards
          </Text>
          <Text style={[styles.rewardsDescription, { color: theme.colors.textSecondary }]}>
            Earn KSh 500 for each friend who signs up and completes their first booking. Rewards are credited to your account within 24 hours.
          </Text>
        </View>
      </View>

      <View style={{ height: 40 }} />

      {/* Copy Confirmation Modal */}
      <Modal
        visible={showCopyModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCopyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.white }]}>
            <View style={[styles.modalIconCircle, { backgroundColor: '#4CAF50' + '20' }]}>
              <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
            </View>
            <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
              Code Copied!
            </Text>
            <View style={[styles.modalCodeBox, { backgroundColor: theme.colors.primary + '10', borderColor: theme.colors.primary }]}>
              <Text style={[styles.modalCodeText, { color: theme.colors.primary }]}>
                {referralCode}
              </Text>
            </View>
            <Text style={[styles.modalMessage, { color: theme.colors.textSecondary }]}>
              Your referral code has been copied. Share it with your friends!
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary, { borderColor: theme.colors.hint }]}
                onPress={() => setShowCopyModal(false)}
                activeOpacity={0.7}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.textSecondary }]}>
                  Close
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary, { backgroundColor: theme.colors.primary }]}
                onPress={() => {
                  setShowCopyModal(false);
                  shareReferralCode();
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="share-social-outline" size={20} color={theme.colors.white} />
                <Text style={[styles.modalButtonText, { color: theme.colors.white }]}>
                  Share
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  headerCard: {
    marginHorizontal: 24,
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  codeCard: {
    padding: 16,
    borderRadius: 12,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  referralCode: {
    flex: 1,
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    letterSpacing: 3,
    textAlign: 'center',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  copyButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  shareButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    gap: 6,
  },
  shareButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  rewardsCard: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  rewardsTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginTop: 10,
    marginBottom: 6,
  },
  rewardsDescription: {
    fontSize: 13,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    lineHeight: 18,
  },
  // Copy Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '85%',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
  },
  modalIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 16,
  },
  modalCodeBox: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 16,
  },
  modalCodeText: {
    fontSize: 28,
    fontFamily: 'Nunito_700Bold',
    letterSpacing: 4,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  modalButtonSecondary: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  modalButtonPrimary: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
});

export default ReferFriendsScreen;

