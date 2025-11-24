import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../packages/theme/ThemeProvider';

const OwnerHomeScreen = () => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
        Owner Dashboard
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Manage your cars and bookings
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

export default OwnerHomeScreen;

