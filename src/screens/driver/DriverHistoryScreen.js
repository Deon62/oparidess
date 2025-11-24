import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../packages/theme/ThemeProvider';

const DriverHistoryScreen = () => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
        Ride History
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
  },
});

export default DriverHistoryScreen;

