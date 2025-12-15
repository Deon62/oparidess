import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useWishlist } from '../../packages/context/WishlistContext';

const RecentlyViewedScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { recentlyViewed } = useWishlist();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Recently viewed',
    });
  }, [navigation]);

  const handleOpenItem = (item) => {
    if (item.type === 'car') {
      if (item.payload) {
        navigation.navigate('CarDetails', { car: item.payload });
      }
      return;
    }

    if (item.type === 'service') {
      if (item.payload) {
        navigation.navigate('ServiceDetails', { service: item.payload, category: item.payload.category });
      }
      return;
    }

    navigation.navigate('ComingSoon');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {recentlyViewed.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="time-outline" size={40} color={theme.colors.hint} />
            <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>Nothing yet</Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>Items you view will show up here.</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {recentlyViewed.map((item) => {
              const title = item.title || item.name || 'Viewed item';
              const imageUri = item.imageUri || item.image;
              return (
                <TouchableOpacity
                  key={`${item.type}:${item.id}`}
                  style={[styles.row, { backgroundColor: theme.colors.white }]}
                  activeOpacity={0.85}
                  onPress={() => handleOpenItem(item)}
                >
                  <View style={styles.thumb}>
                    {imageUri ? (
                      <Image source={typeof imageUri === 'string' ? { uri: imageUri } : imageUri} style={styles.thumbImg} resizeMode="cover" />
                    ) : (
                      <View style={[styles.thumbFallback, { backgroundColor: theme.colors.hint + '25' }]}>
                        <Ionicons name="image-outline" size={18} color={theme.colors.hint} />
                      </View>
                    )}
                  </View>
                  <View style={styles.rowText}>
                    <Text style={[styles.rowTitle, { color: theme.colors.textPrimary }]} numberOfLines={1}>
                      {title}
                    </Text>
                    <Text style={[styles.rowSubtitle, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                      {item.type === 'car' ? 'Car' : item.type === 'service' ? 'Service' : 'Discover'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={theme.colors.hint} />
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 18, paddingBottom: 24 },
  empty: { alignItems: 'center', paddingTop: 40 },
  emptyTitle: { fontSize: 18, fontFamily: 'Nunito_700Bold', marginTop: 10 },
  emptySubtitle: { fontSize: 13, fontFamily: 'Nunito_400Regular', marginTop: 6, textAlign: 'center' },
  list: { gap: 12, paddingTop: 10 },
  row: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 12, gap: 12 },
  thumb: { width: 56, height: 56, borderRadius: 14, overflow: 'hidden' },
  thumbImg: { width: '100%', height: '100%' },
  thumbFallback: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 14, fontFamily: 'Nunito_700Bold' },
  rowSubtitle: { fontSize: 12, fontFamily: 'Nunito_400Regular', marginTop: 2 },
});

export default RecentlyViewedScreen;
