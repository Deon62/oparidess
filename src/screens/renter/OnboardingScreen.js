import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../packages/theme/ThemeProvider';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const slides = [
  {
    id: 'discover',
    title: 'Discover unique rides',
    subtitle: 'Browse curated cars and services tailored to every trip.',
    icon: 'compass-outline',
    accent: '#2D9CDB',
  },
  {
    id: 'book',
    title: 'Book in minutes',
    subtitle: 'Transparent pricing, instant confirmations, and secure payments.',
    icon: 'card-outline',
    accent: '#27AE60',
  },
  {
    id: 'track',
    title: 'Track your journey',
    subtitle: 'Real-time updates from pickup to drop-off with peace of mind.',
    icon: 'navigate-outline',
    accent: '#F2994A',
  },
  {
    id: 'enjoy',
    title: 'Enjoy the drive',
    subtitle: 'Premium support and seamless experiences wherever you go.',
    icon: 'car-sport-outline',
    accent: '#9B51E0',
  },
];

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [step, setStep] = useState(0);

  const currentSlide = useMemo(() => slides[step], [step]);
  const isFirst = step === 0;
  const isLast = step === slides.length - 1;

  const handleSkip = () => {
    navigation.navigate('Landing');
  };

  const handleNext = () => {
    if (isLast) {
      handleSkip();
      return;
    }
    setStep((prev) => Math.min(prev + 1, slides.length - 1));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 20 }]}>
      <View style={styles.header}>
        <View />
        <TouchableOpacity onPress={handleSkip} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={[styles.skipText, { color: theme.colors.textSecondary }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{currentSlide.title}</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>{currentSlide.subtitle}</Text>

        <View style={styles.dots}>
          {slides.map((slide, index) => {
            const active = index === step;
            return (
              <View
                key={slide.id}
                style={[
                  styles.dot,
                  active && { backgroundColor: theme.colors.primary, width: 24 },
                  !active && { backgroundColor: theme.colors.hint + '50' },
                ]}
              />
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        {!isFirst ? (
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
            <Text style={[styles.backText, { color: theme.colors.textPrimary }]}>Back</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 76 }} />
        )}

        <TouchableOpacity
          onPress={handleNext}
          style={[styles.nextButton, { backgroundColor: theme.colors.primary }]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-forward" size={24} color={theme.colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  skipText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  content: {
    flex: 1.1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Nunito_700Bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  dots: {
    flexDirection: 'row',
    gap: 10,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  backText: {
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold',
  },
  nextButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
});

export default OnboardingScreen;
