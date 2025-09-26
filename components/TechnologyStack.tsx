import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions
} from 'react-native';
import { Map, Globe, Shield, Navigation, Zap, Cpu, Cloud, Database, BarChart3 } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const TechnologyStack = () => {
  const technologies = [
    {
      category: "Mapping & Visualization",
      items: [
        {
          name: "Leaflet Maps API",
          description: "Open-source JavaScript library for interactive maps",
          icon: Map,
          color: "#28a745",
          features: ["Custom vessel markers", "Interactive zone polygons", "Real-time position updates"]
        },
        {
          name: "Esri World Imagery",
          description: "High-resolution satellite and aerial imagery",
          icon: Globe,
          color: "#007bff",
          features: ["Base map layer", "Oceanographic data", "Coastal details"]
        }
      ]
    },
    {
      category: "Environmental Data",
      items: [
        {
          name: "Marine Protected Areas API",
          description: "Global database of sensitive marine zones",
          icon: Shield,
          color: "#ffc107",
          features: ["Real-world coordinates", "Restriction details", "Authority information"]
        }
      ]
    }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Advanced Technology Stack</Text>
      
      <Text style={styles.subtitle}>
        Our maritime monitoring system integrates multiple cutting-edge technologies 
        to provide comprehensive vessel tracking and environmental protection.
      </Text>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {technologies.map((category, categoryIndex) => (
          <View key={categoryIndex} style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <View style={styles.categoryIcon}>
                {categoryIndex === 0 && <Map size={20} color="white" />}
                {categoryIndex === 1 && <Shield size={20} color="white" />}
              </View>
              <Text style={styles.categoryTitle}>{category.category}</Text>
            </View>
            
            <View style={styles.techList}>
              {category.items.map((tech, techIndex) => (
                <View key={techIndex} style={styles.techCard}>
                  <View style={styles.techHeader}>
                    <View style={[styles.techIcon, { backgroundColor: tech.color + '20' }]}>
                      <tech.icon size={24} color={tech.color} />
                    </View>
                    <View>
                      <Text style={styles.techName}>{tech.name}</Text>
                      <Text style={styles.techDescription}>{tech.description}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.featuresList}>
                    {tech.features.map((feature, featureIndex) => (
                      <Text key={featureIndex} style={styles.feature}>
                        • {feature}
                      </Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    margin: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  categoriesContainer: {
    paddingRight: 16,
  },
  categoryCard: {
    width: width * 0.8,
    marginRight: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#e5e7eb',
  },
  categoryIcon: {
    backgroundColor: '#3b82f6',
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  techList: {
    gap: 16,
  },
  techCard: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  techHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  techIcon: {
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  techName: {
    fontWeight: '600',
    color: '#1f2937',
    fontSize: 16,
  },
  techDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  featuresList: {
    marginLeft: 4,
  },
  feature: {
    fontSize: 12,
    color: '#4b5563',
    marginBottom: 4,
  },
});

export default TechnologyStack;