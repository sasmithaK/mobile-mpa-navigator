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
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

// Firebase imports
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase';

const { width, height } = Dimensions.get('window');

type UserType = 'shipping' | 'port' | 'environmental' | 'community';

type FeatherIconName = React.ComponentProps<typeof Feather>['name'];

// User data interface
interface UserData {
  uid: string;
  email: string;
  userType: UserType;
  role: string;
  createdAt: any;
  updatedAt: any;
  isActive: boolean;
  [key: string]: any;
}

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

  const validateForm = (): boolean => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    // Validate user type specific fields
    switch (userType) {
      case 'shipping':
        if (!companyName || !fleetSize || !vesselType) {
          Alert.alert('Error', 'Please fill in all shipping company details');
          return false;
        }
        break;
      case 'port':
        if (!portName || !portLocation || !authorityCode) {
          Alert.alert('Error', 'Please fill in all port authority details');
          return false;
        }
        break;
      case 'environmental':
        if (!orgName || !orgType || !focusArea) {
          Alert.alert('Error', 'Please fill in all environmental organization details');
          return false;
        }
        break;
      case 'community':
        if (!communityName || !location || !population) {
          Alert.alert('Error', 'Please fill in all coastal community details');
          return false;
        }
        break;
    }

    return true;
  };

  const getUserSpecificData = () => {
    switch (userType) {
      case 'shipping':
        return {
          companyName: companyName.trim(),
          fleetSize: parseInt(fleetSize) || 0,
          vesselType: vesselType.trim(),
        };
      case 'port':
        return {
          portName: portName.trim(),
          portLocation: portLocation.trim(),
          authorityCode: authorityCode.trim(),
        };
      case 'environmental':
        return {
          orgName: orgName.trim(),
          orgType: orgType.trim(),
          focusArea: focusArea.trim(),
        };
      case 'community':
        return {
          communityName: communityName.trim(),
          location: location.trim(),
          population: parseInt(population) || 0,
        };
      default:
        return {};
    }
  };

  // Get role based on user type (Role-Based Access Control)
  const getRoleFromUserType = (type: UserType): string => {
    const roleMap: Record<UserType, string> = {
      shipping: 'shipping_manager',
      port: 'port_authority',
      environmental: 'environmental_officer',
      community: 'community_member',
    };
    return roleMap[type];
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('🚀 Starting registration process...');

      // 1. Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('✅ Firebase Auth user created:', user.uid);

      // 2. Update user profile with display name
      const displayName = getUserDisplayName();
      await updateProfile(user, { displayName });
      console.log('✅ User profile updated');

      // 3. Prepare user data for Firestore with RBAC
      const userData: UserData = {
        uid: user.uid,
        email: email.toLowerCase().trim(),
        userType,
        role: getRoleFromUserType(userType), // RBAC role
        ...getUserSpecificData(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true,
      };

      // 4. Save user data to Firestore
      await setDoc(doc(db, 'users', user.uid), userData);
      console.log('✅ User data saved to Firestore');

      // 5. Create role-specific collection entry
      await createRoleSpecificEntry(user.uid, userData);

      // Success
      Alert.alert(
        '✅ Success!',
        'Account created successfully! Please login to continue.',
        [
          {
            text: 'Go to Login',
            onPress: () => {
              // Sign out user to require login
              auth.signOut();
              router.replace('/(tabs)/Login');
            },
          },
        ]
      );

    } catch (error: any) {
      console.error('❌ Registration error:', error);
      
      let errorMessage = 'An error occurred during registration. Please try again.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered. Please login or use a different email.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'The email address is invalid.';
          break;
        case 'auth/weak-password':
          errorMessage = 'The password is too weak. Please use a stronger password.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password authentication is not enabled. Please contact support.';
          break;
        default:
          errorMessage = error.message || 'Registration failed. Please try again.';
      }
      
      Alert.alert('Registration Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Get display name based on user type
  const getUserDisplayName = (): string => {
    switch (userType) {
      case 'shipping':
        return companyName;
      case 'port':
        return portName;
      case 'environmental':
        return orgName;
      case 'community':
        return communityName;
      default:
        return email.split('@')[0];
    }
  };

  // Create role-specific collection entry for better querying
  const createRoleSpecificEntry = async (uid: string, userData: UserData) => {
    try {
      const collectionMap: Record<UserType, string> = {
        shipping: 'shipping_companies',
        port: 'port_authorities',
        environmental: 'environmental_orgs',
        community: 'communities',
      };

      const collectionName = collectionMap[userType];
      await setDoc(doc(db, collectionName, uid), {
        ...userData,
        userId: uid,
      });
      console.log(`✅ Created entry in ${collectionName}`);
    } catch (error) {
      console.error('⚠️ Error creating role-specific entry:', error);
      // Non-critical error, don't throw
    }
  };

  const handleLogin = () => {
    router.push('/(tabs)/Login');
  };

  const userTypes = [
    {
      id: 'shipping' as UserType,
      title: 'Shipping & Captains',
      icon: 'anchor' as FeatherIconName,
      description: 'Company vessels and ship operations'
    },
    {
      id: 'port' as UserType,
      title: 'Port Authorities',
      icon: 'map-pin' as FeatherIconName,
      description: 'Port management and operations'
    },
    {
      id: 'environmental' as UserType,
      title: 'Environmental',
      icon: 'globe' as FeatherIconName,
      description: 'Conservation and research'
    },
    {
      id: 'community' as UserType,
      title: 'Coastal Community',
      icon: 'users' as FeatherIconName,
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
                placeholder="Company Name *"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={companyName}
                onChangeText={setCompanyName}
                editable={!isLoading}
              />
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Feather name="navigation" size={20} color="rgba(255,255,255,0.7)" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Fleet Size *"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={fleetSize}
                onChangeText={setFleetSize}
                keyboardType="numeric"
                editable={!isLoading}
              />
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Feather name="compass" size={20} color="rgba(255,255,255,0.7)" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Primary Vessel Type *"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={vesselType}
                onChangeText={setVesselType}
                editable={!isLoading}
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
                placeholder="Port Name *"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={portName}
                onChangeText={setPortName}
                editable={!isLoading}
              />
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Feather name="map" size={20} color="rgba(255,255,255,0.7)" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Port Location *"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={portLocation}
                onChangeText={setPortLocation}
                editable={!isLoading}
              />
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Feather name="key" size={20} color="rgba(255,255,255,0.7)" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Authority Code *"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={authorityCode}
                onChangeText={setAuthorityCode}
                editable={!isLoading}
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
                placeholder="Organization Name *"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={orgName}
                onChangeText={setOrgName}
                editable={!isLoading}
              />
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Feather name="git-branch" size={20} color="rgba(255,255,255,0.7)" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Organization Type *"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={orgType}
                onChangeText={setOrgType}
                editable={!isLoading}
              />
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Feather name="target" size={20} color="rgba(255,255,255,0.7)" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Focus Area *"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={focusArea}
                onChangeText={setFocusArea}
                editable={!isLoading}
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
                placeholder="Community Name *"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={communityName}
                onChangeText={setCommunityName}
                editable={!isLoading}
              />
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Feather name="map-pin" size={20} color="rgba(255,255,255,0.7)" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Location *"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={location}
                onChangeText={setLocation}
                editable={!isLoading}
              />
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Feather name="bar-chart" size={20} color="rgba(255,255,255,0.7)" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Approximate Population *"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={population}
                onChangeText={setPopulation}
                keyboardType="numeric"
                editable={!isLoading}
              />
            </View>
          </>
        );
      
      default:
        return null;
    }
  };

  const accentColor = '#06bfdb';
  const gradientColors: (string)[] = ['#0a1929', '#1a365d', '#065f9d', '#000000'];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <Animated.View style={[styles.bgWrapper, { transform: [{ scale: scaleAnim }] }]}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&q=80',
          }}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={gradientColors as [string, string, string, string]}
          style={styles.gradient}
        />
      </Animated.View>

      <View style={styles.particles}>
        {[...Array(6)].map((_, i) => (
          <View
            key={`particle-${i}`}
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
            <View style={styles.iconSection}>
              <View style={[styles.iconGlow, { backgroundColor: accentColor }]} />
              <View style={[styles.iconRing, { borderColor: accentColor }]}>
                <View style={[styles.iconInner, { backgroundColor: accentColor }]}>
                  <Feather name="user-plus" size={40} color="#000" />
                </View>
              </View>
            </View>

            <View style={styles.textSection}>
              <Text style={styles.title}>Create{'\n'}Account</Text>
              <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
              <Text style={styles.subtitle}>Join Marine Nav community</Text>
              <Text style={styles.description}>
                Select your role and start your maritime journey with us.
              </Text>
            </View>

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
                  disabled={isLoading}
                >
                  <View style={[
                    styles.userTypeIcon,
                    { backgroundColor: userType === type.id ? accentColor : 'rgba(255,255,255,0.1)' }
                  ]}>
                    <Feather 
                      name={type.icon} 
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

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Feather name="mail" size={20} color="rgba(255,255,255,0.7)" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Email address *"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Feather name="lock" size={20} color="rgba(255,255,255,0.7)" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Password *"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
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
                  placeholder="Confirm Password *"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoComplete="password"
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  <Feather
                    name={showConfirmPassword ? 'eye' : 'eye-off'}
                    size={20}
                    color="rgba(255,255,255,0.7)"
                  />
                </TouchableOpacity>
              </View>

              {renderUserTypeFields()}

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
                      <ActivityIndicator size="small" color="#000" />
                      <Text style={styles.buttonText}>Creating...</Text>
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

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={handleLogin} disabled={isLoading}>
                  <Text style={[styles.loginText, styles.loginLink]}>
                    Sign in
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
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