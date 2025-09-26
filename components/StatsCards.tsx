import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView
} from 'react-native';
import { Ship, Route, Clock, MapPin } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const StatsCards = () => {
  const stats = [
    { 
      icon: Ship, 
      label: 'Active Vessels', 
      value: '4', 
      subtext: 'Currently Tracked', 
      color: '#3b82f6', 
      trend: '+2 today' 
    },
    { 
      icon: Route, 
      label: 'Ocean Routes', 
      value: '8', 
      subtext: 'Major Shipping Lanes', 
      color: '#10b981', 
      trend: '4 active' 
    },
    { 
      icon: Clock, 
      label: 'Avg. Speed', 
      value: '15.2 kn', 
      subtext: 'Fleet Average', 
      color: '#f59e0b', 
      trend: '+0.8 kn' 
    },
    { 
      icon: MapPin, 
      label: 'Ports Served', 
      value: '12', 
      subtext: 'Global Network', 
      color: '#8b5cf6', 
      trend: '6 continents' 
    }
  ];

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {stats.map((stat, index) => (
        <TouchableOpacity key={index} style={styles.card}>
          <View style={[styles.iconContainer, { backgroundColor: stat.color + '15' }]}>
            <stat.icon size={28} color={stat.color} />
          </View>
          
          <Text style={styles.value}>{stat.value}</Text>
          
          <Text style={styles.label}>{stat.label}</Text>
          
          <Text style={styles.subtext}>{stat.subtext}</Text>
          
          <View style={[styles.trend, { backgroundColor: stat.color + '10' }]}>
            <View style={[styles.trendDot, { backgroundColor: stat.color }]} />
            <Text style={[styles.trendText, { color: stat.color }]}>
              {stat.trend}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginHorizontal: 8,
    width: width * 0.7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 16,
    textAlign: 'center',
  },
  trend: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  trendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default StatsCards;