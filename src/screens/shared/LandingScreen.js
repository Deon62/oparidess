import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Button } from '../../packages/components';

const LandingScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.navigate('Signup', { userType: 'renter' });
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleCarOwnerRegister = () => {
    navigation.navigate('Signup', { userType: 'owner' });
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Luxury Car Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: 'https://pngimg.com/uploads/tesla_car/tesla_car_PNG29.png' }}
          style={styles.carImage}
          resizeMode="contain"
        />
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          Welcome to Opa
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Alles Gut mit Opa
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

      {/* Car Owner Register Link */}
      <View style={styles.carOwnerContainer}>
        <TouchableOpacity
          onPress={handleCarOwnerRegister}
          activeOpacity={0.7}
          style={styles.carOwnerLinkContainer}
        >
          <Text style={[styles.carOwnerText, { color: theme.colors.textSecondary }]}>
            List your car?{' '}
            <Text style={[styles.carOwnerLink, { color: theme.colors.primary }]}>
              Become a Car Owner
            </Text>
          </Text>
        </TouchableOpacity>
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
    height: 350,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  carImage: {
    width: '100%',
    height: '100%',
  },
  contentSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 38,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 19,
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 26,
  },
  description: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 4,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingTop: 64,
    gap: 14,
  },
  primaryButton: {
    marginBottom: 0,
  },
  secondaryButton: {
    marginBottom: 0,
  },
  carOwnerContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    alignItems: 'center',
  },
  carOwnerLinkContainer: {
    alignItems: 'center',
  },
  carOwnerText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
  },
  carOwnerLink: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
});

export default LandingScreen;
