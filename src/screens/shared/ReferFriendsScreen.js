import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Share, Platform, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
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
  const [totalReferrals] = useState(3); // Mock data
  const [totalRewards] = useState(1500); // Mock rewards in KES
  const [showCopyModal, setShowCopyModal] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Refer Friends',
    });
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
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Card */}
      <Card style={[styles.headerCard, { backgroundColor: theme.colors.primary }]}>
        <View style={styles.headerContent}>
          <View style={[styles.iconCircle, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
            <Ionicons name="gift-outline" size={40} color={theme.colors.white} />
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
            <Ionicons name="share-social-outline" size={24} color={theme.colors.primary} />
            <Text style={[styles.shareButtonText, { color: theme.colors.primary }]}>
              Share Code
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.shareButton, { backgroundColor: theme.colors.primary }]}
            onPress={shareReferralLink}
            activeOpacity={0.7}
          >
            <Ionicons name="link-outline" size={24} color={theme.colors.white} />
            <Text style={[styles.shareButtonText, { color: theme.colors.white }]}>
              Share Link
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Your Referrals
        </Text>
        <View style={styles.statsContainer}>
          <Card style={[styles.statCard, { backgroundColor: theme.colors.white }]}>
            <Ionicons name="people-outline" size={32} color={theme.colors.primary} />
            <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>
              {totalReferrals}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Friends Referred
            </Text>
          </Card>
          <Card style={[styles.statCard, { backgroundColor: theme.colors.white }]}>
            <Ionicons name="cash-outline" size={32} color="#4CAF50" />
            <Text style={[styles.statValue, { color: '#4CAF50' }]}>
              KSh {totalRewards.toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Total Rewards
            </Text>
          </Card>
        </View>
      </View>

      {/* How It Works */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          How It Works
        </Text>
        <Card style={[styles.infoCard, { backgroundColor: theme.colors.white }]}>
          <View style={styles.stepRow}>
            <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
              <Text style={[styles.stepNumberText, { color: theme.colors.white }]}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: theme.colors.textPrimary }]}>
                Share Your Code
              </Text>
              <Text style={[styles.stepDescription, { color: theme.colors.textSecondary }]}>
                Share your referral code or link with friends via WhatsApp, SMS, or social media
              </Text>
            </View>
          </View>

          <View style={styles.stepRow}>
            <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
              <Text style={[styles.stepNumberText, { color: theme.colors.white }]}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: theme.colors.textPrimary }]}>
                Friend Signs Up
              </Text>
              <Text style={[styles.stepDescription, { color: theme.colors.textSecondary }]}>
                Your friend downloads the app and uses your referral code when signing up
              </Text>
            </View>
          </View>

          <View style={styles.stepRow}>
            <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
              <Text style={[styles.stepNumberText, { color: theme.colors.white }]}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: theme.colors.textPrimary }]}>
                You Both Earn Rewards
              </Text>
              <Text style={[styles.stepDescription, { color: theme.colors.textSecondary }]}>
                When your friend completes their first booking, you both earn rewards!
              </Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Rewards Info */}
      <View style={styles.section}>
        <View style={[styles.rewardsCard, { backgroundColor: '#4CAF50' + '10' }]}>
          <Ionicons name="trophy-outline" size={32} color="#4CAF50" />
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
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  codeCard: {
    padding: 20,
    borderRadius: 16,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  referralCode: {
    flex: 1,
    fontSize: 32,
    fontFamily: 'Nunito_700Bold',
    letterSpacing: 4,
    textAlign: 'center',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
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
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
  },
  shareButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
  },
  infoCard: {
    padding: 20,
    borderRadius: 16,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 16,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  stepNumberText: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  rewardsCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  rewardsTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginTop: 12,
    marginBottom: 8,
  },
  rewardsDescription: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    lineHeight: 20,
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

