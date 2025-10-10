import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform
} from 'react-native';
import { Home, BookOpen, User, Navigation } from 'lucide-react-native';

type TabId = 'home' | 'education' | 'map' | 'profile' | 'tracker';

interface BottomNavBarProps {
  activeTab?: TabId | string;
  onTabChange?: (tab: TabId | string) => void;
}

interface NavItem {
  id: TabId;
  label: string;
  icon: any;
  color: string;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ 
  activeTab = 'home', 
  onTabChange 
}) => {
  const homeScale = useRef(new Animated.Value(1)).current;
  const educationScale = useRef(new Animated.Value(1)).current;
  const mapScale = useRef(new Animated.Value(1)).current;
  const profileScale = useRef(new Animated.Value(1)).current;
  const trackerScale = useRef(new Animated.Value(1)).current;

  const scaleAnimations: Record<string, Animated.Value> = {
    home: homeScale,
    education: educationScale,
    map: mapScale,
    profile: profileScale,
    tracker: trackerScale,
  };

  const navItems: NavItem[] = [
    { 
      id: 'home', 
      label: 'Home', 
      icon: Home,
      color: '#3b82f6'
    },
    { 
      id: 'education', 
      label: 'Learn', 
      icon: BookOpen,
      color: '#10b981'
    },
    { 
      id: 'map', 
      label: 'Navigate', 
      icon: Navigation,
      color: '#f59e0b'
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: User,
      color: '#8b5cf6'
    },
  ];

  const handlePressIn = (itemId: TabId) => {
    Animated.timing(scaleAnimations[itemId], {
      toValue: 0.96,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (itemId: TabId) => {
    Animated.spring(scaleAnimations[itemId], {
      toValue: 1,
      friction: 6,
      tension: 120,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = (itemId: TabId) => {
    if (onTabChange) {
      onTabChange(itemId);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.navContainer}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const IconComponent = item.icon;

            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={1}
                onPress={() => handlePress(item.id)}
                onPressIn={() => handlePressIn(item.id)}
                onPressOut={() => handlePressOut(item.id)}
                style={styles.navItem}
              >
                <Animated.View
                  style={[
                    styles.navItemContent,
                    { transform: [{ scale: scaleAnimations[item.id] }] }
                  ]}
                >
                  <View style={[
                    styles.iconContainer,
                    isActive && { backgroundColor: item.color }
                  ]}>
                    <IconComponent 
                      size={22} 
                      color={isActive ? '#ffffff' : '#94a3b8'} 
                      strokeWidth={2.5}
                    />
                  </View>

                  <Text 
                    style={[
                      styles.label,
                      isActive && { 
                        color: item.color,
                        fontWeight: '700'
                      }
                    ]}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  container: {
    marginHorizontal: 20,
    marginBottom: Platform.OS === 'ios' ? 8 : 10,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(148, 163, 184, 0.15)',
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navItemContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default BottomNavBar;