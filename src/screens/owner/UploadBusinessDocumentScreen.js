import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Button } from '../../packages/components';
import * as ImagePicker from 'expo-image-picker';

const UploadBusinessDocumentScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [businessDocImage, setBusinessDocImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Upload Business Document',
    });
  }, [navigation]);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'We need access to your photos to upload documents.',
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
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setBusinessDocImage(result.assets[0].uri);
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
        'We need access to your camera to take photos.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setBusinessDocImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
      console.error('Camera error:', error);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Gallery', onPress: pickImage },
      ],
      { cancelable: true }
    );
  };

  const handleUpload = async () => {
    if (!businessDocImage) {
      Alert.alert('Error', 'Please upload a business document');
      return;
    }

    setUploading(true);
    try {
      // TODO: Implement actual upload logic
      // const formData = new FormData();
      // formData.append('business_document', {
      //   uri: businessDocImage,
      //   type: 'image/jpeg',
      //   name: 'business_document.jpg',
      // });
      // await uploadDocument(formData);

      await new Promise((resolve) => setTimeout(resolve, 2000));
      setShowSuccessModal(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to upload document. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    Alert.alert(
      'Remove Image',
      'Are you sure you want to remove this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => setBusinessDocImage(null),
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Info Card */}
      <View style={[styles.infoCard, { backgroundColor: theme.colors.white }]}>
        <Ionicons name="information-circle-outline" size={24} color={theme.colors.primary} />
        <View style={styles.infoTextContainer}>
          <Text style={[styles.infoTitle, { color: theme.colors.textPrimary }]}>
            Upload Requirements
          </Text>
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            • Ensure the document is clear and all text is visible{'\n'}
            • Use good lighting when taking the photo{'\n'}
            • Make sure the entire document is within the frame{'\n'}
            • Avoid glare and shadows{'\n'}
            • Upload your business registration certificate or license
          </Text>
        </View>
      </View>

      {/* Upload Card */}
      <View style={[styles.uploadCard, { backgroundColor: theme.colors.white }]}>
        <View style={styles.uploadCardHeader}>
          <Ionicons name="document-outline" size={32} color={theme.colors.primary} />
          <Text style={[styles.uploadCardTitle, { color: theme.colors.textPrimary }]}>
            Business Registration Document
          </Text>
        </View>

        {businessDocImage ? (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: businessDocImage }} style={styles.imagePreview} resizeMode="cover" />
            <TouchableOpacity
              style={[styles.removeImageButton, { backgroundColor: '#F44336' }]}
              onPress={removeImage}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={20} color={theme.colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.changeImageButton, { backgroundColor: theme.colors.primary }]}
              onPress={showImageOptions}
              activeOpacity={0.7}
            >
              <Ionicons name="camera-outline" size={18} color={theme.colors.white} />
              <Text style={[styles.changeImageText, { color: theme.colors.white }]}>
                Change
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.uploadButton, { borderColor: theme.colors.primary }]}
            onPress={showImageOptions}
            activeOpacity={0.7}
          >
            <Ionicons name="camera-outline" size={48} color={theme.colors.primary} />
            <Text style={[styles.uploadButtonText, { color: theme.colors.primary }]}>
              Tap to Upload
            </Text>
            <Text style={[styles.uploadButtonSubtext, { color: theme.colors.hint }]}>
              Take a photo or choose from gallery
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Button
        title="Upload Document"
        onPress={handleUpload}
        variant="primary"
        style={styles.uploadButtonMain}
        loading={uploading}
        disabled={!businessDocImage}
      />

      {/* Bottom Spacing */}
      <View style={{ height: 40 }} />

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.successModalOverlay}>
          <View style={[styles.successModalContent, { backgroundColor: theme.colors.white }]}>
            <View style={[styles.successIconCircle, { backgroundColor: '#4CAF50' + '20' }]}>
              <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
            </View>
            <Text style={[styles.successModalTitle, { color: theme.colors.textPrimary }]}>
              Document Uploaded!
            </Text>
            <Text style={[styles.successModalMessage, { color: theme.colors.textSecondary }]}>
              Your business document has been uploaded successfully. We'll review it and notify you once verified.
            </Text>
            <TouchableOpacity
              style={[styles.successModalButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => {
                setShowSuccessModal(false);
                navigation.goBack();
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.successModalButtonText, { color: theme.colors.white }]}>
                Done
              </Text>
            </TouchableOpacity>
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
    padding: 24,
    paddingBottom: 40,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    gap: 12,
    marginBottom: 24,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  uploadCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  uploadCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  uploadCardTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
  },
  imagePreviewContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeImageButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  changeImageText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  uploadButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 48,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  uploadButtonText: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginTop: 16,
  },
  uploadButtonSubtext: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    marginTop: 8,
    textAlign: 'center',
  },
  uploadButtonMain: {
    marginTop: 8,
  },
  successModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  successModalContent: {
    width: '85%',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
  },
  successIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successModalTitle: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  successModalMessage: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  successModalButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successModalButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
});

export default UploadBusinessDocumentScreen;

