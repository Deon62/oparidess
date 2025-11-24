import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../packages/theme/ThemeProvider';

const RenterHomeScreen = () => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
        Renter Home
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Browse available cars to rent
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
  },
});

export default RenterHomeScreen;

