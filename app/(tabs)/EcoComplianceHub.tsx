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
import { LinearGradient } from 'expo-linear-gradient';
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
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

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
  const router = useRouter();
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
      image: 'nav5.jpg' 
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
      image: 'nav4.jpg'
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
      image: 'nav3.jpg'
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
      image: 'nav4.jpg'
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
      image: 'nav5.jpg'
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
      image: 'nav6.jpg'
    },
  ];

  const stats: Stat[] = [
    { label: 'Protected Areas', value: '15,000+', icon: Shield },
    { label: 'Species Protected', value: '8,500+', icon: Fish },
    { label: 'Active Users', value: '25,000+', icon: Users },
    { label: 'Educational Resources', value: '200+', icon: BookOpen }
  ];

  const handleTopicPress = (topic: EducationalTopic): void => {
    console.log('Navigate to:', topic.title);
  };

  const handleQuickAction = (action: string): void => {
    console.log('Quick action:', action);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['#0a1929', '#1a365d', '#0f172a']}
        style={styles.gradient}
      />

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
        <LinearGradient
          colors={['rgba(6,191,219,0.2)', 'rgba(34,211,238,0.1)']}
          style={styles.heroContainer}
        >
          <View style={styles.heroGlow} />
          
          <View style={styles.heroContent}>
            <View style={styles.heroIconContainer}>
              <Leaf size={40} color="#06bfdb" />
            </View>
            <Text style={styles.heroTitle}>
              Eco-Compliance & Awareness Hub
            </Text>
            <Text style={styles.heroSubtitle}>
              Learn, protect, and preserve our marine ecosystems through education and responsible practices
            </Text>

            <View style={styles.heroStats}>
              {stats.map((stat: Stat, index: number) => (
                <View key={index} style={styles.heroStatItem}>
                  <stat.icon size={20} color="#22d3ee" />
                  <Text style={styles.heroStatValue}>{stat.value}</Text>
                  <Text style={styles.heroStatLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </LinearGradient>

        {/* Featured Content Section */}
        <View style={styles.featuredSection}>
          <View style={styles.sectionHeader}>
            <BookOpen size={24} color="#06bfdb" />
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
              <LinearGradient
                colors={[topic.gradient[0] + '20', topic.gradient[1] + '10']}
                style={styles.cardGradient}
              />
              
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <View style={[styles.cardIconContainer, {
                    backgroundColor: topic.color + '20',
                    borderColor: topic.color + '40'
                  }]}>
                    <topic.icon size={24} color={topic.color} />
                  </View>
                  <View style={styles.cardHeaderText}>
                    <Text style={styles.cardTitle}>{topic.title}</Text>
                    <Text style={styles.cardSubtitle}>{topic.subtitle}</Text>
                  </View>
                  <ChevronRight size={20} color="rgba(255,255,255,0.4)" />
                </View>

                <Image
                  source={require('../../assets/images/nav6.jpg')}
                  style={styles.cardImage}
                  resizeMode="cover"
                />

                <Text style={styles.cardDescription}>
                  {topic.description}
                </Text>

                <View style={styles.cardFooter}>
                  <View style={styles.readTimeContainer}>
                    <Clock size={14} color="rgba(255,255,255,0.6)" />
                    <Text style={styles.readTime}>{topic.readTime}</Text>
                  </View>
                  <View style={[styles.topicBadge, {
                    backgroundColor: topic.color + '20'
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
              <LinearGradient
                colors={['rgba(59,130,246,0.2)', 'rgba(59,130,246,0.1)']}
                style={styles.quickActionGradient}
              >
                <PlayCircle size={24} color="#3b82f6" />
                <Text style={styles.quickActionText}>Watch Videos</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('quiz')}
            >
              <LinearGradient
                colors={['rgba(245,158,11,0.2)', 'rgba(245,158,11,0.1)']}
                style={styles.quickActionGradient}
              >
                <Award size={24} color="#f59e0b" />
                <Text style={styles.quickActionText}>Take Quiz</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('maps')}
            >
              <LinearGradient
                colors={['rgba(16,185,129,0.2)', 'rgba(16,185,129,0.1)']}
                style={styles.quickActionGradient}
              >
                <MapPin size={24} color="#10b981" />
                <Text style={styles.quickActionText}>Find MPAs</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('report')}
            >
              <LinearGradient
                colors={['rgba(239,68,68,0.2)', 'rgba(239,68,68,0.1)']}
                style={styles.quickActionGradient}
              >
                <AlertTriangle size={24} color="#ef4444" />
                <Text style={styles.quickActionText}>Report Issue</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1929',
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
  },
  
  // Hero Section
  heroContainer: {
    margin: 16,
    borderRadius: 24,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(6,191,219,0.3)',
  },
  heroGlow: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: 'rgba(6,191,219,0.1)',
  },
  heroContent: {
    padding: 24,
    alignItems: 'center',
  },
  heroIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(6,191,219,0.2)',
    borderWidth: 2,
    borderColor: '#06bfdb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
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
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 16,
    margin: 4,
    minWidth: width * 0.2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  heroStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginTop: 8,
  },
  heroStatLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
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
    color: '#fff',
    marginLeft: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
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
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
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
    borderWidth: 1,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  cardImage: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
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
    color: 'rgba(255,255,255,0.6)',
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
    color: '#fff',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  quickActionCard: {
    width: width * 0.21,
    aspectRatio: 1,
    borderRadius: 16,
    marginBottom: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  quickActionGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    fontSize: 11,
    color: '#fff',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default EcoComplianceHub;