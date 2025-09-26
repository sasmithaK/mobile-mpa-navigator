import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar
} from 'react-native';
import { 
  Activity, 
  Compass, 
  Route, 
  Waves, 
  Navigation, 
  Settings, 
  AlertTriangle,
  Search,
  Anchor,
  BarChart3,
  Ship,
  Clock,
  MapPin
} from 'lucide-react-native';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ShipMap from '../../components/ShipMap';
import StatsCards from '../../components/StatsCards';
import FeaturesGrid from '../../components/FeaturesGrid';
import TechnologyStack from '../../components/TechnologyStack';
import '../../Styles/global.css';

const { width } = Dimensions.get('window');

const Home = () => {
  const [activeSection, setActiveSection] = useState('tracker');
  const scrollY = new Animated.Value(0);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

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
        {/* Enhanced Page Title */}
        <View style={styles.titleContainer}>
          <View style={styles.titleGradient} />
          
          <Text style={styles.mainTitle}>
            Smart Maritime Navigator For Ships
          </Text>
          <Text style={styles.subtitle}>
            Real-time vessel tracking and sustainable route optimization
          </Text>
          
          {/* Live Status Indicators */}
          <View style={styles.statusContainer}>
            {[
              { icon: Activity, label: 'System Status', value: 'Online', color: '#10b981' },
              { icon: Compass, label: 'GPS Accuracy', value: '±2m', color: '#3b82f6' },
              { icon: Route, label: 'Data Update', value: 'Real-time', color: '#f59e0b' }
            ].map((status, index) => (
              <View key={index} style={styles.statusItem}>
                <status.icon size={18} color={status.color} />
                <Text style={styles.statusLabel}>{status.label}: </Text>
                <Text style={[styles.statusValue, { color: status.color }]}>
                  {status.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <StatsCards />

        {/* Enhanced Map Section */}
        <View style={styles.mapContainer}>
          {/* Map Header */}
          <View style={styles.mapHeader}>
            <View style={styles.mapHeaderTop}>
              <View>
                <View style={styles.mapTitleContainer}>
                  <Waves size={28} color="#3b82f6" />
                  <Text style={styles.mapTitle}>Live Maritime Traffic Map</Text>
                </View>
                <Text style={styles.mapSubtitle}>
                  Real-time vessel positions, routes, and navigation data
                </Text>
              </View>
            </View>
            
            {/* Enhanced Map Stats */}
            <View style={styles.mapStats}>
              {[
                { label: 'Total Distance Tracked', value: '2,847 nm', icon: Route },
                { label: 'Active Shipping Lanes', value: '4 major routes', icon: Navigation },
                { label: 'Avg Fleet Speed', value: '15.2 knots', icon: Activity },
                { label: 'Environmental Zones', value: '3 monitored', icon: AlertTriangle }
              ].map((stat, index) => (
                <View key={index} style={styles.mapStatItem}>
                  <View style={styles.mapStatIcon}>
                    <stat.icon size={18} color="#3b82f6" />
                  </View>
                  <View>
                    <Text style={styles.mapStatValue}>{stat.value}</Text>
                    <Text style={styles.mapStatLabel}>{stat.label}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
          
          {/* Map Container */}
          <View style={styles.mapWrapper}>
            <ShipMap />
          </View>
        </View>

        <FeaturesGrid />
        <TechnologyStack />
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
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 120, // Space for header
  },
  titleContainer: {
    backgroundColor: '#f8fafc',
    margin: 16,
    padding: 20,
    borderRadius: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  titleGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#3b82f6',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 25,
    margin: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statusLabel: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  statusValue: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 2,
  },
  mapContainer: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
    overflow: 'hidden',
  },
  mapHeader: {
    padding: 20,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  mapHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  mapTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mapTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 8,
  },
  mapSubtitle: {
    color: '#6b7280',
    fontSize: 14,
  },
  mapStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  mapStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8,
    minWidth: width * 0.4,
  },
  mapStatIcon: {
    width: 36,
    height: 36,
    backgroundColor: '#3b82f620',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  mapStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  mapStatLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  mapWrapper: {
    height: 400,
  },
});

export default Home;