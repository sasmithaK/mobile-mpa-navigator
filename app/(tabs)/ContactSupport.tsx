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

const ContactSupport: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const contactChannels = [
    {
      id: 1,
      icon: 'mail',
      title: 'Email',
      description: 'support@marinenav.com',
      color: '#22d3ee',
    },
    {
      id: 2,
      icon: 'phone',
      title: 'Phone',
      description: '+1 (555) 123-4567',
      color: '#10b981',
    },
    {
      id: 3,
      icon: 'message-square',
      title: 'Live Chat',
      description: 'Available 24/7',
      color: '#f59e0b',
    },
  ];

  const handleSubmit = () => {
    console.log('Support ticket submitted:', { name, email, subject, message });
    alert('Thank you! Your message has been sent to our support team.');
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
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
        <Text style={styles.headerTitle}>Contact Support</Text>
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
              <Feather name="headphones" size={32} color="#06bfdb" />
            </View>
            <Text style={styles.infoTitle}>Get Help Instantly</Text>
            <Text style={styles.infoText}>Our support team is ready to assist you with any questions or issues.</Text>
          </View>

          <Text style={styles.sectionTitle}>Contact Channels</Text>
          <View style={styles.channelsContainer}>
            {contactChannels.map((channel) => (
              <TouchableOpacity key={channel.id} style={styles.channelCard} activeOpacity={0.7}>
                <View style={[styles.channelIcon, { backgroundColor: `${channel.color}20` }]}>
                  <Feather name={channel.icon as any} size={24} color={channel.color} />
                </View>
                <Text style={styles.channelTitle}>{channel.title}</Text>
                <Text style={styles.channelDescription}>{channel.description}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Send us a Message</Text>
          <View style={styles.formContainer}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Captain John Doe"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="john@example.com"
                placeholderTextColor="rgba(255,255,255,0.4)"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Subject</Text>
              <TextInput
                style={styles.input}
                placeholder="How can we help?"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={subject}
                onChangeText={setSubject}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Message</Text>
              <TextInput
                style={[styles.input, styles.messageInput]}
                placeholder="Describe your issue in detail..."
                placeholderTextColor="rgba(255,255,255,0.4)"
                multiline
                numberOfLines={6}
                value={message}
                onChangeText={setMessage}
              />
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
                <Feather name="send" size={18} color="#000" />
                <Text style={styles.submitText}>Send Message</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.responseCard}>
            <Feather name="clock" size={20} color="#22d3ee" />
            <Text style={styles.responseTitle}>Response Time</Text>
            <Text style={styles.responseText}>We typically respond within 24 hours during business days.</Text>
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
  channelsContainer: { gap: 12, marginBottom: 24 },
  channelCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  channelIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  channelTitle: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 4 },
  channelDescription: { fontSize: 13, color: 'rgba(255,255,255,0.6)' },
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
  messageInput: { textAlignVertical: 'top', paddingTop: 12 },
  submitButton: { borderRadius: 12, overflow: 'hidden', marginTop: 8 },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  submitText: { fontSize: 16, fontWeight: '600', color: '#000' },
  responseCard: {
    backgroundColor: 'rgba(34, 211, 238, 0.1)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(34, 211, 238, 0.3)',
  },
  responseTitle: { fontSize: 16, fontWeight: '600', color: '#fff', marginTop: 8, marginBottom: 4 },
  responseText: { fontSize: 13, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
});

export default ContactSupport;
