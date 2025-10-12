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
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      // Handle validation
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push('/(tabs)/Home');
    }, 1500);
  };

  const handleSignup = () => {
    // Empty for now as requested
    console.log('Navigate to signup');
  };

  const handleForgotPassword = () => {
    // Empty for now as requested
    console.log('Navigate to forgot password');
  };

  const accentColor = '#06bfdb';
  const gradientColors = ['#0a1929', '#1a365d', '#065f9d', '#000000'];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Background */}
      <Animated.View style={[styles.bgWrapper, { transform: [{ scale: scaleAnim }] }]}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1541963058-d39ff9095832?w=800&q=80',
          }}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={gradientColors}
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
          <View style={[styles.logoRing, { borderColor: accentColor }]}>
            <Feather name="anchor" size={20} color={accentColor} />
          </View>
          <Text style={styles.logoText}>Marine Nav</Text>
        </View>

        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
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
              <View style={[styles.iconGlow, { backgroundColor: accentColor }]} />
              <View style={[styles.iconRing, { borderColor: accentColor }]}>
                <View style={[styles.iconInner, { backgroundColor: accentColor }]}>
                  <Feather name="lock" size={40} color="#000" />
                </View>
              </View>
            </View>

            {/* Text */}
            <View style={styles.textSection}>
              <Text style={styles.title}>Welcome\nBack</Text>
              <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
              <Text style={styles.subtitle}>Sign in to your account</Text>
              <Text style={styles.description}>
                Access your marine navigation dashboard and continue your journey.
              </Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Feather name="mail" size={20} color="rgba(255,255,255,0.7)" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Feather name="lock" size={20} color="rgba(255,255,255,0.7)" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Feather
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={20}
                    color="rgba(255,255,255,0.7)"
                  />
                </TouchableOpacity>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity
                onPress={handleForgotPassword}
                style={styles.forgotPassword}
              >
                <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleLogin}
                style={[styles.loginButton, { backgroundColor: accentColor }]}
                disabled={isLoading}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonGradient}
                >
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <Feather name="loader" size={24} color="#000" />
                    </View>
                  ) : (
                    <>
                      <Text style={styles.buttonText}>Sign In</Text>
                      <View style={styles.buttonIconContainer}>
                        <Feather name="arrow-right" size={24} color="#000" />
                      </View>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Sign Up Link */}
              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <TouchableOpacity onPress={handleSignup}>
                  <Text style={[styles.signupText, styles.signupLink]}>
                    Sign up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Security Note */}
            <View style={styles.securityContainer}>
              <Feather name="shield" size={16} color="rgba(255,255,255,0.5)" />
              <Text style={styles.securityText}>
                Your data is securely encrypted
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  keyboardAvoid: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'flex-end' },
  content: {
    paddingHorizontal: 28,
    paddingBottom: 40,
    paddingTop: 20,
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
  formContainer: {
    width: '100%',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    height: 60,
  },
  inputIcon: {
    marginRight: 12,
    width: 24,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    height: '100%',
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
    marginBottom: 24,
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
  loadingContainer: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 15,
    fontWeight: '500',
  },
  signupLink: {
    color: '#06bfdb',
    fontWeight: '600',
  },
  securityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },
  securityText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontWeight: '500',
  },
});

export default LoginScreen;