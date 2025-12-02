import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ArticleScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { article } = route.params || {};

  // Sample article data if not provided
  const articleData = article || {
    id: 'sample',
    title: 'Top 10 Road Trip Destinations in Kenya',
    author: 'Opa Editorial Team',
    date: '2 days ago',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
    content: `Kenya is a country blessed with diverse landscapes, from pristine beaches to majestic mountains, making it a perfect destination for road trips. Whether you're seeking adventure, wildlife encounters, or simply breathtaking scenery, Kenya has something for every traveler.

Here are the top 10 road trip destinations that should be on your bucket list:

1. **Mombasa Beaches**
   Experience the coastal paradise with beautiful white sand beaches, crystal-clear waters, and vibrant marine life. Perfect for relaxation and water activities.

2. **Lake Nakuru**
   Home to thousands of flamingos and diverse wildlife, Lake Nakuru offers stunning lake views and excellent bird watching opportunities.

3. **Lord Egerton Castle**
   A historic castle with stunning architecture, offering a glimpse into Kenya's colonial past and beautiful gardens to explore.

4. **Hell's Gate National Park**
   A spectacular canyon and geothermal park where you can walk, cycle, or drive through the dramatic landscape that inspired the Lion King.

5. **Ol Pejeta Conservancy**
   A wildlife conservation area offering incredible safari experiences and the chance to see the Big Five.

6. **Maasai Mara**
   World-famous for the Great Migration, this reserve offers unparalleled wildlife viewing and authentic cultural experiences.

7. **Mount Kenya**
   For the adventurous, Mount Kenya offers challenging climbs and stunning alpine scenery.

8. **Samburu National Reserve**
   Unique wildlife and beautiful landscapes make this reserve a must-visit for nature lovers.

9. **Tsavo National Park**
   One of the largest national parks in Kenya, offering diverse ecosystems and abundant wildlife.

10. **Diani Beach**
    A tropical paradise with pristine beaches, perfect for water sports and relaxation.

Each destination offers unique experiences that will make your road trip unforgettable. Plan your journey, pack your bags, and get ready to explore the beauty of Kenya!`,
  };

  // Hide header and tab bar
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

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

  // Render content with bold titles (text between **)
  const renderFormattedContent = (text) => {
    if (!text) return null;
    
    const parts = [];
    const regex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(
          <Text key={`text-${lastIndex}`} style={[styles.content, { color: theme.colors.textPrimary }]}>
            {text.substring(lastIndex, match.index)}
          </Text>
        );
      }
      
      // Add bold text (without asterisks)
      parts.push(
        <Text key={`bold-${match.index}`} style={[styles.content, styles.boldText, { color: theme.colors.textPrimary }]}>
          {match[1]}
        </Text>
      );
      
      lastIndex = regex.lastIndex;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(
        <Text key={`text-${lastIndex}`} style={[styles.content, { color: theme.colors.textPrimary }]}>
          {text.substring(lastIndex)}
        </Text>
      );
    }
    
    return <Text style={styles.contentWrapper}>{parts}</Text>;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Sticky Back Button */}
      <TouchableOpacity
        style={[
          styles.backButton,
          {
            top: insets.top + 8,
            backgroundColor: theme.colors.white,
          },
        ]}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Article Image */}
        <View style={styles.imageContainer}>
          <Image
            source={typeof articleData.image === 'string' ? { uri: articleData.image } : articleData.image}
            style={styles.articleImage}
            resizeMode="cover"
          />
        </View>

        {/* Article Content */}
        <View style={styles.contentContainer}>
          {/* Title */}
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            {articleData.title}
          </Text>

          {/* Author and Date */}
          <View style={styles.metaContainer}>
            <Text style={[styles.author, { color: theme.colors.textSecondary }]}>
              {articleData.author}
            </Text>
            <Text style={[styles.date, { color: theme.colors.hint }]}>
              {articleData.date}
            </Text>
          </View>

          {/* Article Content */}
          {renderFormattedContent(articleData.content)}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageContainer: {
    width: '100%',
    height: 300,
  },
  articleImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 16,
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  author: {
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold',
  },
  date: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  contentWrapper: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 26,
    letterSpacing: 0.2,
  },
  content: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 26,
    letterSpacing: 0.2,
  },
  boldText: {
    fontFamily: 'Nunito_700Bold',
  },
});

export default ArticleScreen;

