import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
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
  StatusBar,
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
  useLayoutEffect(() => {
    const parent = navigation.getParent();
    if (parent) {
      parent.setOptions({
        tabBarStyle: { display: 'none' },
      });
    }
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      const parent = navigation.getParent();
      if (parent) {
        parent.setOptions({
          tabBarStyle: { display: 'none' },
        });
      }
      return () => {
        // Only restore tab bar when navigating away (not when screen loses focus)
        const timeout = setTimeout(() => {
          const state = navigation.getState();
          const currentRoute = state?.routes[state?.index];
          // Don't restore if still on WriteBlog or PreviewBlog
          if (currentRoute?.name !== 'WriteBlog' && currentRoute?.name !== 'PreviewBlog') {
            const parentNav = navigation.getParent();
            if (parentNav) {
              parentNav.setOptions({
                tabBarStyle: undefined,
              });
            }
          }
        }, 100);
        return () => clearTimeout(timeout);
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
    <View style={[styles.container, { backgroundColor: theme.colors.background, paddingBottom: 0 }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      {/* Top Bar - Sticky */}
      <View style={[
        styles.topBar,
        {
          paddingTop: insets.top,
          paddingBottom: 12,
          backgroundColor: theme.colors.background,
        }
      ]}>
        <View style={styles.topBarContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.rightActions}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleSaveDraft}
              activeOpacity={0.8}
            >
              <Ionicons name="save-outline" size={24} color={theme.colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleImagePicker}
              activeOpacity={0.8}
            >
              <Ionicons name="image" size={24} color={theme.colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.previewButton}
              onPress={handlePreview}
              activeOpacity={0.8}
            >
              <Text style={[styles.previewButtonText, { color: theme.colors.textPrimary }]}>
                Preview
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={[styles.keyboardView, { paddingBottom: 0, marginBottom: 0 }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: insets.top + 64,
              paddingBottom: 0,
            }
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={true}
          scrollEnabled={true}
        >
          {/* Combined Title and Content Input */}
          <View style={styles.combinedSection}>
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
            
            {/* Selected Image - appears below title */}
            {selectedImage && (
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
            )}
            
            <View style={[styles.divider, { backgroundColor: theme.colors.hint + '30' }]} />
            
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
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  topBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  previewButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  keyboardView: {
    flex: 1,
    paddingBottom: 0,
  },
  scrollView: {
    flex: 1,
    paddingBottom: 0,
    marginBottom: 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 0,
    marginBottom: 0,
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
    paddingTop: 8,
    paddingBottom: 0,
    marginBottom: 0,
  },
  titleInput: {
    fontSize: 22,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
    padding: 0,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  contentInput: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    minHeight: 300,
    lineHeight: 24,
    marginBottom: 0,
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
    marginTop: 16,
    marginBottom: 8,
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
});

export default WriteBlogScreen;

