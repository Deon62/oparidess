import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useUser } from '../context/UserContext';
import { useTheme } from '../theme/ThemeProvider';

import AuthNavigator from './AuthNavigator';
import RenterNavigator from './RenterNavigator';
import OwnerNavigator from './OwnerNavigator';

const MainNavigator = () => {
  const { isAuthenticated, userType, isLoading } = useUser();
  const theme = useTheme();

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Route to appropriate navigator based on authentication and user type
  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  switch (userType) {
    case 'renter':
      return <RenterNavigator />;
    case 'owner':
      return <OwnerNavigator />;
    default:
      return <AuthNavigator />;
  }
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainNavigator;
