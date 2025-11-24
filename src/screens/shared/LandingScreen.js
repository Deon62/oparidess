import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Button } from '../../packages/components';

const LandingScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.navigate('UserTypeSelection');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Section with Car Image */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../../../assets/images/lp.png')}
          style={styles.carImage}
          resizeMode="contain"
        />
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          Welcome to Oparides
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Your premium car rental{'\n'}and driver hire experience
        </Text>
        <Text style={[styles.description, { color: theme.colors.hint }]}>
          Rent luxury cars or hire professional{'\n'}drivers with ease
        </Text>
      </View>

      {/* Buttons Section */}
      <View style={styles.buttonContainer}>
        <Button
          title="Get Started"
          onPress={handleGetStarted}
          variant="primary"
          style={styles.primaryButton}
        />
        <Button
          title="Login"
          onPress={handleLogin}
          variant="secondary"
          style={styles.secondaryButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  imageContainer: {
    width: '100%',
    height: 380,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  carImage: {
    width: '100%',
    height: '100%',
  },
  contentSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 38,
    fontWeight: '700',
    fontFamily: 'Nunito_700Bold',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 19,
    fontWeight: '600',
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 26,
  },
  description: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 4,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingTop: 48,
    gap: 14,
  },
  primaryButton: {
    marginBottom: 0,
  },
  secondaryButton: {
    marginBottom: 0,
  },
});

export default LandingScreen;
