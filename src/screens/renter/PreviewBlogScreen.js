import React, { useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PreviewBlogScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  
  const { title, content, selectedImage } = route.params || {};

  // Hide header and ensure tab bar is hidden
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    // Immediately hide tab bar
    const parent = navigation.getParent();
    if (parent) {
      parent.setOptions({
        tabBarStyle: { display: 'none' },
      });
    }
  }, [navigation]);

  // Hide bottom tab bar when screen is focused - always hide it
  useFocusEffect(
    React.useCallback(() => {
      // Force hide tab bar every time screen is focused
      const parent = navigation.getParent();
      if (parent) {
        parent.setOptions({
          tabBarStyle: { display: 'none' },
        });
      }
      return () => {
        // Restore tab bar when leaving this screen (unless going to WriteBlog)
        setTimeout(() => {
          const state = navigation.getState();
          const currentRoute = state?.routes[state?.index];
          if (currentRoute?.name !== 'WriteBlog') {
            navigation.getParent()?.setOptions({
              tabBarStyle: undefined,
            });
          }
        }, 50);
      };
    }, [navigation])
  );

  const handlePublish = () => {
    if (!title || !title.trim()) {
      Alert.alert('Title Required', 'Please enter a title for your blog post.');
      return;
    }
    if (!content || !content.trim()) {
      Alert.alert('Content Required', 'Please write some content for your blog post.');
      return;
    }

    // TODO: Implement actual publish logic
    Alert.alert(
      'Blog Published!',
      'Your blog post has been published successfully.',
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('HomeTab', { screen: 'RenterHome' });
          },
        },
      ]
    );
  };

  const getPreviewContent = () => {
    if (!content) return '';
    const lines = content.split('\n').filter(line => line.trim());
    return lines.slice(0, 3).join('\n');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16, paddingBottom: 16 }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.colors.white }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
          Preview
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Blog Card */}
        <View style={[styles.blogCard, { backgroundColor: theme.colors.white }]}>
          {/* Blog Image */}
          <View style={styles.blogCardImageContainer}>
            {selectedImage ? (
              <Image
                source={{ uri: selectedImage.uri }}
                style={styles.blogCardImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.blogCardImagePlaceholder, { backgroundColor: theme.colors.background }]}>
                <Ionicons name="image-outline" size={48} color={theme.colors.hint} />
              </View>
            )}
          </View>

          {/* Blog Title */}
          {title && title.trim() && (
            <Text style={[styles.blogCardTitle, { color: theme.colors.textPrimary }]} numberOfLines={2}>
              {title}
            </Text>
          )}

          {/* Blog Content Preview */}
          {content && content.trim() && (
            <Text style={[styles.blogCardContent, { color: theme.colors.textSecondary }]} numberOfLines={3}>
              {getPreviewContent()}
            </Text>
          )}

          {/* Empty State */}
          {(!title || !title.trim()) && (!content || !content.trim()) && (
            <View style={styles.emptyPreviewState}>
              <Ionicons name="document-text-outline" size={48} color={theme.colors.hint} />
              <Text style={[styles.emptyPreviewText, { color: theme.colors.hint }]}>
                Start writing to see preview
              </Text>
            </View>
          )}

          {/* Publish Button - Inside Card */}
          <View style={styles.publishButtonContainer}>
            <TouchableOpacity
              style={[styles.publishButton, { backgroundColor: theme.colors.primary }]}
              onPress={handlePublish}
              activeOpacity={0.7}
            >
              <Text style={[styles.publishButtonText, { color: theme.colors.white }]}>
                Publish
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: insets.bottom + 24 }} />
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
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
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 20,
  },
  blogCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  blogCardImageContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#F5F5F5',
  },
  blogCardImage: {
    width: '100%',
    height: '100%',
  },
  blogCardImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blogCardTitle: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    padding: 20,
    paddingBottom: 12,
    lineHeight: 32,
  },
  blogCardContent: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    paddingHorizontal: 20,
    paddingBottom: 20,
    lineHeight: 24,
  },
  emptyPreviewState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyPreviewText: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
  },
  publishButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    marginTop: 8,
  },
  publishButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  publishButtonText: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
});

export default PreviewBlogScreen;

