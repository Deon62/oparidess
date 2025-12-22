import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.emptyState}>
        <DiscoverIcon width={240} height={240} />
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Discover</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Coming soon! Explore exciting destinations and experiences.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Nunito_700Bold',
    marginTop: 16,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default DiscoverListScreen;

