import {
  PRIMARY_GREEN,
  SHADOW_SMALL,
  SHADOW_MEDIUM,
  SHADOW_BUTTON,
  TEXT_DARK,
  TEXT_GRAY,
  BACKGROUND_SOFT,
  BACKGROUND_WHITE,
  BORDER_LIGHT,
} from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const slides: OnboardingSlide[] = [
  {
    id: 1,
    title: 'Find Nearby Chargers',
    description: 'Discover EV charging stations near you with real-time availability and detailed information.',
    icon: 'location',
  },
  {
    id: 2,
    title: 'Plan Your Journey',
    description: 'Plan long EV trips with confidence, finding charging stations along your route.',
    icon: 'map',
  },
  {
    id: 3,
    title: 'Navigate with Ease',
    description: 'Get turn-by-turn directions to charging stations with integrated navigation.',
    icon: 'navigate',
  },
];

export default function WelcomeScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentSlide(slideIndex);
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      const nextSlide = currentSlide + 1;
      scrollViewRef.current?.scrollTo({
        x: nextSlide * SCREEN_WIDTH,
        animated: true,
      });
      setCurrentSlide(nextSlide);
    } else {
      // Last slide - navigate to login
      router.replace('/login');
    }
  };

  const handleSkip = () => {
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip} activeOpacity={0.7}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Logo at Top - Centered and Properly Spaced */}
      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/BYDGOlogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Onboarding Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
      >
        {slides.map((slide) => (
          <View key={slide.id} style={styles.slide}>
            {/* Simple Icon - No Heavy Background */}
            <View style={styles.iconContainer}>
              <Ionicons name={slide.icon} size={72} color={PRIMARY_GREEN} />
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </View>

            {/* Minimal Pagination Dots */}
            <View style={styles.pagination}>
              {slides.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    currentSlide === index && styles.dotActive,
                  ]}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Next Button - Clean and Modern */}
      <TouchableOpacity
        style={styles.nextButton}
        onPress={handleNext}
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-forward" size={22} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_SOFT,
  },
  logoContainer: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 5,
    paddingHorizontal: 24,
  },
  logo: {
    width: 220,
    height: 72,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 16,
    color: TEXT_GRAY,
    fontWeight: '500',
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 180,
  },
  iconContainer: {
    marginBottom: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: TEXT_DARK,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 40,
  },
  description: {
    fontSize: 16,
    color: TEXT_GRAY,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
    fontWeight: '400',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 120,
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: BORDER_LIGHT,
  },
  dotActive: {
    width: 24,
    height: 6,
    borderRadius: 3,
    backgroundColor: PRIMARY_GREEN,
  },
  nextButton: {
    position: 'absolute',
    bottom: 40,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: PRIMARY_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOW_BUTTON,
  },
});
