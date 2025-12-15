import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Card } from '../../packages/components';

const OpaPremiumScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const monthlyAccentColor = theme.colors.primary;
  const [selectedPlanId, setSelectedPlanId] = useState('free');

  const handleSelectPlan = (plan) => {
    if (plan.id === 'free') return;

    navigation.navigate('SubscriptionCheckout', {
      planId: plan.id,
      planTitle: plan.title,
      amount: plan.amount,
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: 'none' },
      });
      StatusBar.setHidden(false);
      StatusBar.setBarStyle('dark-content');
      return () => {
        // Tab bar restored on unmount
      };
    }, [])
  );

  useEffect(() => {
    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
    };
  }, [navigation]);

  const freeFeatures = useMemo(
    () => [
      'Basic browsing & discovery',
      'Save cars to wishlist',
      'Standard support',
      'Pay per booking',
    ],
    []
  );

  const monthlyFeatures = useMemo(
    () => [
      '1 car of choice (Essential category)',
      'Up to 25 days usage',
      'Insurance included',
      'Zero booking fees',
      'Basic maintenance covered',
      'Swap car once per month',
      'Pay nothing else',
    ],
    []
  );

  const plusFeatures = useMemo(
    () => [
      'Any car (Executive / Signature)',
      'Up to 25–30 days usage',
      'Full insurance',
      'Free delivery & pickup',
      'Priority support',
      'Unlimited swaps (fair use)',
      'Replacement car if breakdown happens',
      'Everything covered',
    ],
    []
  );

  const plans = useMemo(
    () => [
      {
        id: 'free',
        title: 'Free Plan',
        price: 'KES 0',
        unit: '/ month',
        amount: 0,
        features: freeFeatures,
        isPremium: false,
        cardStyle: { backgroundColor: theme.colors.white },
        priceColor: theme.colors.textPrimary,
        buttonStyle: { backgroundColor: theme.colors.primary },
        buttonTextStyle: { color: theme.colors.white },
      },
      {
        id: 'classic',
        title: 'Classic Plan',
        price: 'KES 85,000',
        unit: '/ month',
        amount: 85000,
        features: monthlyFeatures,
        isPremium: true,
        cardStyle: { backgroundColor: theme.colors.primary, shadowColor: theme.colors.primary },
        priceColor: theme.colors.white,
        buttonStyle: { backgroundColor: theme.colors.white },
        buttonTextStyle: { color: theme.colors.primary },
      },
      {
        id: 'premier',
        title: 'Premier Plan',
        price: 'KES 135,000',
        unit: '/ month',
        amount: 135000,
        features: plusFeatures,
        isPremium: false,
        cardStyle: { backgroundColor: theme.colors.white },
        priceColor: monthlyAccentColor,
        buttonStyle: { backgroundColor: monthlyAccentColor },
        buttonTextStyle: { color: theme.colors.white },
        badgeText: 'Recommended',
      },
    ],
    [
      freeFeatures,
      monthlyFeatures,
      monthlyAccentColor,
      plusFeatures,
      theme.colors.primary,
      theme.colors.textPrimary,
      theme.colors.white,
    ]
  );

  const FeatureItem = ({ index, text, isPremium }) => (
    <View style={styles.featureItem}>
      <Text style={[styles.featureIndex, { color: isPremium ? '#FFFFFF' : monthlyAccentColor }]}>
        {index + 1}.
      </Text>
      <Text style={[styles.featureText, { color: isPremium ? '#FFFFFF' : theme.colors.textSecondary }]}>
        {text}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <TouchableOpacity
        style={[styles.floatingBackButton, { backgroundColor: theme.colors.white, top: insets.top + 10 }]}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
      </TouchableOpacity>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <Text style={[styles.pageTitle, { color: theme.colors.textPrimary }]}>Choose your plan</Text>

        {plans.map((plan) => {
          const isSelected = selectedPlanId === plan.id;

          return (
            <Card key={plan.id} style={[styles.planCard, plan.cardStyle]}>
              {!!plan.badgeText && (
                <View style={[styles.popularBadge, !plan.isPremium ? styles.popularBadgeLight : null]}>
                  <Text style={[styles.popularText, !plan.isPremium ? styles.popularTextLight : null]}>
                    {plan.badgeText}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.selectRow}
                onPress={() => setSelectedPlanId(plan.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.planName, plan.isPremium ? styles.premiumText : { color: theme.colors.textPrimary }]}>
                  {plan.title}
                </Text>
                <Ionicons
                  name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                  size={22}
                  color={plan.isPremium ? '#FFFFFF' : monthlyAccentColor}
                />
              </TouchableOpacity>

              <View style={styles.priceRow}>
                <Text
                  style={[
                    styles.priceValue,
                    plan.isPremium ? styles.premiumText : null,
                    { color: plan.priceColor },
                  ]}
                >
                  {plan.price}
                </Text>
                <Text
                  style={[
                    styles.priceUnit,
                    plan.isPremium ? styles.premiumText : null,
                    { color: plan.isPremium ? '#FFFFFF' : theme.colors.textSecondary },
                  ]}
                >
                  {plan.unit}
                </Text>
              </View>

              <View style={[styles.divider, plan.isPremium ? styles.dividerWhite : null]} />

              <View style={styles.featuresContainer}>
                {plan.features.map((item, index) => (
                  <FeatureItem key={item} index={index} text={item} isPremium={plan.isPremium} />
                ))}
              </View>

              <TouchableOpacity
                style={[styles.getPlanButton, plan.buttonStyle]}
                onPress={() => handleSelectPlan(plan)}
                activeOpacity={0.85}
                disabled={plan.id === 'free'}
              >
                <Text style={[styles.getPlanButtonText, plan.buttonTextStyle]}>
                  {plan.id === 'free' ? 'Current Plan' : 'Select Plan'}
                </Text>
              </TouchableOpacity>
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingBackButton: {
    position: 'absolute',
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 92,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 28,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  planCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  premiumCard: {
    shadowOpacity: 0.25,
  },
  popularBadge: {
    position: 'absolute',
    top: 24,
    right: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  popularBadgeLight: {
    backgroundColor: 'rgba(10, 29, 55, 0.08)',
  },
  popularText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Nunito_700Bold',
    letterSpacing: 0.5,
  },
  popularTextLight: {
    color: '#0A1D37',
  },
  planHeader: {
    marginBottom: 12,
  },
  planName: {
    fontSize: 22,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  selectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  premiumText: {
    color: '#FFFFFF',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 14,
  },
  priceValue: {
    fontSize: 32,
    fontFamily: 'Nunito_700Bold',
    letterSpacing: -0.5,
  },
  priceUnit: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    paddingBottom: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginBottom: 14,
  },
  dividerWhite: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  featuresContainer: {
    gap: 10,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  featureIndex: {
    width: 22,
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    lineHeight: 22,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 22,
  },
  getPlanButton: {
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  getPlanButtonPremium: {
    backgroundColor: '#FFFFFF',
  },
  getPlanButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});

export default OpaPremiumScreen;