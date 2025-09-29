import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
  Image
} from 'react-native';
import { 
  Leaf, 
  Fish, 
  Anchor, 
  AlertTriangle,
  BookOpen,
  Award,
  Users,
  Globe,
  Camera,
  MapPin,
  Waves,
  Shield,
  Info,
  ChevronRight,
  PlayCircle,
  FileText,
  Clock
} from 'lucide-react-native';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const { width, height } = Dimensions.get('window');

// TypeScript interfaces
interface EducationalTopic {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string[];
  description: string;
  readTime: string;
  image: string;
}

interface Stat {
  label: string;
  value: string;
  icon: React.ComponentType<any>;
}

const EcoComplianceHub: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('education');
  const scrollY = new Animated.Value(0);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const educationalTopics: EducationalTopic[] = [
    {
      id: 1,
      title: 'Marine Protected Areas',
      subtitle: 'Understanding conservation zones',
      icon: Shield,
      color: '#10b981',
      gradient: ['#10b981', '#059669'],
      description: 'Learn about different types of MPAs, their boundaries, and protection levels.',
      readTime: '5 min read',
      image: 'asserts/images/nav1.jpg' // Add to assets/images/
    },
    {
      id: 2,
      title: 'Marine Wildlife Protection',
      subtitle: 'Protecting ocean biodiversity',
      icon: Fish,
      color: '#3b82f6',
      gradient: ['#3b82f6', '#1d4ed8'],
      description: 'Discover endangered species, migration patterns, and conservation efforts.',
      readTime: '7 min read',
      image: 'asserts/images/nav2.jpg'
    },
    {
      id: 3,
      title: 'Sustainable Fishing Practices',
      subtitle: 'Responsible fishing guidelines',
      icon: Anchor,
      color: '#f59e0b',
      gradient: ['#f59e0b', '#d97706'],
      description: 'Best practices for sustainable fishing and marine resource management.',
      readTime: '6 min read',
      image: 'asserts/images/nav3.jpg'
    },
    {
      id: 4,
      title: 'Ocean Pollution Prevention',
      subtitle: 'Keeping our oceans clean',
      icon: Waves,
      color: '#06b6d4',
      gradient: ['#06b6d4', '#0891b2'],
      description: 'Understanding pollution sources and prevention strategies.',
      readTime: '4 min read',
      image: 'asserts/images/nav4.jpg'
    },
    {
      id: 5,
      title: 'Compliance Regulations',
      subtitle: 'Maritime laws & guidelines',
      icon: FileText,
      color: '#8b5cf6',
      gradient: ['#8b5cf6', '#7c3aed'],
      description: 'International and local regulations for marine conservation.',
      readTime: '8 min read',
      image: 'asserts/images/nav5.jpg'
    },
    {
      id: 6,
      title: 'Climate Change Impact',
      subtitle: 'Ocean warming & acidification',
      icon: Globe,
      color: '#ef4444',
      gradient: ['#ef4444', '#dc2626'],
      description: 'How climate change affects marine ecosystems and biodiversity.',
      readTime: '9 min read',
      image: 'asserts/images/nav6.jpg'
    }
  ];

  
  const stats: Stat[] = [
    { label: 'Protected Areas', value: '15,000+', icon: Shield },
    { label: 'Species Protected', value: '8,500+', icon: Fish },
    { label: 'Active Users', value: '25,000+', icon: Users },
    { label: 'Educational Resources', value: '200+', icon: BookOpen }
  ];

  const handleTopicPress = (topic: EducationalTopic): void => {
    // Navigate to detailed topic page
    console.log('Navigate to:', topic.title);
    
  };

  const handleQuickAction = (action: string): void => {
    console.log('Quick action:', action);
    
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.headerContainer, { opacity: headerOpacity }]}>
        <Header activeSection={activeSection} setActiveSection={setActiveSection} />
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <View style={styles.heroGradient} />
          
          <View style={styles.heroContent}>
            <Leaf size={40} color="#10b981" />
            <Text style={styles.heroTitle}>
              Eco-Compliance & Awareness Hub
            </Text>
            <Text style={styles.heroSubtitle}>
              Learn, protect, and preserve our marine ecosystems through education and responsible practices
            </Text>

            <View style={styles.heroStats}>
              {stats.map((stat: Stat, index: number) => (
                <View key={index} style={styles.heroStatItem}>
                  <stat.icon size={20} color="#10b981" />
                  <Text style={styles.heroStatValue}>{stat.value}</Text>
                  <Text style={styles.heroStatLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Featured Content Section */}
        <View style={styles.featuredSection}>
          <View style={styles.sectionHeader}>
            <BookOpen size={24} color="#1f2937" />
            <Text style={styles.sectionTitle}>Featured Learning Topics</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Explore comprehensive guides on marine conservation and compliance
          </Text>
        </View>

        {/* Educational Cards Grid */}
        <View style={styles.cardsContainer}>
          {educationalTopics.map((topic: EducationalTopic, index: number) => (
            <TouchableOpacity
              key={topic.id}
              style={[
                styles.topicCard,
                index % 2 === 0 ? styles.leftCard : styles.rightCard
              ]}
              onPress={() => handleTopicPress(topic)}
              activeOpacity={0.8}
            >
              
              <View style={[styles.cardGradient, { 
                backgroundColor: topic.gradient[0] + '20'
              }]} />
              
              {/* Card Content */}
              <View style={styles.cardContent}>
               
                <View style={styles.cardHeader}>
                  <View style={[styles.cardIconContainer, {
                    backgroundColor: topic.color + '20'
                  }]}>
                    <topic.icon size={24} color={topic.color} />
                  </View>
                  <View style={styles.cardHeaderText}>
                    <Text style={styles.cardTitle}>{topic.title}</Text>
                    <Text style={styles.cardSubtitle}>{topic.subtitle}</Text>
                  </View>
                  <ChevronRight size={20} color="#9ca3af" />
                </View>

                {/* Image Placeholder with images */}
                <View style={styles.cardImagePlaceholder}>
                  <Camera size={32} color="#9ca3af" />
                  <Text style={styles.imagePlaceholderText}>
                    Add {topic.image} to assets/images/
                  </Text>
                </View>
                
                {/* When you add real images, replace the above with:
                <Image
                  source={require(`../../../assets/images/${topic.image}`)}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                */}

                {/* Card Description */}
                <Text style={styles.cardDescription}>
                  {topic.description}
                </Text>

                {/* Card Footer */}
                <View style={styles.cardFooter}>
                  <View style={styles.readTimeContainer}>
                    <Clock size={14} color="#6b7280" />
                    <Text style={styles.readTime}>{topic.readTime}</Text>
                  </View>
                  <View style={[styles.topicBadge, {
                    backgroundColor: topic.color + '15'
                  }]}>
                    <Text style={[styles.badgeText, { color: topic.color }]}>
                      Learn More
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        
        <View style={styles.quickActionsSection}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('videos')}
            >
              <PlayCircle size={24} color="#3b82f6" />
              <Text style={styles.quickActionText}>Watch Videos</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('quiz')}
            >
              <Award size={24} color="#f59e0b" />
              <Text style={styles.quickActionText}>Take Quiz</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('maps')}
            >
              <MapPin size={24} color="#10b981" />
              <Text style={styles.quickActionText}>Find MPAs</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('report')}
            >
              <AlertTriangle size={24} color="#ef4444" />
              <Text style={styles.quickActionText}>Report Issue</Text>
            </TouchableOpacity>
          </View>
        </View>

       
        <Footer />
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: StatusBar.currentHeight || 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 120, // Space for header
  },
  
  // Hero Section Styles
  heroContainer: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 24,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: '#10b981',
  },
  heroContent: {
    padding: 24,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    flexWrap: 'wrap',
  },
  heroStatItem: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 16,
    margin: 4,
    minWidth: width * 0.2,
  },
  heroStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 8,
  },
  heroStatLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },


  // Section Headers
  featuredSection: {
    margin: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
    marginLeft: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },


  // Cards Container
  cardsContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  topicCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  leftCard: {
    width: width * 0.44,
  },
  rightCard: {
    width: width * 0.44,
  },
  cardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  cardImagePlaceholder: {
    height: 100,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  imagePlaceholderText: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },

  // Style images
  cardImage: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 18,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readTime: {
    fontSize: 11,
    color: '#6b7280',
    marginLeft: 4,
  },
  topicBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },

  // Quick Actions
  quickActionsSection: {
    margin: 16,
  },
  quickActionsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  quickActionCard: {
    backgroundColor: '#ffffff',
    width: width * 0.21,
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickActionText: {
    fontSize: 11,
    color: '#4b5563',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default EcoComplianceHub;