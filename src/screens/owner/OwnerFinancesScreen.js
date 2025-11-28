import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Card } from '../../packages/components';

const OwnerFinancesScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [selectedPeriod, setSelectedPeriod] = useState('week'); // week, month, year
  const [hideBalance, setHideBalance] = useState(false);

  // Commission rate (15%)
  const COMMISSION_RATE = 0.15;

  // Mock financial data
  const earningsData = {
    week: {
      gross: 1250,
      bookings: 18,
      average: 69.44,
      lastPeriod: 1115,
    },
    month: {
      gross: 4850,
      bookings: 72,
      average: 67.36,
      lastPeriod: 4320,
    },
    year: {
      gross: 58200,
      bookings: 864,
      average: 67.36,
      lastPeriod: 52000,
    },
  };

  // Calculate commission and net earnings
  const calculateCommission = (gross) => {
    return gross * COMMISSION_RATE;
  };

  const currentData = earningsData[selectedPeriod];
  const commissionAmount = calculateCommission(currentData.gross);
  const netEarnings = currentData.gross - commissionAmount;
  const availableCash = netEarnings * 0.7; // 70% available for withdrawal

  const transactions = [
    {
      id: 1,
      type: 'earned',
      grossAmount: 135,
      description: 'Car rental - Toyota Corolla',
      date: '2024-01-15',
      time: '2:30 PM',
      status: 'completed',
    },
    {
      id: 2,
      type: 'earned',
      grossAmount: 180,
      description: 'Car rental - Honda Civic',
      date: '2024-01-15',
      time: '3:15 PM',
      status: 'completed',
    },
    {
      id: 3,
      type: 'withdrawal',
      amount: -500,
      description: 'Withdrawal to M-PESA',
      date: '2024-01-14',
      time: '10:00 AM',
      status: 'completed',
    },
    {
      id: 4,
      type: 'earned',
      grossAmount: 225,
      description: 'Car rental - Toyota Corolla',
      date: '2024-01-14',
      time: '4:00 PM',
      status: 'completed',
    },
    {
      id: 5,
      type: 'earned',
      grossAmount: 90,
      description: 'Car rental - Honda Civic',
      date: '2024-01-13',
      time: '11:30 AM',
      status: 'completed',
    },
  ];

  const formatCurrency = (amount) => {
    return `$${Math.abs(amount).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const displayAmount = (amount) => {
    if (hideBalance) {
      return '••••••';
    }
    return formatCurrency(amount);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {['week', 'month', 'year'].map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              {
                backgroundColor: selectedPeriod === period ? theme.colors.primary : theme.colors.white,
              },
            ]}
            onPress={() => setSelectedPeriod(period)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.periodButtonText,
                {
                  color: selectedPeriod === period ? theme.colors.white : theme.colors.textSecondary,
                  fontFamily: selectedPeriod === period ? 'Nunito_700Bold' : 'Nunito_600SemiBold',
                },
              ]}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Main Balance Card */}
      <View style={styles.balanceCardContainer}>
        <Card style={[styles.balanceCard, { backgroundColor: theme.colors.primary }]}>
          <View style={styles.balanceHeader}>
            <Text style={[styles.balanceLabel, { color: 'rgba(255, 255, 255, 0.9)' }]}>
              Available Cash for Withdrawal
            </Text>
            <TouchableOpacity
              onPress={() => setHideBalance(!hideBalance)}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={hideBalance ? "eye-off-outline" : "eye-outline"} 
                size={22} 
                color="rgba(255, 255, 255, 0.9)" 
              />
            </TouchableOpacity>
          </View>
          <Text style={[styles.balanceAmount, { color: theme.colors.white }]}>
            {displayAmount(availableCash)}
          </Text>
        </Card>
      </View>

      {/* Metrics Cards Row */}
      <View style={styles.metricsContainer}>
        <Card style={[styles.metricCard, { backgroundColor: '#FF6B35' }]}>
          <Ionicons name="trending-up-outline" size={24} color={theme.colors.white} />
          <Text style={[styles.metricLabel, { color: 'rgba(255, 255, 255, 0.9)' }]}>
            Gross Income
          </Text>
          <Text style={[styles.metricAmount, { color: theme.colors.white }]}>
            {displayAmount(currentData.gross)}
          </Text>
        </Card>

        <Card style={[styles.metricCard, { backgroundColor: '#FFD93D' }]}>
          <Ionicons name="cut-outline" size={24} color={theme.colors.white} />
          <Text style={[styles.metricLabel, { color: 'rgba(255, 255, 255, 0.9)' }]}>
            Commission
          </Text>
          <Text style={[styles.metricAmount, { color: theme.colors.white }]}>
            {displayAmount(commissionAmount)}
          </Text>
        </Card>

        <Card style={[styles.metricCard, { backgroundColor: '#0A1D37' }]}>
          <Ionicons name="stats-chart-outline" size={24} color={theme.colors.white} />
          <Text style={[styles.metricLabel, { color: 'rgba(255, 255, 255, 0.9)' }]}>
            Trend
          </Text>
          <Text style={[styles.metricAmount, { color: theme.colors.white }]}>
            {displayAmount(currentData.lastPeriod)}
          </Text>
        </Card>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.white, borderWidth: 1, borderColor: theme.colors.primary }]}
          onPress={() => {
            navigation.navigate('FinancesTab', {
              screen: 'AddPaymentMethod',
            });
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="add-circle-outline" size={20} color={theme.colors.primary} />
          <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>
            Add Payment Method
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => {
            navigation.navigate('FinancesTab', {
              screen: 'WithdrawRequest',
              params: { availableBalance: availableCash },
            });
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-down-outline" size={20} color={theme.colors.white} />
          <Text style={[styles.actionButtonText, { color: theme.colors.white }]}>
            Withdraw
          </Text>
        </TouchableOpacity>
      </View>

      {/* Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Recent Transaction
          </Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
              View all
            </Text>
          </TouchableOpacity>
        </View>
        {transactions.map((transaction) => {
          const isEarned = transaction.type === 'earned';
          const grossAmount = isEarned ? transaction.grossAmount : Math.abs(transaction.amount);
          const commission = isEarned ? calculateCommission(grossAmount) : 0;
          const netAmount = isEarned ? grossAmount - commission : transaction.amount;

          return (
            <Card key={transaction.id} style={[styles.transactionCard, { backgroundColor: theme.colors.white }]}>
              <View style={styles.transactionHeader}>
                <View
                  style={[
                    styles.transactionIcon,
                    {
                      backgroundColor:
                        isEarned
                          ? theme.colors.primary + '20'
                          : '#FF3B30' + '20',
                    },
                  ]}
                >
                  <Ionicons
                    name={isEarned ? 'arrow-down' : 'arrow-up'}
                    size={20}
                    color={isEarned ? theme.colors.primary : '#FF3B30'}
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={[styles.transactionDescription, { color: theme.colors.textPrimary }]}>
                    {transaction.description}
                  </Text>
                  <View style={styles.transactionMeta}>
                    <Text style={[styles.transactionDate, { color: theme.colors.textSecondary }]}>
                      {formatDate(transaction.date)} • {transaction.time}
                    </Text>
                    {transaction.status === 'pending' && (
                      <View style={[styles.statusBadge, { backgroundColor: '#FFA500' + '20' }]}>
                        <Text style={[styles.statusText, { color: '#FFA500' }]}>Pending</Text>
                      </View>
                    )}
                  </View>
                  {isEarned && (
                    <View style={styles.transactionBreakdown}>
                      <Text style={[styles.breakdownText, { color: theme.colors.textSecondary }]}>
                        Gross: {formatCurrency(grossAmount)} • Commission: -{formatCurrency(commission)}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.transactionAmountContainer}>
                  <Text
                    style={[
                      styles.transactionAmount,
                      {
                        color: isEarned ? '#4CAF50' : '#FF3B30',
                      },
                    ]}
                  >
                    {isEarned ? '+' : ''}
                    {formatCurrency(netAmount)}
                  </Text>
                  {isEarned && (
                    <Text style={[styles.transactionNetLabel, { color: theme.colors.textSecondary }]}>
                      Net
                    </Text>
                  )}
                </View>
              </View>
            </Card>
          );
        })}
      </View>

      {/* Bottom Spacing */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 12,
    marginBottom: 24,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodButtonText: {
    fontSize: 14,
  },
  balanceCardContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  balanceCard: {
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    flex: 1,
  },
  balanceAmount: {
    fontSize: 42,
    fontFamily: 'Nunito_700Bold',
    letterSpacing: -1,
  },
  metricsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  metricAmount: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    textAlign: 'center',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  section: {
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    letterSpacing: -0.3,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  transactionCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 4,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Nunito_600SemiBold',
  },
  transactionBreakdown: {
    marginTop: 6,
  },
  breakdownText: {
    fontSize: 11,
    fontFamily: 'Nunito_400Regular',
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  transactionNetLabel: {
    fontSize: 10,
    fontFamily: 'Nunito_400Regular',
    marginTop: 2,
  },
});

export default OwnerFinancesScreen;
