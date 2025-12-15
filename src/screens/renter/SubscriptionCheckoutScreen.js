import React, { useLayoutEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../packages/theme/ThemeProvider';

import FreeIcon from '../../../assets/icons/free.svg';
import ClassicIcon from '../../../assets/icons/classic.svg';
import PremierIcon from '../../../assets/icons/premier.svg';

const SubscriptionCheckoutScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const planId = route.params?.planId ?? 'classic';
  const planTitle = route.params?.planTitle ?? 'Classic Plan';
  const planSubtitle = route.params?.planSubtitle ?? 'Seamless car subscriptions';
  const amount = route.params?.amount ?? 85_000;

  const tax = useMemo(() => Math.round(amount * 0.02), [amount]);
  const total = useMemo(() => amount + tax, [amount, tax]);

  const PlanIcon = useMemo(() => {
    switch (planId) {
      case 'free':
        return FreeIcon;
      case 'premier':
        return PremierIcon;
      case 'classic':
      default:
        return ClassicIcon;
    }
  }, [planId]);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const formatKes = (value) => {
    try {
      return `KES ${Number(value).toLocaleString('en-KE')}`;
    } catch {
      return `KES ${value}`;
    }
  };

  const handleSubscribe = () => {
    // Placeholder for payment flow
    navigation.goBack();
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

        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>Subscription</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.planTop}>
          <View style={[styles.planIconWrap, { backgroundColor: theme.colors.white }]}> 
            <PlanIcon width={64} height={64} />
          </View>
          <Text style={[styles.planTitle, { color: theme.colors.textPrimary }]}>{planTitle}</Text>
          <Text style={[styles.planSubtitle, { color: theme.colors.textSecondary }]}>{planSubtitle}</Text>
        </View>

        <View style={styles.cardMock}>
          <View style={styles.cardTopRow}>
            <Text style={styles.cardBrand}>MASTER CARD</Text>
            <View style={styles.cardDots}>
              <View style={[styles.dot, { backgroundColor: '#EB001B' }]} />
              <View style={[styles.dot, { backgroundColor: '#F79E1B', marginLeft: -8 }]} />
            </View>
          </View>

          <Text style={styles.cardNumber}>5156  2402  5337  7173</Text>

          <View style={styles.cardBottomRow}>
            <View>
              <Text style={styles.cardLabel}>CARD HOLDER</Text>
              <Text style={styles.cardValue}>JANE FOX</Text>
            </View>
            <View>
              <Text style={styles.cardLabel}>EXPIRES</Text>
              <Text style={styles.cardValue}>09/28</Text>
            </View>
          </View>
        </View>

        <View style={[styles.summary, { backgroundColor: theme.colors.white }]}> 
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Amount</Text>
            <Text style={[styles.summaryValue, { color: theme.colors.textPrimary }]}>{formatKes(amount)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Tax</Text>
            <Text style={[styles.summaryValue, { color: theme.colors.textPrimary }]}>{formatKes(tax)}</Text>
          </View>

          <View style={[styles.summaryDivider, { backgroundColor: '#EFEFEF' }]} />

          <View style={styles.summaryRow}>
            <Text style={[styles.summaryTotalLabel, { color: theme.colors.textPrimary }]}>Total</Text>
            <Text style={[styles.summaryTotalValue, { color: theme.colors.textPrimary }]}>{formatKes(total)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.ctaButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleSubscribe}
          activeOpacity={0.9}
        >
          <Text style={[styles.ctaText, { color: theme.colors.white }]}>Get Subscription</Text>
        </TouchableOpacity>
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
    width: 40,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  planTop: {
    alignItems: 'center',
    marginBottom: 18,
  },
  planIconWrap: {
    width: 86,
    height: 86,
    borderRadius: 43,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(10, 29, 55, 0.08)',
  },
  planTitle: {
    fontSize: 22,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  planSubtitle: {
    fontSize: 13,
    fontFamily: 'Nunito_400Regular',
  },
  cardMock: {
    backgroundColor: '#0B0F17',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 6,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardBrand: {
    color: '#FFFFFF',
    fontSize: 12,
    letterSpacing: 0.6,
    fontFamily: 'Nunito_700Bold',
    opacity: 0.9,
  },
  cardDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  cardNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    letterSpacing: 1,
    marginBottom: 18,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 10,
    fontFamily: 'Nunito_700Bold',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  cardValue: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
  },
  summary: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 13,
    fontFamily: 'Nunito_400Regular',
  },
  summaryValue: {
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
  },
  summaryDivider: {
    height: 1,
    marginVertical: 10,
  },
  summaryTotalLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  summaryTotalValue: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  ctaButton: {
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    letterSpacing: 0.2,
  },
});

export default SubscriptionCheckoutScreen;
