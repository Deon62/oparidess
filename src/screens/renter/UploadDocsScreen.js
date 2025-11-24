import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Button } from '../../packages/components';
import * as ImagePicker from 'expo-image-picker';

const UploadDocsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [selectedDocType, setSelectedDocType] = useState('nationalId'); // 'nationalId' or 'driversLicense'
  const [nationalIdImage, setNationalIdImage] = useState(null);
  const [driversLicenseImage, setDriversLicenseImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Upload Documents',
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

  const pickImage = async (docType) => {
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
        if (docType === 'nationalId') {
          setNationalIdImage(result.assets[0].uri);
        } else {
          setDriversLicenseImage(result.assets[0].uri);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      console.error('Image picker error:', error);
    }
  };

  const takePhoto = async (docType) => {
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
        if (docType === 'nationalId') {
          setNationalIdImage(result.assets[0].uri);
        } else {
          setDriversLicenseImage(result.assets[0].uri);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
      console.error('Camera error:', error);
    }
  };

  const showImageOptions = (docType) => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: () => takePhoto(docType) },
        { text: 'Choose from Gallery', onPress: () => pickImage(docType) },
      ],
      { cancelable: true }
    );
  };

  const handleUpload = async () => {
    if (!nationalIdImage && !driversLicenseImage) {
      Alert.alert('Error', 'Please upload at least one document');
      return;
    }

    setUploading(true);
    try {
      // TODO: Implement actual upload logic
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert(
        'Success',
        'Documents uploaded successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to upload documents. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (docType) => {
    if (docType === 'nationalId') {
      setNationalIdImage(null);
    } else {
      setDriversLicenseImage(null);
    }
  };

  const DocUploadCard = ({ title, docType, image, isActive }) => (
    <View style={[styles.docCard, { backgroundColor: theme.colors.white }]}>
      <View style={styles.docCardHeader}>
        <View style={styles.docCardHeaderLeft}>
          <Ionicons
            name={docType === 'nationalId' ? 'card-outline' : 'id-card-outline'}
            size={24}
            color={theme.colors.primary}
          />
          <Text style={[styles.docCardTitle, { color: theme.colors.textPrimary }]}>{title}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            { backgroundColor: isActive ? theme.colors.primary : '#E0E0E0' },
          ]}
          onPress={() => setSelectedDocType(docType)}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.toggleCircle,
              {
                transform: [{ translateX: isActive ? 18 : 2 }],
                backgroundColor: theme.colors.white,
              },
            ]}
          />
        </TouchableOpacity>
      </View>

      {isActive && (
        <View style={styles.docCardContent}>
          {image ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: image }} style={styles.imagePreview} resizeMode="cover" />
              <TouchableOpacity
                style={[styles.removeImageButton, { backgroundColor: '#F44336' }]}
                onPress={() => removeImage(docType)}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={20} color={theme.colors.white} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.uploadButton, { borderColor: theme.colors.primary }]}
              onPress={() => showImageOptions(docType)}
              activeOpacity={0.7}
            >
              <Ionicons name="camera-outline" size={32} color={theme.colors.primary} />
              <Text style={[styles.uploadButtonText, { color: theme.colors.primary }]}>
                Tap to Upload
              </Text>
              <Text style={[styles.uploadButtonSubtext, { color: theme.colors.hint }]}>
                Take a photo or choose from gallery
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.infoCard, { backgroundColor: theme.colors.white }]}>
        <Ionicons name="information-circle-outline" size={24} color={theme.colors.primary} />
        <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
          Please upload clear photos of your documents. Ensure all text is visible and the image is
          well-lit.
        </Text>
      </View>

      <DocUploadCard
        title="National ID"
        docType="nationalId"
        image={nationalIdImage}
        isActive={selectedDocType === 'nationalId'}
      />

      <DocUploadCard
        title="Driver's License"
        docType="driversLicense"
        image={driversLicenseImage}
        isActive={selectedDocType === 'driversLicense'}
      />

      <Button
        title="Upload Documents"
        onPress={handleUpload}
        variant="primary"
        style={styles.uploadButtonMain}
        loading={uploading}
        disabled={!nationalIdImage && !driversLicenseImage}
      />

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
  infoText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  docCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  docCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  docCardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  docCardTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  toggleButton: {
    width: 40,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    padding: 2,
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  docCardContent: {
    marginTop: 8,
  },
  imagePreviewContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  uploadButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    marginTop: 12,
  },
  uploadButtonSubtext: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    marginTop: 4,
  },
  uploadButtonMain: {
    marginTop: 24,
  },
});

export default UploadDocsScreen;

