import React, { useLayoutEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../packages/theme/ThemeProvider';
import * as ImagePicker from 'expo-image-picker';

const ReturnVerificationScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const { booking } = route.params || {};

  const [mileage, setMileage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [photos, setPhotos] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const filteredPhotos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return photos;
    return photos.filter((p) => (p.label || '').toLowerCase().includes(q));
  }, [photos, searchQuery]);

  const ensureMediaPermissions = async (mode) => {
    if (mode === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === 'granted';
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  };

  const addPickedAssets = (assets) => {
    if (!assets || assets.length === 0) return;
    setPhotos((prev) => {
      const base = prev.length;
      const toAdd = assets.map((a, idx) => ({
        id: `${Date.now()}-${idx}`,
        uri: a.uri,
        label: `Return photo ${base + idx + 1}`,
      }));
      return [...prev, ...toAdd];
    });
  };

  const handlePickFromLibrary = async () => {
    const ok = await ensureMediaPermissions('library');
    if (!ok) {
      Alert.alert('Permission required', 'Please allow photo library access to upload return images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 0,
    });

    if (result.canceled) return;
    addPickedAssets(result.assets);
  };

  const handleTakePhoto = async () => {
    const ok = await ensureMediaPermissions('camera');
    if (!ok) {
      Alert.alert('Permission required', 'Please allow camera access to take return images.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (result.canceled) return;
    addPickedAssets(result.assets);
  };

  const updatePhotoLabel = (id, nextLabel) => {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, label: nextLabel } : p)));
  };

  const removePhoto = (id) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSubmit = () => {
    if (!mileage.trim()) {
      Alert.alert('Mileage required', 'Please enter the mileage at return.');
      return;
    }
    if (photos.length === 0) {
      Alert.alert('Photos required', 'Please upload at least one return photo for verification.');
      return;
    }

    Alert.alert('Submitted', 'Your return verification has been submitted for review.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={[styles.header, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]} numberOfLines={1}>
          Return verification
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: theme.colors.white }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>Rental</Text>
          <Text style={[styles.cardSubtitle, { color: theme.colors.textSecondary }]} numberOfLines={1}>
            {booking?.carName || booking?.car?.name || 'Completed rental'}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.white }]}
        >
          <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>Mileage at return</Text>
          <Text style={[styles.helperText, { color: theme.colors.textSecondary }]}>
            Enter the mileage shown on the dashboard when returning the car.
          </Text>
          <View style={[styles.inputRow, { borderColor: theme.colors.hint + '40', backgroundColor: theme.colors.background }]}>
            <Ionicons name="speedometer-outline" size={18} color={theme.colors.textSecondary} />
            <TextInput
              value={mileage}
              onChangeText={setMileage}
              placeholder="e.g. 45,230"
              placeholderTextColor={theme.colors.hint}
              keyboardType="numeric"
              style={[styles.input, { color: theme.colors.textPrimary }]}
            />
            <Text style={[styles.inputSuffix, { color: theme.colors.textSecondary }]}>km</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.white }]}
        >
          <View style={styles.photosHeader}>
            <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>Return photos</Text>
            <View style={styles.photosActions}>
              <TouchableOpacity style={[styles.smallAction, { borderColor: theme.colors.hint + '40' }]} onPress={handleTakePhoto} activeOpacity={0.8}>
                <Ionicons name="camera-outline" size={18} color={theme.colors.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.smallAction, { borderColor: theme.colors.hint + '40' }]} onPress={handlePickFromLibrary} activeOpacity={0.8}>
                <Ionicons name="image-outline" size={18} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.searchRow, { borderColor: theme.colors.hint + '40', backgroundColor: theme.colors.background }]}>
            <Ionicons name="search-outline" size={18} color={theme.colors.textSecondary} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search photos..."
              placeholderTextColor={theme.colors.hint}
              style={[styles.input, { color: theme.colors.textPrimary }]}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.8}>
                <Ionicons name="close-circle" size={18} color={theme.colors.hint} />
              </TouchableOpacity>
            )}
          </View>

          {filteredPhotos.length === 0 ? (
            <View style={styles.emptyPhotos}>
              <Text style={[styles.helperText, { color: theme.colors.textSecondary }]}>
                Add photos of the exterior, interior, and any existing marks.
              </Text>
            </View>
          ) : (
            <View style={styles.photosGrid}>
              {filteredPhotos.map((p) => (
                <View key={p.id} style={[styles.photoCard, { backgroundColor: theme.colors.background }]}>
                  <Image source={{ uri: p.uri }} style={styles.photo} resizeMode="cover" />
                  <View style={styles.photoMeta}>
                    <TextInput
                      value={p.label}
                      onChangeText={(t) => updatePhotoLabel(p.id, t)}
                      placeholder="Label"
                      placeholderTextColor={theme.colors.hint}
                      style={[styles.photoLabel, { color: theme.colors.textPrimary }]}
                      numberOfLines={1}
                    />
                    <TouchableOpacity onPress={() => removePhoto(p.id)} activeOpacity={0.8}>
                      <Ionicons name="trash-outline" size={18} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
          activeOpacity={0.85}
          onPress={handleSubmit}
        >
          <Ionicons name="checkmark-circle-outline" size={22} color={theme.colors.white} />
          <Text style={[styles.submitText, { color: theme.colors.white }]}>Submit verification</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    fontFamily: 'Nunito_600SemiBold',
  },
  headerRight: {
    width: 40,
    height: 40,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 16,
  },
  card: {
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 13,
    fontFamily: 'Nunito_400Regular',
  },
  helperText: {
    fontSize: 13,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 18,
  },
  inputRow: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchRow: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    padding: 0,
  },
  inputSuffix: {
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
  },
  photosHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  photosActions: {
    flexDirection: 'row',
    gap: 10,
  },
  smallAction: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  emptyPhotos: {
    paddingVertical: 16,
  },
  photosGrid: {
    marginTop: 14,
    gap: 14,
  },
  photoCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: 190,
  },
  photoMeta: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  photoLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    padding: 0,
  },
  submitButton: {
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  submitText: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
});

export default ReturnVerificationScreen;
