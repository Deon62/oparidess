import React, { useState, useLayoutEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

const WriteBlogScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const contentInputRef = useRef(null);
  const titleInputRef = useRef(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [tags, setTags] = useState([]);
  const [isDraft, setIsDraft] = useState(false);
  const [titleHeight, setTitleHeight] = useState(30);
  const [currentTag, setCurrentTag] = useState('');

  // Hide header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // Hide bottom tab bar when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: 'none' },
      });
      return () => {
        navigation.getParent()?.setOptions({
          tabBarStyle: undefined,
        });
      };
    }, [navigation])
  );

  const handlePreview = () => {
    navigation.navigate('PreviewBlog', {
      title,
      content,
      selectedImage,
      tags,
    });
  };

  const handleSaveDraft = () => {
    // TODO: Implement save draft logic
    Alert.alert('Draft Saved', 'Your blog post has been saved as a draft.');
  };

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant permission to access your photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setSelectedImage({
        uri: result.assets[0].uri,
        id: Date.now(),
      });
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };




  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Sticky Back Button and Image Icon */}
      <View style={[styles.backButtonContainer, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.colors.white }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.imageIconButton, { backgroundColor: theme.colors.white }]}
          onPress={handleImagePicker}
          activeOpacity={0.8}
        >
          <Ionicons name="image-outline" size={22} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Combined Title and Content Input */}
          <View style={[styles.combinedSection, { backgroundColor: theme.colors.white }]}>
            <TextInput
              ref={titleInputRef}
              style={[
                styles.titleInput,
                { color: theme.colors.textPrimary, height: Math.max(30, titleHeight) },
              ]}
              placeholder="Enter blog title"
              placeholderTextColor={theme.colors.hint}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
              autoFocus={false}
              multiline
              onContentSizeChange={(event) => {
                setTitleHeight(event.nativeEvent.contentSize.height);
              }}
            />
            <Text style={[styles.charCount, { color: theme.colors.hint }]}>
              {title.length}/100
            </Text>
            
            <View style={styles.divider} />
            
            <TextInput
              ref={contentInputRef}
              style={[styles.contentInput, { color: theme.colors.textPrimary }]}
              placeholder="Write blog"
              placeholderTextColor={theme.colors.hint}
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              maxLength={5000}
            />
            <Text style={[styles.charCount, { color: theme.colors.hint }]}>
              {content.length}/5000
            </Text>
          </View>

        {/* Selected Image */}
        {selectedImage && (
          <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Featured Image
            </Text>
            <View style={styles.imageWrapper}>
              <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={handleRemoveImage}
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle" size={24} color="#F44336" />
              </TouchableOpacity>
            </View>
          </View>
        )}


          {/* Bottom spacing for sticky buttons */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sticky Action Buttons */}
      <View style={[styles.stickyActionButtons, { paddingBottom: insets.bottom + 16, paddingTop: 16 }]}>
        <TouchableOpacity
          style={[styles.draftButton, { backgroundColor: theme.colors.white, borderColor: theme.colors.hint }]}
          onPress={handleSaveDraft}
          activeOpacity={0.7}
        >
          <Ionicons name="save-outline" size={20} color={theme.colors.textSecondary} />
          <Text style={[styles.draftButtonText, { color: theme.colors.textSecondary }]}>
            Save Draft
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.publishButtonBottom, { backgroundColor: theme.colors.primary }]}
          onPress={handlePreview}
          activeOpacity={0.7}
        >
          <Ionicons name="eye-outline" size={20} color={theme.colors.white} />
          <Text style={[styles.publishButtonBottomText, { color: theme.colors.white }]}>
            Preview
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  imageIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    marginHorizontal: 24,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
  },
  combinedSection: {
    marginHorizontal: 24,
    marginTop: 8,
    borderRadius: 16,
    padding: 20,
  },
  titleInput: {
    fontSize: 22,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
    padding: 0,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  contentInput: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    minHeight: 400,
    lineHeight: 24,
    marginBottom: 8,
    padding: 0,
  },
  charCount: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 12,
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    marginTop: 12,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 4,
  },
  tagInputContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
  },
  addTagButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  tagText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  stickyActionButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  draftButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  draftButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  publishButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  publishButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  publishButtonBottom: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  publishButtonBottomText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
});

export default WriteBlogScreen;

