import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

const OnboardingScreen: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onboardingData = [
    {
      id: 1,
      title: 'Navigate the\nOcean',
      subtitle: 'Real-time maritime intelligence',
      description:
        'Track vessels, monitor routes, and explore the seas with precision and confidence.',
      image:
        'https://images.unsplash.com/photo-1541963058-d39ff9095832?w=800&q=80',
      icon: 'anchor' as const,
      accentColor: '#06bfdb',
      gradientColors: ['#0a1929', '#1a365d', '#065f9d', '#000000'],
    },
    {
      id: 2,
      title: 'Live Ship\nTracking',
      subtitle: 'Global vessel monitoring',
      description:
        'Access real-time AIS data and comprehensive vessel information from anywhere in the world.',
      image:
        'https://images.unsplash.com/photo-1578271887552-5ac3a72752bc?w=800&q=80',
      icon: 'navigation' as const,
      accentColor: '#22d3ee',
      gradientColors: ['#0f2027', '#203a43', '#2c5364', '#000000'],
    },
    {
      id: 3,
      title: 'Protected\nZones',
      subtitle: 'Marine conservation areas',
      description:
        'Discover and respect protected marine environments with interactive conservation maps.',
      image:
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
      icon: 'shield' as const,
      accentColor: '#10b981',
      gradientColors: ['#134e4a', '#065f46', '#047857', '#000000'],
    },
    {
      id: 4,
      title: 'Discover &\nLearn',
      subtitle: 'Ocean education hub',
      description:
        'Explore marine biodiversity, share discoveries, and expand your maritime knowledge.',
      image:
        'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&q=80',
      icon: 'compass' as const,
      accentColor: '#3b82f6',
      gradientColors: ['#1e3a8a', '#1e40af', '#2563eb', '#000000'],
    },
  ];

  const handleNext = () => {
    if (currentPage < onboardingData.length - 1) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentPage(currentPage + 1);
        slideAnim.setValue(50);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 350,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
  };

  const handleSkip = () => {
    setCurrentPage(onboardingData.length - 1);
  };

  const handleGetStarted = () => {
    router.push('/(tabs)/Home');
  };

  const current = onboardingData[currentPage];
  const currentIcon = current.icon;

  const renderIcon = () => {
    switch (currentIcon) {
      case 'anchor':
        return <Feather name="anchor" size={40} color="#000" />;
      case 'navigation':
        return <Feather name="navigation" size={40} color="#000" />;
      case 'shield':
        return <Feather name="shield" size={40} color="#000" />;
      case 'compass':
        return <Feather name="compass" size={40} color="#000" />;
      default:
        return <Feather name="anchor" size={40} color="#000" />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Background */}
      <Animated.View style={[styles.bgWrapper, { transform: [{ scale: scaleAnim }] }]}>
        <Image
          source={{ uri: current.image }}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={[
            current.gradientColors[0],
            current.gradientColors[1],
            current.gradientColors[2],
            current.gradientColors[3]
          ]}
          style={styles.gradient}
        />
      </Animated.View>

      {/* Particles */}
      <View style={styles.particles}>
        {[...Array(6)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.particle,
              {
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              },
            ]}
          />
        ))}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={[styles.logoRing, { borderColor: current.accentColor }]}>
            <Feather name="anchor" size={20} color={current.accentColor} />
          </View>
          <Text style={styles.logoText}>Marine Nav</Text>
        </View>

        {currentPage < onboardingData.length - 1 && (
          <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
            <Text style={styles.skipText}>Skip</Text>
            <Feather name="chevrons-right" size={16} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Icon */}
        <View style={styles.iconSection}>
          <View style={[styles.iconGlow, { backgroundColor: current.accentColor }]} />
          <View style={[styles.iconRing, { borderColor: current.accentColor }]}>
            <View style={[styles.iconInner, { backgroundColor: current.accentColor }]}>
              {renderIcon()}
            </View>
          </View>
        </View>

        {/* Text */}
        <View style={styles.textSection}>
          <Text style={styles.title}>{current.title}</Text>
          <View style={[styles.accentBar, { backgroundColor: current.accentColor }]} />
          <Text style={styles.subtitle}>{current.subtitle}</Text>
          <Text style={styles.description}>{current.description}</Text>
        </View>

        {/* Dots */}
        <View style={styles.dotsContainer}>
          {onboardingData.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setCurrentPage(index)}
              activeOpacity={0.8}
            >
              <View style={styles.dotWrapper}>
                {index === currentPage && (
                  <View style={[styles.dotOuter, { borderColor: current.accentColor }]} />
                )}
                <View
                  style={[
                    styles.dot,
                    index === currentPage && {
                      backgroundColor: current.accentColor,
                      width: 10,
                      height: 10,
                    },
                    index < currentPage && {
                      backgroundColor: current.accentColor,
                      opacity: 0.5,
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Button */}
        <TouchableOpacity
          onPress={
            currentPage === onboardingData.length - 1 ? handleGetStarted : handleNext
          }
          style={[styles.ctaButton, { backgroundColor: current.accentColor }]}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>
              {currentPage === onboardingData.length - 1
                ? 'Get Started'
                : 'Continue'}
            </Text>
            <View style={styles.buttonIconContainer}>
              <Feather
                name={
                  currentPage === onboardingData.length - 1
                    ? 'arrow-right'
                    : 'chevron-right'
                }
                size={24}
                color="#000"
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  bgWrapper: { position: 'absolute', width, height },
  backgroundImage: { width: '100%', height: '100%' },
  gradient: { position: 'absolute', width: '100%', height: '100%' },
  particles: { position: 'absolute', width: '100%', height: '100%' },
  particle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    opacity: 0.05,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    zIndex: 10,
  },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  logoText: { color: '#fff', fontSize: 18, fontWeight: '700', letterSpacing: 0.5 },
  skipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  skipText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingBottom: 60,
  },
  iconSection: { alignItems: 'center', marginBottom: 40 },
  iconGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    opacity: 0.15,
  },
  iconRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  iconInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textSection: { alignItems: 'center', marginBottom: 40 },
  title: {
    fontSize: 52,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 60,
    marginBottom: 16,
    letterSpacing: -1,
  },
  accentBar: {
    width: 60,
    height: 4,
    borderRadius: 2,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 340,
    paddingHorizontal: 10,
  },
  dotsContainer: { flexDirection: 'row', gap: 12, marginBottom: 36 },
  dotWrapper: { alignItems: 'center', justifyContent: 'center', width: 28, height: 28 },
  dotOuter: { position: 'absolute', width: 24, height: 24, borderRadius: 12, borderWidth: 2 },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  ctaButton: {
    width: width - 56,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 28,
    gap: 12,
  },
  buttonText: { fontSize: 18, fontWeight: '700', color: '#000', letterSpacing: 0.5 },
  buttonIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OnboardingScreen;