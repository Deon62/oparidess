import React, { useLayoutEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../packages/theme/ThemeProvider';

const SubscriptionCheckoutScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const planId = route.params?.planId ?? 'classic';
  const planTitle = route.params?.planTitle ?? 'Classic Plan';
  const planSubtitle = route.params?.planSubtitle ?? 'Seamless car subscriptions';
  const amount = route.params?.amount ?? 85_000;

  const [paymentMethod, setPaymentMethod] = useState('card');

  const tax = useMemo(() => Math.round(amount * 0.02), [amount]);
  const total = useMemo(() => amount + tax, [amount, tax]);

  const ribbonIconName = useMemo(() => {
    if (planId === 'free') return 'ribbon-outline';
    return 'ribbon';
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
          <Ionicons name={ribbonIconName} size={74} color={theme.colors.primary} style={styles.ribbonIcon} />
          <Text style={[styles.planTitle, { color: theme.colors.textPrimary }]}>{planTitle}</Text>
          <Text style={[styles.planSubtitle, { color: theme.colors.textSecondary }]}>{planSubtitle}</Text>
        </View>

        <View style={[styles.methodSwitch, { backgroundColor: theme.colors.white }]}> 
          <TouchableOpacity
            style={[styles.methodPill, paymentMethod === 'card' ? { backgroundColor: theme.colors.primary } : null]}
            onPress={() => setPaymentMethod('card')}
            activeOpacity={0.85}
          >
            <Text style={[styles.methodText, { color: paymentMethod === 'card' ? theme.colors.white : theme.colors.textPrimary }]}>Card</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.methodPill, paymentMethod === 'mpesa' ? { backgroundColor: theme.colors.primary } : null]}
            onPress={() => setPaymentMethod('mpesa')}
            activeOpacity={0.85}
          >
            <Text style={[styles.methodText, { color: paymentMethod === 'mpesa' ? theme.colors.white : theme.colors.textPrimary }]}>M-Pesa</Text>
          </TouchableOpacity>
        </View>

        {paymentMethod === 'card' ? (
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
        ) : (
          <View style={[styles.mpesaPanel, { backgroundColor: theme.colors.white }]}>
            <View style={styles.mpesaTopRow}>
              <View style={styles.mpesaBadge}>
                <Text style={styles.mpesaBadgeText}>M-PESA</Text>
              </View>
              <Ionicons name="phone-portrait-outline" size={18} color={theme.colors.textPrimary} />
            </View>

            <Text style={[styles.mpesaTitle, { color: theme.colors.textPrimary }]}>Pay with M-Pesa</Text>
            <Text style={[styles.mpesaHint, { color: theme.colors.textSecondary }]}>You’ll receive an STK push to complete payment.</Text>

            <View style={styles.mpesaRow}>
              <Text style={[styles.mpesaRowLabel, { color: theme.colors.textSecondary }]}>Phone number</Text>
              <Text style={[styles.mpesaRowValue, { color: theme.colors.textPrimary }]}>+254 7XX XXX XXX</Text>
            </View>
            <View style={styles.mpesaRow}>
              <Text style={[styles.mpesaRowLabel, { color: theme.colors.textSecondary }]}>Business name</Text>
              <Text style={[styles.mpesaRowValue, { color: theme.colors.textPrimary }]}>OPA Rides</Text>
            </View>
          </View>
        )}

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
  ribbonIcon: {
    marginBottom: 8,
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
  methodSwitch: {
    flexDirection: 'row',
    padding: 6,
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  methodPill: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodText: {
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
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
  mpesaPanel: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  mpesaTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  mpesaBadge: {
    backgroundColor: 'rgba(0, 128, 0, 0.10)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  mpesaBadgeText: {
    color: '#0B6B3A',
    fontSize: 11,
    fontFamily: 'Nunito_700Bold',
    letterSpacing: 0.4,
  },
  mpesaTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  mpesaHint: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 12,
    lineHeight: 18,
  },
  mpesaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  mpesaRowLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  mpesaRowValue: {
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
