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
  Cloud, 
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Eye,
  ChevronRight,
  MapPin,
  Calendar,
  ChevronLeft,
  Thermometer,
  Gauge,
  Sunrise,
  Sunset,
  CloudSnow,
  CloudDrizzle
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface WeatherForecast {
  id: number;
  day: string;
  temp: string;
  condition: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string[];
  precipitation: string;
  windSpeed: string;
  image: string;
}

interface WeatherStat {
  label: string;
  value: string;
  icon: React.ComponentType<any>;
  color: string;
}

const WeatherHub: React.FC = () => {
  const router = useRouter();
  const scrollY = new Animated.Value(0);
  const [currentTemp, setCurrentTemp] = useState('28');
  const [currentCondition, setCurrentCondition] = useState('Partly Cloudy');

  const weeklyForecast: WeatherForecast[] = [
    {
      id: 1,
      day: 'Monday',
      temp: '29°C',
      condition: 'Sunny',
      icon: Sun,
      color: '#f59e0b',
      gradient: ['#f59e0b', '#d97706'],
      precipitation: '10%',
      windSpeed: '12 km/h',
      image: 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?w=400&h=280&fit=crop'
    },
    {
      id: 2,
      day: 'Tuesday',
      temp: '27°C',
      condition: 'Partly Cloudy',
      icon: Cloud,
      color: '#06b6d4',
      gradient: ['#06b6d4', '#0891b2'],
      precipitation: '20%',
      windSpeed: '15 km/h',
      image: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=400&h=280&fit=crop'
    },
    {
      id: 3,
      day: 'Wednesday',
      temp: '26°C',
      condition: 'Light Rain',
      icon: CloudDrizzle,
      color: '#3b82f6',
      gradient: ['#3b82f6', '#1d4ed8'],
      precipitation: '65%',
      windSpeed: '18 km/h',
      image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=400&h=280&fit=crop'
    },
    {
      id: 4,
      day: 'Thursday',
      temp: '25°C',
      condition: 'Rainy',
      icon: CloudRain,
      color: '#8b5cf6',
      gradient: ['#8b5cf6', '#7c3aed'],
      precipitation: '80%',
      windSpeed: '22 km/h',
      image: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=400&h=280&fit=crop'
    },
    {
      id: 5,
      day: 'Friday',
      temp: '28°C',
      condition: 'Clear Sky',
      icon: Sun,
      color: '#f59e0b',
      gradient: ['#f59e0b', '#d97706'],
      precipitation: '5%',
      windSpeed: '10 km/h',
      image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=280&fit=crop'
    },
    {
      id: 6,
      day: 'Saturday',
      temp: '30°C',
      condition: 'Hot & Sunny',
      icon: Sun,
      color: '#ef4444',
      gradient: ['#ef4444', '#dc2626'],
      precipitation: '0%',
      windSpeed: '8 km/h',
      image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400&h=280&fit=crop'
    },
  ];

  const weatherStats: WeatherStat[] = [
    { label: 'Humidity', value: '68%', icon: Droplets, color: '#3b82f6' },
    { label: 'Wind Speed', value: '14 km/h', icon: Wind, color: '#06b6d4' },
    { label: 'Visibility', value: '10 km', icon: Eye, color: '#10b981' },
    { label: 'Pressure', value: '1013 hPa', icon: Gauge, color: '#f59e0b' }
  ];

  const handleBackToHome = () => {
    router.back();
  };

  const handleForecastPress = (forecast: WeatherForecast): void => {
    console.log('Forecast pressed:', forecast.day);
  };

  const handleQuickAction = (action: string): void => {
    console.log('Quick action pressed:', action);
  };

  const accentColor = '#06bfdb';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <LinearGradient
        colors={['#0a1929', '#1e3a5f', '#0f172a']}
        style={styles.gradient}
      />

      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackToHome} style={styles.backBtn}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={[styles.logoRing, { borderColor: accentColor }]}>
            <Cloud size={20} color={accentColor} />
          </View>
          <Text style={styles.headerTitle}>Weather Hub</Text>
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
        {/* Current Weather Hero Section */}
        <LinearGradient
          colors={['rgba(6,191,219,0.2)', 'rgba(34,211,238,0.1)']}
          style={styles.heroContainer}
        >
          <View style={styles.heroGlow} />
          
          <View style={styles.heroContent}>
            <View style={styles.locationContainer}>
              <MapPin size={16} color="#06bfdb" />
              <Text style={styles.locationText}>Mulleriyawa, Sri Lanka</Text>
            </View>

            <View style={styles.currentTempContainer}>
              <Text style={styles.currentTemp}>{currentTemp}°C</Text>
              <Cloud size={60} color="#06bfdb" style={styles.weatherIcon} />
            </View>

            <Text style={styles.currentCondition}>{currentCondition}</Text>
            <Text style={styles.currentDate}>Sunday, October 19, 2025</Text>

            <View style={styles.heroStats}>
              {weatherStats.map((stat: WeatherStat, index: number) => (
                <View key={index} style={styles.heroStatItem}>
                  <stat.icon size={20} color={stat.color} />
                  <Text style={styles.heroStatValue}>{stat.value}</Text>
                  <Text style={styles.heroStatLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>

            {/* Sunrise/Sunset */}
            <View style={styles.sunTimesContainer}>
              <View style={styles.sunTimeItem}>
                <Sunrise size={18} color="#f59e0b" />
                <Text style={styles.sunTimeLabel}>Sunrise</Text>
                <Text style={styles.sunTimeValue}>6:12 AM</Text>
              </View>
              <View style={styles.sunTimeDivider} />
              <View style={styles.sunTimeItem}>
                <Sunset size={18} color="#ef4444" />
                <Text style={styles.sunTimeLabel}>Sunset</Text>
                <Text style={styles.sunTimeValue}>6:28 PM</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Actions Section */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.quickActionsTitle}>Quick Access</Text>
          
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('hourly')}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['rgba(59,130,246,0.2)', 'rgba(59,130,246,0.1)']}
                style={styles.quickActionGradient}
              >
                <Calendar size={24} color="#3b82f6" />
                <Text style={styles.quickActionText}>Hourly</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('radar')}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['rgba(16,185,129,0.2)', 'rgba(16,185,129,0.1)']}
                style={styles.quickActionGradient}
              >
                <Gauge size={24} color="#10b981" />
                <Text style={styles.quickActionText}>Radar</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('alerts')}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['rgba(239,68,68,0.2)', 'rgba(239,68,68,0.1)']}
                style={styles.quickActionGradient}
              >
                <CloudRain size={24} color="#ef4444" />
                <Text style={styles.quickActionText}>Alerts</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('map')}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['rgba(245,158,11,0.2)', 'rgba(245,158,11,0.1)']}
                style={styles.quickActionGradient}
              >
                <MapPin size={24} color="#f59e0b" />
                <Text style={styles.quickActionText}>Map</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Weekly Forecast Section */}
        <View style={styles.featuredSection}>
          <View style={styles.sectionHeader}>
            <Calendar size={24} color="#06bfdb" />
            <Text style={styles.sectionTitle}>7-Day Forecast</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Plan your week with detailed weather predictions
          </Text>
        </View>

        {/* Forecast Cards Grid */}
        <View style={styles.cardsContainer}>
          {weeklyForecast.map((forecast: WeatherForecast) => (
            <TouchableOpacity
              key={forecast.id}
              style={styles.forecastCard}
              onPress={() => handleForecastPress(forecast)}
              activeOpacity={0.8}
            >
              {/* Card Image Section */}
              <View style={styles.cardImageSection}>
                <Image
                  source={{ uri: forecast.image }}
                  style={styles.cardImage}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(10,25,41,0.9)']}
                  style={styles.imageOverlay}
                />
                <View style={styles.weatherIconOverlay}>
                  <forecast.icon size={32} color="#fff" />
                </View>
              </View>

              {/* Card Content Section */}
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <View style={styles.headerTitleGroup}>
                    <Text style={styles.cardTitle}>{forecast.day}</Text>
                    <Text style={styles.cardSubtitle}>{forecast.condition}</Text>
                  </View>
                  <Text style={styles.tempBig}>{forecast.temp}</Text>
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.weatherDetail}>
                    <Droplets size={12} color="rgba(255,255,255,0.5)" />
                    <Text style={styles.detailText}>{forecast.precipitation}</Text>
                  </View>
                  <View style={styles.weatherDetail}>
                    <Wind size={12} color="rgba(255,255,255,0.5)" />
                    <Text style={styles.detailText}>{forecast.windSpeed}</Text>
                  </View>
                  <ChevronRight size={16} color="rgba(255,255,255,0.4)" />
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
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 6,
    fontWeight: '500',
  },
  currentTempContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  currentTemp: {
    fontSize: 72,
    fontWeight: '700',
    color: '#fff',
    marginRight: 16,
  },
  weatherIcon: {
    marginLeft: 8,
  },
  currentCondition: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  currentDate: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 24,
  },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    flexWrap: 'wrap',
    marginBottom: 20,
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
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginTop: 8,
  },
  heroStatLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
    textAlign: 'center',
  },
  sunTimesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  sunTimeItem: {
    alignItems: 'center',
    flex: 1,
  },
  sunTimeDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  sunTimeLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 6,
  },
  sunTimeValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    marginTop: 4,
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
  forecastCard: {
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
    height: 120,
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
  weatherIconOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  cardContent: {
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerTitleGroup: {
    flex: 1,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 14,
  },
  tempBig: {
    fontSize: 28,
    fontWeight: '700',
    color: '#06bfdb',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
  },
});

export default WeatherHub;