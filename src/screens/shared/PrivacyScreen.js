import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';

const PrivacyScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  // Hide bottom tab bar when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: 'none' },
      });
      return () => {
        // Restore tab bar when leaving this screen
      };
    }, [navigation])
  );

  // Restore tab bar when component unmounts (navigating away completely)
  useEffect(() => {
    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
    };
  }, [navigation]);

  const handleDownloadData = () => {
    Alert.alert(
      'Download My Data',
      'Your data will be prepared and sent to your registered email address. This may take a few minutes.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Download',
          onPress: () => {
            // TODO: Implement data download
            Alert.alert('Success', 'Your data download request has been submitted. You will receive an email shortly.');
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleDownloadData}
          activeOpacity={0.7}
        >
          <View style={styles.actionButtonLeft}>
            <Ionicons name="download-outline" size={22} color={theme.colors.primary} />
            <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>
              Download My Data
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.hint} />
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={[styles.infoTitle, { color: theme.colors.textPrimary }]}>
          Privacy Policy
        </Text>
        <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
          We are committed to protecting your privacy. Your personal information is securely stored and only used to provide you with the best service experience.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  actionButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  infoSection: {
    paddingHorizontal: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 22,
  },
});

export default PrivacyScreen;

