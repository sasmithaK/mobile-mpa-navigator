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

const TermsConditions: React.FC = () => {
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
      title: 'Acceptance of Terms',
      content: 'By downloading, installing, and using Marine Nav, you agree to be bound by these Terms and Conditions. If you do not agree to any part of these terms, you may not use the application. We reserve the right to modify these terms at any time, and continued use of the application constitutes acceptance of any modifications.',
    },
    {
      id: 2,
      title: 'Use License',
      content: 'Marine Nav grants you a limited, non-exclusive, non-transferable license to use this application for personal, non-commercial purposes. You may not reproduce, modify, distribute, or transmit any content without prior written consent. All rights not expressly granted are reserved.',
    },
    {
      id: 3,
      title: 'User Responsibilities',
      content: 'Users are responsible for maintaining the confidentiality of their account information and password. You agree to accept responsibility for all activities that occur under your account. You must comply with all applicable laws and regulations when using Marine Nav.',
    },
    {
      id: 4,
      title: 'Limitation of Liability',
      content: 'Marine Nav and its developers shall not be liable for any indirect, incidental, special, consequential, or punitive damages. The app is provided "as is" without warranty of any kind. We do not guarantee uninterrupted or error-free service.',
    },
    {
      id: 5,
      title: 'Navigation Safety',
      content: 'Marine Nav is a supplementary navigation tool and should not be relied upon as the sole source for navigation decisions. Users must follow all maritime regulations and official navigation guidelines. Always prioritize official charts and navigation authorities over app data.',
    },
    {
      id: 6,
      title: 'Termination',
      content: 'We may terminate or suspend your account and access to Marine Nav immediately, without prior notice or liability, for any reason, including if you violate any terms of this agreement. Upon termination, your rights under these terms will immediately cease.',
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
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
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
              <Feather name="file-text" size={32} color="#06bfdb" />
            </View>
            <Text style={styles.infoTitle}>Terms & Conditions</Text>
            <Text style={styles.infoText}>Last updated: January 2024. Please read these terms carefully before using Marine Nav.</Text>
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
            <Text style={styles.contactTitle}>Questions?</Text>
            <Text style={styles.contactText}>If you have questions about these Terms & Conditions, please contact us at legal@marinenav.com</Text>
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
    marginBottom: 24,
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

export default TermsConditions;
