import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Card } from '../../packages/components';

const UserTypeSelectionScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const handleUserTypeSelection = (userType) => {
    // Navigate to signup with user type
    navigation.navigate('Signup', { userType });
  };

  const userTypes = [
    {
      id: 'renter',
      title: 'Rent a Car',
      description: 'Browse and rent cars from owners',
    },
    {
      id: 'owner',
      title: 'List Your Car',
      description: 'Earn money by renting out your car',
    },
    {
      id: 'driver',
      title: 'Become a Driver',
      description: 'Offer your driving services',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
        Choose Your Role
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Select how you want to use Oparides
      </Text>

      <View style={styles.optionsContainer}>
        {userTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            onPress={() => handleUserTypeSelection(type.id)}
            activeOpacity={0.8}
          >
            <Card style={styles.card}>
              <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
                {type.title}
              </Text>
              <Text style={[styles.cardDescription, { color: theme.colors.textSecondary }]}>
                {type.description}
              </Text>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 16,
  },
  card: {
    marginBottom: 0,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default UserTypeSelectionScreen;

