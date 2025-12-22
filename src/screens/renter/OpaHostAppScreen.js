import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';

const hostImage = require('../../../assets/images/host.png');

const OpaHostAppScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  // Hide bottom tab bar when screen is focused
  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: 'none' },
      });
      return () => {
        navigation.getParent()?.setOptions({
          tabBarStyle: undefined,
        });
      };
    }, [navigation])
  );

  const handleLearnMore = () => {
    const url = 'https://opa.deonhq.xyz';
    Linking.openURL(url).catch((err) => {
      console.error('Failed to open learn more link:', err);
    });
  };

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
        <View style={styles.hostCard}>
          <View style={styles.hostCardLeft}>
            <Text style={[styles.hostTitle, { color: theme.colors.textPrimary }]}>Become a host</Text>
            <Text style={[styles.hostDesc, { color: theme.colors.textSecondary }]}>
              Join thousands of hosts building businesses and earning meaningful income on Opa.
            </Text>
            <TouchableOpacity
              onPress={handleLearnMore}
              activeOpacity={0.9}
            >
              <Text style={styles.learnMoreLink}>Learn more</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.hostCardRight}>
            <Image source={hostImage} style={styles.hostImage} resizeMode="cover" />
          </View>
        </View>

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
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  hostCard: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    marginBottom: 18,
    height: 180,
  },
  hostCardLeft: {
    flex: 1,
    padding: 14,
    justifyContent: 'center',
  },
  hostTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 6,
  },
  hostDesc: {
    fontSize: 13,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 18,
    marginBottom: 10,
  },
  learnMoreLink: {
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
    color: '#0B1B3A',
    textDecorationLine: 'underline',
  },
  hostCardRight: {
    width: 124,
    backgroundColor: '#F2F4F8',
  },
  hostImage: {
    width: '100%',
    height: '100%',
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

