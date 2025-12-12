import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../packages/theme/ThemeProvider';

import StorytimeIcon from '../../../assets/icons/storytime.svg';
import OpaSolutionIcon from '../../../assets/icons/opasolution.svg';
import PeopleLoveIcon from '../../../assets/icons/pplelove.svg';
import TryItOutIcon from '../../../assets/icons/tryitout.svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const OnboardingIcon = ({ slideId, size }) => {
  switch (slideId) {
    case 'problem':
      return <StorytimeIcon width={size} height={size} />;
    case 'solution':
      return <OpaSolutionIcon width={size} height={size} />;
    case 'result':
      return <PeopleLoveIcon width={size} height={size} />;
    case 'invitation':
      return <TryItOutIcon width={size} height={size} />;
    default:
      return null;
  }
};

const slides = [
  {
    id: 'problem',
    title: 'Once upon a time...',
    subtitle: 'Car rentals were filled with hidden fees, confusing terms, and endless paperwork. Finding the right car felt like finding a needle in a haystack.',
    accent: '#FF6B35',
  },
  {
    id: 'solution',
    title: 'Then came Opa',
    subtitle: 'We fixed everything. Transparent pricing, video walkarounds, verified owners, and booking in under 60 seconds. No hidden fees, no surprises.',
    accent: '#2D9CDB',
  },
  {
    id: 'result',
    title: 'People loved it!',
    subtitle: 'Thousands of Kenyans now travel with confidence. Owners earn more, renters save more, and everyone enjoys peace of mind.',
    accent: '#27AE60',
  },
  {
    id: 'invitation',
    title: 'Your turn to experience it',
    subtitle: 'Join thousands of happy travelers. Find your perfect ride, book with confidence, and create unforgettable memories.',
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
        <View style={styles.hero}>
          <OnboardingIcon slideId={currentSlide.id} size={SCREEN_WIDTH * 0.56} />
        </View>

        <View style={styles.textBlock}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{currentSlide.title}</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>{currentSlide.subtitle}</Text>

        </View>

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
            style={[styles.backButton, { backgroundColor: theme.colors.white }]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={22} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 56 }} />
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
  hero: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  textBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Nunito_700Bold',
    textAlign: 'center',
    marginBottom: 10,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 6,
    elevation: 6,
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
