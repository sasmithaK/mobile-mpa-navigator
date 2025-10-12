import React, { useState } from 'react';
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

const PrivacyPolicy: React.FC = () => {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const sections = [
    {
      id: 1,
      title: 'Information We Collect',
      content: 'We collect information you provide directly such as your name, email, and account details. We also automatically collect location data, device information, and usage analytics to improve our services. GPS data is only collected when you grant permission and have the app running.',
    },
    {
      id: 2,
      title: 'How We Use Your Information',
      content: 'We use your information to provide navigation services, send weather alerts, improve app functionality, and comply with legal obligations. Your data helps us understand usage patterns and deliver better features. We never sell your personal information to third parties.',
    },
    {
      id: 3,
      title: 'Data Security',
      content: 'We employ industry-standard security measures to protect your data. All communications are encrypted using SSL/TLS protocols. However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security but are committed to protecting your information.',
    },
    {
      id: 4,
      title: 'Third-Party Services',
      content: 'Marine Nav integrates with third-party weather services, mapping providers, and analytics platforms. These services have their own privacy policies. We recommend reviewing their policies as we are not responsible for their practices.',
    },
    {
      id: 5,
      title: 'Your Privacy Rights',
      content: 'You have the right to access, modify, or delete your personal information. You can opt-out of non-essential data collection in your app settings. For data deletion requests, contact privacy@marinenav.com with your account details.',
    },
    {
      id: 6,
      title: 'Changes to This Policy',
      content: 'We may update this Privacy Policy periodically. We will notify you of significant changes via email or through the app. Your continued use of Marine Nav after changes constitute acceptance of the updated policy.',
    },
  ];

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

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
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <Feather name="shield" size={32} color="#06bfdb" />
            </View>
            <Text style={styles.infoTitle}>Privacy Policy</Text>
            <Text style={styles.infoText}>We respect your privacy and are committed to protecting your personal data. Last updated: January 2024.</Text>
          </View>

          <View style={styles.trustBadge}>
            <Feather name="lock" size={16} color="#10b981" />
            <Text style={styles.trustText}>Your privacy is our top priority</Text>
          </View>

          <View style={styles.sectionsContainer}>
            {sections.map((section, index) => (
              <TouchableOpacity
                key={section.id}
                style={[
                  styles.section,
                  expandedId === section.id && styles.sectionExpanded,
                ]}
                onPress={() => toggleExpand(section.id)}
                activeOpacity={0.7}
              >
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionNumber}>{index + 1}.</Text>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                  </View>
                  <Feather
                    name={expandedId === section.id ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#06bfdb"
                  />
                </View>

                {expandedId === section.id && (
                  <View style={styles.sectionContent}>
                    <Text style={styles.contentText}>{section.content}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.contactCard}>
            <Feather name="mail" size={20} color="#22d3ee" />
            <Text style={styles.contactTitle}>Privacy Inquiries</Text>
            <Text style={styles.contactText}>For privacy concerns or data requests, contact us at privacy@marinenav.com</Text>
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
  infoCard: {
    backgroundColor: 'rgba(6, 191, 219, 0.1)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(6, 191, 219, 0.3)',
    alignItems: 'center',
  },
  infoIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(6, 191, 219, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 8, textAlign: 'center' },
  infoText: { fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 20 },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 24,
    alignSelf: 'center',
  },
  trustText: { fontSize: 13, fontWeight: '600', color: '#10b981' },
  sectionsContainer: { gap: 12, marginBottom: 24 },
  section: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  sectionExpanded: {
    backgroundColor: 'rgba(6, 191, 219, 0.1)',
    borderColor: 'rgba(6, 191, 219, 0.3)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitleContainer: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, flex: 1 },
  sectionNumber: { fontSize: 16, fontWeight: '700', color: '#06bfdb', minWidth: 24 },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: '#fff', flex: 1, lineHeight: 20 },
  sectionContent: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  contentText: { fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 22 },
  contactCard: {
    backgroundColor: 'rgba(34, 211, 238, 0.1)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(34, 211, 238, 0.3)',
  },
  contactTitle: { fontSize: 16, fontWeight: '600', color: '#fff', marginTop: 8, marginBottom: 4 },
  contactText: { fontSize: 13, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
});

export default PrivacyPolicy;