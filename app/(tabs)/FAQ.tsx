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

const FAQ: React.FC = () => {
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

  const faqItems = [
    {
      id: 1,
      question: 'How do I start navigation on Marine Nav?',
      answer: 'To start navigation, open the app, go to the Home screen, and tap the "Start Navigation" card. Grant location permissions when prompted, and you\'ll see your live nautical map with GPS positioning. You can then create or follow pre-saved routes.',
    },
    {
      id: 2,
      question: 'What features are included in the free version?',
      answer: 'The free version includes basic navigation, weather alerts, and access to our educational hub. Premium features include advanced route optimization, detailed weather forecasting, and priority support.',
    },
    {
      id: 3,
      question: 'How often is the weather data updated?',
      answer: 'Weather data is updated every 30 minutes from our real-time sources. Critical weather alerts can be pushed to your device within 5 minutes of detection.',
    },
    {
      id: 4,
      question: 'Can I save routes for offline use?',
      answer: 'Yes! You can save routes to your device for offline access. The app requires an initial download of chart data (about 500MB). After that, you can navigate without internet connectivity.',
    },
    {
      id: 5,
      question: 'How do I report a hazard or issue?',
      answer: 'Use the "Report an Issue" option in your Profile settings. You can report hazards, inaccuracies in charts, or app bugs. Your reports help us improve Marine Nav for all users.',
    },
    {
      id: 6,
      question: 'What safety features does Marine Nav offer?',
      answer: 'Marine Nav includes collision avoidance alerts, weather warnings, shallow water warnings, and automated distress signaling. Always prioritize official safety guidelines and follow maritime regulations.',
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
        <Text style={styles.headerTitle}>FAQ & Help Center</Text>
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
              <Feather name="help-circle" size={32} color="#06bfdb" />
            </View>
            <Text style={styles.infoTitle}>Frequently Asked Questions</Text>
            <Text style={styles.infoText}>Find answers to common questions about Marine Nav. Still need help? Contact our support team.</Text>
          </View>

          <View style={styles.searchContainer}>
            <Feather name="search" size={18} color="rgba(255,255,255,0.5)" />
            <Text style={styles.searchPlaceholder}>Search questions...</Text>
          </View>

          <View style={styles.faqContainer}>
            {faqItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.faqItem,
                  expandedId === item.id && styles.faqItemExpanded,
                ]}
                onPress={() => toggleExpand(item.id)}
                activeOpacity={0.7}
              >
                <View style={styles.faqHeader}>
                  <View style={styles.questionContent}>
                    <Text style={styles.questionNumber}>{index + 1}</Text>
                    <Text style={styles.questionText}>{item.question}</Text>
                  </View>
                  <Feather
                    name={expandedId === item.id ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#06bfdb"
                  />
                </View>

                {expandedId === item.id && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.answerText}>{item.answer}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.contactSection}>
            <View style={styles.contactCard}>
              <Feather name="mail" size={24} color="#22d3ee" />
              <Text style={styles.contactTitle}>Still have questions?</Text>
              <Text style={styles.contactSubtitle}>Our support team is here to help</Text>
              <TouchableOpacity style={styles.contactButton}>
                <Text style={styles.contactButtonText}>Contact Support</Text>
                <Feather name="arrow-right" size={16} color="#06bfdb" />
              </TouchableOpacity>
            </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  searchPlaceholder: { marginLeft: 12, color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: '500' },
  faqContainer: { gap: 12, marginBottom: 24 },
  faqItem: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  faqItemExpanded: { backgroundColor: 'rgba(6, 191, 219, 0.1)', borderColor: 'rgba(6, 191, 219, 0.3)' },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionContent: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, flex: 1 },
  questionNumber: { fontSize: 16, fontWeight: '700', color: '#06bfdb', minWidth: 24 },
  questionText: { fontSize: 15, fontWeight: '600', color: '#fff', flex: 1, lineHeight: 20 },
  faqAnswer: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  answerText: { fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 22 },
  contactSection: { marginBottom: 24 },
  contactCard: {
    backgroundColor: 'rgba(34, 211, 238, 0.1)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(34, 211, 238, 0.3)',
  },
  contactTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginTop: 12, marginBottom: 4 },
  contactSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 16 },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(6, 191, 219, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  contactButtonText: { fontSize: 14, fontWeight: '600', color: '#06bfdb' },
});

export default FAQ;