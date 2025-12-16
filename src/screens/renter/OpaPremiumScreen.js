import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView, Dimensions } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Card } from '../../packages/components';

const { height: WINDOW_HEIGHT } = Dimensions.get('window');
const CARD_MIN_HEIGHT = Math.round(WINDOW_HEIGHT * 0.72);

const OpaPremiumScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [selectedPlanId, setSelectedPlanId] = useState('classic');

  const handleSelectPlan = (plan) => {
    setSelectedPlanId(plan.id);
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
        id: 'classic',
        title: 'Classic Plan',
        description:
          'Perfect for everyday driving with predictable monthly costs. Get an essential car, insurance included, and zero booking fees. Simple, flexible, and easy to manage.',
        price: 'KES 85,000',
        originalPrice: 'KES 120,000',
        unit: '/ month',
        amount: 85000,
        features: monthlyFeatures,
        cardStyle: { backgroundColor: '#FFFFFF', shadowColor: '#0B1B3A' },
        priceColor: '#0B1B3A',
        buttonStyle: { backgroundColor: '#FF1577' },
        buttonTextStyle: { color: theme.colors.white },
      },
      {
        id: 'premier',
        title: 'Premier Plan',
        description:
          'For premium access with extra comfort and priority support. Enjoy executive cars, delivery & pickup, and more flexibility. Built for members who want the best experience.',
        price: 'KES 135,000',
        originalPrice: 'KES 180,000',
        unit: '/ month',
        amount: 135000,
        features: plusFeatures,
        cardStyle: { backgroundColor: '#FFFFFF', shadowColor: '#0B1B3A' },
        priceColor: '#0B1B3A',
        buttonStyle: { backgroundColor: '#FF1577' },
        buttonTextStyle: { color: theme.colors.white },
        badgeText: 'Recommended',
      },
    ],
    [
      monthlyFeatures,
      plusFeatures,
      theme.colors.textPrimary,
      theme.colors.white,
    ]
  );

  const selectedPlan = useMemo(() => plans.find((p) => p.id === selectedPlanId) ?? plans[0], [plans, selectedPlanId]);

  return (
    <View style={[styles.container, { backgroundColor: '#F6F7FB' }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <TouchableOpacity
        style={[styles.floatingBackButton, { backgroundColor: theme.colors.white, top: insets.top + 10 }]}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={[styles.pageTitle, { color: theme.colors.textPrimary }]}>Pricing</Text>
          <View style={styles.planToggleWrap}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setSelectedPlanId('classic')}
              style={[
                styles.planTogglePill,
                selectedPlanId === 'classic' ? styles.planTogglePillActive : null,
              ]}
            >
              <Text
                style={[
                  styles.planToggleText,
                  selectedPlanId === 'classic' ? styles.planToggleTextActive : null,
                ]}
              >
                Classic
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setSelectedPlanId('premier')}
              style={[
                styles.planTogglePill,
                selectedPlanId === 'premier' ? styles.planTogglePillActive : null,
              ]}
            >
              <Text
                style={[
                  styles.planToggleText,
                  selectedPlanId === 'premier' ? styles.planToggleTextActive : null,
                ]}
              >
                Premier
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Card style={[styles.planCard, selectedPlan.cardStyle]}>
          <View style={styles.planCardInner}>
            <View style={styles.selectRow}>
              <Text style={[styles.planName, { color: '#0B1B3A' }]}>{selectedPlan.title}</Text>
              {!!selectedPlan.badgeText && (
                <View style={styles.popularBadgePremium}>
                  <Text style={styles.popularText}>{selectedPlan.badgeText}</Text>
                </View>
              )}
            </View>

            <Text style={styles.planDescription}>{selectedPlan.description}</Text>

            <View style={styles.priceRow}>
              <View style={styles.priceStack}>
                <Text style={styles.oldPriceText}>{selectedPlan.originalPrice}</Text>
                <Text style={[styles.priceValue, { color: selectedPlan.priceColor }]}>
                  {selectedPlan.price}
                </Text>
              </View>
              <Text style={[styles.priceUnit, { color: 'rgba(11, 27, 58, 0.7)' }]}>
                {selectedPlan.unit}
              </Text>
            </View>

            <View style={styles.cardDivider} />

            <View style={styles.featuresContainer}>
              {selectedPlan.features.map((item, index) => (
                <View key={item} style={styles.featureItemPremium}>
                  <Text style={styles.featureIndex}>{index + 1}.</Text>
                  <Text style={styles.featureTextPremium}>{item}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity activeOpacity={0.9} onPress={() => handleSelectPlan(selectedPlan)}>
              <View style={[styles.getPlanButton, selectedPlan.buttonStyle]}>
                <Text style={[styles.getPlanButtonText, selectedPlan.buttonTextStyle]}>Upgrade</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Card>
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
    paddingBottom: 28,
    flexGrow: 1,
  },
  hero: {
    marginBottom: 18,
    flexDirection: 'column',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 28,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 0,
    letterSpacing: -0.5,
  },
  planToggleWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    borderRadius: 999,
    backgroundColor: '#EEF1F6',
    borderWidth: 1,
    borderColor: 'rgba(11, 27, 58, 0.08)',
    width: 210,
    marginTop: 12,
  },
  planTogglePill: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    width: 98,
    alignItems: 'center',
  },
  planTogglePillActive: {
    backgroundColor: '#0B1B3A',
  },
  planToggleText: {
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
    letterSpacing: 0.2,
    color: 'rgba(11, 27, 58, 0.7)',
  },
  planToggleTextActive: {
    color: '#FFFFFF',
  },
  planCard: {
    flex: 1,
    minHeight: CARD_MIN_HEIGHT,
    borderRadius: 20,
    padding: 20,
    marginBottom: 0,
    shadowColor: '#0B1B3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(11, 27, 58, 0.08)',
  },
  planCardInner: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 6,
  },
  popularBadgePremium: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(11, 27, 58, 0.06)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(11, 27, 58, 0.12)',
  },
  popularText: {
    fontSize: 11,
    fontFamily: 'Nunito_700Bold',
    letterSpacing: 0.5,
    color: '#0B1B3A',
  },
  planName: {
    fontSize: 22,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  planDescription: {
    fontSize: 13,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
    color: 'rgba(11, 27, 58, 0.72)',
    marginBottom: 12,
  },
  selectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    marginTop: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 14,
  },
  priceStack: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  oldPriceText: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    color: 'rgba(11, 27, 58, 0.45)',
    textDecorationLine: 'line-through',
    marginBottom: 2,
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
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(11, 27, 58, 0.1)',
    marginBottom: 14,
  },
  featuresContainer: {
    gap: 10,
    marginBottom: 18,
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  featureItemPremium: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureIndex: {
    width: 22,
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
    color: 'rgba(11, 27, 58, 0.9)',
  },
  featureTextPremium: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 22,
    color: 'rgba(11, 27, 58, 0.75)',
  },
  getPlanButton: {
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0B1B3A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  getPlanButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});

export default OpaPremiumScreen;