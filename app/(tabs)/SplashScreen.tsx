import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const navigation = useNavigation();
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      // Scale up logo
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous rotation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Navigate to onboarding after 3 seconds
    const timer = setTimeout(() => {
      // navigation.navigate('Onboarding');
      console.log('Navigate to Onboarding');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const icons = [
    { name: 'anchor', color: '#06bfdb', angle: 0 },
    { name: 'navigation', color: '#22d3ee', angle: 90 },
    { name: 'shield', color: '#10b981', angle: 180 },
    { name: 'compass', color: '#3b82f6', angle: 270 },
  ];
  

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Background Gradient */}
      <LinearGradient
        colors={['#0a1929', '#1a365d', '#0f172a', '#000000']}
        style={styles.gradient}
      />

      {/* Animated Background Circles */}
      <View style={styles.bgCircles}>
        {[...Array(3)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.bgCircle,
              {
                width: 200 + i * 100,
                height: 200 + i * 100,
                opacity: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.03 - i * 0.01],
                }),
              },
            ]}
          />
        ))}
      </View>

      {/* Main Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo Container */}
        <View style={styles.logoContainer}>
          {/* Center Glow */}
          <Animated.View
            style={[
              styles.centerGlow,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />

          {/* Center Circle */}
          <View style={styles.centerCircle}>
            <View style={styles.centerInner}>
              <Feather name="anchor" size={48} color="#06bfdb" />
            </View>
          </View>

          {/* Rotating Icons Container */}
          <Animated.View
            style={[
              styles.orbitContainer,
              {
                transform: [{ rotate }],
              },
            ]}
          >
            {icons.map((icon, index) => {
              const angleRad = (icon.angle * Math.PI) / 180;
              const radius = 90;
              const x = radius * Math.cos(angleRad);
              const y = radius * Math.sin(angleRad);

              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.orbitIcon,
                    {
                      transform: [
                        { translateX: x },
                        { translateY: y },
                        { rotate: rotateAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '-360deg'],
                        })},
                      ],
                    },
                  ]}
                >
                  {/* Icon Glow */}
                  <View
                    style={[
                      styles.iconGlow,
                      { backgroundColor: icon.color },
                    ]}
                  />
                  {/* Icon Container */}
                  <View
                    style={[
                      styles.iconCircle,
                      { borderColor: icon.color },
                    ]}
                  >
                    {icon.name === 'anchor' && (
                      <Feather name="anchor" size={20} color={icon.color} />
                    )}
                    {icon.name === 'navigation' && (
                      <Feather name="navigation" size={20} color={icon.color} />
                    )}
                    {icon.name === 'shield' && (
                      <Feather name="shield" size={20} color={icon.color} />
                    )}
                    {icon.name === 'compass' && (
                      <Feather name="compass" size={20} color={icon.color} />
                    )}
                  </View>
                </Animated.View>
              );
            })}
          </Animated.View>

          {/* Orbit Ring */}
          <Animated.View
            style={[
              styles.orbitRing,
              {
                opacity: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.3],
                }),
              },
            ]}
          />
        </View>

        {/* App Name */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          }}
        >
          <Text style={styles.appName}>Eco Nav</Text>
          <Text style={styles.tagline}>Eco Friendly Navigation</Text>
        </Animated.View>

        {/* Loading Indicator */}
        <Animated.View
          style={[
            styles.loadingContainer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={styles.loadingBar}>
            <Animated.View
              style={[
                styles.loadingProgress,
                {
                  width: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.loadingText}>Preparing your journey...</Text>
        </Animated.View>
      </Animated.View>

      {/* Particles */}
      <View style={styles.particles}>
        {[...Array(20)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, Math.random() * 0.5],
                }),
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  bgCircles: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgCircle: {
    position: 'absolute',
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: '#06bfdb',
  },
  particles: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  particle: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
  },
  centerGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#06bfdb',
    opacity: 0.2,
  },
  centerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(6, 191, 219, 0.1)',
    borderWidth: 3,
    borderColor: '#06bfdb',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  centerInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitContainer: {
    position: 'absolute',
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitIcon: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlow: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0.2,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#06bfdb',
    borderStyle: 'dashed',
  },
  appName: {
    fontSize: 42,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 8,
    textShadowColor: 'rgba(6, 191, 219, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    letterSpacing: 2,
    fontWeight: '600',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
    width: '100%',
  },
  loadingBar: {
    width: width - 100,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },
  loadingProgress: {
    height: '100%',
    backgroundColor: '#06bfdb',
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 1,
    fontWeight: '600',
  },
});

export default SplashScreen;