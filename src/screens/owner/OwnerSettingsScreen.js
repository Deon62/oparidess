import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../packages/theme/ThemeProvider';

const OwnerSettingsScreen = () => {
  const theme = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
        Settings
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Manage your account settings and preferences
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
  },
});

export default OwnerSettingsScreen;

