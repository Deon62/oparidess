import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useUser } from '../../packages/context/UserContext';
import { Button } from '../../packages/components';

// Import default profile image
const defaultProfileImage = require('../../../assets/logo/profile.jpg');

const DriverProfileScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { user } = useUser();

  // Mock driver profile data - in real app, this would come from API
  const [driverProfile, setDriverProfile] = useState({
    id: user?.id || 0,
    email: user?.email || 'driver@example.com',
    first_name: user?.first_name || 'John',
    last_name: user?.last_name || 'Doe',
    phone_number: user?.phone_number || '+254 712 345 678',
    date_of_birth: user?.date_of_birth || '1990-01-15',
    gender: user?.gender || 'male',
    id_number: user?.id_number || '12345678',
    dl_number: user?.dl_number || 'DL123456',
    dl_category: user?.dl_category || 'B',
    dl_issue_date: user?.dl_issue_date || '2020-01-15',
    dl_expiry_date: user?.dl_expiry_date || '2025-01-15',
    selfie_url: user?.selfie_url || null,
    id_document_url: user?.id_document_url || null,
    dl_document_url: user?.dl_document_url || null,
    verification_status: user?.verification_status || 'pending',
    onboarding_completed_at: user?.onboarding_completed_at || '2024-01-01T10:00:00Z',
    last_active_date: user?.last_active_date || new Date().toISOString(),
    profile_completeness: user?.profile_completeness || 65,
    status: user?.status || 'active',
    created_at: user?.created_at || '2024-01-01T10:00:00Z',
    updated_at: user?.updated_at || new Date().toISOString(),
  });

  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'My Profile',
    });
  }, [navigation]);

  const getCompletenessColor = (percentage) => {
    if (percentage >= 80) return '#4CAF50';
    if (percentage >= 50) return '#FFA500';
    return '#F44336';
  };

  const getVerificationStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return '#4CAF50';
      case 'pending':
        return '#FFA500';
      case 'rejected':
        return '#FF3B30';
      default:
        return theme.colors.hint;
    }
  };

  const getVerificationStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'checkmark-circle';
      case 'pending':
        return 'time-outline';
      case 'rejected':
        return 'close-circle';
      default:
        return 'help-circle-outline';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not set';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const handleUpdateProfile = () => {
    navigation.navigate('UpdateProfile');
  };

  const handleViewDocument = (documentUrl, documentType) => {
    if (!documentUrl) {
      Alert.alert('Document Not Available', 'This document has not been uploaded yet.');
      return;
    }
    setSelectedDocument({ url: documentUrl, type: documentType });
    setShowDocumentModal(true);
  };

  const InfoRow = ({ icon, label, value, onPress }) => (
    <TouchableOpacity
      style={styles.infoRow}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
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
      {onPress && (
        <Ionicons name="chevron-forward" size={20} color={theme.colors.hint} />
      )}
    </TouchableOpacity>
  );

  const DocumentCard = ({ title, icon, documentUrl, onPress }) => (
    <TouchableOpacity
      style={[styles.documentCard, { backgroundColor: theme.colors.white }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.documentIconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
        <Ionicons name={icon} size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.documentInfo}>
        <Text style={[styles.documentTitle, { color: theme.colors.textPrimary }]}>
          {title}
        </Text>
        <View style={styles.documentStatus}>
          {documentUrl ? (
            <>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={[styles.documentStatusText, { color: '#4CAF50' }]}>
                Uploaded
              </Text>
            </>
          ) : (
            <>
              <Ionicons name="close-circle" size={16} color={theme.colors.hint} />
              <Text style={[styles.documentStatusText, { color: theme.colors.hint }]}>
                Not uploaded
              </Text>
            </>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.colors.hint} />
    </TouchableOpacity>
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
            source={driverProfile.selfie_url ? { uri: driverProfile.selfie_url } : defaultProfileImage}
            style={[styles.profileImage, { borderColor: theme.colors.primary }]}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={[styles.cameraButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleUpdateProfile}
            activeOpacity={0.7}
          >
            <Ionicons name="camera" size={16} color={theme.colors.white} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.profileName, { color: theme.colors.textPrimary }]}>
          {driverProfile.first_name} {driverProfile.last_name}
        </Text>
        <Text style={[styles.profileSubtext, { color: theme.colors.textSecondary }]}>
          {driverProfile.email}
        </Text>

        {/* Verification Status */}
        <View style={[styles.verificationBadge, { backgroundColor: getVerificationStatusColor(driverProfile.verification_status) + '20' }]}>
          <Ionicons 
            name={getVerificationStatusIcon(driverProfile.verification_status)} 
            size={16} 
            color={getVerificationStatusColor(driverProfile.verification_status)} 
          />
          <Text style={[styles.verificationText, { color: getVerificationStatusColor(driverProfile.verification_status) }]}>
            {driverProfile.verification_status?.charAt(0).toUpperCase() + driverProfile.verification_status?.slice(1) || 'Unknown'}
          </Text>
        </View>

        {/* Profile Completeness */}
        <View style={styles.completenessContainer}>
          <View style={styles.completenessHeader}>
            <Text style={[styles.completenessLabel, { color: theme.colors.textSecondary }]}>
              Profile Completeness
            </Text>
            <Text
              style={[
                styles.completenessPercentage,
                { color: getCompletenessColor(driverProfile.profile_completeness) },
              ]}
            >
              {driverProfile.profile_completeness}%
            </Text>
          </View>
          <View style={[styles.progressBarContainer, { backgroundColor: theme.colors.background }]}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${driverProfile.profile_completeness}%`,
                  backgroundColor: getCompletenessColor(driverProfile.profile_completeness),
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Action Button */}
      <View style={styles.actionButtonsContainer}>
        <Button
          title="Update Profile"
          onPress={handleUpdateProfile}
          variant="primary"
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
          label="Full Name"
          value={`${driverProfile.first_name} ${driverProfile.last_name}`}
        />
        <InfoRow
          icon="mail-outline"
          label="Email"
          value={driverProfile.email}
        />
        <InfoRow
          icon="call-outline"
          label="Phone Number"
          value={driverProfile.phone_number}
        />
        <InfoRow
          icon="calendar-outline"
          label="Date of Birth"
          value={formatDate(driverProfile.date_of_birth)}
        />
        <InfoRow
          icon="person-circle-outline"
          label="Gender"
          value={driverProfile.gender?.charAt(0).toUpperCase() + driverProfile.gender?.slice(1)}
        />
        <InfoRow
          icon="card-outline"
          label="ID Number"
          value={driverProfile.id_number}
        />
      </View>

      {/* Driving License Information */}
      <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Driving License
        </Text>
        <InfoRow
          icon="id-card-outline"
          label="License Number"
          value={driverProfile.dl_number}
        />
        <InfoRow
          icon="list-outline"
          label="Category"
          value={driverProfile.dl_category}
        />
        <InfoRow
          icon="calendar-outline"
          label="Issue Date"
          value={formatDate(driverProfile.dl_issue_date)}
        />
        <InfoRow
          icon="calendar-clear-outline"
          label="Expiry Date"
          value={formatDate(driverProfile.dl_expiry_date)}
        />
      </View>

      {/* Documents */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, marginBottom: 12 }]}>
          Documents
        </Text>
        <DocumentCard
          title="Selfie"
          icon="person-circle-outline"
          documentUrl={driverProfile.selfie_url}
          onPress={() => handleViewDocument(driverProfile.selfie_url, 'Selfie')}
        />
        <DocumentCard
          title="ID Document"
          icon="id-card-outline"
          documentUrl={driverProfile.id_document_url}
          onPress={() => handleViewDocument(driverProfile.id_document_url, 'ID Document')}
        />
        <DocumentCard
          title="Driving License"
          icon="card-outline"
          documentUrl={driverProfile.dl_document_url}
          onPress={() => handleViewDocument(driverProfile.dl_document_url, 'Driving License')}
        />
      </View>

      {/* Account Information */}
      <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Account Information
        </Text>
        <InfoRow
          icon="checkmark-circle-outline"
          label="Status"
          value={driverProfile.status?.charAt(0).toUpperCase() + driverProfile.status?.slice(1)}
        />
        <InfoRow
          icon="time-outline"
          label="Onboarding Completed"
          value={formatDateTime(driverProfile.onboarding_completed_at)}
        />
        <InfoRow
          icon="pulse-outline"
          label="Last Active"
          value={formatDateTime(driverProfile.last_active_date)}
        />
        <InfoRow
          icon="create-outline"
          label="Account Created"
          value={formatDateTime(driverProfile.created_at)}
        />
        <InfoRow
          icon="refresh-outline"
          label="Last Updated"
          value={formatDateTime(driverProfile.updated_at)}
        />
      </View>

      {/* Bottom Spacing */}
      <View style={{ height: 40 }} />

      {/* Document View Modal */}
      <Modal
        visible={showDocumentModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDocumentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.white }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
                {selectedDocument?.type}
              </Text>
              <TouchableOpacity
                onPress={() => setShowDocumentModal(false)}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </View>
            {selectedDocument?.url ? (
              <Image
                source={{ uri: selectedDocument.url }}
                style={styles.documentImage}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.noDocumentContainer}>
                <Ionicons name="document-outline" size={64} color={theme.colors.hint} />
                <Text style={[styles.noDocumentText, { color: theme.colors.textSecondary }]}>
                  Document not available
                </Text>
              </View>
            )}
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
    padding: 24,
    marginBottom: 16,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  profileSubtext: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 12,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    marginBottom: 16,
  },
  verificationText: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
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
    fontFamily: 'Nunito_400Regular',
  },
  completenessPercentage: {
    fontSize: 14,
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
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  actionButton: {
    marginBottom: 0,
  },
  section: {
    marginHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  infoRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
    paddingLeft: 4,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  documentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 4,
  },
  documentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  documentStatusText: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxHeight: '90%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  documentImage: {
    width: '100%',
    height: 400,
  },
  noDocumentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noDocumentText: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    marginTop: 16,
  },
});

export default DriverProfileScreen;
