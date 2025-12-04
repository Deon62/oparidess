import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useTheme } from '../../packages/theme/ThemeProvider';

const OpaHostAppScreen = () => {
  const theme = useTheme();

  const handleDownloadApp = () => {
    // TODO: Replace with actual app store/download link
    const downloadUrl = 'https://play.google.com/store/apps'; // Placeholder
    Linking.openURL(downloadUrl).catch(err => {
      console.error('Failed to open download link:', err);
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <TouchableOpacity
          style={[styles.downloadButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleDownloadApp}
          activeOpacity={0.8}
        >
          <Text style={[styles.downloadButtonText, { color: theme.colors.white }]}>
            Download Opa Host App
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  downloadButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
});

export default OpaHostAppScreen;

