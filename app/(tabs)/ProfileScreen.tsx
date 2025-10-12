import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
  ScrollView,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [locationServices, setLocationServices] = React.useState(true);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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
    ]).start();
  }, []);

  const handleEditProfile = () => {
    console.log('Navigate to edit profile');
  };

  const handleNavigation = (screen: string) => {
    router.push(screen as any);
  };

  const handleLogout = () => {
    router.push('/(tabs)/Login');
  };

  const accentColor = '#06bfdb';

  const settingsCards = [
    {
      id: 1,
      title: 'App Settings',
      icon: 'settings' as const,
      items: [
        {
          id: 1,
          label: 'Push Notifications',
          value: notifications,
          onValueChange: setNotifications,
          type: 'switch' as const,
        },
        {
          id: 2,
          label: 'Dark Mode',
          value: darkMode,
          onValueChange: setDarkMode,
          type: 'switch' as const,
        },
        {
          id: 3,
          label: 'Location Services',
          value: locationServices,
          onValueChange: setLocationServices,
          type: 'switch' as const,
        },
      ],
    },
    {
      id: 2,
      title: 'Support',
      icon: 'help-circle' as const,
      items: [
        {
          id: 1,
          label: 'FAQ & Help Center',
          icon: 'help-circle' as const,
          onPress: () => handleNavigation('FAQ'),
          type: 'link' as const,
        },
        {
          id: 2,
          label: 'Contact Support',
          icon: 'mail' as const,
          onPress: () => handleNavigation('ContactSupport'),
          type: 'link' as const,
        },
        {
          id: 3,
          label: 'Report an Issue',
          icon: 'alert-triangle' as const,
          onPress: () => handleNavigation('ReportIssue'),
          type: 'link' as const,
        },
      ],
    },
    {
      id: 3,
      title: 'Legal',
      icon: 'file-text' as const,
      items: [
        {
          id: 1,
          label: 'Terms & Conditions',
          icon: 'file-text' as const,
          onPress: () => handleNavigation('TermsConditions'),
          type: 'link' as const,
        },
        {
          id: 2,
          label: 'Privacy Policy',
          icon: 'shield' as const,
          onPress: () => handleNavigation('PrivacyPolicy'),
          type: 'link' as const,
        },
        {
          id: 3,
          label: 'About Us',
          icon: 'info' as const,
          onPress: () => handleNavigation('AboutUs'),
          type: 'link' as const,
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Background */}
      <View style={styles.bgWrapper}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
          }}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['#0a1929', '#1a365d', '#065f9d', '#000000']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </View>

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
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={[styles.logoRing, { borderColor: accentColor }]}>
            <Feather name="user" size={20} color={accentColor} />
          </View>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarSection}>
              <View style={[styles.avatarGlow, { backgroundColor: accentColor }]} />
              <View style={[styles.avatarRing, { borderColor: accentColor }]}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' }}
                  style={styles.avatar}
                />
              </View>
              <TouchableOpacity style={styles.editAvatarBtn} onPress={handleEditProfile}>
                <Feather name="camera" size={16} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Captain Alex Morgan</Text>
              <View style={[styles.roleBadge, { backgroundColor: accentColor }]}>
                <Feather name="anchor" size={12} color="#000" />
                <Text style={styles.roleText}>Shipping Captain</Text>
              </View>
              <Text style={styles.profileEmail}>alex.morgan@marinenav.com</Text>
            </View>

            <TouchableOpacity style={styles.editProfileBtn} onPress={handleEditProfile}>
              <Feather name="edit-3" size={18} color="#fff" />
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(6, 191, 219, 0.2)' }]}>
                <Feather name="bar-chart-2" size={20} color={accentColor} />
              </View>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>Voyages</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(34, 211, 238, 0.2)' }]}>
                <Feather name="map" size={20} color="#22d3ee" />
              </View>
              <Text style={styles.statValue}>1,248</Text>
              <Text style={styles.statLabel}>NM Traveled</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                <Feather name="award" size={20} color="#10b981" />
              </View>
              <Text style={styles.statValue}>98%</Text>
              <Text style={styles.statLabel}>Compliance</Text>
            </View>
          </View>

          {/* Settings Cards */}
          <View style={styles.sectionsContainer}>
            {settingsCards.map((section) => (
              <View key={section.id} style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitleContainer}>
                    <Feather name={section.icon} size={20} color={accentColor} />
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                  </View>
                </View>

                <View style={styles.sectionItems}>
                  {section.items.map((item, index) => (
                    <React.Fragment key={item.id}>
                      <TouchableOpacity
                        style={styles.sectionItem}
                        onPress={item.type === 'link' ? item.onPress : undefined}
                        activeOpacity={item.type === 'link' ? 0.7 : 1}
                      >
                        <View style={styles.itemLeft}>
                          {item.type === 'link' && (
                            <Feather name={item.icon} size={18} color="rgba(255,255,255,0.7)" />
                          )}
                          <Text style={styles.itemLabel}>{item.label}</Text>
                        </View>

                        {item.type === 'switch' ? (
                          <Switch
                            value={item.value}
                            onValueChange={item.onValueChange}
                            trackColor={{ false: 'rgba(255,255,255,0.2)', true: accentColor }}
                            thumbColor="#fff"
                          />
                        ) : (
                          <Feather name="chevron-right" size={18} color="rgba(255,255,255,0.5)" />
                        )}
                      </TouchableOpacity>

                      {index < section.items.length - 1 && (
                        <View style={styles.itemSeparator} />
                      )}
                    </React.Fragment>
                  ))}
                </View>
              </View>
            ))}
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LinearGradient
              colors={['rgba(239, 68, 68, 0.8)', 'rgba(220, 38, 38, 0.9)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.logoutGradient}
            >
              <Feather name="log-out" size={20} color="#fff" />
              <Text style={styles.logoutText}>Sign Out</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Version Info */}
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Marine Nav v2.1.4</Text>
            <Text style={styles.copyrightText}>© 2024 Marine Navigation Systems</Text>
          </View>
        </Animated.View>
      </ScrollView>
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
  headerCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    zIndex: -1,
  },
  logoRing: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  headerRight: {
    width: 44,
  },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  profileHeader: { alignItems: 'center', marginBottom: 30 },
  avatarSection: { alignItems: 'center', marginBottom: 20 },
  avatarGlow: { position: 'absolute', width: 140, height: 140, borderRadius: 70, opacity: 0.15 },
  avatarRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    overflow: 'hidden',
  },
  avatar: { width: 110, height: 110, borderRadius: 55 },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#06bfdb',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  profileInfo: { alignItems: 'center', marginBottom: 20 },
  profileName: { fontSize: 28, fontWeight: '700', color: '#fff', textAlign: 'center', marginBottom: 8 },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
  },
  roleText: { fontSize: 12, fontWeight: '600', color: '#000' },
  profileEmail: { fontSize: 16, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  editProfileText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  statCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statValue: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 4 },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.6)', textAlign: 'center' },
  sectionsContainer: { gap: 20, marginBottom: 30 },
  sectionCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  sectionHeader: { marginBottom: 16 },
  sectionTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#fff' },
  sectionItems: { borderRadius: 12, overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.2)' },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  itemLabel: { fontSize: 16, color: 'rgba(255,255,255,0.9)', fontWeight: '500' },
  itemSeparator: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginHorizontal: 12 },
  logoutButton: { borderRadius: 16, overflow: 'hidden', marginBottom: 20 },
  logoutGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, paddingVertical: 16 },
  logoutText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  versionContainer: { alignItems: 'center' },
  versionText: { fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 4 },
  copyrightText: { fontSize: 12, color: 'rgba(255,255,255,0.3)' },
});

export default ProfileScreen;