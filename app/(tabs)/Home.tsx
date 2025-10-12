import React, { useState, useEffect, useRef } from 'react';
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
  Modal,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Demo notifications data
const DEMO_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Weather Alert',
    message: 'Strong winds expected in your route area',
    time: '5 min ago',
    icon: 'cloud-drizzle',
    color: '#ef4444',
    unread: true,
  },
  {
    id: 2,
    title: 'Route Update',
    message: 'New maritime route available - 15% faster',
    time: '1 hour ago',
    icon: 'navigation',
    color: '#06bfdb',
    unread: true,
  },
  {
    id: 3,
    title: 'Compliance Reminder',
    message: 'Environmental compliance report due in 3 days',
    time: '2 hours ago',
    icon: 'shield',
    color: '#10b981',
    unread: true,
  },
  {
    id: 4,
    title: 'Learning Module',
    message: 'New maritime safety course available',
    time: '1 day ago',
    icon: 'book-open',
    color: '#3b82f6',
    unread: false,
  },
];

const Home: React.FC = () => {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('home');
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);
  const [selectedFilters, setSelectedFilters] = useState({
    routes: false,
    weather: false,
    conservation: false,
    safety: false,
  });
  const [sortBy, setSortBy] = useState('recent');
  const slideAnim = useRef(new Animated.Value(-400)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const filterSlideAnim = useRef(new Animated.Value(-400)).current;
  const filterFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Animate notification dropdown
  useEffect(() => {
    if (notificationVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -400,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [notificationVisible]);

  const handleMapNavigation = () => {
    console.log('Navigating to ShipMap...');
    router.push('/(tabs)/ShipMap');
  };

  const handleWeatherNavigation = () => {
    console.log('Navigating to WeatherConditions...');
    router.push('/(tabs)/WeatherConditions');
  };

  const handleEcoHubNavigation = () => {
    console.log('Navigating to EcoComplianceHub...');
    router.push('/(tabs)/EcoComplianceHub');
  };

  const handleProfileNavigation = () => {
    console.log('Navigating to Profile...');
    router.push('/(tabs)/ProfileScreen');
  };

  const toggleNotifications = () => {
    setNotificationVisible(!notificationVisible);
  };

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, unread: false } : notif
      )
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setNotificationVisible(false);
  };

  const unreadCount = notifications.filter(n => n.unread).length;

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
    { id: 'weather', icon: 'cloud', label: 'Weather' },
    { id: 'education', icon: 'book-open', label: 'Learn' },
    { id: 'profile', icon: 'user', label: 'Profile' },
  ];

  const handleNavigation = (tabId: string) => {
    if (tabId === 'map') {
      handleMapNavigation();
    } else if (tabId === 'weather') {
      handleWeatherNavigation();
    } else if (tabId === 'education') {
      handleEcoHubNavigation();
    } else if (tabId === 'profile') {
      handleProfileNavigation();
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['#0a1929', '#1a365d', '#0f172a']}
        style={styles.gradient}
      />

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={handleProfileNavigation}
            >
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
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={toggleNotifications}
            >
              <Feather name="bell" size={22} color="#fff" />
              {unreadCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

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

      {/* Notification Dropdown */}
      {notificationVisible && (
        <Animated.View 
          style={[
            styles.notificationDropdown,
            {
              transform: [{ translateY: slideAnim }],
              opacity: fadeAnim,
            }
          ]}
        >
          <LinearGradient
            colors={['rgba(15, 23, 42, 0.98)', 'rgba(10, 25, 41, 0.98)']}
            style={styles.notificationContainer}
          >
            <View style={styles.notificationHeader}>
              <View style={styles.notificationHeaderLeft}>
                <Feather name="bell" size={20} color="#06bfdb" />
                <Text style={styles.notificationTitle}>Notifications</Text>
                {unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{unreadCount}</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity onPress={toggleNotifications}>
                <Feather name="x" size={20} color="rgba(255,255,255,0.6)" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.notificationList}
              showsVerticalScrollIndicator={false}
            >
              {notifications.length === 0 ? (
                <View style={styles.emptyState}>
                  <Feather name="bell-off" size={48} color="rgba(255,255,255,0.2)" />
                  <Text style={styles.emptyText}>No notifications</Text>
                </View>
              ) : (
                notifications.map((notif) => (
                  <TouchableOpacity
                    key={notif.id}
                    style={[
                      styles.notificationItem,
                      notif.unread && styles.notificationUnread
                    ]}
                    onPress={() => markAsRead(notif.id)}
                  >
                    <View style={[styles.notifIcon, { backgroundColor: `${notif.color}20` }]}>
                      <Feather name={notif.icon as any} size={18} color={notif.color} />
                    </View>
                    <View style={styles.notifContent}>
                      <Text style={styles.notifTitle}>{notif.title}</Text>
                      <Text style={styles.notifMessage} numberOfLines={2}>
                        {notif.message}
                      </Text>
                      <Text style={styles.notifTime}>{notif.time}</Text>
                    </View>
                    {notif.unread && <View style={styles.unreadDot} />}
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>

            {notifications.length > 0 && (
              <TouchableOpacity 
                style={styles.clearAllButton}
                onPress={clearAllNotifications}
              >
                <Text style={styles.clearAllText}>Clear All</Text>
              </TouchableOpacity>
            )}
          </LinearGradient>
        </Animated.View>
      )}

      {/* Overlay */}
      {notificationVisible && (
        <TouchableOpacity 
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleNotifications}
        />
      )}

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.statsContainer}>
          {stats.map((stat, i) => (
            <View key={i} style={styles.statCard}>
              <Feather name={stat.icon as any} color="#22d3ee" size={20} />
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.mapNavSection}>
          <Text style={styles.sectionTitle}>
            <Feather name="navigation" size={20} color="#06bfdb" /> Navigate
          </Text>
          <TouchableOpacity 
            style={styles.mapCard}
            activeOpacity={0.7}
            onPress={handleMapNavigation}
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
            <View style={styles.floatingCompass}>
              <Feather name="compass" size={20} color="#06bfdb" />
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.weatherCard}
          activeOpacity={0.8}
          onPress={handleWeatherNavigation}
        >
          <LinearGradient
            colors={['rgba(99, 102, 241, 0.3)', 'rgba(59, 130, 246, 0.2)']}
            style={styles.weatherGradient}
          >
            <View style={styles.weatherHeader}>
              <Feather name="cloud-drizzle" size={28} color="#93c5fd" />
              <Text style={styles.weatherTitle}>Marine Weather</Text>
              <View style={styles.weatherArrow}>
                <Feather name="arrow-right" size={20} color="#06bfdb" />
              </View>
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
            <View style={styles.tapToViewContainer}>
              <Text style={styles.tapToViewText}>Tap to view detailed forecast</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="book-open" size={20} color="#22d3ee" />
            <Text style={styles.sectionTitleText}>Educational Hub</Text>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={handleEcoHubNavigation}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <Feather name="arrow-right" size={16} color="#06bfdb" />
            </TouchableOpacity>
          </View>

          {newsArticles.map((article) => (
            <TouchableOpacity 
              key={article.id} 
              style={styles.newsCard} 
              activeOpacity={0.8}
              onPress={handleEcoHubNavigation}
            >
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

      <View style={styles.bottomNav}>
        <LinearGradient
          colors={['rgba(10, 25, 41, 0.98)', 'rgba(15, 23, 42, 0.98)']}
          style={styles.bottomNavGradient}
        >
          {navItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.navItem}
              onPress={() => handleNavigation(item.id)}
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
    paddingBottom: 20,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: 'transparent',
    zIndex: 10,
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 15,
  },
  notificationDropdown: {
    position: 'absolute',
    top: 140,
    left: 16,
    right: 16,
    maxHeight: 450,
    zIndex: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  notificationContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  notificationHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  unreadBadge: {
    backgroundColor: '#06bfdb',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  unreadText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
  },
  notificationList: {
    maxHeight: 320,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 16,
    fontWeight: '500',
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    gap: 12,
  },
  notificationUnread: {
    backgroundColor: 'rgba(6, 191, 219, 0.05)',
  },
  notifIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifContent: {
    flex: 1,
  },
  notifTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  notifMessage: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 6,
    lineHeight: 18,
  },
  notifTime: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '500',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#06bfdb',
    marginTop: 6,
  },
  clearAllButton: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
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
    flex: 1,
  },
  weatherArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(6, 191, 219, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
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
  tapToViewContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  tapToViewText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '500',
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
export default Home;