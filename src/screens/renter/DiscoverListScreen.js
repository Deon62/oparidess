import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useWishlist } from '../../packages/context/WishlistContext';

// Import images
const mombasaImage = require('../../../assets/images/mombasa.webp');
const nakuruImage = require('../../../assets/images/lNakuru.webp');
const egertonImage = require('../../../assets/images/LEgerton.webp');
const hellsgateImage = require('../../../assets/images/hellsgate.webp');
const pejetaImage = require('../../../assets/images/pejeta.webp');
const eventsImage = require('../../../assets/images/events.webp');
const events1Image = require('../../../assets/images/events1.webp');
const events2Image = require('../../../assets/images/events2.webp');
const events3Image = require('../../../assets/images/events3.webp');
const nairobiImage = require('../../../assets/images/nairobi.webp');
const parkImage = require('../../../assets/images/park.webp');

const DiscoverListScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { categoryId } = route.params || {};
  const { likedDiscover, toggleDiscoverLike } = useWishlist();

  // Discover data
  const discoverData = {
    destinations: [
      { id: 'mombasa', name: 'Mombasa Beaches', description: 'Coastal paradise with beautiful beaches', image: mombasaImage, likeId: 'destination-mombasa' },
      { id: 'nakuru', name: 'Lake Nakuru', description: 'Wildlife and scenic lake views', image: nakuruImage, likeId: 'destination-nakuru' },
      { id: 'egerton', name: 'Lord Egerton Castle', description: 'Historic castle with stunning architecture', image: egertonImage, likeId: 'destination-egerton' },
      { id: 'hellsgate', name: 'Hell\'s Gate', description: 'Spectacular canyon and geothermal park', image: hellsgateImage, likeId: 'destination-hellsgate' },
      { id: 'pejeta', name: 'Ol Pejeta Conservancy', description: 'Wildlife conservation and safari experience', image: pejetaImage, likeId: 'destination-pejeta' },
    ],
    events: [
      { id: 'nairobi', name: 'Nairobi Auto Show', description: 'Biggest automotive exhibition in the region', image: eventsImage, likeId: 'event-nairobi' },
      { id: 'classic', name: 'Classic Car Exhibition', description: 'Vintage and classic vehicles showcase', image: events1Image, likeId: 'event-classic' },
      { id: 'supercar', name: 'Supercar Rally', description: 'High-performance supercars showcase', image: events2Image, likeId: 'event-supercar' },
      { id: 'motor', name: 'Motor Expo', description: 'Latest automotive technology and innovations', image: events3Image, likeId: 'event-motor' },
    ],
    autoParts: [
      { id: 1, name: 'Auto Parts Hub', price: 'Various', image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400', rating: 4.6, location: 'Nairobi', likeId: 'autoparts-1' },
      { id: 2, name: 'Car Parts Express', price: 'Various', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400', rating: 4.7, location: 'Nairobi', likeId: 'autoparts-2' },
      { id: 3, name: 'Premium Auto Parts', price: 'Various', image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400', rating: 4.8, location: 'Nairobi', likeId: 'autoparts-3' },
      { id: 4, name: 'Quality Parts Store', price: 'Various', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400', rating: 4.5, location: 'Nairobi', likeId: 'autoparts-4' },
    ],
    mechanics: [
      { id: 1, name: 'AutoCare Garage', rating: 4.8, location: 'Nairobi', image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400', experience: '15 years', likeId: 'mechanic-1' },
      { id: 2, name: 'Pro Mechanics Kenya', rating: 4.7, location: 'Nairobi', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400', experience: '12 years', likeId: 'mechanic-2' },
      { id: 3, name: 'Expert Auto Repair', rating: 4.9, location: 'Mombasa', image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400', experience: '18 years', likeId: 'mechanic-3' },
      { id: 4, name: 'Reliable Car Service', rating: 4.6, location: 'Nairobi', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400', experience: '10 years', likeId: 'mechanic-4' },
    ],
    blogs: [
      { 
        id: 'roadtrip', 
        title: 'Top 10 Road Trip Destinations in Kenya', 
        description: 'Discover the most breathtaking destinations perfect for your next road trip adventure.', 
        date: '2 days ago', 
        image: nairobiImage, 
        likeId: 'blog-roadtrip',
        fullContent: `Kenya is a country blessed with diverse landscapes, from pristine beaches to majestic mountains, making it a perfect destination for road trips. Whether you're seeking adventure, wildlife encounters, or simply breathtaking scenery, Kenya has something for every traveler.

Here are the top 10 road trip destinations that should be on your bucket list:

1. **Mombasa Beaches** - Experience the coastal paradise with beautiful white sand beaches, crystal-clear waters, and vibrant marine life. Perfect for relaxation and water activities.

2. **Lake Nakuru** - Home to thousands of flamingos and diverse wildlife, Lake Nakuru offers stunning lake views and excellent bird watching opportunities.

3. **Lord Egerton Castle** - A historic castle with stunning architecture, offering a glimpse into Kenya's colonial past and beautiful gardens to explore.

4. **Hell's Gate National Park** - A spectacular canyon and geothermal park where you can walk, cycle, or drive through the dramatic landscape that inspired the Lion King.

5. **Ol Pejeta Conservancy** - A wildlife conservation area offering incredible safari experiences and the chance to see the Big Five.

6. **Maasai Mara** - World-famous for the Great Migration, this reserve offers unparalleled wildlife viewing and authentic cultural experiences.

7. **Mount Kenya** - For the adventurous, Mount Kenya offers challenging climbs and stunning alpine scenery.

8. **Samburu National Reserve** - Unique wildlife and beautiful landscapes make this reserve a must-visit for nature lovers.

9. **Tsavo National Park** - One of the largest national parks in Kenya, offering diverse ecosystems and abundant wildlife.

10. **Diani Beach** - A tropical paradise with pristine beaches, perfect for water sports and relaxation.

Each destination offers unique experiences that will make your road trip unforgettable. Plan your journey, pack your bags, and get ready to explore the beauty of Kenya!`,
      },
      { 
        id: 'maintenance', 
        title: 'Car Maintenance Tips for Long Trips', 
        description: 'Essential maintenance tips to keep your rental car running smoothly during long journeys.', 
        date: '5 days ago', 
        image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400', 
        likeId: 'blog-maintenance',
        fullContent: `Planning a long road trip? Ensuring your vehicle is in top condition is crucial for a safe and enjoyable journey. Here are essential maintenance tips to keep your rental car running smoothly during long journeys.

**Before Your Trip:**

1. **Check Fluid Levels** - Engine oil, coolant, brake fluid, and windshield washer fluid should all be at proper levels.

2. **Inspect Tires** - Check tire pressure, look for signs of wear or damage, and ensure proper tread depth for safe driving.

3. **Test Your Battery** - Check battery terminals for corrosion and ensure battery is fully charged.

4. **Lights and Signals** - Test all headlights, taillights, and turn signals. Replace any burnt-out bulbs.

**During Your Trip:**

1. **Regular Checks** - Monitor temperature gauge, listen for unusual sounds, and watch for warning lights on dashboard.

2. **Fuel Management** - Don't let fuel tank get too low. Use quality fuel from reputable stations.

3. **Rest Stops** - Take breaks every 2-3 hours. Check tire pressure during long drives.

**Emergency Kit Essentials:**
- First aid kit
- Jumper cables
- Tire pressure gauge
- Basic tools
- Emergency contact numbers
- Roadside assistance information

Following these tips will help ensure your road trip is safe, smooth, and stress-free. Happy travels!`,
      },
    ],
  };

  const categoryNames = {
    destinations: 'Popular Destinations',
    events: 'Car Events Near Me',
    autoParts: 'Automobile Parts Shop',
    mechanics: 'Mechanics Near Me',
    blogs: 'Opa Blogs',
  };

  const displayedItems = categoryId ? discoverData[categoryId] || [] : [];

  useLayoutEffect(() => {
    const title = categoryId ? categoryNames[categoryId] : 'All Discoveries';
    navigation.setOptions({
      title,
    });
  }, [navigation, categoryId]);

  const handleItemPress = (item) => {
    if (categoryId === 'blogs') {
      // Navigate to Article screen for blogs
      navigation.navigate('Article', {
        article: {
          id: item.id,
          title: item.title,
          author: 'Opa Editorial Team',
          date: item.date,
          image: item.image.replace('w=400', 'w=800'),
          content: item.fullContent || item.description + '\n\nFull article content coming soon...',
        },
      });
    } else {
      navigation.navigate('ComingSoon');
    }
  };

  const renderDestinationCard = (item) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.8}
      style={styles.itemCardWrapper}
    >
      <View style={[styles.itemCard, { backgroundColor: theme.colors.white }]}>
        <View style={styles.itemImageContainer}>
          <Image source={item.image} style={styles.itemImage} resizeMode="cover" />
          <View style={styles.itemOverlay} />
          <View style={styles.itemActions}>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                toggleDiscoverLike(item.likeId);
              }}
              style={styles.actionButton}
              activeOpacity={0.7}
            >
              <Ionicons
                name={likedDiscover.has(item.likeId) ? 'heart' : 'heart-outline'}
                size={20}
                color={likedDiscover.has(item.likeId) ? '#FF3B30' : theme.colors.textPrimary}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.itemContent}>
          <Text style={[styles.itemName, { color: theme.colors.textPrimary }]}>
            {item.name}
          </Text>
          <Text style={[styles.itemDescription, { color: theme.colors.textSecondary }]}>
            {item.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderBusinessCard = (item) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.8}
      style={styles.itemCardWrapper}
    >
      <View style={[styles.itemCard, { backgroundColor: theme.colors.white }]}>
        <View style={styles.itemImageContainer}>
          <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
          <View style={styles.itemOverlay} />
          <View style={styles.itemActions}>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                toggleDiscoverLike(item.likeId);
              }}
              style={styles.actionButton}
              activeOpacity={0.7}
            >
              <Ionicons
                name={likedDiscover.has(item.likeId) ? 'heart' : 'heart-outline'}
                size={20}
                color={likedDiscover.has(item.likeId) ? '#FF3B30' : theme.colors.textPrimary}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.itemContent}>
          <Text style={[styles.itemName, { color: theme.colors.textPrimary }]}>
            {item.name}
          </Text>
          <View style={styles.businessDetails}>
            <View style={styles.businessDetailItem}>
              <Ionicons name="star" size={14} color="#FFB800" />
              <Text style={[styles.businessDetailText, { color: theme.colors.textSecondary }]}>
                {item.rating}
              </Text>
            </View>
            <View style={styles.businessDetailItem}>
              <Ionicons name="location-outline" size={14} color={theme.colors.hint} />
              <Text style={[styles.businessDetailText, { color: theme.colors.hint }]}>
                {item.location}
              </Text>
            </View>
            {item.experience && (
              <Text style={[styles.businessDetailText, { color: theme.colors.hint }]}>
                {item.experience}
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderBlogCard = (item) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.8}
      style={styles.itemCardWrapper}
    >
      <View style={[styles.itemCard, { backgroundColor: theme.colors.white }]}>
        <View style={styles.itemImageContainer}>
          <Image 
            source={typeof item.image === 'string' ? { uri: item.image } : item.image} 
            style={styles.itemImage} 
            resizeMode="cover" 
          />
          <View style={styles.itemOverlay} />
          <View style={styles.itemActions}>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                toggleDiscoverLike(item.likeId);
              }}
              style={styles.actionButton}
              activeOpacity={0.7}
            >
              <Ionicons
                name={likedDiscover.has(item.likeId) ? 'heart' : 'heart-outline'}
                size={20}
                color={likedDiscover.has(item.likeId) ? '#FF3B30' : theme.colors.textPrimary}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.itemContent}>
          <Text style={[styles.itemName, { color: theme.colors.textPrimary }]}>
            {item.title}
          </Text>
          <Text style={[styles.itemDescription, { color: theme.colors.textSecondary }]}>
            {item.description}
          </Text>
          <Text style={[styles.blogDate, { color: theme.colors.hint }]}>
            {item.date}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {displayedItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="compass-outline" size={64} color={theme.colors.hint} />
          <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
            No items available
          </Text>
        </View>
      ) : (
        <View style={styles.itemsGrid}>
          {categoryId === 'destinations' || categoryId === 'events' ? (
            displayedItems.map((item) => renderDestinationCard(item))
          ) : categoryId === 'autoParts' || categoryId === 'mechanics' ? (
            displayedItems.map((item) => renderBusinessCard(item))
          ) : categoryId === 'blogs' ? (
            displayedItems.map((item) => renderBlogCard(item))
          ) : null}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyStateText: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginTop: 24,
    textAlign: 'center',
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  itemCardWrapper: {
    width: '48%',
    minWidth: 160,
  },
  itemCard: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  itemActions: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemContent: {
    padding: 16,
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 6,
  },
  itemDescription: {
    fontSize: 13,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 18,
  },
  businessDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  businessDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  businessDetailText: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  blogDate: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    marginTop: 8,
  },
});

export default DiscoverListScreen;

