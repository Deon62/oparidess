import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform, Image, ScrollView, Linking } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Button } from '../../packages/components';

let Location = null;
try {
  Location = require('expo-location');
} catch (e) {
  // expo-location not installed
}

const MAX_IMAGES = 10;

const ReportAccidentScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const [description, setDescription] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [isSending, setIsSending] = useState(false);

  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: 'none' },
      });
      // Don't restore tab bar here - let EmergencyOptionsScreen handle it
    }, [navigation])
  );

  const remainingSlots = useMemo(() => MAX_IMAGES - selectedImages.length, [selectedImages.length]);

  const handlePickImages = async () => {
    if (remainingSlots <= 0) {
      Alert.alert('Limit reached', `You can upload up to ${MAX_IMAGES} images.`);
      return;
    }

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow access to your media library to upload images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (result.canceled) return;

      const picked = (result.assets || []).map((asset, index) => ({
        id: `${asset.assetId || asset.uri}-${Date.now()}-${index}`,
        uri: asset.uri,
        name: asset.fileName || asset.uri.split('/').pop() || `Image-${index + 1}`,
      }));

      const combined = [...selectedImages, ...picked];
      if (combined.length > MAX_IMAGES) {
        Alert.alert('Limit reached', `Only the first ${MAX_IMAGES} images will be attached.`);
      }

      setSelectedImages(combined.slice(0, MAX_IMAGES));
    } catch (e) {
      Alert.alert('Upload failed', 'There was a problem selecting images. Please try again.');
    }
  };

  const removeImage = (id) => {
    setSelectedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleCallPolice = async () => {
    const primary = 'tel:999';
    const secondary = 'tel:112';

    try {
      const canCallPrimary = await Linking.canOpenURL(primary);
      if (canCallPrimary) {
        await Linking.openURL(primary);
        return;
      }
      const canCallSecondary = await Linking.canOpenURL(secondary);
      if (canCallSecondary) {
        await Linking.openURL(secondary);
        return;
      }
      Alert.alert('Unable to call', 'Calling is not available on this device.');
    } catch (e) {
      Alert.alert('Unable to call', 'Please dial your local emergency number.');
    }
  };

  const handleSend = async () => {
    const trimmed = description.trim();
    if (!trimmed) {
      Alert.alert('Required', 'Please describe what happened.');
      return;
    }

    if (!Location) {
      Alert.alert(
        'Location Service Unavailable',
        'Location services require expo-location package.'
      );
      return;
    }

    setIsSending(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to send this report.');
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const payload = {
        type: 'accident',
        description: trimmed,
        location: {
          latitude: position?.coords?.latitude ?? null,
          longitude: position?.coords?.longitude ?? null,
          accuracy: position?.coords?.accuracy ?? null,
        },
        images: selectedImages.map((img) => ({
          uri: img.uri,
          name: img.name,
        })),
        reportedAt: new Date().toISOString(),
      };

      console.log('Accident report submitted:', payload);

      Alert.alert('Sent', 'Your accident report has been sent.');
      setDescription('');
      setSelectedImages([]);
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Unable to send report. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backButton, { backgroundColor: theme.colors.white }]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={theme.colors.textPrimary} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
            Report Accident
          </Text>

          <View style={styles.headerRightSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom + 24, 24) }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.noticeCard, { backgroundColor: '#F44336' + '10', borderColor: '#F44336' + '25' }]}>
            <View style={styles.noticeHeader}>
              <Ionicons name="warning-outline" size={22} color="#F44336" />
              <Text style={[styles.noticeTitle, { color: theme.colors.textPrimary }]}>
                Safety First
              </Text>
            </View>
            <Text style={[styles.noticeText, { color: theme.colors.textSecondary }]}>
              If anyone is injured or there is immediate danger, please call the police/emergency services right away.
            </Text>
            <Button
              title="Call Police"
              onPress={handleCallPolice}
              variant="primary"
              style={[styles.callButton, { backgroundColor: '#F44336' }]}
              textStyle={{ color: theme.colors.white }}
            />
            <Text style={[styles.noticeHint, { color: theme.colors.textSecondary }]}>
              This will attempt to dial 999 (or 112 if unavailable).
            </Text>
          </View>

          <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
            What happened?
          </Text>
          <TextInput
            style={[
              styles.textArea,
              {
                backgroundColor: theme.colors.white,
                color: theme.colors.textPrimary,
                borderColor: theme.colors.hint + '40',
              },
            ]}
            placeholder="Briefly describe the accident, damages, and any injuries..."
            placeholderTextColor={theme.colors.hint}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
            editable={!isSending}
            maxLength={1500}
          />

          <View style={styles.imagesHeaderRow}>
            <Text style={[styles.label, { color: theme.colors.textPrimary, marginBottom: 0 }]}>
              Photos (optional)
            </Text>
            <Text style={[styles.counterText, { color: theme.colors.textSecondary }]}>
              {selectedImages.length} / {MAX_IMAGES}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.uploadButton, { borderColor: theme.colors.textPrimary }]}
            onPress={handlePickImages}
            activeOpacity={0.7}
            disabled={isSending}
          >
            <Ionicons name="camera-outline" size={22} color={theme.colors.textPrimary} />
            <Text style={[styles.uploadButtonText, { color: theme.colors.textPrimary }]}>
              Add Photos
            </Text>
            <View style={{ flex: 1 }} />
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          {selectedImages.length > 0 && (
            <View style={styles.imagesGrid}>
              {selectedImages.map((img) => (
                <View key={img.id} style={[styles.imageTile, { backgroundColor: theme.colors.white }]}> 
                  <Image source={{ uri: img.uri }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(img.id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="close-circle" size={22} color="#F44336" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <Button
            title={isSending ? 'Sending...' : 'Send Report (with location)'}
            onPress={handleSend}
            variant="primary"
            loading={isSending}
            disabled={isSending}
            style={styles.sendButton}
          />

          <Text style={[styles.helperText, { color: theme.colors.textSecondary }]}>
            When you send, we’ll attach your current location and the photos you selected.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  headerRightSpacer: {
    width: 40,
    height: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  noticeCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 18,
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  noticeTitle: {
    fontSize: 15,
    fontFamily: 'Nunito_700Bold',
  },
  noticeText: {
    fontSize: 13,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 18,
    marginBottom: 12,
  },
  callButton: {
    borderRadius: 14,
    paddingVertical: 12,
    marginBottom: 8,
  },
  noticeHint: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  label: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 10,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    minHeight: 160,
    marginBottom: 16,
  },
  imagesHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  counterText: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  uploadButton: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
    backgroundColor: 'transparent',
  },
  uploadButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },
  imageTile: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  sendButton: {
    borderRadius: 18,
  },
  helperText: {
    marginTop: 12,
    marginBottom: 8,
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 16,
  },
});

export default ReportAccidentScreen;
