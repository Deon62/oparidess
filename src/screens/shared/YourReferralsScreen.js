import React, { useLayoutEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../packages/theme/ThemeProvider';

import ReferralsIcon from '../../../assets/icons/refferals.svg';

const YourReferralsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const referrals = useMemo(() => [], []);

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

  const formatKes = (value) => {
    try {
      return `KES ${Number(value).toLocaleString('en-KE')}`;
    } catch {
      return `KES ${value}`;
    }
  };

  const totalEarned = useMemo(() => {
    return referrals
      .filter((r) => r.status === 'Completed')
      .reduce((sum, r) => sum + (Number(r.reward) || 0), 0);
  }, [referrals]);

  const getStatusStyle = (status) => {
    if (status === 'Completed') {
      return {
        bg: 'rgba(76, 175, 80, 0.12)',
        fg: '#2E7D32',
        icon: 'checkmark-circle',
      };
    }

    if (status === 'Pending') {
      return {
        bg: 'rgba(255, 167, 38, 0.14)',
        fg: '#EF6C00',
        icon: 'time',
      };
    }

    return {
      bg: 'rgba(10, 29, 55, 0.08)',
      fg: theme.colors.textPrimary,
      icon: 'help-circle',
    };
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

        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>Your referrals</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.summaryCard, { backgroundColor: theme.colors.white }]}> 
          <View style={styles.summaryTop}>
            <Ionicons name="gift-outline" size={22} color={theme.colors.textPrimary} style={styles.summaryIcon} />
            <View style={styles.summaryTextBlock}>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Total earned</Text>
              <Text style={[styles.summaryValue, { color: theme.colors.textPrimary }]}>{formatKes(totalEarned)}</Text>
            </View>
          </View>
          <Text style={[styles.summaryHint, { color: theme.colors.textSecondary }]}>Completed referrals are paid automatically once the host is verified.</Text>
        </View>

        {referrals.length === 0 ? (
          <View style={styles.emptyState}>
            <ReferralsIcon width={220} height={220} />
            <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>No referrals yet</Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>Your referred hosts will appear here once they sign up.</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {referrals.map((item) => {
              const st = getStatusStyle(item.status);
              return (
                <View key={item.id} style={[styles.referralRow, { backgroundColor: theme.colors.white }]}> 
                  <View style={styles.rowTop}>
                    <View style={styles.rowLeft}>
                      <Text style={[styles.referralName, { color: theme.colors.textPrimary }]}>{item.name}</Text>
                      <Text style={[styles.referralMeta, { color: theme.colors.textSecondary }]}>{item.type} host</Text>
                    </View>

                    <View style={[styles.statusPill, { backgroundColor: st.bg }]}> 
                      <Ionicons name={st.icon} size={14} color={st.fg} />
                      <Text style={[styles.statusText, { color: st.fg }]}>{item.status}</Text>
                    </View>
                  </View>

                  <View style={styles.rowBottom}>
                    <Text style={[styles.rowDate, { color: theme.colors.textSecondary }]}>{item.date}</Text>
                    <Text style={[styles.rowReward, { color: theme.colors.textPrimary }]}>{formatKes(item.reward)}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
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
    paddingTop: 10,
  },
  summaryCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  summaryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryIcon: {
    marginRight: 12,
  },
  summaryTextBlock: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    letterSpacing: -0.3,
  },
  summaryHint: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 18,
  },
  list: {
    gap: 12,
  },
  referralRow: {
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  rowLeft: {
    flex: 1,
    paddingRight: 10,
  },
  referralName: {
    fontSize: 15,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 2,
  },
  referralMeta: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
  },
  rowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowDate: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  rowReward: {
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginTop: 6,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 22,
  },
});

export default YourReferralsScreen;
