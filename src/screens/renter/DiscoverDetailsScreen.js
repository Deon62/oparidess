import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWishlist } from '../../packages/context/WishlistContext';

const DiscoverDetailsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { item, category } = route.params || {};
  const { toggleDiscoverLike, likedDiscover } = useWishlist();

  // Default data if not provided
  const discoverItem = item || {
    id: 'mombasa',
    name: 'Mombasa Beaches',
    description: 'Coastal paradise with beautiful beaches',
    image: require('../../../assets/images/mombasa.webp'),
    likeId: 'destination-mombasa',
  };

  const isLiked = likedDiscover.has(discoverItem.likeId);

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

  const handleShare = async () => {
    try {
      const shareContent = {
        message: `Check out ${discoverItem.name} on Oparides! ${discoverItem.description || ''}`,
        title: discoverItem.name,
      };
      await Share.share(shareContent);
    } catch (error) {
      Alert.alert('Error', 'Unable to share at this time');
    }
  };

  const handleLike = () => {
    toggleDiscoverLike(discoverItem.likeId);
  };

  // Get additional details based on category
  const getAdditionalInfo = () => {
    if (category === 'destinations' || category === 'events') {
      return {
        type: category === 'destinations' ? 'Destination' : 'Event',
        location: discoverItem.location || 'Kenya',
        highlights: [
          'Perfect for families and solo travelers',
          'Easy to access and navigate',
          'Rich cultural and natural experiences',
        ],
      };
    } else if (category === 'autoParts') {
      return {
        type: 'Auto Parts Shop',
        location: discoverItem.location || 'Nairobi',
        rating: discoverItem.rating || 4.5,
        price: discoverItem.price || 'Various',
        highlights: [
          'Wide selection of parts',
          'Competitive pricing',
          'Expert advice available',
        ],
      };
    } else if (category === 'mechanics') {
      return {
        type: 'Mechanic',
        location: discoverItem.location || 'Nairobi',
        rating: discoverItem.rating || 4.5,
        experience: discoverItem.experience || '10+ years',
        highlights: [
          'Certified and experienced',
          'Quality service guaranteed',
          'Quick turnaround time',
        ],
      };
    }
    return null;
  };

  const additionalInfo = getAdditionalInfo();

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

      {/* Floating Action Buttons */}
      <View style={[styles.floatingActions, { top: insets.top + 8 }]}>
        <TouchableOpacity
          style={[styles.floatingButton, { backgroundColor: theme.colors.white }]}
          onPress={handleShare}
          activeOpacity={0.7}
        >
          <Ionicons name="share-outline" size={22} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.floatingButton, { backgroundColor: theme.colors.white }]}
          onPress={handleLike}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={22}
            color={isLiked ? '#FF3B30' : theme.colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Section */}
        <View style={styles.imageContainer}>
          <Image
            source={typeof discoverItem.image === 'string' ? { uri: discoverItem.image } : discoverItem.image}
            style={styles.mainImage}
            resizeMode="cover"
          />
        </View>

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Title Section */}
          <View style={styles.section}>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
              {discoverItem.name || discoverItem.title}
            </Text>
            {discoverItem.description && (
              <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
                {discoverItem.description}
              </Text>
            )}
          </View>

          {/* Overview Section */}
          {additionalInfo && (
            <>
              <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                  Overview
                </Text>
                <View style={styles.infoRow}>
                  <Ionicons name="pricetag-outline" size={18} color={theme.colors.hint} />
                  <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                    {additionalInfo.type}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={18} color={theme.colors.hint} />
                  <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                    {additionalInfo.location}
                  </Text>
                </View>
                {additionalInfo.rating && (
                  <View style={styles.infoRow}>
                    <Ionicons name="star" size={18} color="#FFB800" />
                    <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                      {additionalInfo.rating} Rating
                    </Text>
                  </View>
                )}
                {additionalInfo.price && (
                  <View style={styles.infoRow}>
                    <Ionicons name="cash-outline" size={18} color={theme.colors.hint} />
                    <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                      {additionalInfo.price}
                    </Text>
                  </View>
                )}
                {additionalInfo.experience && (
                  <View style={styles.infoRow}>
                    <Ionicons name="time-outline" size={18} color={theme.colors.hint} />
                    <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                      {additionalInfo.experience} Experience
                    </Text>
                  </View>
                )}
              </View>
            </>
          )}

          {/* Highlights Section */}
          {additionalInfo?.highlights && (
            <>
              <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                  Highlights
                </Text>
                {additionalInfo.highlights.map((highlight, index) => (
                  <View key={index} style={styles.highlightItem}>
                    <Ionicons name="checkmark-circle" size={18} color={theme.colors.primary} />
                    <Text style={[styles.highlightText, { color: theme.colors.textSecondary }]}>
                      {highlight}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Additional Details Section */}
          {discoverItem.details && (
            <>
              <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                  Details
                </Text>
                <Text style={[styles.detailsText, { color: theme.colors.textSecondary }]}>
                  {discoverItem.details}
                </Text>
              </View>
            </>
          )}

          {/* Contact/Action Section for Businesses */}
          {(category === 'autoParts' || category === 'mechanics') && (
            <>
              <View style={[styles.sectionSeparator, { borderTopColor: theme.colors.hint + '40' }]} />
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                  Get in Touch
                </Text>
                <Text style={[styles.detailsText, { color: theme.colors.textSecondary }]}>
                  Contact this business directly through the Oparides platform or visit their location for more information.
                </Text>
              </View>
            </>
          )}
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
  floatingActions: {
    position: 'absolute',
    right: 16,
    zIndex: 1000,
    gap: 12,
  },
  floatingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  mainImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    paddingTop: 24,
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  sectionSeparator: {
    borderTopWidth: 1,
    marginTop: 0,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 12,
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  highlightText: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    flex: 1,
  },
  detailsText: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 24,
  },
});

export default DiscoverDetailsScreen;

