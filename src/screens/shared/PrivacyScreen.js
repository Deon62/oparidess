import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';

const PrivacyScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Set navigation options to show status bar
  useLayoutEffect(() => {
    navigation.setOptions({
      statusBarStyle: 'dark',
      statusBarBackgroundColor: 'transparent',
    });
  }, [navigation]);

  // Hide bottom tab bar and ensure status bar is visible when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: 'none' },
      });
      // Ensure status bar is visible
      StatusBar.setHidden(false);
      StatusBar.setBarStyle('dark-content');
      return () => {
        // Restore tab bar when leaving this screen
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

  const handleDownloadData = () => {
    setShowDownloadModal(true);
  };

  const handleConfirmDownload = () => {
    setShowDownloadModal(false);
    // TODO: Implement data download
    setTimeout(() => {
      setShowSuccessModal(true);
    }, 300);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  // Auto-dismiss success modal after 3 seconds
  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
      <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleDownloadData}
          activeOpacity={0.7}
        >
          <View style={styles.actionButtonLeft}>
            <Ionicons name="download-outline" size={22} color={theme.colors.primary} />
            <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>
              Download My Data
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.hint} />
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={[styles.infoTitle, { color: theme.colors.textPrimary }]}>
          Privacy Policy
        </Text>
        <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
          We are committed to protecting your privacy. Your personal information is securely stored and only used to provide you with the best service experience.
        </Text>
      </View>

      {/* Download Confirmation Modal */}
      <Modal
        visible={showDownloadModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDownloadModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.white }]}>
            <View style={[styles.modalIconContainer, { backgroundColor: theme.colors.primary + '15' }]}>
              <Ionicons name="download-outline" size={40} color={theme.colors.primary} />
            </View>
            <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
              Download My Data
            </Text>
            <Text style={[styles.modalMessage, { color: theme.colors.textSecondary }]}>
              Your data will be prepared and sent to your registered email address. This may take a few minutes.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel, { borderColor: theme.colors.hint }]}
                onPress={() => setShowDownloadModal(false)}
                activeOpacity={0.7}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.textSecondary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary, { backgroundColor: theme.colors.primary }]}
                onPress={handleConfirmDownload}
                activeOpacity={0.7}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.white }]}>
                  Download
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={handleCloseSuccessModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.white }]}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={handleCloseSuccessModal}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color={theme.colors.hint} />
            </TouchableOpacity>
            
            <View style={[styles.modalIconContainer, { backgroundColor: '#4CAF50' + '15' }]}>
              <Ionicons name="checkmark-circle" size={40} color="#4CAF50" />
            </View>
            <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
              Request Submitted
            </Text>
            <Text style={[styles.modalMessage, { color: theme.colors.textSecondary }]}>
              Your data download request has been submitted. You will receive an email shortly.
            </Text>
            <TouchableOpacity
              style={[styles.modalButtonSingle, styles.modalButtonPrimary, { backgroundColor: theme.colors.primary }]}
              onPress={handleCloseSuccessModal}
              activeOpacity={0.7}
            >
              <Text style={[styles.modalButtonText, { color: theme.colors.white }]}>
                OK
              </Text>
            </TouchableOpacity>
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
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  actionButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  infoSection: {
    paddingHorizontal: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 22,
  },
  // Modal Styles
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  modalMessage: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonSingle: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonCancel: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  modalButtonPrimary: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  modalButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
});

export default PrivacyScreen;

