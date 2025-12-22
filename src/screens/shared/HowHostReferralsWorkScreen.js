import React, { useLayoutEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../packages/theme/ThemeProvider';

const HowHostReferralsWorkScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // Hide tab bar whenever this screen is focused
  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      parent?.setOptions({ tabBarStyle: { display: 'none' } });
      // Don't restore - parent screen will handle it
    }, [navigation])
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}> 
        <TouchableOpacity
          style={[styles.headerBack, { backgroundColor: theme.colors.white }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>How host referrals work</Text>

        <View style={styles.stepsContainer}>
          <View style={styles.stepRow}>
            <Text style={[styles.stepNumber, { color: theme.colors.textPrimary }]}>1.</Text>
            <View style={styles.stepTextWrap}>
              <Text style={[styles.stepTitle, { color: theme.colors.textPrimary }]}>Share your referral link</Text>
              <Text style={[styles.stepDesc, { color: theme.colors.textSecondary }]}>Send the link to the host you're inviting.</Text>
            </View>
          </View>

          <View style={styles.stepRow}>
            <Text style={[styles.stepNumber, { color: theme.colors.textPrimary }]}>2.</Text>
            <View style={styles.stepTextWrap}>
              <Text style={[styles.stepTitle, { color: theme.colors.textPrimary }]}>They sign up</Text>
              <Text style={[styles.stepDesc, { color: theme.colors.textSecondary }]}>The host signs up and completes their listing.</Text>
            </View>
          </View>

          <View style={styles.stepRow}>
            <Text style={[styles.stepNumber, { color: theme.colors.textPrimary }]}>3.</Text>
            <View style={styles.stepTextWrap}>
              <Text style={[styles.stepTitle, { color: theme.colors.textPrimary }]}>Verification</Text>
              <Text style={[styles.stepDesc, { color: theme.colors.textSecondary }]}>Opa verifies and approves the listing.</Text>
            </View>
          </View>

          <View style={styles.stepRow}>
            <Text style={[styles.stepNumber, { color: theme.colors.textPrimary }]}>4.</Text>
            <View style={styles.stepTextWrap}>
              <Text style={[styles.stepTitle, { color: theme.colors.textPrimary }]}>Get rewarded</Text>
              <Text style={[styles.stepDesc, { color: theme.colors.textSecondary }]}>Rewards credited after verification.</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.noteText, { color: theme.colors.textSecondary }]}>
          Rewards depend on host category and location.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBack: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  headerSpacer: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 6,
  },
  stepsContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 10,
  },
  stepNumber: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    marginTop: 1,
  },
  stepTextWrap: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 2,
  },
  stepDesc: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 18,
  },
  noteText: {
    fontSize: 13,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 18,
    textAlign: 'center',
  },
});

export default HowHostReferralsWorkScreen;
