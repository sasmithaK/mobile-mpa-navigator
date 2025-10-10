import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Platform,
} from 'react-native';
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
  RotateCcw
} from 'lucide-react-native';
import MapComponent from './MapComponent';

const { width, height } = Dimensions.get('window');

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
}

interface Alert {
  id: string;
  message: string;
  severity: string;
}

// Predefined shipping routes
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
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  
  const simulationIntervalRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(Date.now());

  // Initialize vessels and zones
  useEffect(() => {
    initializeVessels();
    initializeSensitiveZones();
  }, []);

  // Simulation effect
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
        name: 'Atlantic Explorer',
        type: 'cargo',
        latitude: 51.5,
        longitude: -0.12,
        speed: 14.2,
        heading: 245,
        destination: 'New York',
        route: SHIPPING_ROUTES.transatlantic,
        currentRouteIndex: 0
      },
      {
        id: '2',
        name: 'Pacific Voyager',
        type: 'tanker',
        latitude: 35.6,
        longitude: 139.7,
        speed: 11.8,
        heading: 45,
        destination: 'San Francisco',
        route: SHIPPING_ROUTES.transpacific,
        currentRouteIndex: 0
      },
      {
        id: '3',
        name: 'Mediterranean Star',
        type: 'cruise',
        latitude: 41.9,
        longitude: 12.5,
        speed: 18.5,
        heading: 120,
        destination: 'Dubai',
        route: SHIPPING_ROUTES.mediterranean,
        currentRouteIndex: 0
      },
      {
        id: '4',
        name: 'Arctic Pioneer',
        type: 'container',
        latitude: 60.0,
        longitude: 10.0,
        speed: 16.0,
        heading: 315,
        destination: 'Rotterdam',
        route: [
          { latitude: 60.0, longitude: 10.0, name: 'Oslo' },
          { latitude: 58.0, longitude: 5.0 },
          { latitude: 56.0, longitude: 0.0 },
          { latitude: 54.0, longitude: -5.0 },
          { latitude: 52.0, longitude: -10.0 },
          { latitude: 51.9, longitude: 4.5, name: 'Rotterdam' }
        ],
        currentRouteIndex: 0
      }
    ];
    setVessels(ships);
  };

  const initializeSensitiveZones = () => {
    const zones: SensitiveZone[] = [
      {
        id: '1',
        name: 'Great Barrier Reef',
        latitude: -16.0,
        longitude: 145.8,
        radius: 200000,
        severity: 'critical'
      },
      {
        id: '2',
        name: 'Monterey Bay',
        latitude: 36.25,
        longitude: -121.75,
        radius: 75000,
        severity: 'high'
      },
      {
        id: '3',
        name: 'Mediterranean Reserve',
        latitude: 35.0,
        longitude: 24.0,
        radius: 100000,
        severity: 'medium'
      },
      {
        id: '4',
        name: 'North Sea Protected Area',
        latitude: 55.0,
        longitude: 3.0,
        radius: 150000,
        severity: 'medium'
      }
    ];
    setSensitiveZones(zones);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
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
    
    // Check for zone proximity when changing waypoints
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
    
    // Calculate distance to target waypoint
    const distance = calculateDistance(
      vessel.latitude,
      vessel.longitude,
      targetPoint.latitude,
      targetPoint.longitude
    );
    
    // If very close to waypoint (within 1 km), move to next one
    if (distance < 1) {
      return moveVesselToNextWaypoint(vessel);
    }
    
    // FIXED: Much more realistic speed calculation
    const speedKmPerHour = vessel.speed * 1.852; // knots to km/h
    // Convert to km per millisecond and apply simulation speed
    // Dramatically reduced multiplier for realistic movement (0.01 instead of 0.1)
    const moveDistance = (speedKmPerHour / 3600000) * deltaTimeMs * simulationSpeed * 0.01;
    
    // If we would overshoot the target, move to next waypoint
    if (moveDistance >= distance) {
      return moveVesselToNextWaypoint(vessel);
    }
    
    // Interpolate position towards target
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
    
    // Update every 100ms for smooth animation
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

  return (
    <View style={styles.container}>
      <MapComponent
        region={region}
        vessels={vessels}
        sensitiveZones={sensitiveZones}
        zonesVisible={zonesVisible}
        onVesselPress={handleVesselPress}
        onZonePress={handleZonePress}
        onRegionChange={setRegion}
        getShipIcon={getShipIcon}
        getZoneColor={getZoneColor}
      />

      {/* Simulation Controls */}
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
              onPress={() => setSimulationSpeed(prev => Math.max(0.5, prev - 0.5))}
            >
              <Text style={styles.speedButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.speedDisplay}>{simulationSpeed.toFixed(1)}x</Text>
            <TouchableOpacity 
              style={styles.speedButton}
              onPress={() => setSimulationSpeed(prev => Math.min(10, prev + 0.5))}
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

      {/* Map Controls */}
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

      {/* Alerts */}
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

      {/* Vessel Info Modal */}
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

      {/* Zone Info Modal */}
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
                  <Text style={styles.modalValue}>Marine Protected Area</Text>
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
                  <Text style={styles.zoneDescriptionTitle}>⚠️ Restrictions:</Text>
                  <Text style={styles.zoneDescriptionText}>
                    {selectedZone.severity === 'critical' && 
                      'No vessel entry allowed. Critical marine ecosystem protection zone with severe penalties for violations.'}
                    {selectedZone.severity === 'high' && 
                      'Limited access with special permits only. High-priority conservation area with restricted activities.'}
                    {selectedZone.severity === 'medium' && 
                      'Restricted activities. Vessels must maintain minimum speed and avoid sensitive areas within zone.'}
                    {selectedZone.severity === 'low' && 
                      'Advisory zone. Vessels requested to exercise caution and follow environmental guidelines.'}
                  </Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
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
  controlsContainer: {
    position: 'absolute',
    right: 16,
    top: 16,
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
    top: 16,
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
    top: 70,
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
    top: 130,
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