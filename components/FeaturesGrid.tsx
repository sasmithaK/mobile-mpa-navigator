import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions
} from 'react-native';
import { AlertTriangle, BarChart3 } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const FeaturesGrid = () => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <View style={styles.featureCard}>
        <View style={styles.cardHeader}>
          <AlertTriangle size={24} color="#f59e0b" />
          <Text style={styles.cardTitle}>Environmental Compliance</Text>
        </View>
        
        <Text style={styles.cardDescription}>
          Advanced monitoring system for marine protected areas, emission control zones, and environmental regulations.
        </Text>
        
        <View style={styles.featuresList}>
          {[
            { icon: '🌊', title: 'Marine Protected Areas', desc: 'Real-time zone monitoring and alerts' },
            { icon: '📊', title: 'Emission Tracking', desc: 'Comprehensive environmental impact analysis' },
            { icon: '🎯', title: 'Route Optimization', desc: 'Eco-friendly path recommendations' }
          ].map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.featureCard}>
        <View style={styles.cardHeader}>
          <BarChart3 size={24} color="#10b981" />
          <Text style={styles.cardTitle}>Advanced Analytics</Text>
        </View>
        
        <Text style={styles.cardDescription}>
          Comprehensive fleet performance insights with AI-powered optimization and predictive analytics.
        </Text>
        
        <View style={styles.featuresList}>
          {[
            { icon: '⛽', title: 'Fuel Efficiency', desc: 'Real-time consumption monitoring' },
            { icon: '🔍', title: 'Performance Metrics', desc: 'Detailed operational analytics' },
            { icon: '🌍', title: 'Carbon Footprint', desc: 'Environmental impact assessment' }
          ].map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  featureCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    marginHorizontal: 8,
    width: width * 0.8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 32,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 12,
  },
  cardDescription: {
    color: '#6b7280',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  featureIcon: {
    fontSize: 24,
    width: 40,
    textAlign: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 12,
    color: '#6b7280',
  },
});

export default FeaturesGrid;