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
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Leaf, 
  BookOpen,
  Award,
  Users,
  Shield,
  ChevronRight,
  PlayCircle,
  AlertTriangle,
  Clock,
  ChevronLeft
} from 'lucide-react-native';

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
  const scrollY = new Animated.Value(0);

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
      image: 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=400&h=280&fit=crop' 
    },
    {
      id: 2,
      title: 'Marine Wildlife Protection',
      subtitle: 'Protecting ocean biodiversity',
      icon: Shield,
      color: '#3b82f6',
      gradient: ['#3b82f6', '#1d4ed8'],
      description: 'Discover endangered species, migration patterns, and conservation efforts.',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=280&fit=crop'
    },
    {
      id: 3,
      title: 'Sustainable Fishing Practices',
      subtitle: 'Responsible fishing guidelines',
      icon: Shield,
      color: '#f59e0b',
      gradient: ['#f59e0b', '#d97706'],
      description: 'Best practices for sustainable fishing and marine resource management.',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=280&fit=crop'
    },
    {
      id: 4,
      title: 'Ocean Pollution Prevention',
      subtitle: 'Keeping our oceans clean',
      icon: Shield,
      color: '#06b6d4',
      gradient: ['#06b6d4', '#0891b2'],
      description: 'Understanding pollution sources and prevention strategies.',
      readTime: '4 min read',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=280&fit=crop'
    },
    {
      id: 5,
      title: 'Compliance Regulations',
      subtitle: 'Maritime laws & guidelines',
      icon: Shield,
      color: '#8b5cf6',
      gradient: ['#8b5cf6', '#7c3aed'],
      description: 'International and local regulations for marine conservation.',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=280&fit=crop'
    },
    {
      id: 6,
      title: 'Climate Change Impact',
      subtitle: 'Ocean warming & acidification',
      icon: Shield,
      color: '#ef4444',
      gradient: ['#ef4444', '#dc2626'],
      description: 'How climate change affects marine ecosystems and biodiversity.',
      readTime: '9 min read',
      image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=280&fit=crop'
    },
  ];

  const stats: Stat[] = [
    { label: 'Protected Areas', value: '15,000+', icon: Shield },
    { label: 'Species Protected', value: '8,500+', icon: Shield },
    { label: 'Active Users', value: '25,000+', icon: Users },
    { label: 'Educational Resources', value: '200+', icon: BookOpen }
  ];

  const handleBackToHome = () => {
    router.push('/(tabs)/Home');
  };

  const handleTopicPress = (topic: EducationalTopic): void => {
    // Using expo-router navigation with params
    router.push({
      pathname: '/(tabs)/TopicDetail',
      params: { 
        topicId: topic.id,
        title: topic.title,
        subtitle: topic.subtitle,
        color: topic.color,
        description: topic.description,
        readTime: topic.readTime,
        image: topic.image
      }
    });
  };

  const handleQuickAction = (action: string): void => {
    console.log('Quick action pressed:', action);
    
    switch(action) {
      case 'videos':
        router.push('/(tabs)/VideoLearningPage');
        break;
      case 'quiz':
        router.push('/(tabs)/QuizPage');
        break;
      case 'maps':
        const mpaTopic = educationalTopics[0];
        router.push({
          pathname: '/(tabs)/TopicDetail',
          params: { 
            topicId: mpaTopic.id,
            title: mpaTopic.title,
            subtitle: mpaTopic.subtitle,
            color: mpaTopic.color,
            description: mpaTopic.description,
            readTime: mpaTopic.readTime,
            image: mpaTopic.image
          }
        });
        break;
      case 'report':
        router.push('/(tabs)/Reports');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const accentColor = '#06bfdb';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <LinearGradient
        colors={['#0a1929', '#1a365d', '#0f172a']}
        style={styles.gradient}
      />

      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackToHome} style={styles.backBtn}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={[styles.logoRing, { borderColor: accentColor }]}>
            <Leaf size={20} color={accentColor} />
          </View>
          <Text style={styles.headerTitle}>Eco-Compliance Hub</Text>
        </View>

        <View style={styles.headerRight} />
      </View>

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

        {/* Quick Actions Section */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('videos')}
              activeOpacity={0.7}
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
              activeOpacity={0.7}
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
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['rgba(16,185,129,0.2)', 'rgba(16,185,129,0.1)']}
                style={styles.quickActionGradient}
              >
                <BookOpen size={24} color="#10b981" />
                <Text style={styles.quickActionText}>Learn MPAs</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('report')}
              activeOpacity={0.7}
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
          {educationalTopics.map((topic: EducationalTopic) => (
            <TouchableOpacity
              key={topic.id}
              style={styles.topicCard}
              onPress={() => handleTopicPress(topic)}
              activeOpacity={0.8}
            >
              {/* Card Image Section */}
              <View style={styles.cardImageSection}>
                <Image
                  source={{ uri: topic.image }}
                  style={styles.cardImage}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(10,25,41,0.9)']}
                  style={styles.imageOverlay}
                />
              </View>

              {/* Card Content Section */}
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <View style={styles.headerTitleGroup}>
                    <Text style={styles.cardTitle}>{topic.title}</Text>
                    <Text style={styles.cardSubtitle}>{topic.subtitle}</Text>
                  </View>
                  <ChevronRight size={20} color="rgba(255,255,255,0.4)" />
                </View>

                <Text style={styles.cardDescription}>
                  {topic.description}
                </Text>

                <View style={styles.cardFooter}>
                  <View style={styles.readTimeContainer}>
                    <Clock size={12} color="rgba(255,255,255,0.5)" />
                    <Text style={styles.readTime}>{topic.readTime}</Text>
                  </View>
                  <View style={[styles.topicBadge, {
                    backgroundColor: topic.color + '25'
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
  
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
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
  headerCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    zIndex: -1,
  },
  logoRing: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  headerRight: {
    width: 44,
  },
  
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
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

  // Quick Actions
  quickActionsSection: {
    margin: 16,
    marginTop: 8,
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

  // Section Headers
  featuredSection: {
    margin: 16,
    marginBottom: 8,
    marginTop: 8,
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
    gap: 12,
  },
  topicCard: {
    width: width * 0.44,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 8,
  },
  cardImageSection: {
    width: '100%',
    height: 140,
    position: 'relative',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardContent: {
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  headerTitleGroup: {
    flex: 1,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 14,
  },
  cardDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 16,
    marginBottom: 12,
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
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    marginLeft: 4,
  },
  topicBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
});

export default EcoComplianceHub;