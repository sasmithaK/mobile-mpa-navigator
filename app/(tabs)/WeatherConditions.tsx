import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const WeatherConditions = () => {
  const [selectedArea, setSelectedArea] = useState('Indian Ocean - Sri Lanka');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const recentSearches = [
    'Indian Ocean - Sri Lanka',
    'Bay of Bengal',
    'Arabian Sea',
    'Maldives Region',
    'South China Sea'
  ];

  const weatherData = {
    location: selectedArea,
    lastUpdated: '5 mins ago',
    temperature: 28,
    feelsLike: 31,
    condition: 'Partly Cloudy',
    windSpeed: 12,
    windDirection: 'NE',
    windGust: 18,
    humidity: 78,
    visibility: 9.5,
    pressure: 1012,
    uvIndex: 7,
    seaState: 'Moderate',
    waveHeight: 1.8,
    waveDirection: 'Northeast',
    swellHeight: 2.1,
    swellPeriod: 8,
    tideStatus: 'High Tide',
    tideTime: '14:32',
    nextTide: 'Low at 20:45',
    seaTemp: 27,
    salinity: 34.5,
    currentSpeed: 0.8,
    currentDirection: 'East',
    alerts: [
      { type: 'warning', message: 'Small Craft Advisory in effect' }
    ]
  };

  const hourlyForecast = [
    { time: '14:00', temp: 28, wind: 12, waves: 1.8, icon: 'cloud' },
    { time: '15:00', temp: 29, wind: 14, waves: 2.0, icon: 'cloud' },
    { time: '16:00', temp: 29, wind: 13, waves: 1.9, icon: 'sun' },
    { time: '17:00', temp: 28, wind: 11, waves: 1.7, icon: 'sun' },
    { time: '18:00', temp: 27, wind: 10, waves: 1.5, icon: 'sun' },
    { time: '19:00', temp: 26, wind: 9, waves: 1.4, icon: 'moon' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <LinearGradient
        colors={['#0a1929', '#1a365d', '#0f172a']}
        style={styles.gradient}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <View style={styles.iconContainer}>
                <Feather name="cloud" size={20} color="#06bfdb" />
              </View>
              <View>
                <Text style={styles.headerTitle}>Weather & Sea</Text>
                <Text style={styles.headerSubtitle}>Real-time conditions</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setShowSearch(!showSearch)}
              style={styles.searchButton}
            >
              <Feather name="search" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          {showSearch && (
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <Feather name="search" size={18} color="rgba(255,255,255,0.4)" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search location or coordinates..."
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <View style={styles.recentSearches}>
                {recentSearches.map((location, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => {
                      setSelectedArea(location);
                      setSearchQuery('');
                      setShowSearch(false);
                    }}
                    style={styles.recentSearchItem}
                  >
                    <Text style={styles.recentSearchText}>{location}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Location */}
          <View style={styles.locationContainer}>
            <Feather name="map-pin" size={16} color="#06bfdb" />
            <Text style={styles.locationText}>{weatherData.location}</Text>
            <Text style={styles.locationDot}>•</Text>
            <Text style={styles.lastUpdated}>{weatherData.lastUpdated}</Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Alerts */}
          {weatherData.alerts.length > 0 && (
            <LinearGradient
              colors={['rgba(251,146,60,0.2)', 'rgba(234,179,8,0.2)']}
              style={styles.alertCard}
            >
              <View style={styles.alertContent}>
                <Feather name="alert-triangle" size={20} color="#fb923c" />
                <View style={styles.alertTextContainer}>
                  <Text style={styles.alertTitle}>Weather Alert</Text>
                  <Text style={styles.alertMessage}>{weatherData.alerts[0].message}</Text>
                </View>
              </View>
            </LinearGradient>
          )}

          {/* Current Conditions Hero */}
          <LinearGradient
            colors={['rgba(6,191,219,0.2)', 'rgba(34,211,238,0.1)']}
            style={styles.heroCard}
          >
            <View style={styles.heroGlow} />
            
            <View style={styles.heroContent}>
              <View style={styles.heroTop}>
                <View>
                  <Text style={styles.temperature}>{weatherData.temperature}°</Text>
                  <Text style={styles.condition}>{weatherData.condition}</Text>
                  <Text style={styles.feelsLike}>Feels like {weatherData.feelsLike}°C</Text>
                </View>
                <View style={styles.weatherIcon}>
                  <Feather name="cloud" size={40} color="#06bfdb" />
                </View>
              </View>

              <View style={styles.quickStats}>
                <View style={styles.quickStatCard}>
                  <Feather name="wind" size={20} color="#22d3ee" />
                  <Text style={styles.quickStatLabel}>Wind</Text>
                  <Text style={styles.quickStatValue}>{weatherData.windSpeed} kt</Text>
                  <Text style={styles.quickStatExtra}>{weatherData.windDirection}</Text>
                </View>
                <View style={styles.quickStatCard}>
                  <Feather name="activity" size={20} color="#10b981" />
                  <Text style={styles.quickStatLabel}>Waves</Text>
                  <Text style={styles.quickStatValue}>{weatherData.waveHeight} m</Text>
                  <Text style={styles.quickStatExtra}>{weatherData.seaState}</Text>
                </View>
                <View style={styles.quickStatCard}>
                  <Feather name="eye" size={20} color="#3b82f6" />
                  <Text style={styles.quickStatLabel}>Visibility</Text>
                  <Text style={styles.quickStatValue}>{weatherData.visibility} km</Text>
                  <Text style={styles.quickStatExtra}> </Text>
                </View>
              </View>
            </View>
          </LinearGradient>

          {/* Hourly Forecast */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Feather name="sun" size={20} color="#06bfdb" />
              <Text style={styles.sectionTitle}>Hourly Forecast</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.hourlyScroll}
            >
              {hourlyForecast.map((hour, idx) => (
                <View key={idx} style={styles.hourlyCard}>
                  <Text style={styles.hourlyTime}>{hour.time}</Text>
                  <Feather
                    name={hour.icon === 'cloud' ? 'cloud' : hour.icon === 'sun' ? 'sun' : 'moon'}
                    size={24}
                    color={hour.icon === 'sun' ? '#fb923c' : hour.icon === 'moon' ? '#93c5fd' : '#06bfdb'}
                    style={styles.hourlyIcon}
                  />
                  <Text style={styles.hourlyTemp}>{hour.temp}°</Text>
                  <Text style={styles.hourlyWind}>{hour.wind}kt</Text>
                  <Text style={styles.hourlyWaves}>{hour.waves}m</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Sea Conditions */}
          <LinearGradient
            colors={['rgba(16,185,129,0.2)', 'rgba(5,150,105,0.1)']}
            style={styles.sectionCard}
          >
            <View style={styles.sectionHeader}>
              <Feather name="activity" size={20} color="#10b981" />
              <Text style={styles.sectionTitle}>Sea Conditions</Text>
            </View>
            <View style={styles.seaGrid}>
              <View style={styles.seaCard}>
                <Text style={styles.seaLabel}>Wave Height</Text>
                <Text style={[styles.seaValue, { color: '#10b981' }]}>{weatherData.waveHeight}m</Text>
                <Text style={styles.seaExtra}>{weatherData.waveDirection}</Text>
              </View>
              <View style={styles.seaCard}>
                <Text style={styles.seaLabel}>Swell</Text>
                <Text style={[styles.seaValue, { color: '#10b981' }]}>{weatherData.swellHeight}m</Text>
                <Text style={styles.seaExtra}>{weatherData.swellPeriod}s period</Text>
              </View>
              <View style={styles.seaCard}>
                <Text style={styles.seaLabel}>Sea Temp</Text>
                <Text style={[styles.seaValue, { color: '#22d3ee' }]}>{weatherData.seaTemp}°C</Text>
                <Text style={styles.seaExtra}> </Text>
              </View>
              <View style={styles.seaCard}>
                <Text style={styles.seaLabel}>Current</Text>
                <Text style={[styles.seaValue, { color: '#3b82f6' }]}>{weatherData.currentSpeed} kt</Text>
                <Text style={styles.seaExtra}>{weatherData.currentDirection}</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Atmospheric Details */}
          <View style={styles.twoColumnGrid}>
            <View style={styles.detailCard}>
              <View style={styles.detailHeader}>
                <Feather name="droplet" size={20} color="#22d3ee" />
                <Text style={styles.detailTitle}>Humidity</Text>
              </View>
              <Text style={styles.detailValue}>{weatherData.humidity}%</Text>
            </View>
            <View style={styles.detailCard}>
              <View style={styles.detailHeader}>
                <Feather name="thermometer" size={20} color="#fb923c" />
                <Text style={styles.detailTitle}>Pressure</Text>
              </View>
              <Text style={styles.detailValue}>{weatherData.pressure}</Text>
              <Text style={styles.detailUnit}>hPa</Text>
            </View>
          </View>

          {/* Tide Information */}
          <LinearGradient
            colors={['rgba(59,130,246,0.2)', 'rgba(37,99,235,0.1)']}
            style={styles.sectionCard}
          >
            <View style={styles.sectionHeader}>
              <Feather name="navigation" size={20} color="#3b82f6" />
              <Text style={styles.sectionTitle}>Tide Information</Text>
            </View>
            <View style={styles.tideInfo}>
              <View style={styles.tideRow}>
                <Text style={styles.tideLabel}>Current Status</Text>
                <Text style={[styles.tideValue, { color: '#3b82f6' }]}>{weatherData.tideStatus}</Text>
              </View>
              <View style={styles.tideRow}>
                <Text style={styles.tideLabel}>Time</Text>
                <Text style={styles.tideValue}>{weatherData.tideTime}</Text>
              </View>
              <View style={styles.tideRow}>
                <Text style={styles.tideLabel}>Next Tide</Text>
                <Text style={styles.tideValue}>{weatherData.nextTide}</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Footer */}
          <Text style={styles.footer}>
            Data refreshes automatically every 10 minutes
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(10,25,41,0.8)',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(6,191,219,0.2)',
    borderWidth: 2,
    borderColor: '#06bfdb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
  },
  recentSearches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  recentSearchItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
  },
  recentSearchText: {
    color: '#fff',
    fontSize: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  locationDot: {
    color: 'rgba(255,255,255,0.4)',
  },
  lastUpdated: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  alertCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(251,146,60,0.4)',
  },
  alertContent: {
    flexDirection: 'row',
    gap: 12,
  },
  alertTextContainer: {
    flex: 1,
  },
  alertTitle: {
    color: '#fed7aa',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  alertMessage: {
    color: 'rgba(254,215,170,0.8)',
    fontSize: 13,
  },
  heroCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(6,191,219,0.3)',
    overflow: 'hidden',
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
    gap: 32,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  temperature: {
    fontSize: 72,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  condition: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  feelsLike: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  weatherIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(6,191,219,0.2)',
    borderWidth: 2,
    borderColor: '#06bfdb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickStats: {
    flexDirection: 'row',
    gap: 12,
  },
  quickStatCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  quickStatLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 4,
    marginTop: 8,
  },
  quickStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  quickStatExtra: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  hourlyScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  hourlyCard: {
    width: 80,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  hourlyTime: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 8,
  },
  hourlyIcon: {
    marginBottom: 8,
  },
  hourlyTemp: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  hourlyWind: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
  },
  hourlyWaves: {
    fontSize: 11,
    color: '#10b981',
    marginTop: 4,
  },
  seaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  seaCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  seaLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 4,
  },
  seaValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  seaExtra: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
  },
  twoColumnGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  detailCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  detailTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  detailValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  detailUnit: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  tideInfo: {
    gap: 12,
  },
  tideRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tideLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  tideValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  footer: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default WeatherConditions;