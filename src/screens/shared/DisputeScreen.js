import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Button, Card, Input } from '../../packages/components';

const DisputeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { bookingDetails } = route.params || {};

  const [disputeType, setDisputeType] = useState('');
  const [disputeDescription, setDisputeDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'File a Dispute',
    });
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: 'none' },
    });
    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
    };
  }, [navigation]);

  const disputeTypes = [
    {
      id: 'refund',
      title: 'Refund Request',
      description: 'Request a refund for your booking',
      icon: 'cash-outline',
    },
    {
      id: 'service',
      title: 'Service Issue',
      description: 'Problem with the car or service provided',
      icon: 'car-outline',
    },
    {
      id: 'owner',
      title: 'Owner Issue',
      description: 'Problem with the car owner',
      icon: 'person-outline',
    },
    {
      id: 'payment',
      title: 'Payment Issue',
      description: 'Problem with payment or charges',
      icon: 'card-outline',
    },
    {
      id: 'other',
      title: 'Other',
      description: 'Other dispute or complaint',
      icon: 'help-circle-outline',
    },
  ];

  const handleFileSelect = () => {
    // TODO: Implement file picker
    Alert.alert('File Upload', 'File upload feature will be implemented');
  };

  const handleSubmit = () => {
    if (!disputeType) {
      Alert.alert('Required', 'Please select a dispute type');
      return;
    }
    if (!disputeDescription.trim()) {
      Alert.alert('Required', 'Please provide a description of your dispute');
      return;
    }
    if (disputeDescription.trim().length < 20) {
      Alert.alert('Required', 'Please provide a more detailed description (at least 20 characters)');
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    setProcessing(true);
    try {
      // TODO: Implement API call to submit dispute
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      setShowConfirmModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit dispute. Please try again.');
      setProcessing(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigation.goBack();
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Booking Info */}
        {bookingDetails && (
          <View style={styles.section}>
            <Card style={[styles.bookingCard, { backgroundColor: theme.colors.white }]}>
              <View style={styles.bookingHeader}>
                <Ionicons name="calendar-outline" size={24} color={theme.colors.primary} />
                <View style={styles.bookingHeaderContent}>
                  <Text style={[styles.bookingTitle, { color: theme.colors.textPrimary }]}>
                    Booking Details
                  </Text>
                  <Text style={[styles.bookingSubtitle, { color: theme.colors.textSecondary }]}>
                    {bookingDetails?.car?.name || 'Car Rental'}
                  </Text>
                </View>
              </View>
              <View style={styles.bookingInfo}>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                    Pickup Date
                  </Text>
                  <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>
                    {formatDate(bookingDetails?.pickupDate)}
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        )}

        {/* Dispute Type Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Dispute Type
          </Text>
          <View style={styles.typesContainer}>
            {disputeTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeButton,
                  {
                    backgroundColor: disputeType === type.id 
                      ? theme.colors.primary + '20' 
                      : theme.colors.white,
                    borderColor: disputeType === type.id 
                      ? theme.colors.primary 
                      : '#E0E0E0',
                  },
                ]}
                onPress={() => setDisputeType(type.id)}
                activeOpacity={0.7}
              >
                <View style={styles.typeButtonContent}>
                  <Ionicons
                    name={type.icon}
                    size={24}
                    color={disputeType === type.id ? theme.colors.primary : theme.colors.textSecondary}
                  />
                  <View style={styles.typeButtonTextContainer}>
                    <Text
                      style={[
                        styles.typeButtonTitle,
                        {
                          color: disputeType === type.id 
                            ? theme.colors.primary 
                            : theme.colors.textPrimary,
                          fontFamily: disputeType === type.id 
                            ? 'Nunito_600SemiBold' 
                            : 'Nunito_400Regular',
                        },
                      ]}
                    >
                      {type.title}
                    </Text>
                    <Text style={[styles.typeButtonDesc, { color: theme.colors.textSecondary }]}>
                      {type.description}
                    </Text>
                  </View>
                </View>
                {disputeType === type.id && (
                  <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Dispute Description */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Describe Your Dispute
          </Text>
          <Input
            placeholder="Please provide a detailed description of your dispute..."
            value={disputeDescription}
            onChangeText={setDisputeDescription}
            multiline
            numberOfLines={6}
            style={styles.descriptionInput}
          />
          <Text style={[styles.charCount, { color: theme.colors.textSecondary }]}>
            {disputeDescription.length} / 500 characters (minimum 20)
          </Text>
        </View>

        {/* File Upload */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Supporting Documents (Optional)
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
            Upload photos, receipts, or other documents that support your dispute
          </Text>
          <TouchableOpacity
            style={[styles.uploadButton, { borderColor: theme.colors.primary }]}
            onPress={handleFileSelect}
            activeOpacity={0.7}
          >
            <Ionicons name="cloud-upload-outline" size={24} color={theme.colors.primary} />
            <Text style={[styles.uploadButtonText, { color: theme.colors.primary }]}>
              Upload Files
            </Text>
          </TouchableOpacity>
          {selectedFiles.length > 0 && (
            <View style={styles.filesContainer}>
              {selectedFiles.map((file, index) => (
                <View key={index} style={styles.fileItem}>
                  <Ionicons name="document-outline" size={20} color={theme.colors.textPrimary} />
                  <Text style={[styles.fileName, { color: theme.colors.textPrimary }]}>
                    {file.name}
                  </Text>
                  <TouchableOpacity onPress={() => {
                    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
                  }}>
                    <Ionicons name="close-circle" size={20} color="#F44336" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Important Info */}
        <View style={styles.section}>
          <Card style={[styles.infoCard, { backgroundColor: '#FF9800' + '10' }]}>
            <View style={styles.infoHeader}>
              <Ionicons name="information-circle-outline" size={24} color="#FF9800" />
              <Text style={[styles.infoTitle, { color: theme.colors.textPrimary }]}>
                What Happens Next?
              </Text>
            </View>
            <View style={styles.infoList}>
              <View style={styles.infoListItem}>
                <Text style={[styles.infoBullet, { color: '#FF9800' }]}>•</Text>
                <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                  Our support team will review your dispute within 24-48 hours
                </Text>
              </View>
              <View style={styles.infoListItem}>
                <Text style={[styles.infoBullet, { color: '#FF9800' }]}>•</Text>
                <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                  You'll receive updates via email and in-app notifications
                </Text>
              </View>
              <View style={styles.infoListItem}>
                <Text style={[styles.infoBullet, { color: '#FF9800' }]}>•</Text>
                <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                  We may contact you for additional information if needed
                </Text>
              </View>
            </View>
          </Card>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.colors.white }]}>
        <Button
          title="Submit Dispute"
          onPress={handleSubmit}
          variant="primary"
          style={styles.submitButton}
          disabled={!disputeType || !disputeDescription.trim() || disputeDescription.trim().length < 20 || processing}
        />
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => !processing && setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.white }]}>
            <View style={[styles.modalIconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
              <Ionicons name="document-text-outline" size={64} color={theme.colors.primary} />
            </View>
            <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
              Submit Dispute?
            </Text>
            <Text style={[styles.modalMessage, { color: theme.colors.textSecondary }]}>
              Your dispute will be reviewed by our support team. You'll receive updates within 24-48 hours.
            </Text>
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setShowConfirmModal(false)}
                variant="secondary"
                style={styles.modalButton}
                disabled={processing}
              />
              <Button
                title="Submit"
                onPress={confirmSubmit}
                variant="primary"
                style={styles.modalButton}
                loading={processing}
                disabled={processing}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={handleSuccessClose}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.white }]}>
            <View style={[styles.modalIconContainer, { backgroundColor: '#4CAF50' + '20' }]}>
              <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
            </View>
            <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
              Dispute Submitted
            </Text>
            <Text style={[styles.modalMessage, { color: theme.colors.textSecondary }]}>
              Your dispute has been submitted successfully. Our support team will review it and get back to you within 24-48 hours.
            </Text>
            <Button
              title="Done"
              onPress={handleSuccessClose}
              variant="primary"
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>
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
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 16,
    lineHeight: 20,
  },
  bookingCard: {
    padding: 20,
    borderRadius: 16,
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  bookingHeaderContent: {
    flex: 1,
  },
  bookingTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  bookingSubtitle: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  bookingInfo: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  typesContainer: {
    gap: 12,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  typeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  typeButtonTextContainer: {
    flex: 1,
  },
  typeButtonTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 4,
  },
  typeButtonDesc: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  descriptionInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    marginTop: 8,
    textAlign: 'right',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  filesContainer: {
    marginTop: 12,
    gap: 8,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  fileName: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  infoCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  infoList: {
    gap: 12,
  },
  infoListItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  infoBullet: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginTop: -2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  bottomBar: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  submitButton: {
    width: '100%',
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
    alignItems: 'center',
  },
  modalIconContainer: {
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
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
  },
});

export default DisputeScreen;


