import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const AboutUs: React.FC = () => {
  const router = useRouter();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const features = [
    { icon: 'navigation', title: 'Advanced Navigation', description: 'Real-time nautical charts and GPS' },
    { icon: 'cloud', title: 'Weather Alerts', description: 'Instant marine weather notifications' },
    { icon: 'book', title: 'Education', description: 'Learn marine safety and regulations' },
    { icon: 'shield', title: 'Safety First', description: 'Collision avoidance & warnings' },
  ];

  const team = [
    { name: 'Captain Alex Morgan', role: 'CEO & Founder', icon: 'user' },
    { name: 'Sarah Chen', role: 'CTO', icon: 'cpu' },
    { name: 'James Wilson', role: 'Product Lead', icon: 'layers' },
    { name: 'Maria Garcia', role: 'Safety Advisor', icon: 'shield' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <LinearGradient
        colors={['#0a1929', '#1a365d', '#0f172a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Hero Section */}
          <View style={styles.heroCard}>
            <View style={styles.logoContainer}>
              <View style={styles.logoBg}>
                <Feather name="anchor" size={40} color="#06bfdb" />
              </View>
            </View>
            <Text style={styles.heroTitle}>Marine Nav</Text>
            <Text style={styles.heroSubtitle}>Your Trusted Maritime Companion</Text>
            <Text style={styles.heroText}>
              Empowering mariners with cutting-edge navigation technology, real-time weather alerts, and comprehensive marine education since 2022.
            </Text>
          </View>

          {/* Mission Section */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Feather name="target" size={24} color="#06bfdb" />
              <Text style={styles.sectionTitle}>Our Mission</Text>
            </View>
            <Text style={styles.sectionText}>
              To revolutionize marine navigation by providing safe, reliable, and innovative technology that empowers seafarers to navigate with confidence and protect our oceans.
            </Text>
          </View>

          {/* Core Values */}
          <Text style={styles.heading}>Core Values</Text>
          <View style={styles.valuesContainer}>
            <View style={styles.valueCard}>
              <Feather name="check-circle" size={20} color="#10b981" />
              <Text style={styles.valueTitle}>Safety First</Text>
              <Text style={styles.valueText}>Maritime safety is our priority</Text>
            </View>
            <View style={styles.valueCard}>
              <Feather name="zap" size={20} color="#f59e0b" />
              <Text style={styles.valueTitle}>Innovation</Text>
              <Text style={styles.valueText}>Cutting-edge technology</Text>
            </View>
            <View style={styles.valueCard}>
              <Feather name="heart" size={20} color="#ef4444" />
              <Text style={styles.valueTitle}>Sustainability</Text>
              <Text style={styles.valueText}>Protecting marine environment</Text>
            </View>
          </View>

          {/* Features */}
          <Text style={styles.heading}>Our Features</Text>
          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Feather name={feature.icon as any} size={20} color="#06bfdb" />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDesc}>{feature.description}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Leadership Team */}
          <Text style={styles.heading}>Leadership Team</Text>
          <View style={styles.teamContainer}>
            {team.map((member, index) => (
              <View key={index} style={styles.teamMember}>
                <View style={styles.memberAvatar}>
                  <Feather name={member.icon as any} size={24} color="#06bfdb" />
                </View>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberRole}>{member.role}</Text>
              </View>
            ))}
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>500K+</Text>
              <Text style={styles.statLabel}>Active Users</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>150+</Text>
              <Text style={styles.statLabel}>Countries</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4.8★</Text>
              <Text style={styles.statLabel}>App Rating</Text>
            </View>
          </View>

          {/* Contact Section */}
          <View style={styles.contactCard}>
            <Feather name="mail" size={24} color="#22d3ee" />
            <Text style={styles.contactTitle}>Get in Touch</Text>
            <Text style={styles.contactText}>Have questions? We'd love to hear from you</Text>
            <TouchableOpacity style={styles.contactButton}>
              <Text style={styles.contactButtonText}>Contact Us</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2024 Marine Navigation Systems</Text>
            <Text style={styles.footerVersion}>Version 2.1.4</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a1929' },
  gradient: { position: 'absolute', width: '100%', height: '100%' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
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
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  heroCard: {
    backgroundColor: 'rgba(6, 191, 219, 0.1)',
    borderRadius: 24,
    padding: 32,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(6, 191, 219, 0.3)',
    alignItems: 'center',
  },
  logoContainer: { marginBottom: 16 },
  logoBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(6, 191, 219, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#06bfdb',
  },
  heroTitle: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 4 },
  heroSubtitle: { fontSize: 16, fontWeight: '600', color: '#06bfdb', marginBottom: 12 },
  heroText: { fontSize: 14, color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 22 },
  sectionCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#fff', flex: 1 },
  sectionText: { fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 22 },
  heading: { fontSize: 18, fontWeight: '700', color: '#fff', marginTop: 24, marginBottom: 12 },
  valuesContainer: { gap: 12, marginBottom: 24 },
  valueCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  valueTitle: { fontSize: 15, fontWeight: '600', color: '#fff', marginTop: 8, marginBottom: 4 },
  valueText: { fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  featuresContainer: { gap: 12, marginBottom: 24 },
  featureItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(6, 191, 219, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureContent: { flex: 1 },
  featureTitle: { fontSize: 15, fontWeight: '600', color: '#fff', marginBottom: 2 },
  featureDesc: { fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  teamContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  teamMember: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(6, 191, 219, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  memberName: { fontSize: 13, fontWeight: '600', color: '#fff', textAlign: 'center', marginBottom: 2 },
  memberRole: { fontSize: 11, color: 'rgba(255,255,255,0.6)', textAlign: 'center' },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    backgroundColor: 'rgba(6, 191, 219, 0.1)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(6, 191, 219, 0.3)',
  },
  statNumber: { fontSize: 20, fontWeight: '800', color: '#06bfdb', marginBottom: 4 },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.6)', textAlign: 'center' },
  contactCard: {
    backgroundColor: 'rgba(34, 211, 238, 0.1)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(34, 211, 238, 0.3)',
    marginBottom: 24,
  },
  contactTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginTop: 12, marginBottom: 4 },
  contactText: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 16 },
  contactButton: {
    backgroundColor: '#06bfdb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  contactButtonText: { fontSize: 14, fontWeight: '600', color: '#000' },
  footer: { alignItems: 'center', marginTop: 24 },
  footerText: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 4 },
  footerVersion: { fontSize: 12, color: 'rgba(255,255,255,0.3)' },
});

export default AboutUs;