import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  TextInput,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function MarineNavHome() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { label: 'Miles Sailed', value: '1,247', icon: 'navigation' },
    { label: 'Routes Saved', value: '23', icon: 'map-pin' },
    { label: 'Wind Speed', value: '12 kts', icon: 'wind' }
  ];

  const newsArticles = [
    { 
      id: 1,
      title: 'New Marine Protected Area Established',
      category: 'Conservation',
      time: '2 hours ago',
      image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&q=80',
      excerpt: 'Government announces 500 sq km protected zone to preserve coral reefs and marine biodiversity.',
      icon: 'shield',
      color: '#10b981'
    },
    { 
      id: 2,
      title: 'Severe Weather Alert: Tropical Storm Approaching',
      category: 'Weather',
      time: '5 hours ago',
      image: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=400&q=80',
      excerpt: 'Mariners advised to seek shelter as storm system moves northeast with 45 knot winds.',
      icon: 'alert-triangle',
      color: '#ef4444'
    },
    { 
      id: 3,
      title: 'Updated Navigation Routes for Harbor Entrance',
      category: 'Routes',
      time: '1 day ago',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80',
      excerpt: 'New channel markers installed. Mariners should update charts and follow revised approach.',
      icon: 'navigation-2',
      color: '#3b82f6'
    }
  ];

  const navItems = [
    { id: 'home', icon: 'home', label: 'Home' },
    { id: 'map', icon: 'map', label: 'Map' },
    { id: 'education', icon: 'book-open', label: 'Learn' },
    { id: 'profile', icon: 'user', label: 'Profile' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#0a1929', '#1a365d', '#0f172a']}
        style={styles.gradient}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.profileButton}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/100?img=12' }}
                style={styles.profileImage}
              />
              <View style={styles.onlineIndicator} />
            </TouchableOpacity>
            <View>
              <Text style={styles.greetingText}>Good Morning</Text>
              <Text style={styles.userName}>Captain John</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}>
              <Feather name="bell" size={22} color="#fff" />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="rgba(255,255,255,0.5)" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search routes, locations..."
            placeholderTextColor="rgba(255,255,255,0.5)"
          />
          <TouchableOpacity style={styles.filterButton}>
            <Feather name="sliders" size={20} color="#06bfdb" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          {stats.map((stat, i) => (
            <View key={i} style={styles.statCard}>
              <Feather name={stat.icon as any} color="#22d3ee" size={20} />
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
            </View>
          ))}
        </View>

        {/* Map Navigation Card with Preview */}
        <View style={styles.mapNavSection}>
          <Text style={styles.sectionTitle}>
            <Feather name="navigation" size={20} color="#06bfdb" /> Navigate
          </Text>
          <TouchableOpacity 
            style={styles.mapCard}
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80' }}
              style={styles.mapPreview}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.95)']}
              style={styles.mapOverlay}
            />
            <View style={styles.mapContent}>
              <View style={styles.mapIconContainer}>
                <Feather name="navigation" size={32} color="#06bfdb" />
              </View>
              <Text style={styles.mapTitle}>Start Navigation</Text>
              <Text style={styles.mapSubtitle}>Open live nautical map</Text>
              <View style={styles.gpsStatus}>
                <Feather name="activity" size={16} color="#10b981" />
                <Text style={styles.gpsText}>GPS Ready • 12 Satellites</Text>
              </View>
            </View>
            {/* Floating compass indicator */}
            <View style={styles.floatingCompass}>
              <Feather name="compass" size={20} color="#06bfdb" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Weather Info */}
        <View style={styles.weatherCard}>
          <LinearGradient
            colors={['rgba(99, 102, 241, 0.3)', 'rgba(59, 130, 246, 0.2)']}
            style={styles.weatherGradient}
          >
            <View style={styles.weatherHeader}>
              <Feather name="cloud-drizzle" size={28} color="#93c5fd" />
              <Text style={styles.weatherTitle}>Marine Weather</Text>
            </View>
            <View style={styles.weatherDetails}>
              <View style={styles.weatherItem}>
                <Feather name="thermometer" size={20} color="#22d3ee" />
                <Text style={styles.weatherLabel}>Temperature</Text>
                <Text style={styles.weatherValue}>72°F</Text>
              </View>
              <View style={styles.weatherDivider} />
              <View style={styles.weatherItem}>
                <Feather name="wind" size={20} color="#22d3ee" />
                <Text style={styles.weatherLabel}>Wind Speed</Text>
                <Text style={styles.weatherValue}>12 kts</Text>
              </View>
              <View style={styles.weatherDivider} />
              <View style={styles.weatherItem}>
                <Feather name="activity" size={20} color="#22d3ee" />
                <Text style={styles.weatherLabel}>Wave Height</Text>
                <Text style={styles.weatherValue}>2-3 ft</Text>
              </View>
            </View>
            <View style={styles.weatherCondition}>
              <View style={styles.conditionBadge}>
                <Feather name="check-circle" size={16} color="#10b981" />
                <Text style={styles.conditionText}>Good Conditions for Sailing</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Educational Hub - Marine News */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="book-open" size={20} color="#22d3ee" />
            <Text style={styles.sectionTitleText}>Educational Hub</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
              <Feather name="arrow-right" size={16} color="#06bfdb" />
            </TouchableOpacity>
          </View>

          {newsArticles.map((article) => (
            <TouchableOpacity key={article.id} style={styles.newsCard} activeOpacity={0.8}>
              <Image source={{ uri: article.image }} style={styles.newsImage} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
                style={styles.newsOverlay}
              />
              <View style={styles.newsContent}>
                <View style={styles.newsHeader}>
                  <View style={[styles.categoryBadge, { backgroundColor: `${article.color}30` }]}>
                    <Feather name={article.icon as any} size={14} color={article.color} />
                    <Text style={[styles.categoryText, { color: article.color }]}>
                      {article.category}
                    </Text>
                  </View>
                  <View style={styles.timeContainer}>
                    <Feather name="clock" size={12} color="rgba(255,255,255,0.6)" />
                    <Text style={styles.timeText}>{article.time}</Text>
                  </View>
                </View>
                <Text style={styles.newsTitle}>{article.title}</Text>
                <Text style={styles.newsExcerpt} numberOfLines={2}>{article.excerpt}</Text>
                <View style={styles.readMoreContainer}>
                  <Text style={styles.readMoreText}>Read More</Text>
                  <Feather name="arrow-right" size={16} color="#06bfdb" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <LinearGradient
          colors={['rgba(10, 25, 41, 0.98)', 'rgba(15, 23, 42, 0.98)']}
          style={styles.bottomNavGradient}
        >
          {navItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.navItem}
              onPress={() => setActiveTab(item.id)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.navIconContainer,
                activeTab === item.id && styles.navIconActive
              ]}>
                <Feather
                  name={item.icon as any}
                  size={22}
                  color={activeTab === item.id ? '#06bfdb' : 'rgba(255,255,255,0.5)'}
                />
              </View>
              <Text style={[
                styles.navLabel,
                activeTab === item.id && styles.navLabelActive
              ]}>
                {item.label}
              </Text>
              {activeTab === item.id && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          ))}
        </LinearGradient>
      </View>
    </View>
  );
}

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
    paddingBottom: 20,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: 'transparent',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileButton: {
    position: 'relative',
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#06bfdb',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#0a1929',
  },
  greetingText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
  userName: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(6, 191, 219, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statLabel: {
    fontSize: 11,
    color: '#93c5fd',
    marginTop: 8,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    marginTop: 4,
  },
  mapNavSection: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  mapCard: {
    height: 220,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(6, 191, 219, 0.3)',
  },
  mapPreview: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  mapOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  mapContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
  },
  mapIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(6, 191, 219, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#06bfdb',
  },
  mapTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  mapSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 12,
    fontWeight: '500',
  },
  gpsStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  gpsText: {
    fontSize: 13,
    color: '#10b981',
    fontWeight: '600',
  },
  floatingCompass: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: 1,
    borderColor: '#06bfdb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
    flex: 1,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: '#06bfdb',
    fontWeight: '600',
  },
  weatherCard: {
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  weatherGradient: {
    padding: 20,
  },
  weatherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  weatherTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  weatherItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  weatherDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 8,
  },
  weatherLabel: {
    fontSize: 11,
    color: '#93c5fd',
    fontWeight: '600',
  },
  weatherValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
  weatherCondition: {
    alignItems: 'center',
  },
  conditionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  conditionText: {
    fontSize: 13,
    color: '#10b981',
    fontWeight: '600',
  },
  newsCard: {
    height: 280,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  newsImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  newsOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  newsContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
  newsTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    lineHeight: 26,
  },
  newsExcerpt: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
    marginBottom: 12,
    fontWeight: '500',
  },
  readMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  readMoreText: {
    fontSize: 14,
    color: '#06bfdb',
    fontWeight: '700',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  bottomNavGradient: {
    flexDirection: 'row',
    paddingBottom: 20,
    paddingTop: 12,
    paddingHorizontal: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  navIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIconActive: {
    backgroundColor: 'rgba(6, 191, 219, 0.15)',
  },
  navLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
    fontWeight: '600',
  },
  navLabelActive: {
    color: '#06bfdb',
  },
  activeIndicator: {
    position: 'absolute',
    top: -12,
    width: 32,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#06bfdb',
  },
});