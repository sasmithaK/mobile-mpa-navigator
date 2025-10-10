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
} from 'react-native';

// Import Slider from community package
import Slider from '@react-native-community/slider';

// Import MapComponent
import MapComponent from './MapComponent';

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
  Zap
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
  const [showControls, setShowControls] = useState<boolean>(true);
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
  const [showHotspotList, setShowHotspotList] = useState<boolean>(false);
  const [hotspotFormData, setHotspotFormData] = useState({
    name: '',
    description: '',
    category: 'INCIDENT' as keyof typeof HOTSPOT_CATEGORIES,
    severity: 'medium' as 'critical' | 'high' | 'medium' | 'low',
    radius: 5000
  });
  
  const [showVesselList, setShowVesselList] = useState<boolean>(false);
  const [showZoneList, setShowZoneList] = useState<boolean>(false);
  
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
    if (Platform.OS !== 'web') {
      setRegion({
        ...region,
        latitude: vessel.latitude,
        longitude: vessel.longitude,
        latitudeDelta: 10,
        longitudeDelta: 10,
      });
    }
  };

  const handleZonePress = (zone: SensitiveZone) => {
    setSelectedZone(zone);
    setShowZoneInfo(true);
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
      return [newAlert, ...prev.slice(0, 4)];
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

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Compass size={16} color="#3b82f6" />
          <Text style={styles.statValue}>{stats.totalDistance.toFixed(0)} nm</Text>
          <Text style={styles.statLabel}>Tracked</Text>
        </View>
        <View style={styles.statItem}>
          <Navigation size={16} color="#3b82f6" />
          <Text style={styles.statValue}>{stats.activeRoutes}</Text>
          <Text style={styles.statLabel}>Routes</Text>
        </View>
        <View style={styles.statItem}>
          <Zap size={16} color="#3b82f6" />
          <Text style={styles.statValue}>{stats.avgSpeed.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Avg Speed</Text>
        </View>
        <View style={styles.statItem}>
          <Shield size={16} color="#3b82f6" />
          <Text style={styles.statValue}>{stats.monitoredZones}</Text>
          <Text style={styles.statLabel}>Zones</Text>
        </View>
      </View>

      <View style={styles.simulationControls}>
        <TouchableOpacity 
          style={[styles.simButton, simulationActive && styles.simButtonActive]}
          onPress={() => setSimulationActive(!simulationActive)}
        >
          {simulationActive ? <Pause size={20} color="#fff" /> : <Play size={20} color="#fff" />}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.simButton}
          onPress={resetSimulation}
        >
          <RotateCcw size={20} color="#fff" />
        </TouchableOpacity>

        <View style={styles.speedControl}>
          <Text style={styles.speedText}>Speed</Text>
          <View style={styles.speedButtons}>
            <TouchableOpacity 
              style={styles.speedButton}
              onPress={() => setSimulationSpeed(prev => Math.max(0.01, prev - 0.05))}
            >
              <Text style={styles.speedButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.speedDisplay}>{simulationSpeed.toFixed(2)}x</Text>
            <TouchableOpacity 
              style={styles.speedButton}
              onPress={() => setSimulationSpeed(prev => Math.min(2, prev + 0.05))}
            >
              <Text style={styles.speedButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statusIndicator}>
          <View style={[styles.statusDot, simulationActive ? styles.statusActive : styles.statusInactive]} />
          <Text style={styles.statusText}>
            {simulationActive ? 'Running' : 'Paused'}
          </Text>
        </View>
      </View>

      <View style={styles.hotspotControls}>
        <TouchableOpacity 
          style={[styles.hotspotButton, isMarkingMode && styles.hotspotButtonActive]}
          onPress={startHotspotMarking}
        >
          <Target size={20} color={isMarkingMode ? "#fff" : "#333"} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.hotspotButton}
          onPress={() => setShowHotspots(!showHotspots)}
        >
          {showHotspots ? <Eye size={20} color="#333" /> : <EyeOff size={20} color="#333" />}
        </TouchableOpacity>

        {hotspots.length > 0 && (
          <TouchableOpacity 
            style={styles.hotspotButton}
            onPress={() => setShowHotspotList(!showHotspotList)}
          >
            <Text style={styles.hotspotCount}>{hotspots.length}</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={showHotspotList}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowHotspotList(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { maxHeight: '80%' }]}>
            <Text style={styles.modalTitle}>📌 Marked Hotspots</Text>
            <ScrollView style={styles.hotspotList}>
              {hotspots.map(hotspot => (
                <View key={hotspot.id} style={[
                  styles.hotspotItem,
                  { borderLeftColor: HOTSPOT_CATEGORIES[hotspot.category].color }
                ]}>
                  <View style={styles.hotspotHeader}>
                    <Text style={styles.hotspotName}>
                      {HOTSPOT_CATEGORIES[hotspot.category].icon} {hotspot.name}
                    </Text>
                    <TouchableOpacity onPress={() => deleteHotspot(hotspot.id)}>
                      <Trash2 size={16} color="#dc3545" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.hotspotDescription}>
                    {hotspot.description || 'No description'}
                  </Text>
                  <View style={styles.hotspotDetails}>
                    <Text style={styles.hotspotDetail}>
                      {HOTSPOT_CATEGORIES[hotspot.category].name}
                    </Text>
                    <Text style={[styles.hotspotDetail, { color: getZoneColor(hotspot.severity) }]}>
                      {hotspot.severity}
                    </Text>
                    <Text style={styles.hotspotDetail}>
                      {(hotspot.radius / 1000).toFixed(1)} km
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowHotspotList(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {showControls && Platform.OS !== 'web' && (
        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={() => setRegion({
              ...region,
              latitudeDelta: Math.max(1, region.latitudeDelta / 1.5),
              longitudeDelta: Math.max(1, region.longitudeDelta / 1.5),
            })}
          >
            <ZoomIn size={20} color="#333" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={() => setRegion({
              ...region,
              latitudeDelta: Math.min(100, region.latitudeDelta * 1.5),
              longitudeDelta: Math.min(100, region.longitudeDelta * 1.5),
            })}
          >
            <ZoomOut size={20} color="#333" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={() => setRegion({
              latitude: 20,
              longitude: 0,
              latitudeDelta: 50,
              longitudeDelta: 50,
            })}
          >
            <Home size={20} color="#333" />
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity 
        style={styles.toggleControls}
        onPress={() => setShowControls(!showControls)}
      >
        <Settings size={20} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.toggleZones}
        onPress={() => setZonesVisible(!zonesVisible)}
      >
        {zonesVisible ? <Eye size={20} color="#333" /> : <EyeOff size={20} color="#333" />}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.vesselListToggle}
        onPress={() => setShowVesselList(!showVesselList)}
      >
        <Navigation size={20} color="#333" />
        <Text style={styles.vesselListText}>{vessels.length}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.zoneListToggle}
        onPress={() => setShowZoneList(!showZoneList)}
      >
        <Shield size={20} color="#333" />
        <Text style={styles.zoneListText}>{sensitiveZones.length}</Text>
      </TouchableOpacity>

      <Modal
        visible={showVesselList}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowVesselList(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { maxHeight: '80%' }]}>
            <Text style={styles.modalTitle}>🚢 Active Vessels</Text>
            <ScrollView style={styles.vesselList}>
              {vessels.map(vessel => (
                <TouchableOpacity
                  key={vessel.id}
                  style={styles.vesselListItem}
                  onPress={() => {
                    setSelectedVessel(vessel);
                    setShowVesselList(false);
                    setShowVesselInfo(true);
                  }}
                >
                  <View style={styles.vesselListHeader}>
                    <Text style={styles.vesselListIcon}>{getShipIcon(vessel.type)}</Text>
                    <Text style={styles.vesselListName}>{vessel.name}</Text>
                  </View>
                  <Text style={styles.vesselListDetails}>
                    {vessel.type} • {vessel.speed} kn • {vessel.destination}
                  </Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: vessel.status === 'underway' ? '#10b981' : '#6b7280' }
                  ]}>
                    <Text style={styles.statusBadgeText}>
                      {vessel.status}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowVesselList(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showZoneList}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowZoneList(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { maxHeight: '80%' }]}>
            <Text style={styles.modalTitle}>🛡️ Protected Areas</Text>
            <ScrollView style={styles.zoneList}>
              {sensitiveZones.map(zone => (
                <TouchableOpacity
                  key={zone.id}
                  style={[
                    styles.zoneListItem,
                    { borderLeftColor: getZoneColor(zone.severity) }
                  ]}
                  onPress={() => {
                    setSelectedZone(zone);
                    setShowZoneList(false);
                    setShowZoneInfo(true);
                  }}
                >
                  <Text style={styles.zoneListName}>{zone.name}</Text>
                  <Text style={styles.zoneListDetails}>
                    {zone.type.replace(/_/g, ' ')} • {(zone.radius / 1000).toFixed(0)} km
                  </Text>
                  <View style={[
                    styles.severityBadge,
                    { backgroundColor: getZoneColor(zone.severity) }
                  ]}>
                    <Text style={styles.severityBadgeText}>
                      {zone.severity.toUpperCase()}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowZoneList(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.alertsContainer}>
        {alerts.map(alert => (
          <View key={alert.id} style={styles.alert}>
            <Bell size={16} color="#fff" />
            <Text style={styles.alertText}>{alert.message}</Text>
            <TouchableOpacity onPress={() => removeAlert(alert.id)}>
              <X size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Modal
        visible={showVesselInfo}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowVesselInfo(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedVessel && (
              <>
                <Text style={styles.modalTitle}>{selectedVessel.name}</Text>
                <View style={styles.vesselIconContainer}>
                  <Text style={styles.vesselIconLarge}>{getShipIcon(selectedVessel.type)}</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Type:</Text>
                  <Text style={styles.modalValue}>{selectedVessel.type}</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Speed:</Text>
                  <Text style={styles.modalValue}>{selectedVessel.speed} knots</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Heading:</Text>
                  <Text style={styles.modalValue}>{Math.round(selectedVessel.heading)}°</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Destination:</Text>
                  <Text style={styles.modalValue}>{selectedVessel.destination}</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Position:</Text>
                  <Text style={styles.modalValue}>
                    {selectedVessel.latitude.toFixed(4)}°, {selectedVessel.longitude.toFixed(4)}°
                  </Text>
                </View>
                {selectedVessel.route && (
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Waypoint:</Text>
                    <Text style={styles.modalValue}>
                      {(selectedVessel.currentRouteIndex || 0) + 1}/{selectedVessel.route.length}
                    </Text>
                  </View>
                )}
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Status:</Text>
                  <Text style={[styles.modalValue, simulationActive && styles.statusUnderway]}>
                    {simulationActive ? 'Underway' : 'Stopped'}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowVesselInfo(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
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
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedZone && (
              <>
                <Text style={styles.modalTitle}>🛡️ {selectedZone.name}</Text>
                <View style={[styles.zoneSeverityBadge, { backgroundColor: getZoneColor(selectedZone.severity) }]}>
                  <Text style={styles.zoneSeverityText}>
                    {selectedZone.severity.toUpperCase()} PRIORITY
                  </Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Type:</Text>
                  <Text style={styles.modalValue}>{selectedZone.type.replace(/_/g, ' ').toUpperCase()}</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Severity Level:</Text>
                  <Text style={[styles.modalValue, { color: getZoneColor(selectedZone.severity), fontWeight: 'bold' }]}>
                    {selectedZone.severity.charAt(0).toUpperCase() + selectedZone.severity.slice(1)}
                  </Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Protection Radius:</Text>
                  <Text style={styles.modalValue}>{(selectedZone.radius / 1000).toFixed(1)} km</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Location:</Text>
                  <Text style={styles.modalValue}>
                    {selectedZone.latitude.toFixed(4)}°, {selectedZone.longitude.toFixed(4)}°
                  </Text>
                </View>
                <View style={styles.zoneDescription}>
                  <Text style={styles.zoneDescriptionTitle}>📋 Description:</Text>
                  <Text style={styles.zoneDescriptionText}>{selectedZone.description}</Text>
                </View>
                <View style={styles.zoneDescription}>
                  <Text style={styles.zoneDescriptionTitle}>⚠️ Restrictions:</Text>
                  <Text style={styles.zoneDescriptionText}>{selectedZone.restrictions}</Text>
                </View>
                <View style={styles.zoneDescription}>
                  <Text style={styles.zoneDescriptionTitle}>🏛️ Authority:</Text>
                  <Text style={styles.zoneDescriptionText}>{selectedZone.authority}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowZoneInfo(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
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
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { maxHeight: '90%' }]}>
            <Text style={styles.modalTitle}>🎯 Mark Hotspot</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Name *</Text>
              <TextInput
                style={styles.textInput}
                value={hotspotFormData.name}
                onChangeText={(text) => setHotspotFormData(prev => ({ ...prev, name: text }))}
                placeholder="Enter hotspot name"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Category</Text>
              <ScrollView horizontal style={styles.categoryScroll} showsHorizontalScrollIndicator={false}>
                {Object.entries(HOTSPOT_CATEGORIES).map(([key, config]) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.categoryButton,
                      hotspotFormData.category === key && styles.categoryButtonActive
                    ]}
                    onPress={() => setHotspotFormData(prev => ({ ...prev, category: key as any }))}
                  >
                    <Text style={styles.categoryIcon}>{config.icon}</Text>
                    <Text style={[
                      styles.categoryName,
                      hotspotFormData.category === key && styles.categoryNameActive
                    ]}>
                      {config.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Radius: {(hotspotFormData.radius / 1000).toFixed(1)} km</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={50}
                step={0.5}
                value={hotspotFormData.radius / 1000}
                onValueChange={(value: number) => setHotspotFormData(prev => ({ ...prev, radius: value * 1000 }))}
                minimumTrackTintColor="#007bff"
                maximumTrackTintColor="#ddd"
                thumbTintColor="#007bff"
              />
              <View style={styles.radiusPresets}>
                {[1, 5, 10, 25].map(preset => (
                  <TouchableOpacity
                    key={preset}
                    style={[
                      styles.radiusPreset,
                      Math.abs(hotspotFormData.radius/1000 - preset) < 0.1 && styles.radiusPresetActive
                    ]}
                    onPress={() => setHotspotFormData(prev => ({ ...prev, radius: preset * 1000 }))}
                  >
                    <Text style={[
                      styles.radiusPresetText,
                      Math.abs(hotspotFormData.radius/1000 - preset) < 0.1 && styles.radiusPresetTextActive
                    ]}>
                      {preset}km
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Severity</Text>
              <View style={styles.severityButtons}>
                {(['low', 'medium', 'high', 'critical'] as const).map(severity => (
                  <TouchableOpacity
                    key={severity}
                    style={[
                      styles.severityButton,
                      hotspotFormData.severity === severity && styles.severityButtonActive,
                      { borderColor: getZoneColor(severity) }
                    ]}
                    onPress={() => setHotspotFormData(prev => ({ ...prev, severity }))}
                  >
                    <Text style={[
                      styles.severityText,
                      { color: getZoneColor(severity) },
                      hotspotFormData.severity === severity && styles.severityTextActive
                    ]}>
                      {severity}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Description</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={hotspotFormData.description}
                onChangeText={(text) => setHotspotFormData(prev => ({ ...prev, description: text }))}
                placeholder="Optional description..."
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.locationInfo}>
              <Text style={styles.locationText}>
                📍 Location: {pendingHotspot?.latitude.toFixed(4)}°, {pendingHotspot?.longitude.toFixed(4)}°
              </Text>
              <Text style={styles.locationText}>
                📏 Area Radius: {(hotspotFormData.radius / 1000).toFixed(1)} km
              </Text>
            </View>

            <View style={styles.formButtons}>
              <TouchableOpacity 
                style={[styles.formButton, styles.cancelButton]}
                onPress={() => {
                  setShowHotspotForm(false);
                  setPendingHotspot(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.formButton, styles.saveButton, !hotspotFormData.name.trim() && styles.saveButtonDisabled]}
                onPress={saveHotspot}
                disabled={!hotspotFormData.name.trim()}
              >
                <Save size={16} color="#fff" />
                <Text style={styles.saveButtonText}>Save Hotspot</Text>
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
    position: 'relative',
    backgroundColor: '#f8f9fa',
  },
  statsContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 2,
  },
  simulationControls: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    backgroundColor: 'rgba(59, 130, 246, 0.95)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  simButton: {
    width: 44,
    height: 44,
    backgroundColor: '#2563eb',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  simButtonActive: {
    backgroundColor: '#10b981',
  },
  speedControl: {
    flex: 1,
    marginRight: 12,
  },
  speedText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  speedButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  speedButton: {
    backgroundColor: '#2563eb',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  speedDisplay: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    minWidth: 35,
    textAlign: 'center',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusActive: {
    backgroundColor: '#10b981',
  },
  statusInactive: {
    backgroundColor: '#6b7280',
  },
  statusText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  hotspotControls: {
    position: 'absolute',
    bottom: 90,
    right: 16,
    flexDirection: 'column',
    gap: 8,
  },
  hotspotButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  hotspotButtonActive: {
    backgroundColor: '#007bff',
  },
  hotspotCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryButton: {
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  categoryButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  categoryNameActive: {
    color: 'white',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  radiusPresets: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  radiusPreset: {
    padding: 6,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#dee2e6',
    minWidth: 50,
    alignItems: 'center',
  },
  radiusPresetActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  radiusPresetText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333',
  },
  radiusPresetTextActive: {
    color: 'white',
  },
  severityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  severityButton: {
    flex: 1,
    padding: 8,
    borderWidth: 2,
    borderRadius: 6,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  severityButtonActive: {
    backgroundColor: '#f8f9fa',
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  severityTextActive: {
    fontWeight: 'bold',
  },
  locationInfo: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  formButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  saveButton: {
    backgroundColor: '#28a745',
  },
  saveButtonDisabled: {
    backgroundColor: '#6c757d',
    opacity: 0.6,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  hotspotList: {
    maxHeight: 300,
  },
  hotspotItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
  },
  hotspotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  hotspotName: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  hotspotDescription: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
  hotspotDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hotspotDetail: {
    fontSize: 10,
    color: '#495057',
    fontWeight: '500',
  },
  vesselListToggle: {
    position: 'absolute',
    top: 130,
    right: 16,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  vesselListText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
    color: '#333',
  },
  zoneListToggle: {
    position: 'absolute',
    top: 190,
    right: 16,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  zoneListText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
    color: '#333',
  },
  vesselList: {
    maxHeight: 400,
  },
  vesselListItem: {
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
    position: 'relative',
  },
  vesselListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  vesselListIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  vesselListName: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  vesselListDetails: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 8,
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  zoneList: {
    maxHeight: 400,
  },
  zoneListItem: {
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    position: 'relative',
  },
  zoneListName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  zoneListDetails: {
    fontSize: 12,
    color: '#6c757d',
  },
  severityBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  severityBadgeText: {
    fontSize: 8,
    color: 'white',
    fontWeight: 'bold',
  },
  controlsContainer: {
    position: 'absolute',
    right: 16,
    top: 250,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    padding: 8,
  },
  controlButton: {
    padding: 8,
    marginVertical: 4,
    backgroundColor: 'white',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleControls: {
    position: 'absolute',
    left: 16,
    top: 250,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleZones: {
    position: 'absolute',
    left: 16,
    top: 310,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  alertsContainer: {
    position: 'absolute',
    top: 250,
    left: 16,
    right: 16,
  },
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f59e0b',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  alertText: {
    flex: 1,
    color: 'white',
    marginLeft: 8,
    fontSize: 12,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    width: '85%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937',
    textAlign: 'center',
  },
  vesselIconContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 12,
  },
  vesselIconLarge: {
    fontSize: 48,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 4,
  },
  modalLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  modalValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
    marginLeft: 12,
  },
  statusUnderway: {
    color: '#10b981',
    fontWeight: '700',
  },
  closeButton: {
    backgroundColor: '#3b82f6',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  zoneSeverityBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
    alignSelf: 'center',
  },
  zoneSeverityText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1,
  },
  zoneDescription: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 8,
  },
  zoneDescriptionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 6,
  },
  zoneDescriptionText: {
    fontSize: 12,
    color: '#4b5563',
    lineHeight: 18,
  },
});

export default ShipMap;