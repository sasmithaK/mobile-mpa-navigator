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

type UserType = 'shipping' | 'port' | 'environmental' | 'community';

const RegisterScreen: React.FC = () => {
  const [userType, setUserType] = useState<UserType>('shipping');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Shipping Company & Ship Captain Fields
  const [companyName, setCompanyName] = useState('');
  const [fleetSize, setFleetSize] = useState('');
  const [vesselType, setVesselType] = useState('');
  
  // Port Authority Fields
  const [portName, setPortName] = useState('');
  const [portLocation, setPortLocation] = useState('');
  const [authorityCode, setAuthorityCode] = useState('');
  
  // Environmental Organization Fields
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState('');
  const [focusArea, setFocusArea] = useState('');
  
  // Coastal Community Fields
  const [communityName, setCommunityName] = useState('');
  const [location, setLocation] = useState('');
  const [population, setPopulation] = useState('');
  
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

  const handleRegister = async () => {
    if (!email || !password || password !== confirmPassword) {
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

  const handleLogin = () => {
    router.back();
  };

  const userTypes = [
    {
      id: 'shipping' as UserType,
      title: 'Shipping & Captains',
      icon: 'anchor',
      description: 'Company vessels and ship operations'
    },
    {
      id: 'port' as UserType,
      title: 'Port Authorities',
      icon: 'map-pin',
      description: 'Port management and operations'
    },
    {
      id: 'environmental' as UserType,
      title: 'Environmental',
      icon: 'leaf',
      description: 'Conservation and research'
    },
    {
      id: 'community' as UserType,
      title: 'Coastal Community',
      icon: 'users',
      description: 'Local communities and citizens'
    }
  ];

  const renderUserTypeFields = () => {
    switch (userType) {
      case 'shipping':
        return (
          <>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Feather name="briefcase" size={20} color="rgba(255,255,255,0.7)" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Company Name"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={companyName}
                onChangeText={setCompanyName}
              />
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Feather name="ship" size={20} color="rgba(255,255,255,0.7)" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Fleet Size"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={fleetSize}
                onChangeText={setFleetSize}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Feather name="navigation" size={20} color="rgba(255,255,255,0.7)" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Primary Vessel Type"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={vesselType}
                onChangeText={setVesselType}
              />
            </View>
          </>
        );
      
      case 'port':
        return (
          <>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Feather name="map-pin" size={20} color="rgba(255,255,255,0.7)" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Port Name"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={portName}
                onChangeText={setPortName}
              />
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Feather name="map" size={20} color="rgba(255,255,255,0.7)" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Port Location"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={portLocation}
                onChangeText={setPortLocation}
              />
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Feather name="key" size={20} color="rgba(255,255,255,0.7)" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Authority Code"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={authorityCode}
                onChangeText={setAuthorityCode}
              />
            </View>
          </>
        );
      
      case 'environmental':
        return (
          <>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Feather name="heart" size={20} color="rgba(255,255,255,0.7)" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Organization Name"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={orgName}
                onChangeText={setOrgName}
              />
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Feather name="git-branch" size={20} color="rgba(255,255,255,0.7)" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Organization Type"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={orgType}
                onChangeText={setOrgType}
              />
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Feather name="target" size={20} color="rgba(255,255,255,0.7)" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Focus Area"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={focusArea}
                onChangeText={setFocusArea}
              />
            </View>
          </>
        );
      
      case 'community':
        return (
          <>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Feather name="users" size={20} color="rgba(255,255,255,0.7)" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Community Name"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={communityName}
                onChangeText={setCommunityName}
              />
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Feather name="map-pin" size={20} color="rgba(255,255,255,0.7)" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Location"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={location}
                onChangeText={setLocation}
              />
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Feather name="bar-chart" size={20} color="rgba(255,255,255,0.7)" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Approximate Population"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={population}
                onChangeText={setPopulation}
                keyboardType="numeric"
              />
            </View>
          </>
        );
      
      default:
        return null;
    }
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
            uri: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&q=80',
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
                  <Feather name="user-plus" size={40} color="#000" />
                </View>
              </View>
            </View>

            {/* Text */}
            <View style={styles.textSection}>
              <Text style={styles.title}>Create\nAccount</Text>
              <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
              <Text style={styles.subtitle}>Join Marine Nav community</Text>
              <Text style={styles.description}>
                Select your role and start your maritime journey with us.
              </Text>
            </View>

            {/* User Type Selector */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.userTypeScroll}
              contentContainerStyle={styles.userTypeContainer}
            >
              {userTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  onPress={() => setUserType(type.id)}
                  style={[
                    styles.userTypeCard,
                    userType === type.id && styles.userTypeCardActive,
                    userType === type.id && { borderColor: accentColor }
                  ]}
                >
                  <View style={[
                    styles.userTypeIcon,
                    { backgroundColor: userType === type.id ? accentColor : 'rgba(255,255,255,0.1)' }
                  ]}>
                    <Feather 
                      name={type.icon as any} 
                      size={20} 
                      color={userType === type.id ? '#000' : 'rgba(255,255,255,0.7)'} 
                    />
                  </View>
                  <Text style={[
                    styles.userTypeTitle,
                    userType === type.id && { color: accentColor }
                  ]}>
                    {type.title}
                  </Text>
                  <Text style={styles.userTypeDescription}>
                    {type.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Form */}
            <View style={styles.formContainer}>
              {/* Common Fields */}
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

              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Feather name="lock" size={20} color="rgba(255,255,255,0.7)" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoComplete="password"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Feather
                    name={showConfirmPassword ? 'eye' : 'eye-off'}
                    size={20}
                    color="rgba(255,255,255,0.7)"
                  />
                </TouchableOpacity>
              </View>

              {/* Dynamic Fields based on User Type */}
              {renderUserTypeFields()}

              {/* Register Button */}
              <TouchableOpacity
                onPress={handleRegister}
                style={[styles.registerButton, { backgroundColor: accentColor }]}
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
                      <Text style={styles.buttonText}>Create Account</Text>
                      <View style={styles.buttonIconContainer}>
                        <Feather name="user-plus" size={24} color="#000" />
                      </View>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Login Link */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={handleLogin}>
                  <Text style={[styles.loginText, styles.loginLink]}>
                    Sign in
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Security Note */}
            <View style={styles.securityContainer}>
              <Feather name="shield" size={16} color="rgba(255,255,255,0.5)" />
              <Text style={styles.securityText}>
                Your data is securely encrypted and protected
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
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  iconSection: { alignItems: 'center', marginBottom: 30 },
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
  textSection: { alignItems: 'center', marginBottom: 25 },
  title: {
    fontSize: 48,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 55,
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
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 340,
    paddingHorizontal: 10,
  },
  userTypeScroll: {
    marginBottom: 25,
  },
  userTypeContainer: {
    paddingHorizontal: 10,
    gap: 12,
  },
  userTypeCard: {
    width: 140,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  userTypeCardActive: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 2,
  },
  userTypeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  userTypeTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  userTypeDescription: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 14,
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    height: 56,
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
  registerButton: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
    marginBottom: 20,
    marginTop: 10,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 15,
    fontWeight: '500',
  },
  loginLink: {
    color: '#06bfdb',
    fontWeight: '600',
  },
  securityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 15,
  },
  securityText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default RegisterScreen;