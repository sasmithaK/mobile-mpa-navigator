import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Platform,
  TextInput,
  ScrollView,
  Animated,
  PanResponder,
} from 'react-native';

// @ts-ignore
import Slider from '@react-native-community/slider';

import { 
  ZoomIn, 
  ZoomOut, 
  Home,
  Eye,
  EyeOff,
  Settings,
  Bell,
  X,
  Play,
  Pause,
  RotateCcw,
  Target,
  Save,
  Trash2,
  Navigation,
  Shield,
  Compass,
  Zap,
  ChevronUp,
  ChevronDown,
  Menu,
  MapPin,
  Layers,
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

// Enhanced interfaces with new features
interface Vessel {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  destination: string;
  route?: RoutePoint[];
  currentRouteIndex?: number;
  mmsi?: string;
  flag?: string;
  status: 'underway' | 'anchored' | 'stopped';
}

interface RoutePoint {
  latitude: number;
  longitude: number;
  name?: string;
}

interface SensitiveZone {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  description: string;
  restrictions: string;
  authority: string;
}

interface Alert {
  id: string;
  message: string;
  severity: string;
}

interface Hotspot {
  id: string;
  name: string;
  description: string;
  category: keyof typeof HOTSPOT_CATEGORIES;
  severity: 'critical' | 'high' | 'medium' | 'low';
  latitude: number;
  longitude: number;
  radius: number;
  timestamp: number;
}

const HOTSPOT_CATEGORIES = {
  INCIDENT: {
    name: 'Incident',
    color: '#dc3545',
    icon: '⚠️',
    description: 'Accident or emergency location'
  },
  HAZARD: {
    name: 'Navigation Hazard',
    color: '#fd7e14',
    icon: '⚡',
    description: 'Dangerous navigation area'
  },
  ANCHORAGE: {
    name: 'Anchorage Point',
    color: '#17a2b8',
    icon: '⚓',
    description: 'Safe anchorage location'
  },
  WILDLIFE: {
    name: 'Wildlife Area',
    color: '#28a745',
    icon: '🐋',
    description: 'Marine wildlife concentration'
  },
  WEATHER: {
    name: 'Weather Event',
    color: '#6f42c1',
    icon: '🌪️',
    description: 'Severe weather location'
  },
  FISHING: {
    name: 'Fishing Ground',
    color: '#20c997',
    icon: '🎣',
    description: 'Active fishing area'
  },
  CUSTOM: {
    name: 'Custom Point',
    color: '#6c757d',
    icon: '📍',
    description: 'User-defined location'
  }
};

const SHIPPING_ROUTES = {
  transatlantic: [
    { latitude: 51.5, longitude: -0.12, name: 'London' },
    { latitude: 48.0, longitude: -15.0 },
    { latitude: 45.0, longitude: -30.0 },
    { latitude: 42.0, longitude: -45.0 },
    { latitude: 40.7, longitude: -74.0, name: 'New York' }
  ],
  transpacific: [
    { latitude: 35.6, longitude: 139.7, name: 'Tokyo' },
    { latitude: 33.0, longitude: 160.0 },
    { latitude: 30.0, longitude: -180.0 },
    { latitude: 35.0, longitude: -150.0 },
    { latitude: 37.7, longitude: -122.4, name: 'San Francisco' }
  ],
  mediterranean: [
    { latitude: 41.9, longitude: 12.5, name: 'Rome' },
    { latitude: 37.0, longitude: 20.0 },
    { latitude: 33.0, longitude: 28.0 },
    { latitude: 28.0, longitude: 40.0 },
    { latitude: 25.2, longitude: 55.3, name: 'Dubai' }
  ]
};

// Mock MapComponent for web
const MapComponent = ({ 
  region, 
  vessels, 
  sensitiveZones, 
  zonesVisible, 
  hotspots,
  isMarkingMode,
  onVesselPress,
  onZonePress,
  onMapPress,
  onRegionChange,
  getShipIcon,
  getZoneColor,
  hotspotCategories
}: any) => {
  // Check if we're on native platform and react-native-maps is available
  if (Platform.OS !== 'web') {
    try {
      const MapView = require('react-native-maps').default;
      const { Marker, Circle, Polyline } = require('react-native-maps');
      
      return (
        <MapView
          style={styles.mapView}
          initialRegion={region}
          onRegionChangeComplete={onRegionChange}
          onPress={isMarkingMode ? onMapPress : undefined}
        >
          {/* Vessel Routes */}
          {vessels.map((vessel: Vessel) => {
            if (!vessel.route || vessel.route.length === 0) return null;
            
            const coordinates = vessel.route.map(point => ({
              latitude: point.latitude,
              longitude: point.longitude
            }));
            
            return (
              <Polyline
                key={`route-${vessel.id}`}
                coordinates={coordinates}
                strokeColor="#3b82f6"
                strokeWidth={3}
                lineDashPattern={[10, 5]}
              />
            );
          })}

          {/* Sensitive Zones */}
          {zonesVisible && sensitiveZones.map((zone: SensitiveZone) => (
            <React.Fragment key={zone.id}>
              <Circle
                center={{
                  latitude: zone.latitude,
                  longitude: zone.longitude
                }}
                radius={zone.radius}
                strokeColor={getZoneColor(zone.severity)}
                fillColor={getZoneColor(zone.severity) + '30'}
                strokeWidth={2}
              />
              <Marker
                coordinate={{
                  latitude: zone.latitude,
                  longitude: zone.longitude
                }}
                title={zone.name}
                description={`${zone.severity.toUpperCase()} Priority Zone`}
                onPress={() => onZonePress && onZonePress(zone)}
                opacity={0}
              />
            </React.Fragment>
          ))}

          {/* Hotspots */}
          {hotspots.map((hotspot: Hotspot) => {
            const config = hotspotCategories[hotspot.category];
            return (
              <React.Fragment key={hotspot.id}>
                <Circle
                  center={{
                    latitude: hotspot.latitude,
                    longitude: hotspot.longitude
                  }}
                  radius={hotspot.radius}
                  strokeColor={config.color}
                  fillColor={config.color + '30'}
                  strokeWidth={2}
                />
                <Marker
                  coordinate={{
                    latitude: hotspot.latitude,
                    longitude: hotspot.longitude
                  }}
                  title={hotspot.name}
                  description={hotspot.description}
                >
                  <View style={styles.hotspotMarker}>
                    <View style={[
                      styles.hotspotMarkerCircle,
                      { backgroundColor: config.color }
                    ]}>
                      <Text style={styles.hotspotIcon}>{config.icon}</Text>
                    </View>
                  </View>
                </Marker>
              </React.Fragment>
            );
          })}

          {/* Vessels */}
          {vessels.map((vessel: Vessel) => (
            <Marker
              key={vessel.id}
              coordinate={{
                latitude: vessel.latitude,
                longitude: vessel.longitude
              }}
              title={vessel.name}
              description={`Speed: ${vessel.speed} knots | Heading: ${Math.round(vessel.heading)}°`}
              onPress={() => onVesselPress(vessel)}
              rotation={vessel.heading}
            >
              <View style={styles.vesselMarker}>
                <View style={[styles.vesselHeading, { transform: [{ rotate: `${vessel.heading}deg` }] }]}>
                  <Text style={styles.headingArrow}>▲</Text>
                </View>
                <Text style={styles.vesselIcon}>{getShipIcon(vessel.type)}</Text>
              </View>
            </Marker>
          ))}
        </MapView>
      );
    } catch (error) {
      console.log('react-native-maps not available, using fallback');
    }
  }

  // Web fallback with improved visuals
  const [mapDimensions, setMapDimensions] = React.useState({ width: 0, height: 0 });

  const convertToMapPosition = (lat: number, lon: number) => {
    if (mapDimensions.width === 0) return { left: 0, top: 0 };
    
    const leftPercent = ((lon + 180) / 360);
    const topPercent = ((90 - lat) / 180);
    
    return {
      left: leftPercent * mapDimensions.width,
      top: topPercent * mapDimensions.height,
    };
  };

  const handleMapLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setMapDimensions({ width, height });
  };

  const handleMapClick = (event: any) => {
    if (!isMarkingMode || !onMapPress) return;
    
    const { locationX, locationY } = event.nativeEvent;
    const lat = 90 - (locationY / mapDimensions.height) * 180;
    const lon = (locationX / mapDimensions.width) * 360 - 180;
    
    onMapPress({
      nativeEvent: {
        coordinate: { latitude: lat, longitude: lon }
      }
    });
  };

  return (
    <View style={styles.mapContainer}>
      <View 
        style={[styles.mockMap, isMarkingMode && styles.markingMode]}
        onLayout={handleMapLayout}
        // @ts-ignore
        onClick={handleMapClick}
      >
        <View style={styles.mockOcean}>
          {mapDimensions.width > 0 && (
            <>
              {vessels.map((vessel: Vessel) => {
                if (!vessel.route || vessel.route.length === 0) return null;
                
                return (
                  <View key={`route-${vessel.id}`} style={styles.routeContainer}>
                    {vessel.route.map((point, index) => {
                      if (index === 0) return null;
                      const prevPoint = vessel.route![index - 1];
                      const startPos = convertToMapPosition(prevPoint.latitude, prevPoint.longitude);
                      const endPos = convertToMapPosition(point.latitude, point.longitude);
                      
                      const dx = endPos.left - startPos.left;
                      const dy = endPos.top - startPos.top;
                      const length = Math.sqrt(dx * dx + dy * dy);
                      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
                      
                      return (
                        <View
                          key={`segment-${vessel.id}-${index}`}
                          style={[
                            styles.routeLine,
                            {
                              left: startPos.left,
                              top: startPos.top,
                              width: length,
                              transform: [{ rotate: `${angle}deg` }],
                            }
                          ]}
                        />
                      );
                    })}
                  </View>
                );
              })}
              
              {zonesVisible && sensitiveZones.map((zone: SensitiveZone) => {
                const position = convertToMapPosition(zone.latitude, zone.longitude);
                const zoneColor = getZoneColor(zone.severity);
                return (
                  <TouchableOpacity
                    key={zone.id}
                    style={[
                      styles.mockZone,
                      {
                        left: position.left,
                        top: position.top,
                        backgroundColor: zoneColor + '40',
                        borderColor: zoneColor,
                      }
                    ]}
                    onPress={() => onZonePress && onZonePress(zone)}
                    activeOpacity={0.7}
                  />
                );
              })}
              
              {hotspots.map((hotspot: Hotspot) => {
                const position = convertToMapPosition(hotspot.latitude, hotspot.longitude);
                const config = hotspotCategories[hotspot.category];
                return (
                  <View
                    key={hotspot.id}
                    style={[
                      styles.hotspotMarker,
                      {
                        left: position.left,
                        top: position.top,
                        backgroundColor: config.color,
                      }
                    ]}
                  >
                    <Text style={styles.hotspotIcon}>{config.icon}</Text>
                  </View>
                );
              })}
              
              {vessels.map((vessel: Vessel) => {
                const position = convertToMapPosition(vessel.latitude, vessel.longitude);
                return (
                  <TouchableOpacity
                    key={vessel.id}
                    style={[
                      styles.mockVessel,
                      {
                        left: position.left,
                        top: position.top,
                      }
                    ]}
                    onPress={() => onVesselPress(vessel)}
                  >
                    <View style={[styles.vesselHeading, { transform: [{ rotate: `${vessel.heading}deg` }] }]}>
                      <Text style={styles.headingArrow}>▲</Text>
                    </View>
                    <Text style={styles.vesselIcon}>{getShipIcon(vessel.type)}</Text>
                  </TouchableOpacity>
                );
              })}
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const ShipMap = () => {
  const [region, setRegion] = useState({
    latitude: 20,
    longitude: 0,
    latitudeDelta: 50,
    longitudeDelta: 50,
  });
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [sensitiveZones, setSensitiveZones] = useState<SensitiveZone[]>([]);
  const [zonesVisible, setZonesVisible] = useState<boolean>(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);
  const [selectedZone, setSelectedZone] = useState<SensitiveZone | null>(null);
  const [showVesselInfo, setShowVesselInfo] = useState<boolean>(false);
  const [showZoneInfo, setShowZoneInfo] = useState<boolean>(false);
  const [simulationActive, setSimulationActive] = useState<boolean>(false);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(0.1);
  
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [isMarkingMode, setIsMarkingMode] = useState<boolean>(false);
  const [showHotspotForm, setShowHotspotForm] = useState<boolean>(false);
  const [pendingHotspot, setPendingHotspot] = useState<{latitude: number; longitude: number} | null>(null);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [hotspotFormData, setHotspotFormData] = useState({
    name: '',
    description: '',
    category: 'INCIDENT' as keyof typeof HOTSPOT_CATEGORIES,
    severity: 'medium' as 'critical' | 'high' | 'medium' | 'low',
    radius: 5000
  });
  
  // Bottom sheet state
  const [bottomSheetExpanded, setBottomSheetExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'vessels' | 'zones' | 'hotspots' | 'controls'>('controls');
  const bottomSheetAnimation = useRef(new Animated.Value(140)).current;
  
  const simulationIntervalRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    initializeVessels();
    initializeSensitiveZones();
    
    setHotspots([
      {
        id: '1',
        name: 'Storm Warning',
        description: 'Heavy storm reported in this area',
        category: 'WEATHER',
        severity: 'high',
        latitude: 35.0,
        longitude: -40.0,
        radius: 100000,
        timestamp: Date.now()
      },
      {
        id: '2',
        name: 'Whale Migration',
        description: 'Active whale migration route',
        category: 'WILDLIFE',
        severity: 'medium',
        latitude: 45.0,
        longitude: -20.0,
        radius: 50000,
        timestamp: Date.now()
      }
    ]);
  }, []);

  useEffect(() => {
    if (simulationActive) {
      startSimulation();
    } else {
      stopSimulation();
    }
    
    return () => stopSimulation();
  }, [simulationActive, simulationSpeed]);

  // Bottom sheet animation
  useEffect(() => {
    Animated.spring(bottomSheetAnimation, {
      toValue: bottomSheetExpanded ? height * 0.7 : 140,
      useNativeDriver: false,
      friction: 8,
    }).start();
  }, [bottomSheetExpanded]);

  const initializeVessels = () => {
    const ships: Vessel[] = [
      {
        id: '1',
        mmsi: '235123456',
        name: 'Atlantic Explorer',
        type: 'cargo',
        latitude: 51.5,
        longitude: -0.12,
        speed: 14.2,
        heading: 245,
        destination: 'New York',
        route: SHIPPING_ROUTES.transatlantic,
        currentRouteIndex: 0,
        flag: 'UK',
        status: 'underway'
      },
      {
        id: '2',
        mmsi: '477123789',
        name: 'Pacific Voyager',
        type: 'tanker',
        latitude: 35.6,
        longitude: 139.7,
        speed: 11.8,
        heading: 45,
        destination: 'San Francisco',
        route: SHIPPING_ROUTES.transpacific,
        currentRouteIndex: 0,
        flag: 'Japan',
        status: 'underway'
      },
      {
        id: '3',
        mmsi: '636789123',
        name: 'Mediterranean Star',
        type: 'cruise',
        latitude: 41.9,
        longitude: 12.5,
        speed: 18.5,
        heading: 120,
        destination: 'Dubai',
        route: SHIPPING_ROUTES.mediterranean,
        currentRouteIndex: 0,
        flag: 'Italy',
        status: 'underway'
      },
      {
        id: '4',
        mmsi: '413456789',
        name: 'Cape Navigator',
        type: 'container',
        latitude: -33.9,
        longitude: 18.4,
        speed: 16.3,
        heading: 80,
        destination: 'Singapore',
        route: [
          { latitude: -33.9, longitude: 18.4, name: 'Cape Town' },
          { latitude: -30.0, longitude: 35.0 },
          { latitude: 0.0, longitude: 75.0 },
          { latitude: 1.3, longitude: 103.8, name: 'Singapore' }
        ],
        currentRouteIndex: 0,
        flag: 'South Africa',
        status: 'underway'
      }
    ];
    setVessels(ships);
  };

  const initializeSensitiveZones = () => {
    const zones: SensitiveZone[] = [
      {
        id: '1',
        name: 'Great Barrier Reef Marine Park',
        type: 'marine_protected_area',
        latitude: -16.0,
        longitude: 145.8,
        radius: 200000,
        severity: 'high',
        description: 'World Heritage marine protected area',
        restrictions: 'No anchoring, speed restrictions, waste discharge prohibited',
        authority: 'Great Barrier Reef Marine Park Authority'
      },
      {
        id: '2',
        name: 'Monterey Bay National Marine Sanctuary',
        type: 'national_marine_sanctuary',
        latitude: 36.25,
        longitude: -121.75,
        radius: 75000,
        severity: 'high',
        description: 'Critical habitat for marine mammals and seabirds',
        restrictions: 'Speed restrictions for whale protection, no dumping',
        authority: 'NOAA'
      },
      {
        id: '3',
        name: 'Wadden Sea World Heritage Site',
        type: 'world_heritage_site',
        latitude: 54.15,
        longitude: 7.25,
        radius: 120000,
        severity: 'medium',
        description: 'Tidal flat ecosystem, critical for migratory birds',
        restrictions: 'Seasonal navigation restrictions, draft limitations',
        authority: 'Trilateral Wadden Sea Cooperation'
      },
      {
        id: '4',
        name: 'Galápagos Marine Reserve',
        type: 'marine_reserve',
        latitude: -0.5,
        longitude: -90.0,
        radius: 150000,
        severity: 'critical',
        description: 'Unique ecosystem with endemic species',
        restrictions: 'Restricted access, authorized vessels only',
        authority: 'Galápagos National Park Service'
      }
    ];
    setSensitiveZones(zones);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const calculateHeading = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const y = Math.sin(dLon) * Math.cos(lat2 * Math.PI / 180);
    const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
              Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(dLon);
    const heading = Math.atan2(y, x) * 180 / Math.PI;
    return (heading + 360) % 360;
  };

  const moveVesselToNextWaypoint = (vessel: Vessel): Vessel => {
    if (!vessel.route || vessel.route.length === 0) return vessel;
    
    const currentIndex = vessel.currentRouteIndex || 0;
    const nextIndex = (currentIndex + 1) % vessel.route.length;
    const nextPoint = vessel.route[nextIndex];
    
    const newHeading = calculateHeading(
      vessel.latitude,
      vessel.longitude,
      nextPoint.latitude,
      nextPoint.longitude
    );
    
    checkZoneProximity(vessel, nextPoint);
    
    return {
      ...vessel,
      currentRouteIndex: nextIndex,
      latitude: nextPoint.latitude,
      longitude: nextPoint.longitude,
      heading: newHeading
    };
  };

  const interpolateVesselPosition = (vessel: Vessel, deltaTimeMs: number): Vessel => {
    if (!vessel.route || vessel.route.length === 0) return vessel;
    
    const currentIndex = vessel.currentRouteIndex || 0;
    const targetPoint = vessel.route[currentIndex];
    
    const distance = calculateDistance(
      vessel.latitude,
      vessel.longitude,
      targetPoint.latitude,
      targetPoint.longitude
    );
    
    if (distance < 1) {
      return moveVesselToNextWaypoint(vessel);
    }
    
    const speedKmPerHour = vessel.speed * 1.852;
    const moveDistance = (speedKmPerHour / 3600000) * deltaTimeMs * simulationSpeed * 0.001;
    
    if (moveDistance >= distance) {
      return moveVesselToNextWaypoint(vessel);
    }
    
    const ratio = moveDistance / distance;
    const newLat = vessel.latitude + (targetPoint.latitude - vessel.latitude) * ratio;
    const newLon = vessel.longitude + (targetPoint.longitude - vessel.longitude) * ratio;
    
    const newHeading = calculateHeading(
      vessel.latitude,
      vessel.longitude,
      targetPoint.latitude,
      targetPoint.longitude
    );
    
    return {
      ...vessel,
      latitude: newLat,
      longitude: newLon,
      heading: newHeading
    };
  };

  const checkZoneProximity = (vessel: Vessel, nextPoint: RoutePoint) => {
    sensitiveZones.forEach(zone => {
      const distance = calculateDistance(
        nextPoint.latitude,
        nextPoint.longitude,
        zone.latitude,
        zone.longitude
      );
      
      if (distance < zone.radius / 1000) {
        addAlert(`${vessel.name} approaching ${zone.name} (${distance.toFixed(1)} km away)`);
      }
    });
  };

  const updateVesselPositions = () => {
    const now = Date.now();
    const deltaTime = now - lastUpdateTimeRef.current;
    lastUpdateTimeRef.current = now;
    
    setVessels(prevVessels => 
      prevVessels.map(vessel => interpolateVesselPosition(vessel, deltaTime))
    );
  };

  const startSimulation = () => {
    stopSimulation();
    lastUpdateTimeRef.current = Date.now();
    
    simulationIntervalRef.current = setInterval(() => {
      updateVesselPositions();
    }, 100) as unknown as number;
  };

  const stopSimulation = () => {
    if (simulationIntervalRef.current !== null) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
  };

  const resetSimulation = () => {
    setSimulationActive(false);
    setTimeout(() => {
      initializeVessels();
      setAlerts([]);
    }, 100);
  };

  const startHotspotMarking = () => {
    setIsMarkingMode(true);
    addAlert('Tap on the map to mark a hotspot location');
    setBottomSheetExpanded(false);
  };

  const handleMapPress = (event: any) => {
    if (!isMarkingMode) return;
    
    const { latitude, longitude } = event.nativeEvent?.coordinate || region;
    setPendingHotspot({ latitude, longitude });
    setShowHotspotForm(true);
    setIsMarkingMode(false);
  };

  const saveHotspot = () => {
    if (!pendingHotspot || !hotspotFormData.name.trim()) return;

    const newHotspot: Hotspot = {
      id: `hotspot-${Date.now()}`,
      name: hotspotFormData.name.trim(),
      description: hotspotFormData.description.trim(),
      category: hotspotFormData.category,
      severity: hotspotFormData.severity,
      latitude: pendingHotspot.latitude,
      longitude: pendingHotspot.longitude,
      radius: hotspotFormData.radius,
      timestamp: Date.now()
    };

    setHotspots(prev => [...prev, newHotspot]);
    setShowHotspotForm(false);
    setPendingHotspot(null);
    setHotspotFormData({
      name: '',
      description: '',
      category: 'INCIDENT',
      severity: 'medium',
      radius: 5000
    });
    
    addAlert(`Hotspot "${newHotspot.name}" created`);
  };

  const deleteHotspot = (hotspotId: string) => {
    setHotspots(prev => prev.filter(h => h.id !== hotspotId));
    addAlert('Hotspot deleted');
  };

  const getZoneColor = (severity: SensitiveZone['severity']): string => {
    switch (severity) {
      case 'critical': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'medium': return '#ffc107';
      default: return '#28a745';
    }
  };

  const getShipIcon = (type: string): string => {
    const icons: { [key: string]: string } = {
      cargo: '🚢',
      tanker: '⛴️',
      cruise: '🛳️',
      container: '📦'
    };
    return icons[type] || '⚓';
  };

  const handleVesselPress = (vessel: Vessel) => {
    setSelectedVessel(vessel);
    setShowVesselInfo(true);
    setBottomSheetExpanded(false);
  };

  const handleZonePress = (zone: SensitiveZone) => {
    setSelectedZone(zone);
    setShowZoneInfo(true);
    setBottomSheetExpanded(false);
  };

  const addAlert = (message: string) => {
    setAlerts(prev => {
      const exists = prev.some(a => a.message === message);
      if (exists) return prev;
      
      const newAlert: Alert = {
        id: Date.now().toString(),
        message,
        severity: 'warning'
      };
      return [newAlert, ...prev.slice(0, 2)];
    });
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const getStats = () => {
    return {
      totalDistance: vessels.reduce((sum, vessel) => sum + vessel.speed, 0) * 2847 / vessels.length,
      activeRoutes: 4,
      avgSpeed: vessels.reduce((sum, vessel) => sum + vessel.speed, 0) / vessels.length,
      monitoredZones: sensitiveZones.length
    };
  };

  const stats = getStats();

  return (
    <View style={styles.container}>
      {/* Full Screen Map */}
      <MapComponent
        region={region}
        vessels={vessels}
        sensitiveZones={sensitiveZones}
        zonesVisible={zonesVisible}
        hotspots={showHotspots ? hotspots : []}
        isMarkingMode={isMarkingMode}
        onVesselPress={handleVesselPress}
        onZonePress={handleZonePress}
        onMapPress={handleMapPress}
        onRegionChange={setRegion}
        getShipIcon={getShipIcon}
        getZoneColor={getZoneColor}
        hotspotCategories={HOTSPOT_CATEGORIES}
      />

      {/* Top Stats Bar */}
      <View style={styles.topBar}>
        <View style={styles.statPill}>
          <Compass size={14} color="#3b82f6" />
          <Text style={styles.statText}>{stats.totalDistance.toFixed(0)} nm</Text>
        </View>
        <View style={styles.statPill}>
          <Navigation size={14} color="#3b82f6" />
          <Text style={styles.statText}>{stats.activeRoutes} Routes</Text>
        </View>
        <View style={styles.statPill}>
          <Zap size={14} color="#3b82f6" />
          <Text style={styles.statText}>{stats.avgSpeed.toFixed(1)} kn</Text>
        </View>
        <View style={styles.statPill}>
          <Shield size={14} color="#3b82f6" />
          <Text style={styles.statText}>{stats.monitoredZones}</Text>
        </View>
      </View>

      {/* Alerts */}
      {alerts.length > 0 && (
        <View style={styles.alertsTop}>
          {alerts.map(alert => (
            <View key={alert.id} style={styles.alertCard}>
              <Bell size={14} color="#fff" />
              <Text style={styles.alertCardText}>{alert.message}</Text>
              <TouchableOpacity onPress={() => removeAlert(alert.id)}>
                <X size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Map Controls - Right Side */}
      <View style={styles.mapControls}>
        <TouchableOpacity 
          style={styles.mapControlButton}
          onPress={() => setZonesVisible(!zonesVisible)}
        >
          <Layers size={20} color={zonesVisible ? "#3b82f6" : "#6b7280"} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.mapControlButton}
          onPress={() => setShowHotspots(!showHotspots)}
        >
          <MapPin size={20} color={showHotspots ? "#3b82f6" : "#6b7280"} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.mapControlButton}
          onPress={() => setRegion({
            latitude: 20,
            longitude: 0,
            latitudeDelta: 50,
            longitudeDelta: 50,
          })}
        >
          <Home size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet */}
      <Animated.View 
        style={[
          styles.bottomSheet,
          { height: bottomSheetAnimation }
        ]}
      >
        {/* Bottom Sheet Handle */}
        <TouchableOpacity 
          style={styles.sheetHandle}
          onPress={() => setBottomSheetExpanded(!bottomSheetExpanded)}
          activeOpacity={0.8}
        >
          <View style={styles.handleBar} />
          {!bottomSheetExpanded && (
            <View style={styles.quickStats}>
              <View style={styles.quickStatItem}>
                <View style={[styles.statusDot, simulationActive ? styles.statusActive : styles.statusInactive]} />
                <Text style={styles.quickStatText}>
                  {simulationActive ? 'Running' : 'Paused'}
                </Text>
              </View>
              <Text style={styles.quickStatDivider}>•</Text>
              <Text style={styles.quickStatText}>{vessels.length} Vessels</Text>
              <Text style={styles.quickStatDivider}>•</Text>
              <Text style={styles.quickStatText}>{hotspots.length} Hotspots</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Tabs */}
        <View style={styles.tabBar}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'controls' && styles.tabActive]}
            onPress={() => setActiveTab('controls')}
          >
            <Settings size={18} color={activeTab === 'controls' ? '#3b82f6' : '#6b7280'} />
            <Text style={[styles.tabText, activeTab === 'controls' && styles.tabTextActive]}>
              Controls
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'vessels' && styles.tabActive]}
            onPress={() => setActiveTab('vessels')}
          >
            <Navigation size={18} color={activeTab === 'vessels' ? '#3b82f6' : '#6b7280'} />
            <Text style={[styles.tabText, activeTab === 'vessels' && styles.tabTextActive]}>
              Vessels
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{vessels.length}</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'zones' && styles.tabActive]}
            onPress={() => setActiveTab('zones')}
          >
            <Shield size={18} color={activeTab === 'zones' ? '#3b82f6' : '#6b7280'} />
            <Text style={[styles.tabText, activeTab === 'zones' && styles.tabTextActive]}>
              Zones
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{sensitiveZones.length}</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'hotspots' && styles.tabActive]}
            onPress={() => setActiveTab('hotspots')}
          >
            <Target size={18} color={activeTab === 'hotspots' ? '#3b82f6' : '#6b7280'} />
            <Text style={[styles.tabText, activeTab === 'hotspots' && styles.tabTextActive]}>
              Hotspots
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{hotspots.length}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <ScrollView style={styles.sheetContent} showsVerticalScrollIndicator={false}>
          {activeTab === 'controls' && (
            <View style={styles.controlsTab}>
              {/* Simulation Controls */}
              <View style={styles.controlSection}>
                <Text style={styles.sectionTitle}>Simulation Control</Text>
                <View style={styles.simulationPanel}>
                  <View style={styles.simControlRow}>
                    <TouchableOpacity 
                      style={[styles.simBtn, simulationActive && styles.simBtnActive]}
                      onPress={() => setSimulationActive(!simulationActive)}
                    >
                      {simulationActive ? <Pause size={20} color="#fff" /> : <Play size={20} color="#fff" />}
                      <Text style={styles.simBtnText}>
                        {simulationActive ? 'Pause' : 'Start'}
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.simBtn}
                      onPress={resetSimulation}
                    >
                      <RotateCcw size={20} color="#fff" />
                      <Text style={styles.simBtnText}>Reset</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.speedControlSection}>
                    <View style={styles.speedHeader}>
                      <Text style={styles.speedLabel}>Simulation Speed</Text>
                      <Text style={styles.speedValue}>{simulationSpeed.toFixed(2)}x</Text>
                    </View>
                    <Slider
                      style={styles.slider}
                      minimumValue={0.01}
                      maximumValue={2}
                      step={0.05}
                      value={simulationSpeed}
                      onValueChange={setSimulationSpeed}
                      minimumTrackTintColor="#3b82f6"
                      maximumTrackTintColor="#e5e7eb"
                      thumbTintColor="#3b82f6"
                    />
                    <View style={styles.speedPresets}>
                      {[0.1, 0.5, 1.0, 2.0].map(speed => (
                        <TouchableOpacity
                          key={speed}
                          style={[
                            styles.speedPreset,
                            Math.abs(simulationSpeed - speed) < 0.01 && styles.speedPresetActive
                          ]}
                          onPress={() => setSimulationSpeed(speed)}
                        >
                          <Text style={[
                            styles.speedPresetText,
                            Math.abs(simulationSpeed - speed) < 0.01 && styles.speedPresetTextActive
                          ]}>
                            {speed}x
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
              </View>

              {/* Hotspot Marking */}
              <View style={styles.controlSection}>
                <Text style={styles.sectionTitle}>Hotspot Marking</Text>
                <TouchableOpacity 
                  style={[styles.actionButton, isMarkingMode && styles.actionButtonActive]}
                  onPress={startHotspotMarking}
                >
                  <Target size={20} color={isMarkingMode ? "#fff" : "#3b82f6"} />
                  <Text style={[styles.actionButtonText, isMarkingMode && styles.actionButtonTextActive]}>
                    {isMarkingMode ? 'Marking Mode Active' : 'Mark Hotspot on Map'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Layer Toggles */}
              <View style={styles.controlSection}>
                <Text style={styles.sectionTitle}>Map Layers</Text>
                <View style={styles.toggleGroup}>
                  <TouchableOpacity 
                    style={styles.toggleItem}
                    onPress={() => setZonesVisible(!zonesVisible)}
                  >
                    <View style={styles.toggleLeft}>
                      <Shield size={18} color="#6b7280" />
                      <Text style={styles.toggleLabel}>Sensitive Zones</Text>
                    </View>
                    <View style={[styles.toggleSwitch, zonesVisible && styles.toggleSwitchActive]}>
                      <View style={[styles.toggleThumb, zonesVisible && styles.toggleThumbActive]} />
                    </View>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.toggleItem}
                    onPress={() => setShowHotspots(!showHotspots)}
                  >
                    <View style={styles.toggleLeft}>
                      <MapPin size={18} color="#6b7280" />
                      <Text style={styles.toggleLabel}>Hotspots</Text>
                    </View>
                    <View style={[styles.toggleSwitch, showHotspots && styles.toggleSwitchActive]}>
                      <View style={[styles.toggleThumb, showHotspots && styles.toggleThumbActive]} />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'vessels' && (
            <View style={styles.listTab}>
              {vessels.map(vessel => (
                <TouchableOpacity
                  key={vessel.id}
                  style={styles.listCard}
                  onPress={() => handleVesselPress(vessel)}
                >
                  <View style={styles.listCardHeader}>
                    <Text style={styles.listCardIcon}>{getShipIcon(vessel.type)}</Text>
                    <View style={styles.listCardInfo}>
                      <Text style={styles.listCardTitle}>{vessel.name}</Text>
                      <Text style={styles.listCardSubtitle}>
                        {vessel.type} • {vessel.destination}
                      </Text>
                    </View>
                    <View style={[
                      styles.statusPill,
                      { backgroundColor: vessel.status === 'underway' ? '#10b981' : '#6b7280' }
                    ]}>
                      <Text style={styles.statusPillText}>
                        {vessel.status}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.listCardDetails}>
                    <View style={styles.detailItem}>
                      <Zap size={12} color="#6b7280" />
                      <Text style={styles.detailText}>{vessel.speed} kn</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Compass size={12} color="#6b7280" />
                      <Text style={styles.detailText}>{Math.round(vessel.heading)}°</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <MapPin size={12} color="#6b7280" />
                      <Text style={styles.detailText}>
                        {vessel.latitude.toFixed(2)}°, {vessel.longitude.toFixed(2)}°
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {activeTab === 'zones' && (
            <View style={styles.listTab}>
              {sensitiveZones.map(zone => (
                <TouchableOpacity
                  key={zone.id}
                  style={[styles.listCard, { borderLeftWidth: 4, borderLeftColor: getZoneColor(zone.severity) }]}
                  onPress={() => handleZonePress(zone)}
                >
                  <View style={styles.listCardHeader}>
                    <View style={styles.listCardInfo}>
                      <Text style={styles.listCardTitle}>{zone.name}</Text>
                      <Text style={styles.listCardSubtitle}>
                        {zone.type.replace(/_/g, ' ')}
                      </Text>
                    </View>
                    <View style={[
                      styles.severityPill,
                      { backgroundColor: getZoneColor(zone.severity) }
                    ]}>
                      <Text style={styles.severityPillText}>
                        {zone.severity.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.zoneDescription} numberOfLines={2}>
                    {zone.description}
                  </Text>
                  <View style={styles.listCardDetails}>
                    <View style={styles.detailItem}>
                      <Shield size={12} color="#6b7280" />
                      <Text style={styles.detailText}>Radius: {(zone.radius / 1000).toFixed(1)} km</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {activeTab === 'hotspots' && (
            <View style={styles.listTab}>
              {hotspots.length === 0 ? (
                <View style={styles.emptyState}>
                  <Target size={48} color="#d1d5db" />
                  <Text style={styles.emptyStateText}>No hotspots marked yet</Text>
                  <TouchableOpacity 
                    style={styles.emptyStateButton}
                    onPress={startHotspotMarking}
                  >
                    <Text style={styles.emptyStateButtonText}>Mark Your First Hotspot</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                hotspots.map(hotspot => {
                  const config = HOTSPOT_CATEGORIES[hotspot.category];
                  return (
                    <View
                      key={hotspot.id}
                      style={[styles.listCard, { borderLeftWidth: 4, borderLeftColor: config.color }]}
                    >
                      <View style={styles.listCardHeader}>
                        <Text style={styles.hotspotEmoji}>{config.icon}</Text>
                        <View style={styles.listCardInfo}>
                          <Text style={styles.listCardTitle}>{hotspot.name}</Text>
                          <Text style={styles.listCardSubtitle}>{config.name}</Text>
                        </View>
                        <TouchableOpacity onPress={() => deleteHotspot(hotspot.id)}>
                          <Trash2 size={18} color="#dc3545" />
                        </TouchableOpacity>
                      </View>
                      {hotspot.description && (
                        <Text style={styles.hotspotDesc} numberOfLines={2}>
                          {hotspot.description}
                        </Text>
                      )}
                      <View style={styles.listCardDetails}>
                        <View style={[
                          styles.severityPill,
                          { backgroundColor: getZoneColor(hotspot.severity) }
                        ]}>
                          <Text style={styles.severityPillText}>
                            {hotspot.severity.toUpperCase()}
                          </Text>
                        </View>
                        <View style={styles.detailItem}>
                          <MapPin size={12} color="#6b7280" />
                          <Text style={styles.detailText}>{(hotspot.radius / 1000).toFixed(1)} km</Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          )}
        </ScrollView>
      </Animated.View>

      {/* Modals */}
      <Modal
        visible={showVesselInfo}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowVesselInfo(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {selectedVessel && (
              <>
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.modalTitle}>{selectedVessel.name}</Text>
                    <Text style={styles.modalSubtitle}>MMSI: {selectedVessel.mmsi}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setShowVesselInfo(false)}>
                    <X size={24} color="#6b7280" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.vesselIconBox}>
                  <Text style={styles.vesselIconXL}>{getShipIcon(selectedVessel.type)}</Text>
                </View>
                
                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Type</Text>
                    <Text style={styles.infoValue}>{selectedVessel.type}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Speed</Text>
                    <Text style={styles.infoValue}>{selectedVessel.speed} kn</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Heading</Text>
                    <Text style={styles.infoValue}>{Math.round(selectedVessel.heading)}°</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Status</Text>
                    <Text style={[styles.infoValue, { color: simulationActive ? '#10b981' : '#6b7280' }]}>
                      {simulationActive ? 'Underway' : 'Stopped'}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoSection}>
                  <Text style={styles.infoSectionTitle}>Destination</Text>
                  <Text style={styles.infoSectionValue}>{selectedVessel.destination}</Text>
                </View>

                <View style={styles.infoSection}>
                  <Text style={styles.infoSectionTitle}>Current Position</Text>
                  <Text style={styles.infoSectionValue}>
                    {selectedVessel.latitude.toFixed(4)}°, {selectedVessel.longitude.toFixed(4)}°
                  </Text>
                </View>

                {selectedVessel.route && (
                  <View style={styles.infoSection}>
                    <Text style={styles.infoSectionTitle}>Route Progress</Text>
                    <Text style={styles.infoSectionValue}>
                      Waypoint {(selectedVessel.currentRouteIndex || 0) + 1} of {selectedVessel.route.length}
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={showZoneInfo}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowZoneInfo(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {selectedZone && (
              <>
                <View style={styles.modalHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalTitle}>{selectedZone.name}</Text>
                    <View style={[
                      styles.severityBadgeLarge,
                      { backgroundColor: getZoneColor(selectedZone.severity) }
                    ]}>
                      <Text style={styles.severityBadgeText}>
                        {selectedZone.severity.toUpperCase()} PRIORITY
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => setShowZoneInfo(false)}>
                    <X size={24} color="#6b7280" />
                  </TouchableOpacity>
                </View>

                <View style={styles.infoSection}>
                  <Text style={styles.infoSectionTitle}>Type</Text>
                  <Text style={styles.infoSectionValue}>
                    {selectedZone.type.replace(/_/g, ' ').toUpperCase()}
                  </Text>
                </View>

                <View style={styles.infoSection}>
                  <Text style={styles.infoSectionTitle}>Description</Text>
                  <Text style={styles.infoSectionValue}>{selectedZone.description}</Text>
                </View>

                <View style={styles.infoSection}>
                  <Text style={styles.infoSectionTitle}>Restrictions</Text>
                  <Text style={styles.infoSectionValue}>{selectedZone.restrictions}</Text>
                </View>

                <View style={styles.infoSection}>
                  <Text style={styles.infoSectionTitle}>Authority</Text>
                  <Text style={styles.infoSectionValue}>{selectedZone.authority}</Text>
                </View>

                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Radius</Text>
                    <Text style={styles.infoValue}>{(selectedZone.radius / 1000).toFixed(1)} km</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Location</Text>
                    <Text style={styles.infoValue}>
                      {selectedZone.latitude.toFixed(2)}°, {selectedZone.longitude.toFixed(2)}°
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={showHotspotForm}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowHotspotForm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: height * 0.9 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🎯 Mark Hotspot</Text>
              <TouchableOpacity onPress={() => setShowHotspotForm(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={hotspotFormData.name}
                  onChangeText={(text) => setHotspotFormData(prev => ({ ...prev, name: text }))}
                  placeholder="Enter hotspot name"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Category</Text>
                <ScrollView horizontal style={styles.categoryScroll} showsHorizontalScrollIndicator={false}>
                  {Object.entries(HOTSPOT_CATEGORIES).map(([key, config]) => (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.categoryChip,
                        hotspotFormData.category === key && styles.categoryChipActive
                      ]}
                      onPress={() => setHotspotFormData(prev => ({ ...prev, category: key as any }))}
                    >
                      <Text style={styles.categoryChipIcon}>{config.icon}</Text>
                      <Text style={[
                        styles.categoryChipText,
                        hotspotFormData.category === key && styles.categoryChipTextActive
                      ]}>
                        {config.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.formGroup}>
                <View style={styles.formLabelRow}>
                  <Text style={styles.formLabel}>Radius</Text>
                  <Text style={styles.formLabelValue}>{(hotspotFormData.radius / 1000).toFixed(1)} km</Text>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={50}
                  step={0.5}
                  value={hotspotFormData.radius / 1000}
                  onValueChange={(value: number) => setHotspotFormData(prev => ({ ...prev, radius: value * 1000 }))}
                  minimumTrackTintColor="#3b82f6"
                  maximumTrackTintColor="#e5e7eb"
                  thumbTintColor="#3b82f6"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Severity</Text>
                <View style={styles.severityRow}>
                  {(['low', 'medium', 'high', 'critical'] as const).map(severity => (
                    <TouchableOpacity
                      key={severity}
                      style={[
                        styles.severityChip,
                        hotspotFormData.severity === severity && styles.severityChipActive,
                        { borderColor: getZoneColor(severity) }
                      ]}
                      onPress={() => setHotspotFormData(prev => ({ ...prev, severity }))}
                    >
                      <Text style={[
                        styles.severityChipText,
                        { color: getZoneColor(severity) },
                        hotspotFormData.severity === severity && styles.severityChipTextActive
                      ]}>
                        {severity}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Description (Optional)</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={hotspotFormData.description}
                  onChangeText={(text) => setHotspotFormData(prev => ({ ...prev, description: text }))}
                  placeholder="Add description..."
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.locationBox}>
                <MapPin size={16} color="#6b7280" />
                <Text style={styles.locationBoxText}>
                  {pendingHotspot?.latitude.toFixed(4)}°, {pendingHotspot?.longitude.toFixed(4)}°
                </Text>
              </View>
            </ScrollView>

            <View style={styles.formActions}>
              <TouchableOpacity 
                style={[styles.formBtn, styles.formBtnSecondary]}
                onPress={() => {
                  setShowHotspotForm(false);
                  setPendingHotspot(null);
                }}
              >
                <Text style={styles.formBtnSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.formBtn, 
                  styles.formBtnPrimary,
                  !hotspotFormData.name.trim() && styles.formBtnDisabled
                ]}
                onPress={saveHotspot}
                disabled={!hotspotFormData.name.trim()}
              >
                <Save size={16} color="#fff" />
                <Text style={styles.formBtnPrimaryText}>Save Hotspot</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  mapContainer: {
    flex: 1,
  },
  mapView: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  
  // Native vessel marker styles
  vesselMarker: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 6,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#3b82f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  vesselHeading: {
    position: 'absolute',
    top: -12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingArrow: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  vesselIcon: {
    fontSize: 22,
  },
  
  // Native hotspot marker styles
  hotspotMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  hotspotMarkerCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hotspotIcon: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  
  // Web fallback styles
  mockMap: {
    flex: 1,
    backgroundColor: '#e0f2fe',
  },
  markingMode: {
    borderWidth: 4,
    borderColor: '#3b82f6',
  },
  mockOcean: {
    flex: 1,
    backgroundColor: '#87CEEB',
    position: 'relative',
  },
  routeContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
  routeLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#3b82f6',
    opacity: 0.6,
  },
  mockZone: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    marginLeft: -30,
    marginTop: -30,
  },
  mockVessel: {
    position: 'absolute',
    alignItems: 'center',
    marginLeft: -20,
    marginTop: -20,
  },
  
  // Top bar styles
  topBar: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },
  statPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 20,
    gap: 4,
  },
  statText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1f2937',
  },
  
  // Alert styles
  alertsTop: {
    position: 'absolute',
    top: 110,
    left: 16,
    right: 16,
    gap: 8,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f59e0b',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  alertCardText: {
    flex: 1,
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Map controls
  mapControls: {
    position: 'absolute',
    top: 110,
    right: 16,
    gap: 8,
  },
  mapControlButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Bottom sheet styles
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  sheetHandle: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    marginBottom: 12,
  },
  quickStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quickStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quickStatText: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  quickStatDivider: {
    fontSize: 13,
    color: '#d1d5db',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusActive: {
    backgroundColor: '#10b981',
  },
  statusInactive: {
    backgroundColor: '#6b7280',
  },
  
  // Tab bar styles
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    position: 'relative',
  },
  tabActive: {
    borderBottomColor: '#3b82f6',
  },
  tabText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 8,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  
  // Sheet content
  sheetContent: {
    flex: 1,
  },
  controlsTab: {
    padding: 16,
  },
  controlSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  simulationPanel: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
  },
  simControlRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  simBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 10,
  },
  simBtnActive: {
    backgroundColor: '#10b981',
  },
  simBtnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  speedControlSection: {
    gap: 8,
  },
  speedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  speedLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  speedValue: {
    fontSize: 15,
    color: '#1f2937',
    fontWeight: '700',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  speedPresets: {
    flexDirection: 'row',
    gap: 8,
  },
  speedPreset: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  speedPresetActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  speedPresetText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  speedPresetTextActive: {
    color: 'white',
  },
  
  // Action buttons
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#eff6ff',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  actionButtonActive: {
    backgroundColor: '#3b82f6',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
  actionButtonTextActive: {
    color: 'white',
  },
  
  // Toggle styles
  toggleGroup: {
    gap: 12,
  },
  toggleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 14,
    borderRadius: 10,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  toggleLabel: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
  },
  toggleSwitch: {
    width: 48,
    height: 28,
    backgroundColor: '#d1d5db',
    borderRadius: 14,
    padding: 2,
  },
  toggleSwitchActive: {
    backgroundColor: '#3b82f6',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  toggleThumbActive: {
    transform: [{ translateX: 20 }],
  },
  
  // List tab styles
  listTab: {
    padding: 16,
    gap: 12,
  },
  listCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  listCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  listCardIcon: {
    fontSize: 28,
  },
  listCardInfo: {
    flex: 1,
  },
  listCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 2,
  },
  listCardSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPillText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  listCardDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
  },
  severityPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityPillText: {
    fontSize: 9,
    color: 'white',
    fontWeight: '700',
  },
  zoneDescription: {
    fontSize: 12,
    color: '#4b5563',
    lineHeight: 18,
  },
  
  // Empty state
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 16,
    marginBottom: 20,
  },
  emptyStateButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  emptyStateButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  
  // Hotspot styles
  hotspotEmoji: {
    fontSize: 24,
  },
  hotspotDesc: {
    fontSize: 12,
    color: '#4b5563',
    lineHeight: 18,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: height * 0.85,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  vesselIconBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    paddingVertical: 24,
    borderRadius: 16,
    marginBottom: 20,
  },
  vesselIconXL: {
    fontSize: 64,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  infoItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 10,
  },
  infoLabel: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: '#1f2937',
    fontWeight: '700',
  },
  infoSection: {
    marginBottom: 16,
  },
  infoSectionTitle: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  infoSectionValue: {
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 20,
  },
  severityBadgeLarge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 8,
  },
  severityBadgeText: {
    fontSize: 11,
    color: 'white',
    fontWeight: '700',
  },
  
  // Form styles
  formScroll: {
    maxHeight: height * 0.6,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  formLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  formLabelValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3b82f6',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 14,
    fontSize: 14,
    color: '#1f2937',
    backgroundColor: '#f9fafb',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  categoryChipActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  categoryChipIcon: {
    fontSize: 16,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  categoryChipTextActive: {
    color: '#3b82f6',
  },
  severityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  severityChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  severityChipActive: {
    backgroundColor: '#f9fafb',
  },
  severityChipText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  severityChipTextActive: {
    fontWeight: '700',
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  locationBoxText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  formBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formBtnSecondary: {
    backgroundColor: '#f3f4f6',
  },
  formBtnSecondaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6b7280',
  },
  formBtnPrimary: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    gap: 8,
  },
  formBtnPrimaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
  },
  formBtnDisabled: {
    backgroundColor: '#d1d5db',
    opacity: 0.6,
  },
});

export default ShipMap;