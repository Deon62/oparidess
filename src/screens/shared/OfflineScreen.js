import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const OfflineScreen = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '15' }]}>
          <Ionicons 
            name="cloud-offline-outline" 
            size={80} 
            color={theme.colors.primary} 
          />
        </View>
        
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          No Internet Connection
        </Text>
        
        <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
          Please check your internet connection and try again.
        </Text>
        
        <View style={styles.hintContainer}>
          <Ionicons 
            name="information-circle-outline" 
            size={20} 
            color={theme.colors.hint} 
            style={styles.hintIcon}
          />
          <Text style={[styles.hint, { color: theme.colors.hint }]}>
            Make sure Wi-Fi or mobile data is turned on
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
    maxWidth: 320,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Nunito_600SemiBold',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  hintIcon: {
    marginRight: 8,
  },
  hint: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    flex: 1,
  },
});

export default OfflineScreen;

