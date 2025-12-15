import React, { useLayoutEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { useUser } from '../../packages/context/UserContext';
import { impactLight } from '../../packages/utils/haptics';

import PartnerIcon from '../../../assets/icons/partner.svg';

const ReferHostScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user } = useUser();

  const [selectedType, setSelectedType] = useState('car');

  const referralCode = useMemo(() => {
    if (user?.email) {
      const emailPrefix = user.email.split('@')[0].substring(0, 3).toUpperCase();
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      return `${emailPrefix}${randomNum}`;
    }
    return `REF${Math.floor(10000 + Math.random() * 90000)}`;
  }, [user?.email]);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      const tabNavigator = navigation.getParent()?.getParent?.() ?? navigation.getParent();

      tabNavigator?.setOptions({
        tabBarStyle: { display: 'none' },
      });

      return () => {
        tabNavigator?.setOptions({
          tabBarStyle: undefined,
        });
      };
    }, [navigation])
  );

  const handleCopyReferralLink = async () => {
    try {
      try {
        impactLight();
      } catch {
        // no-op
      }
      const referralLink = `https://oparides.app/host?ref=${referralCode}&type=${selectedType}`;
      await Share.share({
        message: `Join Oparides as a host using my referral link: ${referralLink}`,
        title: 'Refer a host',
        url: referralLink,
      });
    } catch (e) {
      Alert.alert('Error', 'Failed to share referral link');
    }
  };

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

        <TouchableOpacity
          style={[styles.referralsPill, { backgroundColor: theme.colors.white }]}
          onPress={() => navigation.navigate('YourReferrals')}
          activeOpacity={0.85}
        >
          <Text style={[styles.referralsText, { color: theme.colors.textPrimary }]}>Your referrals</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pageBody}>
          <View>
            <View style={styles.heroArtWrap}>
              <PartnerIcon width={240} height={170} />
            </View>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Refer a host,{`\n`}earn a cash reward</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>What type of host are you referring?</Text>

            <View style={styles.optionsWrap}>
            
            <TouchableOpacity
              style={[
                styles.optionCard,
                { backgroundColor: theme.colors.white, borderColor: theme.colors.hint + '40' },
                selectedType === 'car' ? { borderColor: theme.colors.textPrimary } : null,
              ]}
              onPress={() => setSelectedType('car')}
              activeOpacity={0.85}
            >
              <View style={styles.optionLeft}>
                <Text style={[styles.optionTitle, { color: theme.colors.textPrimary }]}>Car</Text>
                <Text style={[styles.optionMeta, { color: theme.colors.textSecondary }]}>Earn rewards when they list a car.</Text>
              </View>
              <Ionicons name="car-sport-outline" size={34} color={theme.colors.textPrimary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionCard,
                { backgroundColor: theme.colors.white, borderColor: theme.colors.hint + '40' },
                selectedType === 'service' ? { borderColor: theme.colors.textPrimary } : null,
              ]}
              onPress={() => setSelectedType('service')}
              activeOpacity={0.85}
            >
              <View style={styles.optionLeft}>
                <Text style={[styles.optionTitle, { color: theme.colors.textPrimary }]}>Service</Text>
                <Text style={[styles.optionMeta, { color: theme.colors.textSecondary }]}>Earn rewards when they list a service.</Text>
              </View>
              <Ionicons name="briefcase-outline" size={32} color={theme.colors.textPrimary} />
            </TouchableOpacity>

            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.howLink}
              onPress={() => navigation.navigate('HowHostReferralsWork')}
            >
              <Text style={[styles.howLinkText, { color: theme.colors.textSecondary }]}>How host referrals work</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomBlock}>
            <TouchableOpacity
              style={[styles.ctaButton, { backgroundColor: '#FF1577' }]}
              onPress={handleCopyReferralLink}
              activeOpacity={0.9}
            >
              <Text style={[styles.ctaText, { color: theme.colors.white }]}>Copy referral link</Text>
            </TouchableOpacity>

            <Text style={[styles.termsText, { color: theme.colors.textSecondary }]}>Eligible locations and listing types only. Terms apply.</Text>
          </View>
        </View>
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
    justifyContent: 'space-between',
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
  headerSpacer: {
    flex: 1,
  },
  referralsPill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  referralsText: {
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 18,
    flexGrow: 1,
  },
  pageBody: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  heroArtWrap: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 8,
  },
  optionsWrap: {
    marginTop: 10,
  },
  title: {
    fontSize: 30,
    fontFamily: 'Nunito_700Bold',
    textAlign: 'center',
    letterSpacing: -0.6,
    lineHeight: 36,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    marginBottom: 24,
  },
  optionCard: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  optionLeft: {
    flex: 1,
    paddingRight: 14,
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  optionMeta: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 18,
  },
  howLink: {
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 18,
  },
  bottomBlock: {
    paddingTop: 6,
  },
  howLinkText: {
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
    textDecorationLine: 'underline',
  },
  ctaButton: {
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  ctaText: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  termsText: {
    fontSize: 11,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default ReferHostScreen;
