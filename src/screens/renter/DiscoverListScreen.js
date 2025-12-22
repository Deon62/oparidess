import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';

// Import SVG icons
import DiscoverIcon from '../../../assets/icons/discover.svg';

const DiscoverListScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Discover',
      headerStyle: {
        backgroundColor: theme.colors.background,
      },
      headerTintColor: theme.colors.textPrimary,
    });
  }, [navigation, theme]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <View style={styles.card}>
          <DiscoverIcon width={260} height={200} style={styles.bgSvg} />
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Discover</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Coming soon</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    minHeight: 220,
  },
  bgSvg: {
    position: 'absolute',
    top: -10,
    right: -40,
    opacity: 0.12,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    marginTop: 6,
  },
});

export default DiscoverListScreen;

