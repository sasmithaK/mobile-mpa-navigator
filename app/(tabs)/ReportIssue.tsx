import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  TextInput,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ReportIssue: React.FC = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const categories = [
    { id: 'bug', label: 'Bug Report', icon: 'alert-circle', color: '#ef4444' },
    { id: 'chart', label: 'Chart Inaccuracy', icon: 'map', color: '#f59e0b' },
    { id: 'crash', label: 'App Crash', icon: 'zap', color: '#ec4899' },
    { id: 'feature', label: 'Feature Request', icon: 'lightbulb', color: '#06bfdb' },
    { id: 'performance', label: 'Performance', icon: 'activity', color: '#8b5cf6' },
    { id: 'other', label: 'Other', icon: 'more-horizontal', color: '#10b981' },
  ];

  const handleSubmit = () => {
    if (!selectedCategory || !title || !description) {
      alert('Please fill in all fields');
      return;
    }
    console.log('Issue reported:', { category: selectedCategory, title, description });
    alert('Thank you for reporting! Your issue has been logged.');
    setSelectedCategory(null);
    setTitle('');
    setDescription('');
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
        <Text style={styles.headerTitle}>Report an Issue</Text>
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
              <Feather name="alert-triangle" size={32} color="#06bfdb" />
            </View>
            <Text style={styles.infoTitle}>Report a Problem</Text>
            <Text style={styles.infoText}>Help us improve Marine Nav by reporting any issues you encounter. Your feedback is valuable.</Text>
          </View>

          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.categoryGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  selectedCategory === category.id && styles.categoryCardSelected,
                ]}
                onPress={() => setSelectedCategory(category.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.categoryIconContainer,
                    { backgroundColor: `${category.color}20` },
                  ]}
                >
                  <Feather name={category.icon as any} size={24} color={category.color} />
                </View>
                <Text style={styles.categoryLabel}>{category.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Issue Details</Text>
          <View style={styles.formContainer}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Brief description of the issue"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="Provide detailed information about the issue, steps to reproduce, etc."
                placeholderTextColor="rgba(255,255,255,0.4)"
                multiline
                numberOfLines={6}
                value={description}
                onChangeText={setDescription}
              />
            </View>

            <View style={styles.infoBox}>
              <Feather name="info" size={16} color="#22d3ee" />
              <Text style={styles.infoBoxText}>Including device type, OS version, and app version helps us resolve issues faster.</Text>
            </View>

            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#06bfdb', '#0891b2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitGradient}
              >
                <Feather name="check-circle" size={18} color="#000" />
                <Text style={styles.submitText}>Submit Report</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.impactCard}>
            <Feather name="heart" size={20} color="#ef4444" />
            <Text style={styles.impactTitle}>Your Impact</Text>
            <Text style={styles.impactText}>Every report helps us create a safer and more reliable app for all mariners.</Text>
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
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginTop: 24, marginBottom: 12 },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  categoryCard: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  categoryCardSelected: {
    backgroundColor: 'rgba(6, 191, 219, 0.15)',
    borderColor: '#06bfdb',
  },
  categoryIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryLabel: { fontSize: 12, fontWeight: '600', color: '#fff', textAlign: 'center' },
  formContainer: { marginBottom: 24 },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#fff', marginBottom: 8 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    fontSize: 14,
  },
  descriptionInput: { textAlignVertical: 'top', paddingTop: 12 },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(34, 211, 238, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  infoBoxText: { fontSize: 12, color: 'rgba(255,255,255,0.7)', flex: 1 },
  submitButton: { borderRadius: 12, overflow: 'hidden', marginTop: 8 },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  submitText: { fontSize: 16, fontWeight: '600', color: '#000' },
  impactCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  impactTitle: { fontSize: 16, fontWeight: '600', color: '#fff', marginTop: 8, marginBottom: 4 },
  impactText: { fontSize: 13, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
});

export default ReportIssue;