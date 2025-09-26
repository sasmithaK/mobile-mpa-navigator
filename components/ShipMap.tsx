import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Platform
} from 'react-native';
import { 
  ZoomIn, 
  ZoomOut, 
  Home,
  Eye,
  EyeOff,
  Settings,
  Bell,
  X
} from 'lucide-react-native';
import MapComponent from './MapComponent'; // Adjust path as needed

const { width, height } = Dimensions.get('window');

// Type definitions
interface Vessel {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  destination: string;
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
  const [showVesselInfo, setShowVesselInfo] = useState<boolean>(false);

  // Initialize vessels and zones
  useEffect(() => {
    initializeVessels();
    initializeSensitiveZones();
  }, []);

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
        destination: 'New York'
      },
      {
        id: '2',
        name: 'Pacific Voyager',
        type: 'tanker',
        latitude: 35.6,
        longitude: 139.7,
        speed: 11.8,
        heading: 45,
        destination: 'San Francisco'
      },
      {
        id: '3',
        name: 'Mediterranean Star',
        type: 'cruise',
        latitude: 41.9,
        longitude: 12.5,
        speed: 18.5,
        heading: 120,
        destination: 'Dubai'
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
        severity: 'high'
      },
      {
        id: '2',
        name: 'Monterey Bay',
        latitude: 36.25,
        longitude: -121.75,
        radius: 75000,
        severity: 'medium'
      }
    ];
    setSensitiveZones(zones);
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

  const addAlert = () => {
    const newAlert: Alert = {
      id: Date.now().toString(),
      message: 'Vessel approaching protected zone',
      severity: 'warning'
    };
    setAlerts(prev => [newAlert, ...prev.slice(0, 3)]);
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return (
    <View style={styles.container}>
      {/* Use the platform-specific MapComponent */}
      <MapComponent
        region={region}
        vessels={vessels}
        sensitiveZones={sensitiveZones}
        zonesVisible={zonesVisible}
        onVesselPress={handleVesselPress}
        onRegionChange={setRegion}
        getShipIcon={getShipIcon}
        getZoneColor={getZoneColor}
      />

      {/* Controls - Only show zoom controls on native platforms */}
      {showControls && Platform.OS !== 'web' && (
        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={() => setRegion({
              ...region,
              latitudeDelta: region.latitudeDelta / 2,
              longitudeDelta: region.longitudeDelta / 2,
            })}
          >
            <ZoomIn size={20} color="#333" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={() => setRegion({
              ...region,
              latitudeDelta: region.latitudeDelta * 2,
              longitudeDelta: region.longitudeDelta * 2,
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

      {/* Toggle Controls and Zones Visibility */}
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
                <Text>Type: {selectedVessel.type}</Text>
                <Text>Speed: {selectedVessel.speed} knots</Text>
                <Text>Destination: {selectedVessel.destination}</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
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
  },
  alertText: {
    flex: 1,
    color: 'white',
    marginLeft: 8,
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  closeButton: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ShipMap;