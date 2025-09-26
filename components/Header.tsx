import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar
} from 'react-native';
import { Search, Anchor, AlertTriangle, FileText, Info } from 'lucide-react-native';

// Define the prop types
interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeSection, setActiveSection }) => {
  const navItems = [
    { icon: Search, label: 'Ship Tracker', id: 'tracker' },
    { icon: AlertTriangle, label: 'Marine Zones', id: 'zones' },
    { icon: FileText, label: 'Reporting', id: 'reporting' },
    { icon: Info, label: 'About', id: 'about' }
  ];

  // Safely handle StatusBar.currentHeight which can be undefined
  const statusBarHeight = StatusBar.currentHeight || 0;

  return (
    <View style={[styles.header, { paddingTop: statusBarHeight + 12 }]}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Anchor size={32} color="#60a5fa" />
        <Text style={styles.logoText}>EcoNav</Text>
        <View style={styles.liveBadge}>
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      {/* Navigation */}
      <View style={styles.navContainer}>
        {navItems.map(item => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.navItem,
              activeSection === item.id && styles.navItemActive
            ]}
            onPress={() => setActiveSection(item.id)}
          >
            <item.icon size={18} color={activeSection === item.id ? 'white' : 'rgba(255,255,255,0.8)'} />
            <Text style={[
              styles.navText,
              activeSection === item.id && styles.navTextActive
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={18} color="rgba(255,255,255,0.8)" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search vessels, routes..."
          placeholderTextColor="rgba(255,255,255,0.7)"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1e40af',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  liveBadge: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  liveText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  navContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  navItemActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  navText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginLeft: 4,
  },
  navTextActive: {
    color: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    minWidth: 150,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 12,
    marginLeft: 6,
  },
});

export default Header;