import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking
} from 'react-native';
import { Anchor } from 'lucide-react-native';

const Footer = () => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:support@econav.maritime');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+15551234567');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Company Info */}
        <View style={styles.section}>
          <View style={styles.logoContainer}>
            <Anchor size={32} color="#60a5fa" />
            <Text style={styles.logoText}>EcoNav</Text>
          </View>
          <Text style={styles.description}>
            Leading the future of sustainable maritime navigation with cutting-edge real-time tracking,
            environmental optimization, and AI-powered route planning solutions.
          </Text>
          
          <View style={styles.emojiContainer}>
            {['🌊', '⚓', '🚢', '🌍'].map((emoji, index) => (
              <TouchableOpacity key={index} style={styles.emojiButton}>
                <Text style={styles.emoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get In Touch</Text>
          
          <TouchableOpacity style={styles.contactItem} onPress={handleEmailPress}>
            <Text style={styles.contactIcon}>📧</Text>
            <Text style={styles.contactText}>support@econav.maritime</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.contactItem} onPress={handlePhonePress}>
            <Text style={styles.contactIcon}>📞</Text>
            <Text style={styles.contactText}>+1 (555) 123-4567</Text>
          </TouchableOpacity>
          
          <View style={styles.contactItem}>
            <Text style={styles.contactIcon}>📍</Text>
            <Text style={styles.contactText}>Maritime Technology Center, Port District</Text>
          </View>
          
          <View style={styles.supportBanner}>
            <View style={styles.supportHeader}>
              <Text style={styles.supportIcon}>🚨</Text>
              <Text style={styles.supportTitle}>24/7 Maritime Support</Text>
            </View>
            <Text style={styles.supportText}>
              Emergency assistance and technical support available around the clock
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <Text style={styles.copyright}>
          © 2025 EcoNav Maritime Solutions. All rights reserved.
        </Text>
        
        <View style={styles.links}>
          {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link, index) => (
            <TouchableOpacity key={index}>
              <Text style={styles.link}>{link}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1f2937',
    padding: 20,
    marginTop: 24,
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  section: {
    flex: 1,
    minWidth: 300,
    marginBottom: 24,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  description: {
    color: '#9ca3af',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  emojiContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  emojiButton: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.2)',
  },
  emoji: {
    fontSize: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f3f4f6',
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 24,
  },
  contactText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  supportBanner: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    marginTop: 16,
  },
  supportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  supportIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  supportTitle: {
    color: '#60a5fa',
    fontWeight: 'bold',
    fontSize: 16,
  },
  supportText: {
    color: '#9ca3af',
    fontSize: 12,
  },
  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: '#374151',
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  copyright: {
    color: '#9ca3af',
    fontSize: 12,
    flex: 1,
  },
  links: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  link: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default Footer;